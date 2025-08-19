from flask import Blueprint, jsonify, request
from datetime import datetime, timedelta
import random

nft_bp = Blueprint('nft', __name__)

# 模拟NFT数据
def generate_mock_nft(nft_id=None):
    if nft_id is None:
        nft_id = random.randint(1, 10000)
    
    categories = ['Art', 'Gaming', 'Music', 'Photography', 'Sports', 'Collectibles']
    creators = [
        {'name': 'CryptoArtist', 'avatar': '/avatars/artist1.png', 'verified': True},
        {'name': 'DigitalMaster', 'avatar': '/avatars/artist2.png', 'verified': True},
        {'name': 'NFTCreator', 'avatar': '/avatars/artist3.png', 'verified': False},
        {'name': 'BlockchainArt', 'avatar': '/avatars/artist4.png', 'verified': True},
    ]
    
    return {
        'id': nft_id,
        'name': f'Amazing NFT #{nft_id}',
        'description': f'This is a unique digital artwork created by talented artists. NFT #{nft_id} represents creativity and innovation in the blockchain space.',
        'image': f'/nft-images/nft_{nft_id}.jpg',
        'price': round(random.uniform(0.1, 50.0), 2),
        'currency': random.choice(['SOL', 'CFISH']),
        'category': random.choice(categories),
        'creator': random.choice(creators),
        'owner': random.choice(creators),
        'commission': round(random.uniform(2.5, 15.0), 1),
        'rarity': random.choice(['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary']),
        'likes': random.randint(0, 1000),
        'views': random.randint(100, 10000),
        'created_at': (datetime.now() - timedelta(days=random.randint(1, 365))).isoformat(),
        'attributes': [
            {'trait_type': 'Background', 'value': random.choice(['Blue', 'Red', 'Green', 'Purple'])},
            {'trait_type': 'Style', 'value': random.choice(['Abstract', 'Realistic', 'Digital', 'Hand-drawn'])},
            {'trait_type': 'Rarity Score', 'value': random.randint(1, 100)}
        ],
        'tags': random.sample(['art', 'digital', 'unique', 'collectible', 'rare', 'trending'], k=random.randint(2, 4)),
        'is_for_sale': random.choice([True, False]),
        'auction_end_time': (datetime.now() + timedelta(days=random.randint(1, 7))).isoformat() if random.choice([True, False]) else None,
        'transaction_history': [
            {
                'type': 'mint',
                'price': 0,
                'from': None,
                'to': random.choice(creators)['name'],
                'timestamp': (datetime.now() - timedelta(days=random.randint(30, 365))).isoformat()
            },
            {
                'type': 'sale',
                'price': round(random.uniform(0.1, 10.0), 2),
                'from': random.choice(creators)['name'],
                'to': random.choice(creators)['name'],
                'timestamp': (datetime.now() - timedelta(days=random.randint(1, 30))).isoformat()
            }
        ]
    }

@nft_bp.route('/nfts', methods=['GET'])
def get_nfts():
    """获取NFT列表"""
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 20))
    category = request.args.get('category')
    sort_by = request.args.get('sort_by', 'created_at')
    order = request.args.get('order', 'desc')
    search = request.args.get('search')
    min_price = request.args.get('min_price', type=float)
    max_price = request.args.get('max_price', type=float)
    currency = request.args.get('currency')  # 新增货币筛选参数
    
    # 生成模拟数据
    total_nfts = 1000
    nfts = []
    
    for i in range((page - 1) * limit, min(page * limit, total_nfts)):
        nft = generate_mock_nft(i + 1)
        
        # 应用筛选条件
        if category and nft['category'].lower() != category.lower():
            continue
        if search and search.lower() not in nft['name'].lower():
            continue
        if min_price and nft['price'] < min_price:
            continue
        if max_price and nft['price'] > max_price:
            continue
        if currency and nft['currency'].lower() != currency.lower():
            continue
            
        nfts.append(nft)
    
    # 排序 - CFISH付款的NFT优先展示
    if sort_by == 'price':
        # 先按货币类型排序（CFISH优先），再按价格排序
        nfts.sort(key=lambda x: (x['currency'] != 'CFISH', x['price']), reverse=(order == 'desc'))
    elif sort_by == 'commission':
        nfts.sort(key=lambda x: (x['currency'] != 'CFISH', x['commission']), reverse=(order == 'desc'))
    elif sort_by == 'likes':
        nfts.sort(key=lambda x: (x['currency'] != 'CFISH', x['likes']), reverse=(order == 'desc'))
    elif sort_by == 'created_at':
        nfts.sort(key=lambda x: (x['currency'] != 'CFISH', x['created_at']), reverse=(order == 'desc'))
    else:
        # 默认排序：CFISH付款优先，然后按创建时间
        nfts.sort(key=lambda x: (x['currency'] != 'CFISH', x['created_at']), reverse=True)
    
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

