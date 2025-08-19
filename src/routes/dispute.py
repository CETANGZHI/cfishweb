"""
争议解决API路由
"""
from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
import uuid
import random
from typing import Dict, Any, List, Optional

from ..models.dispute import (
    Dispute, DisputeEvidence, DisputeMessage, DisputeTimeline, Mediator,
    DisputeResolution, DisputeSettings, DisputeAnalytics
)
from ..utils.auth_utils import token_required
from ..utils.input_validator import validate_input
from ..utils.logger import get_logger

logger = get_logger(__name__)
dispute_bp = Blueprint('dispute', __name__)

# 模拟数据存储
disputes: Dict[str, Dispute] = {}
dispute_evidences: Dict[str, DisputeEvidence] = {}
dispute_messages: Dict[str, DisputeMessage] = {}
dispute_timelines: Dict[str, DisputeTimeline] = {}
mediators: Dict[str, Mediator] = {}
dispute_resolutions: Dict[str, DisputeResolution] = {}
dispute_settings: Dict[str, DisputeSettings] = {}
dispute_analytics: Dict[str, DisputeAnalytics] = {}

# 初始化一些示例数据
def init_sample_data():
    """初始化示例数据"""
    # 调解员示例
    mediator_id = str(uuid.uuid4())
    mediators[mediator_id] = Mediator(
        id=mediator_id,
        user_id="mediator_123",
        specializations=["transaction_disputes", "nft_authenticity", "payment_issues"],
        languages=["en", "zh"],
        experience_years=5,
        total_cases=150,
        successful_resolutions=135,
        average_resolution_time=48.5,
        rating=4.8,
        is_active=True,
        availability_schedule={"monday": "9:00-17:00", "tuesday": "9:00-17:00"},
        created_at=datetime.now(),
        updated_at=datetime.now()
    )

# 初始化示例数据
init_sample_data()


def generate_case_number():
    """生成案件编号"""
    return f"CFISH-{datetime.now().strftime('%Y%m%d')}-{random.randint(1000, 9999)}"


@dispute_bp.route('/disputes', methods=['POST'])
@token_required
def submit_dispute(current_user):
    """提交争议"""
    try:
        data = request.get_json()
        
        # 验证输入
        required_fields = ['respondent_id', 'dispute_type', 'title', 'description']
        if not validate_input(data, required_fields):
            return jsonify({
                'success': False,
                'message': 'Missing required fields'
            }), 400
        
        dispute_id = str(uuid.uuid4())
        case_number = generate_case_number()
        
        dispute = Dispute(
            id=dispute_id,
            case_number=case_number,
            complainant_id=current_user['id'],
            respondent_id=data['respondent_id'],
            dispute_type=data['dispute_type'],
            category=data.get('category', 'buyer_complaint'),
            title=data['title'],
            description=data['description'],
            related_transaction_id=data.get('related_transaction_id'),
            related_nft_id=data.get('related_nft_id'),
            related_auction_id=data.get('related_auction_id'),
            amount_disputed=float(data['amount_disputed']) if data.get('amount_disputed') else None,
            currency=data.get('currency'),
            status='submitted',
            priority=data.get('priority', 'medium'),
            assigned_mediator_id=None,
            assigned_arbitrator_id=None,
            resolution=None,
            resolution_details=None,
            created_at=datetime.now(),
            updated_at=datetime.now(),
            resolved_at=None
        )
        
        disputes[dispute_id] = dispute
        
        # 记录时间线
        timeline_id = str(uuid.uuid4())
        dispute_timelines[timeline_id] = DisputeTimeline(
            id=timeline_id,
            dispute_id=dispute_id,
            action_type='created',
            action_by=current_user['id'],
            action_details={
                'case_number': case_number,
                'dispute_type': dispute.dispute_type,
                'title': dispute.title
            },
            timestamp=datetime.now()
        )
        
        logger.info(f"Submitted dispute: {dispute_id} by user: {current_user['id']}")
        
        return jsonify({
            'success': True,
            'data': dispute.to_dict()
        }), 201
        
    except Exception as e:
        logger.error(f"Error submitting dispute: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Failed to submit dispute'
        }), 500


