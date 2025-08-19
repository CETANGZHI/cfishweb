from . import db, BaseModel
from sqlalchemy import Index

class NFT(BaseModel):
    """NFT model for CFISH platform"""
    __tablename__ = 'nfts'
    
    token_id = db.Column(db.String(100), nullable=True)  # 链上Token ID
    contract_address = db.Column(db.String(44), nullable=True)  # 智能合约地址
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    creator_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False, index=True)
    current_owner_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False, index=True)
    category = db.Column(db.String(50), nullable=False, index=True)
    price = db.Column(db.Numeric(20, 9), nullable=True)
    price_currency = db.Column(db.String(10), default='SOL')  # SOL, CFISH等
    price_type = db.Column(db.String(20), default='fixed')  # fixed, auction, barter
    rarity = db.Column(db.String(20), nullable=True)  # Common, Uncommon, Rare, Epic, Legendary
    sharer_commission = db.Column(db.Numeric(5, 2), default=0)  # 分享者佣金百分比
    platform_fee = db.Column(db.Numeric(5, 2), default=2.5)  # 平台手续费百分比
    likes_count = db.Column(db.Integer, default=0)
    views_count = db.Column(db.Integer, default=0)
    comments_count = db.Column(db.Integer, default=0)
    image_ipfs_cid = db.Column(db.String(100), nullable=True)  # IPFS CID for image
    metadata_ipfs_cid = db.Column(db.String(100), nullable=True)  # IPFS CID for metadata JSON
    audio_ipfs_cid = db.Column(db.String(100), nullable=True)  # 音频文件的IPFS CID
    video_ipfs_cid = db.Column(db.String(100), nullable=True)  # 视频文件的IPFS CID
    auction_end_time = db.Column(db.DateTime, nullable=True)  # 拍卖结束时间
    current_bid = db.Column(db.Numeric(20, 9), nullable=True)  # 当前最高出价
    bidders_count = db.Column(db.Integer, default=0)
    status = db.Column(db.String(20), default='active', index=True)  # active, sold, removed, pending
    minted_at = db.Column(db.DateTime, nullable=True)
    listed_at = db.Column(db.DateTime, nullable=True)
    
    # Relationships
    creator = db.relationship('User', foreign_keys=[creator_id], backref='created_nfts')
    current_owner = db.relationship('User', foreign_keys=[current_owner_id], backref='owned_nfts')
    tags = db.relationship('NFTTag', backref='nft', lazy='dynamic', cascade='all, delete-orphan')
    properties = db.relationship('NFTProperty', backref='nft', lazy='dynamic', cascade='all, delete-orphan')
    transaction_history = db.relationship('TransactionHistory', backref='nft', lazy='dynamic', cascade='all, delete-orphan')
    
    # Additional indexes for performance optimization
    __table_args__ = (
        Index('idx_nft_price_range', 'price', 'price_currency'),
        Index('idx_nft_category_status', 'category', 'status'),
        Index('idx_nft_rarity_category', 'rarity', 'category'),
        Index('idx_nft_likes_views', 'likes_count', 'views_count'),
        Index('idx_nft_creator_status', 'creator_id', 'status'),
        Index('idx_nft_owner_status', 'current_owner_id', 'status'),
        Index('idx_nft_auction_end', 'auction_end_time'),
        Index('idx_nft_listed_at', 'listed_at'),
        Index('idx_nft_minted_at', 'minted_at'),
    )
    
    def __repr__(self):
        return f'<NFT {self.title}>'
    
    def to_dict(self, include_creator=True, include_owner=True):
        """Convert NFT to dictionary"""
        result = super().to_dict()
        
        # Add creator information
        if include_creator and self.creator:
            result['creator'] = self.creator.display_name or self.creator.username or self.creator.wallet_address[:8] + '...'
            result['creator_avatar'] = self.creator.avatar_url
        
        # Add current owner information
        if include_owner and self.current_owner:
            result['current_owner'] = self.current_owner.display_name or self.current_owner.username or self.current_owner.wallet_address[:8] + '...'
        
        # Add tags
        result['tags'] = [tag.tag for tag in self.tags]
        
        # Add properties
        result['properties'] = [prop.to_dict() for prop in self.properties]
        
        # Format price
        if self.price:
            result['price_formatted'] = f"{self.price} {self.price_currency}"
        
        # Add IPFS URLs
        if self.image_ipfs_cid:
            result['image_url'] = f"https://gateway.pinata.cloud/ipfs/{self.image_ipfs_cid}"
        if self.audio_ipfs_cid:
            result['audio_url'] = f"https://gateway.pinata.cloud/ipfs/{self.audio_ipfs_cid}"
        if self.video_ipfs_cid:
            result['video_url'] = f"https://gateway.pinata.cloud/ipfs/{self.video_ipfs_cid}"
        
        return result

