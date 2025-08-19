from flask import Blueprint, jsonify, request
from src.models.nft import NFT
from src.models.user import User
from src.models.social import Comment, UserLike
from src.models import db
from sqlalchemy import func, desc
from datetime import datetime, timedelta

analytics_bp = Blueprint("analytics", __name__, url_prefix="/api/v1/analytics")

@analytics_bp.route("/sales-trends", methods=["GET"])
def get_sales_trends():
    # Mock data for sales trends (in a real app, this would come from transaction data)
    # This would typically involve querying transaction history and aggregating by date
    mock_sales_data = [
        {"date": "2024-01-01", "sales": 120, "volume": 2400},
        {"date": "2024-01-02", "sales": 150, "volume": 3200},
        {"date": "2024-01-03", "sales": 180, "volume": 4100},
        {"date": "2024-01-04", "sales": 200, "volume": 4800},
        {"date": "2024-01-05", "sales": 175, "volume": 3900},
        {"date": "2024-01-06", "sales": 220, "volume": 5200},
        {"date": "2024-01-07", "sales": 190, "volume": 4300}
    ]
    return jsonify(mock_sales_data), 200

@analytics_bp.route("/category-distribution", methods=["GET"])
def get_category_distribution():
    # Get NFT count by category
    category_data = db.session.query(
        NFT.category,
        func.count(NFT.id).label("count")
    ).group_by(NFT.category).all()
    
    result = [{"category": cat, "count": count} for cat, count in category_data]
    return jsonify(result), 200

@analytics_bp.route("/user-activity", methods=["GET"])
def get_user_activity():
    # Get user activity statistics
    total_users = User.query.count()
    total_nfts = NFT.query.count()
    total_comments = Comment.query.count()
    total_likes = UserLike.query.count()
    
    # Get recent activity (last 7 days)
    seven_days_ago = datetime.utcnow() - timedelta(days=7)
    recent_users = User.query.filter(User.created_at >= seven_days_ago).count()
    recent_comments = Comment.query.filter(Comment.created_at >= seven_days_ago).count()
    
    activity_data = {
        "total_users": total_users,
        "total_nfts": total_nfts,
        "total_comments": total_comments,
        "total_likes": total_likes,
        "recent_users": recent_users,
        "recent_comments": recent_comments
    }
    
    return jsonify(activity_data), 200

@analytics_bp.route("/top-nfts", methods=["GET"])
def get_top_nfts():
    limit = request.args.get("limit", 10, type=int)
    sort_by = request.args.get("sort_by", "likes")  # likes, views, price
    
    if sort_by == "likes":
        top_nfts = NFT.query.order_by(desc(NFT.likes_count)).limit(limit).all()
    elif sort_by == "views":
        top_nfts = NFT.query.order_by(desc(NFT.views_count)).limit(limit).all()
    elif sort_by == "price":
        top_nfts = NFT.query.order_by(desc(NFT.price)).limit(limit).all()
    else:
        top_nfts = NFT.query.order_by(desc(NFT.likes_count)).limit(limit).all()
    
    result = [nft.to_dict() for nft in top_nfts]
    return jsonify(result), 200

@analytics_bp.route("/revenue", methods=["GET"])
def get_revenue_analytics():
    # Mock revenue data (in a real app, this would come from transaction data)
    revenue_data = {
        "total_revenue": 125000.50,
        "platform_fees": 6250.25,
        "creator_royalties": 12500.05,
        "sharer_commissions": 3750.15,
        "monthly_revenue": [
            {"month": "2024-01", "revenue": 18000},
            {"month": "2024-02", "revenue": 22000},
            {"month": "2024-03", "revenue": 25000},
            {"month": "2024-04", "revenue": 28000},
            {"month": "2024-05", "revenue": 32000}
        ]
    }
    return jsonify(revenue_data), 200

@analytics_bp.route("/popular-creators", methods=["GET"])
def get_popular_creators():
    limit = request.args.get("limit", 10, type=int)
    
    # Get creators with most NFTs and highest total likes
    popular_creators = db.session.query(
        User.id,
        User.wallet_address,
        User.display_name,
        User.username,
        User.avatar_url,
        func.count(NFT.id).label("nft_count"),
        func.sum(NFT.likes_count).label("total_likes")
    ).join(NFT, User.id == NFT.creator_id)\
     .group_by(User.id)\
     .order_by(desc(func.sum(NFT.likes_count)))\
     .limit(limit).all()
    
    result = []
    for creator in popular_creators:
        result.append({
            "id": creator.id,
            "wallet_address": creator.wallet_address,
            "display_name": creator.display_name,
            "username": creator.username,
            "avatar_url": creator.avatar_url,
            "nft_count": creator.nft_count,
            "total_likes": creator.total_likes or 0
        })
    
    return jsonify(result), 200


