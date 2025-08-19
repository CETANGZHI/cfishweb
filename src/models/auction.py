"""
拍卖管理相关的数据模型
"""
from datetime import datetime
from typing import Optional, Dict, Any, List
from dataclasses import dataclass


@dataclass
class Auction:
    """拍卖模型"""
    id: str
    nft_id: str
    seller_id: str
    title: str
    description: str
    starting_price: float
    reserve_price: Optional[float]  # 保留价
    current_price: float
    currency: str  # 'SOL', 'CFISH'
    auction_type: str  # 'english', 'dutch', 'sealed_bid'
    status: str  # 'active', 'ended', 'cancelled', 'settled'
    start_time: datetime
    end_time: datetime
    bid_increment: float  # 最小加价幅度
    auto_extend: bool  # 是否自动延长
    extend_minutes: int  # 延长分钟数
    total_bids: int
    winner_id: Optional[str]
    winning_bid_id: Optional[str]
    settlement_hash: Optional[str]  # 结算交易哈希
    created_at: datetime
    updated_at: datetime
    
    def to_dict(self):
        return {
            'id': self.id,
            'nft_id': self.nft_id,
            'seller_id': self.seller_id,
            'title': self.title,
            'description': self.description,
            'starting_price': self.starting_price,
            'reserve_price': self.reserve_price,
            'current_price': self.current_price,
            'currency': self.currency,
            'auction_type': self.auction_type,
            'status': self.status,
            'start_time': self.start_time.isoformat(),
            'end_time': self.end_time.isoformat(),
            'bid_increment': self.bid_increment,
            'auto_extend': self.auto_extend,
            'extend_minutes': self.extend_minutes,
            'total_bids': self.total_bids,
            'winner_id': self.winner_id,
            'winning_bid_id': self.winning_bid_id,
            'settlement_hash': self.settlement_hash,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }


@dataclass
class Bid:
    """出价模型"""
    id: str
    auction_id: str
    bidder_id: str
    amount: float
    currency: str
    bid_type: str  # 'regular', 'proxy', 'reserve'
    status: str  # 'active', 'outbid', 'winning', 'cancelled'
    transaction_hash: Optional[str]
    proxy_max_amount: Optional[float]  # 代理出价最高金额
    is_automatic: bool  # 是否为自动出价
    created_at: datetime
    updated_at: datetime
    
    def to_dict(self):
        return {
            'id': self.id,
            'auction_id': self.auction_id,
            'bidder_id': self.bidder_id,
            'amount': self.amount,
            'currency': self.currency,
            'bid_type': self.bid_type,
            'status': self.status,
            'transaction_hash': self.transaction_hash,
            'proxy_max_amount': self.proxy_max_amount,
            'is_automatic': self.is_automatic,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }


@dataclass
class AuctionWatchlist:
    """拍卖关注列表模型"""
    id: str
    user_id: str
    auction_id: str
    notification_enabled: bool
    price_alert_threshold: Optional[float]
    time_alert_minutes: Optional[int]  # 结束前多少分钟提醒
    created_at: datetime
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'auction_id': self.auction_id,
            'notification_enabled': self.notification_enabled,
            'price_alert_threshold': self.price_alert_threshold,
            'time_alert_minutes': self.time_alert_minutes,
            'created_at': self.created_at.isoformat()
        }


@dataclass
class AuctionHistory:
    """拍卖历史记录模型"""
    id: str
    auction_id: str
    action_type: str  # 'created', 'bid_placed', 'bid_cancelled', 'extended', 'ended', 'settled'
    user_id: Optional[str]
    details: Dict[str, Any]
    timestamp: datetime
    
    def to_dict(self):
        return {
            'id': self.id,
            'auction_id': self.auction_id,
            'action_type': self.action_type,
            'user_id': self.user_id,
            'details': self.details,
            'timestamp': self.timestamp.isoformat()
        }


@dataclass
class AuctionSettings:
    """拍卖设置模型"""
    id: str
    user_id: str
    default_duration_hours: int
    default_bid_increment: float
    auto_extend_enabled: bool
    extend_minutes: int
    notification_preferences: Dict[str, bool]
    proxy_bidding_enabled: bool
    created_at: datetime
    updated_at: datetime
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'default_duration_hours': self.default_duration_hours,
            'default_bid_increment': self.default_bid_increment,
            'auto_extend_enabled': self.auto_extend_enabled,
            'extend_minutes': self.extend_minutes,
            'notification_preferences': self.notification_preferences,
            'proxy_bidding_enabled': self.proxy_bidding_enabled,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }


@dataclass
class AuctionAnalytics:
    """拍卖分析数据模型"""
    id: str
    auction_id: str
    total_views: int
    unique_viewers: int
    total_watchers: int
    bid_activity: List[Dict[str, Any]]  # 出价活动时间线
    price_progression: List[Dict[str, Any]]  # 价格变化
    bidder_analysis: Dict[str, Any]  # 出价者分析
    performance_metrics: Dict[str, Any]  # 性能指标
    last_updated: datetime
    
    def to_dict(self):
        return {
            'id': self.id,
            'auction_id': self.auction_id,
            'total_views': self.total_views,
            'unique_viewers': self.unique_viewers,
            'total_watchers': self.total_watchers,
            'bid_activity': self.bid_activity,
            'price_progression': self.price_progression,
            'bidder_analysis': self.bidder_analysis,
            'performance_metrics': self.performance_metrics,
            'last_updated': self.last_updated.isoformat()
        }


@dataclass
class AuctionTemplate:
    """拍卖模板模型"""
    id: str
    name: str
    description: str
    creator_id: str
    template_data: Dict[str, Any]
    category: str  # 'art', 'collectible', 'gaming'
    is_public: bool
    usage_count: int
    created_at: datetime
    updated_at: datetime
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'creator_id': self.creator_id,
            'template_data': self.template_data,
            'category': self.category,
            'is_public': self.is_public,
            'usage_count': self.usage_count,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }


@dataclass
class BidderProfile:
    """出价者档案模型"""
    id: str
    user_id: str
    total_bids: int
    successful_bids: int
    total_spent: float
    average_bid_amount: float
    favorite_categories: List[str]
    bidding_patterns: Dict[str, Any]
    reputation_score: float
    last_activity: datetime
    created_at: datetime
    updated_at: datetime
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'total_bids': self.total_bids,
            'successful_bids': self.successful_bids,
            'total_spent': self.total_spent,
            'average_bid_amount': self.average_bid_amount,
            'favorite_categories': self.favorite_categories,
            'bidding_patterns': self.bidding_patterns,
            'reputation_score': self.reputation_score,
            'last_activity': self.last_activity.isoformat(),
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

