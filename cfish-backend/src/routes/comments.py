from flask import Blueprint, jsonify, request
from datetime import datetime, timedelta
import random

comments_bp = Blueprint('comments', __name__)

# 模拟评论数据存储（实际应用中应使用数据库）
nft_comments = {}
comment_likes = {}
user_comment_history = {}

def generate_mock_comment(comment_id, nft_id, user_address):
    """生成模拟评论数据"""
    sample_comments = [
        "This NFT is absolutely amazing! The artwork is stunning.",
        "Love the creativity and attention to detail in this piece.",
        "Great collection! Looking forward to more from this artist.",
        "The colors and composition are perfect. Well done!",
        "This is going to be worth a lot in the future. HODL!",
        "Beautiful work! The artist has real talent.",
        "Interesting concept and execution. Very unique.",
        "The rarity makes this even more special. Great find!",
        "Amazing detail work. You can see the passion in every pixel.",
        "This collection keeps getting better and better!"
    ]
    
    usernames = ["CryptoCollector", "NFTEnthusiast", "ArtLover", "BlockchainBuyer", "DigitalArtist"]
    
    return {
        'id': comment_id,
        'nft_id': nft_id,
        'user_address': user_address,
        'username': random.choice(usernames),
        'avatar': f"/avatars/user{random.randint(1, 10)}.png",
        'content': random.choice(sample_comments),
        'created_at': (datetime.now() - timedelta(hours=random.randint(1, 72))).isoformat(),
        'updated_at': None,
        'likes': random.randint(0, 50),
        'replies_count': random.randint(0, 5),
        'is_edited': False,
        'is_pinned': False,
        'parent_id': None  # For replies
    }

@comments_bp.route('/nfts/<int:nft_id>/comments', methods=['GET'])
def get_nft_comments(nft_id):
    """获取NFT评论列表"""
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 20))
    sort_by = request.args.get('sort_by', 'newest')  # newest, oldest, most_liked
    
    if nft_id not in nft_comments:
        # 生成一些模拟评论
        nft_comments[nft_id] = []
        for i in range(random.randint(5, 25)):
            comment = generate_mock_comment(
                f"comment_{nft_id}_{i}",
                nft_id,
                f"user_{random.randint(1, 100)}"
            )
            nft_comments[nft_id].append(comment)
    
    comments = nft_comments[nft_id].copy()
    
    # 排序
    if sort_by == 'oldest':
        comments.sort(key=lambda x: x['created_at'])
    elif sort_by == 'most_liked':
        comments.sort(key=lambda x: x['likes'], reverse=True)
    else:  # newest
        comments.sort(key=lambda x: x['created_at'], reverse=True)
    
    # 分页
    start_idx = (page - 1) * limit
    end_idx = start_idx + limit
    paginated_comments = comments[start_idx:end_idx]
    
    return jsonify({
        'success': True,
        'data': {
            'comments': paginated_comments,
            'pagination': {
                'page': page,
                'limit': limit,
                'total': len(comments),
                'pages': (len(comments) + limit - 1) // limit if comments else 1
            },
            'summary': {
                'total_comments': len(comments),
                'average_likes': round(sum(c['likes'] for c in comments) / len(comments), 2) if comments else 0
            }
        }
    })

