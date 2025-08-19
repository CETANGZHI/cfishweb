from flask import Blueprint, jsonify, request
from src.models import db
from src.models.user import User
from src.utils.auth_utils import jwt_required, get_jwt_identity

anti_brushing_bp = Blueprint("anti_brushing", __name__, url_prefix="/api/v1/anti-brushing")

@anti_brushing_bp.route("/check-reward-eligibility", methods=["POST"])
@jwt_required()
def check_reward_eligibility():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    reward_type = data.get("reward_type")

    # Mock logic for checking eligibility
    # In a real system, this would involve complex checks:
    # - User's historical reward claims for this type
    # - IP address, device fingerprinting to detect multiple accounts
    # - Behavioral analysis (e.g., rapid, unnatural actions)
    # - Smart contract state (e.g., if reward is already claimed on-chain)

    is_eligible = True
    reason = ""

    if reward_type == "daily_login_bonus":
        # Example: Limit to one claim per day
        # In real app, query database for last claim time
        last_claim_time = None # Replace with actual query
        if last_claim_time and (datetime.utcnow() - last_claim_time).days < 1:
            is_eligible = False
            reason = "Daily bonus already claimed"
    elif reward_type == "referral_bonus":
        # Example: Limit to N referral bonuses per user
        # In real app, query database for referral bonus count
        referral_bonus_count = 0 # Replace with actual query
        if referral_bonus_count >= 5: # Assuming max 5 referral bonuses
            is_eligible = False
            reason = "Maximum referral bonuses claimed"

    return jsonify({"is_eligible": is_eligible, "reason": reason}), 200

@anti_brushing_bp.route("/record-reward-claim", methods=["POST"])
@jwt_required()
def record_reward_claim():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    reward_type = data.get("reward_type")
    reward_amount = data.get("reward_amount")
    transaction_id = data.get("transaction_id") # Optional: for on-chain claims

    # In a real system, record the claim in the database
    # This record would be used by check_reward_eligibility
    print(f"User {current_user_id} claimed {reward_amount} of {reward_type}. Tx: {transaction_id}")

    return jsonify({"message": "Reward claim recorded"}), 200

@anti_brushing_bp.route("/behavioral-analysis", methods=["POST"])
@jwt_required()
def behavioral_analysis():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    action = data.get("action")
    timestamp = data.get("timestamp")
    ip_address = request.remote_addr # Get IP from request
    device_fingerprint = data.get("device_fingerprint") # Should be sent from frontend

    # In a real system, this data would be fed into a real-time analytics/fraud detection system
    print(f"User {current_user_id} performed action \'{action}\' from IP {ip_address} with device {device_fingerprint} at {timestamp}")

    # Mock response: always allow for now
    return jsonify({"is_suspicious": False, "message": "Behavior recorded"}), 200


