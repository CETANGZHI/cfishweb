"""
拍卖管理API路由
"""
from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
import uuid
from typing import Dict, Any, List, Optional

from ..models.auction import (
    Auction, Bid, AuctionWatchlist, AuctionHistory, AuctionSettings,
    AuctionAnalytics, AuctionTemplate, BidderProfile
)
from ..utils.auth_utils import token_required
from ..utils.input_validator import validate_input
from ..utils.logger import get_logger

logger = get_logger(__name__)
auction_bp = Blueprint('auction', __name__)

# 模拟数据存储
auctions: Dict[str, Auction] = {}
bids: Dict[str, Bid] = {}
watchlists: Dict[str, AuctionWatchlist] = {}
auction_histories: Dict[str, AuctionHistory] = {}
auction_settings: Dict[str, AuctionSettings] = {}
auction_analytics: Dict[str, AuctionAnalytics] = {}
auction_templates: Dict[str, AuctionTemplate] = {}
bidder_profiles: Dict[str, BidderProfile] = {}

# 初始化一些示例数据
def init_sample_data():
    """初始化示例数据"""
    # 拍卖示例
    auction_id = str(uuid.uuid4())
    auctions[auction_id] = Auction(
        id=auction_id,
        nft_id="nft_123",
        seller_id="user_123",
        title="Rare Digital Art Piece",
        description="A unique digital artwork from renowned artist",
        starting_price=1.0,
        reserve_price=5.0,
        current_price=1.0,
        currency="SOL",
        auction_type="english",
        status="active",
        start_time=datetime.now(),
        end_time=datetime.now() + timedelta(days=7),
        bid_increment=0.1,
        auto_extend=True,
        extend_minutes=10,
        total_bids=0,
        winner_id=None,
        winning_bid_id=None,
        settlement_hash=None,
        created_at=datetime.now(),
        updated_at=datetime.now()
    )

# 初始化示例数据
init_sample_data()


@auction_bp.route('/auctions', methods=['GET'])
def get_auctions():
    """获取拍卖列表"""
    try:
        status = request.args.get('status', 'active')
        auction_type = request.args.get('type')
        seller_id = request.args.get('seller_id')
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 20))
        
        filtered_auctions = []
        for auction in auctions.values():
            if status and auction.status != status:
                continue
            if auction_type and auction.auction_type != auction_type:
                continue
            if seller_id and auction.seller_id != seller_id:
                continue
            filtered_auctions.append(auction.to_dict())
        
        # 分页
        start = (page - 1) * limit
        end = start + limit
        paginated_auctions = filtered_auctions[start:end]
        
        logger.info(f"Retrieved {len(paginated_auctions)} auctions")
        
        return jsonify({
            'success': True,
            'data': paginated_auctions,
            'total': len(filtered_auctions),
            'page': page,
            'limit': limit
        }), 200
        
    except Exception as e:
        logger.error(f"Error retrieving auctions: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Failed to retrieve auctions'
        }), 500


@auction_bp.route('/auctions', methods=['POST'])
@token_required
def create_auction(current_user):
    """创建拍卖"""
    try:
        data = request.get_json()
        
        # 验证输入
        required_fields = ['nft_id', 'title', 'starting_price', 'end_time']
        if not validate_input(data, required_fields):
            return jsonify({
                'success': False,
                'message': 'Missing required fields'
            }), 400
        
        auction_id = str(uuid.uuid4())
        end_time = datetime.fromisoformat(data['end_time'].replace('Z', '+00:00'))
        
        auction = Auction(
            id=auction_id,
            nft_id=data['nft_id'],
            seller_id=current_user['id'],
            title=data['title'],
            description=data.get('description', ''),
            starting_price=float(data['starting_price']),
            reserve_price=float(data['reserve_price']) if data.get('reserve_price') else None,
            current_price=float(data['starting_price']),
            currency=data.get('currency', 'SOL'),
            auction_type=data.get('auction_type', 'english'),
            status='active',
            start_time=datetime.now(),
            end_time=end_time,
            bid_increment=float(data.get('bid_increment', 0.1)),
            auto_extend=data.get('auto_extend', True),
            extend_minutes=int(data.get('extend_minutes', 10)),
            total_bids=0,
            winner_id=None,
            winning_bid_id=None,
            settlement_hash=None,
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
        
        auctions[auction_id] = auction
        
        # 记录历史
        history_id = str(uuid.uuid4())
        auction_histories[history_id] = AuctionHistory(
            id=history_id,
            auction_id=auction_id,
            action_type='created',
            user_id=current_user['id'],
            details={'starting_price': auction.starting_price, 'end_time': auction.end_time.isoformat()},
            timestamp=datetime.now()
        )
        
        logger.info(f"Created auction: {auction_id} by user: {current_user['id']}")
        
        return jsonify({
            'success': True,
            'data': auction.to_dict()
        }), 201
        
    except Exception as e:
        logger.error(f"Error creating auction: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Failed to create auction'
        }), 500


