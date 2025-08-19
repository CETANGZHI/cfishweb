"""
Barter API routes for CFISH backend
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime, timedelta
from ..models import db
from ..models.barter import BarterRequest, BarterResponse, BarterMatch, BarterHistory, BarterPreference
from ..models.user import User
from ..models.nft import NFT
from ..utils.input_validator import validate_required_fields, sanitize_input
from ..utils.logger import log_api_request

barter_bp = Blueprint('barter', __name__)


@barter_bp.route('/requests', methods=['GET'])
def get_barter_requests():
    """获取易货请求列表"""
    log_api_request('GET', '/api/v1/barter/requests')
    
    try:
        page = request.args.get('page', 1, type=int)
        per_page = min(request.args.get('per_page', 20, type=int), 100)
        status = request.args.get('status', 'active')
        request_type = request.args.get('type')
        category = request.args.get('category')
        
        query = BarterRequest.query.filter_by(status=status)
        
        if request_type:
            query = query.filter_by(request_type=request_type)
        
        # 如果指定了类别，通过offered_nft的类别过滤
        if category:
            query = query.join(NFT, BarterRequest.offered_nft_id == NFT.id).filter(NFT.category == category)
        
        requests = query.order_by(BarterRequest.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        requests_data = []
        for req in requests.items:
            requests_data.append({
                'id': req.id,
                'title': req.title,
                'description': req.description,
                'request_type': req.request_type,
                'status': req.status,
                'requester': {
                    'id': req.requester.id,
                    'username': req.requester.username,
                    'wallet_address': req.requester.wallet_address
                },
                'offered_nft': {
                    'id': req.offered_nft.id,
                    'name': req.offered_nft.name,
                    'image_ipfs_cid': req.offered_nft.image_ipfs_cid,
                    'category': req.offered_nft.category,
                    'rarity': req.offered_nft.rarity,
                    'price': req.offered_nft.price
                },
                'requested_nft': {
                    'id': req.requested_nft.id,
                    'name': req.requested_nft.name,
                    'image_ipfs_cid': req.requested_nft.image_ipfs_cid,
                    'category': req.requested_nft.category,
                    'rarity': req.requested_nft.rarity,
                    'price': req.requested_nft.price
                } if req.requested_nft else None,
                'target_user': {
                    'id': req.target_user.id,
                    'username': req.target_user.username
                } if req.target_user else None,
                'expires_at': req.expires_at.isoformat() if req.expires_at else None,
                'created_at': req.created_at.isoformat()
            })
        
        return jsonify({
            'success': True,
            'data': requests_data,
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': requests.total,
                'pages': requests.pages
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'获取易货请求失败: {str(e)}'
        }), 500


@barter_bp.route('/requests', methods=['POST'])
@jwt_required()
def create_barter_request():
    """创建易货请求"""
    log_api_request('POST', '/api/v1/barter/requests')
    
    try:
        data = request.get_json()
        
        # 验证必需字段
        required_fields = ['offered_nft_id', 'title']
        if not validate_required_fields(data, required_fields):
            return jsonify({
                'success': False,
                'message': '缺少必需字段'
            }), 400
        
        user_id = get_jwt_identity()
        offered_nft_id = sanitize_input(data['offered_nft_id'])
        title = sanitize_input(data['title'])
        description = sanitize_input(data.get('description', ''))
        requested_nft_id = data.get('requested_nft_id')
        target_user_id = data.get('target_user_id')
        request_type = sanitize_input(data.get('request_type', 'open'))
        expires_in_days = data.get('expires_in_days', 30)
        
        # 验证提供的NFT存在且属于用户
        offered_nft = NFT.query.get_or_404(offered_nft_id)
        if offered_nft.current_owner_id != user_id:
            return jsonify({
                'success': False,
                'message': '您不拥有此NFT'
            }), 403
        
        # 验证请求的NFT存在（如果指定）
        if requested_nft_id:
            requested_nft = NFT.query.get_or_404(requested_nft_id)
            if requested_nft.current_owner_id == user_id:
                return jsonify({
                    'success': False,
                    'message': '不能请求自己拥有的NFT'
                }), 400
        
        # 验证目标用户存在（如果指定）
        if target_user_id:
            target_user = User.query.get_or_404(target_user_id)
            if target_user.id == user_id:
                return jsonify({
                    'success': False,
                    'message': '不能向自己发起易货请求'
                }), 400
        
        # 计算过期时间
        expires_at = datetime.utcnow() + timedelta(days=expires_in_days)
        
        # 创建易货请求
        barter_request = BarterRequest(
            requester_id=user_id,
            target_user_id=target_user_id,
            offered_nft_id=offered_nft_id,
            requested_nft_id=requested_nft_id,
            title=title,
            description=description,
            request_type=request_type,
            expires_at=expires_at
        )
        
        db.session.add(barter_request)
        db.session.commit()
        
        # 记录历史
        history = BarterHistory(
            match_id=None,  # 暂时没有match
            user_id=user_id,
            action='created',
            description=f'创建易货请求: {title}'
        )
        db.session.add(history)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': '易货请求创建成功',
            'data': {
                'request_id': barter_request.id
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'创建易货请求失败: {str(e)}'
        }), 500


@barter_bp.route('/requests/<int:request_id>', methods=['GET'])
def get_barter_request(request_id):
    """获取易货请求详情"""
    log_api_request('GET', f'/api/v1/barter/requests/{request_id}')
    
    try:
        barter_request = BarterRequest.query.get_or_404(request_id)
        
        # 获取响应列表
        responses = BarterResponse.query.filter_by(request_id=request_id).all()
        responses_data = []
        
        for response in responses:
            responses_data.append({
                'id': response.id,
                'responder': {
                    'id': response.responder.id,
                    'username': response.responder.username,
                    'wallet_address': response.responder.wallet_address
                },
                'offered_nft': {
                    'id': response.offered_nft.id,
                    'name': response.offered_nft.name,
                    'image_ipfs_cid': response.offered_nft.image_ipfs_cid,
                    'category': response.offered_nft.category,
                    'rarity': response.offered_nft.rarity,
                    'price': response.offered_nft.price
                },
                'message': response.message,
                'status': response.status,
                'created_at': response.created_at.isoformat()
            })
        
        return jsonify({
            'success': True,
            'data': {
                'id': barter_request.id,
                'title': barter_request.title,
                'description': barter_request.description,
                'request_type': barter_request.request_type,
                'status': barter_request.status,
                'requester': {
                    'id': barter_request.requester.id,
                    'username': barter_request.requester.username,
                    'wallet_address': barter_request.requester.wallet_address
                },
                'offered_nft': {
                    'id': barter_request.offered_nft.id,
                    'name': barter_request.offered_nft.name,
                    'image_ipfs_cid': barter_request.offered_nft.image_ipfs_cid,
                    'category': barter_request.offered_nft.category,
                    'rarity': barter_request.offered_nft.rarity,
                    'price': barter_request.offered_nft.price
                },
                'requested_nft': {
                    'id': barter_request.requested_nft.id,
                    'name': barter_request.requested_nft.name,
                    'image_ipfs_cid': barter_request.requested_nft.image_ipfs_cid,
                    'category': barter_request.requested_nft.category,
                    'rarity': barter_request.requested_nft.rarity,
                    'price': barter_request.requested_nft.price
                } if barter_request.requested_nft else None,
                'target_user': {
                    'id': barter_request.target_user.id,
                    'username': barter_request.target_user.username
                } if barter_request.target_user else None,
                'expires_at': barter_request.expires_at.isoformat() if barter_request.expires_at else None,
                'responses': responses_data,
                'created_at': barter_request.created_at.isoformat()
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'获取易货请求详情失败: {str(e)}'
        }), 500


@barter_bp.route('/requests/<int:request_id>/respond', methods=['POST'])
@jwt_required()
def respond_to_barter_request():
    """响应易货请求"""
    log_api_request('POST', f'/api/v1/barter/requests/{request_id}/respond')
    
    try:
        data = request.get_json()
        
        # 验证必需字段
        required_fields = ['offered_nft_id']
        if not validate_required_fields(data, required_fields):
            return jsonify({
                'success': False,
                'message': '缺少必需字段'
            }), 400
        
        user_id = get_jwt_identity()
        request_id = request.view_args['request_id']
        offered_nft_id = sanitize_input(data['offered_nft_id'])
        message = sanitize_input(data.get('message', ''))
        
        # 验证易货请求存在且有效
        barter_request = BarterRequest.query.get_or_404(request_id)
        
        if barter_request.status != 'active':
            return jsonify({
                'success': False,
                'message': '易货请求不在活跃状态'
            }), 400
        
        if barter_request.requester_id == user_id:
            return jsonify({
                'success': False,
                'message': '不能响应自己的易货请求'
            }), 400
        
        # 检查是否已过期
        if barter_request.expires_at and barter_request.expires_at < datetime.utcnow():
            return jsonify({
                'success': False,
                'message': '易货请求已过期'
            }), 400
        
        # 验证提供的NFT存在且属于用户
        offered_nft = NFT.query.get_or_404(offered_nft_id)
        if offered_nft.current_owner_id != user_id:
            return jsonify({
                'success': False,
                'message': '您不拥有此NFT'
            }), 403
        
        # 检查是否已经响应过
        existing_response = BarterResponse.query.filter_by(
            request_id=request_id,
            responder_id=user_id
        ).first()
        
        if existing_response:
            return jsonify({
                'success': False,
                'message': '您已经响应过此易货请求'
            }), 400
        
        # 创建响应
        response = BarterResponse(
            request_id=request_id,
            responder_id=user_id,
            offered_nft_id=offered_nft_id,
            message=message
        )
        
        db.session.add(response)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': '易货响应创建成功',
            'data': {
                'response_id': response.id
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'响应易货请求失败: {str(e)}'
        }), 500


@barter_bp.route('/requests/<int:request_id>/accept/<int:response_id>', methods=['PUT'])
@jwt_required()
def accept_barter_response():
    """接受易货响应"""
    log_api_request('PUT', f'/api/v1/barter/requests/{request_id}/accept/{response_id}')
    
    try:
        user_id = get_jwt_identity()
        request_id = request.view_args['request_id']
        response_id = request.view_args['response_id']
        
        # 验证易货请求存在且属于当前用户
        barter_request = BarterRequest.query.get_or_404(request_id)
        
        if barter_request.requester_id != user_id:
            return jsonify({
                'success': False,
                'message': '只有请求发起人可以接受响应'
            }), 403
        
        if barter_request.status != 'active':
            return jsonify({
                'success': False,
                'message': '易货请求不在活跃状态'
            }), 400
        
        # 验证响应存在
        response = BarterResponse.query.get_or_404(response_id)
        
        if response.request_id != request_id:
            return jsonify({
                'success': False,
                'message': '响应不属于此请求'
            }), 400
        
        if response.status != 'pending':
            return jsonify({
                'success': False,
                'message': '响应不在待处理状态'
            }), 400
        
        # 更新响应状态
        response.status = 'accepted'
        
        # 更新请求状态
        barter_request.status = 'matched'
        
        # 创建匹配记录
        match = BarterMatch(
            request_id=request_id,
            response_id=response_id,
            requester_id=barter_request.requester_id,
            responder_id=response.responder_id,
            requester_nft_id=barter_request.offered_nft_id,
            responder_nft_id=response.offered_nft_id
        )
        
        db.session.add(match)
        
        # 拒绝其他响应
        BarterResponse.query.filter(
            BarterResponse.request_id == request_id,
            BarterResponse.id != response_id,
            BarterResponse.status == 'pending'
        ).update({'status': 'rejected'})
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': '易货响应接受成功',
            'data': {
                'match_id': match.id
            }
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'接受易货响应失败: {str(e)}'
        }), 500


@barter_bp.route('/requests/<int:request_id>/reject/<int:response_id>', methods=['PUT'])
@jwt_required()
def reject_barter_response():
    """拒绝易货响应"""
    log_api_request('PUT', f'/api/v1/barter/requests/{request_id}/reject/{response_id}')
    
    try:
        user_id = get_jwt_identity()
        request_id = request.view_args['request_id']
        response_id = request.view_args['response_id']
        
        # 验证易货请求存在且属于当前用户
        barter_request = BarterRequest.query.get_or_404(request_id)
        
        if barter_request.requester_id != user_id:
            return jsonify({
                'success': False,
                'message': '只有请求发起人可以拒绝响应'
            }), 403
        
        # 验证响应存在
        response = BarterResponse.query.get_or_404(response_id)
        
        if response.request_id != request_id:
            return jsonify({
                'success': False,
                'message': '响应不属于此请求'
            }), 400
        
        if response.status != 'pending':
            return jsonify({
                'success': False,
                'message': '响应不在待处理状态'
            }), 400
        
        # 更新响应状态
        response.status = 'rejected'
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': '易货响应拒绝成功'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'拒绝易货响应失败: {str(e)}'
        }), 500


@barter_bp.route('/requests/user/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user_barter_requests(user_id):
    """获取用户发起的易货请求"""
    log_api_request('GET', f'/api/v1/barter/requests/user/{user_id}')
    
    try:
        current_user_id = get_jwt_identity()
        if current_user_id != user_id:
            return jsonify({
                'success': False,
                'message': '无权限访问其他用户的易货请求'
            }), 403
        
        page = request.args.get('page', 1, type=int)
        per_page = min(request.args.get('per_page', 20, type=int), 100)
        status = request.args.get('status')
        
        query = BarterRequest.query.filter_by(requester_id=user_id)
        
        if status:
            query = query.filter_by(status=status)
        
        requests = query.order_by(BarterRequest.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        requests_data = []
        for req in requests.items:
            # 统计响应数量
            response_count = BarterResponse.query.filter_by(request_id=req.id).count()
            
            requests_data.append({
                'id': req.id,
                'title': req.title,
                'description': req.description,
                'request_type': req.request_type,
                'status': req.status,
                'offered_nft': {
                    'id': req.offered_nft.id,
                    'name': req.offered_nft.name,
                    'image_ipfs_cid': req.offered_nft.image_ipfs_cid
                },
                'response_count': response_count,
                'expires_at': req.expires_at.isoformat() if req.expires_at else None,
                'created_at': req.created_at.isoformat()
            })
        
        return jsonify({
            'success': True,
            'data': requests_data,
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': requests.total,
                'pages': requests.pages
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'获取用户易货请求失败: {str(e)}'
        }), 500


@barter_bp.route('/requests/received/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user_received_barter_requests(user_id):
    """获取用户收到的易货请求"""
    log_api_request('GET', f'/api/v1/barter/requests/received/{user_id}')
    
    try:
        current_user_id = get_jwt_identity()
        if current_user_id != user_id:
            return jsonify({
                'success': False,
                'message': '无权限访问其他用户的易货请求'
            }), 403
        
        page = request.args.get('page', 1, type=int)
        per_page = min(request.args.get('per_page', 20, type=int), 100)
        
        # 获取针对用户的易货请求或用户响应过的请求
        requests = BarterRequest.query.filter(
            (BarterRequest.target_user_id == user_id) |
            (BarterRequest.id.in_(
                db.session.query(BarterResponse.request_id).filter_by(responder_id=user_id)
            ))
        ).order_by(BarterRequest.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        requests_data = []
        for req in requests.items:
            # 检查用户是否已响应
            user_response = BarterResponse.query.filter_by(
                request_id=req.id,
                responder_id=user_id
            ).first()
            
            requests_data.append({
                'id': req.id,
                'title': req.title,
                'description': req.description,
                'request_type': req.request_type,
                'status': req.status,
                'requester': {
                    'id': req.requester.id,
                    'username': req.requester.username
                },
                'offered_nft': {
                    'id': req.offered_nft.id,
                    'name': req.offered_nft.name,
                    'image_ipfs_cid': req.offered_nft.image_ipfs_cid
                },
                'user_responded': user_response is not None,
                'user_response_status': user_response.status if user_response else None,
                'expires_at': req.expires_at.isoformat() if req.expires_at else None,
                'created_at': req.created_at.isoformat()
            })
        
        return jsonify({
            'success': True,
            'data': requests_data,
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': requests.total,
                'pages': requests.pages
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'获取用户收到的易货请求失败: {str(e)}'
        }), 500

