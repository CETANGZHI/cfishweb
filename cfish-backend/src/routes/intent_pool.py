"""
意图池 (Intent Pool) API 路由
提供交易意图发布、智能匹配、意图响应和历史记录功能
"""

from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
import uuid
import random

intent_pool_bp = Blueprint('intent_pool', __name__)

# 模拟数据存储
intents = {}              # 交易意图
intent_matches = {}       # 意图匹配
intent_responses = {}     # 意图响应
user_intent_history = {}  # 用户意图历史
intent_analytics = {}     # 意图分析数据

@intent_pool_bp.route('/intents', methods=['GET'])
def get_intents():
    """获取意图池列表"""
    try:
        intent_type = request.args.get('type', 'all')  # all, buy, sell, trade, rent
        status = request.args.get('status', 'active')  # active, matched, expired, cancelled
        category = request.args.get('category')
        price_min = request.args.get('price_min', type=float)
        price_max = request.args.get('price_max', type=float)
        currency = request.args.get('currency', 'all')  # all, SOL, CFISH
        limit = int(request.args.get('limit', 20))
        offset = int(request.args.get('offset', 0))
        
        # 生成模拟意图数据
        if not intents:
            intent_types = ['buy', 'sell', 'trade', 'rent']
            categories = ['Art', 'Gaming', 'Music', 'Sports', 'Collectibles', 'Utility']
            currencies = ['SOL', 'CFISH']
            
            for i in range(100):
                intent_id = f"intent_{i+1}"
                intent_type_val = random.choice(intent_types)
                currency_val = random.choice(currencies)
                
                intents[intent_id] = {
                    "id": intent_id,
                    "user_address": f"user_{random.randint(1, 100)}",
                    "type": intent_type_val,
                    "status": random.choice(['active', 'matched', 'expired', 'cancelled']),
                    "created_at": (datetime.now() - timedelta(days=random.randint(0, 30))).isoformat(),
                    "expires_at": (datetime.now() + timedelta(days=random.randint(1, 30))).isoformat(),
                    "title": f"{intent_type_val.title()} Intent #{i+1}",
                    "description": f"Looking to {intent_type_val} NFT with specific requirements",
                    "target_nft": {
                        "collection": random.choice(categories),
                        "traits": [f"trait_{j}" for j in range(random.randint(1, 5))],
                        "rarity": random.choice(['Common', 'Rare', 'Epic', 'Legendary']),
                        "min_value": random.randint(10, 1000) if intent_type_val == 'buy' else None,
                        "max_value": random.randint(1000, 10000) if intent_type_val == 'buy' else None
                    },
                    "offer": {
                        "currency": currency_val,
                        "amount": random.randint(100, 5000) if intent_type_val in ['buy', 'rent'] else None,
                        "nft_id": f"nft_{random.randint(1, 1000)}" if intent_type_val in ['sell', 'trade'] else None,
                        "additional_terms": random.choice([
                            "Immediate payment upon match",
                            "Escrow service required",
                            "Flexible payment terms",
                            "Bundle deals preferred"
                        ])
                    },
                    "matching_criteria": {
                        "auto_match": random.choice([True, False]),
                        "max_matches": random.randint(1, 10),
                        "priority_score": random.randint(1, 100),
                        "geographic_preference": random.choice(['any', 'local', 'international']),
                        "reputation_requirement": random.randint(0, 100)
                    },
                    "privacy_settings": {
                        "public_visibility": random.choice([True, False]),
                        "show_user_info": random.choice([True, False]),
                        "allow_direct_contact": random.choice([True, False])
                    },
                    "match_count": random.randint(0, 20),
                    "response_count": random.randint(0, 50),
                    "tags": random.sample(['urgent', 'flexible', 'premium', 'bulk', 'rare'], random.randint(1, 3))
                }
        
        # 筛选意图
        filtered_intents = list(intents.values())
        
        if intent_type != 'all':
            filtered_intents = [i for i in filtered_intents if i['type'] == intent_type]
        
        if status != 'all':
            filtered_intents = [i for i in filtered_intents if i['status'] == status]
        
        if category:
            filtered_intents = [i for i in filtered_intents if i['target_nft']['collection'] == category]
        
        if currency != 'all':
            filtered_intents = [i for i in filtered_intents if i['offer']['currency'] == currency]
        
        if price_min is not None:
            filtered_intents = [i for i in filtered_intents 
                              if i['offer']['amount'] and i['offer']['amount'] >= price_min]
        
        if price_max is not None:
            filtered_intents = [i for i in filtered_intents 
                              if i['offer']['amount'] and i['offer']['amount'] <= price_max]
        
        # 排序：优先级分数高的在前，然后按创建时间排序
        filtered_intents.sort(key=lambda x: (-x['matching_criteria']['priority_score'], x['created_at']))
        
        # 分页
        total = len(filtered_intents)
        paginated_intents = filtered_intents[offset:offset + limit]
        
        return jsonify({
            "success": True,
            "data": {
                "intents": paginated_intents,
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

@intent_pool_bp.route('/intents/<intent_id>', methods=['GET'])
def get_intent_detail(intent_id):
    """获取意图详情"""
    try:
        if intent_id not in intents:
            return jsonify({"success": False, "error": "Intent not found"}), 404
        
        intent = intents[intent_id]
        
        # 获取匹配信息
        matches = intent_matches.get(intent_id, [])
        responses = intent_responses.get(intent_id, [])
        
        # 计算匹配度分数
        match_scores = []
        for match in matches[:5]:  # 显示前5个最佳匹配
            score = random.randint(60, 100)
            match_scores.append({
                "match_id": match['id'],
                "nft_id": match['nft_id'],
                "score": score,
                "reasons": [
                    "Collection match: 95%",
                    "Price range match: 87%",
                    "Rarity match: 92%",
                    "Trait match: 78%"
                ]
            })
        
        return jsonify({
            "success": True,
            "data": {
                **intent,
                "matches": matches,
                "responses": responses,
                "match_scores": match_scores,
                "analytics": {
                    "view_count": random.randint(10, 500),
                    "interest_level": random.randint(1, 10),
                    "estimated_completion_time": f"{random.randint(1, 14)} days",
                    "similar_intents_count": random.randint(0, 20)
                }
            }
        })
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@intent_pool_bp.route('/intents', methods=['POST'])
def create_intent():
    """创建交易意图"""
    try:
        data = request.get_json()
        
        # 验证必需字段
        required_fields = ['user_address', 'type', 'title', 'target_nft']
        for field in required_fields:
            if field not in data:
                return jsonify({"success": False, "error": f"Missing required field: {field}"}), 400
        
        intent_id = str(uuid.uuid4())
        
        intent = {
            "id": intent_id,
            "user_address": data['user_address'],
            "type": data['type'],
            "status": "active",
            "created_at": datetime.now().isoformat(),
            "expires_at": data.get('expires_at', (datetime.now() + timedelta(days=30)).isoformat()),
            "title": data['title'],
            "description": data.get('description', ''),
            "target_nft": data['target_nft'],
            "offer": data.get('offer', {}),
            "matching_criteria": data.get('matching_criteria', {
                "auto_match": True,
                "max_matches": 5,
                "priority_score": 50,
                "geographic_preference": "any",
                "reputation_requirement": 0
            }),
            "privacy_settings": data.get('privacy_settings', {
                "public_visibility": True,
                "show_user_info": False,
                "allow_direct_contact": True
            }),
            "match_count": 0,
            "response_count": 0,
            "tags": data.get('tags', [])
        }
        
        intents[intent_id] = intent
        
        # 立即尝试匹配
        if intent['matching_criteria']['auto_match']:
            matches = find_matches(intent_id)
            intent['match_count'] = len(matches)
        
        return jsonify({
            "success": True,
            "data": {
                "message": "Intent created successfully",
                "intent": intent
            }
        })
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@intent_pool_bp.route('/intents/<intent_id>/matches', methods=['GET'])
def get_intent_matches(intent_id):
    """获取意图匹配结果"""
    try:
        if intent_id not in intents:
            return jsonify({"success": False, "error": "Intent not found"}), 404
        
        # 生成或获取匹配结果
        if intent_id not in intent_matches:
            matches = find_matches(intent_id)
            intent_matches[intent_id] = matches
        
        matches = intent_matches[intent_id]
        
        return jsonify({
            "success": True,
            "data": {
                "intent_id": intent_id,
                "matches": matches,
                "total_matches": len(matches)
            }
        })
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@intent_pool_bp.route('/intents/<intent_id>/respond', methods=['POST'])
def respond_to_intent(intent_id):
    """响应交易意图"""
    try:
        data = request.get_json()
        
        if intent_id not in intents:
            return jsonify({"success": False, "error": "Intent not found"}), 404
        
        required_fields = ['user_address', 'response_type', 'message']
        for field in required_fields:
            if field not in data:
                return jsonify({"success": False, "error": f"Missing required field: {field}"}), 400
        
        response_id = str(uuid.uuid4())
        
        response = {
            "id": response_id,
            "intent_id": intent_id,
            "user_address": data['user_address'],
            "response_type": data['response_type'],  # offer, question, interest, counter_offer
            "message": data['message'],
            "created_at": datetime.now().isoformat(),
            "status": "pending",
            "offer_details": data.get('offer_details', {}),
            "contact_info": data.get('contact_info', {}),
            "attachments": data.get('attachments', [])
        }
        
        if intent_id not in intent_responses:
            intent_responses[intent_id] = []
        intent_responses[intent_id].append(response)
        
        # 更新意图的响应计数
        intents[intent_id]['response_count'] += 1
        
        return jsonify({
            "success": True,
            "data": {
                "message": "Response submitted successfully",
                "response": response
            }
        })
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@intent_pool_bp.route('/intents/<intent_id>/cancel', methods=['POST'])
def cancel_intent(intent_id):
    """取消交易意图"""
    try:
        data = request.get_json()
        user_address = data.get('user_address')
        
        if intent_id not in intents:
            return jsonify({"success": False, "error": "Intent not found"}), 404
        
        intent = intents[intent_id]
        
        # 验证用户权限
        if intent['user_address'] != user_address:
            return jsonify({"success": False, "error": "Unauthorized"}), 403
        
        # 更新状态
        intent['status'] = 'cancelled'
        intent['cancelled_at'] = datetime.now().isoformat()
        intent['cancellation_reason'] = data.get('reason', 'User cancelled')
        
        return jsonify({
            "success": True,
            "data": {
                "message": "Intent cancelled successfully",
                "intent": intent
            }
        })
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@intent_pool_bp.route('/intents/user/<user_address>', methods=['GET'])
def get_user_intents(user_address):
    """获取用户的意图历史"""
    try:
        status = request.args.get('status', 'all')
        intent_type = request.args.get('type', 'all')
        limit = int(request.args.get('limit', 20))
        offset = int(request.args.get('offset', 0))
        
        # 筛选用户的意图
        user_intents = [intent for intent in intents.values() 
                       if intent['user_address'] == user_address]
        
        if status != 'all':
            user_intents = [i for i in user_intents if i['status'] == status]
        
        if intent_type != 'all':
            user_intents = [i for i in user_intents if i['type'] == intent_type]
        
        # 排序
        user_intents.sort(key=lambda x: x['created_at'], reverse=True)
        
        # 分页
        total = len(user_intents)
        paginated_intents = user_intents[offset:offset + limit]
        
        # 计算用户统计
        stats = {
            "total_intents": len([i for i in intents.values() if i['user_address'] == user_address]),
            "active_intents": len([i for i in user_intents if i['status'] == 'active']),
            "matched_intents": len([i for i in user_intents if i['status'] == 'matched']),
            "success_rate": random.randint(60, 95),
            "average_response_time": f"{random.randint(1, 48)} hours",
            "total_matches": sum(i['match_count'] for i in user_intents),
            "total_responses": sum(i['response_count'] for i in user_intents)
        }
        
        return jsonify({
            "success": True,
            "data": {
                "intents": paginated_intents,
                "stats": stats,
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

@intent_pool_bp.route('/intents/analytics', methods=['GET'])
def get_intent_analytics():
    """获取意图池分析数据"""
    try:
        period = request.args.get('period', '7d')  # 1d, 7d, 30d, 90d
        
        # 生成分析数据
        analytics = {
            "period": period,
            "total_intents": len(intents),
            "active_intents": len([i for i in intents.values() if i['status'] == 'active']),
            "matched_intents": len([i for i in intents.values() if i['status'] == 'matched']),
            "success_rate": random.randint(65, 85),
            "average_match_time": f"{random.randint(2, 72)} hours",
            "popular_categories": [
                {"category": "Art", "count": random.randint(20, 50), "percentage": random.randint(20, 35)},
                {"category": "Gaming", "count": random.randint(15, 40), "percentage": random.randint(15, 30)},
                {"category": "Music", "count": random.randint(10, 30), "percentage": random.randint(10, 25)},
                {"category": "Sports", "count": random.randint(5, 25), "percentage": random.randint(5, 20)},
                {"category": "Collectibles", "count": random.randint(8, 20), "percentage": random.randint(8, 18)}
            ],
            "intent_types_distribution": {
                "buy": random.randint(30, 50),
                "sell": random.randint(25, 40),
                "trade": random.randint(15, 25),
                "rent": random.randint(5, 15)
            },
            "currency_preferences": {
                "CFISH": random.randint(55, 75),
                "SOL": random.randint(25, 45)
            },
            "daily_activity": [
                {
                    "date": (datetime.now() - timedelta(days=i)).strftime("%Y-%m-%d"),
                    "new_intents": random.randint(10, 50),
                    "matches": random.randint(5, 30),
                    "completions": random.randint(2, 20)
                }
                for i in range(7)
            ]
        }
        
        return jsonify({
            "success": True,
            "data": analytics
        })
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

def find_matches(intent_id):
    """智能匹配算法"""
    if intent_id not in intents:
        return []
    
    intent = intents[intent_id]
    matches = []
    
    # 模拟智能匹配逻辑
    for i in range(random.randint(0, 10)):
        match_id = str(uuid.uuid4())
        match = {
            "id": match_id,
            "intent_id": intent_id,
            "nft_id": f"nft_{random.randint(1, 1000)}",
            "owner_address": f"user_{random.randint(1, 100)}",
            "match_score": random.randint(60, 100),
            "created_at": datetime.now().isoformat(),
            "status": "pending",
            "nft_details": {
                "name": f"Matched NFT #{i+1}",
                "collection": intent['target_nft']['collection'],
                "image": f"https://picsum.photos/400/400?random={i+200}",
                "price": random.randint(100, 5000),
                "currency": random.choice(['SOL', 'CFISH']),
                "rarity": random.choice(['Common', 'Rare', 'Epic', 'Legendary'])
            },
            "match_reasons": [
                "Collection exact match",
                f"Price within range ({intent.get('target_nft', {}).get('min_value', 0)}-{intent.get('target_nft', {}).get('max_value', 10000)})",
                "Rarity preference match",
                "Seller reputation high"
            ]
        }
        matches.append(match)
    
    return matches

