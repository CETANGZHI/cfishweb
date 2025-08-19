from . import db, BaseModel
from sqlalchemy import Index

class Notification(BaseModel):
    """Notification model for CFISH platform"""
    __tablename__ = 'notifications'
    
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False, index=True)
    type = db.Column(db.String(50), nullable=False, index=True)  # bid_received, nft_sold, follow, like, comment等
    title = db.Column(db.String(200), nullable=False)
    message = db.Column(db.Text, nullable=False)
    data = db.Column(db.JSON, nullable=True)  # 存储额外的结构化数据
    read = db.Column(db.Boolean, default=False, index=True)
    
    def __repr__(self):
        return f'<Notification {self.type} for {self.user_id}>'
    
    def to_dict(self):
        """Convert notification to dictionary"""
        result = super().to_dict()
        return result
    
    __table_args__ = (
        Index('idx_notification_user_read', 'user_id', 'read'),
        Index('idx_notification_created_at', 'created_at'),
    )

class NotificationSetting(BaseModel):
    """Notification settings for users"""
    __tablename__ = 'notification_settings'
    
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False, unique=True, index=True)
    sound_enabled = db.Column(db.Boolean, default=True)
    push_enabled = db.Column(db.Boolean, default=True)
    email_enabled = db.Column(db.Boolean, default=False)
    sms_enabled = db.Column(db.Boolean, default=False)
    nft_sold_enabled = db.Column(db.Boolean, default=True)
    nft_purchased_enabled = db.Column(db.Boolean, default=True)
    bid_received_enabled = db.Column(db.Boolean, default=True)
    bid_outbid_enabled = db.Column(db.Boolean, default=True)
    auction_ending_enabled = db.Column(db.Boolean, default=True)
    follow_enabled = db.Column(db.Boolean, default=True)
    like_enabled = db.Column(db.Boolean, default=False)
    comment_enabled = db.Column(db.Boolean, default=True)
    
    def __repr__(self):
        return f'<NotificationSetting for {self.user_id}>'
    
    def to_dict(self):
        """Convert notification settings to dictionary"""
        result = super().to_dict()
        
        # Group settings by category
        result['types'] = {
            'nft_sold': self.nft_sold_enabled,
            'nft_purchased': self.nft_purchased_enabled,
            'bid_received': self.bid_received_enabled,
            'bid_outbid': self.bid_outbid_enabled,
            'auction_ending': self.auction_ending_enabled,
            'follow': self.follow_enabled,
            'like': self.like_enabled,
            'comment': self.comment_enabled,
        }
        
        return result

