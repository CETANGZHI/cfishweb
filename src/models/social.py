from . import db, BaseModel
from sqlalchemy import Index

class UserLike(BaseModel):
    """User likes for NFTs and comments"""
    __tablename__ = 'user_likes'
    
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False, index=True)
    target_type = db.Column(db.String(20), nullable=False)  # nft, comment
    target_id = db.Column(db.String(36), nullable=False)
    
    # Relationships
    user = db.relationship('User', backref='likes')
    
    def __repr__(self):
        return f'<UserLike {self.user_id} -> {self.target_type}:{self.target_id}>'
    
    __table_args__ = (
        db.UniqueConstraint('user_id', 'target_type', 'target_id', name='unique_user_like'),
        Index('idx_like_target', 'target_type', 'target_id'),
    )

class Comment(BaseModel):
    """Comments on NFTs and users"""
    __tablename__ = 'comments'
    
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False, index=True)
    target_type = db.Column(db.String(20), nullable=False)  # nft, user
    target_id = db.Column(db.String(36), nullable=False)
    parent_id = db.Column(db.String(36), db.ForeignKey('comments.id'), nullable=True, index=True)  # 用于回复
    content = db.Column(db.Text, nullable=False)
    likes_count = db.Column(db.Integer, default=0)
    replies_count = db.Column(db.Integer, default=0)
    status = db.Column(db.String(20), default='active')  # active, deleted, hidden
    
    # Relationships
    user = db.relationship('User', backref='comments')
    parent = db.relationship('Comment', remote_side='Comment.id', backref='replies')
    
    def __repr__(self):
        return f'<Comment by {self.user_id} on {self.target_type}:{self.target_id}>'
    
    def to_dict(self, include_user=True, include_replies=False):
        """Convert comment to dictionary"""
        result = super().to_dict()
        
        # Add user information
        if include_user and self.user:
            result['username'] = self.user.display_name or self.user.username or self.user.wallet_address[:8] + '...'
            result['user_avatar'] = self.user.avatar_url
            result['user_verified'] = self.user.verified
        
        # Add replies if requested
        if include_replies and self.replies:
            result['replies'] = [reply.to_dict(include_user=True, include_replies=False) for reply in self.replies if reply.status == 'active']
        
        return result
    
    __table_args__ = (
        Index('idx_comment_target', 'target_type', 'target_id'),
        Index('idx_comment_created_at', 'created_at'),
    )

