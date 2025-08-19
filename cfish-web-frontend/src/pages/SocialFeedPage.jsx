import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNotification } from '../contexts/NotificationContext';
import { useWallet } from '../contexts/WalletContext';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import UserAvatar from '../components/UI/UserAvatar';
import NFTCard from '../components/NFT/NFTCard';
import { Heart, MessageCircle, Send, UserPlus } from 'lucide-react';

const SocialFeedPage = () => {
  const { t } = useTranslation();
  const { addNotification } = useNotification();
  const { isConnected, publicKey } = useWallet();

  const [loading, setLoading] = useState(true);
  const [feedItems, setFeedItems] = useState([]);
  const [commentText, setCommentText] = useState({}); // { itemId: commentString }

  useEffect(() => {
    const fetchFeed = async () => {
      setLoading(true);
      try {
        // Replace with your actual API endpoint for fetching social feed
        const response = await fetch('https://api.example.com/social/feed');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setFeedItems(data);
      } catch (error) {
        console.error('Failed to fetch social feed:', error);
        addNotification({
          type: 'error',
          title: t('error'),
          message: t('Failed to load social feed')
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, [addNotification, t]);

  const handleLike = async (itemId) => {
    if (!isConnected) {
      addNotification({
        type: 'warning',
        title: t('connectWallet'),
        message: t('Please connect your wallet to like posts')
      });
      return;
    }
    try {
      const response = await fetch(`https://api.example.com/social/feed/${itemId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: publicKey.toBase58(),
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setFeedItems(prevItems => prevItems.map(item =>
        item.id === itemId ? { ...item, likes: item.likes + 1, likedByMe: !item.likedByMe } : item
      ));
      addNotification({
        type: 'success',
        title: t('success'),
        message: t('Post liked successfully!')
      });
    } catch (error) {
      console.error('Failed to like post:', error);
      addNotification({
        type: 'error',
        title: t('error'),
        message: t('Failed to like post. Please try again.')
      });
    }
  };

  const handleCommentChange = (itemId, text) => {
    setCommentText(prev => ({ ...prev, [itemId]: text }));
  };

  const handleSubmitComment = async (itemId) => {
    if (!isConnected) {
      addNotification({
        type: 'warning',
        title: t('connectWallet'),
        message: t('Please connect your wallet to comment')
      });
      return;
    }
    const comment = commentText[itemId];
    if (!comment || comment.trim() === '') {
      addNotification({
        type: 'warning',
        title: t('Invalid Comment'),
        message: t('Comment cannot be empty')
      });
      return;
    }

    try {
      const response = await fetch(`https://api.example.com/social/feed/${itemId}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: publicKey.toBase58(),
          comment: comment,
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const newComment = await response.json(); // Assuming API returns the new comment object
      setFeedItems(prevItems => prevItems.map(item =>
        item.id === itemId ? { ...item, comments: [...item.comments, newComment] } : item
      ));
      setCommentText(prev => ({ ...prev, [itemId]: '' })); // Clear comment input
      addNotification({
        type: 'success',
        title: t('success'),
        message: t('Comment submitted successfully!')
      });
    } catch (error) {
      console.error('Failed to submit comment:', error);
      addNotification({
        type: 'error',
        title: t('error'),
        message: t('Failed to submit comment. Please try again.')
      });
    }
  };

  const handleFollow = async (userIdToFollow) => {
    if (!isConnected) {
      addNotification({
        type: 'warning',
        title: t('connectWallet'),
        message: t('Please connect your wallet to follow users')
      });
      return;
    }
    try {
      const response = await fetch(`https://api.example.com/social/follow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          followerId: publicKey.toBase58(),
          followingId: userIdToFollow,
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      addNotification({
        type: 'success',
        title: t('success'),
        message: t('User followed successfully!')
      });
      // Optionally update UI to reflect follow status
    } catch (error) {
      console.error('Failed to follow user:', error);
      addNotification({
        type: 'error',
        title: t('error'),
        message: t('Failed to follow user. Please try again.')
      });
    }
  };

  const renderFeedItem = (item) => {
    const isLiked = item.likedByMe; // Assuming API provides this
    const currentComment = commentText[item.id] || '';

    return (
      <div className="bg-card border border-border rounded-lg p-6 space-y-4">
        <div className="flex items-center space-x-3">
          <UserAvatar address={item.user.address} size="md" />
          <div className="flex-1">
            <p className="font-semibold text-foreground">{item.user.name}</p>
            <p className="text-xs text-muted-foreground">{new Date(item.timestamp).toLocaleString()}</p>
          </div>
          {isConnected && publicKey?.toBase58() !== item.user.address && (
            <button
              onClick={() => handleFollow(item.user.address)}
              className="flex items-center space-x-1 px-3 py-1 bg-primary text-black rounded-full text-sm hover:bg-primary/80 transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              <span>{t('follow')}</span>
            </button>
          )}
        </div>

        {item.type === 'new_nft' && (
          <div>
            <p className="text-muted-foreground mb-3">
              <span className="font-bold text-foreground">{item.user.name}</span> {t('social.createdNewNFT')}
            </p>
            <NFTCard nft={item.nft} />
          </div>
        )}
        {item.type === 'purchase' && (
          <div>
            <p className="text-muted-foreground mb-3">
              <span className="font-bold text-foreground">{item.buyer.name}</span> {t('social.purchasedNFT')}
              <span className="font-bold text-foreground"> {item.nft.name}</span> {t('social.from')}
              <span className="font-bold text-foreground"> {item.seller.name}</span>
            </p>
            <NFTCard nft={item.nft} />
          </div>
        )}
        {item.type === 'listing' && (
          <div>
            <p className="text-muted-foreground mb-3">
              <span className="font-bold text-foreground">{item.user.name}</span> {t('social.listedNFT')}
              <span className="font-bold text-foreground"> {item.nft.name}</span> {t('social.for')}
              <span className="font-bold text-primary"> {item.price} {item.currency.toUpperCase()}</span>
            </p>
            <NFTCard nft={item.nft} />
          </div>
        )}

        <div className="flex items-center space-x-4 border-t border-border pt-4">
          <button
            onClick={() => handleLike(item.id)}
            className={`flex items-center space-x-1 text-sm ${isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            <span>{item.likes} {t('like')}</span>
          </button>
          <button
            className="flex items-center space-x-1 text-sm text-gray-400 hover:text-primary"
          >
            <MessageCircle className="w-5 h-5" />
            <span>{item.comments?.length || 0} {t('comment')}</span>
          </button>
        </div>

        {/* Comments Section */}
        {item.comments && item.comments.length > 0 && (
          <div className="space-y-3 pl-4 border-l border-border">
            {item.comments.map((comment, idx) => (
              <div key={idx} className="flex items-start space-x-3">
                <UserAvatar address={comment.user.address} size="sm" />
                <div>
                  <p className="font-semibold text-foreground text-sm">{comment.user.name}</p>
                  <p className="text-muted-foreground text-sm">{comment.text}</p>
                  <p className="text-xs text-gray-500">{new Date(comment.timestamp).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {isConnected && (
          <div className="flex items-center space-x-3 pt-4 border-t border-border">
            <UserAvatar address={publicKey?.toBase58()} size="sm" />
            <input
              type="text"
              placeholder={t('writeAComment')}
              value={currentComment}
              onChange={(e) => handleCommentChange(item.id, e.target.value)}
              className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary"
            />
            <button
              onClick={() => handleSubmitComment(item.id)}
              className="p-2 bg-primary text-black rounded-lg hover:bg-primary/80 transition-colors"
              disabled={!currentComment.trim()}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-6">{t('social.title')}</h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          feedItems.length > 0 ? (
            <div className="space-y-6">
              {feedItems.map((item) => (
                <React.Fragment key={item.id}>
                  {renderFeedItem(item)}
                </React.Fragment>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-12">
              <p>{t('social.noFeedItems')}</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default SocialFeedPage;


