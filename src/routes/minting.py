"""
NFT铸造辅助API路由
"""
from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
import uuid
from typing import Dict, Any, List, Optional

from ..models.minting import (
    SmartContract, MintingFee, MintingEvent, MetadataTemplate,
    MintingPreset, NetworkStatus, MintingQueue
)
from ..utils.auth_utils import token_required
from ..utils.input_validator import validate_input
from ..utils.logger import get_logger

logger = get_logger(__name__)
minting_bp = Blueprint('minting', __name__)

# 模拟数据存储
smart_contracts: Dict[str, SmartContract] = {}
minting_fees: Dict[str, MintingFee] = {}
minting_events: Dict[str, MintingEvent] = {}
metadata_templates: Dict[str, MetadataTemplate] = {}
minting_presets: Dict[str, MintingPreset] = {}
network_statuses: Dict[str, NetworkStatus] = {}
minting_queues: Dict[str, MintingQueue] = {}

# 初始化一些示例数据
def init_sample_data():
    """初始化示例数据"""
    # 智能合约示例
    contract_id = str(uuid.uuid4())
    smart_contracts[contract_id] = SmartContract(
        id=contract_id,
        name="CFISH NFT Contract",
        address="0x1234567890abcdef1234567890abcdef12345678",
        abi={
            "mint": {
                "inputs": [
                    {"name": "to", "type": "address"},
                    {"name": "tokenURI", "type": "string"}
                ],
                "outputs": [{"name": "tokenId", "type": "uint256"}]
            }
        },
        network="mainnet",
        contract_type="nft",
        version="1.0.0",
        is_active=True,
        created_at=datetime.now(),
        updated_at=datetime.now()
    )
    
    # 铸造费用示例
    fee_id = str(uuid.uuid4())
    minting_fees[fee_id] = MintingFee(
        id=fee_id,
        contract_address="0x1234567890abcdef1234567890abcdef12345678",
        network="mainnet",
        base_fee=0.01,
        gas_price=0.000001,
        estimated_gas=50000,
        total_fee=0.06,
        currency="SOL",
        last_updated=datetime.now()
    )
    
    # 网络状态示例
    status_id = str(uuid.uuid4())
    network_statuses[status_id] = NetworkStatus(
        id=status_id,
        network="mainnet",
        is_healthy=True,
        block_height=123456789,
        average_block_time=0.4,
        congestion_level="low",
        recommended_gas_price=0.000001,
        last_updated=datetime.now()
    )

# 初始化示例数据
init_sample_data()


@minting_bp.route('/contracts', methods=['GET'])
def get_smart_contracts():
    """获取智能合约列表"""
    try:
        network = request.args.get('network', 'mainnet')
        contract_type = request.args.get('type', 'nft')
        
        filtered_contracts = [
            contract.to_dict() for contract in smart_contracts.values()
            if contract.network == network and contract.contract_type == contract_type and contract.is_active
        ]
        
        logger.info(f"Retrieved {len(filtered_contracts)} smart contracts for network: {network}, type: {contract_type}")
        
        return jsonify({
            'success': True,
            'data': filtered_contracts,
            'total': len(filtered_contracts)
        }), 200
        
    except Exception as e:
        logger.error(f"Error retrieving smart contracts: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Failed to retrieve smart contracts'
        }), 500


@minting_bp.route('/contracts/<contract_id>', methods=['GET'])
def get_smart_contract(contract_id: str):
    """获取单个智能合约详情"""
    try:
        if contract_id not in smart_contracts:
            return jsonify({
                'success': False,
                'message': 'Smart contract not found'
            }), 404
        
        contract = smart_contracts[contract_id]
        logger.info(f"Retrieved smart contract: {contract_id}")
        
        return jsonify({
            'success': True,
            'data': contract.to_dict()
        }), 200
        
    except Exception as e:
        logger.error(f"Error retrieving smart contract {contract_id}: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Failed to retrieve smart contract'
        }), 500


