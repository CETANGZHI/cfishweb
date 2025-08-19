from flask import Blueprint, jsonify, request
from datetime import datetime, timedelta
import random

profile_bp = Blueprint('profile', __name__)

def generate_mock_user(user_id=None, wallet_address=None):
    if user_id is None:
        user_id = random.randint(1, 10000)
    
    if wallet_address is None:
        wallet_address = f'wallet_{random.randint(1000, 9999)}'
    
    return {
        'id': user_id,
        'wallet_address': wallet_address,
        'username': f'User{user_id}',
        'display_name': f'Digital Artist {user_id}',
        'bio': f'Passionate digital artist and NFT creator. Creating unique artworks since {random.randint(2020, 2023)}.',
        'avatar': f'/avatars/user_{user_id}.jpg',
        'banner': f'/banners/user_{user_id}.jpg',
        'verified': random.choice([True, False]),
        'level': random.randint(1, 50),
        'reputation': round(random.uniform(1.0, 5.0), 1),
        'badges': random.sample(['Early Adopter', 'Top Creator', 'Community Leader', 'Verified Artist', 'High Volume Trader'], k=random.randint(1, 3)),
        'social_links': {
            'website': f'https://user{user_id}.com',
            'twitter': f'@user{user_id}',
            'discord': f'user{user_id}#1234',
            'instagram': f'@user{user_id}'
        },
        'stats': {
            'nfts_created': random.randint(0, 100),
            'nfts_owned': random.randint(1, 50),
            'nfts_sold': random.randint(0, 80),
            'total_volume': round(random.uniform(0, 10000), 2),
            'followers': random.randint(0, 10000),
            'following': random.randint(0, 1000)
        },
        'preferences': {
            'theme': random.choice(['dark', 'light']),
            'language': random.choice(['en', 'zh', 'ja', 'ko']),
            'currency': random.choice(['USD', 'SOL', 'CFISH']),
            'notifications': {
                'email': random.choice([True, False]),
                'push': random.choice([True, False]),
                'sms': random.choice([True, False])
            }
        },
        'joined_at': (datetime.now() - timedelta(days=random.randint(30, 1095))).isoformat(),
        'last_active': (datetime.now() - timedelta(hours=random.randint(1, 72))).isoformat()
    }

@profile_bp.route('/profile/<wallet_address>', methods=['GET'])
def get_user_profile(wallet_address):
    """获取用户资料"""
    user = generate_mock_user(wallet_address=wallet_address)
    
    return jsonify({
        'success': True,
        'data': user
    })

@profile_bp.route('/profile/<wallet_address>', methods=['PUT'])
def update_user_profile(wallet_address):
    """更新用户资料"""
    data = request.get_json()
    
    # 模拟更新用户资料
    updated_fields = []
    allowed_fields = ['username', 'display_name', 'bio', 'avatar', 'banner', 'social_links', 'preferences']
    
    for field in allowed_fields:
        if field in data:
            updated_fields.append(field)
    
    return jsonify({
        'success': True,
        'message': 'Profile updated successfully',
        'data': {
            'wallet_address': wallet_address,
            'updated_fields': updated_fields,
            'updated_at': datetime.now().isoformat()
        }
    })

@profile_bp.route('/profile/<wallet_address>/nfts', methods=['GET'])
def get_user_nfts(wallet_address):
    """获取用户的NFT"""
    from src.routes.nft import generate_mock_nft
    
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 20))
    category = request.args.get('category', 'all')  # 'created', 'owned', 'favorited', 'on_sale'
    
    # 根据类别生成不同的NFT数据
    if category == 'created':
        total_nfts = random.randint(0, 50)
    elif category == 'owned':
        total_nfts = random.randint(5, 100)
    elif category == 'favorited':
        total_nfts = random.randint(0, 200)
    elif category == 'on_sale':
        total_nfts = random.randint(0, 20)
    else:
        total_nfts = random.randint(10, 150)
    
    nfts = []
    for i in range((page - 1) * limit, min(page * limit, total_nfts)):
        nft = generate_mock_nft(random.randint(1, 10000))
        
        # 根据类别添加特定信息
        if category == 'created':
            nft['creator']['name'] = f'User_{wallet_address[-4:]}'
            nft['created_by_user'] = True
        elif category == 'owned':
            nft['owned_by_user'] = True
            nft['owned_since'] = (datetime.now() - timedelta(days=random.randint(1, 365))).isoformat()
        elif category == 'favorited':
            nft['favorited_by_user'] = True
            nft['favorited_at'] = (datetime.now() - timedelta(days=random.randint(1, 180))).isoformat()
        elif category == 'on_sale':
            nft['is_for_sale'] = True
            nft['listed_by_user'] = True
        
        nfts.append(nft)
    
    return jsonify({
        'success': True,
        'data': {
            'nfts': nfts[:limit],
            'category': category,
            'pagination': {
                'page': page,
                'limit': limit,
                'total': total_nfts,
                'pages': (total_nfts + limit - 1) // limit
            }
        }
    })

