from flask import Blueprint, jsonify, request
from datetime import datetime
import random
import re

search_bp = Blueprint('search', __name__)

# 搜索历史存储
user_search_history = {}
popular_searches = {}

def search_nfts(query, filters=None):
    """搜索NFT"""
    from src.routes.nft import generate_mock_nft
    
    # 生成搜索结果
    results = []
    total_nfts = 1000  # 假设总共有1000个NFT
    
    # 模拟搜索匹配
    for i in range(1, min(101, total_nfts + 1)):  # 搜索前100个
        nft = generate_mock_nft(i)
        
        # 简单的文本匹配逻辑
        match_score = 0
        query_lower = query.lower()
        
        if query_lower in nft['name'].lower():
            match_score += 10
        if query_lower in nft['description'].lower():
            match_score += 5
        if query_lower in nft['category'].lower():
            match_score += 8
        if any(query_lower in tag.lower() for tag in nft['tags']):
            match_score += 6
        if query_lower in nft['creator']['name'].lower():
            match_score += 7
        
        # 应用筛选条件
        if filters:
            if filters.get('category') and nft['category'] != filters['category']:
                continue
            if filters.get('currency') and nft['currency'] != filters['currency']:
                continue
            if filters.get('min_price') and nft['price'] < float(filters['min_price']):
                continue
            if filters.get('max_price') and nft['price'] > float(filters['max_price']):
                continue
            if filters.get('rarity') and nft['rarity'] != filters['rarity']:
                continue
            if filters.get('is_for_sale') is not None and nft['is_for_sale'] != filters['is_for_sale']:
                continue
        
        if match_score > 0:
            nft['match_score'] = match_score
            results.append(nft)
    
    # 按匹配分数和CFISH优先排序
    results.sort(key=lambda x: (x['currency'] != 'CFISH', -x['match_score'], -x['likes']))
    
    return results

def search_collections(query, filters=None):
    """搜索合集"""
    from src.routes.collection import generate_mock_collection
    
    results = []
    
    for i in range(1, 51):  # 搜索50个合集
        collection = generate_mock_collection(i)
        
        match_score = 0
        query_lower = query.lower()
        
        if query_lower in collection['name'].lower():
            match_score += 10
        if query_lower in collection['description'].lower():
            match_score += 5
        if query_lower in collection['creator']['name'].lower():
            match_score += 7
        
        if match_score > 0:
            collection['match_score'] = match_score
            results.append(collection)
    
    results.sort(key=lambda x: -x['match_score'])
    return results

def search_users(query):
    """搜索用户"""
    users = []
    usernames = ["CryptoArtist", "DigitalMaster", "NFTCreator", "BlockchainArt", "ArtCollector"]
    
    for i, username in enumerate(usernames):
        if query.lower() in username.lower():
            user = {
                'id': i + 1,
                'username': username,
                'address': f"0x{''.join([random.choice('0123456789abcdef') for _ in range(40)])}",
                'avatar': f"/avatars/artist{i+1}.png",
                'verified': random.choice([True, False]),
                'nft_count': random.randint(5, 100),
                'followers': random.randint(100, 10000),
                'following': random.randint(50, 1000),
                'total_volume': round(random.uniform(10, 1000), 2),
                'match_score': 10 if query.lower() == username.lower() else 5
            }
            users.append(user)
    
    users.sort(key=lambda x: -x['match_score'])
    return users

