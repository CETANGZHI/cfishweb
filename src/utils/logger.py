import logging
import os
from logging.handlers import RotatingFileHandler
from datetime import datetime

def setup_logger(app):
    """
    Setup application logging
    """
    if not app.debug:
        # Create logs directory if it doesn't exist
        if not os.path.exists('logs'):
            os.mkdir('logs')
        
        # Setup file handler with rotation
        file_handler = RotatingFileHandler(
            'logs/cfish_backend.log',
            maxBytes=10240000,  # 10MB
            backupCount=10
        )
        
        file_handler.setFormatter(logging.Formatter(
            '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
        ))
        
        file_handler.setLevel(logging.INFO)
        app.logger.addHandler(file_handler)
        app.logger.setLevel(logging.INFO)
        app.logger.info('CFISH Backend startup')

def log_api_request(endpoint, method, user_id=None, ip_address=None):
    """
    Log API request details
    """
    logging.info(f"API Request - Endpoint: {endpoint}, Method: {method}, User: {user_id}, IP: {ip_address}")

def log_security_event(event_type, details, user_id=None, ip_address=None):
    """
    Log security-related events
    """
    logging.warning(f"Security Event - Type: {event_type}, Details: {details}, User: {user_id}, IP: {ip_address}")

def log_error(error_message, user_id=None, endpoint=None):
    """
    Log application errors
    """
    logging.error(f"Application Error - Message: {error_message}, User: {user_id}, Endpoint: {endpoint}")