@auction_bp.route('/auctions/<auction_id>', methods=['GET'])
def get_auction(auction_id: str):
    """获取拍卖详情"""
    try:
        if auction_id not in auctions:
            return jsonify({
                'success': False,
                'message': 'Auction not found'
            }), 404
        
        auction = auctions[auction_id]
        
        # 获取相关出价
        auction_bids = [
            bid.to_dict() for bid in bids.values()
            if bid.auction_id == auction_id
        ]
        auction_bids.sort(key=lambda x: x['amount'], reverse=True)
        
        # 获取历史记录
        auction_history = [
            history.to_dict() for history in auction_histories.values()
            if history.auction_id == auction_id
        ]
        auction_history.sort(key=lambda x: x['timestamp'], reverse=True)
        
        result = auction.to_dict()
        result['bids'] = auction_bids
        result['history'] = auction_history
        
        logger.info(f"Retrieved auction details: {auction_id}")
        
        return jsonify({
            'success': True,
            'data': result
        }), 200
        
    except Exception as e:
        logger.error(f"Error retrieving auction {auction_id}: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Failed to retrieve auction'
        }), 500


@auction_bp.route('/auctions/<auction_id>/bid', methods=['POST'])
@token_required
def place_bid(current_user, auction_id: str):
    """对拍卖出价"""
    try:
        if auction_id not in auctions:
            return jsonify({
                'success': False,
                'message': 'Auction not found'
            }), 404
        
        auction = auctions[auction_id]
        
        # 检查拍卖状态
        if auction.status != 'active':
            return jsonify({
                'success': False,
                'message': 'Auction is not active'
            }), 400
        
        # 检查拍卖是否已结束
        if datetime.now() > auction.end_time:
            return jsonify({
                'success': False,
                'message': 'Auction has ended'
            }), 400
        
        data = request.get_json()
        
        # 验证输入
        required_fields = ['amount']
        if not validate_input(data, required_fields):
            return jsonify({
                'success': False,
                'message': 'Missing required fields'
            }), 400
        
        bid_amount = float(data['amount'])
        
        # 检查出价是否有效
        if bid_amount <= auction.current_price:
            return jsonify({
                'success': False,
                'message': f'Bid must be higher than current price: {auction.current_price}'
            }), 400
        
        if bid_amount < auction.current_price + auction.bid_increment:
            return jsonify({
                'success': False,
                'message': f'Bid must be at least {auction.current_price + auction.bid_increment}'
            }), 400
        
        # 创建出价
        bid_id = str(uuid.uuid4())
        bid = Bid(
            id=bid_id,
            auction_id=auction_id,
            bidder_id=current_user['id'],
            amount=bid_amount,
            currency=auction.currency,
            bid_type=data.get('bid_type', 'regular'),
            status='active',
            transaction_hash=data.get('transaction_hash'),
            proxy_max_amount=float(data['proxy_max_amount']) if data.get('proxy_max_amount') else None,
            is_automatic=data.get('is_automatic', False),
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
        
        bids[bid_id] = bid
        
        # 更新拍卖信息
        auction.current_price = bid_amount
        auction.total_bids += 1
        auction.updated_at = datetime.now()
        
        # 如果启用自动延长且接近结束时间
        if auction.auto_extend:
            time_remaining = auction.end_time - datetime.now()
            if time_remaining.total_seconds() < auction.extend_minutes * 60:
                auction.end_time = datetime.now() + timedelta(minutes=auction.extend_minutes)
        
        # 将之前的出价标记为被超越
        for existing_bid in bids.values():
            if (existing_bid.auction_id == auction_id and 
                existing_bid.id != bid_id and 
                existing_bid.status == 'active'):
                existing_bid.status = 'outbid'
        
        # 记录历史
        history_id = str(uuid.uuid4())
        auction_histories[history_id] = AuctionHistory(
            id=history_id,
            auction_id=auction_id,
            action_type='bid_placed',
            user_id=current_user['id'],
            details={'amount': bid_amount, 'bid_id': bid_id},
            timestamp=datetime.now()
        )
        
        logger.info(f"Placed bid: {bid_id} on auction: {auction_id} by user: {current_user['id']}")
        
        return jsonify({
            'success': True,
            'data': bid.to_dict()
        }), 201
        
    except Exception as e:
        logger.error(f"Error placing bid on auction {auction_id}: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Failed to place bid'
        }), 500