@search_bp.route('/search', methods=['GET'])
def universal_search():
    """通用搜索接口"""
    query = request.args.get('q', '').strip()
    search_type = request.args.get('type', 'all')  # all, nfts, collections, users
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 20))
    user_address = request.args.get('user_address')
    
    if not query:
        return jsonify({
            'success': False,
            'error': 'Search query is required'
        }), 400
    
    if len(query) < 2:
        return jsonify({
            'success': False,
            'error': 'Search query must be at least 2 characters'
        }), 400
    
    # 记录搜索历史
    if user_address:
        if user_address not in user_search_history:
            user_search_history[user_address] = []
        
        # 避免重复记录相同查询
        if query not in user_search_history[user_address]:
            user_search_history[user_address].insert(0, query)
            # 只保留最近20次搜索
            user_search_history[user_address] = user_search_history[user_address][:20]
    
    # 更新热门搜索
    popular_searches[query] = popular_searches.get(query, 0) + 1
    
    # 获取筛选条件
    filters = {
        'category': request.args.get('category'),
        'currency': request.args.get('currency'),
        'min_price': request.args.get('min_price'),
        'max_price': request.args.get('max_price'),
        'rarity': request.args.get('rarity'),
        'is_for_sale': request.args.get('is_for_sale')
    }
    filters = {k: v for k, v in filters.items() if v is not None}
    
    results = {}
    
    if search_type in ['all', 'nfts']:
        nft_results = search_nfts(query, filters)
        if search_type == 'nfts':
            # 分页
            start_idx = (page - 1) * limit
            end_idx = start_idx + limit
            results['nfts'] = {
                'items': nft_results[start_idx:end_idx],
                'total': len(nft_results),
                'pagination': {
                    'page': page,
                    'limit': limit,
                    'pages': (len(nft_results) + limit - 1) // limit if nft_results else 1
                }
            }
        else:
            results['nfts'] = {
                'items': nft_results[:5],  # 只显示前5个
                'total': len(nft_results)
            }
    
    if search_type in ['all', 'collections']:
        collection_results = search_collections(query, filters)
        if search_type == 'collections':
            start_idx = (page - 1) * limit
            end_idx = start_idx + limit
            results['collections'] = {
                'items': collection_results[start_idx:end_idx],
                'total': len(collection_results),
                'pagination': {
                    'page': page,
                    'limit': limit,
                    'pages': (len(collection_results) + limit - 1) // limit if collection_results else 1
                }
            }
        else:
            results['collections'] = {
                'items': collection_results[:3],
                'total': len(collection_results)
            }
    
    if search_type in ['all', 'users']:
        user_results = search_users(query)
        if search_type == 'users':
            start_idx = (page - 1) * limit
            end_idx = start_idx + limit
            results['users'] = {
                'items': user_results[start_idx:end_idx],
                'total': len(user_results),
                'pagination': {
                    'page': page,
                    'limit': limit,
                    'pages': (len(user_results) + limit - 1) // limit if user_results else 1
                }
            }
        else:
            results['users'] = {
                'items': user_results[:3],
                'total': len(user_results)
            }
    
    return jsonify({
        'success': True,
        'data': {
            'query': query,
            'search_type': search_type,
            'results': results,
            'search_time': datetime.now().isoformat(),
            'applied_filters': filters
        }
    })

@search_bp.route('/search/suggestions', methods=['GET'])
def get_search_suggestions():
    """获取搜索建议"""
    query = request.args.get('q', '').strip()
    limit = int(request.args.get('limit', 10))
    
    if len(query) < 2:
        return jsonify({
            'success': True,
            'data': {
                'suggestions': []
            }
        })
    
    # 生成搜索建议
    suggestions = []
    
    # 基于热门搜索的建议
    popular_terms = ["crypto art", "digital collectibles", "pixel art", "3d models", "music nfts", 
                    "gaming items", "profile pictures", "abstract art", "photography", "animation"]
    
    for term in popular_terms:
        if query.lower() in term.lower():
            suggestions.append({
                'text': term,
                'type': 'popular',
                'search_count': random.randint(100, 5000)
            })
    
    # 基于NFT名称的建议
    nft_names = ["Amazing NFT", "Crypto Punk", "Bored Ape", "Cool Cat", "Doodle", 
                "Azuki", "Clone X", "Moonbird", "Otherside", "Art Block"]
    
    for name in nft_names:
        if query.lower() in name.lower():
            suggestions.append({
                'text': name,
                'type': 'nft',
                'match_type': 'name'
            })
    
    # 基于创作者的建议
    creators = ["CryptoArtist", "DigitalMaster", "NFTCreator", "BlockchainArt"]
    for creator in creators:
        if query.lower() in creator.lower():
            suggestions.append({
                'text': creator,
                'type': 'creator',
                'verified': True
            })
    
    # 限制数量并排序
    suggestions = suggestions[:limit]
    
    return jsonify({
        'success': True,
        'data': {
            'query': query,
            'suggestions': suggestions
        }
    })

@search_bp.route('/search/history/<user_address>', methods=['GET'])
def get_search_history(user_address):
    """获取用户搜索历史"""
    limit = int(request.args.get('limit', 20))
    
    if user_address not in user_search_history:
        user_search_history[user_address] = []
    
    history = user_search_history[user_address][:limit]
    
    return jsonify({
        'success': True,
        'data': {
            'history': history,
            'total': len(user_search_history[user_address])
        }
    })

