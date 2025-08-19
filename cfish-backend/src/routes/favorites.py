from flask import Blueprint, jsonify, request
from datetime import datetime
import random

favorites_bp = Blueprint('favorites', __name__)

# 模拟收藏数据存储（实际应用中应使用数据库）
user_favorites = {}
nft_like_counts = {}

@favorites_bp.route('/nfts/<int:nft_id>/like', methods=['POST'])
def like_nft(nft_id):
    """点赞/取消点赞NFT"""
    data = request.get_json()
    user_address = data.get('user_address')
    
    if not user_address:
        return jsonify({
            'success': False,
            'error': 'User address is required'
        }), 400
    
    if user_address not in user_favorites:
        user_favorites[user_address] = set()
    
    if nft_id not in nft_like_counts:
        nft_like_counts[nft_id] = random.randint(50, 1000)
    
    is_liked = nft_id in user_favorites[user_address]
    
    if is_liked:
        # 取消点赞
        user_favorites[user_address].remove(nft_id)
        nft_like_counts[nft_id] = max(0, nft_like_counts[nft_id] - 1)
        action = 'unliked'
    else:
        # 点赞
        user_favorites[user_address].add(nft_id)
        nft_like_counts[nft_id] += 1
        action = 'liked'
    
    return jsonify({
        'success': True,
        'data': {
            'nft_id': nft_id,
            'action': action,
            'is_liked': not is_liked,
            'total_likes': nft_like_counts[nft_id],
            'message': f'NFT {action} successfully'
        }
    })

@favorites_bp.route('/nfts/<int:nft_id>/like-status', methods=['GET'])
def get_like_status(nft_id):
    """获取NFT点赞状态"""
    user_address = request.args.get('user_address')
    
    if not user_address:
        return jsonify({
            'success': False,
            'error': 'User address is required'
        }), 400
    
    if nft_id not in nft_like_counts:
        nft_like_counts[nft_id] = random.randint(50, 1000)
    
    is_liked = user_address in user_favorites and nft_id in user_favorites[user_address]
    
    return jsonify({
        'success': True,
        'data': {
            'nft_id': nft_id,
            'is_liked': is_liked,
            'total_likes': nft_like_counts[nft_id]
        }
    })

@favorites_bp.route('/users/<user_address>/favorites', methods=['GET'])
def get_user_favorites(user_address):
    """获取用户收藏的NFT列表"""
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 20))
    sort_by = request.args.get('sort_by', 'liked_at')  # liked_at, price, name
    order = request.args.get('order', 'desc')
    
    if user_address not in user_favorites:
        user_favorites[user_address] = set()
    
    favorite_nft_ids = list(user_favorites[user_address])
    
    if not favorite_nft_ids:
        return jsonify({
            'success': True,
            'data': {
                'favorites': [],
                'pagination': {
                    'page': page,
                    'limit': limit,
                    'total': 0,
                    'pages': 1
                }
            }
        })
    
    # 生成收藏的NFT数据
    from src.routes.nft import generate_mock_nft
    favorites = []
    
    for nft_id in favorite_nft_ids:
        nft = generate_mock_nft(nft_id)
        favorite_item = {
            'nft': nft,
            'liked_at': datetime.now().isoformat(),
            'is_available': nft['is_for_sale'],
            'price_change': random.choice(['up', 'down', 'stable']),
            'price_change_percentage': round(random.uniform(-20, 20), 2)
        }
        favorites.append(favorite_item)
    
    # 排序
    if sort_by == 'price':
        favorites.sort(key=lambda x: x['nft']['price'], reverse=(order == 'desc'))
    elif sort_by == 'name':
        favorites.sort(key=lambda x: x['nft']['name'], reverse=(order == 'desc'))
    else:  # liked_at
        favorites.sort(key=lambda x: x['liked_at'], reverse=(order == 'desc'))
    
    # 分页
    start_idx = (page - 1) * limit
    end_idx = start_idx + limit
    paginated_favorites = favorites[start_idx:end_idx]
    
    return jsonify({
        'success': True,
        'data': {
            'favorites': paginated_favorites,
            'pagination': {
                'page': page,
                'limit': limit,
                'total': len(favorites),
                'pages': (len(favorites) + limit - 1) // limit
            },
            'summary': {
                'total_favorites': len(favorites),
                'available_for_sale': len([f for f in favorites if f['is_available']]),
                'price_increases': len([f for f in favorites if f['price_change'] == 'up']),
                'price_decreases': len([f for f in favorites if f['price_change'] == 'down'])
            }
        }
    })

@favorites_bp.route('/users/<user_address>/favorites/count', methods=['GET'])
def get_favorites_count(user_address):
    """获取用户收藏数量"""
    if user_address not in user_favorites:
        user_favorites[user_address] = set()
    
    return jsonify({
        'success': True,
        'data': {
            'count': len(user_favorites[user_address])
        }
    })

