from flask import Blueprint, request, jsonify, send_file
from middleware.auth import token_required
import os
from werkzeug.utils import secure_filename
from datetime import datetime

file_storage = Blueprint('file_storage', __name__)

# Configure upload folder
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'uploads')
ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg', 'gif', 'doc', 'docx'}

# Create uploads directory if it doesn't exist
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@file_storage.route('/upload', methods=['POST'])
@token_required
def upload_file(current_user):
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file and allowed_file(file.filename):
        # Create user directory if it doesn't exist
        user_upload_dir = os.path.join(UPLOAD_FOLDER, str(current_user))
        if not os.path.exists(user_upload_dir):
            os.makedirs(user_upload_dir)
        
        # Secure the filename and add timestamp
        filename = secure_filename(file.filename)
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"{timestamp}_{filename}"
        
        file_path = os.path.join(user_upload_dir, filename)
        file.save(file_path)
        
        return jsonify({
            'message': 'File uploaded successfully',
            'filename': filename
        }), 200
    
    return jsonify({'error': 'File type not allowed'}), 400

@file_storage.route('/files', methods=['GET'])
@token_required
def get_user_files(current_user):
    user_upload_dir = os.path.join(UPLOAD_FOLDER, str(current_user))
    
    if not os.path.exists(user_upload_dir):
        return jsonify({'files': []}), 200
    
    files = []
    for filename in os.listdir(user_upload_dir):
        file_path = os.path.join(user_upload_dir, filename)
        files.append({
            'name': filename,
            'size': os.path.getsize(file_path),
            'created': datetime.fromtimestamp(os.path.getctime(file_path)).isoformat()
        })
    
    return jsonify({'files': files}), 200

@file_storage.route('/files/<filename>', methods=['GET'])
@token_required
def download_file(current_user, filename):
    user_upload_dir = os.path.join(UPLOAD_FOLDER, str(current_user))
    file_path = os.path.join(user_upload_dir, filename)
    
    if not os.path.exists(file_path):
        return jsonify({'error': 'File not found'}), 404
    
    return send_file(file_path, as_attachment=True)

@file_storage.route('/files/<filename>', methods=['DELETE'])
@token_required
def delete_file(current_user, filename):
    user_upload_dir = os.path.join(UPLOAD_FOLDER, str(current_user))
    file_path = os.path.join(user_upload_dir, filename)
    
    if not os.path.exists(file_path):
        return jsonify({'error': 'File not found'}), 404
    
    os.remove(file_path)
    return jsonify({'message': 'File deleted successfully'}), 200