@minting_bp.route('/fees/estimate', methods=['POST'])
def estimate_minting_fee():
    """估算铸造费用"""
    try:
        data = request.get_json()
        
        # 验证输入
        required_fields = ['contract_address', 'network']
        if not validate_input(data, required_fields):
            return jsonify({
                'success': False,
                'message': 'Missing required fields'
            }), 400
        
        contract_address = data['contract_address']
        network = data['network']
        
        # 查找现有费用信息或创建新的
        existing_fee = None
        for fee in minting_fees.values():
            if fee.contract_address == contract_address and fee.network == network:
                existing_fee = fee
                break
        
        if existing_fee:
            fee_data = existing_fee.to_dict()
        else:
            # 创建新的费用估算
            fee_id = str(uuid.uuid4())
            new_fee = MintingFee(
                id=fee_id,
                contract_address=contract_address,
                network=network,
                base_fee=0.01,
                gas_price=0.000001,
                estimated_gas=50000,
                total_fee=0.06,
                currency="SOL",
                last_updated=datetime.now()
            )
            minting_fees[fee_id] = new_fee
            fee_data = new_fee.to_dict()
        
        logger.info(f"Estimated minting fee for contract: {contract_address}")
        
        return jsonify({
            'success': True,
            'data': fee_data
        }), 200
        
    except Exception as e:
        logger.error(f"Error estimating minting fee: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Failed to estimate minting fee'
        }), 500


@minting_bp.route('/events', methods=['POST'])
@token_required
def record_minting_event(current_user):
    """记录铸造事件"""
    try:
        data = request.get_json()
        
        # 验证输入
        required_fields = ['transaction_hash', 'contract_address', 'metadata_uri']
        if not validate_input(data, required_fields):
            return jsonify({
                'success': False,
                'message': 'Missing required fields'
            }), 400
        
        event_id = str(uuid.uuid4())
        minting_event = MintingEvent(
            id=event_id,
            user_id=current_user['id'],
            nft_id=data.get('nft_id'),
            transaction_hash=data['transaction_hash'],
            contract_address=data['contract_address'],
            token_id=data.get('token_id'),
            metadata_uri=data['metadata_uri'],
            mint_status='pending',
            gas_used=data.get('gas_used'),
            gas_price=data.get('gas_price'),
            total_cost=data.get('total_cost'),
            error_message=None,
            created_at=datetime.now(),
            confirmed_at=None
        )
        
        minting_events[event_id] = minting_event
        
        logger.info(f"Recorded minting event: {event_id} for user: {current_user['id']}")
        
        return jsonify({
            'success': True,
            'data': minting_event.to_dict()
        }), 201
        
    except Exception as e:
        logger.error(f"Error recording minting event: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Failed to record minting event'
        }), 500


@minting_bp.route('/events/<event_id>', methods=['PUT'])
@token_required
def update_minting_event(current_user, event_id: str):
    """更新铸造事件状态"""
    try:
        if event_id not in minting_events:
            return jsonify({
                'success': False,
                'message': 'Minting event not found'
            }), 404
        
        event = minting_events[event_id]
        
        # 检查权限
        if event.user_id != current_user['id']:
            return jsonify({
                'success': False,
                'message': 'Unauthorized'
            }), 403
        
        data = request.get_json()
        
        # 更新事件状态
        if 'mint_status' in data:
            event.mint_status = data['mint_status']
            if data['mint_status'] == 'confirmed':
                event.confirmed_at = datetime.now()
        
        if 'token_id' in data:
            event.token_id = data['token_id']
        
        if 'gas_used' in data:
            event.gas_used = data['gas_used']
        
        if 'total_cost' in data:
            event.total_cost = data['total_cost']
        
        if 'error_message' in data:
            event.error_message = data['error_message']
        
        logger.info(f"Updated minting event: {event_id}")
        
        return jsonify({
            'success': True,
            'data': event.to_dict()
        }), 200
        
    except Exception as e:
        logger.error(f"Error updating minting event {event_id}: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Failed to update minting event'
        }), 500


@minting_bp.route('/events/user/<user_id>', methods=['GET'])
@token_required
def get_user_minting_events(current_user, user_id: str):
    """获取用户的铸造事件"""
    try:
        # 检查权限
        if user_id != current_user['id']:
            return jsonify({
                'success': False,
                'message': 'Unauthorized'
            }), 403
        
        user_events = [
            event.to_dict() for event in minting_events.values()
            if event.user_id == user_id
        ]
        
        # 按创建时间排序
        user_events.sort(key=lambda x: x['created_at'], reverse=True)
        
        logger.info(f"Retrieved {len(user_events)} minting events for user: {user_id}")
        
        return jsonify({
            'success': True,
            'data': user_events,
            'total': len(user_events)
        }), 200
        
    except Exception as e:
        logger.error(f"Error retrieving minting events for user {user_id}: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Failed to retrieve minting events'
        }), 500


