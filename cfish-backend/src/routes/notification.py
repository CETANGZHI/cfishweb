from flask import Blueprint, jsonify, request
from datetime import datetime, timedelta
import random

notification_bp = Blueprint('notification', __name__)

def generate_mock_notification():
    notification_types = [
        'nft_sold', 'nft_purchased', 'bid_received', 'offer_received',
        'auction_won', 'auction_ended', 'price_alert', 'follow_new',
        'collection_update', 'system_update', 'reward_earned', 'stake_reward'
    ]
    
    type_templates = {
        'nft_sold': {
            'title': 'NFT Sold!',
            'message': 'Your NFT "{nft_name}" has been sold for {price} {currency}',
            'icon': 'sale'
        },
        'nft_purchased': {
            'title': 'NFT Purchased',
            'message': 'You successfully purchased "{nft_name}" for {price} {currency}',
            'icon': 'purchase'
        },
        'bid_received': {
            'title': 'New Bid Received',
            'message': 'You received a bid of {price} {currency} on "{nft_name}"',
            'icon': 'bid'
        },
        'offer_received': {
            'title': 'New Offer',
            'message': 'You received an offer of {price} {currency} on "{nft_name}"',
            'icon': 'offer'
        },
        'auction_won': {
            'title': 'Auction Won!',
            'message': 'Congratulations! You won the auction for "{nft_name}"',
            'icon': 'trophy'
        },
        'auction_ended': {
            'title': 'Auction Ended',
            'message': 'The auction for "{nft_name}" has ended',
            'icon': 'clock'
        },
        'price_alert': {
            'title': 'Price Alert',
            'message': '"{nft_name}" is now available for {price} {currency}',
            'icon': 'alert'
        },
        'follow_new': {
            'title': 'New Follower',
            'message': '{username} started following you',
            'icon': 'user'
        },
        'collection_update': {
            'title': 'Collection Update',
            'message': 'New items added to "{collection_name}" collection',
            'icon': 'collection'
        },
        'system_update': {
            'title': 'System Update',
            'message': 'CFish platform has been updated with new features',
            'icon': 'system'
        },
        'reward_earned': {
            'title': 'Reward Earned',
            'message': 'You earned {amount} {currency} in staking rewards',
            'icon': 'reward'
        },
        'stake_reward': {
            'title': 'Staking Reward',
            'message': 'Your staking reward of {amount} {currency} is ready to claim',
            'icon': 'stake'
        }
    }
    
    notification_type = random.choice(notification_types)
    template = type_templates[notification_type]
    
    # Generate dynamic content
    nft_name = f'Amazing NFT #{random.randint(1, 10000)}'
    collection_name = f'Collection #{random.randint(1, 100)}'
    username = f'User{random.randint(1000, 9999)}'
    price = round(random.uniform(0.1, 50.0), 2)
    currency = random.choice(['SOL', 'CFISH'])
    amount = round(random.uniform(1, 100), 2)
    
    message = template['message'].format(
        nft_name=nft_name,
        collection_name=collection_name,
        username=username,
        price=price,
        currency=currency,
        amount=amount
    )
    
    return {
        'id': f'notif_{random.randint(100000, 999999)}',
        'type': notification_type,
        'title': template['title'],
        'message': message,
        'icon': template['icon'],
        'is_read': random.choice([True, False]),
        'priority': random.choice(['low', 'medium', 'high']),
        'created_at': (datetime.now() - timedelta(hours=random.randint(1, 168))).isoformat(),
        'data': {
            'nft_id': random.randint(1, 10000) if 'nft' in notification_type else None,
            'collection_id': random.randint(1, 100) if 'collection' in notification_type else None,
            'user_id': random.randint(1, 10000) if 'follow' in notification_type else None,
            'transaction_hash': f'tx_{random.randint(10000000, 99999999)}' if notification_type in ['nft_sold', 'nft_purchased', 'reward_earned'] else None
        }
    }

