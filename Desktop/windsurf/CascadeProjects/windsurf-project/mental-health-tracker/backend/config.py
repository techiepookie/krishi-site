import os
from datetime import timedelta

class Config:
    # Basic Flask config
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-secret-key')
    
    # Database config
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', 'sqlite:///mental_health.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # JWT config
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'jwt-secret-key')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    
    # CORS config
    CORS_HEADERS = 'Content-Type'
    
    # OpenAI config
    OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')

class DevelopmentConfig(Config):
    DEBUG = True
    
class ProductionConfig(Config):
    DEBUG = False

# Create a dictionary of configs
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}