@minting_bp.route('/templates', methods=['GET'])
def get_metadata_templates():
    """获取元数据模板列表"""
    try:
        category = request.args.get('category')
        is_public = request.args.get('is_public', 'true').lower() == 'true'
        
        filtered_templates = []
        for template in metadata_templates.values():
            if category and template.category != category:
                continue
            if not is_public and not template.is_public:
                continue
            filtered_templates.append(template.to_dict())
        
        logger.info(f"Retrieved {len(filtered_templates)} metadata templates")
        
        return jsonify({
            'success': True,
            'data': filtered_templates,
            'total': len(filtered_templates)
        }), 200
        
    except Exception as e:
        logger.error(f"Error retrieving metadata templates: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Failed to retrieve metadata templates'
        }), 500


@minting_bp.route('/presets', methods=['GET'])
@token_required
def get_minting_presets(current_user):
    """获取铸造预设配置"""
    try:
        user_presets = [
            preset.to_dict() for preset in minting_presets.values()
            if preset.creator_id == current_user['id'] and preset.is_active
        ]
        
        logger.info(f"Retrieved {len(user_presets)} minting presets for user: {current_user['id']}")
        
        return jsonify({
            'success': True,
            'data': user_presets,
            'total': len(user_presets)
        }), 200
        
    except Exception as e:
        logger.error(f"Error retrieving minting presets: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Failed to retrieve minting presets'
        }), 500


@minting_bp.route('/network/status', methods=['GET'])
def get_network_status():
    """获取网络状态"""
    try:
        network = request.args.get('network', 'mainnet')
        
        network_status = None
        for status in network_statuses.values():
            if status.network == network:
                network_status = status
                break
        
        if not network_status:
            return jsonify({
                'success': False,
                'message': 'Network status not found'
            }), 404
        
        logger.info(f"Retrieved network status for: {network}")
        
        return jsonify({
            'success': True,
            'data': network_status.to_dict()
        }), 200
        
    except Exception as e:
        logger.error(f"Error retrieving network status: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Failed to retrieve network status'
        }), 500


@minting_bp.route('/queue', methods=['POST'])
@token_required
def add_to_minting_queue(current_user):
    """添加到铸造队列"""
    try:
        data = request.get_json()
        
        # 验证输入
        required_fields = ['nft_metadata', 'contract_address']
        if not validate_input(data, required_fields):
            return jsonify({
                'success': False,
                'message': 'Missing required fields'
            }), 400
        
        queue_id = str(uuid.uuid4())
        queue_item = MintingQueue(
            id=queue_id,
            user_id=current_user['id'],
            nft_metadata=data['nft_metadata'],
            contract_address=data['contract_address'],
            priority=data.get('priority', 5),
            status='queued',
            estimated_completion=datetime.now() + timedelta(minutes=10),
            created_at=datetime.now(),
            started_at=None,
            completed_at=None
        )
        
        minting_queues[queue_id] = queue_item
        
        logger.info(f"Added to minting queue: {queue_id} for user: {current_user['id']}")
        
        return jsonify({
            'success': True,
            'data': queue_item.to_dict()
        }), 201
        
    except Exception as e:
        logger.error(f"Error adding to minting queue: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Failed to add to minting queue'
        }), 500


@minting_bp.route('/queue/user/<user_id>', methods=['GET'])
@token_required
def get_user_minting_queue(current_user, user_id: str):
    """获取用户的铸造队列"""
    try:
        # 检查权限
        if user_id != current_user['id']:
            return jsonify({
                'success': False,
                'message': 'Unauthorized'
            }), 403
        
        user_queue = [
            item.to_dict() for item in minting_queues.values()
            if item.user_id == user_id
        ]
        
        # 按优先级和创建时间排序
        user_queue.sort(key=lambda x: (-x['priority'], x['created_at']))
        
        logger.info(f"Retrieved {len(user_queue)} queue items for user: {user_id}")
        
        return jsonify({
            'success': True,
            'data': user_queue,
            'total': len(user_queue)
        }), 200
        
    except Exception as e:
        logger.error(f"Error retrieving minting queue for user {user_id}: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Failed to retrieve minting queue'
        }), 500

