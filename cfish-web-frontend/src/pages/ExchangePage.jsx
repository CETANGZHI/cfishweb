import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNotification } from '../contexts/NotificationContext';
import { useWallet } from '../contexts/WalletContext';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import NFTCard from '../components/NFT/NFTCard';
import Modal from '../components/UI/Modal';

const ExchangePage = () => {
  const { t } = useTranslation();
  const { addNotification } = useNotification();
  const { isConnected, publicKey } = useWallet();

  const [loading, setLoading] = useState(true);
  const [myNFTs, setMyNFTs] = useState([]);
  const [availableNFTs, setAvailableNFTs] = useState([]);
  const [selectedMyNFT, setSelectedMyNFT] = useState(null);
  const [selectedTargetNFT, setSelectedTargetNFT] = useState(null);
  const [showProposeSwapModal, setShowProposeSwapModal] = useState(false);
  const [activeTab, setActiveTab] = useState('propose'); // 'propose', 'myProposals', 'incomingProposals'

  useEffect(() => {
    const fetchNFTs = async () => {
      setLoading(true);
      try {
        if (!publicKey) return;

        // Fetch user's NFTs
        const myNFTsResponse = await fetch(`https://api.example.com/profile/${publicKey.toBase58()}/nfts`);
        const myNFTsData = await myNFTsResponse.json();
        setMyNFTs(myNFTsData.nftsCollected || []);

        // Fetch available NFTs for swap (excluding user's own NFTs)
        const availableNFTsResponse = await fetch(`https://api.example.com/nfts/available-for-swap`);
        const availableNFTsData = await availableNFTsResponse.json();
        setAvailableNFTs(availableNFTsData.filter(nft => nft.ownerAddress !== publicKey.toBase58()));

      } catch (error) {
        console.error('Failed to fetch NFTs for exchange:', error);
        addNotification({
          type: 'error',
          title: t('error'),
          message: t('Failed to load NFTs for exchange')
        });
      } finally {
        setLoading(false);
      }
    };

    if (isConnected) {
      fetchNFTs();
    }
  }, [isConnected, publicKey, addNotification, t]);

  const handleProposeSwap = async () => {
    if (!selectedMyNFT || !selectedTargetNFT) {
      addNotification({
        type: 'warning',
        title: t('Invalid Selection'),
        message: t('Please select both your NFT and the target NFT')
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://api.example.com/swap/propose', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          proposerNFTId: selectedMyNFT.id,
          targetNFTId: selectedTargetNFT.id,
          proposerAddress: publicKey.toBase58(),
          targetAddress: selectedTargetNFT.owner.address,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      addNotification({
        type: 'success',
        title: t('success'),
        message: t('Swap proposal submitted successfully!')
      });
      setShowProposeSwapModal(false);
      setSelectedMyNFT(null);
      setSelectedTargetNFT(null);
      // Refresh data or update UI as needed
    } catch (error) {
      console.error('Failed to propose swap:', error);
      addNotification({
        type: 'error',
        title: t('error'),
        message: t('Failed to submit swap proposal. Please try again.')
      });
    } finally {
      setLoading(false);
    }
  };

  const renderNFTSelection = (nfts, onSelect, selectedNFT) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-96 overflow-y-auto p-2 rounded-lg bg-gray-800">
      {nfts.length > 0 ? (
        nfts.map(nft => (
          <div
            key={nft.id}
            className={`relative cursor-pointer rounded-lg overflow-hidden transition-all duration-200 ${selectedNFT?.id === nft.id ? 'border-2 border-primary' : 'border-2 border-transparent'}`}
            onClick={() => onSelect(nft)}
          >
            <NFTCard nft={nft} />
            {selectedNFT?.id === nft.id && (
              <div className="absolute inset-0 bg-primary/30 flex items-center justify-center">
                <span className="text-white text-2xl">✓</span>
              </div>
            )}
          </div>
        ))
      ) : (
        <p className="col-span-full text-center text-gray-400 py-8">{t('noNFTsAvailable')}</p>
      )}
    </div>
  );

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">{t('wallet.connectYourWallet')}</h2>
          <p className="text-gray-400 mb-6">{t('wallet.connectToUseExchange')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-6">{t('exchange.title')}</h1>

        <div className="flex justify-center mb-6">
          <div className="bg-card p-1 rounded-lg flex space-x-1">
            <button
              onClick={() => setActiveTab('propose')}
              className={`py-2 px-4 rounded-md text-sm font-medium ${
                activeTab === 'propose' ? 'bg-primary text-black' : 'text-gray-400 hover:text-white'
              }`}
            >
              {t('exchange.proposeSwap')}
            </button>
            <button
              onClick={() => setActiveTab('myProposals')}
              className={`py-2 px-4 rounded-md text-sm font-medium ${
                activeTab === 'myProposals' ? 'bg-primary text-black' : 'text-gray-400 hover:text-white'
              }`}
            >
              {t('exchange.myProposals')}
            </button>
            <button
              onClick={() => setActiveTab('incomingProposals')}
              className={`py-2 px-4 rounded-md text-sm font-medium ${
                activeTab === 'incomingProposals' ? 'bg-primary text-black' : 'text-gray-400 hover:text-white'
              }`}
            >
              {t('exchange.incomingProposals')}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="bg-card border border-border rounded-lg p-6 space-y-6">
            {activeTab === 'propose' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">{t('exchange.yourNFTsForSwap')}</h3>
                  {renderNFTSelection(myNFTs, setSelectedMyNFT, selectedMyNFT)}
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4">{t('exchange.targetNFTsForSwap')}</h3>
                  {renderNFTSelection(availableNFTs, setSelectedTargetNFT, selectedTargetNFT)}
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowProposeSwapModal(true)}
                    disabled={!selectedMyNFT || !selectedTargetNFT}
                    className="px-6 py-3 bg-primary text-black rounded-lg hover:bg-primary/80 transition-colors disabled:opacity-50"
                  >
                    {t('exchange.proposeSwap')}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'myProposals' && (
              <div>
                <h3 className="text-xl font-semibold mb-4">{t('exchange.mySentProposals')}</h3>
                <p className="text-gray-400">{t('exchange.noSentProposals')}</p>
                {/* Future: Render list of sent proposals */}
              </div>
            )}

            {activeTab === 'incomingProposals' && (
              <div>
                <h3 className="text-xl font-semibold mb-4">{t('exchange.myReceivedProposals')}</h3>
                <p className="text-gray-400">{t('exchange.noReceivedProposals')}</p>
                {/* Future: Render list of received proposals */}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Propose Swap Confirmation Modal */}
      <Modal
        isOpen={showProposeSwapModal}
        onClose={() => setShowProposeSwapModal(false)}
        title={t('exchange.confirmSwapProposal')}
      >
        {selectedMyNFT && selectedTargetNFT && (
          <div className="space-y-4 text-center">
            <p className="text-lg font-semibold">{t('exchange.youAreProposingToSwap')}</p>
            <div className="flex justify-around items-center">
              <div className="flex flex-col items-center">
                <NFTCard nft={selectedMyNFT} />
                <p className="mt-2 text-sm font-medium">{t('exchange.yourNFT')}</p>
              </div>
              <span className="text-2xl font-bold mx-4">↔️</span>
              <div className="flex flex-col items-center">
                <NFTCard nft={selectedTargetNFT} />
                <p className="mt-2 text-sm font-medium">{t('exchange.theirNFT')}</p>
              </div>
            </div>
            <p className="text-sm text-gray-400">{t('exchange.swapDisclaimer')}</p>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowProposeSwapModal(false)}
                className="px-4 py-2 text-gray-400 hover:text-white"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleProposeSwap}
                disabled={loading}
                className="px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary/80 disabled:opacity-50"
              >
                {loading ? <LoadingSpinner size="sm" /> : t('exchange.confirmProposal')}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ExchangePage;


