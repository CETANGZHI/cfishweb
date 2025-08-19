import os
import sys
# DON'T CHANGE THIS !!!
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask, send_from_directory, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, get_jwt_identity
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_caching import Cache
from src.models import db
from src.routes.user import user_bp
from src.routes.auth import auth_bp
from src.routes.nft import nft_bp
from src.routes.cart import cart_bp
from src.routes.notification import notification_bp
from src.routes.comment import comment_bp
from src.routes.ipfs import ipfs_bp
from src.routes.analytics import analytics_bp
from src.routes.referral import referral_bp
from src.routes.anti_brushing import anti_brushing_bp
from src.routes.staking import staking_bp
from src.routes.wallet import wallet_bp
from src.routes.barter import barter_bp
from src.routes.bulk_operations import bulk_operations_bp
from src.routes.activity_calendar import activity_calendar_bp
from src.routes.intent_pool import intent_pool_bp
from src.routes.minting import minting_bp
from src.routes.auction import auction_bp
from src.routes.dispute import dispute_bp
from src.config import config
from src.utils.logger import setup_logger, log_api_request, log_error

app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), 'static'))

# Load configuration
app_config = config[os.environ.get('FLASK_ENV', 'default')]
app.config.from_object(app_config)

# Initialize CORS
CORS(app, resources={r"/api/*": {"origins": app.config["CORS_ORIGINS"]}})

# Initialize JWTManager
jwt = JWTManager(app)

# Initialize Limiter
limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["200 per day", "50 per hour"],
    storage_uri=app.config["REDIS_URL"],
    strategy="fixed-window"
)

# Initialize Cache
cache = Cache(app, config={
    'CACHE_TYPE': 'RedisCache',
    'CACHE_REDIS_URL': app.config["REDIS_URL"]
})

# Setup logging
setup_logger(app)

# Security headers middleware
@app.after_request
def after_request(response):
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
    
    # Log API requests
    user_id = None
    try:
        user_id = get_jwt_identity()
    except Exception:
        pass # Not all requests will have a JWT token
    log_api_request(request.path, request.method, user_id, request.remote_addr)
    
    return response

app.register_blueprint(user_bp, url_prefix='/api/v1')
app.register_blueprint(auth_bp, url_prefix='/api/v1/auth')
app.register_blueprint(nft_bp, url_prefix='/api/v1')
app.register_blueprint(cart_bp, url_prefix='/api/v1')
app.register_blueprint(notification_bp, url_prefix='/api/v1')
app.register_blueprint(comment_bp, url_prefix='/api/v1')
app.register_blueprint(ipfs_bp, url_prefix='/api/v1')
app.register_blueprint(analytics_bp, url_prefix='/api/v1/analytics')
app.register_blueprint(referral_bp, url_prefix='/api/v1/referral')
app.register_blueprint(anti_brushing_bp, url_prefix='/api/v1/anti-brushing')
app.register_blueprint(staking_bp, url_prefix='/api/v1/staking')
app.register_blueprint(wallet_bp, url_prefix='/api/v1/wallet')
app.register_blueprint(barter_bp, url_prefix='/api/v1/barter')
app.register_blueprint(bulk_operations_bp, url_prefix='/api/v1/bulk-operations')
app.register_blueprint(activity_calendar_bp, url_prefix='/api/v1/activity-calendar')
app.register_blueprint(intent_pool_bp, url_prefix='/api/v1/intent-pool')
app.register_blueprint(minting_bp, url_prefix='/api/v1/minting')
app.register_blueprint(auction_bp, url_prefix='/api/v1/auction')
app.register_blueprint(dispute_bp, url_prefix='/api/v1/dispute')

db.init_app(app)

# Global error handler
@app.errorhandler(404)
def not_found(error):
    log_error(f"404 Not Found: {request.path}", user_id=get_jwt_identity() if get_jwt_identity() else None, endpoint=request.path)
    return jsonify({"message": "Resource not found", "status_code": 404}), 404

@app.errorhandler(500)
def internal_server_error(error):
    log_error(f"500 Internal Server Error: {str(error)}", user_id=get_jwt_identity() if get_jwt_identity() else None, endpoint=request.path)
    return jsonify({"message": "Internal server error", "status_code": 500}), 500

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    static_folder_path = app.static_folder
    if static_folder_path is None:
        return "Static folder not configured", 404

    if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
        return send_from_directory(static_folder_path, path)
    else:
        index_path = os.path.join(static_folder_path, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(static_folder_path, 'index.html')
        else:
            return "index.html not found", 404


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', port=5000, debug=app.config['DEBUG'])

