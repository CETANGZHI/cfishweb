"""
NFT铸造辅助相关的数据模型
"""
from datetime import datetime
from typing import Optional, Dict, Any
from dataclasses import dataclass


@dataclass
class SmartContract:
    """智能合约信息模型"""
    id: str
    name: str
    address: str
    abi: Dict[str, Any]
    network: str  # 'mainnet', 'testnet', 'devnet'
    contract_type: str  # 'nft', 'marketplace', 'staking'
    version: str
    is_active: bool
    created_at: datetime
    updated_at: datetime
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'address': self.address,
            'abi': self.abi,
            'network': self.network,
            'contract_type': self.contract_type,
            'version': self.version,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }


@dataclass
class MintingFee:
    """铸造费用信息模型"""
    id: str
    contract_address: str
    network: str
    base_fee: float  # 基础铸造费用
    gas_price: float  # Gas价格
    estimated_gas: int  # 预估Gas用量
    total_fee: float  # 总费用
    currency: str  # 'SOL', 'CFISH'
    last_updated: datetime
    
    def to_dict(self):
        return {
            'id': self.id,
            'contract_address': self.contract_address,
            'network': self.network,
            'base_fee': self.base_fee,
            'gas_price': self.gas_price,
            'estimated_gas': self.estimated_gas,
            'total_fee': self.total_fee,
            'currency': self.currency,
            'last_updated': self.last_updated.isoformat()
        }


@dataclass
class MintingEvent:
    """铸造事件记录模型"""
    id: str
    user_id: str
    nft_id: Optional[str]
    transaction_hash: str
    contract_address: str
    token_id: Optional[str]
    metadata_uri: str
    mint_status: str  # 'pending', 'confirmed', 'failed'
    gas_used: Optional[int]
    gas_price: Optional[float]
    total_cost: Optional[float]
    error_message: Optional[str]
    created_at: datetime
    confirmed_at: Optional[datetime]
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'nft_id': self.nft_id,
            'transaction_hash': self.transaction_hash,
            'contract_address': self.contract_address,
            'token_id': self.token_id,
            'metadata_uri': self.metadata_uri,
            'mint_status': self.mint_status,
            'gas_used': self.gas_used,
            'gas_price': self.gas_price,
            'total_cost': self.total_cost,
            'error_message': self.error_message,
            'created_at': self.created_at.isoformat(),
            'confirmed_at': self.confirmed_at.isoformat() if self.confirmed_at else None
        }


@dataclass
class MetadataTemplate:
    """NFT元数据模板模型"""
    id: str
    name: str
    description: str
    template_data: Dict[str, Any]
    category: str  # 'art', 'collectible', 'gaming', 'utility'
    is_public: bool
    creator_id: str
    usage_count: int
    created_at: datetime
    updated_at: datetime
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'template_data': self.template_data,
            'category': self.category,
            'is_public': self.is_public,
            'creator_id': self.creator_id,
            'usage_count': self.usage_count,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }


@dataclass
class MintingPreset:
    """铸造预设配置模型"""
    id: str
    name: str
    description: str
    contract_address: str
    default_royalty: float
    default_supply: int
    metadata_template_id: Optional[str]
    gas_limit: int
    priority_fee: float
    is_active: bool
    creator_id: str
    created_at: datetime
    updated_at: datetime
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'contract_address': self.contract_address,
            'default_royalty': self.default_royalty,
            'default_supply': self.default_supply,
            'metadata_template_id': self.metadata_template_id,
            'gas_limit': self.gas_limit,
            'priority_fee': self.priority_fee,
            'is_active': self.is_active,
            'creator_id': self.creator_id,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }


@dataclass
class NetworkStatus:
    """网络状态信息模型"""
    id: str
    network: str
    is_healthy: bool
    block_height: int
    average_block_time: float
    congestion_level: str  # 'low', 'medium', 'high'
    recommended_gas_price: float
    last_updated: datetime
    
    def to_dict(self):
        return {
            'id': self.id,
            'network': self.network,
            'is_healthy': self.is_healthy,
            'block_height': self.block_height,
            'average_block_time': self.average_block_time,
            'congestion_level': self.congestion_level,
            'recommended_gas_price': self.recommended_gas_price,
            'last_updated': self.last_updated.isoformat()
        }


@dataclass
class MintingQueue:
    """铸造队列模型"""
    id: str
    user_id: str
    nft_metadata: Dict[str, Any]
    contract_address: str
    priority: int  # 1-10, 10为最高优先级
    status: str  # 'queued', 'processing', 'completed', 'failed'
    estimated_completion: Optional[datetime]
    created_at: datetime
    started_at: Optional[datetime]
    completed_at: Optional[datetime]
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'nft_metadata': self.nft_metadata,
            'contract_address': self.contract_address,
            'priority': self.priority,
            'status': self.status,
            'estimated_completion': self.estimated_completion.isoformat() if self.estimated_completion else None,
            'created_at': self.created_at.isoformat(),
            'started_at': self.started_at.isoformat() if self.started_at else None,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None
        }

