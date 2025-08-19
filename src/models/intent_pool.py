"""
Intent Pool models for CFISH backend API
"""

from datetime import datetime
from . import db


class Intent(db.Model):
    """意图模型"""
    __tablename__ = 'intents'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    intent_type = db.Column(db.String(50), nullable=False)  # 'buy', 'sell', 'trade', 'rent', 'lend'
    title = db.Column(db.String(200), nullable=False)  # 意图标题
    description = db.Column(db.Text)  # 意图描述
    status = db.Column(db.String(20), default='active')  # 'active', 'matched', 'completed', 'cancelled', 'expired'
    priority = db.Column(db.String(10), default='medium')  # 'low', 'medium', 'high', 'urgent'
    
    # NFT相关字段
    target_nft_id = db.Column(db.Integer, db.ForeignKey('nfts.id'))  # 目标NFT（如果是特定NFT）
    nft_category = db.Column(db.String(50))  # NFT类别
    nft_rarity = db.Column(db.String(20))  # NFT稀有度
    nft_attributes = db.Column(db.JSON)  # NFT属性要求
    
    # 价格相关字段
    min_price = db.Column(db.Float)  # 最低价格
    max_price = db.Column(db.Float)  # 最高价格
    preferred_price = db.Column(db.Float)  # 期望价格
    price_currency = db.Column(db.String(20), default='SOL')  # 价格货币
    
    # 时间相关字段
    expires_at = db.Column(db.DateTime)  # 过期时间
    preferred_completion_time = db.Column(db.DateTime)  # 期望完成时间
    
    # 匹配相关字段
    auto_match = db.Column(db.Boolean, default=False)  # 是否自动匹配
    match_threshold = db.Column(db.Float, default=0.8)  # 匹配阈值
    
    # 其他字段
    tags = db.Column(db.JSON)  # 标签
    metadata = db.Column(db.JSON)  # 额外的元数据
    is_public = db.Column(db.Boolean, default=True)  # 是否公开
    view_count = db.Column(db.Integer, default=0)  # 查看次数
    match_count = db.Column(db.Integer, default=0)  # 匹配次数
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # 关系
    user = db.relationship('User', backref='intents')
    target_nft = db.relationship('NFT', backref='intent_targets')
    matches = db.relationship('IntentMatch', backref='intent', lazy=True)
    responses = db.relationship('IntentResponse', backref='intent', lazy=True)


class IntentMatch(db.Model):
    """意图匹配模型"""
    __tablename__ = 'intent_matches'
    
    id = db.Column(db.Integer, primary_key=True)
    intent_id = db.Column(db.Integer, db.ForeignKey('intents.id'), nullable=False)
    matched_intent_id = db.Column(db.Integer, db.ForeignKey('intents.id'))  # 匹配的意图
    matched_nft_id = db.Column(db.Integer, db.ForeignKey('nfts.id'))  # 匹配的NFT
    matcher_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)  # 匹配者
    
    match_type = db.Column(db.String(20), nullable=False)  # 'intent_to_intent', 'intent_to_nft', 'manual'
    match_score = db.Column(db.Float, default=0.0)  # 匹配分数
    match_reason = db.Column(db.Text)  # 匹配原因
    
    status = db.Column(db.String(20), default='pending')  # 'pending', 'accepted', 'rejected', 'completed'
    
    # 交易相关字段
    agreed_price = db.Column(db.Float)  # 协商价格
    agreed_currency = db.Column(db.String(20))  # 协商货币
    transaction_hash = db.Column(db.String(100))  # 交易哈希
    
    # 时间字段
    matched_at = db.Column(db.DateTime, default=datetime.utcnow)
    accepted_at = db.Column(db.DateTime)
    completed_at = db.Column(db.DateTime)
    
    # 关系
    matched_intent = db.relationship('Intent', foreign_keys=[matched_intent_id], backref='reverse_matches')
    matched_nft = db.relationship('NFT', backref='intent_matches')
    matcher = db.relationship('User', backref='intent_matches')


