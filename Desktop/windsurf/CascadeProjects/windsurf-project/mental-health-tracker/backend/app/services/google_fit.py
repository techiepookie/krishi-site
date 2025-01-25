from google_auth_oauthlib.flow import Flow
from google.oauth2.credentials import Credentials
import google.auth.transport.requests
import requests
from app.config.google_fit import GOOGLE_FIT_CONFIG
import json

class GoogleFitService:
    def __init__(self):
        self.config = GOOGLE_FIT_CONFIG
        
    def get_authorization_url(self):
        flow = Flow.from_client_config(
            {
                'web': {
                    'client_id': self.config['client_id'],
                    'client_secret': self.config['client_secret'],
                    'auth_uri': 'https://accounts.google.com/o/oauth2/auth',
                    'token_uri': 'https://oauth2.googleapis.com/token',
                    'redirect_uri': self.config['redirect_uri']
                }
            },
            scopes=self.config['scopes']
        )
        auth_url, _ = flow.authorization_url(prompt='consent')
        return auth_url
        
    def get_token(self, code):
        flow = Flow.from_client_config(
            {
                'web': {
                    'client_id': self.config['client_id'],
                    'client_secret': self.config['client_secret'],
                    'auth_uri': 'https://accounts.google.com/o/oauth2/auth',
                    'token_uri': 'https://oauth2.googleapis.com/token',
                    'redirect_uri': self.config['redirect_uri']
                }
            },
            scopes=self.config['scopes']
        )
        flow.fetch_token(code=code)
        return json.dumps(flow.credentials.to_json())
        
    def get_fitness_data(self, token_json):
        credentials = Credentials.from_authorized_user_info(json.loads(token_json))
        
        # Refresh token if needed
        request = google.auth.transport.requests.Request()
        credentials.refresh(request)
        
        headers = {
            'Authorization': f'Bearer {credentials.token}',
            'Content-Type': 'application/json'
        }
        
        # Get steps data
        steps = self._get_steps(headers)
        heart_rate = self._get_heart_rate(headers)
        sleep_hours = self._get_sleep_hours(headers)
        active_minutes = self._get_active_minutes(headers)
        
        return {
            'steps': steps,
            'heart_rate': heart_rate,
            'sleep_hours': sleep_hours,
            'active_minutes': active_minutes
        }
        
    def _get_steps(self, headers):
        # Implement steps data retrieval
        return 8500  # Example value
        
    def _get_heart_rate(self, headers):
        # Implement heart rate data retrieval
        return 72  # Example value
        
    def _get_sleep_hours(self, headers):
        # Implement sleep data retrieval
        return 7.5  # Example value
        
    def _get_active_minutes(self, headers):
        # Implement active minutes retrieval
        return 45  # Example value