@comments_bp.route('/nfts/<int:nft_id>/comments', methods=['POST'])
def add_comment(nft_id):
    """添加评论"""
    data = request.get_json()
    user_address = data.get('user_address')
    content = data.get('content', '').strip()
    parent_id = data.get('parent_id')  # For replies
    
    if not user_address or not content:
        return jsonify({
            'success': False,
            'error': 'User address and content are required'
        }), 400
    
    if len(content) > 1000:
        return jsonify({
            'success': False,
            'error': 'Comment too long (max 1000 characters)'
        }), 400
    
    if nft_id not in nft_comments:
        nft_comments[nft_id] = []
    
    # 生成评论ID
    comment_id = f"comment_{nft_id}_{len(nft_comments[nft_id]) + 1}"
    
    new_comment = {
        'id': comment_id,
        'nft_id': nft_id,
        'user_address': user_address,
        'username': f"User_{user_address[-6:]}",
        'avatar': f"/avatars/user{random.randint(1, 10)}.png",
        'content': content,
        'created_at': datetime.now().isoformat(),
        'updated_at': None,
        'likes': 0,
        'replies_count': 0,
        'is_edited': False,
        'is_pinned': False,
        'parent_id': parent_id
    }
    
    nft_comments[nft_id].append(new_comment)
    
    # 更新用户评论历史
    if user_address not in user_comment_history:
        user_comment_history[user_address] = []
    user_comment_history[user_address].append(comment_id)
    
    # 如果是回复，更新父评论的回复数
    if parent_id:
        parent_comment = next((c for c in nft_comments[nft_id] if c['id'] == parent_id), None)
        if parent_comment:
            parent_comment['replies_count'] += 1
    
    return jsonify({
        'success': True,
        'data': {
            'comment': new_comment,
            'message': 'Comment added successfully'
        }
    })

@comments_bp.route('/comments/<comment_id>', methods=['PUT'])
def update_comment(comment_id):
    """更新评论"""
    data = request.get_json()
    user_address = data.get('user_address')
    content = data.get('content', '').strip()
    
    if not user_address or not content:
        return jsonify({
            'success': False,
            'error': 'User address and content are required'
        }), 400
    
    # 查找评论
    comment = None
    nft_id = None
    for nid, comments in nft_comments.items():
        for c in comments:
            if c['id'] == comment_id:
                comment = c
                nft_id = nid
                break
        if comment:
            break
    
    if not comment:
        return jsonify({
            'success': False,
            'error': 'Comment not found'
        }), 404
    
    if comment['user_address'] != user_address:
        return jsonify({
            'success': False,
            'error': 'Unauthorized to edit this comment'
        }), 403
    
    # 更新评论
    comment['content'] = content
    comment['updated_at'] = datetime.now().isoformat()
    comment['is_edited'] = True
    
    return jsonify({
        'success': True,
        'data': {
            'comment': comment,
            'message': 'Comment updated successfully'
        }
    })

@comments_bp.route('/comments/<comment_id>', methods=['DELETE'])
def delete_comment(comment_id):
    """删除评论"""
    data = request.get_json()
    user_address = data.get('user_address')
    
    if not user_address:
        return jsonify({
            'success': False,
            'error': 'User address is required'
        }), 400
    
    # 查找并删除评论
    comment = None
    nft_id = None
    for nid, comments in nft_comments.items():
        for i, c in enumerate(comments):
            if c['id'] == comment_id:
                if c['user_address'] != user_address:
                    return jsonify({
                        'success': False,
                        'error': 'Unauthorized to delete this comment'
                    }), 403
                
                comment = comments.pop(i)
                nft_id = nid
                break
        if comment:
            break
    
    if not comment:
        return jsonify({
            'success': False,
            'error': 'Comment not found'
        }), 404
    
    return jsonify({
        'success': True,
        'data': {
            'message': 'Comment deleted successfully',
            'deleted_comment_id': comment_id
        }
    })