@nft_bp.route('/nfts/<int:nft_id>', methods=['GET'])
def get_nft_detail(nft_id):
    """获取NFT详情"""
    nft = generate_mock_nft(nft_id)
    
    # 添加更多详细信息
    nft.update({
        'collection': {
            'name': f'Collection {nft_id // 100 + 1}',
            'description': 'A curated collection of unique digital artworks',
            'floor_price': round(random.uniform(0.1, 5.0), 2),
            'volume': round(random.uniform(100, 10000), 2),
            'items': random.randint(100, 10000)
        },
        'bids': [
            {
                'bidder': random.choice(['User1', 'User2', 'User3']),
                'amount': round(random.uniform(0.1, nft['price'] * 0.9), 2),
                'timestamp': (datetime.now() - timedelta(hours=random.randint(1, 24))).isoformat()
            } for _ in range(random.randint(0, 5))
        ],
        'offers': [
            {
                'offerer': random.choice(['Buyer1', 'Buyer2', 'Buyer3']),
                'amount': round(random.uniform(0.1, nft['price'] * 0.8), 2),
                'expires_at': (datetime.now() + timedelta(days=random.randint(1, 7))).isoformat()
            } for _ in range(random.randint(0, 3))
        ]
    })
    
    return jsonify({
        'success': True,
        'data': nft
    })

@nft_bp.route('/nfts/trending', methods=['GET'])
def get_trending_nfts():
    """获取热门NFT - CFISH付款优先展示"""
    limit = int(request.args.get('limit', 10))
    
    nfts = []
    for i in range(limit * 2):  # 生成更多数据以便筛选
        nft = generate_mock_nft(i + 1)
        nft['trending_score'] = random.uniform(70, 100)  # 热门度评分
        nfts.append(nft)
    
    # 按热门度和CFISH优先排序
    nfts.sort(key=lambda x: (x['currency'] != 'CFISH', -x['trending_score']))
    
    return jsonify({
        'success': True,
        'data': {
            'nfts': nfts[:limit],
            'note': 'CFISH付款的NFT优先展示'
        }
    })

@nft_bp.route('/nfts/featured', methods=['GET'])
def get_featured_nfts():
    """获取精选NFT - CFISH付款优先展示"""
    limit = int(request.args.get('limit', 8))
    
    nfts = []
    for i in range(limit * 2):  # 生成更多数据以便筛选
        nft = generate_mock_nft(i + 1)
        nft['featured_score'] = random.uniform(80, 100)  # 精选评分
        nfts.append(nft)
    
    # 按精选评分和CFISH优先排序
    nfts.sort(key=lambda x: (x['currency'] != 'CFISH', -x['featured_score']))
    
    return jsonify({
        'success': True,
        'data': {
            'nfts': nfts[:limit],
            'note': 'CFISH付款的NFT优先展示'
        }
    })

@nft_bp.route('/nfts/<int:nft_id>/like', methods=['POST'])
def like_nft(nft_id):
    """点赞NFT"""
    return jsonify({
        'success': True,
        'message': 'NFT liked successfully',
        'data': {
            'nft_id': nft_id,
            'likes': random.randint(1, 1000)
        }
    })

@nft_bp.route('/nfts/<int:nft_id>/buy', methods=['POST'])
def buy_nft(nft_id):
    """购买NFT"""
    data = request.get_json()
    
    return jsonify({
        'success': True,
        'message': 'Purchase initiated successfully',
        'data': {
            'transaction_id': f'tx_{random.randint(100000, 999999)}',
            'nft_id': nft_id,
            'price': data.get('price'),
            'currency': data.get('currency', 'SOL'),
            'status': 'pending'
        }
    })

@nft_bp.route('/nfts/<int:nft_id>/bid', methods=['POST'])
def bid_nft(nft_id):
    """对NFT出价"""
    data = request.get_json()
    
    return jsonify({
        'success': True,
        'message': 'Bid placed successfully',
        'data': {
            'bid_id': f'bid_{random.randint(100000, 999999)}',
            'nft_id': nft_id,
            'amount': data.get('amount'),
            'currency': data.get('currency', 'SOL'),
            'expires_at': (datetime.now() + timedelta(days=7)).isoformat()
        }
    })

