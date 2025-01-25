from flask import Blueprint, jsonify, request, session
from services.google_fit import GoogleFitService
from middleware.auth import token_required

google_fit = Blueprint('google_fit', __name__)
google_fit_service = GoogleFitService()

@google_fit.route('/auth-url', methods=['GET'])
@token_required
def get_auth_url(current_user):
    try:
        auth_url, state = google_fit_service.get_auth_url()
        session['google_fit_state'] = state
        return jsonify({'auth_url': auth_url})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@google_fit.route('/callback', methods=['POST'])
@token_required
def callback(current_user):
    try:
        code = request.json.get('code')
        if not code:
            return jsonify({'error': 'Authorization code is required'}), 400

        # Get credentials
        credentials = google_fit_service.get_token(code)
        
        # Store credentials
        google_fit_service.store_credentials(current_user.id, credentials)
        
        # Initial sync
        fitness_data = google_fit_service.sync_fitness_data(current_user.id)
        
        return jsonify({
            'message': 'Successfully connected to Google Fit',
            'fitness_data': fitness_data
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@google_fit.route('/sync', methods=['POST'])
@token_required
def sync_data(current_user):
    try:
        fitness_data = google_fit_service.sync_fitness_data(current_user.id)
        return jsonify(fitness_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@google_fit.route('/fitness-data', methods=['GET'])
@token_required
def get_fitness_data(current_user):
    try:
        from models.google_fit import GoogleFitData
        google_fit_data = GoogleFitData.query.filter_by(user_id=current_user.id).first()
        
        if not google_fit_data:
            return jsonify({'error': 'User not connected to Google Fit'}), 404
            
        return jsonify(google_fit_data.to_dict())
    except Exception as e:
        return jsonify({'error': str(e)}), 500