@auction_bp.route('/auctions/<auction_id>/end', methods=['POST'])
@token_required
def end_auction(current_user, auction_id: str):
    """结束拍卖"""
    try:
        if auction_id not in auctions:
            return jsonify({
                'success': False,
                'message': 'Auction not found'
            }), 404
        
        auction = auctions[auction_id]
        
        # 检查权限
        if auction.seller_id != current_user['id']:
            return jsonify({
                'success': False,
                'message': 'Unauthorized'
            }), 403
        
        # 检查拍卖状态
        if auction.status != 'active':
            return jsonify({
                'success': False,
                'message': 'Auction is not active'
            }), 400
        
        # 找到最高出价
        highest_bid = None
        for bid in bids.values():
            if bid.auction_id == auction_id and bid.status == 'active':
                if not highest_bid or bid.amount > highest_bid.amount:
                    highest_bid = bid
        
        # 更新拍卖状态
        auction.status = 'ended'
        auction.updated_at = datetime.now()
        
        if highest_bid:
            # 检查是否达到保留价
            if auction.reserve_price and highest_bid.amount < auction.reserve_price:
                auction.status = 'ended'  # 未达到保留价
            else:
                auction.winner_id = highest_bid.bidder_id
                auction.winning_bid_id = highest_bid.id
                highest_bid.status = 'winning'
        
        # 记录历史
        history_id = str(uuid.uuid4())
        auction_histories[history_id] = AuctionHistory(
            id=history_id,
            auction_id=auction_id,
            action_type='ended',
            user_id=current_user['id'],
            details={
                'winner_id': auction.winner_id,
                'winning_amount': highest_bid.amount if highest_bid else None
            },
            timestamp=datetime.now()
        )
        
        logger.info(f"Ended auction: {auction_id} by user: {current_user['id']}")
        
        return jsonify({
            'success': True,
            'data': auction.to_dict()
        }), 200
        
    except Exception as e:
        logger.error(f"Error ending auction {auction_id}: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Failed to end auction'
        }), 500


