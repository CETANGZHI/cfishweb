"""
Bulk Operations API routes for CFISH backend
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime, timedelta
from ..models import db
from ..models.bulk_operations import BulkOperation, BulkOperationItem, BulkTemplate, BulkOperationLog, BulkOperationSchedule
from ..models.user import User
from ..models.nft import NFT
from ..utils.input_validator import validate_required_fields, sanitize_input
from ..utils.logger import log_api_request

bulk_operations_bp = Blueprint('bulk_operations', __name__)


@bulk_operations_bp.route('/operations', methods=['GET'])
@jwt_required()
def get_bulk_operations():
    """获取用户的批量操作列表"""
    log_api_request('GET', '/api/v1/bulk-operations/operations')
    
    try:
        user_id = get_jwt_identity()
        page = request.args.get('page', 1, type=int)
        per_page = min(request.args.get('per_page', 20, type=int), 100)
        status = request.args.get('status')
        operation_type = request.args.get('type')
        
        query = BulkOperation.query.filter_by(user_id=user_id)
        
        if status:
            query = query.filter_by(status=status)
        
        if operation_type:
            query = query.filter_by(operation_type=operation_type)
        
        operations = query.order_by(BulkOperation.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        operations_data = []
        for op in operations.items:
            operations_data.append({
                'id': op.id,
                'operation_type': op.operation_type,
                'title': op.title,
                'description': op.description,
                'status': op.status,
                'total_items': op.total_items,
                'processed_items': op.processed_items,
                'successful_items': op.successful_items,
                'failed_items': op.failed_items,
                'progress_percentage': op.progress_percentage,
                'estimated_completion': op.estimated_completion.isoformat() if op.estimated_completion else None,
                'started_at': op.started_at.isoformat() if op.started_at else None,
                'completed_at': op.completed_at.isoformat() if op.completed_at else None,
                'created_at': op.created_at.isoformat()
            })
        
        return jsonify({
            'success': True,
            'data': operations_data,
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': operations.total,
                'pages': operations.pages
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'获取批量操作列表失败: {str(e)}'
        }), 500


@bulk_operations_bp.route('/operations', methods=['POST'])
@jwt_required()
def create_bulk_operation():
    """创建批量操作"""
    log_api_request('POST', '/api/v1/bulk-operations/operations')
    
    try:
        data = request.get_json()
        
        # 验证必需字段
        required_fields = ['operation_type', 'title', 'nft_ids']
        if not validate_required_fields(data, required_fields):
            return jsonify({
                'success': False,
                'message': '缺少必需字段'
            }), 400
        
        user_id = get_jwt_identity()
        operation_type = sanitize_input(data['operation_type'])
        title = sanitize_input(data['title'])
        description = sanitize_input(data.get('description', ''))
        nft_ids = data['nft_ids']
        operation_data = data.get('operation_data', {})
        
        # 验证操作类型
        valid_operations = ['list', 'delist', 'transfer', 'update_price', 'update_metadata']
        if operation_type not in valid_operations:
            return jsonify({
                'success': False,
                'message': f'无效的操作类型。支持的操作: {", ".join(valid_operations)}'
            }), 400
        
        # 验证NFT存在且属于用户
        nfts = NFT.query.filter(NFT.id.in_(nft_ids)).all()
        
        if len(nfts) != len(nft_ids):
            return jsonify({
                'success': False,
                'message': '部分NFT不存在'
            }), 400
        
        # 检查NFT所有权
        for nft in nfts:
            if nft.current_owner_id != user_id:
                return jsonify({
                    'success': False,
                    'message': f'您不拥有NFT: {nft.name}'
                }), 403
        
        # 创建批量操作
        bulk_operation = BulkOperation(
            user_id=user_id,
            operation_type=operation_type,
            title=title,
            description=description,
            total_items=len(nft_ids),
            metadata=operation_data
        )
        
        db.session.add(bulk_operation)
        db.session.flush()  # 获取ID
        
        # 创建操作项目
        for nft in nfts:
            item = BulkOperationItem(
                operation_id=bulk_operation.id,
                nft_id=nft.id,
                original_data={
                    'name': nft.name,
                    'price': nft.price,
                    'is_listed': nft.is_listed,
                    'metadata': nft.metadata
                },
                new_data=operation_data
            )
            db.session.add(item)
        
        # 记录日志
        log = BulkOperationLog(
            operation_id=bulk_operation.id,
            log_level='INFO',
            message=f'批量操作创建成功: {title}',
            details={'total_items': len(nft_ids)}
        )
        db.session.add(log)
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': '批量操作创建成功',
            'data': {
                'operation_id': bulk_operation.id
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'创建批量操作失败: {str(e)}'
        }), 500


@bulk_operations_bp.route('/operations/<int:operation_id>', methods=['GET'])
@jwt_required()
def get_bulk_operation(operation_id):
    """获取批量操作详情"""
    log_api_request('GET', f'/api/v1/bulk-operations/operations/{operation_id}')
    
    try:
        user_id = get_jwt_identity()
        operation = BulkOperation.query.get_or_404(operation_id)
        
        if operation.user_id != user_id:
            return jsonify({
                'success': False,
                'message': '无权限访问此批量操作'
            }), 403
        
        # 获取操作项目
        items = BulkOperationItem.query.filter_by(operation_id=operation_id).all()
        items_data = []
        
        for item in items:
            items_data.append({
                'id': item.id,
                'nft': {
                    'id': item.nft.id,
                    'name': item.nft.name,
                    'image_ipfs_cid': item.nft.image_ipfs_cid,
                    'category': item.nft.category
                },
                'status': item.status,
                'original_data': item.original_data,
                'new_data': item.new_data,
                'transaction_hash': item.transaction_hash,
                'error_message': item.error_message,
                'processed_at': item.processed_at.isoformat() if item.processed_at else None
            })
        
        # 获取日志
        logs = BulkOperationLog.query.filter_by(operation_id=operation_id).order_by(
            BulkOperationLog.created_at.desc()
        ).limit(50).all()
        
        logs_data = []
        for log in logs:
            logs_data.append({
                'id': log.id,
                'log_level': log.log_level,
                'message': log.message,
                'details': log.details,
                'created_at': log.created_at.isoformat()
            })
        
        return jsonify({
            'success': True,
            'data': {
                'id': operation.id,
                'operation_type': operation.operation_type,
                'title': operation.title,
                'description': operation.description,
                'status': operation.status,
                'total_items': operation.total_items,
                'processed_items': operation.processed_items,
                'successful_items': operation.successful_items,
                'failed_items': operation.failed_items,
                'progress_percentage': operation.progress_percentage,
                'estimated_completion': operation.estimated_completion.isoformat() if operation.estimated_completion else None,
                'started_at': operation.started_at.isoformat() if operation.started_at else None,
                'completed_at': operation.completed_at.isoformat() if operation.completed_at else None,
                'error_message': operation.error_message,
                'metadata': operation.metadata,
                'items': items_data,
                'logs': logs_data,
                'created_at': operation.created_at.isoformat()
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'获取批量操作详情失败: {str(e)}'
        }), 500


@bulk_operations_bp.route('/operations/<int:operation_id>/execute', methods=['POST'])
@jwt_required()
def execute_bulk_operation():
    """执行批量操作"""
    log_api_request('POST', f'/api/v1/bulk-operations/operations/{operation_id}/execute')
    
    try:
        user_id = get_jwt_identity()
        operation = BulkOperation.query.get_or_404(operation_id)
        
        if operation.user_id != user_id:
            return jsonify({
                'success': False,
                'message': '无权限执行此批量操作'
            }), 403
        
        if operation.status != 'pending':
            return jsonify({
                'success': False,
                'message': '批量操作不在待执行状态'
            }), 400
        
        # 更新操作状态
        operation.status = 'in_progress'
        operation.started_at = datetime.utcnow()
        operation.estimated_completion = datetime.utcnow() + timedelta(minutes=operation.total_items * 2)
        
        # 记录日志
        log = BulkOperationLog(
            operation_id=operation.id,
            log_level='INFO',
            message='批量操作开始执行',
            details={'started_at': operation.started_at.isoformat()}
        )
        db.session.add(log)
        
        db.session.commit()
        
        # 注意：实际应用中，这里应该启动异步任务来处理批量操作
        # 这里只是模拟立即完成的情况
        
        return jsonify({
            'success': True,
            'message': '批量操作开始执行',
            'data': {
                'estimated_completion': operation.estimated_completion.isoformat()
            }
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'执行批量操作失败: {str(e)}'
        }), 500


@bulk_operations_bp.route('/operations/<int:operation_id>/cancel', methods=['PUT'])
@jwt_required()
def cancel_bulk_operation():
    """取消批量操作"""
    log_api_request('PUT', f'/api/v1/bulk-operations/operations/{operation_id}/cancel')
    
    try:
        user_id = get_jwt_identity()
        operation = BulkOperation.query.get_or_404(operation_id)
        
        if operation.user_id != user_id:
            return jsonify({
                'success': False,
                'message': '无权限取消此批量操作'
            }), 403
        
        if operation.status not in ['pending', 'in_progress']:
            return jsonify({
                'success': False,
                'message': '批量操作不能取消'
            }), 400
        
        # 更新操作状态
        operation.status = 'cancelled'
        operation.completed_at = datetime.utcnow()
        
        # 取消未处理的项目
        BulkOperationItem.query.filter_by(
            operation_id=operation_id,
            status='pending'
        ).update({'status': 'skipped'})
        
        # 记录日志
        log = BulkOperationLog(
            operation_id=operation.id,
            log_level='INFO',
            message='批量操作已取消',
            details={'cancelled_at': operation.completed_at.isoformat()}
        )
        db.session.add(log)
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': '批量操作已取消'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'取消批量操作失败: {str(e)}'
        }), 500


@bulk_operations_bp.route('/templates', methods=['GET'])
@jwt_required()
def get_bulk_templates():
    """获取批量操作模板"""
    log_api_request('GET', '/api/v1/bulk-operations/templates')
    
    try:
        user_id = get_jwt_identity()
        page = request.args.get('page', 1, type=int)
        per_page = min(request.args.get('per_page', 20, type=int), 100)
        operation_type = request.args.get('type')
        include_public = request.args.get('include_public', 'true').lower() == 'true'
        
        query = BulkTemplate.query.filter(
            (BulkTemplate.user_id == user_id) |
            (BulkTemplate.is_public == True if include_public else False)
        )
        
        if operation_type:
            query = query.filter_by(operation_type=operation_type)
        
        templates = query.order_by(BulkTemplate.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        templates_data = []
        for template in templates.items:
            templates_data.append({
                'id': template.id,
                'name': template.name,
                'description': template.description,
                'operation_type': template.operation_type,
                'template_data': template.template_data,
                'is_public': template.is_public,
                'usage_count': template.usage_count,
                'is_owner': template.user_id == user_id,
                'created_at': template.created_at.isoformat()
            })
        
        return jsonify({
            'success': True,
            'data': templates_data,
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': templates.total,
                'pages': templates.pages
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'获取批量操作模板失败: {str(e)}'
        }), 500


@bulk_operations_bp.route('/templates', methods=['POST'])
@jwt_required()
def create_bulk_template():
    """创建批量操作模板"""
    log_api_request('POST', '/api/v1/bulk-operations/templates')
    
    try:
        data = request.get_json()
        
        # 验证必需字段
        required_fields = ['name', 'operation_type', 'template_data']
        if not validate_required_fields(data, required_fields):
            return jsonify({
                'success': False,
                'message': '缺少必需字段'
            }), 400
        
        user_id = get_jwt_identity()
        name = sanitize_input(data['name'])
        description = sanitize_input(data.get('description', ''))
        operation_type = sanitize_input(data['operation_type'])
        template_data = data['template_data']
        is_public = data.get('is_public', False)
        
        # 创建模板
        template = BulkTemplate(
            user_id=user_id,
            name=name,
            description=description,
            operation_type=operation_type,
            template_data=template_data,
            is_public=is_public
        )
        
        db.session.add(template)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': '批量操作模板创建成功',
            'data': {
                'template_id': template.id
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'创建批量操作模板失败: {str(e)}'
        }), 500


@bulk_operations_bp.route('/schedules', methods=['GET'])
@jwt_required()
def get_bulk_schedules():
    """获取批量操作调度"""
    log_api_request('GET', '/api/v1/bulk-operations/schedules')
    
    try:
        user_id = get_jwt_identity()
        page = request.args.get('page', 1, type=int)
        per_page = min(request.args.get('per_page', 20, type=int), 100)
        is_active = request.args.get('is_active')
        
        query = BulkOperationSchedule.query.filter_by(user_id=user_id)
        
        if is_active is not None:
            query = query.filter_by(is_active=is_active.lower() == 'true')
        
        schedules = query.order_by(BulkOperationSchedule.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        schedules_data = []
        for schedule in schedules.items:
            schedules_data.append({
                'id': schedule.id,
                'operation_type': schedule.operation_type,
                'name': schedule.name,
                'description': schedule.description,
                'schedule_type': schedule.schedule_type,
                'schedule_time': schedule.schedule_time.isoformat(),
                'is_active': schedule.is_active,
                'last_run': schedule.last_run.isoformat() if schedule.last_run else None,
                'next_run': schedule.next_run.isoformat() if schedule.next_run else None,
                'run_count': schedule.run_count,
                'created_at': schedule.created_at.isoformat()
            })
        
        return jsonify({
            'success': True,
            'data': schedules_data,
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': schedules.total,
                'pages': schedules.pages
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'获取批量操作调度失败: {str(e)}'
        }), 500


@bulk_operations_bp.route('/schedules', methods=['POST'])
@jwt_required()
def create_bulk_schedule():
    """创建批量操作调度"""
    log_api_request('POST', '/api/v1/bulk-operations/schedules')
    
    try:
        data = request.get_json()
        
        # 验证必需字段
        required_fields = ['name', 'operation_type', 'schedule_type', 'schedule_time', 'schedule_data']
        if not validate_required_fields(data, required_fields):
            return jsonify({
                'success': False,
                'message': '缺少必需字段'
            }), 400
        
        user_id = get_jwt_identity()
        name = sanitize_input(data['name'])
        description = sanitize_input(data.get('description', ''))
        operation_type = sanitize_input(data['operation_type'])
        schedule_type = sanitize_input(data['schedule_type'])
        schedule_time = datetime.fromisoformat(data['schedule_time'].replace('Z', '+00:00'))
        schedule_data = data['schedule_data']
        
        # 计算下次运行时间
        next_run = schedule_time
        if schedule_type == 'daily':
            next_run = schedule_time + timedelta(days=1)
        elif schedule_type == 'weekly':
            next_run = schedule_time + timedelta(weeks=1)
        elif schedule_type == 'monthly':
            next_run = schedule_time + timedelta(days=30)
        
        # 创建调度
        schedule = BulkOperationSchedule(
            user_id=user_id,
            operation_type=operation_type,
            name=name,
            description=description,
            schedule_type=schedule_type,
            schedule_time=schedule_time,
            schedule_data=schedule_data,
            next_run=next_run
        )
        
        db.session.add(schedule)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': '批量操作调度创建成功',
            'data': {
                'schedule_id': schedule.id,
                'next_run': next_run.isoformat()
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'创建批量操作调度失败: {str(e)}'
        }), 500