@notification_bp.route('/notifications/<wallet_address>', methods=['GET'])
def get_notifications(wallet_address):
    """获取用户通知列表"""
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 20))
    is_read = request.args.get('is_read')  # 'true', 'false', or None for all
    notification_type = request.args.get('type')
    
    total_notifications = random.randint(50, 500)
    notifications = []
    
    for i in range((page - 1) * limit, min(page * limit, total_notifications)):
        notification = generate_mock_notification()
        
        # Apply filters
        if is_read is not None:
            if is_read.lower() == 'true' and not notification['is_read']:
                continue
            elif is_read.lower() == 'false' and notification['is_read']:
                continue
        
        if notification_type and notification['type'] != notification_type:
            continue
        
        notifications.append(notification)
    
    unread_count = sum(1 for n in notifications if not n['is_read'])
    
    return jsonify({
        'success': True,
        'data': {
            'notifications': notifications[:limit],
            'unread_count': unread_count,
            'pagination': {
                'page': page,
                'limit': limit,
                'total': total_notifications,
                'pages': (total_notifications + limit - 1) // limit
            }
        }
    })

@notification_bp.route('/notifications/<notification_id>/read', methods=['POST'])
def mark_notification_read(notification_id):
    """标记通知为已读"""
    return jsonify({
        'success': True,
        'message': 'Notification marked as read',
        'data': {
            'notification_id': notification_id,
            'is_read': True,
            'read_at': datetime.now().isoformat()
        }
    })

@notification_bp.route('/notifications/<wallet_address>/mark-all-read', methods=['POST'])
def mark_all_notifications_read(wallet_address):
    """标记所有通知为已读"""
    return jsonify({
        'success': True,
        'message': 'All notifications marked as read',
        'data': {
            'wallet_address': wallet_address,
            'marked_count': random.randint(5, 50),
            'marked_at': datetime.now().isoformat()
        }
    })

@notification_bp.route('/notifications/<notification_id>', methods=['DELETE'])
def delete_notification(notification_id):
    """删除通知"""
    return jsonify({
        'success': True,
        'message': 'Notification deleted successfully',
        'data': {
            'notification_id': notification_id,
            'deleted_at': datetime.now().isoformat()
        }
    })

@notification_bp.route('/notifications/<wallet_address>/settings', methods=['GET'])
def get_notification_settings(wallet_address):
    """获取通知设置"""
    return jsonify({
        'success': True,
        'data': {
            'wallet_address': wallet_address,
            'settings': {
                'email_notifications': random.choice([True, False]),
                'push_notifications': random.choice([True, False]),
                'sms_notifications': random.choice([True, False]),
                'notification_types': {
                    'nft_activity': random.choice([True, False]),
                    'auction_updates': random.choice([True, False]),
                    'price_alerts': random.choice([True, False]),
                    'social_activity': random.choice([True, False]),
                    'system_updates': random.choice([True, False]),
                    'staking_rewards': random.choice([True, False])
                },
                'frequency': random.choice(['instant', 'hourly', 'daily', 'weekly']),
                'quiet_hours': {
                    'enabled': random.choice([True, False]),
                    'start_time': '22:00',
                    'end_time': '08:00'
                }
            }
        }
    })

@notification_bp.route('/notifications/<wallet_address>/settings', methods=['PUT'])
def update_notification_settings(wallet_address):
    """更新通知设置"""
    data = request.get_json()
    
    return jsonify({
        'success': True,
        'message': 'Notification settings updated successfully',
        'data': {
            'wallet_address': wallet_address,
            'updated_settings': data,
            'updated_at': datetime.now().isoformat()
        }
    })

@notification_bp.route('/notifications/send', methods=['POST'])
def send_notification():
    """发送通知（管理员功能）"""
    data = request.get_json()
    
    required_fields = ['recipient', 'type', 'title', 'message']
    for field in required_fields:
        if field not in data:
            return jsonify({
                'success': False,
                'error': f'Missing required field: {field}'
            }), 400
    
    notification_id = f'notif_{random.randint(100000, 999999)}'
    
    return jsonify({
        'success': True,
        'message': 'Notification sent successfully',
        'data': {
            'notification_id': notification_id,
            'recipient': data['recipient'],
            'type': data['type'],
            'title': data['title'],
            'message': data['message'],
            'sent_at': datetime.now().isoformat(),
            'status': 'delivered'
        }
    })

