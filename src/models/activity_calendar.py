"""
Activity Calendar models for CFISH backend API
"""

from datetime import datetime
from . import db


class Activity(db.Model):
    """活动模型"""
    __tablename__ = 'activities'
    
    id = db.Column(db.Integer, primary_key=True)
    organizer_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)  # 组织者
    title = db.Column(db.String(200), nullable=False)  # 活动标题
    description = db.Column(db.Text)  # 活动描述
    activity_type = db.Column(db.String(50), nullable=False)  # 'auction', 'drop', 'exhibition', 'contest', 'community'
    category = db.Column(db.String(50))  # 活动类别
    status = db.Column(db.String(20), default='upcoming')  # 'upcoming', 'ongoing', 'completed', 'cancelled'
    start_time = db.Column(db.DateTime, nullable=False)  # 开始时间
    end_time = db.Column(db.DateTime, nullable=False)  # 结束时间
    timezone = db.Column(db.String(50), default='UTC')  # 时区
    location = db.Column(db.String(200))  # 地点（虚拟或实体）
    max_participants = db.Column(db.Integer)  # 最大参与人数
    current_participants = db.Column(db.Integer, default=0)  # 当前参与人数
    registration_required = db.Column(db.Boolean, default=False)  # 是否需要注册
    registration_deadline = db.Column(db.DateTime)  # 注册截止时间
    entry_fee = db.Column(db.Float, default=0.0)  # 参与费用
    prize_pool = db.Column(db.Float, default=0.0)  # 奖池
    banner_image_url = db.Column(db.String(500))  # 横幅图片URL
    tags = db.Column(db.JSON)  # 标签
    metadata = db.Column(db.JSON)  # 额外的元数据
    is_featured = db.Column(db.Boolean, default=False)  # 是否为精选活动
    is_public = db.Column(db.Boolean, default=True)  # 是否公开
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # 关系
    organizer = db.relationship('User', backref='organized_activities')
    participants = db.relationship('ActivityParticipant', backref='activity', lazy=True)
    updates = db.relationship('ActivityUpdate', backref='activity', lazy=True)


class ActivityParticipant(db.Model):
    """活动参与者模型"""
    __tablename__ = 'activity_participants'
    
    id = db.Column(db.Integer, primary_key=True)
    activity_id = db.Column(db.Integer, db.ForeignKey('activities.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    registration_status = db.Column(db.String(20), default='registered')  # 'registered', 'confirmed', 'cancelled', 'attended'
    registration_time = db.Column(db.DateTime, default=datetime.utcnow)
    payment_status = db.Column(db.String(20), default='pending')  # 'pending', 'paid', 'refunded'
    payment_transaction_hash = db.Column(db.String(100))  # 支付交易哈希
    notes = db.Column(db.Text)  # 备注
    metadata = db.Column(db.JSON)  # 额外的元数据
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # 唯一约束：每个用户每个活动只能参与一次
    __table_args__ = (db.UniqueConstraint('activity_id', 'user_id', name='unique_activity_participant'),)
    
    # 关系
    user = db.relationship('User', backref='activity_participations')


class ActivityUpdate(db.Model):
    """活动更新模型"""
    __tablename__ = 'activity_updates'
    
    id = db.Column(db.Integer, primary_key=True)
    activity_id = db.Column(db.Integer, db.ForeignKey('activities.id'), nullable=False)
    author_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False)  # 更新标题
    content = db.Column(db.Text, nullable=False)  # 更新内容
    update_type = db.Column(db.String(20), default='general')  # 'general', 'important', 'reminder', 'result'
    is_pinned = db.Column(db.Boolean, default=False)  # 是否置顶
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # 关系
    author = db.relationship('User', backref='activity_updates')


class ActivityCalendar(db.Model):
    """活动日历模型"""
    __tablename__ = 'activity_calendars'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)  # 日历名称
    description = db.Column(db.Text)  # 日历描述
    color = db.Column(db.String(7), default='#3498db')  # 日历颜色（十六进制）
    is_default = db.Column(db.Boolean, default=False)  # 是否为默认日历
    is_public = db.Column(db.Boolean, default=False)  # 是否公开
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # 关系
    user = db.relationship('User', backref='activity_calendars')
    subscriptions = db.relationship('CalendarSubscription', backref='calendar', lazy=True)


class CalendarSubscription(db.Model):
    """日历订阅模型"""
    __tablename__ = 'calendar_subscriptions'
    
    id = db.Column(db.Integer, primary_key=True)
    subscriber_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    calendar_id = db.Column(db.Integer, db.ForeignKey('activity_calendars.id'), nullable=False)
    is_active = db.Column(db.Boolean, default=True)  # 是否激活
    notification_enabled = db.Column(db.Boolean, default=True)  # 是否启用通知
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # 唯一约束：每个用户每个日历只能订阅一次
    __table_args__ = (db.UniqueConstraint('subscriber_id', 'calendar_id', name='unique_calendar_subscription'),)
    
    # 关系
    subscriber = db.relationship('User', backref='calendar_subscriptions')


class ActivityReminder(db.Model):
    """活动提醒模型"""
    __tablename__ = 'activity_reminders'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    activity_id = db.Column(db.Integer, db.ForeignKey('activities.id'), nullable=False)
    reminder_type = db.Column(db.String(20), nullable=False)  # 'before_start', 'before_end', 'custom'
    reminder_time = db.Column(db.DateTime, nullable=False)  # 提醒时间
    message = db.Column(db.Text)  # 提醒消息
    is_sent = db.Column(db.Boolean, default=False)  # 是否已发送
    sent_at = db.Column(db.DateTime)  # 发送时间
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # 关系
    user = db.relationship('User', backref='activity_reminders')
    activity = db.relationship('Activity', backref='reminders')


class ActivityFavorite(db.Model):
    """活动收藏模型"""
    __tablename__ = 'activity_favorites'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    activity_id = db.Column(db.Integer, db.ForeignKey('activities.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # 唯一约束：每个用户每个活动只能收藏一次
    __table_args__ = (db.UniqueConstraint('user_id', 'activity_id', name='unique_activity_favorite'),)
    
    # 关系
    user = db.relationship('User', backref='activity_favorites')
    activity = db.relationship('Activity', backref='favorites')

