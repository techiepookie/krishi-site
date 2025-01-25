from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from werkzeug.security import generate_password_hash, check_password_hash
import json
import os
from flask_cors import CORS

auth_bp = Blueprint('auth', __name__)
CORS(auth_bp)

USERS_FILE = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data', 'users.json')

def load_users():
    if not os.path.exists(USERS_FILE):
        return {'users': []}
    with open(USERS_FILE, 'r') as f:
        return json.load(f)

def save_users(users_data):
    with open(USERS_FILE, 'w') as f:
        json.dump(users_data, f, indent=4)

@auth_bp.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()

        # Load existing users
        users_data = load_users()
        
        # Check if user already exists
        if any(user['email'] == data['email'] for user in users_data['users']):
            return jsonify({'error': 'Email already registered'}), 400

        # Get the next user ID
        next_id = len(users_data['users']) + 1

        # Create new user
        new_user = {
            'id': next_id,
            'name': data['name'],
            'email': data['email'],
            'password': generate_password_hash(data['password']),
            'age': data.get('age'),
            'gender': data.get('gender'),
            'initial_assessment': data.get('initial_assessment', {})
        }

        # Add user to the list
        users_data['users'].append(new_user)
        
        # Save updated users list
        save_users(users_data)

        # Create access token
        access_token = create_access_token(identity=next_id)
        
        return jsonify({
            'message': 'User registered successfully',
            'access_token': access_token,
            'user': {
                'id': new_user['id'],
                'name': new_user['name'],
                'email': new_user['email']
            }
        }), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        # Load users
        users_data = load_users()
        
        # Find user
        user = next((user for user in users_data['users'] if user['email'] == email), None)
        
        if not user or not check_password_hash(user['password'], password):
            return jsonify({'error': 'Invalid email or password'}), 401

        # Create access token
        access_token = create_access_token(identity=user['id'])
        
        return jsonify({
            'access_token': access_token,
            'user': {
                'id': user['id'],
                'name': user['name'],
                'email': user['email']
            }
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/initial-assessment', methods=['GET'])
def get_initial_assessment():
    questions = [
        {
            'id': 1,
            'text': 'How would you rate your current stress level?',
            'type': 'scale',
            'options': [
                {'value': 1, 'label': 'Very Low'},
                {'value': 2, 'label': 'Low'},
                {'value': 3, 'label': 'Moderate'},
                {'value': 4, 'label': 'High'},
                {'value': 5, 'label': 'Very High'}
            ]
        },
        {
            'id': 2,
            'text': 'What are your main concerns? (Select all that apply)',
            'type': 'multiple',
            'options': [
                {'value': 'anxiety', 'label': 'Anxiety'},
                {'value': 'depression', 'label': 'Depression'},
                {'value': 'stress', 'label': 'Stress'},
                {'value': 'sleep', 'label': 'Sleep Issues'},
                {'value': 'relationships', 'label': 'Relationship Problems'}
            ]
        },
        {
            'id': 3,
            'text': 'How often do you feel overwhelmed?',
            'type': 'single',
            'options': [
                {'value': 'rarely', 'label': 'Rarely'},
                {'value': 'sometimes', 'label': 'Sometimes'},
                {'value': 'often', 'label': 'Often'},
                {'value': 'always', 'label': 'Always'}
            ]
        }
    ]
    return jsonify(questions), 200
