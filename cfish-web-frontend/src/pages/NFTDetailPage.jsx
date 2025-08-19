import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Heart,
  Eye,
  Clock,
  User,
  ExternalLink,
  MoreHorizontal,
  TrendingUp,
  History,
  Tag,
  Shield,
  Zap,
  Star,
  Flag
} from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';
import { useNotification } from '../contexts/NotificationContext';
import ShareButton from '../components/UI/ShareButton';
import CommissionBadge, { CommissionComparison } from '../components/UI/CommissionBadge';
import PriceDisplay from '../components/UI/PriceDisplay';
import RarityTag from '../components/UI/RarityTag';
import UserAvatar from '../components/UI/UserAvatar';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import Modal from '../components/UI/Modal';

const NFTDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isConnected, publicKey } = useWallet();
  const { addNotification } = useNotification();
  
  const [nft, setNft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [offerAmount, setOfferAmount] = useState('');
  const [offerCurrency, setOfferCurrency] = useState('sol');
  const [reviews, setReviews] = useState([]);
  const [newReviewRating, setNewReviewRating] = useState(0);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDescription, setReportDescription] = useState('');

  useEffect(() => {
    const fetchNFT = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://api.example.com/nft/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setNft(data);
        setLiked(false);
      } catch (error) {
        console.error('Failed to fetch NFT:', error);
        addNotification({
          type: 'error',
          title: t('error'),
          message: t('Failed to load NFT details')
        });
      } finally {
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await fetch(`https://api.example.com/nft/${id}/reviews`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setReviews(data);
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
        addNotification({
          type: 'error',
          title: t('error'),
          message: t('Failed to load reviews')
        });
      }
    };

    fetchNFT();
    fetchReviews();
  }, [id, addNotification, t]);

  const handleLike = () => {
    if (!isConnected) {
      addNotification({
        type: 'warning',
        title: t('connectWallet'),
        message: t('Please connect your wallet to like NFTs')
      });
      return;
    }
    setLiked(!liked);
    setNft(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        likes: prev.stats.likes + (liked ? -1 : 1)
      }
    }));
  };

  const handleBuy = async () => {
    if (!isConnected) {
      addNotification({
        type: 'warning',
        title: t('connectWallet'),
        message: t('Please connect your wallet to purchase NFTs')
      });
      return;
    }
    
    setShowBuyModal(true);
  };

  const confirmPurchase = async (currency) => {
    try {
      const response = await fetch("https://api.example.com/purchase-nft", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nftId: nft.id,
          buyerAddress: publicKey.toString(),
          currency: currency,
          price: nft.price,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      addNotification({
        type: 'success',
        title: t('success'),
        message: `NFT purchased successfully with ${currency.toUpperCase()}!`
      });
      
      setShowBuyModal(false);
    } catch (error) {
      addNotification({
        type: 'error',
        title: t('error'),
        message: t('Purchase failed. Please try again.')
      });
    }
  };

  const handleMakeOffer = async () => {
    if (!isConnected) {
      addNotification({
        type: 'warning',
        title: t('connectWallet'),
        message: t('Please connect your wallet to make offers')
      });
      return;
    }
    
    if (!offerAmount || parseFloat(offerAmount) <= 0) {
      addNotification({
        type: 'warning',
        title: t('Invalid Offer'),
        message: t('Please enter a valid offer amount')
      });
      return;
    }
    
    try {
      const response = await fetch("https://api.example.com/submit-offer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nftId: nft.id,
          offererAddress: publicKey.toString(),
          amount: parseFloat(offerAmount),
          currency: offerCurrency,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      addNotification({
        type: 'success',
        title: t('success'),
        message: `Offer of ${offerAmount} ${offerCurrency.toUpperCase()} submitted successfully!`
      });
      
      setShowOfferModal(false);
      setOfferAmount('');
    } catch (error) {
      addNotification({
        type: 'error',
        title: t('error'),
        message: t('Failed to submit offer. Please try again.')
      });
    }
  };

  const handleSubmitReview = async () => {
    if (!isConnected) {
      addNotification({
        type: 'warning',
        title: t('connectWallet'),
        message: t('Please connect your wallet to submit reviews')
      });
      return;
    }
    if (newReviewRating === 0) {
      addNotification({
        type: 'warning',
        title: t('Invalid Rating'),
        message: t('Please select a rating')
      });
      return;
    }

    try {
      const response = await fetch(`https://api.example.com/nft/${id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nftId: id,
          reviewerAddress: publicKey.toString(),
          rating: newReviewRating,
          comment: newReviewComment,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const newReview = await response.json();
      setReviews(prev => [newReview, ...prev]);
      addNotification({
        type: 'success',
        title: t('success'),
        message: t('Review submitted successfully!')
      });
      setNewReviewRating(0);
      setNewReviewComment('');
    } catch (error) {
      addNotification({
        type: 'error',
        title: t('error'),
        message: t('Failed to submit review. Please try again.')
      });
    }
  };

  const handleReport = async () => {
    if (!isConnected) {
      addNotification({
        type: 'warning',
        title: t('connectWallet'),
        message: t('Please connect your wallet to submit reports')
      });
      return;
    }
    if (!reportReason) {
      addNotification({
        type: 'warning',
        title: t('Invalid Report'),
        message: t('Please select a report reason')
      });
      return;
    }

    try {
      const response = await fetch(`https://api.example.com/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reporterAddress: publicKey.toString(),
          reportedItemId: id,
          reportedItemType: 'nft',
          reason: reportReason,
          description: reportDescription,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      addNotification({
        type: 'success',
        title: t('success'),
        message: t('Report submitted successfully!')
      });
      setShowReportModal(false);
      setReportReason('');
      setReportDescription('');
    } catch (error) {
      addNotification({
        type: 'error',
        title: t('error'),
        message: t('Failed to submit report. Please try again.')
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!nft) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">NFT Not Found</h2>
          <button
            onClick={() => navigate('/marketplace')}
            className="px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary/80"
          >
            Back to Marketplace
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'details', label: t('details') },
    { id: 'history', label: t('history') },
    { id: 'offers', label: t('offers') },
    { id: 'reviews', label: t('reviews') }
  ];

  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-600'}`}
            onClick={() => setNewReviewRating(i + 1)}
            cursor="pointer"
          />
        ))
      }
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Image */}
          <div className="space-y-4">
            <div className="relative bg-gray-900 rounded-lg overflow-hidden">
              <img
                src={nft.image}
                alt={nft.name}
                className="w-full aspect-square object-cover"
              />
              <div className="absolute top-4 right-4 flex items-center space-x-2">
                <ShareButton
                  url={window.location.href}
                  title={nft.name}
                  description={nft.description}
                  imageUrl={nft.image}
                  variant="filled"
                />
                <button
                  onClick={handleLike}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 ${
                    liked ? 'bg-red-500 text-white' : 'bg-gray-800/80 text-gray-300 hover:text-red-400'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={() => setShowReportModal(true)}
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-800/80 text-gray-300 hover:text-red-400 transition-all duration-200 hover:scale-105"
                  title={t('report')}
                >
                  <Flag className="w-4 h-4" />
                </button>
              </div>
              <div className="absolute top-4 left-4">
                <RarityTag rarity={nft.rarity} />
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between text-sm text-gray-400">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>{nft.stats.views}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Heart className="w-4 h-4" />
                  <span>{nft.stats.likes}</span>
                </div>
              </div>
              <div className="text-xs">
                ID: #{nft.id}
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <h1 className="text-3xl font-bold">{nft.name}</h1>
                {nft.collection.verified && (
                  <Shield className="w-5 h-5 text-blue-400" />
                )}
              </div>
              <p className="text-gray-400 mb-4">{nft.description}</p>
              
              {/* Collection */}
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-gray-400">{t('collection')}:</span>
                <span className="text-primary font-medium">{nft.collection.name}</span>
                {nft.collection.verified && (
                  <Shield className="w-4 h-4 text-blue-400" />
                )}
              </div>
            </div>

            {/* Price and Commission */}
            <div className="bg-gray-900 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">{t('price')}</p>
                  <PriceDisplay 
                    price={nft.price} 
                    currency={nft.currency === 'both' ? 'SOL/CFISH' : nft.currency.toUpperCase()}
                    size="lg"
                  />
                </div>
                <div className="text-right">
                  <CommissionBadge 
                    commission={nft.commission} 
                    variant="tooltip"
                    size="lg"
                  />
                </div>
              </div>
              
              <CommissionComparison 
                currentCommission={nft.commission}
                averageCommission={nft.averageCommission}
                className="mb-4"
              />

              {/* Currency Options */}
              {nft.currency === 'both' && (
                <div className="mb-4 p-3 bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-400 mb-2">{t('acceptedCurrency')}:</p>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <span className="bg-purple-600 text-white px-2 py-1 rounded text-xs">SOL</span>
                      <span>{nft.commission}% {t('platformFee')}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="bg-primary text-black px-2 py-1 rounded text-xs">CFISH</span>
                      <span className="text-green-400">{t('freeTransaction')}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={handleBuy}
                  className="flex-1 bg-primary text-black font-semibold py-3 rounded-lg hover:bg-primary/80 transition-colors flex items-center justify-center space-x-2"
                >
                  <Zap className="w-4 h-4" />
                  <span>{t('buyNow')}</span>
                </button>
                <button
                  onClick={() => setShowOfferModal(true)}
                  className="flex-1 bg-gray-700 text-white font-semibold py-3 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  {t('makeOffer')}
                </button>
              </div>
            </div>

            {/* Owner and Creator */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-900 rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-2">{t('owner')}</p>
                <div className="flex items-center space-x-3">
                  <UserAvatar 
                    address={nft.owner.address}
                    username={nft.owner.username}
                    size="sm"
                  />
                  <div>
                    <p className="font-medium">{nft.owner.username}</p>
                    <p className="text-xs text-gray-400">
                      {nft.owner.address.slice(0, 4)}...{nft.owner.address.slice(-4)}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-900 rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-2">{t('creator')}</p>
                <div className="flex items-center space-x-3">
                  <UserAvatar 
                    address={nft.creator.address}
                    username={nft.creator.username}
                    size="sm"
                  />
                  <div>
                    <p className="font-medium">{nft.creator.username}</p>
                    <p className="text-xs text-gray-400">
                      {nft.royalty}% {t('royalty')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tags */}
            {nft.tags && nft.tags.length > 0 && (
              <div>
                <p className="text-sm text-gray-400 mb-2">{t('tags')}</p>
                <div className="flex flex-wrap gap-2">
                  {nft.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm hover:bg-gray-700 cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-12">
          <div className="border-b border-gray-800">
            <nav className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-400 hover:text-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="py-8">
            {activeTab === 'details' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Attributes */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">{t('attributes')}</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {nft.attributes.map((attr, index) => (
                      <div key={index} className="bg-gray-900 rounded-lg p-4 text-center">
                        <p className="text-sm text-gray-400 mb-1">{attr.trait_type}</p>
                        <p className="font-semibold">{attr.value}</p>
                        <p className="text-xs text-gray-500 mt-1">{attr.rarity}% rarity</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional Details */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">{t('details')}</h3>
                  <div className="space-y-2 text-gray-300">
                    <p><strong>{t('contractAddress')}:</strong> {nft.contractAddress}</p>
                    <p><strong>{t('tokenStandard')}:</strong> {nft.tokenStandard}</p>
                    <p><strong>{t('blockchain')}:</strong> {nft.blockchain}</p>
                    <p><strong>{t('lastUpdated')}:</strong> {new Date(nft.lastUpdated).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div>
                <h3 className="text-xl font-semibold mb-4">{t('transactionHistory')}</h3>
                {nft.history && nft.history.length > 0 ? (
                  <div className="space-y-4">
                    {nft.history.map((item, index) => (
                      <div key={index} className="bg-gray-900 rounded-lg p-4 flex items-center space-x-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
                          {item.type === 'mint' && <Tag className="w-5 h-5 text-blue-400" />}
                          {item.type === 'list' && <List className="w-5 h-5 text-yellow-400" />}
                          {item.type === 'sale' && <Zap className="w-5 h-5 text-green-400" />}
                          {item.type === 'transfer' && <ExternalLink className="w-5 h-5 text-purple-400" />}
                        </div>
                        <div>
                          <p className="font-medium text-white">
                            {item.type === 'mint' && t('mintedBy', { user: item.user.username })}
                            {item.type === 'list' && t('listedBy', { user: item.user.username, price: item.price, currency: item.currency.toUpperCase() })}
                            {item.type === 'sale' && t('soldByTo', { seller: item.seller.username, buyer: item.buyer.username, price: item.price, currency: item.currency.toUpperCase() })}
                            {item.type === 'transfer' && t('transferredByTo', { from: item.from.username, to: item.to.username })}
                          </p>
                          <p className="text-sm text-gray-400">{new Date(item.timestamp).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">{t('noTransactionHistory')}</p>
                )}
              </div>
            )}

            {activeTab === 'offers' && (
              <div>
                <h3 className="text-xl font-semibold mb-4">{t('offers')}</h3>
                {nft.offers && nft.offers.length > 0 ? (
                  <div className="space-y-4">
                    {nft.offers.map((offer, index) => (
                      <div key={index} className="bg-gray-900 rounded-lg p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <UserAvatar address={offer.offerer.address} username={offer.offerer.username} size="sm" />
                          <div>
                            <p className="font-medium text-white">{offer.offerer.username}</p>
                            <p className="text-sm text-gray-400">{new Date(offer.timestamp).toLocaleString()}</p>
                          </div>
                        </div>
                        <PriceDisplay price={offer.amount} currency={offer.currency.toUpperCase()} size="md" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">{t('noOffersYet')}</p>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <h3 className="text-xl font-semibold mb-4">{t('reviews')}</h3>
                {reviews.length > 0 ? (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="bg-gray-900 rounded-lg p-4">
                        <div className="flex items-center space-x-3 mb-2">
                          <UserAvatar address={review.reviewer.address} username={review.reviewer.username} size="sm" />
                          <div>
                            <p className="font-medium text-white">{review.reviewer.username}</p>
                            <div className="flex items-center">
                              {renderStars(review.rating)}
                              <span className="text-sm text-gray-400 ml-2">{new Date(review.timestamp).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-300">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">{t('noReviewsYet')}</p>
                )}

                <div className="mt-8 bg-gray-900 rounded-lg p-6">
                  <h4 className="text-lg font-semibold mb-4">{t('submitYourReview')}</h4>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">{t('yourRating')}</label>
                    {renderStars(newReviewRating)}
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">{t('yourComment')}</label>
                    <textarea
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary"
                      rows="4"
                      value={newReviewComment}
                      onChange={(e) => setNewReviewComment(e.target.value)}
                      placeholder={t('writeYourComment')}
                    ></textarea>
                  </div>
                  <button
                    onClick={handleSubmitReview}
                    disabled={!isConnected || newReviewRating === 0}
                    className="px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary/80 disabled:opacity-50"
                  >
                    {t('submitReview')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Buy Modal */}
      <Modal
        isOpen={showBuyModal}
        onClose={() => setShowBuyModal(false)}
        title={t('confirmPurchase')}
      >
        {nft && (
          <div className="space-y-4">
            <p className="text-muted-foreground">
              {t('youAreAboutToBuy')}
              <span className="font-bold text-foreground"> {nft.name} </span>
              {t('from')}
              <span className="font-bold text-foreground"> {nft.owner.username} </span>
              {t('for')}
              <PriceDisplay price={nft.price} currency={nft.currency.toUpperCase()} size="md" />
            </p>
            {nft.currency === 'both' ? (
              <div className="space-y-2">
                <p className="text-sm text-gray-400">{t('choosePaymentMethod')}:</p>
                <button
                  onClick={() => confirmPurchase('sol')}
                  className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  {t('payWithSOL')} ({nft.price} SOL)
                </button>
                <button
                  onClick={() => confirmPurchase('cfish')}
                  className="w-full px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary/80 transition-colors"
                >
                  {t('payWithCFISH')} ({nft.price} CFISH) - {t('freeTransaction')}
                </button>
              </div>
            ) : (
              <button
                onClick={() => confirmPurchase(nft.currency)}
                className="w-full px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary/80 transition-colors"
              >
                {t('confirmPurchase')} ({nft.price} {nft.currency.toUpperCase()})
              </button>
            )}
            <p className="text-xs text-gray-500">{t('purchaseDisclaimer')}</p>
          </div>
        )}
      </Modal>

      {/* Make Offer Modal */}
      <Modal
        isOpen={showOfferModal}
        onClose={() => setShowOfferModal(false)}
        title={t('makeOfferFor') + ' ' + (nft?.name || '')}
      >
        {nft && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('offerAmount')}
              </label>
              <input
                type="number"
                value={offerAmount}
                onChange={(e) => setOfferAmount(e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('offerCurrency')}
              </label>
              <select
                value={offerCurrency}
                onChange={(e) => setOfferCurrency(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary"
              >
                <option value="sol">SOL</option>
                <option value="cfish">CFISH</option>
              </select>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowOfferModal(false)}
                className="px-4 py-2 text-gray-400 hover:text-white"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleMakeOffer}
                disabled={!offerAmount || parseFloat(offerAmount) <= 0}
                className="px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary/80 disabled:opacity-50"
              >
                {t('submitOffer')}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Report Modal */}
      <Modal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        title={t('reportNFT')}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">{t('reasonForReport')}</label>
            <select
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary"
            >
              <option value="">{t('selectReason')}</option>
              <option value="spam">{t('reportReason.spam')}</option>
              <option value="inappropriate">{t('reportReason.inappropriate')}</option>
              <option value="copyright">{t('reportReason.copyright')}</option>
              <option value="scam">{t('reportReason.scam')}</option>
              <option value="other">{t('reportReason.other')}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">{t('additionalDetails')}</label>
            <textarea
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary"
              rows="4"
              value={reportDescription}
              onChange={(e) => setReportDescription(e.target.value)}
              placeholder={t('reportDescriptionPlaceholder')}
            ></textarea>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowReportModal(false)}
              className="px-4 py-2 text-gray-400 hover:text-white"
            >
              {t('cancel')}
            </button>
            <button
              onClick={handleReport}
              disabled={!isConnected || !reportReason}
              className="px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary/80 disabled:opacity-50"
            >
              {t('submitReport')}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default NFTDetailPage;


