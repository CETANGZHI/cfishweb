"""
争议解决相关的数据模型
"""
from datetime import datetime
from typing import Optional, Dict, Any, List
from dataclasses import dataclass


@dataclass
class Dispute:
    """争议模型"""
    id: str
    case_number: str  # 案件编号
    complainant_id: str  # 申请人ID
    respondent_id: str  # 被申请人ID
    dispute_type: str  # 'transaction', 'nft_authenticity', 'payment', 'delivery', 'other'
    category: str  # 'buyer_complaint', 'seller_complaint', 'platform_issue'
    title: str
    description: str
    related_transaction_id: Optional[str]
    related_nft_id: Optional[str]
    related_auction_id: Optional[str]
    amount_disputed: Optional[float]
    currency: Optional[str]
    status: str  # 'submitted', 'under_review', 'investigating', 'mediation', 'arbitration', 'resolved', 'closed'
    priority: str  # 'low', 'medium', 'high', 'urgent'
    assigned_mediator_id: Optional[str]
    assigned_arbitrator_id: Optional[str]
    resolution: Optional[str]
    resolution_details: Optional[Dict[str, Any]]
    created_at: datetime
    updated_at: datetime
    resolved_at: Optional[datetime]
    
    def to_dict(self):
        return {
            'id': self.id,
            'case_number': self.case_number,
            'complainant_id': self.complainant_id,
            'respondent_id': self.respondent_id,
            'dispute_type': self.dispute_type,
            'category': self.category,
            'title': self.title,
            'description': self.description,
            'related_transaction_id': self.related_transaction_id,
            'related_nft_id': self.related_nft_id,
            'related_auction_id': self.related_auction_id,
            'amount_disputed': self.amount_disputed,
            'currency': self.currency,
            'status': self.status,
            'priority': self.priority,
            'assigned_mediator_id': self.assigned_mediator_id,
            'assigned_arbitrator_id': self.assigned_arbitrator_id,
            'resolution': self.resolution,
            'resolution_details': self.resolution_details,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'resolved_at': self.resolved_at.isoformat() if self.resolved_at else None
        }


@dataclass
class DisputeEvidence:
    """争议证据模型"""
    id: str
    dispute_id: str
    submitted_by: str  # 提交者ID
    evidence_type: str  # 'document', 'image', 'video', 'audio', 'screenshot', 'transaction_record'
    title: str
    description: str
    file_url: Optional[str]
    file_hash: Optional[str]  # 文件哈希值用于验证完整性
    metadata: Dict[str, Any]
    is_verified: bool
    verification_notes: Optional[str]
    created_at: datetime
    
    def to_dict(self):
        return {
            'id': self.id,
            'dispute_id': self.dispute_id,
            'submitted_by': self.submitted_by,
            'evidence_type': self.evidence_type,
            'title': self.title,
            'description': self.description,
            'file_url': self.file_url,
            'file_hash': self.file_hash,
            'metadata': self.metadata,
            'is_verified': self.is_verified,
            'verification_notes': self.verification_notes,
            'created_at': self.created_at.isoformat()
        }


@dataclass
class DisputeMessage:
    """争议消息模型"""
    id: str
    dispute_id: str
    sender_id: str
    sender_role: str  # 'complainant', 'respondent', 'mediator', 'arbitrator', 'admin'
    message_type: str  # 'text', 'system', 'status_update', 'resolution'
    content: str
    attachments: List[str]  # 附件URL列表
    is_private: bool  # 是否为私密消息（仅相关方可见）
    created_at: datetime
    
    def to_dict(self):
        return {
            'id': self.id,
            'dispute_id': self.dispute_id,
            'sender_id': self.sender_id,
            'sender_role': self.sender_role,
            'message_type': self.message_type,
            'content': self.content,
            'attachments': self.attachments,
            'is_private': self.is_private,
            'created_at': self.created_at.isoformat()
        }


