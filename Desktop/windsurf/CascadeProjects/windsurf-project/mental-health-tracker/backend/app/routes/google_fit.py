from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.google_fit import GoogleFitService
from app.models import User, db

google_fit_bp = Blueprint('google_fit', __name__)
google_fit_service = GoogleFitService()

@google_fit_bp.route('/auth-url', methods=['GET'])
@jwt_required()
def get_auth_url():
    auth_url = google_fit_service.get_authorization_url()
    return jsonify({'auth_url': auth_url})

@google_fit_bp.route('/callback', methods=['POST'])
@jwt_required()
def handle_callback():
    user_id = get_jwt_identity()
    code = request.json.get('code')
    
    if not code:
        return jsonify({'error': 'No authorization code provided'}), 400
        
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
        
    token = google_fit_service.get_token(code)
    user.google_fit_token = token
    db.session.commit()
    
    return jsonify({'message': 'Successfully connected to Google Fit'})

@google_fit_bp.route('/sync', methods=['POST'])
@jwt_required()
def sync_data():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user or not user.google_fit_token:
        return jsonify({'error': 'Not connected to Google Fit'}), 400
        
    fitness_data = google_fit_service.get_fitness_data(user.google_fit_token)
    return jsonify(fitness_data)

@google_fit_bp.route('/fitness-data', methods=['GET'])
@jwt_required()
def get_fitness_data():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user or not user.google_fit_token:
        return jsonify({'error': 'Not connected to Google Fit'}), 400
        
    fitness_data = google_fit_service.get_fitness_data(user.google_fit_token)
    return jsonify({'fitness_data': fitness_data})
