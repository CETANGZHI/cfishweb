"""
Activity Calendar API routes for CFISH backend
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime, timedelta
from ..models import db
from ..models.activity_calendar import Activity, ActivityParticipant, ActivityUpdate, ActivityCalendar, CalendarSubscription, ActivityReminder, ActivityFavorite
from ..models.user import User
from ..utils.input_validator import validate_required_fields, sanitize_input
from ..utils.logger import log_api_request

activity_calendar_bp = Blueprint('activity_calendar', __name__)


@activity_calendar_bp.route('/activities', methods=['GET'])
def get_activities():
    """获取活动列表"""
    log_api_request('GET', '/api/v1/activity-calendar/activities')
    
    try:
        page = request.args.get('page', 1, type=int)
        per_page = min(request.args.get('per_page', 20, type=int), 100)
        activity_type = request.args.get('type')
        status = request.args.get('status', 'upcoming')
        category = request.args.get('category')
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        featured_only = request.args.get('featured_only', 'false').lower() == 'true'
        
        query = Activity.query.filter_by(is_public=True)
        
        if activity_type:
            query = query.filter_by(activity_type=activity_type)
        
        if status:
            query = query.filter_by(status=status)
        
        if category:
            query = query.filter_by(category=category)
        
        if featured_only:
            query = query.filter_by(is_featured=True)
        
        if start_date:
            start_dt = datetime.fromisoformat(start_date.replace('Z', '+00:00'))
            query = query.filter(Activity.start_time >= start_dt)
        
        if end_date:
            end_dt = datetime.fromisoformat(end_date.replace('Z', '+00:00'))
            query = query.filter(Activity.end_time <= end_dt)
        
        activities = query.order_by(Activity.start_time.asc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        activities_data = []
        for activity in activities.items:
            activities_data.append({
                'id': activity.id,
                'title': activity.title,
                'description': activity.description,
                'activity_type': activity.activity_type,
                'category': activity.category,
                'status': activity.status,
                'start_time': activity.start_time.isoformat(),
                'end_time': activity.end_time.isoformat(),
                'timezone': activity.timezone,
                'location': activity.location,
                'max_participants': activity.max_participants,
                'current_participants': activity.current_participants,
                'registration_required': activity.registration_required,
                'registration_deadline': activity.registration_deadline.isoformat() if activity.registration_deadline else None,
                'entry_fee': activity.entry_fee,
                'prize_pool': activity.prize_pool,
                'banner_image_url': activity.banner_image_url,
                'tags': activity.tags,
                'is_featured': activity.is_featured,
                'organizer': {
                    'id': activity.organizer.id,
                    'username': activity.organizer.username,
                    'wallet_address': activity.organizer.wallet_address
                },
                'created_at': activity.created_at.isoformat()
            })
        
        return jsonify({
            'success': True,
            'data': activities_data,
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': activities.total,
                'pages': activities.pages
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'获取活动列表失败: {str(e)}'
        }), 500


@activity_calendar_bp.route('/activities', methods=['POST'])
@jwt_required()
def create_activity():
    """创建活动"""
    log_api_request('POST', '/api/v1/activity-calendar/activities')
    
    try:
        data = request.get_json()
        
        # 验证必需字段
        required_fields = ['title', 'activity_type', 'start_time', 'end_time']
        if not validate_required_fields(data, required_fields):
            return jsonify({
                'success': False,
                'message': '缺少必需字段'
            }), 400
        
        user_id = get_jwt_identity()
        title = sanitize_input(data['title'])
        description = sanitize_input(data.get('description', ''))
        activity_type = sanitize_input(data['activity_type'])
        category = sanitize_input(data.get('category', ''))
        start_time = datetime.fromisoformat(data['start_time'].replace('Z', '+00:00'))
        end_time = datetime.fromisoformat(data['end_time'].replace('Z', '+00:00'))
        timezone = sanitize_input(data.get('timezone', 'UTC'))
        location = sanitize_input(data.get('location', ''))
        max_participants = data.get('max_participants')
        registration_required = data.get('registration_required', False)
        registration_deadline = None
        if data.get('registration_deadline'):
            registration_deadline = datetime.fromisoformat(data['registration_deadline'].replace('Z', '+00:00'))
        entry_fee = data.get('entry_fee', 0.0)
        prize_pool = data.get('prize_pool', 0.0)
        banner_image_url = sanitize_input(data.get('banner_image_url', ''))
        tags = data.get('tags', [])
        metadata = data.get('metadata', {})
        is_public = data.get('is_public', True)
        
        # 验证时间
        if start_time >= end_time:
            return jsonify({
                'success': False,
                'message': '开始时间必须早于结束时间'
            }), 400
        
        if registration_deadline and registration_deadline >= start_time:
            return jsonify({
                'success': False,
                'message': '注册截止时间必须早于活动开始时间'
            }), 400
        
        # 创建活动
        activity = Activity(
            organizer_id=user_id,
            title=title,
            description=description,
            activity_type=activity_type,
            category=category,
            start_time=start_time,
            end_time=end_time,
            timezone=timezone,
            location=location,
            max_participants=max_participants,
            registration_required=registration_required,
            registration_deadline=registration_deadline,
            entry_fee=entry_fee,
            prize_pool=prize_pool,
            banner_image_url=banner_image_url,
            tags=tags,
            metadata=metadata,
            is_public=is_public
        )
        
        db.session.add(activity)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': '活动创建成功',
            'data': {
                'activity_id': activity.id
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'创建活动失败: {str(e)}'
        }), 500


@activity_calendar_bp.route('/activities/<int:activity_id>', methods=['GET'])
def get_activity(activity_id):
    """获取活动详情"""
    log_api_request('GET', f'/api/v1/activity-calendar/activities/{activity_id}')
    
    try:
        activity = Activity.query.get_or_404(activity_id)
        
        if not activity.is_public:
            return jsonify({
                'success': False,
                'message': '活动不公开'
            }), 403
        
        # 获取活动更新
        updates = ActivityUpdate.query.filter_by(activity_id=activity_id).order_by(
            ActivityUpdate.is_pinned.desc(),
            ActivityUpdate.created_at.desc()
        ).limit(10).all()
        
        updates_data = []
        for update in updates:
            updates_data.append({
                'id': update.id,
                'title': update.title,
                'content': update.content,
                'update_type': update.update_type,
                'is_pinned': update.is_pinned,
                'author': {
                    'id': update.author.id,
                    'username': update.author.username
                },
                'created_at': update.created_at.isoformat()
            })
        
        return jsonify({
            'success': True,
            'data': {
                'id': activity.id,
                'title': activity.title,
                'description': activity.description,
                'activity_type': activity.activity_type,
                'category': activity.category,
                'status': activity.status,
                'start_time': activity.start_time.isoformat(),
                'end_time': activity.end_time.isoformat(),
                'timezone': activity.timezone,
                'location': activity.location,
                'max_participants': activity.max_participants,
                'current_participants': activity.current_participants,
                'registration_required': activity.registration_required,
                'registration_deadline': activity.registration_deadline.isoformat() if activity.registration_deadline else None,
                'entry_fee': activity.entry_fee,
                'prize_pool': activity.prize_pool,
                'banner_image_url': activity.banner_image_url,
                'tags': activity.tags,
                'metadata': activity.metadata,
                'is_featured': activity.is_featured,
                'organizer': {
                    'id': activity.organizer.id,
                    'username': activity.organizer.username,
                    'wallet_address': activity.organizer.wallet_address
                },
                'updates': updates_data,
                'created_at': activity.created_at.isoformat()
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'获取活动详情失败: {str(e)}'
        }), 500


@activity_calendar_bp.route('/activities/<int:activity_id>/participate', methods=['POST'])
@jwt_required()
def participate_in_activity():
    """参与活动"""
    log_api_request('POST', f'/api/v1/activity-calendar/activities/{activity_id}/participate')
    
    try:
        user_id = get_jwt_identity()
        activity = Activity.query.get_or_404(activity_id)
        
        # 检查活动状态
        if activity.status != 'upcoming':
            return jsonify({
                'success': False,
                'message': '活动不在可参与状态'
            }), 400
        
        # 检查注册截止时间
        if activity.registration_deadline and datetime.utcnow() > activity.registration_deadline:
            return jsonify({
                'success': False,
                'message': '注册已截止'
            }), 400
        
        # 检查参与人数限制
        if activity.max_participants and activity.current_participants >= activity.max_participants:
            return jsonify({
                'success': False,
                'message': '活动已满员'
            }), 400
        
        # 检查是否已参与
        existing_participant = ActivityParticipant.query.filter_by(
            activity_id=activity_id,
            user_id=user_id
        ).first()
        
        if existing_participant:
            return jsonify({
                'success': False,
                'message': '您已参与此活动'
            }), 400
        
        data = request.get_json() or {}
        notes = sanitize_input(data.get('notes', ''))
        payment_transaction_hash = sanitize_input(data.get('payment_transaction_hash', ''))
        
        # 创建参与记录
        participant = ActivityParticipant(
            activity_id=activity_id,
            user_id=user_id,
            notes=notes,
            payment_transaction_hash=payment_transaction_hash,
            payment_status='paid' if payment_transaction_hash else 'pending'
        )
        
        db.session.add(participant)
        
        # 更新活动参与人数
        activity.current_participants += 1
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': '参与活动成功',
            'data': {
                'participant_id': participant.id
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'参与活动失败: {str(e)}'
        }), 500


@activity_calendar_bp.route('/activities/<int:activity_id>/leave', methods=['DELETE'])
@jwt_required()
def leave_activity():
    """退出活动"""
    log_api_request('DELETE', f'/api/v1/activity-calendar/activities/{activity_id}/leave')
    
    try:
        user_id = get_jwt_identity()
        activity = Activity.query.get_or_404(activity_id)
        
        # 查找参与记录
        participant = ActivityParticipant.query.filter_by(
            activity_id=activity_id,
            user_id=user_id
        ).first()
        
        if not participant:
            return jsonify({
                'success': False,
                'message': '您未参与此活动'
            }), 400
        
        if participant.registration_status == 'attended':
            return jsonify({
                'success': False,
                'message': '已参加的活动无法退出'
            }), 400
        
        # 更新参与状态
        participant.registration_status = 'cancelled'
        
        # 更新活动参与人数
        if activity.current_participants > 0:
            activity.current_participants -= 1
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': '退出活动成功'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'退出活动失败: {str(e)}'
        }), 500


@activity_calendar_bp.route('/activities/user/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user_activities():
    """获取用户参与的活动"""
    log_api_request('GET', f'/api/v1/activity-calendar/activities/user/{user_id}')
    
    try:
        current_user_id = get_jwt_identity()
        if current_user_id != user_id:
            return jsonify({
                'success': False,
                'message': '无权限访问其他用户的活动'
            }), 403
        
        page = request.args.get('page', 1, type=int)
        per_page = min(request.args.get('per_page', 20, type=int), 100)
        status = request.args.get('status')
        
        query = db.session.query(Activity).join(ActivityParticipant).filter(
            ActivityParticipant.user_id == user_id
        )
        
        if status:
            query = query.filter(Activity.status == status)
        
        activities = query.order_by(Activity.start_time.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        activities_data = []
        for activity in activities.items:
            # 获取用户的参与状态
            participant = ActivityParticipant.query.filter_by(
                activity_id=activity.id,
                user_id=user_id
            ).first()
            
            activities_data.append({
                'id': activity.id,
                'title': activity.title,
                'description': activity.description,
                'activity_type': activity.activity_type,
                'status': activity.status,
                'start_time': activity.start_time.isoformat(),
                'end_time': activity.end_time.isoformat(),
                'location': activity.location,
                'banner_image_url': activity.banner_image_url,
                'participation': {
                    'registration_status': participant.registration_status,
                    'registration_time': participant.registration_time.isoformat(),
                    'payment_status': participant.payment_status
                },
                'created_at': activity.created_at.isoformat()
            })
        
        return jsonify({
            'success': True,
            'data': activities_data,
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': activities.total,
                'pages': activities.pages
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'获取用户活动失败: {str(e)}'
        }), 500


@activity_calendar_bp.route('/activities/<int:activity_id>/favorite', methods=['POST'])
@jwt_required()
def favorite_activity():
    """收藏活动"""
    log_api_request('POST', f'/api/v1/activity-calendar/activities/{activity_id}/favorite')
    
    try:
        user_id = get_jwt_identity()
        activity = Activity.query.get_or_404(activity_id)
        
        # 检查是否已收藏
        existing_favorite = ActivityFavorite.query.filter_by(
            user_id=user_id,
            activity_id=activity_id
        ).first()
        
        if existing_favorite:
            return jsonify({
                'success': False,
                'message': '已收藏此活动'
            }), 400
        
        # 创建收藏记录
        favorite = ActivityFavorite(
            user_id=user_id,
            activity_id=activity_id
        )
        
        db.session.add(favorite)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': '收藏活动成功'
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'收藏活动失败: {str(e)}'
        }), 500


@activity_calendar_bp.route('/activities/<int:activity_id>/favorite', methods=['DELETE'])
@jwt_required()
def unfavorite_activity():
    """取消收藏活动"""
    log_api_request('DELETE', f'/api/v1/activity-calendar/activities/{activity_id}/favorite')
    
    try:
        user_id = get_jwt_identity()
        
        favorite = ActivityFavorite.query.filter_by(
            user_id=user_id,
            activity_id=activity_id
        ).first()
        
        if not favorite:
            return jsonify({
                'success': False,
                'message': '未收藏此活动'
            }), 400
        
        db.session.delete(favorite)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': '取消收藏成功'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'取消收藏失败: {str(e)}'
        }), 500


@activity_calendar_bp.route('/calendars', methods=['GET'])
@jwt_required()
def get_calendars():
    """获取用户的日历列表"""
    log_api_request('GET', '/api/v1/activity-calendar/calendars')
    
    try:
        user_id = get_jwt_identity()
        
        calendars = ActivityCalendar.query.filter_by(user_id=user_id).all()
        
        calendars_data = []
        for calendar in calendars:
            calendars_data.append({
                'id': calendar.id,
                'name': calendar.name,
                'description': calendar.description,
                'color': calendar.color,
                'is_default': calendar.is_default,
                'is_public': calendar.is_public,
                'created_at': calendar.created_at.isoformat()
            })
        
        return jsonify({
            'success': True,
            'data': calendars_data
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'获取日历列表失败: {str(e)}'
        }), 500


@activity_calendar_bp.route('/calendars', methods=['POST'])
@jwt_required()
def create_calendar():
    """创建日历"""
    log_api_request('POST', '/api/v1/activity-calendar/calendars')
    
    try:
        data = request.get_json()
        
        # 验证必需字段
        required_fields = ['name']
        if not validate_required_fields(data, required_fields):
            return jsonify({
                'success': False,
                'message': '缺少必需字段'
            }), 400
        
        user_id = get_jwt_identity()
        name = sanitize_input(data['name'])
        description = sanitize_input(data.get('description', ''))
        color = sanitize_input(data.get('color', '#3498db'))
        is_default = data.get('is_default', False)
        is_public = data.get('is_public', False)
        
        # 如果设置为默认日历，先取消其他默认日历
        if is_default:
            ActivityCalendar.query.filter_by(user_id=user_id, is_default=True).update({
                'is_default': False
            })
        
        # 创建日历
        calendar = ActivityCalendar(
            user_id=user_id,
            name=name,
            description=description,
            color=color,
            is_default=is_default,
            is_public=is_public
        )
        
        db.session.add(calendar)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': '日历创建成功',
            'data': {
                'calendar_id': calendar.id
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'创建日历失败: {str(e)}'
        }), 500

