from flask import Blueprint, jsonify, request
from datetime import datetime, timedelta
import random

cart_bp = Blueprint('cart', __name__)

# 模拟购物车数据存储（实际应用中应使用数据库）
user_carts = {}

def generate_cart_item(nft_id, user_address):
    """生成购物车项目数据"""
    from src.routes.nft import generate_mock_nft
    
    nft = generate_mock_nft(nft_id)
    return {
        'id': f"cart_{user_address}_{nft_id}",
        'nft_id': nft_id,
        'nft': nft,
        'added_at': datetime.now().isoformat(),
        'quantity': 1,  # NFT通常数量为1
        'is_available': nft['is_for_sale'],
        'price_at_time': nft['price'],
        'currency_at_time': nft['currency']
    }

@cart_bp.route('/cart/<user_address>', methods=['GET'])
def get_cart(user_address):
    """获取用户购物车"""
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 20))
    
    if user_address not in user_carts:
        user_carts[user_address] = []
    
    cart_items = user_carts[user_address]
    
    # 分页
    start_idx = (page - 1) * limit
    end_idx = start_idx + limit
    paginated_items = cart_items[start_idx:end_idx]
    
    # 计算总价
    total_sol = sum(item['price_at_time'] for item in cart_items if item['currency_at_time'] == 'SOL' and item['is_available'])
    total_cfish = sum(item['price_at_time'] for item in cart_items if item['currency_at_time'] == 'CFISH' and item['is_available'])
    
    # 计算手续费
    sol_fees = total_sol * 0.025  # SOL 2.5% 手续费
    cfish_fees = 0  # CFISH 免手续费
    
    return jsonify({
        'success': True,
        'data': {
            'items': paginated_items,
            'pagination': {
                'page': page,
                'limit': limit,
                'total': len(cart_items),
                'pages': (len(cart_items) + limit - 1) // limit if cart_items else 1
            },
            'summary': {
                'total_items': len(cart_items),
                'available_items': len([item for item in cart_items if item['is_available']]),
                'unavailable_items': len([item for item in cart_items if not item['is_available']]),
                'total_sol': round(total_sol, 2),
                'total_cfish': round(total_cfish, 2),
                'sol_fees': round(sol_fees, 2),
                'cfish_fees': cfish_fees,
                'final_total_sol': round(total_sol + sol_fees, 2),
                'final_total_cfish': total_cfish
            }
        }
    })

@cart_bp.route('/cart/<user_address>/add', methods=['POST'])
def add_to_cart(user_address):
    """添加NFT到购物车"""
    data = request.get_json()
    nft_id = data.get('nft_id')
    
    if not nft_id:
        return jsonify({
            'success': False,
            'error': 'NFT ID is required'
        }), 400
    
    if user_address not in user_carts:
        user_carts[user_address] = []
    
    # 检查是否已在购物车中
    existing_item = next((item for item in user_carts[user_address] if item['nft_id'] == nft_id), None)
    if existing_item:
        return jsonify({
            'success': False,
            'error': 'NFT already in cart'
        }), 400
    
    # 添加到购物车
    cart_item = generate_cart_item(nft_id, user_address)
    user_carts[user_address].append(cart_item)
    
    return jsonify({
        'success': True,
        'data': {
            'message': 'NFT added to cart successfully',
            'cart_item': cart_item,
            'cart_count': len(user_carts[user_address])
        }
    })

@cart_bp.route('/cart/<user_address>/remove/<int:nft_id>', methods=['DELETE'])
def remove_from_cart(user_address, nft_id):
    """从购物车移除NFT"""
    if user_address not in user_carts:
        return jsonify({
            'success': False,
            'error': 'Cart not found'
        }), 404
    
    # 查找并移除项目
    original_length = len(user_carts[user_address])
    user_carts[user_address] = [item for item in user_carts[user_address] if item['nft_id'] != nft_id]
    
    if len(user_carts[user_address]) == original_length:
        return jsonify({
            'success': False,
            'error': 'NFT not found in cart'
        }), 404
    
    return jsonify({
        'success': True,
        'data': {
            'message': 'NFT removed from cart successfully',
            'cart_count': len(user_carts[user_address])
        }
    })

@cart_bp.route('/cart/<user_address>/clear', methods=['DELETE'])
def clear_cart(user_address):
    """清空购物车"""
    if user_address not in user_carts:
        user_carts[user_address] = []
    
    cleared_count = len(user_carts[user_address])
    user_carts[user_address] = []
    
    return jsonify({
        'success': True,
        'data': {
            'message': f'Cart cleared successfully. {cleared_count} items removed.',
            'cleared_count': cleared_count
        }
    })