class NFTTag(BaseModel):
    """NFT tags"""
    __tablename__ = 'nft_tags'
    
    nft_id = db.Column(db.String(36), db.ForeignKey('nfts.id'), nullable=False, index=True)
    tag = db.Column(db.String(50), nullable=False, index=True)
    
    __table_args__ = (
        Index('idx_nft_tag_combination', 'nft_id', 'tag'),
    )

class NFTProperty(BaseModel):
    """NFT properties/traits"""
    __tablename__ = 'nft_properties'
    
    nft_id = db.Column(db.String(36), db.ForeignKey('nfts.id'), nullable=False, index=True)
    trait_type = db.Column(db.String(100), nullable=False)
    trait_value = db.Column(db.String(200), nullable=False)
    rarity_percentage = db.Column(db.Numeric(5, 2), nullable=True)  # 稀有度百分比
    
    def to_dict(self):
        """Convert property to dictionary"""
        return {
            'trait': self.trait_type,
            'value': self.trait_value,
            'rarity': f"{self.rarity_percentage}%" if self.rarity_percentage else None
        }
    
    __table_args__ = (
        Index('idx_nft_property_trait', 'trait_type', 'trait_value'),
    )

class TransactionHistory(BaseModel):
    """Transaction history for NFTs"""
    __tablename__ = 'transaction_history'
    
    nft_id = db.Column(db.String(36), db.ForeignKey('nfts.id'), nullable=False, index=True)
    transaction_hash = db.Column(db.String(100), nullable=True)  # 区块链交易哈希
    event_type = db.Column(db.String(50), nullable=False)  # minted, listed, sold, transferred, bid_placed等
    from_user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=True, index=True)
    to_user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=True, index=True)
    price = db.Column(db.Numeric(20, 9), nullable=True)
    price_currency = db.Column(db.String(10), nullable=True)
    gas_fee = db.Column(db.Numeric(20, 9), nullable=True)
    block_number = db.Column(db.BigInteger, nullable=True)
    transaction_date = db.Column(db.DateTime, nullable=False)
    
    # Relationships
    from_user = db.relationship('User', foreign_keys=[from_user_id], backref='sent_transactions')
    to_user = db.relationship('User', foreign_keys=[to_user_id], backref='received_transactions')
    
    def to_dict(self):
        """Convert transaction to dictionary"""
        result = super().to_dict()
        
        # Add user information
        if self.from_user:
            result['from'] = self.from_user.display_name or self.from_user.username or self.from_user.wallet_address[:8] + '...'
        if self.to_user:
            result['to'] = self.to_user.display_name or self.to_user.username or self.to_user.wallet_address[:8] + '...'
        
        # Format price
        if self.price and self.price_currency:
            result['price_formatted'] = f"{self.price} {self.price_currency}"
        
        return result
    
    __table_args__ = (
        Index('idx_transaction_date', 'transaction_date'),
        Index('idx_transaction_event_type', 'event_type'),
        Index('idx_transaction_price', 'price'),
    )

