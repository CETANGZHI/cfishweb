import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Config:
    """Base configuration class"""
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'dev-jwt-secret-key-change-in-production'
    JWT_ACCESS_TOKEN_EXPIRES = 24 * 60 * 60  # 24 hours in seconds
    
    # Database Configuration
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///database/app.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Redis Configuration
    REDIS_URL = os.environ.get('REDIS_URL') or 'redis://localhost:6379/0'
    
    # IPFS Configuration
    PINATA_API_KEY = os.environ.get('PINATA_API_KEY')
    PINATA_SECRET_API_KEY = os.environ.get('PINATA_SECRET_API_KEY')
    IPFS_GATEWAY_URL = os.environ.get('IPFS_GATEWAY_URL') or 'https://gateway.pinata.cloud/ipfs/'
    
    # Solana Configuration
    SOLANA_RPC_URL = os.environ.get('SOLANA_RPC_URL') or 'https://api.mainnet-beta.solana.com'
    SOLANA_NETWORK = os.environ.get('SOLANA_NETWORK') or 'mainnet-beta'
    
    # Security Configuration
    CORS_ORIGINS = os.environ.get('CORS_ORIGINS') or '*'
    API_RATE_LIMIT = int(os.environ.get('API_RATE_LIMIT', 100))
    
    # Logging Configuration
    LOG_LEVEL = os.environ.get('LOG_LEVEL') or 'INFO'

class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    FLASK_ENV = 'development'

class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    FLASK_ENV = 'production'

class TestingConfig(Config):
    """Testing configuration"""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'

# Configuration dictionary
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}