@auction_bp.route('/auctions/<auction_id>/watchlist', methods=['POST'])
@token_required
def add_to_watchlist(current_user, auction_id: str):
    """添加到关注列表"""
    try:
        if auction_id not in auctions:
            return jsonify({
                'success': False,
                'message': 'Auction not found'
            }), 404
        
        # 检查是否已经在关注列表中
        for watchlist in watchlists.values():
            if watchlist.user_id == current_user['id'] and watchlist.auction_id == auction_id:
                return jsonify({
                    'success': False,
                    'message': 'Already in watchlist'
                }), 400
        
        data = request.get_json() or {}
        
        watchlist_id = str(uuid.uuid4())
        watchlist = AuctionWatchlist(
            id=watchlist_id,
            user_id=current_user['id'],
            auction_id=auction_id,
            notification_enabled=data.get('notification_enabled', True),
            price_alert_threshold=float(data['price_alert_threshold']) if data.get('price_alert_threshold') else None,
            time_alert_minutes=int(data['time_alert_minutes']) if data.get('time_alert_minutes') else None,
            created_at=datetime.now()
        )
        
        watchlists[watchlist_id] = watchlist
        
        logger.info(f"Added auction {auction_id} to watchlist for user: {current_user['id']}")
        
        return jsonify({
            'success': True,
            'data': watchlist.to_dict()
        }), 201
        
    except Exception as e:
        logger.error(f"Error adding auction {auction_id} to watchlist: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Failed to add to watchlist'
        }), 500


@auction_bp.route('/auctions/watchlist', methods=['GET'])
@token_required
def get_watchlist(current_user):
    """获取用户的关注列表"""
    try:
        user_watchlist = []
        for watchlist in watchlists.values():
            if watchlist.user_id == current_user['id']:
                watchlist_data = watchlist.to_dict()
                # 添加拍卖信息
                if watchlist.auction_id in auctions:
                    watchlist_data['auction'] = auctions[watchlist.auction_id].to_dict()
                user_watchlist.append(watchlist_data)
        
        logger.info(f"Retrieved {len(user_watchlist)} watchlist items for user: {current_user['id']}")
        
        return jsonify({
            'success': True,
            'data': user_watchlist,
            'total': len(user_watchlist)
        }), 200
        
    except Exception as e:
        logger.error(f"Error retrieving watchlist: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Failed to retrieve watchlist'
        }), 500


@auction_bp.route('/auctions/<auction_id>/analytics', methods=['GET'])
def get_auction_analytics(auction_id: str):
    """获取拍卖分析数据"""
    try:
        if auction_id not in auctions:
            return jsonify({
                'success': False,
                'message': 'Auction not found'
            }), 404
        
        # 查找或创建分析数据
        analytics = None
        for analytic in auction_analytics.values():
            if analytic.auction_id == auction_id:
                analytics = analytic
                break
        
        if not analytics:
            # 创建默认分析数据
            analytics_id = str(uuid.uuid4())
            analytics = AuctionAnalytics(
                id=analytics_id,
                auction_id=auction_id,
                total_views=0,
                unique_viewers=0,
                total_watchers=len([w for w in watchlists.values() if w.auction_id == auction_id]),
                bid_activity=[],
                price_progression=[],
                bidder_analysis={},
                performance_metrics={},
                last_updated=datetime.now()
            )
            auction_analytics[analytics_id] = analytics
        
        logger.info(f"Retrieved analytics for auction: {auction_id}")
        
        return jsonify({
            'success': True,
            'data': analytics.to_dict()
        }), 200
        
    except Exception as e:
        logger.error(f"Error retrieving auction analytics {auction_id}: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Failed to retrieve auction analytics'
        }), 500


@auction_bp.route('/bids/user/<user_id>', methods=['GET'])
@token_required
def get_user_bids(current_user, user_id: str):
    """获取用户的出价记录"""
    try:
        # 检查权限
        if user_id != current_user['id']:
            return jsonify({
                'success': False,
                'message': 'Unauthorized'
            }), 403
        
        user_bids = [
            bid.to_dict() for bid in bids.values()
            if bid.bidder_id == user_id
        ]
        
        # 按创建时间排序
        user_bids.sort(key=lambda x: x['created_at'], reverse=True)
        
        logger.info(f"Retrieved {len(user_bids)} bids for user: {user_id}")
        
        return jsonify({
            'success': True,
            'data': user_bids,
            'total': len(user_bids)
        }), 200
        
    except Exception as e:
        logger.error(f"Error retrieving bids for user {user_id}: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Failed to retrieve user bids'
        }), 500