@dispute_bp.route('/disputes', methods=['GET'])
@token_required
def get_disputes(current_user):
    """获取争议列表"""
    try:
        status = request.args.get('status')
        dispute_type = request.args.get('type')
        role = request.args.get('role', 'all')  # 'complainant', 'respondent', 'all'
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 20))
        
        filtered_disputes = []
        for dispute in disputes.values():
            # 权限检查
            if role == 'complainant' and dispute.complainant_id != current_user['id']:
                continue
            elif role == 'respondent' and dispute.respondent_id != current_user['id']:
                continue
            elif role == 'all' and dispute.complainant_id != current_user['id'] and dispute.respondent_id != current_user['id']:
                continue
            
            # 状态过滤
            if status and dispute.status != status:
                continue
            
            # 类型过滤
            if dispute_type and dispute.dispute_type != dispute_type:
                continue
            
            filtered_disputes.append(dispute.to_dict())
        
        # 按创建时间排序
        filtered_disputes.sort(key=lambda x: x['created_at'], reverse=True)
        
        # 分页
        start = (page - 1) * limit
        end = start + limit
        paginated_disputes = filtered_disputes[start:end]
        
        logger.info(f"Retrieved {len(paginated_disputes)} disputes for user: {current_user['id']}")
        
        return jsonify({
            'success': True,
            'data': paginated_disputes,
            'total': len(filtered_disputes),
            'page': page,
            'limit': limit
        }), 200
        
    except Exception as e:
        logger.error(f"Error retrieving disputes: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Failed to retrieve disputes'
        }), 500


@dispute_bp.route('/disputes/<dispute_id>', methods=['GET'])
@token_required
def get_dispute(current_user, dispute_id: str):
    """获取争议详情"""
    try:
        if dispute_id not in disputes:
            return jsonify({
                'success': False,
                'message': 'Dispute not found'
            }), 404
        
        dispute = disputes[dispute_id]
        
        # 权限检查
        if (dispute.complainant_id != current_user['id'] and 
            dispute.respondent_id != current_user['id'] and
            dispute.assigned_mediator_id != current_user['id'] and
            dispute.assigned_arbitrator_id != current_user['id']):
            return jsonify({
                'success': False,
                'message': 'Unauthorized'
            }), 403
        
        # 获取相关证据
        evidences = [
            evidence.to_dict() for evidence in dispute_evidences.values()
            if evidence.dispute_id == dispute_id
        ]
        
        # 获取消息
        messages = [
            message.to_dict() for message in dispute_messages.values()
            if message.dispute_id == dispute_id
        ]
        messages.sort(key=lambda x: x['created_at'])
        
        # 获取时间线
        timeline = [
            timeline_item.to_dict() for timeline_item in dispute_timelines.values()
            if timeline_item.dispute_id == dispute_id
        ]
        timeline.sort(key=lambda x: x['timestamp'])
        
        # 获取解决方案
        resolution = None
        for res in dispute_resolutions.values():
            if res.dispute_id == dispute_id:
                resolution = res.to_dict()
                break
        
        result = dispute.to_dict()
        result['evidences'] = evidences
        result['messages'] = messages
        result['timeline'] = timeline
        result['resolution'] = resolution
        
        logger.info(f"Retrieved dispute details: {dispute_id}")
        
        return jsonify({
            'success': True,
            'data': result
        }), 200
        
    except Exception as e:
        logger.error(f"Error retrieving dispute {dispute_id}: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Failed to retrieve dispute'
        }), 500


