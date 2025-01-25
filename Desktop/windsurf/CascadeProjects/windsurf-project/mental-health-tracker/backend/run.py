from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from app.routes.auth_routes import auth_bp
from app.routes.google_fit import google_fit_bp
from app.database import db, migrate
import os

app = Flask(__name__)
app.secret_key = 'your-secret-key-here'  # Required for session management

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# JWT configuration
app.config['JWT_SECRET_KEY'] = 'jwt-secret-key'  # Change this in production

# Initialize extensions
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})
JWTManager(app)
db.init_app(app)
migrate.init_app(app, db)

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(google_fit_bp, url_prefix='/api/google-fit')

# Create database tables
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True, port=5000)
