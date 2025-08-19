from flask import Blueprint, jsonify, request
from datetime import datetime, timedelta
import random

staking_bp = Blueprint('staking', __name__)

@staking_bp.route('/staking/pools', methods=['GET'])
def get_staking_pools():
    """获取质押池列表"""
    pools = [
        {
            'id': 1,
            'name': 'CFISH Staking Pool',
            'token': 'CFISH',
            'apy': round(random.uniform(8.0, 25.0), 2),
            'total_staked': round(random.uniform(1000000, 10000000), 2),
            'min_stake': 100,
            'lock_period': 30,  # days
            'rewards_frequency': 'daily',
            'status': 'active',
            'description': 'Stake CFISH tokens to earn rewards and participate in governance'
        },
        {
            'id': 2,
            'name': 'SOL Staking Pool',
            'token': 'SOL',
            'apy': round(random.uniform(5.0, 15.0), 2),
            'total_staked': round(random.uniform(500000, 5000000), 2),
            'min_stake': 1,
            'lock_period': 0,  # flexible
            'rewards_frequency': 'epoch',
            'status': 'active',
            'description': 'Stake SOL tokens for network security and earn staking rewards'
        },
        {
            'id': 3,
            'name': 'LP Token Staking',
            'token': 'CFISH-SOL LP',
            'apy': round(random.uniform(15.0, 40.0), 2),
            'total_staked': round(random.uniform(100000, 1000000), 2),
            'min_stake': 0.1,
            'lock_period': 7,  # days
            'rewards_frequency': 'daily',
            'status': 'active',
            'description': 'Stake liquidity provider tokens for enhanced rewards'
        }
    ]
    
    return jsonify({
        'success': True,
        'data': pools
    })

@staking_bp.route('/staking/user/<wallet_address>', methods=['GET'])
def get_user_staking(wallet_address):
    """获取用户质押信息"""
    user_stakes = []
    
    for pool_id in [1, 2, 3]:
        if random.choice([True, False, False]):  # 33% chance of having stake in each pool
            stake = {
                'pool_id': pool_id,
                'pool_name': ['CFISH Staking Pool', 'SOL Staking Pool', 'LP Token Staking'][pool_id - 1],
                'token': ['CFISH', 'SOL', 'CFISH-SOL LP'][pool_id - 1],
                'staked_amount': round(random.uniform(100, 10000), 2),
                'rewards_earned': round(random.uniform(10, 1000), 2),
                'pending_rewards': round(random.uniform(1, 100), 2),
                'stake_date': (datetime.now() - timedelta(days=random.randint(1, 365))).isoformat(),
                'unlock_date': (datetime.now() + timedelta(days=random.randint(1, 30))).isoformat() if pool_id != 2 else None,
                'apy': round(random.uniform(8.0, 25.0), 2),
                'status': 'active'
            }
            user_stakes.append(stake)
    
    total_staked_value = sum(stake['staked_amount'] for stake in user_stakes)
    total_rewards = sum(stake['rewards_earned'] for stake in user_stakes)
    
    return jsonify({
        'success': True,
        'data': {
            'wallet_address': wallet_address,
            'stakes': user_stakes,
            'summary': {
                'total_staked_value': round(total_staked_value, 2),
                'total_rewards_earned': round(total_rewards, 2),
                'active_stakes': len(user_stakes),
                'estimated_yearly_rewards': round(total_staked_value * 0.15, 2)  # 15% average APY
            }
        }
    })

@staking_bp.route('/staking/stake', methods=['POST'])
def stake_tokens():
    """质押代币"""
    data = request.get_json()
    
    required_fields = ['wallet_address', 'pool_id', 'amount']
    for field in required_fields:
        if field not in data:
            return jsonify({
                'success': False,
                'error': f'Missing required field: {field}'
            }), 400
    
    stake_id = f'stake_{random.randint(100000, 999999)}'
    
    return jsonify({
        'success': True,
        'message': 'Tokens staked successfully',
        'data': {
            'stake_id': stake_id,
            'wallet_address': data['wallet_address'],
            'pool_id': data['pool_id'],
            'amount': data['amount'],
            'transaction_hash': f'tx_{random.randint(10000000, 99999999)}',
            'stake_date': datetime.now().isoformat(),
            'status': 'confirmed'
        }
    })

@staking_bp.route('/staking/unstake', methods=['POST'])
def unstake_tokens():
    """取消质押代币"""
    data = request.get_json()
    
    required_fields = ['wallet_address', 'stake_id']
    for field in required_fields:
        if field not in data:
            return jsonify({
                'success': False,
                'error': f'Missing required field: {field}'
            }), 400
    
    return jsonify({
        'success': True,
        'message': 'Unstaking initiated successfully',
        'data': {
            'stake_id': data['stake_id'],
            'wallet_address': data['wallet_address'],
            'unstake_amount': round(random.uniform(100, 10000), 2),
            'transaction_hash': f'tx_{random.randint(10000000, 99999999)}',
            'unstake_date': datetime.now().isoformat(),
            'unlock_date': (datetime.now() + timedelta(days=7)).isoformat(),
            'status': 'pending'
        }
    })

@staking_bp.route('/staking/claim-rewards', methods=['POST'])
def claim_rewards():
    """领取质押奖励"""
    data = request.get_json()
    
    required_fields = ['wallet_address', 'pool_id']
    for field in required_fields:
        if field not in data:
            return jsonify({
                'success': False,
                'error': f'Missing required field: {field}'
            }), 400
    
    rewards_amount = round(random.uniform(1, 100), 4)
    
    return jsonify({
        'success': True,
        'message': 'Rewards claimed successfully',
        'data': {
            'wallet_address': data['wallet_address'],
            'pool_id': data['pool_id'],
            'rewards_amount': rewards_amount,
            'transaction_hash': f'tx_{random.randint(10000000, 99999999)}',
            'claim_date': datetime.now().isoformat(),
            'status': 'confirmed'
        }
    })

@staking_bp.route('/staking/rewards-history/<wallet_address>', methods=['GET'])
def get_rewards_history(wallet_address):
    """获取奖励历史"""
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 20))
    
    total_records = random.randint(50, 200)
    rewards = []
    
    for i in range((page - 1) * limit, min(page * limit, total_records)):
        reward = {
            'id': f'reward_{random.randint(100000, 999999)}',
            'pool_id': random.randint(1, 3),
            'pool_name': random.choice(['CFISH Staking Pool', 'SOL Staking Pool', 'LP Token Staking']),
            'token': random.choice(['CFISH', 'SOL']),
            'amount': round(random.uniform(0.1, 50.0), 4),
            'type': random.choice(['daily_reward', 'epoch_reward', 'bonus_reward']),
            'date': (datetime.now() - timedelta(days=random.randint(1, 365))).isoformat(),
            'transaction_hash': f'tx_{random.randint(10000000, 99999999)}',
            'status': 'confirmed'
        }
        rewards.append(reward)
    
    return jsonify({
        'success': True,
        'data': {
            'rewards': rewards[:limit],
            'pagination': {
                'page': page,
                'limit': limit,
                'total': total_records,
                'pages': (total_records + limit - 1) // limit
            }
        }
    })