@dispute_bp.route('/disputes/<dispute_id>/evidence', methods=['POST'])
@token_required
def submit_evidence(current_user, dispute_id: str):
    """提交争议证据"""
    try:
        if dispute_id not in disputes:
            return jsonify({
                'success': False,
                'message': 'Dispute not found'
            }), 404
        
        dispute = disputes[dispute_id]
        
        # 权限检查
        if (dispute.complainant_id != current_user['id'] and 
            dispute.respondent_id != current_user['id']):
            return jsonify({
                'success': False,
                'message': 'Unauthorized'
            }), 403
        
        data = request.get_json()
        
        # 验证输入
        required_fields = ['evidence_type', 'title', 'description']
        if not validate_input(data, required_fields):
            return jsonify({
                'success': False,
                'message': 'Missing required fields'
            }), 400
        
        evidence_id = str(uuid.uuid4())
        evidence = DisputeEvidence(
            id=evidence_id,
            dispute_id=dispute_id,
            submitted_by=current_user['id'],
            evidence_type=data['evidence_type'],
            title=data['title'],
            description=data['description'],
            file_url=data.get('file_url'),
            file_hash=data.get('file_hash'),
            metadata=data.get('metadata', {}),
            is_verified=False,
            verification_notes=None,
            created_at=datetime.now()
        )
        
        dispute_evidences[evidence_id] = evidence
        
        # 记录时间线
        timeline_id = str(uuid.uuid4())
        dispute_timelines[timeline_id] = DisputeTimeline(
            id=timeline_id,
            dispute_id=dispute_id,
            action_type='evidence_submitted',
            action_by=current_user['id'],
            action_details={
                'evidence_id': evidence_id,
                'evidence_type': evidence.evidence_type,
                'title': evidence.title
            },
            timestamp=datetime.now()
        )
        
        logger.info(f"Submitted evidence: {evidence_id} for dispute: {dispute_id}")
        
        return jsonify({
            'success': True,
            'data': evidence.to_dict()
        }), 201
        
    except Exception as e:
        logger.error(f"Error submitting evidence for dispute {dispute_id}: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Failed to submit evidence'
        }), 500


@dispute_bp.route('/disputes/<dispute_id>/messages', methods=['POST'])
@token_required
def send_message(current_user, dispute_id: str):
    """发送争议消息"""
    try:
        if dispute_id not in disputes:
            return jsonify({
                'success': False,
                'message': 'Dispute not found'
            }), 404
        
        dispute = disputes[dispute_id]
        
        # 权限检查
        if (dispute.complainant_id != current_user['id'] and 
            dispute.respondent_id != current_user['id'] and
            dispute.assigned_mediator_id != current_user['id'] and
            dispute.assigned_arbitrator_id != current_user['id']):
            return jsonify({
                'success': False,
                'message': 'Unauthorized'
            }), 403
        
        data = request.get_json()
        
        # 验证输入
        required_fields = ['content']
        if not validate_input(data, required_fields):
            return jsonify({
                'success': False,
                'message': 'Missing required fields'
            }), 400
        
        # 确定发送者角色
        sender_role = 'complainant'
        if current_user['id'] == dispute.respondent_id:
            sender_role = 'respondent'
        elif current_user['id'] == dispute.assigned_mediator_id:
            sender_role = 'mediator'
        elif current_user['id'] == dispute.assigned_arbitrator_id:
            sender_role = 'arbitrator'
        
        message_id = str(uuid.uuid4())
        message = DisputeMessage(
            id=message_id,
            dispute_id=dispute_id,
            sender_id=current_user['id'],
            sender_role=sender_role,
            message_type=data.get('message_type', 'text'),
            content=data['content'],
            attachments=data.get('attachments', []),
            is_private=data.get('is_private', False),
            created_at=datetime.now()
        )
        
        dispute_messages[message_id] = message
        
        # 记录时间线
        timeline_id = str(uuid.uuid4())
        dispute_timelines[timeline_id] = DisputeTimeline(
            id=timeline_id,
            dispute_id=dispute_id,
            action_type='message_sent',
            action_by=current_user['id'],
            action_details={
                'message_id': message_id,
                'sender_role': sender_role,
                'message_type': message.message_type
            },
            timestamp=datetime.now()
        )
        
        logger.info(f"Sent message: {message_id} for dispute: {dispute_id}")
        
        return jsonify({
            'success': True,
            'data': message.to_dict()
        }), 201
        
    except Exception as e:
        logger.error(f"Error sending message for dispute {dispute_id}: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Failed to send message'
        }), 500


