from flask import Blueprint, jsonify, request
from src.models.nft import NFT, NFTTag, NFTProperty
from src.models.user import User
from src.models.social import UserLike
from src.models import db
from sqlalchemy import or_
from flask_jwt_extended import jwt_required, get_jwt_identity
from src.main import cache # Import the cache instance

nft_bp = Blueprint("nft", __name__)

@nft_bp.route("/nfts", methods=["GET"])
@cache.cached(timeout=60, query_string=True) # Cache NFT list for 60 seconds, vary by query string
def get_nfts():
    query = NFT.query

    # Search
    search_query = request.args.get("search", type=str)
    if search_query:
        query = query.filter(or_(
            NFT.title.ilike(f"%{search_query}%"),
            NFT.description.ilike(f"%{search_query}%"),
            NFT.category.ilike(f"%{search_query}%"),
            NFT.rarity.ilike(f"%{search_query}%"),
            NFT.tags.any(NFTTag.tag.ilike(f"%{search_query}%"))
        ))

    # Filter by category
    category = request.args.get("category", type=str)
    if category:
        query = query.filter_by(category=category)

    # Filter by price range
    min_price = request.args.get("min_price", type=float)
    max_price = request.args.get("max_price", type=float)
    if min_price is not None:
        query = query.filter(NFT.price >= min_price)
    if max_price is not None:
        query = query.filter(NFT.price <= max_price)

    # Filter by rarity
    rarity = request.args.get("rarity", type=str)
    if rarity:
        query = query.filter_by(rarity=rarity)

    # Filter by creator
    creator_id = request.args.get("creator_id", type=str)
    if creator_id:
        query = query.filter_by(creator_id=creator_id)

    # Sort
    sort_by = request.args.get("sortBy", "newest")
    if sort_by == "trending":
        query = query.order_by(NFT.views_count.desc())
    elif sort_by == "price-low":
        query = query.order_by(NFT.price.asc())
    elif sort_by == "price-high":
        query = query.order_by(NFT.price.desc())
    elif sort_by == "newest":
        query = query.order_by(NFT.created_at.desc())
    elif sort_by == "oldest":
        query = query.order_by(NFT.created_at.asc())
    elif sort_by == "most-liked":
        query = query.order_by(NFT.likes_count.desc())
    elif sort_by == "sharerCommission-low":
        query = query.order_by(NFT.sharer_commission.asc())
    elif sort_by == "sharerCommission-high":
        query = query.order_by(NFT.sharer_commission.desc())
    elif sort_by == "platformFee-low":
        query = query.order_by(NFT.platform_fee.asc())
    elif sort_by == "platformFee-high":
        query = query.order_by(NFT.platform_fee.desc())
    else:
        query = query.order_by(NFT.created_at.desc()) # Default sort

    # Pagination
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("perPage", 10, type=int)
    nfts = query.paginate(page=page, per_page=per_page, error_out=False)

    return jsonify({
        "nfts": [nft.to_dict() for nft in nfts.items],
        "total": nfts.total,
        "pages": nfts.pages,
        "current_page": nfts.page
    })

@nft_bp.route("/nfts/<string:nft_id>", methods=["GET"])
@cache.cached(timeout=300) # Cache NFT detail for 300 seconds
def get_nft_detail(nft_id):
    nft = NFT.query.get_or_404(nft_id)
    nft.views_count += 1 # Increment view count
    db.session.commit()
    return jsonify(nft.to_dict(include_creator=True, include_owner=True))

@nft_bp.route("/nfts/<string:nft_id>/history", methods=["GET"])
def get_nft_history(nft_id):
    nft = NFT.query.get_or_404(nft_id)
    history = nft.transaction_history.order_by(NFT.TransactionHistory.transaction_date.desc()).all()
    return jsonify([h.to_dict() for h in history])

@nft_bp.route("/nfts/<string:nft_id>/properties", methods=["GET"])
def get_nft_properties(nft_id):
    nft = NFT.query.get_or_404(nft_id)
    properties = nft.properties.all()
    return jsonify([p.to_dict() for p in properties])

@nft_bp.route("/nfts/<string:nft_id>/like", methods=["POST"])
@jwt_required()
def like_nft(nft_id):
    current_user_id = get_jwt_identity()
    nft = NFT.query.get_or_404(nft_id)

    existing_like = UserLike.query.filter_by(user_id=current_user_id, target_type="nft", target_id=nft_id).first()
    if existing_like:
        return jsonify({"message": "NFT already liked"}), 409

    new_like = UserLike(user_id=current_user_id, target_type="nft", target_id=nft_id)
    db.session.add(new_like)
    nft.likes_count += 1
    db.session.commit()

    return jsonify({"message": "NFT liked successfully", "likes_count": nft.likes_count}), 200

@nft_bp.route("/nfts/<string:nft_id>/like", methods=["DELETE"])
@jwt_required()
def unlike_nft(nft_id):
    current_user_id = get_jwt_identity()
    nft = NFT.query.get_or_404(nft_id)

    existing_like = UserLike.query.filter_by(user_id=current_user_id, target_type="nft", target_id=nft_id).first_or_404()

    db.session.delete(existing_like)
    nft.likes_count -= 1
    db.session.commit()

    return jsonify({"message": "NFT unliked successfully", "likes_count": nft.likes_count}), 200

@nft_bp.route("/nfts/<string:nft_id>/likes", methods=["GET"])
def get_nft_likes(nft_id):
    nft = NFT.query.get_or_404(nft_id)
    likes = UserLike.query.filter_by(target_type="nft", target_id=nft_id).all()
    liked_users = [User.query.get(like.user_id).to_dict() for like in likes]
    return jsonify(liked_users), 200


