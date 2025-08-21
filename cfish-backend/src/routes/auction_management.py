"""
拍卖管理 (Auction Management) API 路由
提供多种拍卖类型、实时竞价、拍卖管理和分析功能
"""

from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
import uuid
import random

auction_management_bp = Blueprint('auction_management', __name__)

# 模拟数据存储
auctions = {}             # 拍卖数据
auction_bids = {}         # 竞价记录
auction_participants = {} # 拍卖参与者
auction_analytics = {}    # 拍卖分析数据
user_auction_history = {} # 用户拍卖历史

@auction_management_bp.route('/auctions', methods=['GET'])
def get_auctions():
    """获取拍卖列表"""
    try:
        auction_type = request.args.get('type', 'all')  # all, english, dutch, sealed_bid, reserve
        status = request.args.get('status', 'all')  # all, upcoming, active, ended, cancelled
        category = request.args.get('category')
        price_min = request.args.get('price_min', type=float)
        price_max = request.args.get('price_max', type=float)
        currency = request.args.get('currency', 'all')  # all, SOL, CFISH
        sort_by = request.args.get('sort_by', 'end_time')  # end_time, current_bid, start_time
        limit = int(request.args.get('limit', 20))
        offset = int(request.args.get('offset', 0))
        
        # 生成模拟拍卖数据
        if not auctions:
            auction_types = [
                {"type": "english", "name": "英式拍卖", "description": "价高者得，公开竞价"},
                {"type": "dutch", "name": "荷兰式拍卖", "description": "价格递减，先到先得"},
                {"type": "sealed_bid", "name": "密封竞价", "description": "秘密出价，最高价获胜"},
                {"type": "reserve", "name": "保留价拍卖", "description": "设定最低成交价"}
            ]
            
            categories = ['Art', 'Gaming', 'Music', 'Sports', 'Collectibles', 'Utility', 'Photography']
            currencies = ['SOL', 'CFISH']
            
            for i in range(80):
                auction_type_info = random.choice(auction_types)
                auction_id = f"auction_{i+1}"
                
                start_time = datetime.now() + timedelta(hours=random.randint(-48, 72))
                duration_hours = random.randint(6, 168)  # 6小时到7天
                end_time = start_time + timedelta(hours=duration_hours)
                
                current_time = datetime.now()
                if start_time > current_time:
                    status_val = "upcoming"
                elif end_time > current_time:
                    status_val = "active"
                else:
                    status_val = "ended"
                
                starting_price = random.randint(10, 1000)
                current_bid = starting_price + random.randint(0, 5000) if status_val != "upcoming" else starting_price
                
                auctions[auction_id] = {
                    "id": auction_id,
                    "title": f"Auction: {random.choice(['Rare', 'Epic', 'Legendary', 'Unique'])} NFT #{i+1}",
                    "description": f"High-quality NFT from {random.choice(categories)} collection",
                    "type": auction_type_info["type"],
                    "type_name": auction_type_info["name"],
                    "status": status_val,
                    "nft": {
                        "id": f"nft_{i+1}",
                        "name": f"NFT #{i+1}",
                        "collection": random.choice(categories),
                        "image": f"https://picsum.photos/500/500?random={i+300}",
                        "rarity": random.choice(['Common', 'Rare', 'Epic', 'Legendary']),
                        "traits": [
                            {"trait_type": "Background", "value": random.choice(['Blue', 'Red', 'Green', 'Purple'])},
                            {"trait_type": "Eyes", "value": random.choice(['Normal', 'Laser', 'Glowing'])},
                            {"trait_type": "Mouth", "value": random.choice(['Smile', 'Frown', 'Open'])}
                        ]
                    },
                    "seller": {
                        "address": f"seller_{random.randint(1, 50)}",
                        "username": f"Seller{random.randint(1, 50)}",
                        "reputation": random.randint(70, 100),
                        "verified": random.choice([True, False])
                    },
                    "pricing": {
                        "currency": random.choice(currencies),
                        "starting_price": starting_price,
                        "current_bid": current_bid,
                        "reserve_price": starting_price + random.randint(100, 1000) if auction_type_info["type"] == "reserve" else None,
                        "buy_now_price": current_bid + random.randint(500, 2000) if random.choice([True, False]) else None,
                        "price_step": random.randint(5, 50),
                        "dutch_decrement": random.randint(10, 100) if auction_type_info["type"] == "dutch" else None
                    },
                    "timing": {
                        "created_at": (start_time - timedelta(hours=random.randint(1, 24))).isoformat(),
                        "start_time": start_time.isoformat(),
                        "end_time": end_time.isoformat(),
                        "time_remaining": max(0, (end_time - current_time).total_seconds()) if status_val == "active" else 0,
                        "auto_extend": random.choice([True, False]),
                        "extend_duration": 300  # 5分钟
                    },
                    "participation": {
                        "total_bids": random.randint(0, 100),
                        "unique_bidders": random.randint(0, 50),
                        "view_count": random.randint(10, 1000),
                        "watch_count": random.randint(0, 200)
                    },
                    "settings": {
                        "min_bid_increment": random.randint(5, 50),
                        "max_bid_increment": random.randint(100, 500),
                        "bid_deposit_required": random.choice([True, False]),
                        "deposit_amount": random.randint(50, 200),
                        "whitelist_only": random.choice([True, False]),
                        "kyc_required": random.choice([True, False])
                    },
                    "featured": random.choice([True, False]),
                    "tags": random.sample(['热门', '稀有', '艺术', '游戏', '收藏', '投资'], random.randint(2, 4))
                }
        
        # 筛选拍卖
        filtered_auctions = list(auctions.values())
        
        if auction_type != 'all':
            filtered_auctions = [a for a in filtered_auctions if a['type'] == auction_type]
        
        if status != 'all':
            filtered_auctions = [a for a in filtered_auctions if a['status'] == status]
        
        if category:
            filtered_auctions = [a for a in filtered_auctions if a['nft']['collection'] == category]
        
        if currency != 'all':
            filtered_auctions = [a for a in filtered_auctions if a['pricing']['currency'] == currency]
        
        if price_min is not None:
            filtered_auctions = [a for a in filtered_auctions if a['pricing']['current_bid'] >= price_min]
        
        if price_max is not None:
            filtered_auctions = [a for a in filtered_auctions if a['pricing']['current_bid'] <= price_max]
        
        # 排序
        if sort_by == 'end_time':
            filtered_auctions.sort(key=lambda x: x['timing']['end_time'])
        elif sort_by == 'current_bid':
            filtered_auctions.sort(key=lambda x: x['pricing']['current_bid'], reverse=True)
        elif sort_by == 'start_time':
            filtered_auctions.sort(key=lambda x: x['timing']['start_time'], reverse=True)
        
        # Featured拍卖优先
        filtered_auctions.sort(key=lambda x: not x['featured'])
        
        # 分页
        total = len(filtered_auctions)
        paginated_auctions = filtered_auctions[offset:offset + limit]
        
        return jsonify({
            "success": True,
            "data": {
                "auctions": paginated_auctions,
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

@auction_management_bp.route('/auctions/<auction_id>', methods=['GET'])
def get_auction_detail(auction_id):
    """获取拍卖详情"""
    try:
        if auction_id not in auctions:
            return jsonify({"success": False, "error": "Auction not found"}), 404
        
        auction = auctions[auction_id]
        
        # 获取竞价历史
        bids = auction_bids.get(auction_id, [])
        
        # 获取参与者信息
        participants = auction_participants.get(auction_id, [])
        
        # 计算实时统计
        current_time = datetime.now()
        end_time = datetime.fromisoformat(auction['timing']['end_time'])
        time_remaining = max(0, (end_time - current_time).total_seconds())
        
        # 更新实时信息
        auction['timing']['time_remaining'] = time_remaining
        if time_remaining == 0 and auction['status'] == 'active':
            auction['status'] = 'ended'
        
        return jsonify({
            "success": True,
            "data": {
                **auction,
                "bids": bids[-20:],  # 最近20个竞价
                "participants": participants,
                "real_time_stats": {
                    "time_remaining": time_remaining,
                    "is_ending_soon": time_remaining < 3600,  # 1小时内结束
                    "bid_frequency": len(bids) / max(1, (current_time - datetime.fromisoformat(auction['timing']['start_time'])).total_seconds() / 3600),
                    "average_bid_increment": sum(b.get('increment', 0) for b in bids) / max(1, len(bids))
                }
            }
        })
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@auction_management_bp.route('/auctions', methods=['POST'])
def create_auction():
    """创建拍卖"""
    try:
        data = request.get_json()
        
        # 验证必需字段
        required_fields = ['seller_address', 'nft_id', 'type', 'starting_price', 'duration_hours']
        for field in required_fields:
            if field not in data:
                return jsonify({"success": False, "error": f"Missing required field: {field}"}), 400
        
        auction_id = str(uuid.uuid4())
        
        start_time = datetime.fromisoformat(data.get('start_time', datetime.now().isoformat()))
        end_time = start_time + timedelta(hours=data['duration_hours'])
        
        auction = {
            "id": auction_id,
            "title": data.get('title', f"Auction for NFT {data['nft_id']}"),
            "description": data.get('description', ''),
            "type": data['type'],
            "status": "upcoming" if start_time > datetime.now() else "active",
            "nft": {
                "id": data['nft_id'],
                "name": data.get('nft_name', f"NFT {data['nft_id']}"),
                "collection": data.get('collection', 'Unknown'),
                "image": data.get('nft_image', ''),
                "rarity": data.get('rarity', 'Common'),
                "traits": data.get('traits', [])
            },
            "seller": {
                "address": data['seller_address'],
                "username": data.get('seller_username', ''),
                "reputation": data.get('seller_reputation', 0),
                "verified": data.get('seller_verified', False)
            },
            "pricing": {
                "currency": data.get('currency', 'CFISH'),
                "starting_price": data['starting_price'],
                "current_bid": data['starting_price'],
                "reserve_price": data.get('reserve_price'),
                "buy_now_price": data.get('buy_now_price'),
                "price_step": data.get('price_step', 10),
                "dutch_decrement": data.get('dutch_decrement')
            },
            "timing": {
                "created_at": datetime.now().isoformat(),
                "start_time": start_time.isoformat(),
                "end_time": end_time.isoformat(),
                "time_remaining": (end_time - datetime.now()).total_seconds(),
                "auto_extend": data.get('auto_extend', False),
                "extend_duration": data.get('extend_duration', 300)
            },
            "participation": {
                "total_bids": 0,
                "unique_bidders": 0,
                "view_count": 0,
                "watch_count": 0
            },
            "settings": {
                "min_bid_increment": data.get('min_bid_increment', 10),
                "max_bid_increment": data.get('max_bid_increment', 1000),
                "bid_deposit_required": data.get('bid_deposit_required', False),
                "deposit_amount": data.get('deposit_amount', 0),
                "whitelist_only": data.get('whitelist_only', False),
                "kyc_required": data.get('kyc_required', False)
            },
            "featured": data.get('featured', False),
            "tags": data.get('tags', [])
        }
        
        auctions[auction_id] = auction
        
        return jsonify({
            "success": True,
            "data": {
                "message": "Auction created successfully",
                "auction": auction
            }
        })
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@auction_management_bp.route('/auctions/<auction_id>/bid', methods=['POST'])
def place_bid(auction_id):
    """出价竞拍"""
    try:
        data = request.get_json()
        
        if auction_id not in auctions:
            return jsonify({"success": False, "error": "Auction not found"}), 404
        
        auction = auctions[auction_id]
        
        # 验证拍卖状态
        if auction['status'] != 'active':
            return jsonify({"success": False, "error": "Auction is not active"}), 400
        
        # 验证必需字段
        required_fields = ['bidder_address', 'bid_amount']
        for field in required_fields:
            if field not in data:
                return jsonify({"success": False, "error": f"Missing required field: {field}"}), 400
        
        bid_amount = data['bid_amount']
        current_bid = auction['pricing']['current_bid']
        min_increment = auction['settings']['min_bid_increment']
        
        # 验证出价金额
        if bid_amount <= current_bid:
            return jsonify({"success": False, "error": "Bid must be higher than current bid"}), 400
        
        if bid_amount < current_bid + min_increment:
            return jsonify({"success": False, "error": f"Minimum bid increment is {min_increment}"}), 400
        
        # 创建竞价记录
        bid_id = str(uuid.uuid4())
        bid = {
            "id": bid_id,
            "auction_id": auction_id,
            "bidder_address": data['bidder_address'],
            "bid_amount": bid_amount,
            "increment": bid_amount - current_bid,
            "timestamp": datetime.now().isoformat(),
            "status": "active",
            "transaction_hash": f"tx_{random.randint(100000, 999999)}",
            "gas_fee": random.randint(1, 10) / 1000  # SOL gas fee
        }
        
        # 保存竞价记录
        if auction_id not in auction_bids:
            auction_bids[auction_id] = []
        auction_bids[auction_id].append(bid)
        
        # 更新拍卖信息
        auction['pricing']['current_bid'] = bid_amount
        auction['participation']['total_bids'] += 1
        
        # 更新参与者信息
        if auction_id not in auction_participants:
            auction_participants[auction_id] = []
        
        participants = auction_participants[auction_id]
        bidder_exists = any(p['address'] == data['bidder_address'] for p in participants)
        
        if not bidder_exists:
            participants.append({
                "address": data['bidder_address'],
                "username": data.get('bidder_username', ''),
                "first_bid_at": datetime.now().isoformat(),
                "total_bids": 1,
                "highest_bid": bid_amount,
                "is_leading": True
            })
            auction['participation']['unique_bidders'] += 1
        else:
            for p in participants:
                if p['address'] == data['bidder_address']:
                    p['total_bids'] += 1
                    p['highest_bid'] = max(p['highest_bid'], bid_amount)
                    p['is_leading'] = True
                else:
                    p['is_leading'] = False
        
        # 自动延时功能
        if auction['timing']['auto_extend']:
            end_time = datetime.fromisoformat(auction['timing']['end_time'])
            current_time = datetime.now()
            time_remaining = (end_time - current_time).total_seconds()
            
            if time_remaining < auction['timing']['extend_duration']:
                new_end_time = current_time + timedelta(seconds=auction['timing']['extend_duration'])
                auction['timing']['end_time'] = new_end_time.isoformat()
                auction['timing']['time_remaining'] = auction['timing']['extend_duration']
        
        return jsonify({
            "success": True,
            "data": {
                "message": "Bid placed successfully",
                "bid": bid,
                "auction": auction
            }
        })
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@auction_management_bp.route('/auctions/<auction_id>/bids', methods=['GET'])
def get_auction_bids(auction_id):
    """获取拍卖竞价历史"""
    try:
        if auction_id not in auctions:
            return jsonify({"success": False, "error": "Auction not found"}), 404
        
        limit = int(request.args.get('limit', 50))
        offset = int(request.args.get('offset', 0))
        
        bids = auction_bids.get(auction_id, [])
        
        # 按时间倒序排列
        bids.sort(key=lambda x: x['timestamp'], reverse=True)
        
        # 分页
        total = len(bids)
        paginated_bids = bids[offset:offset + limit]
        
        return jsonify({
            "success": True,
            "data": {
                "bids": paginated_bids,
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

@auction_management_bp.route('/auctions/<auction_id>/watch', methods=['POST'])
def watch_auction(auction_id):
    """关注拍卖"""
    try:
        data = request.get_json()
        user_address = data.get('user_address')
        
        if not user_address:
            return jsonify({"success": False, "error": "User address is required"}), 400
        
        if auction_id not in auctions:
            return jsonify({"success": False, "error": "Auction not found"}), 404
        
        # 更新关注数
        auctions[auction_id]['participation']['watch_count'] += 1
        
        return jsonify({
            "success": True,
            "data": {
                "message": "Auction watched successfully",
                "watch_count": auctions[auction_id]['participation']['watch_count']
            }
        })
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@auction_management_bp.route('/auctions/<auction_id>/cancel', methods=['POST'])
def cancel_auction(auction_id):
    """取消拍卖"""
    try:
        data = request.get_json()
        seller_address = data.get('seller_address')
        
        if auction_id not in auctions:
            return jsonify({"success": False, "error": "Auction not found"}), 404
        
        auction = auctions[auction_id]
        
        # 验证权限
        if auction['seller']['address'] != seller_address:
            return jsonify({"success": False, "error": "Unauthorized"}), 403
        
        # 验证状态
        if auction['status'] not in ['upcoming', 'active']:
            return jsonify({"success": False, "error": "Cannot cancel ended auction"}), 400
        
        # 检查是否有竞价
        bids = auction_bids.get(auction_id, [])
        if bids:
            return jsonify({"success": False, "error": "Cannot cancel auction with existing bids"}), 400
        
        # 取消拍卖
        auction['status'] = 'cancelled'
        auction['cancelled_at'] = datetime.now().isoformat()
        auction['cancellation_reason'] = data.get('reason', 'Cancelled by seller')
        
        return jsonify({
            "success": True,
            "data": {
                "message": "Auction cancelled successfully",
                "auction": auction
            }
        })
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@auction_management_bp.route('/auctions/user/<user_address>', methods=['GET'])
def get_user_auctions(user_address):
    """获取用户拍卖历史"""
    try:
        role = request.args.get('role', 'all')  # all, seller, bidder
        status = request.args.get('status', 'all')
        limit = int(request.args.get('limit', 20))
        offset = int(request.args.get('offset', 0))
        
        user_auctions = []
        
        if role in ['all', 'seller']:
            # 作为卖家的拍卖
            seller_auctions = [a for a in auctions.values() if a['seller']['address'] == user_address]
            for auction in seller_auctions:
                user_auctions.append({
                    **auction,
                    "user_role": "seller",
                    "user_status": auction['status']
                })
        
        if role in ['all', 'bidder']:
            # 作为竞拍者的拍卖
            for auction_id, participants in auction_participants.items():
                for participant in participants:
                    if participant['address'] == user_address:
                        auction = auctions[auction_id]
                        user_auctions.append({
                            **auction,
                            "user_role": "bidder",
                            "user_status": "leading" if participant['is_leading'] else "outbid",
                            "user_highest_bid": participant['highest_bid'],
                            "user_total_bids": participant['total_bids']
                        })
                        break
        
        # 筛选状态
        if status != 'all':
            user_auctions = [a for a in user_auctions if a['status'] == status]
        
        # 排序
        user_auctions.sort(key=lambda x: x['timing']['created_at'], reverse=True)
        
        # 分页
        total = len(user_auctions)
        paginated_auctions = user_auctions[offset:offset + limit]
        
        # 计算统计
        stats = {
            "total_auctions": len(user_auctions),
            "as_seller": len([a for a in user_auctions if a['user_role'] == 'seller']),
            "as_bidder": len([a for a in user_auctions if a['user_role'] == 'bidder']),
            "won_auctions": len([a for a in user_auctions if a.get('user_status') == 'leading' and a['status'] == 'ended']),
            "active_bids": len([a for a in user_auctions if a.get('user_status') == 'leading' and a['status'] == 'active']),
            "total_spent": sum(a.get('user_highest_bid', 0) for a in user_auctions if a.get('user_role') == 'bidder'),
            "total_earned": sum(a['pricing']['current_bid'] for a in user_auctions if a['user_role'] == 'seller' and a['status'] == 'ended')
        }
        
        return jsonify({
            "success": True,
            "data": {
                "auctions": paginated_auctions,
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

@auction_management_bp.route('/auctions/analytics', methods=['GET'])
def get_auction_analytics():
    """获取拍卖分析数据"""
    try:
        period = request.args.get('period', '7d')  # 1d, 7d, 30d, 90d
        
        # 计算分析数据
        total_auctions = len(auctions)
        active_auctions = len([a for a in auctions.values() if a['status'] == 'active'])
        ended_auctions = len([a for a in auctions.values() if a['status'] == 'ended'])
        
        total_volume = sum(a['pricing']['current_bid'] for a in auctions.values() if a['status'] == 'ended')
        average_price = total_volume / max(1, ended_auctions)
        
        analytics = {
            "period": period,
            "overview": {
                "total_auctions": total_auctions,
                "active_auctions": active_auctions,
                "ended_auctions": ended_auctions,
                "success_rate": (ended_auctions / max(1, total_auctions)) * 100,
                "total_volume": total_volume,
                "average_price": average_price
            },
            "auction_types": {
                "english": len([a for a in auctions.values() if a['type'] == 'english']),
                "dutch": len([a for a in auctions.values() if a['type'] == 'dutch']),
                "sealed_bid": len([a for a in auctions.values() if a['type'] == 'sealed_bid']),
                "reserve": len([a for a in auctions.values() if a['type'] == 'reserve'])
            },
            "categories": [
                {"category": "Art", "count": random.randint(15, 30), "volume": random.randint(10000, 50000)},
                {"category": "Gaming", "count": random.randint(10, 25), "volume": random.randint(8000, 40000)},
                {"category": "Music", "count": random.randint(8, 20), "volume": random.randint(5000, 30000)},
                {"category": "Sports", "count": random.randint(5, 15), "volume": random.randint(3000, 20000)}
            ],
            "currency_distribution": {
                "CFISH": len([a for a in auctions.values() if a['pricing']['currency'] == 'CFISH']),
                "SOL": len([a for a in auctions.values() if a['pricing']['currency'] == 'SOL'])
            },
            "daily_stats": [
                {
                    "date": (datetime.now() - timedelta(days=i)).strftime("%Y-%m-%d"),
                    "new_auctions": random.randint(5, 20),
                    "ended_auctions": random.randint(3, 15),
                    "total_bids": random.randint(50, 200),
                    "volume": random.randint(1000, 10000)
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

