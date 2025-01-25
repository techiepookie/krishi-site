from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from models.user import User
from database import db

auth = Blueprint('auth', __name__)

@auth.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    name = data.get('name')

    if not email or not password or not name:
        return jsonify({'error': 'Missing required fields'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already registered'}), 400

    user = User(email=email, password=password, name=name)  # In production, hash the password
    db.session.add(user)
    db.session.commit()

    access_token = create_access_token(identity=user.id)
    return jsonify({
        'token': access_token,
        'user': user.to_dict()
    }), 201

@auth.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Missing email or password'}), 400

    user = User.query.filter_by(email=email).first()
    if not user or user.password != password:  # In production, verify hashed password
        return jsonify({'error': 'Invalid credentials'}), 401

    access_token = create_access_token(identity=user.id)
    return jsonify({
        'token': access_token,
        'user': user.to_dict()
    }), 200

@auth.route('/me', methods=['GET'])
@jwt_required()
def get_user():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
        
    return jsonify(user.to_dict()), 200
