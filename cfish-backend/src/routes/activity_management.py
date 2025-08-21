"""
活动管理 (Activity Management) API 路由
提供平台活动的创建、管理、参与和日历集成功能
"""

from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
import uuid
import random

activity_management_bp = Blueprint('activity_management', __name__)

# 模拟数据存储
activities = {}           # 活动数据
activity_participants = {} # 活动参与者
activity_rewards = {}     # 活动奖励
user_activity_history = {} # 用户活动历史
activity_calendar = {}    # 活动日历

@activity_management_bp.route('/activities', methods=['GET'])
def get_activities():
    """获取活动列表"""
    try:
        status = request.args.get('status', 'all')  # all, upcoming, active, ended
        category = request.args.get('category', 'all')  # all, trading, staking, social, competition
        limit = int(request.args.get('limit', 20))
        offset = int(request.args.get('offset', 0))
        
        # 生成模拟活动数据
        if not activities:
            activity_types = [
                {"type": "trading", "name": "交易挑战赛", "description": "完成指定数量的NFT交易获得奖励"},
                {"type": "staking", "name": "质押活动", "description": "质押CFISH代币获得额外奖励"},
                {"type": "social", "name": "社交活动", "description": "邀请好友参与平台获得奖励"},
                {"type": "competition", "name": "创作比赛", "description": "提交优秀NFT作品参与比赛"},
                {"type": "airdrop", "name": "空投活动", "description": "满足条件的用户可获得免费代币"},
                {"type": "launch", "name": "项目首发", "description": "新项目在平台首发销售"}
            ]
            
            for i in range(30):
                activity_type = random.choice(activity_types)
                activity_id = f"activity_{i+1}"
                start_time = datetime.now() + timedelta(days=random.randint(-10, 30))
                end_time = start_time + timedelta(days=random.randint(1, 14))
                
                activities[activity_id] = {
                    "id": activity_id,
                    "title": f"{activity_type['name']} #{i+1}",
                    "description": activity_type['description'],
                    "category": activity_type['type'],
                    "status": "upcoming" if start_time > datetime.now() else ("active" if end_time > datetime.now() else "ended"),
                    "start_time": start_time.isoformat(),
                    "end_time": end_time.isoformat(),
                    "created_by": "platform",
                    "max_participants": random.randint(100, 10000),
                    "current_participants": random.randint(0, 500),
                    "rewards": {
                        "type": random.choice(["CFISH", "NFT", "SOL", "Mixed"]),
                        "total_pool": random.randint(1000, 100000),
                        "distribution": random.choice(["winner_takes_all", "top_10", "all_participants", "lottery"])
                    },
                    "requirements": {
                        "min_level": random.randint(1, 10),
                        "min_stake": random.randint(0, 1000),
                        "whitelist_only": random.choice([True, False]),
                        "kyc_required": random.choice([True, False])
                    },
                    "rules": [
                        "参与者必须完成KYC验证",
                        "每个钱包地址只能参与一次",
                        "活动期间不得进行恶意操作",
                        "奖励将在活动结束后7个工作日内发放"
                    ],
                    "banner_image": f"https://picsum.photos/800/400?random={i+100}",
                    "featured": random.choice([True, False]),
                    "tags": random.sample(["热门", "限时", "高奖励", "新手友好", "专业级"], random.randint(2, 4))
                }
        
        # 筛选活动
        filtered_activities = list(activities.values())
        
        if status != 'all':
            filtered_activities = [a for a in filtered_activities if a['status'] == status]
        
        if category != 'all':
            filtered_activities = [a for a in filtered_activities if a['category'] == category]
        
        # 排序：featured活动优先，然后按开始时间排序
        filtered_activities.sort(key=lambda x: (not x['featured'], x['start_time']))
        
        # 分页
        total = len(filtered_activities)
        paginated_activities = filtered_activities[offset:offset + limit]
        
        return jsonify({
            "success": True,
            "data": {
                "activities": paginated_activities,
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

@activity_management_bp.route('/activities/<activity_id>', methods=['GET'])
def get_activity_detail(activity_id):
    """获取活动详情"""
    try:
        if activity_id not in activities:
            return jsonify({"success": False, "error": "Activity not found"}), 404
        
        activity = activities[activity_id]
        
        # 获取参与者信息
        participants = activity_participants.get(activity_id, [])
        
        # 获取活动进度
        progress = {
            "participation_rate": len(participants) / activity['max_participants'] * 100,
            "time_remaining": max(0, (datetime.fromisoformat(activity['end_time']) - datetime.now()).total_seconds()),
            "leaderboard": [
                {
                    "rank": i + 1,
                    "user_address": f"user_{random.randint(1, 100)}",
                    "score": random.randint(100, 10000),
                    "reward_earned": random.randint(10, 1000)
                }
                for i in range(min(10, len(participants)))
            ]
        }
        
        return jsonify({
            "success": True,
            "data": {
                **activity,
                "participants_count": len(participants),
                "progress": progress
            }
        })
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@activity_management_bp.route('/activities/<activity_id>/join', methods=['POST'])
def join_activity(activity_id):
    """参与活动"""
    try:
        data = request.get_json()
        user_address = data.get('user_address')
        
        if not user_address:
            return jsonify({"success": False, "error": "User address is required"}), 400
        
        if activity_id not in activities:
            return jsonify({"success": False, "error": "Activity not found"}), 404
        
        activity = activities[activity_id]
        
        # 检查活动状态
        if activity['status'] != 'active':
            return jsonify({"success": False, "error": "Activity is not active"}), 400
        
        # 检查是否已参与
        participants = activity_participants.get(activity_id, [])
        if any(p['user_address'] == user_address for p in participants):
            return jsonify({"success": False, "error": "Already joined this activity"}), 400
        
        # 检查参与人数限制
        if len(participants) >= activity['max_participants']:
            return jsonify({"success": False, "error": "Activity is full"}), 400
        
        # 添加参与者
        participant = {
            "user_address": user_address,
            "joined_at": datetime.now().isoformat(),
            "score": 0,
            "status": "active",
            "progress": {
                "tasks_completed": 0,
                "total_tasks": random.randint(3, 10),
                "current_rank": len(participants) + 1
            }
        }
        
        if activity_id not in activity_participants:
            activity_participants[activity_id] = []
        activity_participants[activity_id].append(participant)
        
        # 更新活动参与人数
        activities[activity_id]['current_participants'] = len(activity_participants[activity_id])
        
        return jsonify({
            "success": True,
            "data": {
                "message": "Successfully joined activity",
                "participant": participant
            }
        })
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@activity_management_bp.route('/activities/<activity_id>/leave', methods=['POST'])
def leave_activity(activity_id):
    """退出活动"""
    try:
        data = request.get_json()
        user_address = data.get('user_address')
        
        if not user_address:
            return jsonify({"success": False, "error": "User address is required"}), 400
        
        if activity_id not in activity_participants:
            return jsonify({"success": False, "error": "Not participating in this activity"}), 400
        
        participants = activity_participants[activity_id]
        participant_index = None
        
        for i, p in enumerate(participants):
            if p['user_address'] == user_address:
                participant_index = i
                break
        
        if participant_index is None:
            return jsonify({"success": False, "error": "Not participating in this activity"}), 400
        
        # 移除参与者
        removed_participant = participants.pop(participant_index)
        
        # 更新活动参与人数
        activities[activity_id]['current_participants'] = len(participants)
        
        return jsonify({
            "success": True,
            "data": {
                "message": "Successfully left activity",
                "participant": removed_participant
            }
        })
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@activity_management_bp.route('/activities/calendar', methods=['GET'])
def get_activity_calendar():
    """获取活动日历"""
    try:
        year = int(request.args.get('year', datetime.now().year))
        month = int(request.args.get('month', datetime.now().month))
        
        # 生成日历数据
        calendar_key = f"{year}-{month:02d}"
        
        if calendar_key not in activity_calendar:
            # 获取该月的所有活动
            start_date = datetime(year, month, 1)
            if month == 12:
                end_date = datetime(year + 1, 1, 1) - timedelta(days=1)
            else:
                end_date = datetime(year, month + 1, 1) - timedelta(days=1)
            
            monthly_activities = []
            for activity in activities.values():
                activity_start = datetime.fromisoformat(activity['start_time'])
                activity_end = datetime.fromisoformat(activity['end_time'])
                
                # 检查活动是否在该月内
                if (activity_start.date() <= end_date.date() and 
                    activity_end.date() >= start_date.date()):
                    monthly_activities.append({
                        "id": activity['id'],
                        "title": activity['title'],
                        "category": activity['category'],
                        "start_date": activity['start_time'],
                        "end_date": activity['end_time'],
                        "status": activity['status'],
                        "featured": activity['featured']
                    })
            
            activity_calendar[calendar_key] = {
                "year": year,
                "month": month,
                "activities": monthly_activities,
                "stats": {
                    "total_activities": len(monthly_activities),
                    "active_activities": len([a for a in monthly_activities if a['status'] == 'active']),
                    "upcoming_activities": len([a for a in monthly_activities if a['status'] == 'upcoming']),
                    "featured_activities": len([a for a in monthly_activities if a['featured']])
                }
            }
        
        return jsonify({
            "success": True,
            "data": activity_calendar[calendar_key]
        })
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@activity_management_bp.route('/activities/user/<user_address>', methods=['GET'])
def get_user_activities(user_address):
    """获取用户活动历史"""
    try:
        status = request.args.get('status', 'all')  # all, active, completed
        limit = int(request.args.get('limit', 20))
        offset = int(request.args.get('offset', 0))
        
        # 生成用户活动历史
        if user_address not in user_activity_history:
            user_activities = []
            
            # 从所有活动中找到用户参与的活动
            for activity_id, participants in activity_participants.items():
                for participant in participants:
                    if participant['user_address'] == user_address:
                        activity = activities[activity_id]
                        user_activities.append({
                            "activity_id": activity_id,
                            "title": activity['title'],
                            "category": activity['category'],
                            "status": activity['status'],
                            "joined_at": participant['joined_at'],
                            "score": participant['score'],
                            "rank": participant['progress']['current_rank'],
                            "rewards_earned": random.randint(0, 1000),
                            "completion_rate": participant['progress']['tasks_completed'] / participant['progress']['total_tasks'] * 100
                        })
            
            user_activity_history[user_address] = user_activities
        
        user_activities = user_activity_history[user_address]
        
        # 筛选
        if status != 'all':
            user_activities = [a for a in user_activities if a['status'] == status]
        
        # 分页
        total = len(user_activities)
        paginated_activities = user_activities[offset:offset + limit]
        
        # 计算用户统计
        stats = {
            "total_activities": len(user_activity_history.get(user_address, [])),
            "active_activities": len([a for a in user_activities if a['status'] == 'active']),
            "completed_activities": len([a for a in user_activities if a['status'] == 'ended']),
            "total_rewards": sum(a['rewards_earned'] for a in user_activities),
            "average_rank": sum(a['rank'] for a in user_activities) / len(user_activities) if user_activities else 0
        }
        
        return jsonify({
            "success": True,
            "data": {
                "activities": paginated_activities,
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

@activity_management_bp.route('/activities/create', methods=['POST'])
def create_activity():
    """创建活动（管理员功能）"""
    try:
        data = request.get_json()
        
        # 验证必需字段
        required_fields = ['title', 'description', 'category', 'start_time', 'end_time']
        for field in required_fields:
            if field not in data:
                return jsonify({"success": False, "error": f"Missing required field: {field}"}), 400
        
        activity_id = str(uuid.uuid4())
        
        activity = {
            "id": activity_id,
            "title": data['title'],
            "description": data['description'],
            "category": data['category'],
            "status": "upcoming",
            "start_time": data['start_time'],
            "end_time": data['end_time'],
            "created_by": data.get('created_by', 'admin'),
            "created_at": datetime.now().isoformat(),
            "max_participants": data.get('max_participants', 1000),
            "current_participants": 0,
            "rewards": data.get('rewards', {
                "type": "CFISH",
                "total_pool": 10000,
                "distribution": "top_10"
            }),
            "requirements": data.get('requirements', {
                "min_level": 1,
                "min_stake": 0,
                "whitelist_only": False,
                "kyc_required": True
            }),
            "rules": data.get('rules', []),
            "banner_image": data.get('banner_image', f"https://picsum.photos/800/400?random={len(activities)}"),
            "featured": data.get('featured', False),
            "tags": data.get('tags', [])
        }
        
        activities[activity_id] = activity
        
        return jsonify({
            "success": True,
            "data": {
                "message": "Activity created successfully",
                "activity": activity
            }
        })
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@activity_management_bp.route('/activities/<activity_id>/rewards', methods=['GET'])
def get_activity_rewards(activity_id):
    """获取活动奖励信息"""
    try:
        if activity_id not in activities:
            return jsonify({"success": False, "error": "Activity not found"}), 404
        
        activity = activities[activity_id]
        participants = activity_participants.get(activity_id, [])
        
        # 生成奖励分配信息
        rewards_info = {
            "activity_id": activity_id,
            "reward_pool": activity['rewards'],
            "distribution_rules": {
                "winner_takes_all": "第一名获得全部奖励",
                "top_10": "前10名平分奖励池",
                "all_participants": "所有参与者平分奖励池",
                "lottery": "随机抽取获奖者"
            }.get(activity['rewards']['distribution'], "未知分配规则"),
            "estimated_rewards": []
        }
        
        # 根据分配规则计算预估奖励
        total_pool = activity['rewards']['total_pool']
        participant_count = len(participants)
        
        if activity['rewards']['distribution'] == 'winner_takes_all':
            rewards_info['estimated_rewards'] = [
                {"rank": 1, "reward": total_pool}
            ]
        elif activity['rewards']['distribution'] == 'top_10':
            for i in range(min(10, participant_count)):
                reward = total_pool * (0.4 if i == 0 else 0.6 / 9) if i < 10 else 0
                rewards_info['estimated_rewards'].append({
                    "rank": i + 1,
                    "reward": int(reward)
                })
        elif activity['rewards']['distribution'] == 'all_participants':
            if participant_count > 0:
                reward_per_person = total_pool / participant_count
                rewards_info['estimated_rewards'] = [
                    {"rank": "all", "reward": int(reward_per_person)}
                ]
        
        return jsonify({
            "success": True,
            "data": rewards_info
        })
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

