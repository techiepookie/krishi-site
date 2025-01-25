from functools import wraps
from flask import request, jsonify
import jwt
from datetime import datetime, timedelta
from config import SECRET_KEY

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        # Check if token is in headers
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]

        if not token:
            return jsonify({'message': 'Token is missing!'}), 401

        try:
            # Decode the token
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            current_user = data['user_id']
        except:
            return jsonify({'message': 'Token is invalid!'}), 401

        return f(current_user, *args, **kwargs)

    return decorated

def generate_token(user_id):
    """Generate JWT token for user"""
    token = jwt.encode({
        'user_id': user_id,
        'exp': datetime.utcnow() + timedelta(days=1)
    }, SECRET_KEY, algorithm="HS256")
    
    return token
