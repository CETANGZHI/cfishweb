from functools import wraps
from flask import request, jsonify
import time
from collections import defaultdict

# Simple in-memory rate limiter (in production, use Redis)
request_counts = defaultdict(list)

def rate_limit(max_requests=100, window_seconds=3600):
    """
    Rate limiting decorator
    max_requests: Maximum number of requests allowed
    window_seconds: Time window in seconds
    """
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            # Get client identifier (IP address)
            client_id = request.remote_addr
            current_time = time.time()
            
            # Clean old requests outside the window
            request_counts[client_id] = [
                req_time for req_time in request_counts[client_id]
                if current_time - req_time < window_seconds
            ]
            
            # Check if limit exceeded
            if len(request_counts[client_id]) >= max_requests:
                return jsonify({
                    "error": "Rate limit exceeded",
                    "message": f"Maximum {max_requests} requests per {window_seconds} seconds"
                }), 429
            
            # Add current request
            request_counts[client_id].append(current_time)
            
            return f(*args, **kwargs)
        return decorated_function
    return decorator

