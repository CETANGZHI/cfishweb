"""
Wallet models for CFISH backend API
"""

from datetime import datetime
from . import db


class WalletBalance(db.Model):
    """钱包余额模型"""
    __tablename__ = 'wallet_balances'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    token_address = db.Column(db.String(100), nullable=False)  # 代币合约地址
    token_symbol = db.Column(db.String(20), nullable=False)  # 代币符号 (SOL, CFISH, etc.)
    token_name = db.Column(db.String(100), nullable=False)  # 代币名称
    balance = db.Column(db.Float, default=0.0)  # 余额
    locked_balance = db.Column(db.Float, default=0.0)  # 锁定余额
    last_updated = db.Column(db.DateTime, default=datetime.utcnow)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # 唯一约束：每个用户每个代币只能有一条余额记录
    __table_args__ = (db.UniqueConstraint('user_id', 'token_address', name='unique_user_token_balance'),)
    
    # 关系
    user = db.relationship('User', backref='wallet_balances')


class TransactionRecord(db.Model):
    """交易记录模型"""
    __tablename__ = 'transaction_records'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    transaction_hash = db.Column(db.String(100), nullable=False, unique=True)
    transaction_type = db.Column(db.String(50), nullable=False)  # 'send', 'receive', 'swap', 'stake', 'unstake', 'nft_purchase', 'nft_sale'
    from_address = db.Column(db.String(100))  # 发送方地址
    to_address = db.Column(db.String(100))  # 接收方地址
    token_address = db.Column(db.String(100))  # 代币合约地址
    token_symbol = db.Column(db.String(20))  # 代币符号
    amount = db.Column(db.Float, default=0.0)  # 交易金额
    fee = db.Column(db.Float, default=0.0)  # 交易手续费
    status = db.Column(db.String(20), default='pending')  # 'pending', 'confirmed', 'failed'
    block_number = db.Column(db.Integer)  # 区块号
    block_timestamp = db.Column(db.DateTime)  # 区块时间戳
    gas_used = db.Column(db.Integer)  # 消耗的Gas
    gas_price = db.Column(db.Float)  # Gas价格
    nft_id = db.Column(db.Integer, db.ForeignKey('nfts.id'))  # 关联的NFT ID（如果是NFT交易）
    description = db.Column(db.Text)  # 交易描述
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # 关系
    user = db.relationship('User', backref='transaction_records')
    nft = db.relationship('NFT', backref='related_transactions')


class WalletConnection(db.Model):
    """钱包连接记录模型"""
    __tablename__ = 'wallet_connections'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    wallet_address = db.Column(db.String(100), nullable=False)
    wallet_type = db.Column(db.String(50), nullable=False)  # 'phantom', 'solflare', 'metamask', etc.
    is_primary = db.Column(db.Boolean, default=False)  # 是否为主钱包
    is_active = db.Column(db.Boolean, default=True)
    last_connected = db.Column(db.DateTime, default=datetime.utcnow)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # 关系
    user = db.relationship('User', backref='wallet_connections')


class PaymentMethod(db.Model):
    """支付方式模型"""
    __tablename__ = 'payment_methods'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    method_type = db.Column(db.String(50), nullable=False)  # 'crypto', 'credit_card', 'bank_transfer', 'paypal'
    method_name = db.Column(db.String(100), nullable=False)  # 支付方式名称
    details = db.Column(db.JSON)  # 支付方式详细信息（加密存储）
    is_default = db.Column(db.Boolean, default=False)  # 是否为默认支付方式
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # 关系
    user = db.relationship('User', backref='payment_methods')


class WalletActivity(db.Model):
    """钱包活动记录模型"""
    __tablename__ = 'wallet_activities'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    activity_type = db.Column(db.String(50), nullable=False)  # 'login', 'transaction', 'balance_update', 'connection'
    description = db.Column(db.Text)  # 活动描述
    metadata = db.Column(db.JSON)  # 活动相关的元数据
    ip_address = db.Column(db.String(45))  # IP地址
    user_agent = db.Column(db.Text)  # 用户代理
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # 关系
    user = db.relationship('User', backref='wallet_activities')


class TokenInfo(db.Model):
    """代币信息模型"""
    __tablename__ = 'token_info'
    
    id = db.Column(db.Integer, primary_key=True)
    token_address = db.Column(db.String(100), nullable=False, unique=True)
    token_symbol = db.Column(db.String(20), nullable=False)
    token_name = db.Column(db.String(100), nullable=False)
    decimals = db.Column(db.Integer, default=18)
    logo_url = db.Column(db.String(500))  # 代币Logo URL
    price_usd = db.Column(db.Float, default=0.0)  # USD价格
    market_cap = db.Column(db.Float, default=0.0)  # 市值
    total_supply = db.Column(db.Float, default=0.0)  # 总供应量
    circulating_supply = db.Column(db.Float, default=0.0)  # 流通供应量
    is_verified = db.Column(db.Boolean, default=False)  # 是否已验证
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

