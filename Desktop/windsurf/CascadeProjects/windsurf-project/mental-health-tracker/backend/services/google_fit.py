from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build
from datetime import datetime, timedelta
from models.google_fit import GoogleFitData
from database import db
import json
from config.google_fit import GOOGLE_FIT_CONFIG

class GoogleFitService:
    def __init__(self):
        self.client_id = GOOGLE_FIT_CONFIG['client_id']
        self.client_secret = GOOGLE_FIT_CONFIG['client_secret']
        self.redirect_uri = GOOGLE_FIT_CONFIG['redirect_uri']
        self.scopes = GOOGLE_FIT_CONFIG['scopes']

    def get_auth_url(self):
        flow = Flow.from_client_config(
            {
                "web": {
                    "client_id": self.client_id,
                    "client_secret": self.client_secret,
                    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                    "token_uri": "https://oauth2.googleapis.com/token",
                    "redirect_uris": [self.redirect_uri]
                }
            },
            scopes=self.scopes
        )
        flow.redirect_uri = self.redirect_uri
        authorization_url, state = flow.authorization_url(
            access_type='offline',
            include_granted_scopes='true'
        )
        return authorization_url, state

    def get_token(self, code):
        flow = Flow.from_client_config(
            {
                "web": {
                    "client_id": self.client_id,
                    "client_secret": self.client_secret,
                    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                    "token_uri": "https://oauth2.googleapis.com/token",
                    "redirect_uris": [self.redirect_uri]
                }
            },
            scopes=self.scopes
        )
        flow.redirect_uri = self.redirect_uri
        flow.fetch_token(code=code)
        return flow.credentials

    def store_credentials(self, user_id, credentials):
        """Store or update Google Fit credentials for a user"""
        google_fit_data = GoogleFitData.query.filter_by(user_id=user_id).first()
        
        if not google_fit_data:
            google_fit_data = GoogleFitData(user_id=user_id)
        
        google_fit_data.access_token = credentials.token
        google_fit_data.refresh_token = credentials.refresh_token
        google_fit_data.token_expiry = datetime.utcnow() + timedelta(seconds=credentials.expiry.second)
        
        db.session.add(google_fit_data)
        db.session.commit()
        
        return google_fit_data

    def sync_fitness_data(self, user_id):
        """Sync fitness data for a user"""
        google_fit_data = GoogleFitData.query.filter_by(user_id=user_id).first()
        if not google_fit_data:
            raise Exception("User not connected to Google Fit")

        credentials = Credentials(
            token=google_fit_data.access_token,
            refresh_token=google_fit_data.refresh_token,
            token_uri="https://oauth2.googleapis.com/token",
            client_id=self.client_id,
            client_secret=self.client_secret,
            scopes=self.scopes
        )

        fitness_data = self.get_fitness_data(credentials)
        
        # Update stored fitness data
        google_fit_data.steps = fitness_data['steps']
        google_fit_data.heart_rate = fitness_data['heart_rate']
        google_fit_data.sleep_hours = fitness_data['sleep_hours']
        google_fit_data.active_minutes = fitness_data['active_minutes']
        google_fit_data.last_sync = datetime.utcnow()
        
        db.session.commit()
        
        return fitness_data

    def get_fitness_data(self, credentials):
        fitness_service = build('fitness', 'v1', credentials=credentials)
        
        end_time = datetime.utcnow()
        start_time = end_time - timedelta(days=1)
        
        data_sources = {
            'steps': 'derived:com.google.step_count.delta:com.google.android.gms:estimated_steps',
            'heart_rate': 'derived:com.google.heart_rate.bpm:com.google.android.gms:merge_heart_rate_bpm',
            'sleep': 'derived:com.google.sleep.segment:com.google.android.gms:merged',
            'activity': 'derived:com.google.activity.segment:com.google.android.gms:merge_activity_segments'
        }
        
        body = {
            "aggregateBy": [
                {"dataTypeName": "com.google.step_count.delta"},
                {"dataTypeName": "com.google.heart_rate.bpm"},
                {"dataTypeName": "com.google.sleep.segment"},
                {"dataTypeName": "com.google.activity.segment"}
            ],
            "bucketByTime": {"durationMillis": 86400000},
            "startTimeMillis": int(start_time.timestamp() * 1000),
            "endTimeMillis": int(end_time.timestamp() * 1000)
        }

        response = fitness_service.users().dataset().aggregate(userId="me", body=body).execute()
        
        result = {
            'steps': 0,
            'heart_rate': 0,
            'sleep_hours': 0,
            'active_minutes': 0
        }

        for bucket in response.get('bucket', []):
            for dataset in bucket.get('dataset', []):
                points = dataset.get('point', [])
                for point in points:
                    if dataset['dataSourceId'] == data_sources['steps']:
                        result['steps'] += point['value'][0]['intVal']
                    elif dataset['dataSourceId'] == data_sources['heart_rate']:
                        result['heart_rate'] = round(point['value'][0]['fpVal'])
                    elif dataset['dataSourceId'] == data_sources['sleep']:
                        if point['value'][0]['intVal'] == 1:  # Sleep state
                            duration_ms = int(point['endTimeNanos']) // 1000000 - int(point['startTimeNanos']) // 1000000
                            result['sleep_hours'] += duration_ms / (1000 * 60 * 60)
                    elif dataset['dataSourceId'] == data_sources['activity']:
                        if point['value'][0]['intVal'] in [7, 8, 9, 10]:  # Active states
                            duration_ms = int(point['endTimeNanos']) // 1000000 - int(point['startTimeNanos']) // 1000000
                            result['active_minutes'] += duration_ms / (1000 * 60)

        result['sleep_hours'] = round(result['sleep_hours'], 1)
        result['active_minutes'] = round(result['active_minutes'])
        
        return result
