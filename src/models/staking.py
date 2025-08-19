"""
Staking and Governance models for CFISH backend API
"""

from datetime import datetime
from . import db


class StakingPool(db.Model):
    """质押池模型"""
    __tablename__ = 'staking_pools'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    token_address = db.Column(db.String(100), nullable=False)  # 质押代币合约地址
    reward_token_address = db.Column(db.String(100), nullable=False)  # 奖励代币合约地址
    apy = db.Column(db.Float, default=0.0)  # 年化收益率
    total_staked = db.Column(db.Float, default=0.0)  # 总质押量
    min_stake_amount = db.Column(db.Float, default=0.0)  # 最小质押量
    lock_period = db.Column(db.Integer, default=0)  # 锁定期（天）
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # 关系
    stakes = db.relationship('UserStake', backref='pool', lazy=True)


class UserStake(db.Model):
    """用户质押记录模型"""
    __tablename__ = 'user_stakes'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    pool_id = db.Column(db.Integer, db.ForeignKey('staking_pools.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)  # 质押数量
    reward_earned = db.Column(db.Float, default=0.0)  # 已获得奖励
    reward_claimed = db.Column(db.Float, default=0.0)  # 已领取奖励
    stake_date = db.Column(db.DateTime, default=datetime.utcnow)
    unlock_date = db.Column(db.DateTime)  # 解锁日期
    is_active = db.Column(db.Boolean, default=True)
    transaction_hash = db.Column(db.String(100))  # 质押交易哈希
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class GovernanceProposal(db.Model):
    """治理提案模型"""
    __tablename__ = 'governance_proposals'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    proposer_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    proposal_type = db.Column(db.String(50), nullable=False)  # 'parameter_change', 'treasury', 'upgrade', etc.
    status = db.Column(db.String(20), default='active')  # 'active', 'passed', 'rejected', 'executed'
    voting_start = db.Column(db.DateTime, nullable=False)
    voting_end = db.Column(db.DateTime, nullable=False)
    execution_date = db.Column(db.DateTime)
    votes_for = db.Column(db.Float, default=0.0)  # 支持票数
    votes_against = db.Column(db.Float, default=0.0)  # 反对票数
    votes_abstain = db.Column(db.Float, default=0.0)  # 弃权票数
    quorum_required = db.Column(db.Float, default=0.1)  # 所需法定人数比例
    approval_threshold = db.Column(db.Float, default=0.5)  # 通过阈值
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # 关系
    votes = db.relationship('GovernanceVote', backref='proposal', lazy=True)
    proposer = db.relationship('User', backref='proposals')


class GovernanceVote(db.Model):
    """治理投票记录模型"""
    __tablename__ = 'governance_votes'
    
    id = db.Column(db.Integer, primary_key=True)
    proposal_id = db.Column(db.Integer, db.ForeignKey('governance_proposals.id'), nullable=False)
    voter_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    vote_choice = db.Column(db.String(10), nullable=False)  # 'for', 'against', 'abstain'
    voting_power = db.Column(db.Float, nullable=False)  # 投票权重
    transaction_hash = db.Column(db.String(100))  # 投票交易哈希
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # 唯一约束：每个用户每个提案只能投票一次
    __table_args__ = (db.UniqueConstraint('proposal_id', 'voter_id', name='unique_vote_per_proposal'),)
    
    # 关系
    voter = db.relationship('User', backref='votes')


class StakingReward(db.Model):
    """质押奖励记录模型"""
    __tablename__ = 'staking_rewards'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    stake_id = db.Column(db.Integer, db.ForeignKey('user_stakes.id'), nullable=False)
    reward_amount = db.Column(db.Float, nullable=False)
    reward_type = db.Column(db.String(20), default='staking')  # 'staking', 'governance', 'bonus'
    is_claimed = db.Column(db.Boolean, default=False)
    claim_transaction_hash = db.Column(db.String(100))
    earned_at = db.Column(db.DateTime, default=datetime.utcnow)
    claimed_at = db.Column(db.DateTime)
    
    # 关系
    user = db.relationship('User', backref='staking_rewards')
    stake = db.relationship('UserStake', backref='rewards')

