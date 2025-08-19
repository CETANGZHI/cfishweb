from flask import Blueprint, jsonify, request
from datetime import datetime, timedelta
import random

currency_filter_bp = Blueprint('currency_filter', __name__)

@currency_filter_bp.route('/currencies', methods=['GET'])
def get_supported_currencies():
    """获取支持的货币列表"""
    currencies = [
        {
            'code': 'SOL',
            'name': 'Solana',
            'symbol': 'SOL',
            'icon': '/icons/sol-icon.svg',
            'description': 'Solana native token',
            'has_fees': True,
            'fee_percentage': 2.5
        },
        {
            'code': 'CFISH',
            'name': 'CFish Token',
            'symbol': 'CFISH',
            'icon': '/icons/cfish-icon.svg',
            'description': 'Platform native token',
            'has_fees': False,
            'fee_percentage': 0.0
        }
    ]
    
    return jsonify({
        'success': True,
        'data': currencies
    })

@currency_filter_bp.route('/nfts/by-currency/<currency_code>', methods=['GET'])
def get_nfts_by_currency(currency_code):
    """根据货币类型获取NFT列表"""
    from src.routes.nft import generate_mock_nft
    
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 20))
    sort_by = request.args.get('sort_by', 'created_at')
    order = request.args.get('order', 'desc')
    
    # 验证货币类型
    if currency_code.upper() not in ['SOL', 'CFISH']:
        return jsonify({
            'success': False,
            'error': 'Unsupported currency type'
        }), 400
    
    # 生成指定货币的NFT数据
    total_nfts = random.randint(100, 500)
    nfts = []
    
    for i in range((page - 1) * limit, min(page * limit, total_nfts)):
        nft = generate_mock_nft(i + 1)
        nft['currency'] = currency_code.upper()  # 强制设置为指定货币
        
        # 根据货币类型调整价格范围
        if currency_code.upper() == 'SOL':
            nft['price'] = round(random.uniform(0.1, 50.0), 2)
        else:  # CFISH
            nft['price'] = round(random.uniform(100, 50000), 2)
        
        nfts.append(nft)
    
    # 排序
    if sort_by == 'price':
        nfts.sort(key=lambda x: x['price'], reverse=(order == 'desc'))
    elif sort_by == 'commission':
        nfts.sort(key=lambda x: x['commission'], reverse=(order == 'desc'))
    elif sort_by == 'likes':
        nfts.sort(key=lambda x: x['likes'], reverse=(order == 'desc'))
    
    return jsonify({
        'success': True,
        'data': {
            'nfts': nfts[:limit],
            'currency': currency_code.upper(),
            'pagination': {
                'page': page,
                'limit': limit,
                'total': total_nfts,
                'pages': (total_nfts + limit - 1) // limit
            },
            'currency_info': {
                'code': currency_code.upper(),
                'has_fees': currency_code.upper() == 'SOL',
                'fee_percentage': 2.5 if currency_code.upper() == 'SOL' else 0.0
            }
        }
    })

@currency_filter_bp.route('/collections/by-currency/<currency_code>', methods=['GET'])
def get_collections_by_currency(currency_code):
    """根据货币类型获取合集列表"""
    from src.routes.collection import generate_mock_collection
    
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 20))
    
    # 验证货币类型
    if currency_code.upper() not in ['SOL', 'CFISH']:
        return jsonify({
            'success': False,
            'error': 'Unsupported currency type'
        }), 400
    
    # 生成指定货币的合集数据
    total_collections = random.randint(50, 200)
    collections = []
    
    for i in range((page - 1) * limit, min(page * limit, total_collections)):
        collection = generate_mock_collection(i + 1)
        
        # 根据货币类型调整价格
        if currency_code.upper() == 'SOL':
            collection['floor_price'] = round(random.uniform(0.1, 10.0), 2)
            collection['volume_24h'] = round(random.uniform(10, 1000), 2)
        else:  # CFISH
            collection['floor_price'] = round(random.uniform(100, 10000), 2)
            collection['volume_24h'] = round(random.uniform(1000, 100000), 2)
        
        collection['primary_currency'] = currency_code.upper()
        collections.append(collection)
    
    return jsonify({
        'success': True,
        'data': {
            'collections': collections[:limit],
            'currency': currency_code.upper(),
            'pagination': {
                'page': page,
                'limit': limit,
                'total': total_collections,
                'pages': (total_collections + limit - 1) // limit
            }
        }
    })

@currency_filter_bp.route('/market-stats/by-currency', methods=['GET'])
def get_market_stats_by_currency():
    """获取按货币分类的市场统计"""
    sol_stats = {
        'currency': 'SOL',
        'total_volume_24h': round(random.uniform(10000, 100000), 2),
        'total_sales_24h': random.randint(500, 5000),
        'average_price': round(random.uniform(1.0, 20.0), 2),
        'floor_price': round(random.uniform(0.1, 5.0), 2),
        'active_listings': random.randint(1000, 10000),
        'price_change_24h': round(random.uniform(-20, 20), 2)
    }
    
    cfish_stats = {
        'currency': 'CFISH',
        'total_volume_24h': round(random.uniform(100000, 1000000), 2),
        'total_sales_24h': random.randint(1000, 10000),
        'average_price': round(random.uniform(1000, 20000), 2),
        'floor_price': round(random.uniform(100, 5000), 2),
        'active_listings': random.randint(2000, 20000),
        'price_change_24h': round(random.uniform(-15, 25), 2)
    }
    
    return jsonify({
        'success': True,
        'data': {
            'SOL': sol_stats,
            'CFISH': cfish_stats,
            'total_stats': {
                'combined_volume_24h': sol_stats['total_volume_24h'] + cfish_stats['total_volume_24h'],
                'combined_sales_24h': sol_stats['total_sales_24h'] + cfish_stats['total_sales_24h'],
                'total_listings': sol_stats['active_listings'] + cfish_stats['active_listings']
            }
        }
    })

