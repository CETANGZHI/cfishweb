import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNotification } from '../contexts/NotificationContext';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import NFTCard from '../components/NFT/NFTCard';
import Modal from '../components/UI/Modal';

const AuctionPage = () => {
  const { t } = useTranslation();
  const { addNotification } = useNotification();

  const [loading, setLoading] = useState(true);
  const [auctions, setAuctions] = useState([]);
  const [activeTab, setActiveTab] = useState('live'); // 'live', 'ended', 'myAuctions'
  const [showPlaceBidModal, setShowPlaceBidModal] = useState(false);
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [bidAmount, setBidAmount] = useState('');

  useEffect(() => {
    const fetchAuctions = async () => {
      setLoading(true);
      try {
        // Replace with your actual API endpoint for fetching auctions
        const response = await fetch(`https://api.example.com/auctions?status=${activeTab}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setAuctions(data);
      } catch (error) {
        console.error('Failed to fetch auctions:', error);
        addNotification({
          type: 'error',
          title: t('error'),
          message: t('Failed to load auctions')
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();
  }, [activeTab, addNotification, t]);

  const handlePlaceBid = async () => {
    if (!bidAmount || parseFloat(bidAmount) <= 0) {
      addNotification({
        type: 'warning',
        title: t('Invalid Amount'),
        message: t('Please enter a valid bid amount')
      });
      return;
    }
    if (selectedAuction && parseFloat(bidAmount) <= selectedAuction.currentBid) {
      addNotification({
        type: 'warning',
        title: t('Bid Too Low'),
        message: t('Your bid must be higher than the current bid')
      });
      return;
    }

    setLoading(true);
    try {
      // Simulate placing a bid
      const response = await fetch(`https://api.example.com/auctions/${selectedAuction.id}/bid`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization headers if needed
        },
        body: JSON.stringify({
          amount: parseFloat(bidAmount),
          // Add wallet address or user ID if needed
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      addNotification({
        type: 'success',
        title: t('success'),
        message: `${t('Bid of')} ${bidAmount} ${selectedAuction.currency.toUpperCase()} ${t('placed successfully on')} ${selectedAuction.name}`
      });
      setShowPlaceBidModal(false);
      setBidAmount('');
      // Refresh auctions to show updated bid
      // In a real app, you might update just the selected auction or use websockets
      // For now, we'll just re-fetch all auctions for the active tab
      setLoading(false); // Temporarily set to false before re-fetching
      const responseRefresh = await fetch(`https://api.example.com/auctions?status=${activeTab}`);
      if (!responseRefresh.ok) {
        throw new Error(`HTTP error! status: ${responseRefresh.status}`);
      }
      const dataRefresh = await responseRefresh.json();
      setAuctions(dataRefresh);

    } catch (error) {
      addNotification({
        type: 'error',
        title: t('error'),
        message: t('Failed to place bid. Please try again.')
      });
    } finally {
      setLoading(false);
    }
  };

  const openPlaceBidModal = (auction) => {
    setSelectedAuction(auction);
    setBidAmount(auction.currentBid ? (auction.currentBid + 0.1).toFixed(2) : auction.startingBid.toFixed(2));
    setShowPlaceBidModal(true);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-6">{t('auction.title')}</h1>

        <div className="flex justify-center mb-6">
          <div className="bg-card p-1 rounded-lg flex space-x-1">
            <button
              onClick={() => setActiveTab('live')}
              className={`py-2 px-4 rounded-md text-sm font-medium ${
                activeTab === 'live' ? 'bg-primary text-black' : 'text-gray-400 hover:text-white'
              }`}
            >
              {t('auction.liveAuctions')}
            </button>
            <button
              onClick={() => setActiveTab('ended')}
              className={`py-2 px-4 rounded-md text-sm font-medium ${
                activeTab === 'ended' ? 'bg-primary text-black' : 'text-gray-400 hover:text-white'
              }`}
            >
              {t('auction.endedAuctions')}
            </button>
            <button
              onClick={() => setActiveTab('myAuctions')}
              className={`py-2 px-4 rounded-md text-sm font-medium ${
                activeTab === 'myAuctions' ? 'bg-primary text-black' : 'text-gray-400 hover:text-white'
              }`}
            >
              {t('auction.myAuctions')}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          auctions.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {auctions.map(auction => (
                <NFTCard
                  key={auction.id}
                  nft={{
                    id: auction.id,
                    name: auction.name,
                    image: auction.image,
                    price: auction.currentBid || auction.startingBid,
                    currency: auction.currency,
                    commission: auction.commission,
                    rarity: auction.rarity,
                    owner: auction.owner,
                    // Add other relevant auction details to NFTCard if needed
                  }}
                  onClick={() => openPlaceBidModal(auction)}
                  showBidButton={activeTab === 'live'}
                  bidButtonText={t('auction.placeBid')}
                />
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-12">
              <p>{t('auction.noAuctionsFound')}</p>
            </div>
          )
        )}
      </div>

      {/* Place Bid Modal */}
      <Modal
        isOpen={showPlaceBidModal}
        onClose={() => setShowPlaceBidModal(false)}
        title={t('auction.placeBidOn') + ' ' + (selectedAuction?.name || '')}
      >
        {selectedAuction && (
          <div className="space-y-4">
            <p className="text-muted-foreground">
              {t('auction.currentBid')}: <span className="font-bold">{selectedAuction.currentBid} {selectedAuction.currency.toUpperCase()}</span>
            </p>
            <p className="text-muted-foreground">
              {t('auction.minimumBid')}: <span className="font-bold">{(selectedAuction.currentBid ? (selectedAuction.currentBid + 0.1) : selectedAuction.startingBid).toFixed(2)} {selectedAuction.currency.toUpperCase()}</span>
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('amount')}
              </label>
              <input
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                placeholder="0.00"
                min={(selectedAuction.currentBid ? (selectedAuction.currentBid + 0.1) : selectedAuction.startingBid).toFixed(2)}
                step="0.01"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowPlaceBidModal(false)}
                className="px-4 py-2 text-gray-400 hover:text-white"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handlePlaceBid}
                disabled={loading}
                className="px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary/80 disabled:opacity-50"
              >
                {loading ? <LoadingSpinner size="sm" /> : t('auction.placeBid')}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AuctionPage;


