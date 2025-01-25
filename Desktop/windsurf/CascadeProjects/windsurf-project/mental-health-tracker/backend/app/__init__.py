from flask import Flask, jsonify
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from .routes.auth_routes import auth_bp
from .routes.test_routes import test_bp
from .routes.google_fit import google_fit_bp
from .database import db, migrate

jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    
    # Basic configuration
    app.config['SECRET_KEY'] = 'dev-secret-key'
    app.config['JWT_SECRET_KEY'] = 'jwt-secret-key'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///mental_health.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Enable CORS for all routes
    CORS(app, resources={
        r"/*": {
            "origins": ["http://localhost:3000"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })
    
    # Initialize extensions
    jwt.init_app(app)
    db.init_app(app)
    migrate.init_app(app, db)
    
    with app.app_context():
        # Create database tables
        db.create_all()
        
        # Register blueprints
        app.register_blueprint(auth_bp, url_prefix='/api/auth')
        app.register_blueprint(test_bp, url_prefix='/api')
        app.register_blueprint(google_fit_bp, url_prefix='/api/google-fit')
        
        @app.route('/health')
        def health_check():
            return jsonify({'status': 'healthy'})
            
        @app.errorhandler(404)
        def not_found(e):
            return jsonify({'error': 'Not found'}), 404
            
        @app.errorhandler(500)
        def server_error(e):
            return jsonify({'error': 'Internal server error'}), 500
            
    return app
