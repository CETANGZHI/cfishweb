"""
Intent Pool API routes for CFISH backend
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime, timedelta
from ..models import db
from ..models.intent_pool import Intent, IntentMatch, IntentResponse, IntentPool, IntentPoolMembership, IntentAlert, IntentHistory
from ..models.user import User
from ..models.nft import NFT
from ..utils.input_validator import validate_required_fields, sanitize_input
from ..utils.logger import log_api_request

intent_pool_bp = Blueprint('intent_pool', __name__)


@intent_pool_bp.route('/intents', methods=['GET'])
def get_intents():
    """获取意图列表"""
    log_api_request('GET', '/api/v1/intent-pool/intents')
    
    try:
        page = request.args.get('page', 1, type=int)
        per_page = min(request.args.get('per_page', 20, type=int), 100)
        intent_type = request.args.get('type')
        status = request.args.get('status', 'active')
        category = request.args.get('category')
        min_price = request.args.get('min_price', type=float)
        max_price = request.args.get('max_price', type=float)
        priority = request.args.get('priority')
        
        query = Intent.query.filter_by(is_public=True)
        
        if intent_type:
            query = query.filter_by(intent_type=intent_type)
        
        if status:
            query = query.filter_by(status=status)
        
        if category:
            query = query.filter_by(nft_category=category)
        
        if priority:
            query = query.filter_by(priority=priority)
        
        if min_price is not None:
            query = query.filter(Intent.min_price >= min_price)
        
        if max_price is not None:
            query = query.filter(Intent.max_price <= max_price)
        
        intents = query.order_by(Intent.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        intents_data = []
        for intent in intents.items:
            intents_data.append({
                'id': intent.id,
                'intent_type': intent.intent_type,
                'title': intent.title,
                'description': intent.description,
                'status': intent.status,
                'priority': intent.priority,
                'user': {
                    'id': intent.user.id,
                    'username': intent.user.username,
                    'wallet_address': intent.user.wallet_address
                },
                'target_nft': {
                    'id': intent.target_nft.id,
                    'name': intent.target_nft.name,
                    'image_ipfs_cid': intent.target_nft.image_ipfs_cid
                } if intent.target_nft else None,
                'nft_category': intent.nft_category,
                'nft_rarity': intent.nft_rarity,
                'min_price': intent.min_price,
                'max_price': intent.max_price,
                'preferred_price': intent.preferred_price,
                'price_currency': intent.price_currency,
                'expires_at': intent.expires_at.isoformat() if intent.expires_at else None,
                'tags': intent.tags,
                'view_count': intent.view_count,
                'match_count': intent.match_count,
                'created_at': intent.created_at.isoformat()
            })
        
        return jsonify({
            'success': True,
            'data': intents_data,
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': intents.total,
                'pages': intents.pages
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'获取意图列表失败: {str(e)}'
        }), 500


@intent_pool_bp.route('/intents', methods=['POST'])
@jwt_required()
def create_intent():
    """创建意图"""
    log_api_request('POST', '/api/v1/intent-pool/intents')
    
    try:
        data = request.get_json()
        
        # 验证必需字段
        required_fields = ['intent_type', 'title']
        if not validate_required_fields(data, required_fields):
            return jsonify({
                'success': False,
                'message': '缺少必需字段'
            }), 400
        
        user_id = get_jwt_identity()
        intent_type = sanitize_input(data['intent_type'])
        title = sanitize_input(data['title'])
        description = sanitize_input(data.get('description', ''))
        priority = sanitize_input(data.get('priority', 'medium'))
        
        # NFT相关字段
        target_nft_id = data.get('target_nft_id')
        nft_category = sanitize_input(data.get('nft_category', ''))
        nft_rarity = sanitize_input(data.get('nft_rarity', ''))
        nft_attributes = data.get('nft_attributes', {})
        
        # 价格相关字段
        min_price = data.get('min_price')
        max_price = data.get('max_price')
        preferred_price = data.get('preferred_price')
        price_currency = sanitize_input(data.get('price_currency', 'SOL'))
        
        # 时间相关字段
        expires_in_days = data.get('expires_in_days', 30)
        expires_at = datetime.utcnow() + timedelta(days=expires_in_days)
        
        preferred_completion_time = None
        if data.get('preferred_completion_time'):
            preferred_completion_time = datetime.fromisoformat(
                data['preferred_completion_time'].replace('Z', '+00:00')
            )
        
        # 匹配相关字段
        auto_match = data.get('auto_match', False)
        match_threshold = data.get('match_threshold', 0.8)
        
        # 其他字段
        tags = data.get('tags', [])
        metadata = data.get('metadata', {})
        is_public = data.get('is_public', True)
        
        # 验证目标NFT存在（如果指定）
        if target_nft_id:
            target_nft = NFT.query.get_or_404(target_nft_id)
        
        # 验证价格范围
        if min_price is not None and max_price is not None and min_price > max_price:
            return jsonify({
                'success': False,
                'message': '最低价格不能高于最高价格'
            }), 400
        
        # 创建意图
        intent = Intent(
            user_id=user_id,
            intent_type=intent_type,
            title=title,
            description=description,
            priority=priority,
            target_nft_id=target_nft_id,
            nft_category=nft_category,
            nft_rarity=nft_rarity,
            nft_attributes=nft_attributes,
            min_price=min_price,
            max_price=max_price,
            preferred_price=preferred_price,
            price_currency=price_currency,
            expires_at=expires_at,
            preferred_completion_time=preferred_completion_time,
            auto_match=auto_match,
            match_threshold=match_threshold,
            tags=tags,
            metadata=metadata,
            is_public=is_public
        )
        
        db.session.add(intent)
        db.session.flush()  # 获取ID
        
        # 记录历史
        history = IntentHistory(
            intent_id=intent.id,
            user_id=user_id,
            action='created',
            description=f'创建意图: {title}',
            new_data={
                'intent_type': intent_type,
                'title': title,
                'priority': priority
            }
        )
        db.session.add(history)
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': '意图创建成功',
            'data': {
                'intent_id': intent.id
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'创建意图失败: {str(e)}'
        }), 500


@intent_pool_bp.route('/intents/<int:intent_id>', methods=['GET'])
def get_intent(intent_id):
    """获取意图详情"""
    log_api_request('GET', f'/api/v1/intent-pool/intents/{intent_id}')
    
    try:
        intent = Intent.query.get_or_404(intent_id)
        
        if not intent.is_public:
            return jsonify({
                'success': False,
                'message': '意图不公开'
            }), 403
        
        # 增加查看次数
        intent.view_count += 1
        db.session.commit()
        
        # 获取匹配记录
        matches = IntentMatch.query.filter_by(intent_id=intent_id).limit(10).all()
        matches_data = []
        
        for match in matches:
            matches_data.append({
                'id': match.id,
                'match_type': match.match_type,
                'match_score': match.match_score,
                'match_reason': match.match_reason,
                'status': match.status,
                'matcher': {
                    'id': match.matcher.id,
                    'username': match.matcher.username
                },
                'matched_nft': {
                    'id': match.matched_nft.id,
                    'name': match.matched_nft.name,
                    'image_ipfs_cid': match.matched_nft.image_ipfs_cid
                } if match.matched_nft else None,
                'agreed_price': match.agreed_price,
                'agreed_currency': match.agreed_currency,
                'matched_at': match.matched_at.isoformat()
            })
        
        # 获取响应记录
        responses = IntentResponse.query.filter_by(intent_id=intent_id).limit(10).all()
        responses_data = []
        
        for response in responses:
            responses_data.append({
                'id': response.id,
                'responder': {
                    'id': response.responder.id,
                    'username': response.responder.username
                },
                'offered_nft': {
                    'id': response.offered_nft.id,
                    'name': response.offered_nft.name,
                    'image_ipfs_cid': response.offered_nft.image_ipfs_cid
                } if response.offered_nft else None,
                'offered_price': response.offered_price,
                'offered_currency': response.offered_currency,
                'message': response.message,
                'status': response.status,
                'created_at': response.created_at.isoformat()
            })
        
        return jsonify({
            'success': True,
            'data': {
                'id': intent.id,
                'intent_type': intent.intent_type,
                'title': intent.title,
                'description': intent.description,
                'status': intent.status,
                'priority': intent.priority,
                'user': {
                    'id': intent.user.id,
                    'username': intent.user.username,
                    'wallet_address': intent.user.wallet_address
                },
                'target_nft': {
                    'id': intent.target_nft.id,
                    'name': intent.target_nft.name,
                    'image_ipfs_cid': intent.target_nft.image_ipfs_cid,
                    'category': intent.target_nft.category,
                    'rarity': intent.target_nft.rarity
                } if intent.target_nft else None,
                'nft_category': intent.nft_category,
                'nft_rarity': intent.nft_rarity,
                'nft_attributes': intent.nft_attributes,
                'min_price': intent.min_price,
                'max_price': intent.max_price,
                'preferred_price': intent.preferred_price,
                'price_currency': intent.price_currency,
                'expires_at': intent.expires_at.isoformat() if intent.expires_at else None,
                'preferred_completion_time': intent.preferred_completion_time.isoformat() if intent.preferred_completion_time else None,
                'auto_match': intent.auto_match,
                'match_threshold': intent.match_threshold,
                'tags': intent.tags,
                'metadata': intent.metadata,
                'view_count': intent.view_count,
                'match_count': intent.match_count,
                'matches': matches_data,
                'responses': responses_data,
                'created_at': intent.created_at.isoformat()
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'获取意图详情失败: {str(e)}'
        }), 500


@intent_pool_bp.route('/intents/<int:intent_id>/respond', methods=['POST'])
@jwt_required()
def respond_to_intent():
    """响应意图"""
    log_api_request('POST', f'/api/v1/intent-pool/intents/{intent_id}/respond')
    
    try:
        data = request.get_json()
        user_id = get_jwt_identity()
        intent = Intent.query.get_or_404(intent_id)
        
        # 检查意图状态
        if intent.status != 'active':
            return jsonify({
                'success': False,
                'message': '意图不在活跃状态'
            }), 400
        
        # 检查是否过期
        if intent.expires_at and datetime.utcnow() > intent.expires_at:
            return jsonify({
                'success': False,
                'message': '意图已过期'
            }), 400
        
        # 不能响应自己的意图
        if intent.user_id == user_id:
            return jsonify({
                'success': False,
                'message': '不能响应自己的意图'
            }), 400
        
        offered_nft_id = data.get('offered_nft_id')
        offered_price = data.get('offered_price')
        offered_currency = sanitize_input(data.get('offered_currency', 'SOL'))
        message = sanitize_input(data.get('message', ''))
        
        # 验证提供的NFT存在且属于用户（如果指定）
        if offered_nft_id:
            offered_nft = NFT.query.get_or_404(offered_nft_id)
            if offered_nft.current_owner_id != user_id:
                return jsonify({
                    'success': False,
                    'message': '您不拥有此NFT'
                }), 403
        
        # 检查是否已经响应过
        existing_response = IntentResponse.query.filter_by(
            intent_id=intent_id,
            responder_id=user_id
        ).first()
        
        if existing_response:
            return jsonify({
                'success': False,
                'message': '您已经响应过此意图'
            }), 400
        
        # 创建响应
        response = IntentResponse(
            intent_id=intent_id,
            responder_id=user_id,
            offered_nft_id=offered_nft_id,
            offered_price=offered_price,
            offered_currency=offered_currency,
            message=message
        )
        
        db.session.add(response)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': '响应意图成功',
            'data': {
                'response_id': response.id
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'响应意图失败: {str(e)}'
        }), 500


@intent_pool_bp.route('/intents/<int:intent_id>/match', methods=['POST'])
@jwt_required()
def create_intent_match():
    """创建意图匹配"""
    log_api_request('POST', f'/api/v1/intent-pool/intents/{intent_id}/match')
    
    try:
        data = request.get_json()
        
        # 验证必需字段
        required_fields = ['match_type']
        if not validate_required_fields(data, required_fields):
            return jsonify({
                'success': False,
                'message': '缺少必需字段'
            }), 400
        
        user_id = get_jwt_identity()
        intent = Intent.query.get_or_404(intent_id)
        
        match_type = sanitize_input(data['match_type'])
        matched_intent_id = data.get('matched_intent_id')
        matched_nft_id = data.get('matched_nft_id')
        match_score = data.get('match_score', 0.0)
        match_reason = sanitize_input(data.get('match_reason', ''))
        agreed_price = data.get('agreed_price')
        agreed_currency = sanitize_input(data.get('agreed_currency', 'SOL'))
        
        # 验证匹配类型
        valid_match_types = ['intent_to_intent', 'intent_to_nft', 'manual']
        if match_type not in valid_match_types:
            return jsonify({
                'success': False,
                'message': f'无效的匹配类型。支持的类型: {", ".join(valid_match_types)}'
            }), 400
        
        # 验证匹配的意图或NFT存在
        if match_type == 'intent_to_intent' and matched_intent_id:
            matched_intent = Intent.query.get_or_404(matched_intent_id)
        
        if matched_nft_id:
            matched_nft = NFT.query.get_or_404(matched_nft_id)
            # 验证NFT所有权
            if matched_nft.current_owner_id != user_id:
                return jsonify({
                    'success': False,
                    'message': '您不拥有此NFT'
                }), 403
        
        # 创建匹配
        match = IntentMatch(
            intent_id=intent_id,
            matched_intent_id=matched_intent_id,
            matched_nft_id=matched_nft_id,
            matcher_id=user_id,
            match_type=match_type,
            match_score=match_score,
            match_reason=match_reason,
            agreed_price=agreed_price,
            agreed_currency=agreed_currency
        )
        
        db.session.add(match)
        
        # 更新意图匹配次数
        intent.match_count += 1
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': '意图匹配创建成功',
            'data': {
                'match_id': match.id
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'创建意图匹配失败: {str(e)}'
        }), 500


@intent_pool_bp.route('/intents/user/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user_intents(user_id):
    """获取用户的意图列表"""
    log_api_request('GET', f'/api/v1/intent-pool/intents/user/{user_id}')
    
    try:
        current_user_id = get_jwt_identity()
        if current_user_id != user_id:
            return jsonify({
                'success': False,
                'message': '无权限访问其他用户的意图'
            }), 403
        
        page = request.args.get('page', 1, type=int)
        per_page = min(request.args.get('per_page', 20, type=int), 100)
        status = request.args.get('status')
        intent_type = request.args.get('type')
        
        query = Intent.query.filter_by(user_id=user_id)
        
        if status:
            query = query.filter_by(status=status)
        
        if intent_type:
            query = query.filter_by(intent_type=intent_type)
        
        intents = query.order_by(Intent.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        intents_data = []
        for intent in intents.items:
            # 统计匹配和响应数量
            match_count = IntentMatch.query.filter_by(intent_id=intent.id).count()
            response_count = IntentResponse.query.filter_by(intent_id=intent.id).count()
            
            intents_data.append({
                'id': intent.id,
                'intent_type': intent.intent_type,
                'title': intent.title,
                'description': intent.description,
                'status': intent.status,
                'priority': intent.priority,
                'nft_category': intent.nft_category,
                'min_price': intent.min_price,
                'max_price': intent.max_price,
                'preferred_price': intent.preferred_price,
                'price_currency': intent.price_currency,
                'expires_at': intent.expires_at.isoformat() if intent.expires_at else None,
                'view_count': intent.view_count,
                'match_count': match_count,
                'response_count': response_count,
                'created_at': intent.created_at.isoformat()
            })
        
        return jsonify({
            'success': True,
            'data': intents_data,
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': intents.total,
                'pages': intents.pages
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'获取用户意图失败: {str(e)}'
        }), 500


@intent_pool_bp.route('/pools', methods=['GET'])
def get_intent_pools():
    """获取意图池列表"""
    log_api_request('GET', '/api/v1/intent-pool/pools')
    
    try:
        page = request.args.get('page', 1, type=int)
        per_page = min(request.args.get('per_page', 20, type=int), 100)
        pool_type = request.args.get('type')
        category = request.args.get('category')
        
        query = IntentPool.query.filter_by(is_public=True)
        
        if pool_type:
            query = query.filter_by(pool_type=pool_type)
        
        if category:
            query = query.filter_by(category=category)
        
        pools = query.order_by(IntentPool.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        pools_data = []
        for pool in pools.items:
            pools_data.append({
                'id': pool.id,
                'name': pool.name,
                'description': pool.description,
                'pool_type': pool.pool_type,
                'category': pool.category,
                'auto_matching_enabled': pool.auto_matching_enabled,
                'min_match_score': pool.min_match_score,
                'total_intents': pool.total_intents,
                'active_intents': pool.active_intents,
                'total_matches': pool.total_matches,
                'successful_matches': pool.successful_matches,
                'success_rate': (pool.successful_matches / pool.total_matches * 100) if pool.total_matches > 0 else 0,
                'created_at': pool.created_at.isoformat()
            })
        
        return jsonify({
            'success': True,
            'data': pools_data,
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': pools.total,
                'pages': pools.pages
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'获取意图池列表失败: {str(e)}'
        }), 500


@intent_pool_bp.route('/alerts', methods=['GET'])
@jwt_required()
def get_intent_alerts():
    """获取用户的意图提醒"""
    log_api_request('GET', '/api/v1/intent-pool/alerts')
    
    try:
        user_id = get_jwt_identity()
        
        alerts = IntentAlert.query.filter_by(user_id=user_id).all()
        
        alerts_data = []
        for alert in alerts:
            alerts_data.append({
                'id': alert.id,
                'alert_name': alert.alert_name,
                'alert_type': alert.alert_type,
                'nft_category': alert.nft_category,
                'nft_rarity': alert.nft_rarity,
                'min_price': alert.min_price,
                'max_price': alert.max_price,
                'keywords': alert.keywords,
                'is_active': alert.is_active,
                'notification_method': alert.notification_method,
                'frequency': alert.frequency,
                'trigger_count': alert.trigger_count,
                'last_triggered': alert.last_triggered.isoformat() if alert.last_triggered else None,
                'created_at': alert.created_at.isoformat()
            })
        
        return jsonify({
            'success': True,
            'data': alerts_data
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'获取意图提醒失败: {str(e)}'
        }), 500


@intent_pool_bp.route('/alerts', methods=['POST'])
@jwt_required()
def create_intent_alert():
    """创建意图提醒"""
    log_api_request('POST', '/api/v1/intent-pool/alerts')
    
    try:
        data = request.get_json()
        
        # 验证必需字段
        required_fields = ['alert_name', 'alert_type']
        if not validate_required_fields(data, required_fields):
            return jsonify({
                'success': False,
                'message': '缺少必需字段'
            }), 400
        
        user_id = get_jwt_identity()
        alert_name = sanitize_input(data['alert_name'])
        alert_type = sanitize_input(data['alert_type'])
        nft_category = sanitize_input(data.get('nft_category', ''))
        nft_rarity = sanitize_input(data.get('nft_rarity', ''))
        min_price = data.get('min_price')
        max_price = data.get('max_price')
        keywords = data.get('keywords', [])
        notification_method = sanitize_input(data.get('notification_method', 'in_app'))
        frequency = sanitize_input(data.get('frequency', 'immediate'))
        
        # 创建提醒
        alert = IntentAlert(
            user_id=user_id,
            alert_name=alert_name,
            alert_type=alert_type,
            nft_category=nft_category,
            nft_rarity=nft_rarity,
            min_price=min_price,
            max_price=max_price,
            keywords=keywords,
            notification_method=notification_method,
            frequency=frequency
        )
        
        db.session.add(alert)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': '意图提醒创建成功',
            'data': {
                'alert_id': alert.id
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'创建意图提醒失败: {str(e)}'
        }), 500