@comments_bp.route('/comments/<comment_id>/like', methods=['POST'])
def like_comment(comment_id):
    """点赞/取消点赞评论"""
    data = request.get_json()
    user_address = data.get('user_address')
    
    if not user_address:
        return jsonify({
            'success': False,
            'error': 'User address is required'
        }), 400
    
    if comment_id not in comment_likes:
        comment_likes[comment_id] = set()
    
    is_liked = user_address in comment_likes[comment_id]
    
    # 查找评论
    comment = None
    for comments in nft_comments.values():
        for c in comments:
            if c['id'] == comment_id:
                comment = c
                break
        if comment:
            break
    
    if not comment:
        return jsonify({
            'success': False,
            'error': 'Comment not found'
        }), 404
    
    if is_liked:
        # 取消点赞
        comment_likes[comment_id].remove(user_address)
        comment['likes'] = max(0, comment['likes'] - 1)
        action = 'unliked'
    else:
        # 点赞
        comment_likes[comment_id].add(user_address)
        comment['likes'] += 1
        action = 'liked'
    
    return jsonify({
        'success': True,
        'data': {
            'comment_id': comment_id,
            'action': action,
            'is_liked': not is_liked,
            'total_likes': comment['likes'],
            'message': f'Comment {action} successfully'
        }
    })

@comments_bp.route('/users/<user_address>/comments', methods=['GET'])
def get_user_comments(user_address):
    """获取用户评论历史"""
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 20))
    
    user_comments = []
    
    # 收集用户的所有评论
    for nft_id, comments in nft_comments.items():
        for comment in comments:
            if comment['user_address'] == user_address:
                comment_with_nft = comment.copy()
                comment_with_nft['nft_id'] = nft_id
                user_comments.append(comment_with_nft)
    
    # 按时间排序
    user_comments.sort(key=lambda x: x['created_at'], reverse=True)
    
    # 分页
    start_idx = (page - 1) * limit
    end_idx = start_idx + limit
    paginated_comments = user_comments[start_idx:end_idx]
    
    return jsonify({
        'success': True,
        'data': {
            'comments': paginated_comments,
            'pagination': {
                'page': page,
                'limit': limit,
                'total': len(user_comments),
                'pages': (len(user_comments) + limit - 1) // limit if user_comments else 1
            },
            'summary': {
                'total_comments': len(user_comments),
                'total_likes_received': sum(c['likes'] for c in user_comments)
            }
        }
    })

@comments_bp.route('/comments/trending', methods=['GET'])
def get_trending_comments():
    """获取热门评论"""
    limit = int(request.args.get('limit', 10))
    
    all_comments = []
    
    # 收集所有评论
    for nft_id, comments in nft_comments.items():
        for comment in comments:
            comment_with_nft = comment.copy()
            comment_with_nft['nft_id'] = nft_id
            all_comments.append(comment_with_nft)
    
    # 按点赞数排序
    all_comments.sort(key=lambda x: x['likes'], reverse=True)
    
    trending_comments = all_comments[:limit]
    
    return jsonify({
        'success': True,
        'data': {
            'trending_comments': trending_comments,
            'note': 'Comments with most likes across all NFTs'
        }
    })

@comments_bp.route('/nfts/<int:nft_id>/comments/stats', methods=['GET'])
def get_comment_stats(nft_id):
    """获取NFT评论统计"""
    if nft_id not in nft_comments:
        nft_comments[nft_id] = []
    
    comments = nft_comments[nft_id]
    
    if not comments:
        return jsonify({
            'success': True,
            'data': {
                'total_comments': 0,
                'total_likes': 0,
                'average_likes_per_comment': 0,
                'most_active_commenters': [],
                'recent_activity': []
            }
        })
    
    # 统计数据
    total_likes = sum(c['likes'] for c in comments)
    commenter_counts = {}
    
    for comment in comments:
        user = comment['user_address']
        commenter_counts[user] = commenter_counts.get(user, 0) + 1
    
    most_active = sorted(commenter_counts.items(), key=lambda x: x[1], reverse=True)[:5]
    
    recent_comments = sorted(comments, key=lambda x: x['created_at'], reverse=True)[:5]
    
    return jsonify({
        'success': True,
        'data': {
            'total_comments': len(comments),
            'total_likes': total_likes,
            'average_likes_per_comment': round(total_likes / len(comments), 2),
            'most_active_commenters': [{'user_address': user, 'comment_count': count} for user, count in most_active],
            'recent_activity': recent_comments
        }
    })

