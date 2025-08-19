from src.models.notification import Notification, NotificationSetting
from src.models.user import User
from src.models import db
from datetime import datetime

class NotificationSender:
    @staticmethod
    def send_notification(user_id, notification_type, message, related_id=None):
        user = User.query.get(user_id)
        if not user:
            print(f"User with ID {user_id} not found. Cannot send notification.")
            return

        settings = NotificationSetting.query.filter_by(user_id=user_id).first()
        if not settings:
            # Create default settings if none exist
            settings = NotificationSetting(user_id=user_id)
            db.session.add(settings)
            db.session.commit()

        # Check if this type of notification is enabled for the user
        if notification_type == "nft_sold" and not settings.nft_sold_enabled:
            return
        if notification_type == "nft_purchased" and not settings.nft_purchased_enabled:
            return
        if notification_type == "bid_received" and not settings.bid_received_enabled:
            return
        if notification_type == "bid_outbid" and not settings.bid_outbid_enabled:
            return
        if notification_type == "auction_ending" and not settings.auction_ending_enabled:
            return
        if notification_type == "follow" and not settings.follow_enabled:
            return
        if notification_type == "like" and not settings.like_enabled:
            return
        if notification_type == "comment" and not settings.comment_enabled:
            return

        new_notification = Notification(
            user_id=user_id,
            notification_type=notification_type,
            message=message,
            related_id=related_id,
            read=False,
            created_at=datetime.utcnow()
        )
        db.session.add(new_notification)
        db.session.commit()
        print(f"Notification sent to user {user_id}: {message}")

    @staticmethod
    def get_notification_message(notification_type, data):
        # This method would contain logic to generate messages based on type and data
        # For now, a simple placeholder
        if notification_type == "nft_sold":
            return f"Your NFT '{data.get('nft_title', 'NFT')}' has been sold for {data.get('price', 'N/A')} SOL."
        elif notification_type == "nft_purchased":
            return f"You have successfully purchased '{data.get('nft_title', 'NFT')}' for {data.get('price', 'N/A')} SOL."
        elif notification_type == "bid_received":
            return f"You received a new bid of {data.get('bid_amount', 'N/A')} SOL on your NFT '{data.get('nft_title', 'NFT')}'."
        elif notification_type == "bid_outbid":
            return f"You have been outbid on '{data.get('nft_title', 'NFT')}'. New bid is {data.get('new_bid_amount', 'N/A')} SOL."
        elif notification_type == "auction_ending":
            return f"The auction for '{data.get('nft_title', 'NFT')}' is ending soon!"
        elif notification_type == "follow":
            return f"{data.get('follower_name', 'Someone')} started following you."
        elif notification_type == "like":
            return f"{data.get('liker_name', 'Someone')} liked your {data.get('target_type', 'item')}."
        elif notification_type == "comment":
            return f"{data.get('commenter_name', 'Someone')} commented on your {data.get('target_type', 'item')}: '{data.get('comment_text', '')}'."
        else:
            return f"New notification: {data.get('message', '')}"


