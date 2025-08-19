from functools import wraps
from flask import request, jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity as jwt_get_jwt_identity

def jwt_required():
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            try:
                verify_jwt_in_request()
            except Exception as e:
                return jsonify({"msg": str(e)}), 401
            return fn(*args, **kwargs)
        return decorator
    return wrapper

def get_jwt_identity():
    return jwt_get_jwt_identity()


