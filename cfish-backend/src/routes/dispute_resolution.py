"""
争议解决 (Dispute Resolution) API 路由
提供争议提交、证据管理、调解系统和解决方案功能
"""

from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
import uuid
import random

dispute_resolution_bp = Blueprint('dispute_resolution', __name__)

# 模拟数据存储
disputes = {}             # 争议案例
dispute_evidence = {}     # 争议证据
dispute_messages = {}     # 争议沟通记录
mediators = {}           # 调解员信息
dispute_analytics = {}   # 争议分析数据

@dispute_resolution_bp.route('/disputes', methods=['GET'])
def get_disputes():
    """获取争议列表"""
    try:
        status = request.args.get('status', 'all')  # all, open, in_progress, resolved, closed
        category = request.args.get('category', 'all')  # all, transaction, quality, delivery, fraud, other
        priority = request.args.get('priority', 'all')  # all, low, medium, high, critical
        user_address = request.args.get('user_address')  # 筛选特定用户的争议
        limit = int(request.args.get('limit', 20))
        offset = int(request.args.get('offset', 0))
        
        # 生成模拟争议数据
        if not disputes:
            categories = [
                {"type": "transaction", "name": "交易争议", "description": "NFT交易过程中的问题"},
                {"type": "quality", "name": "质量争议", "description": "NFT质量与描述不符"},
                {"type": "delivery", "name": "交付争议", "description": "NFT未按时交付或丢失"},
                {"type": "fraud", "name": "欺诈争议", "description": "涉嫌欺诈行为"},
                {"type": "copyright", "name": "版权争议", "description": "版权侵权问题"},
                {"type": "other", "name": "其他争议", "description": "其他类型的争议"}
            ]
            
            priorities = ['low', 'medium', 'high', 'critical']
            statuses = ['open', 'in_progress', 'resolved', 'closed']
            
            for i in range(60):
                dispute_id = f"dispute_{i+1}"
                category_info = random.choice(categories)
                
                created_time = datetime.now() - timedelta(days=random.randint(0, 90))
                
                disputes[dispute_id] = {
                    "id": dispute_id,
                    "case_number": f"CASE-{2024}-{i+1:04d}",
                    "title": f"{category_info['name']} - Case #{i+1}",
                    "description": f"Dispute regarding {category_info['description'].lower()}",
                    "category": category_info['type'],
                    "category_name": category_info['name'],
                    "status": random.choice(statuses),
                    "priority": random.choice(priorities),
                    "created_at": created_time.isoformat(),
                    "updated_at": (created_time + timedelta(days=random.randint(0, 30))).isoformat(),
                    "parties": {
                        "complainant": {
                            "address": f"user_{random.randint(1, 100)}",
                            "username": f"User{random.randint(1, 100)}",
                            "reputation": random.randint(50, 100),
                            "verified": random.choice([True, False])
                        },
                        "respondent": {
                            "address": f"user_{random.randint(101, 200)}",
                            "username": f"User{random.randint(101, 200)}",
                            "reputation": random.randint(30, 95),
                            "verified": random.choice([True, False])
                        }
                    },
                    "transaction": {
                        "id": f"tx_{random.randint(1000, 9999)}",
                        "nft_id": f"nft_{random.randint(1, 1000)}",
                        "nft_name": f"NFT #{random.randint(1, 1000)}",
                        "amount": random.randint(100, 5000),
                        "currency": random.choice(['SOL', 'CFISH']),
                        "transaction_hash": f"hash_{random.randint(100000, 999999)}",
                        "timestamp": (created_time - timedelta(days=random.randint(1, 7))).isoformat()
                    },
                    "mediator": {
                        "id": f"mediator_{random.randint(1, 10)}",
                        "name": f"Mediator {random.randint(1, 10)}",
                        "specialization": category_info['type'],
                        "experience_years": random.randint(2, 10),
                        "success_rate": random.randint(80, 98),
                        "assigned_at": (created_time + timedelta(hours=random.randint(1, 48))).isoformat() if random.choice([True, False]) else None
                    },
                    "timeline": {
                        "response_deadline": (created_time + timedelta(days=7)).isoformat(),
                        "mediation_deadline": (created_time + timedelta(days=21)).isoformat(),
                        "final_deadline": (created_time + timedelta(days=30)).isoformat(),
                        "estimated_resolution": f"{random.randint(3, 21)} days"
                    },
                    "evidence_count": random.randint(0, 10),
                    "message_count": random.randint(0, 50),
                    "resolution": {
                        "outcome": random.choice(['pending', 'complainant_favor', 'respondent_favor', 'mutual_agreement', 'dismissed']) if random.choice([True, False]) else None,
                        "compensation": random.randint(0, 2000) if random.choice([True, False]) else None,
                        "resolution_date": None,
                        "resolution_details": ""
                    },
                    "tags": random.sample(['urgent', 'complex', 'fraud_suspected', 'high_value', 'repeat_offender'], random.randint(0, 3))
                }
        
        # 筛选争议
        filtered_disputes = list(disputes.values())
        
        if status != 'all':
            filtered_disputes = [d for d in filtered_disputes if d['status'] == status]
        
        if category != 'all':
            filtered_disputes = [d for d in filtered_disputes if d['category'] == category]
        
        if priority != 'all':
            filtered_disputes = [d for d in filtered_disputes if d['priority'] == priority]
        
        if user_address:
            filtered_disputes = [d for d in filtered_disputes 
                               if (d['parties']['complainant']['address'] == user_address or 
                                   d['parties']['respondent']['address'] == user_address)]
        
        # 排序：优先级高的在前，然后按创建时间排序
        priority_order = {'critical': 4, 'high': 3, 'medium': 2, 'low': 1}
        filtered_disputes.sort(key=lambda x: (-priority_order.get(x['priority'], 0), x['created_at']))
        
        # 分页
        total = len(filtered_disputes)
        paginated_disputes = filtered_disputes[offset:offset + limit]
        
        return jsonify({
            "success": True,
            "data": {
                "disputes": paginated_disputes,
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

@dispute_resolution_bp.route('/disputes/<dispute_id>', methods=['GET'])
def get_dispute_detail(dispute_id):
    """获取争议详情"""
    try:
        if dispute_id not in disputes:
            return jsonify({"success": False, "error": "Dispute not found"}), 404
        
        dispute = disputes[dispute_id]
        
        # 获取证据
        evidence = dispute_evidence.get(dispute_id, [])
        
        # 获取沟通记录
        messages = dispute_messages.get(dispute_id, [])
        
        # 计算进度
        current_time = datetime.now()
        created_time = datetime.fromisoformat(dispute['created_at'])
        final_deadline = datetime.fromisoformat(dispute['timeline']['final_deadline'])
        
        days_elapsed = (current_time - created_time).days
        total_days = (final_deadline - created_time).days
        progress_percentage = min(100, (days_elapsed / max(1, total_days)) * 100)
        
        return jsonify({
            "success": True,
            "data": {
                **dispute,
                "evidence": evidence,
                "messages": messages[-20:],  # 最近20条消息
                "progress": {
                    "percentage": progress_percentage,
                    "days_elapsed": days_elapsed,
                    "days_remaining": max(0, (final_deadline - current_time).days),
                    "is_overdue": current_time > final_deadline,
                    "next_milestone": "Awaiting respondent reply" if dispute['status'] == 'open' else "Under mediation"
                }
            }
        })
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@dispute_resolution_bp.route('/disputes', methods=['POST'])
def create_dispute():
    """提交争议"""
    try:
        data = request.get_json()
        
        # 验证必需字段
        required_fields = ['complainant_address', 'respondent_address', 'category', 'title', 'description', 'transaction_id']
        for field in required_fields:
            if field not in data:
                return jsonify({"success": False, "error": f"Missing required field: {field}"}), 400
        
        dispute_id = str(uuid.uuid4())
        case_number = f"CASE-{datetime.now().year}-{len(disputes)+1:04d}"
        
        created_time = datetime.now()
        
        dispute = {
            "id": dispute_id,
            "case_number": case_number,
            "title": data['title'],
            "description": data['description'],
            "category": data['category'],
            "category_name": {
                "transaction": "交易争议",
                "quality": "质量争议",
                "delivery": "交付争议",
                "fraud": "欺诈争议",
                "copyright": "版权争议",
                "other": "其他争议"
            }.get(data['category'], "未知类型"),
            "status": "open",
            "priority": data.get('priority', 'medium'),
            "created_at": created_time.isoformat(),
            "updated_at": created_time.isoformat(),
            "parties": {
                "complainant": {
                    "address": data['complainant_address'],
                    "username": data.get('complainant_username', ''),
                    "reputation": data.get('complainant_reputation', 0),
                    "verified": data.get('complainant_verified', False)
                },
                "respondent": {
                    "address": data['respondent_address'],
                    "username": data.get('respondent_username', ''),
                    "reputation": data.get('respondent_reputation', 0),
                    "verified": data.get('respondent_verified', False)
                }
            },
            "transaction": {
                "id": data['transaction_id'],
                "nft_id": data.get('nft_id', ''),
                "nft_name": data.get('nft_name', ''),
                "amount": data.get('transaction_amount', 0),
                "currency": data.get('currency', 'CFISH'),
                "transaction_hash": data.get('transaction_hash', ''),
                "timestamp": data.get('transaction_timestamp', created_time.isoformat())
            },
            "mediator": {
                "id": None,
                "name": None,
                "specialization": None,
                "experience_years": None,
                "success_rate": None,
                "assigned_at": None
            },
            "timeline": {
                "response_deadline": (created_time + timedelta(days=7)).isoformat(),
                "mediation_deadline": (created_time + timedelta(days=21)).isoformat(),
                "final_deadline": (created_time + timedelta(days=30)).isoformat(),
                "estimated_resolution": "7-21 days"
            },
            "evidence_count": 0,
            "message_count": 0,
            "resolution": {
                "outcome": None,
                "compensation": None,
                "resolution_date": None,
                "resolution_details": ""
            },
            "tags": data.get('tags', [])
        }
        
        disputes[dispute_id] = dispute
        
        # 自动分配调解员（高优先级争议）
        if dispute['priority'] in ['high', 'critical']:
            assign_mediator(dispute_id)
        
        return jsonify({
            "success": True,
            "data": {
                "message": "Dispute created successfully",
                "dispute": dispute
            }
        })
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@dispute_resolution_bp.route('/disputes/<dispute_id>/evidence', methods=['POST'])
def submit_evidence(dispute_id):
    """提交证据"""
    try:
        data = request.get_json()
        
        if dispute_id not in disputes:
            return jsonify({"success": False, "error": "Dispute not found"}), 404
        
        required_fields = ['submitter_address', 'evidence_type', 'title', 'description']
        for field in required_fields:
            if field not in data:
                return jsonify({"success": False, "error": f"Missing required field: {field}"}), 400
        
        evidence_id = str(uuid.uuid4())
        
        evidence = {
            "id": evidence_id,
            "dispute_id": dispute_id,
            "submitter_address": data['submitter_address'],
            "evidence_type": data['evidence_type'],  # document, image, video, transaction, communication
            "title": data['title'],
            "description": data['description'],
            "files": data.get('files', []),
            "metadata": data.get('metadata', {}),
            "submitted_at": datetime.now().isoformat(),
            "verified": False,
            "verification_notes": "",
            "relevance_score": random.randint(70, 100),
            "public_visibility": data.get('public_visibility', True)
        }
        
        if dispute_id not in dispute_evidence:
            dispute_evidence[dispute_id] = []
        dispute_evidence[dispute_id].append(evidence)
        
        # 更新争议的证据计数
        disputes[dispute_id]['evidence_count'] += 1
        disputes[dispute_id]['updated_at'] = datetime.now().isoformat()
        
        return jsonify({
            "success": True,
            "data": {
                "message": "Evidence submitted successfully",
                "evidence": evidence
            }
        })
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@dispute_resolution_bp.route('/disputes/<dispute_id>/messages', methods=['POST'])
def send_message(dispute_id):
    """发送争议沟通消息"""
    try:
        data = request.get_json()
        
        if dispute_id not in disputes:
            return jsonify({"success": False, "error": "Dispute not found"}), 404
        
        required_fields = ['sender_address', 'message']
        for field in required_fields:
            if field not in data:
                return jsonify({"success": False, "error": f"Missing required field: {field}"}), 400
        
        message_id = str(uuid.uuid4())
        
        message = {
            "id": message_id,
            "dispute_id": dispute_id,
            "sender_address": data['sender_address'],
            "sender_role": data.get('sender_role', 'party'),  # party, mediator, admin
            "message": data['message'],
            "message_type": data.get('message_type', 'text'),  # text, proposal, decision, system
            "timestamp": datetime.now().isoformat(),
            "attachments": data.get('attachments', []),
            "is_private": data.get('is_private', False),
            "read_by": [data['sender_address']],
            "reply_to": data.get('reply_to')  # 回复特定消息的ID
        }
        
        if dispute_id not in dispute_messages:
            dispute_messages[dispute_id] = []
        dispute_messages[dispute_id].append(message)
        
        # 更新争议的消息计数
        disputes[dispute_id]['message_count'] += 1
        disputes[dispute_id]['updated_at'] = datetime.now().isoformat()
        
        return jsonify({
            "success": True,
            "data": {
                "message": "Message sent successfully",
                "message_data": message
            }
        })
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@dispute_resolution_bp.route('/disputes/<dispute_id>/assign-mediator', methods=['POST'])
def assign_mediator_to_dispute(dispute_id):
    """分配调解员"""
    try:
        data = request.get_json()
        
        if dispute_id not in disputes:
            return jsonify({"success": False, "error": "Dispute not found"}), 404
        
        dispute = disputes[dispute_id]
        
        # 如果已有调解员，不能重复分配
        if dispute['mediator']['id']:
            return jsonify({"success": False, "error": "Mediator already assigned"}), 400
        
        mediator_id = data.get('mediator_id')
        if not mediator_id:
            # 自动分配最适合的调解员
            mediator_id = f"mediator_{random.randint(1, 10)}"
        
        # 分配调解员
        assign_mediator(dispute_id, mediator_id)
        
        return jsonify({
            "success": True,
            "data": {
                "message": "Mediator assigned successfully",
                "dispute": disputes[dispute_id]
            }
        })
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@dispute_resolution_bp.route('/disputes/<dispute_id>/resolve', methods=['POST'])
def resolve_dispute(dispute_id):
    """解决争议"""
    try:
        data = request.get_json()
        
        if dispute_id not in disputes:
            return jsonify({"success": False, "error": "Dispute not found"}), 404
        
        dispute = disputes[dispute_id]
        
        required_fields = ['resolver_address', 'outcome', 'resolution_details']
        for field in required_fields:
            if field not in data:
                return jsonify({"success": False, "error": f"Missing required field: {field}"}), 400
        
        # 更新争议解决信息
        dispute['status'] = 'resolved'
        dispute['resolution'] = {
            "outcome": data['outcome'],  # complainant_favor, respondent_favor, mutual_agreement, dismissed
            "compensation": data.get('compensation', 0),
            "resolution_date": datetime.now().isoformat(),
            "resolution_details": data['resolution_details'],
            "resolver_address": data['resolver_address'],
            "resolver_role": data.get('resolver_role', 'mediator')
        }
        dispute['updated_at'] = datetime.now().isoformat()
        
        # 添加系统消息
        resolution_message = {
            "id": str(uuid.uuid4()),
            "dispute_id": dispute_id,
            "sender_address": "system",
            "sender_role": "system",
            "message": f"Dispute resolved: {data['outcome']}. {data['resolution_details']}",
            "message_type": "decision",
            "timestamp": datetime.now().isoformat(),
            "attachments": [],
            "is_private": False,
            "read_by": ["system"]
        }
        
        if dispute_id not in dispute_messages:
            dispute_messages[dispute_id] = []
        dispute_messages[dispute_id].append(resolution_message)
        
        return jsonify({
            "success": True,
            "data": {
                "message": "Dispute resolved successfully",
                "dispute": dispute
            }
        })
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@dispute_resolution_bp.route('/mediators', methods=['GET'])
def get_mediators():
    """获取调解员列表"""
    try:
        specialization = request.args.get('specialization', 'all')
        available_only = request.args.get('available_only', 'false').lower() == 'true'
        
        # 生成调解员数据
        if not mediators:
            specializations = ['transaction', 'quality', 'delivery', 'fraud', 'copyright', 'general']
            
            for i in range(20):
                mediator_id = f"mediator_{i+1}"
                mediators[mediator_id] = {
                    "id": mediator_id,
                    "name": f"Mediator {i+1}",
                    "username": f"mediator{i+1}",
                    "specialization": random.choice(specializations),
                    "experience_years": random.randint(2, 15),
                    "success_rate": random.randint(75, 98),
                    "total_cases": random.randint(50, 500),
                    "active_cases": random.randint(0, 10),
                    "max_cases": random.randint(15, 25),
                    "languages": random.sample(['English', 'Chinese', 'Spanish', 'French', 'German'], random.randint(1, 3)),
                    "timezone": random.choice(['UTC', 'UTC+8', 'UTC-5', 'UTC+1']),
                    "rating": random.randint(40, 50) / 10,  # 4.0-5.0
                    "bio": f"Experienced mediator specializing in {random.choice(specializations)} disputes",
                    "available": random.choice([True, False]),
                    "hourly_rate": random.randint(50, 200),
                    "certifications": random.sample(['Certified Mediator', 'Blockchain Expert', 'Legal Professional'], random.randint(1, 2))
                }
        
        # 筛选调解员
        filtered_mediators = list(mediators.values())
        
        if specialization != 'all':
            filtered_mediators = [m for m in filtered_mediators if m['specialization'] == specialization]
        
        if available_only:
            filtered_mediators = [m for m in filtered_mediators if m['available'] and m['active_cases'] < m['max_cases']]
        
        # 排序：按成功率和评分排序
        filtered_mediators.sort(key=lambda x: (-x['success_rate'], -x['rating']))
        
        return jsonify({
            "success": True,
            "data": {
                "mediators": filtered_mediators
            }
        })
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@dispute_resolution_bp.route('/disputes/analytics', methods=['GET'])
def get_dispute_analytics():
    """获取争议分析数据"""
    try:
        period = request.args.get('period', '30d')  # 7d, 30d, 90d, 1y
        
        # 计算分析数据
        total_disputes = len(disputes)
        open_disputes = len([d for d in disputes.values() if d['status'] == 'open'])
        resolved_disputes = len([d for d in disputes.values() if d['status'] == 'resolved'])
        
        resolution_rate = (resolved_disputes / max(1, total_disputes)) * 100
        
        # 计算平均解决时间
        resolved_cases = [d for d in disputes.values() if d['status'] == 'resolved' and d['resolution']['resolution_date']]
        avg_resolution_days = 0
        if resolved_cases:
            total_days = 0
            for case in resolved_cases:
                created = datetime.fromisoformat(case['created_at'])
                resolved = datetime.fromisoformat(case['resolution']['resolution_date'])
                total_days += (resolved - created).days
            avg_resolution_days = total_days / len(resolved_cases)
        
        analytics = {
            "period": period,
            "overview": {
                "total_disputes": total_disputes,
                "open_disputes": open_disputes,
                "in_progress_disputes": len([d for d in disputes.values() if d['status'] == 'in_progress']),
                "resolved_disputes": resolved_disputes,
                "resolution_rate": resolution_rate,
                "average_resolution_days": avg_resolution_days
            },
            "categories": [
                {"category": "transaction", "name": "交易争议", "count": len([d for d in disputes.values() if d['category'] == 'transaction'])},
                {"category": "quality", "name": "质量争议", "count": len([d for d in disputes.values() if d['category'] == 'quality'])},
                {"category": "delivery", "name": "交付争议", "count": len([d for d in disputes.values() if d['category'] == 'delivery'])},
                {"category": "fraud", "name": "欺诈争议", "count": len([d for d in disputes.values() if d['category'] == 'fraud'])},
                {"category": "copyright", "name": "版权争议", "count": len([d for d in disputes.values() if d['category'] == 'copyright'])},
                {"category": "other", "name": "其他争议", "count": len([d for d in disputes.values() if d['category'] == 'other'])}
            ],
            "priority_distribution": {
                "critical": len([d for d in disputes.values() if d['priority'] == 'critical']),
                "high": len([d for d in disputes.values() if d['priority'] == 'high']),
                "medium": len([d for d in disputes.values() if d['priority'] == 'medium']),
                "low": len([d for d in disputes.values() if d['priority'] == 'low'])
            },
            "resolution_outcomes": {
                "complainant_favor": len([d for d in disputes.values() if d.get('resolution', {}).get('outcome') == 'complainant_favor']),
                "respondent_favor": len([d for d in disputes.values() if d.get('resolution', {}).get('outcome') == 'respondent_favor']),
                "mutual_agreement": len([d for d in disputes.values() if d.get('resolution', {}).get('outcome') == 'mutual_agreement']),
                "dismissed": len([d for d in disputes.values() if d.get('resolution', {}).get('outcome') == 'dismissed'])
            },
            "mediator_performance": [
                {
                    "mediator_id": f"mediator_{i+1}",
                    "name": f"Mediator {i+1}",
                    "cases_handled": random.randint(10, 50),
                    "success_rate": random.randint(80, 98),
                    "avg_resolution_days": random.randint(5, 20)
                }
                for i in range(5)
            ],
            "monthly_trends": [
                {
                    "month": (datetime.now() - timedelta(days=30*i)).strftime("%Y-%m"),
                    "new_disputes": random.randint(10, 50),
                    "resolved_disputes": random.randint(8, 45),
                    "resolution_rate": random.randint(70, 95)
                }
                for i in range(6)
            ]
        }
        
        return jsonify({
            "success": True,
            "data": analytics
        })
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

def assign_mediator(dispute_id, mediator_id=None):
    """分配调解员的辅助函数"""
    if dispute_id not in disputes:
        return False
    
    dispute = disputes[dispute_id]
    
    # 如果没有指定调解员，自动选择最合适的
    if not mediator_id:
        available_mediators = [m for m in mediators.values() 
                             if m['available'] and m['active_cases'] < m['max_cases']]
        
        # 优先选择专业对口的调解员
        specialized_mediators = [m for m in available_mediators 
                               if m['specialization'] == dispute['category']]
        
        if specialized_mediators:
            # 选择成功率最高的专业调解员
            mediator = max(specialized_mediators, key=lambda x: x['success_rate'])
            mediator_id = mediator['id']
        elif available_mediators:
            # 选择成功率最高的通用调解员
            mediator = max(available_mediators, key=lambda x: x['success_rate'])
            mediator_id = mediator['id']
        else:
            return False
    
    if mediator_id in mediators:
        mediator = mediators[mediator_id]
        dispute['mediator'] = {
            "id": mediator_id,
            "name": mediator['name'],
            "specialization": mediator['specialization'],
            "experience_years": mediator['experience_years'],
            "success_rate": mediator['success_rate'],
            "assigned_at": datetime.now().isoformat()
        }
        dispute['status'] = 'in_progress'
        dispute['updated_at'] = datetime.now().isoformat()
        
        # 更新调解员的活跃案例数
        mediators[mediator_id]['active_cases'] += 1
        
        return True
    
    return False