@dataclass
class DisputeTimeline:
    """争议时间线模型"""
    id: str
    dispute_id: str
    action_type: str  # 'created', 'evidence_submitted', 'status_changed', 'assigned', 'message_sent', 'resolved'
    action_by: str  # 执行操作的用户ID
    action_details: Dict[str, Any]
    timestamp: datetime
    
    def to_dict(self):
        return {
            'id': self.id,
            'dispute_id': self.dispute_id,
            'action_type': self.action_type,
            'action_by': self.action_by,
            'action_details': self.action_details,
            'timestamp': self.timestamp.isoformat()
        }


@dataclass
class Mediator:
    """调解员模型"""
    id: str
    user_id: str
    specializations: List[str]  # 专业领域
    languages: List[str]
    experience_years: int
    total_cases: int
    successful_resolutions: int
    average_resolution_time: float  # 平均解决时间（小时）
    rating: float
    is_active: bool
    availability_schedule: Dict[str, Any]
    created_at: datetime
    updated_at: datetime
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'specializations': self.specializations,
            'languages': self.languages,
            'experience_years': self.experience_years,
            'total_cases': self.total_cases,
            'successful_resolutions': self.successful_resolutions,
            'average_resolution_time': self.average_resolution_time,
            'rating': self.rating,
            'is_active': self.is_active,
            'availability_schedule': self.availability_schedule,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }


@dataclass
class DisputeResolution:
    """争议解决方案模型"""
    id: str
    dispute_id: str
    resolution_type: str  # 'mediation_agreement', 'arbitration_award', 'settlement', 'dismissal'
    resolution_summary: str
    resolution_details: Dict[str, Any]
    financial_settlement: Optional[Dict[str, Any]]  # 财务解决方案
    actions_required: List[Dict[str, Any]]  # 需要执行的操作
    deadline: Optional[datetime]
    is_binding: bool
    resolved_by: str  # 解决者ID
    approved_by_complainant: bool
    approved_by_respondent: bool
    created_at: datetime
    
    def to_dict(self):
        return {
            'id': self.id,
            'dispute_id': self.dispute_id,
            'resolution_type': self.resolution_type,
            'resolution_summary': self.resolution_summary,
            'resolution_details': self.resolution_details,
            'financial_settlement': self.financial_settlement,
            'actions_required': self.actions_required,
            'deadline': self.deadline.isoformat() if self.deadline else None,
            'is_binding': self.is_binding,
            'resolved_by': self.resolved_by,
            'approved_by_complainant': self.approved_by_complainant,
            'approved_by_respondent': self.approved_by_respondent,
            'created_at': self.created_at.isoformat()
        }


@dataclass
class DisputeSettings:
    """争议设置模型"""
    id: str
    user_id: str
    auto_accept_mediation: bool
    preferred_language: str
    notification_preferences: Dict[str, bool]
    escalation_preferences: Dict[str, Any]
    created_at: datetime
    updated_at: datetime
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'auto_accept_mediation': self.auto_accept_mediation,
            'preferred_language': self.preferred_language,
            'notification_preferences': self.notification_preferences,
            'escalation_preferences': self.escalation_preferences,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }


@dataclass
class DisputeAnalytics:
    """争议分析数据模型"""
    id: str
    period: str  # 'daily', 'weekly', 'monthly', 'yearly'
    total_disputes: int
    resolved_disputes: int
    pending_disputes: int
    average_resolution_time: float
    resolution_rate: float
    dispute_types_breakdown: Dict[str, int]
    mediator_performance: Dict[str, Any]
    user_satisfaction_scores: Dict[str, float]
    created_at: datetime
    
    def to_dict(self):
        return {
            'id': self.id,
            'period': self.period,
            'total_disputes': self.total_disputes,
            'resolved_disputes': self.resolved_disputes,
            'pending_disputes': self.pending_disputes,
            'average_resolution_time': self.average_resolution_time,
            'resolution_rate': self.resolution_rate,
            'dispute_types_breakdown': self.dispute_types_breakdown,
            'mediator_performance': self.mediator_performance,
            'user_satisfaction_scores': self.user_satisfaction_scores,
            'created_at': self.created_at.isoformat()
        }

