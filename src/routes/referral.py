from flask import Blueprint, jsonify, request
from src.models import db
from src.models.user import User
from src.models.nft import NFT
from src.utils.auth_utils import jwt_required, get_jwt_identity

referral_bp = Blueprint("referral", __name__, url_prefix="/api/v1/referral")

@referral_bp.route("/generate-link", methods=["POST"])
@jwt_required()
def generate_referral_link():
    current_user_id = get_jwt_identity()
    # In a real app, this would generate a unique link for the user
    # For now, we'll use a placeholder
    referral_code = f"user_{current_user_id}"
    link = f"https://cfish.com/r/{referral_code}"
    return jsonify({"link": link, "referral_code": referral_code}), 200

@referral_bp.route("/track-click", methods=["POST"])
def track_referral_click():
    data = request.get_json()
    referral_code = data.get("referral_code")
    # In a real app, track the click in the database
    print(f"Referral link clicked: {referral_code}")
    return jsonify({"message": "Click tracked"}), 200

@referral_bp.route("/track-conversion", methods=["POST"])
def track_referral_conversion():
    data = request.get_json()
    referral_code = data.get("referral_code")
    converted_user_id = data.get("converted_user_id")
    # In a real app, record the conversion and potentially assign rewards
    print(f"Referral conversion: {referral_code} -> {converted_user_id}")
    return jsonify({"message": "Conversion tracked"}), 200

@referral_bp.route("/rewards", methods=["GET"])
@jwt_required()
def get_user_rewards():
    current_user_id = get_jwt_identity()
    # Mock data for user rewards
    rewards = [
        {"type": "commission", "amount": 10.5, "currency": "CFISH", "status": "pending"},
        {"type": "bonus", "amount": 5.0, "currency": "CFISH", "status": "claimed"}
    ]
    return jsonify({"user_id": current_user_id, "rewards": rewards}), 200

@referral_bp.route("/claim-reward", methods=["POST"])
@jwt_required()
def claim_reward():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    reward_id = data.get("reward_id")
    # In a real app, process the reward claim and update status
    print(f"User {current_user_id} claiming reward {reward_id}")
    return jsonify({"message": f"Reward {reward_id} claimed successfully"}), 200


