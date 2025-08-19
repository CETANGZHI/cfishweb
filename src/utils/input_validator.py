import re
from flask import request, jsonify
from functools import wraps

def validate_json_input(required_fields=None, optional_fields=None):
    """
    Validate JSON input decorator
    required_fields: List of required field names
    optional_fields: List of optional field names with their types
    """
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if not request.is_json:
                return jsonify({"error": "Content-Type must be application/json"}), 400
            
            data = request.get_json()
            if not data:
                return jsonify({"error": "Invalid JSON data"}), 400
            
            # Check required fields
            if required_fields:
                for field in required_fields:
                    if field not in data:
                        return jsonify({"error": f"Missing required field: {field}"}), 400
            
            # Validate field types and sanitize
            sanitized_data = {}
            for key, value in data.items():
                if isinstance(value, str):
                    # Basic XSS prevention
                    sanitized_data[key] = sanitize_string(value)
                else:
                    sanitized_data[key] = value
            
            # Replace request data with sanitized data
            request.json = sanitized_data
            
            return f(*args, **kwargs)
        return decorated_function
    return decorator

def sanitize_string(input_string):
    """
    Basic string sanitization to prevent XSS
    """
    if not isinstance(input_string, str):
        return input_string
    
    # Remove potentially dangerous characters
    sanitized = re.sub(r'[<>"\']', '', input_string)
    
    # Limit length
    if len(sanitized) > 1000:
        sanitized = sanitized[:1000]
    
    return sanitized.strip()

def validate_wallet_address(address):
    """
    Validate Solana wallet address format
    """
    if not address or not isinstance(address, str):
        return False
    
    # Solana addresses are base58 encoded and typically 32-44 characters
    if len(address) < 32 or len(address) > 44:
        return False
    
    # Basic base58 character check
    base58_chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
    return all(c in base58_chars for c in address)

def validate_email(email):
    """
    Validate email format
    """
    if not email or not isinstance(email, str):
        return False
    
    email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(email_pattern, email) is not None

