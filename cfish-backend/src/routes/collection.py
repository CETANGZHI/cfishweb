from flask import Blueprint, jsonify, request
from datetime import datetime, timedelta
import random

collection_bp = Blueprint('collection', __name__)

def generate_mock_collection(collection_id=None):
    if collection_id is None:
        collection_id = random.randint(1, 1000)
    
    creators = [
        {'name': 'CryptoArtist', 'avatar': '/avatars/artist1.png', 'verified': True},
        {'name': 'DigitalMaster', 'avatar': '/avatars/artist2.png', 'verified': True},
        {'name': 'NFTCreator', 'avatar': '/avatars/artist3.png', 'verified': False},
        {'name': 'BlockchainArt', 'avatar': '/avatars/artist4.png', 'verified': True},
    ]
    
    return {
        'id': collection_id,
        'name': f'Amazing Collection #{collection_id}',
        'description': f'A curated collection of unique digital artworks. Collection #{collection_id} showcases the best of digital creativity.',
        'banner_image': f'/collection-banners/collection_{collection_id}.jpg',
        'avatar_image': f'/collection-avatars/collection_{collection_id}.jpg',
        'creator': random.choice(creators),
        'floor_price': round(random.uniform(0.1, 10.0), 2),
        'volume_24h': round(random.uniform(10, 1000), 2),
        'volume_7d': round(random.uniform(50, 5000), 2),
        'volume_total': round(random.uniform(100, 50000), 2),
        'items': random.randint(100, 10000),
        'owners': random.randint(50, 5000),
        'listed': random.randint(10, 1000),
        'created_at': (datetime.now() - timedelta(days=random.randint(30, 365))).isoformat(),
        'category': random.choice(['Art', 'Gaming', 'Music', 'Photography', 'Sports', 'Collectibles']),
        'blockchain': 'Solana',
        'royalty': round(random.uniform(2.5, 10.0), 1),
        'verified': random.choice([True, False]),
        'social_links': {
            'website': f'https://collection{collection_id}.com',
            'twitter': f'@collection{collection_id}',
            'discord': f'https://discord.gg/collection{collection_id}'
        },
        'stats': {
            'avg_price': round(random.uniform(1.0, 20.0), 2),
            'market_cap': round(random.uniform(1000, 100000), 2),
            'price_change_24h': round(random.uniform(-50, 50), 2)
        }
    }

@collection_bp.route('/collections', methods=['GET'])
def get_collections():
    """获取合集列表"""
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 20))
    sort_by = request.args.get('sort_by', 'volume_24h')
    order = request.args.get('order', 'desc')
    category = request.args.get('category')
    search = request.args.get('search')
    
    # 生成模拟数据
    total_collections = 500
    collections = []
    
    for i in range((page - 1) * limit, min(page * limit, total_collections)):
        collection = generate_mock_collection(i + 1)
        
        # 应用筛选条件
        if category and collection['category'].lower() != category.lower():
            continue
        if search and search.lower() not in collection['name'].lower():
            continue
            
        collections.append(collection)
    
    # 排序
    if sort_by == 'volume_24h':
        collections.sort(key=lambda x: x['volume_24h'], reverse=(order == 'desc'))
    elif sort_by == 'floor_price':
        collections.sort(key=lambda x: x['floor_price'], reverse=(order == 'desc'))
    elif sort_by == 'items':
        collections.sort(key=lambda x: x['items'], reverse=(order == 'desc'))
    elif sort_by == 'name':
        collections.sort(key=lambda x: x['name'], reverse=(order == 'desc'))
    
    return jsonify({
        'success': True,
        'data': {
            'collections': collections[:limit],
            'pagination': {
                'page': page,
                'limit': limit,
                'total': total_collections,
                'pages': (total_collections + limit - 1) // limit
            }
        }
    })

@collection_bp.route('/collections/<int:collection_id>', methods=['GET'])
def get_collection_detail(collection_id):
    """获取合集详情"""
    collection = generate_mock_collection(collection_id)
    
    # 添加更多详细信息
    collection.update({
        'activity': [
            {
                'type': random.choice(['sale', 'listing', 'offer', 'transfer']),
                'nft_name': f'NFT #{random.randint(1, 1000)}',
                'price': round(random.uniform(0.1, 10.0), 2),
                'from': random.choice(['User1', 'User2', 'User3']),
                'to': random.choice(['Buyer1', 'Buyer2', 'Buyer3']),
                'timestamp': (datetime.now() - timedelta(hours=random.randint(1, 72))).isoformat()
            } for _ in range(10)
        ],
        'price_history': [
            {
                'date': (datetime.now() - timedelta(days=i)).strftime('%Y-%m-%d'),
                'floor_price': round(random.uniform(0.5, 5.0), 2),
                'volume': round(random.uniform(10, 500), 2)
            } for i in range(30, 0, -1)
        ]
    })
    
    return jsonify({
        'success': True,
        'data': collection
    })

@collection_bp.route('/collections/featured', methods=['GET'])
def get_featured_collections():
    """获取精选合集"""
    limit = int(request.args.get('limit', 6))
    
    featured_collections = []
    for i in range(limit):
        collection = generate_mock_collection(random.randint(1, 500))
        collection['featured'] = True
        collection['featured_reason'] = random.choice(['Top Volume', 'New & Notable', 'Community Pick'])
        featured_collections.append(collection)
    
    return jsonify({
        'success': True,
        'data': featured_collections
    })

@collection_bp.route('/collections/trending', methods=['GET'])
def get_trending_collections():
    """获取热门合集"""
    limit = int(request.args.get('limit', 10))
    
    trending_collections = []
    for i in range(limit):
        collection = generate_mock_collection(random.randint(1, 500))
        collection['trending_score'] = random.randint(80, 100)
        collection['volume_change'] = round(random.uniform(10, 200), 2)
        trending_collections.append(collection)
    
    # 按热门度排序
    trending_collections.sort(key=lambda x: x['trending_score'], reverse=True)
    
    return jsonify({
        'success': True,
        'data': trending_collections
    })

@collection_bp.route('/collections/<int:collection_id>/nfts', methods=['GET'])
def get_collection_nfts(collection_id):
    """获取合集中的NFT"""
    from src.routes.nft import generate_mock_nft
    
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 20))
    sort_by = request.args.get('sort_by', 'price')
    order = request.args.get('order', 'desc')
    
    # 生成合集中的NFT
    total_nfts = random.randint(100, 1000)
    nfts = []
    
    for i in range((page - 1) * limit, min(page * limit, total_nfts)):
        nft = generate_mock_nft(collection_id * 1000 + i + 1)
        nft['collection_id'] = collection_id
        nfts.append(nft)
    
    # 排序
    if sort_by == 'price':
        nfts.sort(key=lambda x: x['price'], reverse=(order == 'desc'))
    elif sort_by == 'rarity':
        rarity_order = {'Common': 1, 'Uncommon': 2, 'Rare': 3, 'Epic': 4, 'Legendary': 5}
        nfts.sort(key=lambda x: rarity_order.get(x['rarity'], 0), reverse=(order == 'desc'))
    
    return jsonify({
        'success': True,
        'data': {
            'nfts': nfts[:limit],
            'pagination': {
                'page': page,
                'limit': limit,
                'total': total_nfts,
                'pages': (total_nfts + limit - 1) // limit
            }
        }
    })

