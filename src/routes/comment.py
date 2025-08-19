from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from src.models.social import Comment, UserLike
from src.models.nft import NFT
from src.models.user import User
from src.models import db
from src.utils.notification_sender import NotificationSender

comment_bp = Blueprint("comment", __name__)

@comment_bp.route("/comments", methods=["POST"])
@jwt_required()
def create_comment():
    current_user_id = get_jwt_identity()
    data = request.json
    content = data.get("content")
    nft_id = data.get("nft_id")
    parent_comment_id = data.get("parent_comment_id")

    if not content or not nft_id:
        return jsonify({"message": "Missing content or nft_id"}), 400

    nft = NFT.query.get_or_404(nft_id)

    new_comment = Comment(
        user_id=current_user_id,
        nft_id=nft_id,
        content=content,
        parent_comment_id=parent_comment_id
    )
    db.session.add(new_comment)
    db.session.commit()

    # Send notification to NFT creator if it's a top-level comment
    if not parent_comment_id and str(current_user_id) != str(nft.creator_id):
        creator = User.query.get(nft.creator_id)
        if creator:
            commenter = User.query.get(current_user_id)
            NotificationSender.send_notification(
                user_id=nft.creator_id,
                notification_type="comment",
                message=NotificationSender.get_notification_message(
                    "comment",
                    {"commenter_name": commenter.display_name or commenter.username or commenter.wallet_address, "target_type": "NFT", "comment_text": content}
                ),
                related_id=nft.id
            )

    return jsonify(new_comment.to_dict()), 201

@comment_bp.route("/nfts/<string:nft_id>/comments", methods=["GET"])
def get_nft_comments(nft_id):
    nft = NFT.query.get_or_404(nft_id)
    comments = Comment.query.filter_by(nft_id=nft_id, parent_comment_id=None).order_by(Comment.created_at.asc()).all()
    return jsonify([c.to_dict(include_replies=True) for c in comments]), 200

@comment_bp.route("/comments/<string:comment_id>", methods=["PUT"])
@jwt_required()
def update_comment(comment_id):
    current_user_id = get_jwt_identity()
    comment = Comment.query.filter_by(id=comment_id, user_id=current_user_id).first_or_404()
    data = request.json
    content = data.get("content")

    if not content:
        return jsonify({"message": "Missing content"}), 400

    comment.content = content
    db.session.commit()
    return jsonify(comment.to_dict()), 200

@comment_bp.route("/comments/<string:comment_id>", methods=["DELETE"])
@jwt_required()
def delete_comment(comment_id):
    current_user_id = get_jwt_identity()
    comment = Comment.query.filter_by(id=comment_id, user_id=current_user_id).first_or_404()

    db.session.delete(comment)
    db.session.commit()
    return jsonify({"message": "Comment deleted successfully"}), 200

@comment_bp.route("/comments/<string:comment_id>/like", methods=["POST"])
@jwt_required()
def like_comment(comment_id):
    current_user_id = get_jwt_identity()
    comment = Comment.query.get_or_404(comment_id)

    existing_like = UserLike.query.filter_by(user_id=current_user_id, target_type="comment", target_id=comment_id).first()
    if existing_like:
        return jsonify({"message": "Comment already liked"}), 409

    new_like = UserLike(user_id=current_user_id, target_type="comment", target_id=comment_id)
    db.session.add(new_like)
    comment.likes_count += 1
    db.session.commit()

    # Send notification to comment author
    if str(current_user_id) != str(comment.user_id):
        comment_author = User.query.get(comment.user_id)
        if comment_author:
            liker = User.query.get(current_user_id)
            NotificationSender.send_notification(
                user_id=comment.user_id,
                notification_type="like",
                message=NotificationSender.get_notification_message(
                    "like",
                    {"liker_name": liker.display_name or liker.username or liker.wallet_address, "target_type": "comment"}
                ),
                related_id=comment.id
            )

    return jsonify({"message": "Comment liked successfully", "likes_count": comment.likes_count}), 200

@comment_bp.route("/comments/<string:comment_id>/like", methods=["DELETE"])
@jwt_required()
def unlike_comment(comment_id):
    current_user_id = get_jwt_identity()
    comment = Comment.query.get_or_404(comment_id)

    existing_like = UserLike.query.filter_by(user_id=current_user_id, target_type="comment", target_id=comment_id).first_or_404()

    db.session.delete(existing_like)
    comment.likes_count -= 1
    db.session.commit()

    return jsonify({"message": "Comment unliked successfully", "likes_count": comment.likes_count}), 200


