from flask import Blueprint, jsonify, request
from src.models.notification import Notification, NotificationSetting
from src.models import db
from flask_jwt_extended import jwt_required, get_jwt_identity

notification_bp = Blueprint("notification", __name__)

@notification_bp.route("/notifications", methods=["GET"])
@jwt_required()
def get_notifications():
    current_user_id = get_jwt_identity()
    notifications = Notification.query.filter_by(user_id=current_user_id).order_by(Notification.created_at.desc()).all()
    return jsonify([n.to_dict() for n in notifications]), 200

@notification_bp.route("/notifications/<string:notification_id>/read", methods=["PUT"])
@jwt_required()
def mark_notification_read(notification_id):
    current_user_id = get_jwt_identity()
    notification = Notification.query.filter_by(id=notification_id, user_id=current_user_id).first_or_404()
    notification.read = True
    db.session.commit()
    return jsonify(notification.to_dict()), 200

@notification_bp.route("/notifications/<string:notification_id>", methods=["DELETE"])
@jwt_required()
def delete_notification(notification_id):
    current_user_id = get_jwt_identity()
    notification = Notification.query.filter_by(id=notification_id, user_id=current_user_id).first_or_404()
    db.session.delete(notification)
    db.session.commit()
    return jsonify({"message": "Notification deleted successfully"}), 200

@notification_bp.route("/notifications", methods=["DELETE"])
@jwt_required()
def clear_all_notifications():
    current_user_id = get_jwt_identity()
    Notification.query.filter_by(user_id=current_user_id).delete()
    db.session.commit()
    return jsonify({"message": "All notifications cleared successfully"}), 200

@notification_bp.route("/notifications/settings", methods=["GET"])
@jwt_required()
def get_notification_settings():
    current_user_id = get_jwt_identity()
    settings = NotificationSetting.query.filter_by(user_id=current_user_id).first()
    if not settings:
        # Create default settings if none exist
        settings = NotificationSetting(user_id=current_user_id)
        db.session.add(settings)
        db.session.commit()
    return jsonify(settings.to_dict()), 200

@notification_bp.route("/notifications/settings", methods=["PUT"])
@jwt_required()
def update_notification_settings():
    current_user_id = get_jwt_identity()
    settings = NotificationSetting.query.filter_by(user_id=current_user_id).first_or_404()
    data = request.json

    settings.sound_enabled = data.get("sound_enabled", settings.sound_enabled)
    settings.push_enabled = data.get("push_enabled", settings.push_enabled)
    settings.email_enabled = data.get("email_enabled", settings.email_enabled)
    settings.sms_enabled = data.get("sms_enabled", settings.sms_enabled)
    settings.nft_sold_enabled = data.get("nft_sold_enabled", settings.nft_sold_enabled)
    settings.nft_purchased_enabled = data.get("nft_purchased_enabled", settings.nft_purchased_enabled)
    settings.bid_received_enabled = data.get("bid_received_enabled", settings.bid_received_enabled)
    settings.bid_outbid_enabled = data.get("bid_outbid_enabled", settings.bid_outbid_enabled)
    settings.auction_ending_enabled = data.get("auction_ending_enabled", settings.auction_ending_enabled)
    settings.follow_enabled = data.get("follow_enabled", settings.follow_enabled)
    settings.like_enabled = data.get("like_enabled", settings.like_enabled)
    settings.comment_enabled = data.get("comment_enabled", settings.comment_enabled)

    db.session.commit()
    return jsonify(settings.to_dict()), 200


