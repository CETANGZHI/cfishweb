from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from src.models.user import User, UserSocialLink
from src.models import db

user_bp = Blueprint("user", __name__)

@user_bp.route("/users/<string:user_id>", methods=["GET"])
def get_user(user_id):
    user = User.query.get_or_404(user_id)
    return jsonify(user.to_dict())

@user_bp.route("/users/<string:user_id>", methods=["PUT"])
@jwt_required()
def update_user(user_id):
    current_user_id = get_jwt_identity()
    if current_user_id != user_id:
        return jsonify({"message": "Unauthorized access"}), 403

    user = User.query.get_or_404(user_id)
    data = request.json

    user.username = data.get("username", user.username)
    user.display_name = data.get("display_name", user.display_name)
    user.email = data.get("email", user.email)
    user.bio = data.get("bio", user.bio)
    user.avatar_url = data.get("avatar_url", user.avatar_url)
    user.banner_url = data.get("banner_url", user.banner_url)

    db.session.commit()
    return jsonify(user.to_dict()), 200

@user_bp.route("/users/<string:user_id>/social-links", methods=["POST"])
@jwt_required()
def add_social_link(user_id):
    current_user_id = get_jwt_identity()
    if current_user_id != user_id:
        return jsonify({"message": "Unauthorized access"}), 403

    user = User.query.get_or_404(user_id)
    data = request.json
    platform = data.get("platform")
    url = data.get("url")

    if not platform or not url:
        return jsonify({"message": "Missing platform or url"}), 400

    # Check if link for this platform already exists
    existing_link = UserSocialLink.query.filter_by(user_id=user.id, platform=platform).first()
    if existing_link:
        existing_link.url = url
    else:
        new_link = UserSocialLink(user_id=user.id, platform=platform, url=url)
        db.session.add(new_link)

    db.session.commit()
    return jsonify(user.to_dict()), 201

@user_bp.route("/users/<string:user_id>/social-links/<string:link_id>", methods=["DELETE"])
@jwt_required()
def delete_social_link(user_id, link_id):
    current_user_id = get_jwt_identity()
    if current_user_id != user_id:
        return jsonify({"message": "Unauthorized access"}), 403

    user = User.query.get_or_404(user_id)
    link = UserSocialLink.query.filter_by(id=link_id, user_id=user.id).first_or_404()

    db.session.delete(link)
    db.session.commit()
    return jsonify({"message": "Social link deleted"}), 200

@user_bp.route("/users/<string:user_id>/follow", methods=["POST"])
@jwt_required()
def follow_user(user_id):
    current_user_id = get_jwt_identity()
    if current_user_id == user_id:
        return jsonify({"message": "Cannot follow yourself"}), 400

    follower = User.query.get_or_404(current_user_id)
    following = User.query.get_or_404(user_id)

    from src.models.user import UserFollow
    existing_follow = UserFollow.query.filter_by(follower_id=follower.id, following_id=following.id).first()
    if existing_follow:
        return jsonify({"message": "Already following this user"}), 409

    new_follow = UserFollow(follower_id=follower.id, following_id=following.id)
    db.session.add(new_follow)
    following.followers_count += 1
    follower.following_count += 1
    db.session.commit()

    return jsonify({"message": f"Successfully followed {following.display_name or following.username or following.wallet_address}"}), 200

@user_bp.route("/users/<string:user_id>/follow", methods=["DELETE"])
@jwt_required()
def unfollow_user(user_id):
    current_user_id = get_jwt_identity()
    if current_user_id == user_id:
        return jsonify({"message": "Cannot unfollow yourself"}), 400

    follower = User.query.get_or_404(current_user_id)
    following = User.query.get_or_404(user_id)

    from src.models.user import UserFollow
    existing_follow = UserFollow.query.filter_by(follower_id=follower.id, following_id=following.id).first_or_404()

    db.session.delete(existing_follow)
    following.followers_count -= 1
    follower.following_count -= 1
    db.session.commit()

    return jsonify({"message": f"Successfully unfollowed {following.display_name or following.username or following.wallet_address}"}), 200

@user_bp.route("/users/<string:user_id>/followers", methods=["GET"])
def get_followers(user_id):
    user = User.query.get_or_404(user_id)
    from src.models.user import UserFollow
    followers = [User.query.get(f.follower_id).to_dict() for f in user.follower_relationships]
    return jsonify(followers), 200

@user_bp.route("/users/<string:user_id>/following", methods=["GET"])
def get_following(user_id):
    user = User.query.get_or_404(user_id)
    from src.models.user import UserFollow
    following = [User.query.get(f.following_id).to_dict() for f in user.following_relationships]
    return jsonify(following), 200
