"""
Bulk Operations models for CFISH backend API
"""

from datetime import datetime
from . import db


class BulkOperation(db.Model):
    """批量操作模型"""
    __tablename__ = 'bulk_operations'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    operation_type = db.Column(db.String(50), nullable=False)  # 'list', 'delist', 'transfer', 'update_price', 'update_metadata'
    title = db.Column(db.String(200), nullable=False)  # 操作标题
    description = db.Column(db.Text)  # 操作描述
    status = db.Column(db.String(20), default='pending')  # 'pending', 'in_progress', 'completed', 'failed', 'cancelled'
    total_items = db.Column(db.Integer, default=0)  # 总项目数
    processed_items = db.Column(db.Integer, default=0)  # 已处理项目数
    successful_items = db.Column(db.Integer, default=0)  # 成功项目数
    failed_items = db.Column(db.Integer, default=0)  # 失败项目数
    progress_percentage = db.Column(db.Float, default=0.0)  # 进度百分比
    estimated_completion = db.Column(db.DateTime)  # 预计完成时间
    started_at = db.Column(db.DateTime)  # 开始时间
    completed_at = db.Column(db.DateTime)  # 完成时间
    error_message = db.Column(db.Text)  # 错误信息
    metadata = db.Column(db.JSON)  # 操作相关的元数据
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # 关系
    user = db.relationship('User', backref='bulk_operations')
    items = db.relationship('BulkOperationItem', backref='operation', lazy=True)


class BulkOperationItem(db.Model):
    """批量操作项目模型"""
    __tablename__ = 'bulk_operation_items'
    
    id = db.Column(db.Integer, primary_key=True)
    operation_id = db.Column(db.Integer, db.ForeignKey('bulk_operations.id'), nullable=False)
    nft_id = db.Column(db.Integer, db.ForeignKey('nfts.id'), nullable=False)
    status = db.Column(db.String(20), default='pending')  # 'pending', 'processing', 'completed', 'failed', 'skipped'
    original_data = db.Column(db.JSON)  # 原始数据
    new_data = db.Column(db.JSON)  # 新数据
    transaction_hash = db.Column(db.String(100))  # 交易哈希
    error_message = db.Column(db.Text)  # 错误信息
    processed_at = db.Column(db.DateTime)  # 处理时间
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # 关系
    nft = db.relationship('NFT', backref='bulk_operation_items')


class BulkTemplate(db.Model):
    """批量操作模板模型"""
    __tablename__ = 'bulk_templates'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)  # 模板名称
    description = db.Column(db.Text)  # 模板描述
    operation_type = db.Column(db.String(50), nullable=False)  # 操作类型
    template_data = db.Column(db.JSON, nullable=False)  # 模板数据
    is_public = db.Column(db.Boolean, default=False)  # 是否公开
    usage_count = db.Column(db.Integer, default=0)  # 使用次数
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # 关系
    user = db.relationship('User', backref='bulk_templates')


class BulkOperationLog(db.Model):
    """批量操作日志模型"""
    __tablename__ = 'bulk_operation_logs'
    
    id = db.Column(db.Integer, primary_key=True)
    operation_id = db.Column(db.Integer, db.ForeignKey('bulk_operations.id'), nullable=False)
    item_id = db.Column(db.Integer, db.ForeignKey('bulk_operation_items.id'))
    log_level = db.Column(db.String(10), nullable=False)  # 'INFO', 'WARNING', 'ERROR'
    message = db.Column(db.Text, nullable=False)  # 日志消息
    details = db.Column(db.JSON)  # 详细信息
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # 关系
    operation = db.relationship('BulkOperation', backref='logs')
    item = db.relationship('BulkOperationItem', backref='logs')


class BulkOperationSchedule(db.Model):
    """批量操作调度模型"""
    __tablename__ = 'bulk_operation_schedules'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    operation_type = db.Column(db.String(50), nullable=False)
    name = db.Column(db.String(100), nullable=False)  # 调度名称
    description = db.Column(db.Text)  # 调度描述
    schedule_type = db.Column(db.String(20), nullable=False)  # 'once', 'daily', 'weekly', 'monthly'
    schedule_time = db.Column(db.DateTime, nullable=False)  # 调度时间
    schedule_data = db.Column(db.JSON, nullable=False)  # 调度数据
    is_active = db.Column(db.Boolean, default=True)  # 是否激活
    last_run = db.Column(db.DateTime)  # 上次运行时间
    next_run = db.Column(db.DateTime)  # 下次运行时间
    run_count = db.Column(db.Integer, default=0)  # 运行次数
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # 关系
    user = db.relationship('User', backref='bulk_operation_schedules')

