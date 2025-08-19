"""
Staking and Governance API routes for CFISH backend
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime, timedelta
from ..models import db
from ..models.staking import StakingPool, UserStake, GovernanceProposal, GovernanceVote, StakingReward
from ..models.user import User
from ..utils.input_validator import validate_required_fields, sanitize_input
from ..utils.logger import log_api_request

staking_bp = Blueprint('staking', __name__)


@staking_bp.route('/pools', methods=['GET'])
def get_staking_pools():
    """获取所有质押池"""
    log_api_request('GET', '/api/v1/staking/pools')
    
    try:
        pools = StakingPool.query.filter_by(is_active=True).all()
        
        pools_data = []
        for pool in pools:
            pools_data.append({
                'id': pool.id,
                'name': pool.name,
                'description': pool.description,
                'token_address': pool.token_address,
                'reward_token_address': pool.reward_token_address,
                'apy': pool.apy,
                'total_staked': pool.total_staked,
                'min_stake_amount': pool.min_stake_amount,
                'lock_period': pool.lock_period,
                'created_at': pool.created_at.isoformat()
            })
        
        return jsonify({
            'success': True,
            'data': pools_data
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'获取质押池失败: {str(e)}'
        }), 500


@staking_bp.route('/pools/<int:pool_id>', methods=['GET'])
def get_staking_pool(pool_id):
    """获取单个质押池详情"""
    log_api_request('GET', f'/api/v1/staking/pools/{pool_id}')
    
    try:
        pool = StakingPool.query.get_or_404(pool_id)
        
        return jsonify({
            'success': True,
            'data': {
                'id': pool.id,
                'name': pool.name,
                'description': pool.description,
                'token_address': pool.token_address,
                'reward_token_address': pool.reward_token_address,
                'apy': pool.apy,
                'total_staked': pool.total_staked,
                'min_stake_amount': pool.min_stake_amount,
                'lock_period': pool.lock_period,
                'is_active': pool.is_active,
                'created_at': pool.created_at.isoformat()
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'获取质押池详情失败: {str(e)}'
        }), 500


@staking_bp.route('/user/<int:user_id>/stakes', methods=['GET'])
@jwt_required()
def get_user_stakes(user_id):
    """获取用户质押信息"""
    log_api_request('GET', f'/api/v1/staking/user/{user_id}/stakes')
    
    try:
        current_user_id = get_jwt_identity()
        if current_user_id != user_id:
            return jsonify({
                'success': False,
                'message': '无权限访问其他用户的质押信息'
            }), 403
        
        stakes = UserStake.query.filter_by(user_id=user_id, is_active=True).all()
        
        stakes_data = []
        for stake in stakes:
            # 计算未领取奖励
            unclaimed_rewards = StakingReward.query.filter_by(
                stake_id=stake.id, 
                is_claimed=False
            ).with_entities(db.func.sum(StakingReward.reward_amount)).scalar() or 0
            
            stakes_data.append({
                'id': stake.id,
                'pool_id': stake.pool_id,
                'pool_name': stake.pool.name,
                'amount': stake.amount,
                'reward_earned': stake.reward_earned,
                'reward_claimed': stake.reward_claimed,
                'unclaimed_rewards': unclaimed_rewards,
                'stake_date': stake.stake_date.isoformat(),
                'unlock_date': stake.unlock_date.isoformat() if stake.unlock_date else None,
                'is_locked': stake.unlock_date > datetime.utcnow() if stake.unlock_date else False,
                'transaction_hash': stake.transaction_hash
            })
        
        return jsonify({
            'success': True,
            'data': stakes_data
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'获取用户质押信息失败: {str(e)}'
        }), 500


@staking_bp.route('/stake', methods=['POST'])
@jwt_required()
def create_stake():
    """创建质押记录"""
    log_api_request('POST', '/api/v1/staking/stake')
    
    try:
        data = request.get_json()
        
        # 验证必需字段
        required_fields = ['pool_id', 'amount', 'transaction_hash']
        if not validate_required_fields(data, required_fields):
            return jsonify({
                'success': False,
                'message': '缺少必需字段'
            }), 400
        
        user_id = get_jwt_identity()
        pool_id = sanitize_input(data['pool_id'])
        amount = float(sanitize_input(data['amount']))
        transaction_hash = sanitize_input(data['transaction_hash'])
        
        # 验证质押池存在
        pool = StakingPool.query.get_or_404(pool_id)
        if not pool.is_active:
            return jsonify({
                'success': False,
                'message': '质押池不可用'
            }), 400
        
        # 验证最小质押量
        if amount < pool.min_stake_amount:
            return jsonify({
                'success': False,
                'message': f'质押数量不能少于 {pool.min_stake_amount}'
            }), 400
        
        # 计算解锁日期
        unlock_date = None
        if pool.lock_period > 0:
            unlock_date = datetime.utcnow() + timedelta(days=pool.lock_period)
        
        # 创建质押记录
        stake = UserStake(
            user_id=user_id,
            pool_id=pool_id,
            amount=amount,
            unlock_date=unlock_date,
            transaction_hash=transaction_hash
        )
        
        db.session.add(stake)
        
        # 更新质押池总量
        pool.total_staked += amount
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': '质押创建成功',
            'data': {
                'stake_id': stake.id,
                'unlock_date': unlock_date.isoformat() if unlock_date else None
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'创建质押失败: {str(e)}'
        }), 500


@staking_bp.route('/governance/proposals', methods=['GET'])
def get_governance_proposals():
    """获取治理提案列表"""
    log_api_request('GET', '/api/v1/staking/governance/proposals')
    
    try:
        page = request.args.get('page', 1, type=int)
        per_page = min(request.args.get('per_page', 20, type=int), 100)
        status = request.args.get('status')
        
        query = GovernanceProposal.query
        
        if status:
            query = query.filter_by(status=status)
        
        proposals = query.order_by(GovernanceProposal.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        proposals_data = []
        for proposal in proposals.items:
            total_votes = proposal.votes_for + proposal.votes_against + proposal.votes_abstain
            
            proposals_data.append({
                'id': proposal.id,
                'title': proposal.title,
                'description': proposal.description,
                'proposer': {
                    'id': proposal.proposer.id,
                    'wallet_address': proposal.proposer.wallet_address,
                    'username': proposal.proposer.username
                },
                'proposal_type': proposal.proposal_type,
                'status': proposal.status,
                'voting_start': proposal.voting_start.isoformat(),
                'voting_end': proposal.voting_end.isoformat(),
                'votes_for': proposal.votes_for,
                'votes_against': proposal.votes_against,
                'votes_abstain': proposal.votes_abstain,
                'total_votes': total_votes,
                'quorum_required': proposal.quorum_required,
                'approval_threshold': proposal.approval_threshold,
                'created_at': proposal.created_at.isoformat()
            })
        
        return jsonify({
            'success': True,
            'data': proposals_data,
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': proposals.total,
                'pages': proposals.pages
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'获取治理提案失败: {str(e)}'
        }), 500


@staking_bp.route('/governance/proposals/<int:proposal_id>', methods=['GET'])
def get_governance_proposal(proposal_id):
    """获取单个治理提案详情"""
    log_api_request('GET', f'/api/v1/staking/governance/proposals/{proposal_id}')
    
    try:
        proposal = GovernanceProposal.query.get_or_404(proposal_id)
        total_votes = proposal.votes_for + proposal.votes_against + proposal.votes_abstain
        
        return jsonify({
            'success': True,
            'data': {
                'id': proposal.id,
                'title': proposal.title,
                'description': proposal.description,
                'proposer': {
                    'id': proposal.proposer.id,
                    'wallet_address': proposal.proposer.wallet_address,
                    'username': proposal.proposer.username
                },
                'proposal_type': proposal.proposal_type,
                'status': proposal.status,
                'voting_start': proposal.voting_start.isoformat(),
                'voting_end': proposal.voting_end.isoformat(),
                'execution_date': proposal.execution_date.isoformat() if proposal.execution_date else None,
                'votes_for': proposal.votes_for,
                'votes_against': proposal.votes_against,
                'votes_abstain': proposal.votes_abstain,
                'total_votes': total_votes,
                'quorum_required': proposal.quorum_required,
                'approval_threshold': proposal.approval_threshold,
                'created_at': proposal.created_at.isoformat()
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'获取治理提案详情失败: {str(e)}'
        }), 500


@staking_bp.route('/governance/vote', methods=['POST'])
@jwt_required()
def cast_vote():
    """投票"""
    log_api_request('POST', '/api/v1/staking/governance/vote')
    
    try:
        data = request.get_json()
        
        # 验证必需字段
        required_fields = ['proposal_id', 'vote_choice', 'voting_power', 'transaction_hash']
        if not validate_required_fields(data, required_fields):
            return jsonify({
                'success': False,
                'message': '缺少必需字段'
            }), 400
        
        user_id = get_jwt_identity()
        proposal_id = sanitize_input(data['proposal_id'])
        vote_choice = sanitize_input(data['vote_choice'])
        voting_power = float(sanitize_input(data['voting_power']))
        transaction_hash = sanitize_input(data['transaction_hash'])
        
        # 验证投票选择
        if vote_choice not in ['for', 'against', 'abstain']:
            return jsonify({
                'success': False,
                'message': '无效的投票选择'
            }), 400
        
        # 验证提案存在且在投票期内
        proposal = GovernanceProposal.query.get_or_404(proposal_id)
        now = datetime.utcnow()
        
        if now < proposal.voting_start or now > proposal.voting_end:
            return jsonify({
                'success': False,
                'message': '不在投票时间内'
            }), 400
        
        if proposal.status != 'active':
            return jsonify({
                'success': False,
                'message': '提案不在活跃状态'
            }), 400
        
        # 检查是否已经投票
        existing_vote = GovernanceVote.query.filter_by(
            proposal_id=proposal_id,
            voter_id=user_id
        ).first()
        
        if existing_vote:
            return jsonify({
                'success': False,
                'message': '您已经对此提案投票'
            }), 400
        
        # 创建投票记录
        vote = GovernanceVote(
            proposal_id=proposal_id,
            voter_id=user_id,
            vote_choice=vote_choice,
            voting_power=voting_power,
            transaction_hash=transaction_hash
        )
        
        db.session.add(vote)
        
        # 更新提案投票统计
        if vote_choice == 'for':
            proposal.votes_for += voting_power
        elif vote_choice == 'against':
            proposal.votes_against += voting_power
        else:  # abstain
            proposal.votes_abstain += voting_power
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': '投票成功',
            'data': {
                'vote_id': vote.id
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'投票失败: {str(e)}'
        }), 500


@staking_bp.route('/rewards/user/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user_rewards(user_id):
    """获取用户奖励"""
    log_api_request('GET', f'/api/v1/staking/rewards/user/{user_id}')
    
    try:
        current_user_id = get_jwt_identity()
        if current_user_id != user_id:
            return jsonify({
                'success': False,
                'message': '无权限访问其他用户的奖励信息'
            }), 403
        
        rewards = StakingReward.query.filter_by(user_id=user_id).all()
        
        rewards_data = []
        total_earned = 0
        total_claimed = 0
        total_unclaimed = 0
        
        for reward in rewards:
            rewards_data.append({
                'id': reward.id,
                'stake_id': reward.stake_id,
                'reward_amount': reward.reward_amount,
                'reward_type': reward.reward_type,
                'is_claimed': reward.is_claimed,
                'earned_at': reward.earned_at.isoformat(),
                'claimed_at': reward.claimed_at.isoformat() if reward.claimed_at else None,
                'claim_transaction_hash': reward.claim_transaction_hash
            })
            
            total_earned += reward.reward_amount
            if reward.is_claimed:
                total_claimed += reward.reward_amount
            else:
                total_unclaimed += reward.reward_amount
        
        return jsonify({
            'success': True,
            'data': {
                'rewards': rewards_data,
                'summary': {
                    'total_earned': total_earned,
                    'total_claimed': total_claimed,
                    'total_unclaimed': total_unclaimed
                }
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'获取用户奖励失败: {str(e)}'
        }), 500