@dispute_bp.route('/disputes/<dispute_id>/status', methods=['PUT'])
@token_required
def update_dispute_status(current_user, dispute_id: str):
    """更新争议状态"""
    try:
        if dispute_id not in disputes:
            return jsonify({
                'success': False,
                'message': 'Dispute not found'
            }), 404
        
        dispute = disputes[dispute_id]
        
        # 权限检查（只有调解员、仲裁员或管理员可以更新状态）
        if (dispute.assigned_mediator_id != current_user['id'] and
            dispute.assigned_arbitrator_id != current_user['id']):
            return jsonify({
                'success': False,
                'message': 'Unauthorized'
            }), 403
        
        data = request.get_json()
        
        # 验证输入
        required_fields = ['status']
        if not validate_input(data, required_fields):
            return jsonify({
                'success': False,
                'message': 'Missing required fields'
            }), 400
        
        old_status = dispute.status
        dispute.status = data['status']
        dispute.updated_at = datetime.now()
        
        if data['status'] in ['resolved', 'closed']:
            dispute.resolved_at = datetime.now()
        
        # 记录时间线
        timeline_id = str(uuid.uuid4())
        dispute_timelines[timeline_id] = DisputeTimeline(
            id=timeline_id,
            dispute_id=dispute_id,
            action_type='status_changed',
            action_by=current_user['id'],
            action_details={
                'old_status': old_status,
                'new_status': dispute.status,
                'notes': data.get('notes')
            },
            timestamp=datetime.now()
        )
        
        logger.info(f"Updated dispute status: {dispute_id} from {old_status} to {dispute.status}")
        
        return jsonify({
            'success': True,
            'data': dispute.to_dict()
        }), 200
        
    except Exception as e:
        logger.error(f"Error updating dispute status {dispute_id}: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Failed to update dispute status'
        }), 500


@dispute_bp.route('/disputes/<dispute_id>/assign', methods=['POST'])
@token_required
def assign_mediator(current_user, dispute_id: str):
    """分配调解员"""
    try:
        if dispute_id not in disputes:
            return jsonify({
                'success': False,
                'message': 'Dispute not found'
            }), 404
        
        dispute = disputes[dispute_id]
        data = request.get_json()
        
        # 验证输入
        required_fields = ['mediator_id']
        if not validate_input(data, required_fields):
            return jsonify({
                'success': False,
                'message': 'Missing required fields'
            }), 400
        
        mediator_id = data['mediator_id']
        
        # 检查调解员是否存在
        if mediator_id not in mediators:
            return jsonify({
                'success': False,
                'message': 'Mediator not found'
            }), 404
        
        dispute.assigned_mediator_id = mediator_id
        dispute.status = 'under_review'
        dispute.updated_at = datetime.now()
        
        # 记录时间线
        timeline_id = str(uuid.uuid4())
        dispute_timelines[timeline_id] = DisputeTimeline(
            id=timeline_id,
            dispute_id=dispute_id,
            action_type='assigned',
            action_by=current_user['id'],
            action_details={
                'mediator_id': mediator_id,
                'assignment_type': 'mediator'
            },
            timestamp=datetime.now()
        )
        
        logger.info(f"Assigned mediator {mediator_id} to dispute: {dispute_id}")
        
        return jsonify({
            'success': True,
            'data': dispute.to_dict()
        }), 200
        
    except Exception as e:
        logger.error(f"Error assigning mediator to dispute {dispute_id}: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Failed to assign mediator'
        }), 500


