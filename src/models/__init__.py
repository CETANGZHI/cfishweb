from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import uuid

db = SQLAlchemy()

def generate_uuid():
    """Generate a UUID string"""
    return str(uuid.uuid4())

class BaseModel(db.Model):
    """Base model class with common fields"""
    __abstract__ = True
    
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        """Convert model instance to dictionary"""
        result = {}
        for column in self.__table__.columns:
            value = getattr(self, column.name)
            if isinstance(value, datetime):
                value = value.isoformat() + 'Z'
            result[column.name] = value
        return result
    
    def save(self):
        """Save the model instance"""
        db.session.add(self)
        db.session.commit()
        return self
    
    def delete(self):
        """Delete the model instance"""
        db.session.delete(self)
        db.session.commit()
        return True


from src.models.user import User
from src.models.nft import NFT
from src.models.staking import StakingPool, UserStake, GovernanceProposal, GovernanceVote, StakingReward
from src.models.wallet import WalletBalance, TransactionRecord, WalletConnection, PaymentMethod, WalletActivity, TokenInfo
from src.models.barter import BarterRequest, BarterResponse, BarterMatch, BarterHistory, BarterPreference
from src.models.bulk_operations import BulkOperation, BulkOperationItem, BulkTemplate, BulkOperationLog, BulkOperationSchedule
from src.models.activity_calendar import Activity, ActivityParticipant, ActivityUpdate, ActivityCalendar, CalendarSubscription, ActivityReminder, ActivityFavorite
from src.models.intent_pool import Intent, IntentMatch, IntentResponse, IntentPool, IntentPoolMembership, IntentAlert, IntentHistory
from src.models.minting import SmartContract, MintingFee, MintingEvent, MetadataTemplate, MintingPreset, NetworkStatus, MintingQueue
from src.models.auction import Auction, Bid, AuctionWatchlist, AuctionHistory, AuctionSettings, AuctionAnalytics, AuctionTemplate, BidderProfile
from src.models.dispute import Dispute, DisputeEvidence, DisputeMessage, DisputeTimeline, Mediator, DisputeResolution, DisputeSettings, DisputeAnalytics


