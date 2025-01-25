from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from datetime import datetime, timedelta
from ..models import db, HealthData, User

health_bp = Blueprint('health', __name__)

@health_bp.route('/api/health/connect', methods=['POST'])
@jwt_required()
def connect_google_fit():
    try:
        token = request.json.get('token')
        if not token:
            return jsonify({'error': 'No token provided'}), 400

        # Create Google Fit API client
        credentials = Credentials(token)
        fitness_service = build('fitness', 'v1', credentials=credentials)

        # Test the connection by fetching some data
        end_time = datetime.utcnow()
        start_time = end_time - timedelta(days=1)
        
        # Convert time to nanoseconds
        end_nanos = int(end_time.timestamp() * 1000000000)
        start_nanos = int(start_time.timestamp() * 1000000000)

        # Get step count
        steps_datasource = (
            fitness_service.users().dataSources()
            .get(userId='me', dataSourceId='derived:com.google.step_count.delta:com.google.android.gms:estimated_steps')
            .execute()
        )

        return jsonify({
            'message': 'Successfully connected to Google Fit',
            'datasource': steps_datasource
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@health_bp.route('/api/health/data', methods=['GET'])
@jwt_required()
def get_health_data():
    try:
        user_id = get_jwt_identity()
        
        # Get the latest health data for the user
        health_data = HealthData.query.filter_by(user_id=user_id).order_by(HealthData.recorded_at.desc()).first()
        
        if not health_data:
            # Return default values if no data exists
            return jsonify({
                'steps': 0,
                'sleep': 0,
                'heartRate': 0,
                'activityScore': 0,
                'connected': False
            })
        
        return jsonify({
            'steps': health_data.steps,
            'sleep': health_data.sleep_hours,
            'heartRate': health_data.heart_rate,
            'activityScore': health_data.activity_score,
            'connected': True,
            'lastUpdated': health_data.recorded_at.isoformat()
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@health_bp.route('/api/health/sync', methods=['POST'])
@jwt_required()
def sync_health_data():
    try:
        user_id = get_jwt_identity()
        data = request.json
        
        # Create new health data entry
        health_data = HealthData(
            user_id=user_id,
            steps=data.get('steps', 0),
            sleep_hours=data.get('sleep', 0),
            heart_rate=data.get('heartRate', 0),
            activity_score=data.get('activityScore', 0),
            source=data.get('source', 'google_fit')
        )
        
        db.session.add(health_data)
        db.session.commit()
        
        return jsonify({
            'message': 'Health data synced successfully',
            'data': {
                'steps': health_data.steps,
                'sleep': health_data.sleep_hours,
                'heartRate': health_data.heart_rate,
                'activityScore': health_data.activity_score,
                'recordedAt': health_data.recorded_at.isoformat()
            }
        })

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
