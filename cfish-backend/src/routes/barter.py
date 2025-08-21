"""
易货交易 (Barter) API 路由
提供NFT以物易物的完整交易流程
"""

from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
import uuid
import random

barter_bp = Blueprint('barter', __name__)

# 模拟数据存储
barter_requests = {}  # 易货请求
barter_matches = {}   # 匹配结果
barter_history = {}   # 交易历史
user_preferences = {} # 用户偏好

@barter_bp.route('/requests', methods=['GET'])
def get_barter_requests():
    """获取易货请求列表"""
    try:
        user_address = request.args.get('user_address')
        status = request.args.get('status', 'all')  # all, active, completed, cancelled
        category = request.args.get('category')
        limit = int(request.args.get('limit', 20))
        offset = int(request.args.get('offset', 0))
        
        # 生成模拟数据
        if not barter_requests:
            for i in range(50):
                request_id = f"barter_req_{i+1}"
                barter_requests[request_id] = {
                    "id": request_id,
                    "user_address": f"user_{random.randint(1, 100)}",
                    "offered_nft": {
                        "id": f"nft_{random.randint(1, 1000)}",
                        "name": f"Offered NFT #{random.randint(1, 1000)}",
                        "image": f"https://picsum.photos/400/400?random={i+1}",
                        "collection": f"Collection {random.choice(['A', 'B', 'C', 'D'])}",
                        "rarity": random.choice(["Common", "Rare", "Epic", "Legendary"]),
                        "estimated_value": random.randint(50, 5000)
                    },
                    "desired_nfts": [
                        {
                            "collection": f"Desired Collection {random.choice(['X', 'Y', 'Z'])}",
                            "rarity": random.choice(["Rare", "Epic", "Legendary"]),
                            "min_value": random.randint(100, 3000),
                            "max_value": random.randint(3000, 8000),
                            "traits": [f"trait_{j}" for j in range(random.randint(1, 4))]
                        }
                    ],
                    "description": f"Looking for high-quality NFTs from premium collections. Open to negotiations.",
                    "status": random.choice(["active", "completed", "cancelled"]),
                    "created_at": (datetime.now() - timedelta(days=random.randint(1, 30))).isoformat(),
                    "expires_at": (datetime.now() + timedelta(days=random.randint(1, 30))).isoformat(),
                    "match_count": random.randint(0, 15),
                    "view_count": random.randint(10, 500),
                    "tags": [f"tag_{j}" for j in range(random.randint(1, 4))],
                    "auto_match": random.choice([True, False]),
                    "negotiable": random.choice([True, False])
                }
        
        # 筛选数据
        filtered_requests = list(barter_requests.values())
        
        if user_address:
            filtered_requests = [r for r in filtered_requests if r['user_address'] == user_address]
        
        if status != 'all':
            filtered_requests = [r for r in filtered_requests if r['status'] == status]
        
        if category:
            filtered_requests = [r for r in filtered_requests 
                               if any(nft['collection'].lower().find(category.lower()) != -1 
                                     for nft in [r['offered_nft']] + r['desired_nfts'])]
        
        # 分页
        total = len(filtered_requests)
        paginated_requests = filtered_requests[offset:offset + limit]
        
        return jsonify({
            "success": True,
            "data": {
                "requests": paginated_requests,
                "pagination": {
                    "total": total,
                    "limit": limit,
                    "offset": offset,
                    "has_more": offset + limit < total
                }
            }
        })
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@barter_bp.route('/requests', methods=['POST'])
def create_barter_request():
    """创建易货请求"""
    try:
        data = request.get_json()
        
        # 验证必需字段
        required_fields = ['user_address', 'offered_nft', 'desired_nfts']
        for field in required_fields:
            if field not in data:
                return jsonify({"success": False, "error": f"Missing required field: {field}"}), 400
        
        request_id = str(uuid.uuid4())
        
        barter_request = {
            "id": request_id,
            "user_address": data['user_address'],
            "offered_nft": data['offered_nft'],
            "desired_nfts": data['desired_nfts'],
            "description": data.get('description', ''),
            "status": "active",
            "created_at": datetime.now().isoformat(),
            "expires_at": data.get('expires_at', (datetime.now() + timedelta(days=30)).isoformat()),
            "match_count": 0,
            "view_count": 0,
            "tags": data.get('tags', []),
            "auto_match": data.get('auto_match', False),
            "negotiable": data.get('negotiable', True)
        }
        
        barter_requests[request_id] = barter_request
        
        # 如果启用自动匹配，立即寻找匹配
        if barter_request['auto_match']:
            matches = find_matches(request_id)
            barter_request['match_count'] = len(matches)
        
        return jsonify({
            "success": True,
            "data": {
                "request": barter_request,
                "message": "Barter request created successfully"
            }
        })
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@barter_bp.route('/requests/<request_id>', methods=['GET'])
def get_barter_request(request_id):
    """获取易货请求详情"""
    try:
        if request_id not in barter_requests:
            return jsonify({"success": False, "error": "Barter request not found"}), 404
        
        barter_request = barter_requests[request_id]
        
        # 增加浏览次数
        barter_request['view_count'] += 1
        
        # 获取匹配结果
        matches = get_matches_for_request(request_id)
        
        return jsonify({
            "success": True,
            "data": {
                "request": barter_request,
                "matches": matches
            }
        })
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@barter_bp.route('/requests/<request_id>/matches', methods=['GET'])
def get_request_matches(request_id):
    """获取易货请求的匹配结果"""
    try:
        if request_id not in barter_requests:
            return jsonify({"success": False, "error": "Barter request not found"}), 404
        
        matches = get_matches_for_request(request_id)
        
        return jsonify({
            "success": True,
            "data": {
                "matches": matches,
                "total": len(matches)
            }
        })
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@barter_bp.route('/matches', methods=['POST'])
def create_match():
    """创建匹配（响应易货请求）"""
    try:
        data = request.get_json()
        
        required_fields = ['request_id', 'responder_address', 'offered_nft']
        for field in required_fields:
            if field not in data:
                return jsonify({"success": False, "error": f"Missing required field: {field}"}), 400
        
        request_id = data['request_id']
        if request_id not in barter_requests:
            return jsonify({"success": False, "error": "Barter request not found"}), 404
        
        match_id = str(uuid.uuid4())
        
        match = {
            "id": match_id,
            "request_id": request_id,
            "responder_address": data['responder_address'],
            "offered_nft": data['offered_nft'],
            "message": data.get('message', ''),
            "status": "pending",
            "created_at": datetime.now().isoformat(),
            "compatibility_score": calculate_compatibility_score(request_id, data['offered_nft']),
            "expires_at": (datetime.now() + timedelta(days=7)).isoformat()
        }
        
        if match_id not in barter_matches:
            barter_matches[match_id] = {}
        barter_matches[match_id] = match
        
        # 更新请求的匹配数量
        barter_requests[request_id]['match_count'] += 1
        
        return jsonify({
            "success": True,
            "data": {
                "match": match,
                "message": "Match created successfully"
            }
        })
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@barter_bp.route('/matches/<match_id>/accept', methods=['POST'])
def accept_match(match_id):
    """接受匹配"""
    try:
        if match_id not in barter_matches:
            return jsonify({"success": False, "error": "Match not found"}), 404
        
        data = request.get_json()
        user_address = data.get('user_address')
        
        match = barter_matches[match_id]
        request_id = match['request_id']
        original_request = barter_requests[request_id]
        
        # 验证用户权限
        if user_address != original_request['user_address']:
            return jsonify({"success": False, "error": "Unauthorized"}), 403
        
        # 更新匹配状态
        match['status'] = 'accepted'
        match['accepted_at'] = datetime.now().isoformat()
        
        # 更新原始请求状态
        original_request['status'] = 'completed'
        
        # 创建交易历史记录
        trade_id = str(uuid.uuid4())
        barter_history[trade_id] = {
            "id": trade_id,
            "request_id": request_id,
            "match_id": match_id,
            "requester_address": original_request['user_address'],
            "responder_address": match['responder_address'],
            "requester_nft": original_request['offered_nft'],
            "responder_nft": match['offered_nft'],
            "status": "completed",
            "completed_at": datetime.now().isoformat(),
            "transaction_hash": f"0x{uuid.uuid4().hex}",
            "gas_fee": random.uniform(0.001, 0.01),
            "platform_fee": 0  # 易货交易免平台费
        }
        
        return jsonify({
            "success": True,
            "data": {
                "match": match,
                "trade": barter_history[trade_id],
                "message": "Match accepted successfully"
            }
        })
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@barter_bp.route('/matches/<match_id>/reject', methods=['POST'])
def reject_match(match_id):
    """拒绝匹配"""
    try:
        if match_id not in barter_matches:
            return jsonify({"success": False, "error": "Match not found"}), 404
        
        data = request.get_json()
        user_address = data.get('user_address')
        reason = data.get('reason', '')
        
        match = barter_matches[match_id]
        request_id = match['request_id']
        original_request = barter_requests[request_id]
        
        # 验证用户权限
        if user_address != original_request['user_address']:
            return jsonify({"success": False, "error": "Unauthorized"}), 403
        
        # 更新匹配状态
        match['status'] = 'rejected'
        match['rejected_at'] = datetime.now().isoformat()
        match['rejection_reason'] = reason
        
        return jsonify({
            "success": True,
            "data": {
                "match": match,
                "message": "Match rejected successfully"
            }
        })
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@barter_bp.route('/history', methods=['GET'])
def get_barter_history():
    """获取易货交易历史"""
    try:
        user_address = request.args.get('user_address')
        limit = int(request.args.get('limit', 20))
        offset = int(request.args.get('offset', 0))
        
        # 生成模拟历史数据
        if not barter_history:
            for i in range(30):
                trade_id = f"trade_{i+1}"
                barter_history[trade_id] = {
                    "id": trade_id,
                    "request_id": f"barter_req_{random.randint(1, 50)}",
                    "match_id": f"match_{i+1}",
                    "requester_address": f"user_{random.randint(1, 100)}",
                    "responder_address": f"user_{random.randint(1, 100)}",
                    "requester_nft": {
                        "id": f"nft_{random.randint(1, 1000)}",
                        "name": f"Traded NFT #{random.randint(1, 1000)}",
                        "image": f"https://picsum.photos/300/300?random={i+100}",
                        "collection": f"Collection {random.choice(['A', 'B', 'C'])}",
                        "value": random.randint(100, 3000)
                    },
                    "responder_nft": {
                        "id": f"nft_{random.randint(1, 1000)}",
                        "name": f"Received NFT #{random.randint(1, 1000)}",
                        "image": f"https://picsum.photos/300/300?random={i+200}",
                        "collection": f"Collection {random.choice(['X', 'Y', 'Z'])}",
                        "value": random.randint(100, 3000)
                    },
                    "status": "completed",
                    "completed_at": (datetime.now() - timedelta(days=random.randint(1, 90))).isoformat(),
                    "transaction_hash": f"0x{uuid.uuid4().hex}",
                    "gas_fee": random.uniform(0.001, 0.01),
                    "platform_fee": 0,
                    "satisfaction_rating": random.randint(3, 5)
                }
        
        # 筛选数据
        filtered_history = list(barter_history.values())
        
        if user_address:
            filtered_history = [h for h in filtered_history 
                              if h['requester_address'] == user_address or h['responder_address'] == user_address]
        
        # 分页
        total = len(filtered_history)
        paginated_history = filtered_history[offset:offset + limit]
        
        return jsonify({
            "success": True,
            "data": {
                "history": paginated_history,
                "pagination": {
                    "total": total,
                    "limit": limit,
                    "offset": offset,
                    "has_more": offset + limit < total
                }
            }
        })
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@barter_bp.route('/preferences', methods=['GET'])
def get_user_preferences():
    """获取用户易货偏好"""
    try:
        user_address = request.args.get('user_address')
        if not user_address:
            return jsonify({"success": False, "error": "Missing user_address parameter"}), 400
        
        # 生成模拟偏好数据
        if user_address not in user_preferences:
            user_preferences[user_address] = {
                "user_address": user_address,
                "preferred_collections": [f"Collection {c}" for c in random.sample(['A', 'B', 'C', 'D', 'E'], 3)],
                "preferred_rarities": random.sample(["Common", "Rare", "Epic", "Legendary"], 2),
                "min_value_threshold": random.randint(50, 500),
                "max_value_threshold": random.randint(1000, 5000),
                "auto_match_enabled": random.choice([True, False]),
                "notification_preferences": {
                    "new_matches": True,
                    "match_accepted": True,
                    "match_rejected": False,
                    "request_expired": True
                },
                "blacklisted_users": [],
                "preferred_traits": [f"trait_{i}" for i in range(random.randint(2, 6))],
                "updated_at": datetime.now().isoformat()
            }
        
        return jsonify({
            "success": True,
            "data": user_preferences[user_address]
        })
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@barter_bp.route('/preferences', methods=['POST'])
def update_user_preferences():
    """更新用户易货偏好"""
    try:
        data = request.get_json()
        user_address = data.get('user_address')
        
        if not user_address:
            return jsonify({"success": False, "error": "Missing user_address"}), 400
        
        # 更新偏好设置
        preferences = user_preferences.get(user_address, {"user_address": user_address})
        
        updatable_fields = [
            'preferred_collections', 'preferred_rarities', 'min_value_threshold',
            'max_value_threshold', 'auto_match_enabled', 'notification_preferences',
            'blacklisted_users', 'preferred_traits'
        ]
        
        for field in updatable_fields:
            if field in data:
                preferences[field] = data[field]
        
        preferences['updated_at'] = datetime.now().isoformat()
        user_preferences[user_address] = preferences
        
        return jsonify({
            "success": True,
            "data": {
                "preferences": preferences,
                "message": "Preferences updated successfully"
            }
        })
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@barter_bp.route('/stats', methods=['GET'])
def get_barter_stats():
    """获取易货交易统计数据"""
    try:
        user_address = request.args.get('user_address')
        
        # 全局统计
        global_stats = {
            "total_requests": len(barter_requests),
            "active_requests": len([r for r in barter_requests.values() if r['status'] == 'active']),
            "completed_trades": len([h for h in barter_history.values() if h['status'] == 'completed']),
            "total_matches": len(barter_matches),
            "success_rate": 0.75,  # 75% 成功率
            "average_match_time": "2.5 days",
            "popular_collections": [
                {"name": "Collection A", "trade_count": 45},
                {"name": "Collection B", "trade_count": 38},
                {"name": "Collection C", "trade_count": 32}
            ]
        }
        
        # 用户个人统计
        user_stats = None
        if user_address:
            user_requests = [r for r in barter_requests.values() if r['user_address'] == user_address]
            user_trades = [h for h in barter_history.values() 
                          if h['requester_address'] == user_address or h['responder_address'] == user_address]
            
            user_stats = {
                "total_requests": len(user_requests),
                "active_requests": len([r for r in user_requests if r['status'] == 'active']),
                "completed_trades": len([t for t in user_trades if t['status'] == 'completed']),
                "success_rate": 0.8 if user_trades else 0,
                "average_satisfaction": 4.2,
                "total_value_traded": sum(t['requester_nft']['value'] for t in user_trades),
                "favorite_collections": ["Collection A", "Collection X"],
                "reputation_score": random.randint(80, 100)
            }
        
        return jsonify({
            "success": True,
            "data": {
                "global_stats": global_stats,
                "user_stats": user_stats
            }
        })
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