@search_bp.route('/search/history/<user_address>', methods=['DELETE'])
def clear_search_history(user_address):
    """清空搜索历史"""
    if user_address in user_search_history:
        cleared_count = len(user_search_history[user_address])
        user_search_history[user_address] = []
    else:
        cleared_count = 0
    
    return jsonify({
        'success': True,
        'data': {
            'message': f'Cleared {cleared_count} search history items',
            'cleared_count': cleared_count
        }
    })

@search_bp.route('/search/trending', methods=['GET'])
def get_trending_searches():
    """获取热门搜索"""
    limit = int(request.args.get('limit', 10))
    
    # 排序热门搜索
    trending = sorted(popular_searches.items(), key=lambda x: x[1], reverse=True)[:limit]
    
    trending_searches = [
        {
            'query': query,
            'search_count': count,
            'trend': 'up' if count > 50 else 'stable'
        }
        for query, count in trending
    ]
    
    return jsonify({
        'success': True,
        'data': {
            'trending_searches': trending_searches,
            'updated_at': datetime.now().isoformat()
        }
    })

@search_bp.route('/search/filters', methods=['GET'])
def get_search_filters():
    """获取搜索筛选选项"""
    return jsonify({
        'success': True,
        'data': {
            'categories': [
                'Art', 'Collectibles', 'Gaming', 'Music', 
                'Photography', 'Sports', 'Utility', 'Virtual Worlds'
            ],
            'currencies': [
                {'code': 'SOL', 'name': 'Solana', 'has_fees': True},
                {'code': 'CFISH', 'name': 'CFish Token', 'has_fees': False}
            ],
            'rarities': ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'],
            'price_ranges': [
                {'label': 'Under 1', 'min': 0, 'max': 1},
                {'label': '1 - 10', 'min': 1, 'max': 10},
                {'label': '10 - 50', 'min': 10, 'max': 50},
                {'label': '50 - 100', 'min': 50, 'max': 100},
                {'label': 'Over 100', 'min': 100, 'max': null}
            ],
            'sort_options': [
                {'value': 'relevance', 'label': 'Most Relevant'},
                {'value': 'price_low_high', 'label': 'Price: Low to High'},
                {'value': 'price_high_low', 'label': 'Price: High to Low'},
                {'value': 'newest', 'label': 'Recently Created'},
                {'value': 'most_liked', 'label': 'Most Liked'},
                {'value': 'cfish_first', 'label': 'CFISH First'}
            ]
        }
    })

@search_bp.route('/search/advanced', methods=['POST'])
def advanced_search():
    """高级搜索"""
    data = request.get_json()
    
    query = data.get('query', '').strip()
    filters = data.get('filters', {})
    sort_by = data.get('sort_by', 'relevance')
    page = int(data.get('page', 1))
    limit = int(data.get('limit', 20))
    
    if not query and not filters:
        return jsonify({
            'success': False,
            'error': 'Query or filters are required'
        }), 400
    
    # 执行高级搜索
    nft_results = search_nfts(query or '', filters)
    
    # 高级排序
    if sort_by == 'price_low_high':
        nft_results.sort(key=lambda x: x['price'])
    elif sort_by == 'price_high_low':
        nft_results.sort(key=lambda x: x['price'], reverse=True)
    elif sort_by == 'newest':
        nft_results.sort(key=lambda x: x['created_at'], reverse=True)
    elif sort_by == 'most_liked':
        nft_results.sort(key=lambda x: x['likes'], reverse=True)
    elif sort_by == 'cfish_first':
        nft_results.sort(key=lambda x: (x['currency'] != 'CFISH', -x['likes']))
    
    # 分页
    start_idx = (page - 1) * limit
    end_idx = start_idx + limit
    paginated_results = nft_results[start_idx:end_idx]
    
    return jsonify({
        'success': True,
        'data': {
            'query': query,
            'filters': filters,
            'sort_by': sort_by,
            'results': paginated_results,
            'pagination': {
                'page': page,
                'limit': limit,
                'total': len(nft_results),
                'pages': (len(nft_results) + limit - 1) // limit if nft_results else 1
            },
            'summary': {
                'total_results': len(nft_results),
                'cfish_count': len([r for r in nft_results if r['currency'] == 'CFISH']),
                'sol_count': len([r for r in nft_results if r['currency'] == 'SOL']),
                'for_sale_count': len([r for r in nft_results if r['is_for_sale']])
            }
        }
    })

