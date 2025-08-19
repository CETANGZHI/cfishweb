from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, create_refresh_token
from src.models.user import User
from src.models import db
from src.main import limiter
from src.utils.input_validator import validate_json_input, validate_wallet_address

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/login", methods=["POST"])
@limiter.limit("5 per minute")
@validate_json_input(required_fields=["wallet_address", "signature", "message"])
def login():
    wallet_address = request.json.get("wallet_address")
    signature = request.json.get("signature")
    message = request.json.get("message")

    if not validate_wallet_address(wallet_address):
        return jsonify({"message": "Invalid wallet address format"}), 400

    # In a real application, you would verify the signature here.
    # For now, we'll skip actual signature verification for simplicity.
    # if not verify_signature(wallet_address, signature, message):
    #     return jsonify({"message": "Invalid signature"}), 401

    user = User.query.filter_by(wallet_address=wallet_address).first()
    if not user:
        user = User(wallet_address=wallet_address)
        db.session.add(user)
        db.session.commit()

    access_token = create_access_token(identity=user.id)
    refresh_token = create_refresh_token(identity=user.id)
    return jsonify(access_token=access_token, refresh_token=refresh_token, user=user.to_dict()), 200

@auth_bp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    current_user_id = get_jwt_identity()
    access_token = create_access_token(identity=current_user_id)
    return jsonify(access_token=access_token), 200

@auth_bp.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    return jsonify({"message": "Successfully logged out"}), 200