# 辅助函数
def find_matches(request_id):
    """为易货请求寻找匹配"""
    matches = []
    request_data = barter_requests[request_id]
    
    # 简化的匹配逻辑
    for other_request_id, other_request in barter_requests.items():
        if other_request_id != request_id and other_request['status'] == 'active':
            compatibility = calculate_compatibility_score(request_id, other_request['offered_nft'])
            if compatibility > 0.6:  # 60% 以上兼容性
                matches.append({
                    "request_id": other_request_id,
                    "compatibility_score": compatibility,
                    "offered_nft": other_request['offered_nft']
                })
    
    return sorted(matches, key=lambda x: x['compatibility_score'], reverse=True)[:10]

def get_matches_for_request(request_id):
    """获取特定请求的所有匹配"""
    return [match for match in barter_matches.values() if match['request_id'] == request_id]

def calculate_compatibility_score(request_id, offered_nft):
    """计算兼容性分数"""
    request_data = barter_requests[request_id]
    desired_nfts = request_data['desired_nfts']
    
    max_score = 0
    for desired in desired_nfts:
        score = 0
        
        # 集合匹配
        if 'collection' in desired and offered_nft.get('collection', '').lower().find(desired['collection'].lower()) != -1:
            score += 0.4
        
        # 稀有度匹配
        if 'rarity' in desired and offered_nft.get('rarity') == desired['rarity']:
            score += 0.3
        
        # 价值范围匹配
        nft_value = offered_nft.get('value', offered_nft.get('estimated_value', 0))
        if 'min_value' in desired and 'max_value' in desired:
            if desired['min_value'] <= nft_value <= desired['max_value']:
                score += 0.3
        
        max_score = max(max_score, score)
    
    return min(max_score, 1.0)

