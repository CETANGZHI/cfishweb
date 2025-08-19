from . import db, BaseModel
from sqlalchemy import Index

class User(BaseModel):
    """User model for CFISH platform"""
    __tablename__ = 'users'
    
    wallet_address = db.Column(db.String(44), unique=True, nullable=False, index=True)
    username = db.Column(db.String(50), unique=True, nullable=True, index=True)
    display_name = db.Column(db.String(100), nullable=True)
    email = db.Column(db.String(255), nullable=True)
    bio = db.Column(db.Text, nullable=True)
    avatar_url = db.Column(db.Text, nullable=True)
    banner_url = db.Column(db.Text, nullable=True)
    verified = db.Column(db.Boolean, default=False)
    followers_count = db.Column(db.Integer, default=0)
    following_count = db.Column(db.Integer, default=0)
    total_sales = db.Column(db.Numeric(20, 9), default=0)
    nfts_owned_count = db.Column(db.Integer, default=0)
    nfts_created_count = db.Column(db.Integer, default=0)
    last_active = db.Column(db.DateTime, default=db.func.current_timestamp())
    status = db.Column(db.String(20), default='active', index=True)  # active, suspended, banned
    
    # Relationships
    social_links = db.relationship('UserSocialLink', backref='user', lazy='dynamic', cascade='all, delete-orphan')
    notifications = db.relationship('Notification', backref='user', lazy='dynamic', cascade='all, delete-orphan')
    
    # Additional indexes for performance optimization
    __table_args__ = (
        Index('idx_user_verified_status', 'verified', 'status'),
        Index('idx_user_last_active', 'last_active'),
        Index('idx_user_total_sales', 'total_sales'),
        Index('idx_user_followers_count', 'followers_count'),
    )
    
    def __repr__(self):
        return f'<User {self.wallet_address}>'
    
    def to_dict(self, include_sensitive=False):
        """Convert user to dictionary"""
        result = super().to_dict()
        
        # Add social links
        result['social_links'] = {}
        for link in self.social_links:
            result['social_links'][link.platform] = link.url
        
        # Remove sensitive information unless explicitly requested
        if not include_sensitive:
            result.pop('email', None)
        
        return result

class UserSocialLink(BaseModel):
    """User social media links"""
    __tablename__ = 'user_social_links'
    
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False, index=True)
    platform = db.Column(db.String(50), nullable=False)  # twitter, instagram, website, discord
    url = db.Column(db.Text, nullable=False)
    verified = db.Column(db.Boolean, default=False)
    
    __table_args__ = (
        Index('idx_user_social_platform', 'user_id', 'platform'),
    )

class UserFollow(BaseModel):
    """User follow relationships"""
    __tablename__ = 'user_follows'
    
    follower_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False, index=True)
    following_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False, index=True)
    
    # Relationships
    follower = db.relationship('User', foreign_keys=[follower_id], backref='following_relationships')
    following = db.relationship('User', foreign_keys=[following_id], backref='follower_relationships')
    
    __table_args__ = (
        db.UniqueConstraint('follower_id', 'following_id', name='unique_follow_relationship'),
        Index('idx_follow_follower', 'follower_id'),
        Index('idx_follow_following', 'following_id'),
    )