@dispute_bp.route('/disputes/<dispute_id>/resolve', methods=['POST'])
@token_required
def resolve_dispute(current_user, dispute_id: str):
    """解决争议"""
    try:
        if dispute_id not in disputes:
            return jsonify({
                'success': False,
                'message': 'Dispute not found'
            }), 404
        
        dispute = disputes[dispute_id]
        
        # 权限检查
        if (dispute.assigned_mediator_id != current_user['id'] and
            dispute.assigned_arbitrator_id != current_user['id']):
            return jsonify({
                'success': False,
                'message': 'Unauthorized'
            }), 403
        
        data = request.get_json()
        
        # 验证输入
        required_fields = ['resolution_type', 'resolution_summary']
        if not validate_input(data, required_fields):
            return jsonify({
                'success': False,
                'message': 'Missing required fields'
            }), 400
        
        resolution_id = str(uuid.uuid4())
        resolution = DisputeResolution(
            id=resolution_id,
            dispute_id=dispute_id,
            resolution_type=data['resolution_type'],
            resolution_summary=data['resolution_summary'],
            resolution_details=data.get('resolution_details', {}),
            financial_settlement=data.get('financial_settlement'),
            actions_required=data.get('actions_required', []),
            deadline=datetime.fromisoformat(data['deadline'].replace('Z', '+00:00')) if data.get('deadline') else None,
            is_binding=data.get('is_binding', True),
            resolved_by=current_user['id'],
            approved_by_complainant=False,
            approved_by_respondent=False,
            created_at=datetime.now()
        )
        
        dispute_resolutions[resolution_id] = resolution
        
        # 更新争议状态
        dispute.status = 'resolved'
        dispute.resolution = data['resolution_summary']
        dispute.resolution_details = data.get('resolution_details', {})
        dispute.resolved_at = datetime.now()
        dispute.updated_at = datetime.now()
        
        # 记录时间线
        timeline_id = str(uuid.uuid4())
        dispute_timelines[timeline_id] = DisputeTimeline(
            id=timeline_id,
            dispute_id=dispute_id,
            action_type='resolved',
            action_by=current_user['id'],
            action_details={
                'resolution_id': resolution_id,
                'resolution_type': resolution.resolution_type,
                'resolution_summary': resolution.resolution_summary
            },
            timestamp=datetime.now()
        )
        
        logger.info(f"Resolved dispute: {dispute_id} by user: {current_user['id']}")
        
        return jsonify({
            'success': True,
            'data': {
                'dispute': dispute.to_dict(),
                'resolution': resolution.to_dict()
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Error resolving dispute {dispute_id}: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Failed to resolve dispute'
        }), 500


@dispute_bp.route('/mediators', methods=['GET'])
def get_mediators():
    """获取调解员列表"""
    try:
        specialization = request.args.get('specialization')
        language = request.args.get('language')
        is_active = request.args.get('is_active', 'true').lower() == 'true'
        
        filtered_mediators = []
        for mediator in mediators.values():
            if not is_active and not mediator.is_active:
                continue
            if specialization and specialization not in mediator.specializations:
                continue
            if language and language not in mediator.languages:
                continue
            filtered_mediators.append(mediator.to_dict())
        
        # 按评分排序
        filtered_mediators.sort(key=lambda x: x['rating'], reverse=True)
        
        logger.info(f"Retrieved {len(filtered_mediators)} mediators")
        
        return jsonify({
            'success': True,
            'data': filtered_mediators,
            'total': len(filtered_mediators)
        }), 200
        
    except Exception as e:
        logger.error(f"Error retrieving mediators: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Failed to retrieve mediators'
        }), 500


@dispute_bp.route('/analytics', methods=['GET'])
@token_required
def get_dispute_analytics(current_user):
    """获取争议分析数据"""
    try:
        period = request.args.get('period', 'monthly')
        
        # 查找或创建分析数据
        analytics = None
        for analytic in dispute_analytics.values():
            if analytic.period == period:
                analytics = analytic
                break
        
        if not analytics:
            # 创建默认分析数据
            analytics_id = str(uuid.uuid4())
            analytics = DisputeAnalytics(
                id=analytics_id,
                period=period,
                total_disputes=len(disputes),
                resolved_disputes=len([d for d in disputes.values() if d.status == 'resolved']),
                pending_disputes=len([d for d in disputes.values() if d.status not in ['resolved', 'closed']]),
                average_resolution_time=48.5,
                resolution_rate=0.85,
                dispute_types_breakdown={
                    'transaction': 45,
                    'nft_authenticity': 20,
                    'payment': 15,
                    'delivery': 10,
                    'other': 10
                },
                mediator_performance={},
                user_satisfaction_scores={},
                created_at=datetime.now()
            )
            dispute_analytics[analytics_id] = analytics
        
        logger.info(f"Retrieved dispute analytics for period: {period}")
        
        return jsonify({
            'success': True,
            'data': analytics.to_dict()
        }), 200
        
    except Exception as e:
        logger.error(f"Error retrieving dispute analytics: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Failed to retrieve dispute analytics'
        }), 500