@cart_bp.route('/cart/<user_address>/checkout', methods=['POST'])
def checkout_cart(user_address):
    """购物车结账"""
    data = request.get_json()
    payment_method = data.get('payment_method', 'mixed')  # mixed, sol_only, cfish_only
    
    if user_address not in user_carts or not user_carts[user_address]:
        return jsonify({
            'success': False,
            'error': 'Cart is empty'
        }), 400
    
    cart_items = user_carts[user_address]
    available_items = [item for item in cart_items if item['is_available']]
    
    if not available_items:
        return jsonify({
            'success': False,
            'error': 'No available items in cart'
        }), 400
    
    # 按支付方式筛选
    if payment_method == 'sol_only':
        checkout_items = [item for item in available_items if item['currency_at_time'] == 'SOL']
    elif payment_method == 'cfish_only':
        checkout_items = [item for item in available_items if item['currency_at_time'] == 'CFISH']
    else:
        checkout_items = available_items
    
    if not checkout_items:
        return jsonify({
            'success': False,
            'error': f'No items available for {payment_method} payment'
        }), 400
    
    # 计算费用
    total_sol = sum(item['price_at_time'] for item in checkout_items if item['currency_at_time'] == 'SOL')
    total_cfish = sum(item['price_at_time'] for item in checkout_items if item['currency_at_time'] == 'CFISH')
    sol_fees = total_sol * 0.025
    
    # 生成交易记录
    transaction_id = f"tx_{random.randint(100000, 999999)}"
    
    # 从购物车中移除已购买的项目
    purchased_nft_ids = [item['nft_id'] for item in checkout_items]
    user_carts[user_address] = [item for item in user_carts[user_address] if item['nft_id'] not in purchased_nft_ids]
    
    return jsonify({
        'success': True,
        'data': {
            'transaction_id': transaction_id,
            'purchased_items': checkout_items,
            'payment_summary': {
                'total_sol': round(total_sol, 2),
                'total_cfish': round(total_cfish, 2),
                'sol_fees': round(sol_fees, 2),
                'cfish_fees': 0,
                'final_total_sol': round(total_sol + sol_fees, 2),
                'final_total_cfish': total_cfish
            },
            'remaining_cart_items': len(user_carts[user_address]),
            'message': f'Successfully purchased {len(checkout_items)} NFTs'
        }
    })

@cart_bp.route('/cart/<user_address>/count', methods=['GET'])
def get_cart_count(user_address):
    """获取购物车商品数量"""
    if user_address not in user_carts:
        user_carts[user_address] = []
    
    return jsonify({
        'success': True,
        'data': {
            'count': len(user_carts[user_address]),
            'available_count': len([item for item in user_carts[user_address] if item['is_available']])
        }
    })

@cart_bp.route('/cart/<user_address>/update/<int:nft_id>', methods=['PUT'])
def update_cart_item(user_address, nft_id):
    """更新购物车项目（刷新价格等）"""
    if user_address not in user_carts:
        return jsonify({
            'success': False,
            'error': 'Cart not found'
        }), 404
    
    # 查找项目
    cart_item = next((item for item in user_carts[user_address] if item['nft_id'] == nft_id), None)
    if not cart_item:
        return jsonify({
            'success': False,
            'error': 'NFT not found in cart'
        }), 404
    
    # 更新NFT信息
    from src.routes.nft import generate_mock_nft
    updated_nft = generate_mock_nft(nft_id)
    
    cart_item['nft'] = updated_nft
    cart_item['is_available'] = updated_nft['is_for_sale']
    cart_item['updated_at'] = datetime.now().isoformat()
    
    # 如果价格变化，记录原价格
    if cart_item['price_at_time'] != updated_nft['price']:
        cart_item['price_changed'] = True
        cart_item['current_price'] = updated_nft['price']
    
    return jsonify({
        'success': True,
        'data': {
            'message': 'Cart item updated successfully',
            'cart_item': cart_item
        }
    })

@cart_bp.route('/cart/<user_address>/save-for-later/<int:nft_id>', methods=['POST'])
def save_for_later(user_address, nft_id):
    """保存到稍后购买"""
    if user_address not in user_carts:
        return jsonify({
            'success': False,
            'error': 'Cart not found'
        }), 404
    
    # 查找项目
    cart_item = next((item for item in user_carts[user_address] if item['nft_id'] == nft_id), None)
    if not cart_item:
        return jsonify({
            'success': False,
            'error': 'NFT not found in cart'
        }), 404
    
    # 标记为稍后购买
    cart_item['saved_for_later'] = True
    cart_item['saved_at'] = datetime.now().isoformat()
    
    return jsonify({
        'success': True,
        'data': {
            'message': 'NFT saved for later successfully',
            'cart_item': cart_item
        }
    })