@profile_bp.route('/profile/<wallet_address>/activity', methods=['GET'])
def get_user_activity(wallet_address):
    """获取用户活动记录"""
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 20))
    activity_type = request.args.get('type', 'all')  # 'all', 'sales', 'purchases', 'listings', 'bids'
    
    activities = []
    activity_types = ['sale', 'purchase', 'listing', 'bid', 'offer', 'transfer', 'mint']
    
    if activity_type != 'all':
        if activity_type == 'sales':
            activity_types = ['sale']
        elif activity_type == 'purchases':
            activity_types = ['purchase']
        elif activity_type == 'listings':
            activity_types = ['listing']
        elif activity_type == 'bids':
            activity_types = ['bid', 'offer']
    
    total_activities = random.randint(20, 200)
    
    for i in range((page - 1) * limit, min(page * limit, total_activities)):
        activity = {
            'id': f'activity_{random.randint(100000, 999999)}',
            'type': random.choice(activity_types),
            'nft': {
                'id': random.randint(1, 10000),
                'name': f'NFT #{random.randint(1, 10000)}',
                'image': f'/nft-images/nft_{random.randint(1, 1000)}.jpg'
            },
            'price': round(random.uniform(0.1, 50.0), 2),
            'currency': random.choice(['SOL', 'CFISH']),
            'from': wallet_address if random.choice([True, False]) else f'wallet_{random.randint(1000, 9999)}',
            'to': f'wallet_{random.randint(1000, 9999)}' if random.choice([True, False]) else wallet_address,
            'transaction_hash': f'tx_{random.randint(10000000, 99999999)}',
            'timestamp': (datetime.now() - timedelta(hours=random.randint(1, 8760))).isoformat()
        }
        activities.append(activity)
    
    return jsonify({
        'success': True,
        'data': {
            'activities': activities[:limit],
            'pagination': {
                'page': page,
                'limit': limit,
                'total': total_activities,
                'pages': (total_activities + limit - 1) // limit
            }
        }
    })

@profile_bp.route('/profile/<wallet_address>/follow', methods=['POST'])
def follow_user(wallet_address):
    """关注用户"""
    data = request.get_json()
    follower_address = data.get('follower_address')
    
    if not follower_address:
        return jsonify({
            'success': False,
            'error': 'Follower address is required'
        }), 400
    
    return jsonify({
        'success': True,
        'message': 'User followed successfully',
        'data': {
            'followed': wallet_address,
            'follower': follower_address,
            'followed_at': datetime.now().isoformat()
        }
    })

@profile_bp.route('/profile/<wallet_address>/unfollow', methods=['POST'])
def unfollow_user(wallet_address):
    """取消关注用户"""
    data = request.get_json()
    follower_address = data.get('follower_address')
    
    if not follower_address:
        return jsonify({
            'success': False,
            'error': 'Follower address is required'
        }), 400
    
    return jsonify({
        'success': True,
        'message': 'User unfollowed successfully',
        'data': {
            'unfollowed': wallet_address,
            'follower': follower_address,
            'unfollowed_at': datetime.now().isoformat()
        }
    })

@profile_bp.route('/profile/<wallet_address>/followers', methods=['GET'])
def get_user_followers(wallet_address):
    """获取用户粉丝列表"""
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 20))
    
    total_followers = random.randint(0, 1000)
    followers = []
    
    for i in range((page - 1) * limit, min(page * limit, total_followers)):
        follower = generate_mock_user(random.randint(1, 10000))
        follower['followed_at'] = (datetime.now() - timedelta(days=random.randint(1, 365))).isoformat()
        followers.append(follower)
    
    return jsonify({
        'success': True,
        'data': {
            'followers': followers[:limit],
            'pagination': {
                'page': page,
                'limit': limit,
                'total': total_followers,
                'pages': (total_followers + limit - 1) // limit
            }
        }
    })

@profile_bp.route('/profile/<wallet_address>/following', methods=['GET'])
def get_user_following(wallet_address):
    """获取用户关注列表"""
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 20))
    
    total_following = random.randint(0, 500)
    following = []
    
    for i in range((page - 1) * limit, min(page * limit, total_following)):
        user = generate_mock_user(random.randint(1, 10000))
        user['followed_at'] = (datetime.now() - timedelta(days=random.randint(1, 365))).isoformat()
        following.append(user)
    
    return jsonify({
        'success': True,
        'data': {
            'following': following[:limit],
            'pagination': {
                'page': page,
                'limit': limit,
                'total': total_following,
                'pages': (total_following + limit - 1) // limit
            }
        }
    })

