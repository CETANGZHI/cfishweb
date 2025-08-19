"""
Wallet API routes for CFISH backend
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime, timedelta
from ..models import db
from ..models.wallet import WalletBalance, TransactionRecord, WalletConnection, PaymentMethod, WalletActivity, TokenInfo
from ..models.user import User
from ..utils.input_validator import validate_required_fields, sanitize_input
from ..utils.logger import log_api_request

wallet_bp = Blueprint('wallet', __name__)


@wallet_bp.route('/balance/<int:user_id>', methods=['GET'])
@jwt_required()
def get_wallet_balance(user_id):
    """获取用户钱包余额"""
    log_api_request('GET', f'/api/v1/wallet/balance/{user_id}')
    
    try:
        current_user_id = get_jwt_identity()
        if current_user_id != user_id:
            return jsonify({
                'success': False,
                'message': '无权限访问其他用户的钱包余额'
            }), 403
        
        balances = WalletBalance.query.filter_by(user_id=user_id).all()
        
        balances_data = []
        total_value_usd = 0
        
        for balance in balances:
            # 获取代币信息
            token_info = TokenInfo.query.filter_by(token_address=balance.token_address).first()
            price_usd = token_info.price_usd if token_info else 0
            
            balance_value_usd = balance.balance * price_usd
            total_value_usd += balance_value_usd
            
            balances_data.append({
                'token_address': balance.token_address,
                'token_symbol': balance.token_symbol,
                'token_name': balance.token_name,
                'balance': balance.balance,
                'locked_balance': balance.locked_balance,
                'available_balance': balance.balance - balance.locked_balance,
                'price_usd': price_usd,
                'value_usd': balance_value_usd,
                'last_updated': balance.last_updated.isoformat()
            })
        
        return jsonify({
            'success': True,
            'data': {
                'balances': balances_data,
                'total_value_usd': total_value_usd
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'获取钱包余额失败: {str(e)}'
        }), 500


@wallet_bp.route('/transactions/<int:user_id>', methods=['GET'])
@jwt_required()
def get_transaction_history(user_id):
    """获取用户交易记录"""
    log_api_request('GET', f'/api/v1/wallet/transactions/{user_id}')
    
    try:
        current_user_id = get_jwt_identity()
        if current_user_id != user_id:
            return jsonify({
                'success': False,
                'message': '无权限访问其他用户的交易记录'
            }), 403
        
        page = request.args.get('page', 1, type=int)
        per_page = min(request.args.get('per_page', 20, type=int), 100)
        transaction_type = request.args.get('type')
        status = request.args.get('status')
        
        query = TransactionRecord.query.filter_by(user_id=user_id)
        
        if transaction_type:
            query = query.filter_by(transaction_type=transaction_type)
        
        if status:
            query = query.filter_by(status=status)
        
        transactions = query.order_by(TransactionRecord.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        transactions_data = []
        for tx in transactions.items:
            transactions_data.append({
                'id': tx.id,
                'transaction_hash': tx.transaction_hash,
                'transaction_type': tx.transaction_type,
                'from_address': tx.from_address,
                'to_address': tx.to_address,
                'token_address': tx.token_address,
                'token_symbol': tx.token_symbol,
                'amount': tx.amount,
                'fee': tx.fee,
                'status': tx.status,
                'block_number': tx.block_number,
                'block_timestamp': tx.block_timestamp.isoformat() if tx.block_timestamp else None,
                'gas_used': tx.gas_used,
                'gas_price': tx.gas_price,
                'nft_id': tx.nft_id,
                'description': tx.description,
                'created_at': tx.created_at.isoformat()
            })
        
        return jsonify({
            'success': True,
            'data': transactions_data,
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': transactions.total,
                'pages': transactions.pages
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'获取交易记录失败: {str(e)}'
        }), 500


@wallet_bp.route('/connections/<int:user_id>', methods=['GET'])
@jwt_required()
def get_wallet_connections(user_id):
    """获取用户钱包连接"""
    log_api_request('GET', f'/api/v1/wallet/connections/{user_id}')
    
    try:
        current_user_id = get_jwt_identity()
        if current_user_id != user_id:
            return jsonify({
                'success': False,
                'message': '无权限访问其他用户的钱包连接'
            }), 403
        
        connections = WalletConnection.query.filter_by(user_id=user_id, is_active=True).all()
        
        connections_data = []
        for conn in connections:
            connections_data.append({
                'id': conn.id,
                'wallet_address': conn.wallet_address,
                'wallet_type': conn.wallet_type,
                'is_primary': conn.is_primary,
                'last_connected': conn.last_connected.isoformat(),
                'created_at': conn.created_at.isoformat()
            })
        
        return jsonify({
            'success': True,
            'data': connections_data
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'获取钱包连接失败: {str(e)}'
        }), 500


@wallet_bp.route('/connections', methods=['POST'])
@jwt_required()
def add_wallet_connection():
    """添加钱包连接"""
    log_api_request('POST', '/api/v1/wallet/connections')
    
    try:
        data = request.get_json()
        
        # 验证必需字段
        required_fields = ['wallet_address', 'wallet_type']
        if not validate_required_fields(data, required_fields):
            return jsonify({
                'success': False,
                'message': '缺少必需字段'
            }), 400
        
        user_id = get_jwt_identity()
        wallet_address = sanitize_input(data['wallet_address'])
        wallet_type = sanitize_input(data['wallet_type'])
        is_primary = data.get('is_primary', False)
        
        # 检查钱包地址是否已存在
        existing_connection = WalletConnection.query.filter_by(
            wallet_address=wallet_address,
            is_active=True
        ).first()
        
        if existing_connection:
            return jsonify({
                'success': False,
                'message': '钱包地址已存在'
            }), 400
        
        # 如果设置为主钱包，先取消其他主钱包
        if is_primary:
            WalletConnection.query.filter_by(user_id=user_id, is_primary=True).update({
                'is_primary': False
            })
        
        # 创建钱包连接
        connection = WalletConnection(
            user_id=user_id,
            wallet_address=wallet_address,
            wallet_type=wallet_type,
            is_primary=is_primary
        )
        
        db.session.add(connection)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': '钱包连接添加成功',
            'data': {
                'connection_id': connection.id
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'添加钱包连接失败: {str(e)}'
        }), 500


@wallet_bp.route('/payment-methods/<int:user_id>', methods=['GET'])
@jwt_required()
def get_payment_methods(user_id):
    """获取用户支付方式"""
    log_api_request('GET', f'/api/v1/wallet/payment-methods/{user_id}')
    
    try:
        current_user_id = get_jwt_identity()
        if current_user_id != user_id:
            return jsonify({
                'success': False,
                'message': '无权限访问其他用户的支付方式'
            }), 403
        
        payment_methods = PaymentMethod.query.filter_by(user_id=user_id, is_active=True).all()
        
        methods_data = []
        for method in payment_methods:
            # 不返回敏感的支付详情，只返回基本信息
            methods_data.append({
                'id': method.id,
                'method_type': method.method_type,
                'method_name': method.method_name,
                'is_default': method.is_default,
                'created_at': method.created_at.isoformat()
            })
        
        return jsonify({
            'success': True,
            'data': methods_data
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'获取支付方式失败: {str(e)}'
        }), 500


@wallet_bp.route('/payment-methods', methods=['POST'])
@jwt_required()
def add_payment_method():
    """添加支付方式"""
    log_api_request('POST', '/api/v1/wallet/payment-methods')
    
    try:
        data = request.get_json()
        
        # 验证必需字段
        required_fields = ['method_type', 'method_name']
        if not validate_required_fields(data, required_fields):
            return jsonify({
                'success': False,
                'message': '缺少必需字段'
            }), 400
        
        user_id = get_jwt_identity()
        method_type = sanitize_input(data['method_type'])
        method_name = sanitize_input(data['method_name'])
        details = data.get('details', {})
        is_default = data.get('is_default', False)
        
        # 如果设置为默认支付方式，先取消其他默认支付方式
        if is_default:
            PaymentMethod.query.filter_by(user_id=user_id, is_default=True).update({
                'is_default': False
            })
        
        # 创建支付方式（注意：实际应用中需要加密存储敏感信息）
        payment_method = PaymentMethod(
            user_id=user_id,
            method_type=method_type,
            method_name=method_name,
            details=details,
            is_default=is_default
        )
        
        db.session.add(payment_method)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': '支付方式添加成功',
            'data': {
                'method_id': payment_method.id
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'添加支付方式失败: {str(e)}'
        }), 500


@wallet_bp.route('/activity/<int:user_id>', methods=['GET'])
@jwt_required()
def get_wallet_activity(user_id):
    """获取钱包活动记录"""
    log_api_request('GET', f'/api/v1/wallet/activity/{user_id}')
    
    try:
        current_user_id = get_jwt_identity()
        if current_user_id != user_id:
            return jsonify({
                'success': False,
                'message': '无权限访问其他用户的钱包活动'
            }), 403
        
        page = request.args.get('page', 1, type=int)
        per_page = min(request.args.get('per_page', 20, type=int), 100)
        activity_type = request.args.get('type')
        
        query = WalletActivity.query.filter_by(user_id=user_id)
        
        if activity_type:
            query = query.filter_by(activity_type=activity_type)
        
        activities = query.order_by(WalletActivity.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        activities_data = []
        for activity in activities.items:
            activities_data.append({
                'id': activity.id,
                'activity_type': activity.activity_type,
                'description': activity.description,
                'metadata': activity.metadata,
                'ip_address': activity.ip_address,
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
            'message': f'获取钱包活动失败: {str(e)}'
        }), 500


@wallet_bp.route('/tokens', methods=['GET'])
def get_supported_tokens():
    """获取支持的代币列表"""
    log_api_request('GET', '/api/v1/wallet/tokens')
    
    try:
        tokens = TokenInfo.query.filter_by(is_active=True).all()
        
        tokens_data = []
        for token in tokens:
            tokens_data.append({
                'token_address': token.token_address,
                'token_symbol': token.token_symbol,
                'token_name': token.token_name,
                'decimals': token.decimals,
                'logo_url': token.logo_url,
                'price_usd': token.price_usd,
                'market_cap': token.market_cap,
                'is_verified': token.is_verified
            })
        
        return jsonify({
            'success': True,
            'data': tokens_data
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'获取代币列表失败: {str(e)}'
        }), 500


@wallet_bp.route('/sync-balance', methods=['POST'])
@jwt_required()
def sync_wallet_balance():
    """同步钱包余额"""
    log_api_request('POST', '/api/v1/wallet/sync-balance')
    
    try:
        data = request.get_json()
        
        # 验证必需字段
        required_fields = ['token_address', 'balance']
        if not validate_required_fields(data, required_fields):
            return jsonify({
                'success': False,
                'message': '缺少必需字段'
            }), 400
        
        user_id = get_jwt_identity()
        token_address = sanitize_input(data['token_address'])
        balance = float(sanitize_input(data['balance']))
        
        # 获取代币信息
        token_info = TokenInfo.query.filter_by(token_address=token_address).first()
        if not token_info:
            return jsonify({
                'success': False,
                'message': '不支持的代币'
            }), 400
        
        # 查找或创建余额记录
        wallet_balance = WalletBalance.query.filter_by(
            user_id=user_id,
            token_address=token_address
        ).first()
        
        if wallet_balance:
            wallet_balance.balance = balance
            wallet_balance.last_updated = datetime.utcnow()
        else:
            wallet_balance = WalletBalance(
                user_id=user_id,
                token_address=token_address,
                token_symbol=token_info.token_symbol,
                token_name=token_info.token_name,
                balance=balance
            )
            db.session.add(wallet_balance)
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': '余额同步成功'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'余额同步失败: {str(e)}'
        }), 500

