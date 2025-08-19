from flask import Blueprint, jsonify, request
from datetime import datetime, timedelta
import random

wallet_bp = Blueprint('wallet', __name__)

@wallet_bp.route('/wallet/balance/<wallet_address>', methods=['GET'])
def get_wallet_balance(wallet_address):
    """获取钱包余额"""
    return jsonify({
        'success': True,
        'data': {
            'wallet_address': wallet_address,
            'balances': {
                'SOL': round(random.uniform(0.1, 100.0), 4),
                'CFISH': round(random.uniform(100, 10000), 2)
            },
            'usd_value': round(random.uniform(50, 5000), 2),
            'last_updated': datetime.now().isoformat()
        }
    })

@wallet_bp.route('/wallet/nfts/<wallet_address>', methods=['GET'])
def get_wallet_nfts(wallet_address):
    """获取钱包中的NFT"""
    from src.routes.nft import generate_mock_nft
    
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 20))
    
    # 生成钱包中的NFT
    total_nfts = random.randint(5, 50)
    nfts = []
    
    for i in range((page - 1) * limit, min(page * limit, total_nfts)):
        nft = generate_mock_nft(random.randint(1, 10000))
        nft['owned_since'] = (datetime.now() - timedelta(days=random.randint(1, 365))).isoformat()
        nfts.append(nft)
    
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

@wallet_bp.route('/wallet/transactions/<wallet_address>', methods=['GET'])
def get_wallet_transactions(wallet_address):
    """获取钱包交易历史"""
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 20))
    tx_type = request.args.get('type')  # 'all', 'nft', 'token'
    
    # 生成交易历史
    total_transactions = random.randint(50, 500)
    transactions = []
    
    for i in range((page - 1) * limit, min(page * limit, total_transactions)):
        tx_types = ['nft_purchase', 'nft_sale', 'nft_mint', 'token_transfer', 'token_swap']
        selected_type = random.choice(tx_types)
        
        if tx_type == 'nft' and not selected_type.startswith('nft'):
            continue
        elif tx_type == 'token' and not selected_type.startswith('token'):
            continue
        
        transaction = {
            'id': f'tx_{random.randint(100000, 999999)}',
            'type': selected_type,
            'status': random.choice(['confirmed', 'pending', 'failed']),
            'amount': round(random.uniform(0.01, 50.0), 4),
            'currency': random.choice(['SOL', 'CFISH']),
            'fee': round(random.uniform(0.001, 0.01), 6),
            'from_address': wallet_address if random.choice([True, False]) else f'wallet_{random.randint(1000, 9999)}',
            'to_address': f'wallet_{random.randint(1000, 9999)}' if random.choice([True, False]) else wallet_address,
            'timestamp': (datetime.now() - timedelta(hours=random.randint(1, 8760))).isoformat(),
            'signature': f'sig_{random.randint(10000000, 99999999)}',
            'block_height': random.randint(100000, 200000)
        }
        
        if selected_type.startswith('nft'):
            transaction['nft'] = {
                'id': random.randint(1, 10000),
                'name': f'NFT #{random.randint(1, 10000)}',
                'image': f'/nft-images/nft_{random.randint(1, 1000)}.jpg'
            }
        
        transactions.append(transaction)
    
    return jsonify({
        'success': True,
        'data': {
            'transactions': transactions[:limit],
            'pagination': {
                'page': page,
                'limit': limit,
                'total': total_transactions,
                'pages': (total_transactions + limit - 1) // limit
            }
        }
    })

@wallet_bp.route('/wallet/send', methods=['POST'])
def send_tokens():
    """发送代币"""
    data = request.get_json()
    
    required_fields = ['from_address', 'to_address', 'amount', 'currency']
    for field in required_fields:
        if field not in data:
            return jsonify({
                'success': False,
                'error': f'Missing required field: {field}'
            }), 400
    
    # 模拟交易处理
    transaction_id = f'tx_{random.randint(100000, 999999)}'
    
    return jsonify({
        'success': True,
        'message': 'Transaction initiated successfully',
        'data': {
            'transaction_id': transaction_id,
            'from_address': data['from_address'],
            'to_address': data['to_address'],
            'amount': data['amount'],
            'currency': data['currency'],
            'fee': round(random.uniform(0.001, 0.01), 6),
            'status': 'pending',
            'estimated_confirmation_time': '30-60 seconds'
        }
    })

@wallet_bp.route('/wallet/portfolio/<wallet_address>', methods=['GET'])
def get_wallet_portfolio(wallet_address):
    """获取钱包投资组合"""
    return jsonify({
        'success': True,
        'data': {
            'wallet_address': wallet_address,
            'total_value': round(random.uniform(1000, 50000), 2),
            'value_change_24h': round(random.uniform(-500, 500), 2),
            'value_change_percentage_24h': round(random.uniform(-20, 20), 2),
            'assets': {
                'tokens': {
                    'SOL': {
                        'balance': round(random.uniform(1, 100), 4),
                        'value': round(random.uniform(100, 5000), 2),
                        'change_24h': round(random.uniform(-10, 10), 2)
                    },
                    'CFISH': {
                        'balance': round(random.uniform(1000, 50000), 2),
                        'value': round(random.uniform(500, 10000), 2),
                        'change_24h': round(random.uniform(-15, 15), 2)
                    }
                },
                'nfts': {
                    'count': random.randint(5, 50),
                    'floor_value': round(random.uniform(100, 5000), 2),
                    'estimated_value': round(random.uniform(500, 10000), 2)
                }
            },
            'staking': {
                'total_staked': round(random.uniform(100, 5000), 2),
                'rewards_earned': round(random.uniform(10, 500), 2),
                'apy': round(random.uniform(5, 25), 2)
            },
            'last_updated': datetime.now().isoformat()
        }
    })

@wallet_bp.route('/wallet/activity/<wallet_address>', methods=['GET'])
def get_wallet_activity(wallet_address):
    """获取钱包活动摘要"""
    return jsonify({
        'success': True,
        'data': {
            'wallet_address': wallet_address,
            'stats': {
                'total_transactions': random.randint(50, 1000),
                'nfts_bought': random.randint(5, 100),
                'nfts_sold': random.randint(2, 50),
                'nfts_minted': random.randint(1, 20),
                'total_volume': round(random.uniform(100, 10000), 2),
                'profit_loss': round(random.uniform(-1000, 5000), 2)
            },
            'recent_activity': [
                {
                    'type': random.choice(['nft_purchase', 'nft_sale', 'token_transfer', 'staking']),
                    'description': f'Activity #{i+1}',
                    'amount': round(random.uniform(0.1, 10.0), 2),
                    'currency': random.choice(['SOL', 'CFISH']),
                    'timestamp': (datetime.now() - timedelta(hours=random.randint(1, 168))).isoformat()
                } for i in range(10)
            ]
        }
    })