@favorites_bp.route('/users/<user_address>/favorites/batch', methods=['POST'])
def batch_like_nfts(user_address):
    """批量点赞NFT"""
    data = request.get_json()
    nft_ids = data.get('nft_ids', [])
    action = data.get('action', 'like')  # like or unlike
    
    if not nft_ids:
        return jsonify({
            'success': False,
            'error': 'NFT IDs are required'
        }), 400
    
    if user_address not in user_favorites:
        user_favorites[user_address] = set()
    
    results = []
    
    for nft_id in nft_ids:
        if nft_id not in nft_like_counts:
            nft_like_counts[nft_id] = random.randint(50, 1000)
        
        is_currently_liked = nft_id in user_favorites[user_address]
        
        if action == 'like' and not is_currently_liked:
            user_favorites[user_address].add(nft_id)
            nft_like_counts[nft_id] += 1
            results.append({
                'nft_id': nft_id,
                'action': 'liked',
                'success': True
            })
        elif action == 'unlike' and is_currently_liked:
            user_favorites[user_address].remove(nft_id)
            nft_like_counts[nft_id] = max(0, nft_like_counts[nft_id] - 1)
            results.append({
                'nft_id': nft_id,
                'action': 'unliked',
                'success': True
            })
        else:
            results.append({
                'nft_id': nft_id,
                'action': 'no_change',
                'success': False,
                'reason': f'NFT already {"liked" if is_currently_liked else "not liked"}'
            })
    
    successful_actions = len([r for r in results if r['success']])
    
    return jsonify({
        'success': True,
        'data': {
            'results': results,
            'summary': {
                'total_processed': len(nft_ids),
                'successful_actions': successful_actions,
                'failed_actions': len(nft_ids) - successful_actions
            }
        }
    })

@favorites_bp.route('/users/<user_address>/favorites/clear', methods=['DELETE'])
def clear_favorites(user_address):
    """清空用户收藏"""
    if user_address not in user_favorites:
        user_favorites[user_address] = set()
    
    cleared_count = len(user_favorites[user_address])
    
    # 减少对应NFT的点赞数
    for nft_id in user_favorites[user_address]:
        if nft_id in nft_like_counts:
            nft_like_counts[nft_id] = max(0, nft_like_counts[nft_id] - 1)
    
    user_favorites[user_address] = set()
    
    return jsonify({
        'success': True,
        'data': {
            'message': f'Cleared {cleared_count} favorites successfully',
            'cleared_count': cleared_count
        }
    })

@favorites_bp.route('/nfts/trending-likes', methods=['GET'])
def get_trending_likes():
    """获取点赞趋势NFT"""
    limit = int(request.args.get('limit', 10))
    
    # 生成热门点赞NFT
    trending_nfts = []
    for i in range(limit):
        nft_id = random.randint(1, 1000)
        if nft_id not in nft_like_counts:
            nft_like_counts[nft_id] = random.randint(100, 2000)
        
        from src.routes.nft import generate_mock_nft
        nft = generate_mock_nft(nft_id)
        nft['likes'] = nft_like_counts[nft_id]
        nft['like_growth_24h'] = random.randint(10, 200)
        nft['like_growth_percentage'] = round(random.uniform(5, 50), 2)
        
        trending_nfts.append(nft)
    
    # 按点赞数排序
    trending_nfts.sort(key=lambda x: x['likes'], reverse=True)
    
    return jsonify({
        'success': True,
        'data': {
            'trending_nfts': trending_nfts,
            'note': 'NFTs with highest like growth in 24h'
        }
    })

@favorites_bp.route('/users/<user_address>/favorites/export', methods=['GET'])
def export_favorites(user_address):
    """导出用户收藏列表"""
    if user_address not in user_favorites:
        user_favorites[user_address] = set()
    
    favorite_nft_ids = list(user_favorites[user_address])
    
    # 生成导出数据
    from src.routes.nft import generate_mock_nft
    export_data = []
    
    for nft_id in favorite_nft_ids:
        nft = generate_mock_nft(nft_id)
        export_item = {
            'nft_id': nft_id,
            'name': nft['name'],
            'creator': nft['creator']['name'],
            'price': nft['price'],
            'currency': nft['currency'],
            'category': nft['category'],
            'rarity': nft['rarity'],
            'likes': nft_like_counts.get(nft_id, 0),
            'export_date': datetime.now().isoformat()
        }
        export_data.append(export_item)
    
    return jsonify({
        'success': True,
        'data': {
            'favorites_export': export_data,
            'export_info': {
                'user_address': user_address,
                'total_favorites': len(export_data),
                'export_date': datetime.now().isoformat(),
                'format': 'json'
            }
        }
    })

