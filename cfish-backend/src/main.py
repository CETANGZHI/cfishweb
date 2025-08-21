import os
import sys
# DON'T CHANGE THIS !!!
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask, send_from_directory
from flask_cors import CORS
from src.models.user import db
from src.routes.user import user_bp
from src.routes.nft import nft_bp
from src.routes.collection import collection_bp
from src.routes.wallet import wallet_bp
from src.routes.profile import profile_bp
from src.routes.staking import staking_bp
from src.routes.currency_filter import currency_filter_bp
from src.routes.cart import cart_bp
from src.routes.favorites import favorites_bp
from src.routes.comments import comments_bp
from src.routes.search import search_bp
from src.routes.barter import barter_bp
from src.routes.bulk_operations import bulk_operations_bp
from src.routes.activity_management import activity_management_bp
from src.routes.intent_pool import intent_pool_bp
from src.routes.auction_management import auction_management_bp
from src.routes.dispute_resolution import dispute_resolution_bp

from src.routes.notification import notification_bp

app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), 'static'))
app.config['SECRET_KEY'] = 'asdf#FGSgvasgf$5$WGT'

# Enable CORS for all routes
CORS(app, origins="*")

# Register blueprints
app.register_blueprint(user_bp, url_prefix='/api')
app.register_blueprint(nft_bp, url_prefix='/api')
app.register_blueprint(collection_bp, url_prefix='/api')
app.register_blueprint(wallet_bp, url_prefix='/api')
app.register_blueprint(profile_bp, url_prefix='/api')
app.register_blueprint(staking_bp, url_prefix='/api')
app.register_blueprint(notification_bp, url_prefix='/api')
app.register_blueprint(currency_filter_bp, url_prefix='/api')
app.register_blueprint(cart_bp, url_prefix='/api')
app.register_blueprint(favorites_bp, url_prefix='/api')
app.register_blueprint(comments_bp, url_prefix='/api')
app.register_blueprint(search_bp, url_prefix='/api')
app.register_blueprint(barter_bp, url_prefix='/api')
app.register_blueprint(bulk_operations_bp, url_prefix='/api')
app.register_blueprint(activity_management_bp, url_prefix='/api')
app.register_blueprint(intent_pool_bp, url_prefix='/api')
app.register_blueprint(auction_management_bp, url_prefix='/api')
app.register_blueprint(dispute_resolution_bp, url_prefix='/api')

# uncomment if you need to use database
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(os.path.dirname(__file__), 'database', 'app.db')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)
with app.app_context():
    db.create_all()

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
    app.run(host='0.0.0.0', port=5000, debug=True)