class IntentResponse(db.Model):
    """意图响应模型"""
    __tablename__ = 'intent_responses'
    
    id = db.Column(db.Integer, primary_key=True)
    intent_id = db.Column(db.Integer, db.ForeignKey('intents.id'), nullable=False)
    responder_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    offered_nft_id = db.Column(db.Integer, db.ForeignKey('nfts.id'))  # 提供的NFT
    offered_price = db.Column(db.Float)  # 提供的价格
    offered_currency = db.Column(db.String(20))  # 提供的货币
    message = db.Column(db.Text)  # 响应消息
    status = db.Column(db.String(20), default='pending')  # 'pending', 'accepted', 'rejected'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # 关系
    responder = db.relationship('User', backref='intent_responses')
    offered_nft = db.relationship('NFT', backref='intent_response_offers')


class IntentPool(db.Model):
    """意图池模型"""
    __tablename__ = 'intent_pools'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)  # 池名称
    description = db.Column(db.Text)  # 池描述
    pool_type = db.Column(db.String(20), default='public')  # 'public', 'private', 'curated'
    category = db.Column(db.String(50))  # 池类别
    
    # 池设置
    auto_matching_enabled = db.Column(db.Boolean, default=True)  # 是否启用自动匹配
    min_match_score = db.Column(db.Float, default=0.7)  # 最低匹配分数
    max_intents_per_user = db.Column(db.Integer, default=10)  # 每用户最大意图数
    
    # 访问控制
    is_public = db.Column(db.Boolean, default=True)  # 是否公开
    requires_approval = db.Column(db.Boolean, default=False)  # 是否需要审批
    
    # 统计字段
    total_intents = db.Column(db.Integer, default=0)  # 总意图数
    active_intents = db.Column(db.Integer, default=0)  # 活跃意图数
    total_matches = db.Column(db.Integer, default=0)  # 总匹配数
    successful_matches = db.Column(db.Integer, default=0)  # 成功匹配数
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # 关系
    memberships = db.relationship('IntentPoolMembership', backref='pool', lazy=True)


class IntentPoolMembership(db.Model):
    """意图池成员模型"""
    __tablename__ = 'intent_pool_memberships'
    
    id = db.Column(db.Integer, primary_key=True)
    pool_id = db.Column(db.Integer, db.ForeignKey('intent_pools.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    role = db.Column(db.String(20), default='member')  # 'member', 'moderator', 'admin'
    status = db.Column(db.String(20), default='active')  # 'active', 'suspended', 'banned'
    joined_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # 唯一约束：每个用户每个池只能有一个成员记录
    __table_args__ = (db.UniqueConstraint('pool_id', 'user_id', name='unique_pool_membership'),)
    
    # 关系
    user = db.relationship('User', backref='pool_memberships')


class IntentAlert(db.Model):
    """意图提醒模型"""
    __tablename__ = 'intent_alerts'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    alert_name = db.Column(db.String(100), nullable=False)  # 提醒名称
    alert_type = db.Column(db.String(20), nullable=False)  # 'new_match', 'price_change', 'new_intent'
    
    # 匹配条件
    nft_category = db.Column(db.String(50))  # NFT类别
    nft_rarity = db.Column(db.String(20))  # NFT稀有度
    min_price = db.Column(db.Float)  # 最低价格
    max_price = db.Column(db.Float)  # 最高价格
    keywords = db.Column(db.JSON)  # 关键词
    
    # 提醒设置
    is_active = db.Column(db.Boolean, default=True)  # 是否激活
    notification_method = db.Column(db.String(20), default='in_app')  # 'in_app', 'email', 'push'
    frequency = db.Column(db.String(20), default='immediate')  # 'immediate', 'daily', 'weekly'
    
    # 统计字段
    trigger_count = db.Column(db.Integer, default=0)  # 触发次数
    last_triggered = db.Column(db.DateTime)  # 上次触发时间
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # 关系
    user = db.relationship('User', backref='intent_alerts')


class IntentHistory(db.Model):
    """意图历史记录模型"""
    __tablename__ = 'intent_history'
    
    id = db.Column(db.Integer, primary_key=True)
    intent_id = db.Column(db.Integer, db.ForeignKey('intents.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    action = db.Column(db.String(50), nullable=False)  # 'created', 'updated', 'matched', 'completed', 'cancelled'
    description = db.Column(db.Text)  # 操作描述
    old_data = db.Column(db.JSON)  # 旧数据
    new_data = db.Column(db.JSON)  # 新数据
    metadata = db.Column(db.JSON)  # 额外的元数据
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # 关系
    intent = db.relationship('Intent', backref='history')
    user = db.relationship('User', backref='intent_history')

