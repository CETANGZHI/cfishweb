"""
Barter models for CFISH backend API
"""

from datetime import datetime
from . import db


class BarterRequest(db.Model):
    """易货请求模型"""
    __tablename__ = 'barter_requests'
    
    id = db.Column(db.Integer, primary_key=True)
    requester_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)  # 发起人
    target_user_id = db.Column(db.Integer, db.ForeignKey('users.id'))  # 目标用户（可选）
    offered_nft_id = db.Column(db.Integer, db.ForeignKey('nfts.id'), nullable=False)  # 提供的NFT
    requested_nft_id = db.Column(db.Integer, db.ForeignKey('nfts.id'))  # 请求的NFT（可选）
    title = db.Column(db.String(200), nullable=False)  # 易货标题
    description = db.Column(db.Text)  # 易货描述
    request_type = db.Column(db.String(20), default='specific')  # 'specific', 'open'
    status = db.Column(db.String(20), default='active')  # 'active', 'matched', 'completed', 'cancelled', 'expired'
    expires_at = db.Column(db.DateTime)  # 过期时间
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # 关系
    requester = db.relationship('User', foreign_keys=[requester_id], backref='barter_requests_sent')
    target_user = db.relationship('User', foreign_keys=[target_user_id], backref='barter_requests_received')
    offered_nft = db.relationship('NFT', foreign_keys=[offered_nft_id], backref='barter_offers')
    requested_nft = db.relationship('NFT', foreign_keys=[requested_nft_id], backref='barter_requests')
    responses = db.relationship('BarterResponse', backref='request', lazy=True)


class BarterResponse(db.Model):
    """易货响应模型"""
    __tablename__ = 'barter_responses'
    
    id = db.Column(db.Integer, primary_key=True)
    request_id = db.Column(db.Integer, db.ForeignKey('barter_requests.id'), nullable=False)
    responder_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)  # 响应人
    offered_nft_id = db.Column(db.Integer, db.ForeignKey('nfts.id'), nullable=False)  # 响应人提供的NFT
    message = db.Column(db.Text)  # 响应消息
    status = db.Column(db.String(20), default='pending')  # 'pending', 'accepted', 'rejected'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # 关系
    responder = db.relationship('User', backref='barter_responses')
    offered_nft = db.relationship('NFT', backref='barter_response_offers')


class BarterMatch(db.Model):
    """易货匹配模型"""
    __tablename__ = 'barter_matches'
    
    id = db.Column(db.Integer, primary_key=True)
    request_id = db.Column(db.Integer, db.ForeignKey('barter_requests.id'), nullable=False)
    response_id = db.Column(db.Integer, db.ForeignKey('barter_responses.id'), nullable=False)
    requester_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    responder_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    requester_nft_id = db.Column(db.Integer, db.ForeignKey('nfts.id'), nullable=False)  # 请求人的NFT
    responder_nft_id = db.Column(db.Integer, db.ForeignKey('nfts.id'), nullable=False)  # 响应人的NFT
    status = db.Column(db.String(20), default='matched')  # 'matched', 'in_progress', 'completed', 'failed'
    requester_confirmed = db.Column(db.Boolean, default=False)  # 请求人确认
    responder_confirmed = db.Column(db.Boolean, default=False)  # 响应人确认
    transaction_hash = db.Column(db.String(100))  # 交易哈希
    completed_at = db.Column(db.DateTime)  # 完成时间
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # 关系
    request = db.relationship('BarterRequest', backref='matches')
    response = db.relationship('BarterResponse', backref='matches')
    requester = db.relationship('User', foreign_keys=[requester_id], backref='barter_matches_as_requester')
    responder = db.relationship('User', foreign_keys=[responder_id], backref='barter_matches_as_responder')
    requester_nft = db.relationship('NFT', foreign_keys=[requester_nft_id], backref='barter_matches_as_requester_nft')
    responder_nft = db.relationship('NFT', foreign_keys=[responder_nft_id], backref='barter_matches_as_responder_nft')


class BarterHistory(db.Model):
    """易货历史记录模型"""
    __tablename__ = 'barter_history'
    
    id = db.Column(db.Integer, primary_key=True)
    match_id = db.Column(db.Integer, db.ForeignKey('barter_matches.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    action = db.Column(db.String(50), nullable=False)  # 'created', 'responded', 'accepted', 'confirmed', 'completed', 'cancelled'
    description = db.Column(db.Text)  # 操作描述
    metadata = db.Column(db.JSON)  # 额外的元数据
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # 关系
    match = db.relationship('BarterMatch', backref='history')
    user = db.relationship('User', backref='barter_history')


class BarterPreference(db.Model):
    """易货偏好设置模型"""
    __tablename__ = 'barter_preferences'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, unique=True)
    auto_accept_similar_value = db.Column(db.Boolean, default=False)  # 自动接受相似价值的易货
    value_tolerance_percent = db.Column(db.Float, default=10.0)  # 价值容忍度百分比
    preferred_categories = db.Column(db.JSON)  # 偏好的NFT类别
    excluded_categories = db.Column(db.JSON)  # 排除的NFT类别
    min_rarity_level = db.Column(db.String(20))  # 最低稀有度要求
    notification_enabled = db.Column(db.Boolean, default=True)  # 是否启用通知
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # 关系
    user = db.relationship('User', backref='barter_preference')

