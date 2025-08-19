import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useWallet } from '../contexts/WalletContext';
import { useNotification } from '../contexts/NotificationContext';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { 
  Wallet as WalletIcon, 
  DollarSign, 
  Image as ImageIcon, 
  RefreshCcw, 
  Send, 
  Receive, 
  Copy, 
  Check,
  ExternalLink
} from 'lucide-react';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import NFTCard from '../components/NFT/NFTCard';
import PriceDisplay from '../components/UI/PriceDisplay';
import Modal from '../components/UI/Modal';

const WalletPage = () => {
  const { t } = useTranslation();
  const { isConnected, publicKey, wallet, disconnect } = useWallet();
  const { addNotification } = useNotification();

  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(0);
  const [cfishBalance, setCfishBalance] = useState(0);
  const [nfts, setNfts] = useState([]);
  const [copied, setCopied] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [sendAmount, setSendAmount] = useState('');
  const [sendRecipient, setSendRecipient] = useState('');
  const [sendCurrency, setSendCurrency] = useState('sol');

  useEffect(() => {
    const fetchWalletData = async () => {
      setLoading(true);
      try {
        // Fetch SOL balance
        const solResponse = await fetch(`https://api.example.com/wallet/${publicKey.toBase58()}/sol-balance`);
        if (!solResponse.ok) {
          throw new Error(`HTTP error! status: ${solResponse.status}`);
        }
        const solData = await solResponse.json();
        setBalance(solData.balance);

        // Fetch CFISH balance
        const cfishResponse = await fetch(`https://api.example.com/wallet/${publicKey.toBase58()}/cfish-balance`);
        if (!cfishResponse.ok) {
          throw new Error(`HTTP error! status: ${cfishResponse.status}`);
        }
        const cfishData = await cfishResponse.json();
        setCfishBalance(cfishData.balance);

        // Fetch NFTs
        const nftsResponse = await fetch(`https://api.example.com/wallet/${publicKey.toBase58()}/nfts`);
        if (!nftsResponse.ok) {
          throw new Error(`HTTP error! status: ${nftsResponse.status}`);
        }
        const nftsData = await nftsResponse.json();
        setNfts(nftsData);

      } catch (error) {
        console.error('Failed to fetch wallet data:', error);
        addNotification({
          type: 'error',
          title: t('error'),
          message: t('Failed to load wallet data')
        });
      } finally {
        setLoading(false);
      }
    };

    if (isConnected) {
      fetchWalletData();
    }
  }, [isConnected, addNotification, t]);

  const handleCopyAddress = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey.toBase58());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      addNotification({
        type: 'success',
        title: t('success'),
        message: t('Address copied to clipboard')
      });
    }
  };

  const handleSend = async () => {
    if (!sendRecipient || !sendAmount || parseFloat(sendAmount) <= 0) {
      addNotification({
        type: 'warning',
        title: t('Invalid Input'),
        message: t('Please enter valid recipient and amount')
      });
      return;
    }

    setLoading(true);
    try {
      const transactionType = sendCurrency === 'sol' ? 'send-sol' : 'send-cfish';
      const response = await fetch(`https://api.example.com/wallet/${publicKey.toBase58()}/${transactionType}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add authorization headers if needed
        },
        body: JSON.stringify({
          recipient: sendRecipient,
          amount: parseFloat(sendAmount),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      // Assuming the API returns the new balances after a successful transaction
      const updatedBalances = await response.json();
      setBalance(updatedBalances.solBalance);
      setCfishBalance(updatedBalances.cfishBalance);

      addNotification({
        type: 'success',
        title: t('success'),
        message: `${t('Sent')} ${sendAmount} ${sendCurrency.toUpperCase()} ${t('to')} ${sendRecipient.slice(0, 6)}...${sendRecipient.slice(-4)}`
      });
      setShowSendModal(false);
      setSendAmount('');
      setSendRecipient('');
    } catch (error) {
      addNotification({
        type: 'error',
        title: t('error'),
        message: t('Transaction failed. Please try again.')
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">{t('wallet.connectYourWallet')}</h2>
          <p className="text-gray-400 mb-6">{t('wallet.connectToViewAssets')}</p>
          <WalletMultiButton
            className="!bg-gradient-primary !text-black !border-none !rounded-full !font-semibold !px-6 !py-3 !text-lg hover:!shadow-lg hover:!shadow-primary/25 !transition-all !duration-300 hover:!scale-105"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-6">{t('wallet.myWallet')}</h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Wallet Info Card */}
            <div className="lg:col-span-1 bg-card border border-border rounded-lg p-6 space-y-6">
              <div className="flex items-center space-x-4">
                <WalletIcon className="w-8 h-8 text-primary" />
                <div>
                  <h2 className="text-xl font-semibold text-foreground">{t('wallet.walletAddress')}</h2>
                  <p className="text-muted-foreground text-sm font-mono">
                    {publicKey?.toBase58().slice(0, 6)}...{publicKey?.toBase58().slice(-6)}
                  </p>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleCopyAddress}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                >
                  {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? t('copied') : t('copyAddress')}</span>
                </button>
                <a
                  href={`https://solscan.io/account/${publicKey?.toBase58()}?cluster=devnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>{t('viewOnExplorer')}</span>
                </a>
              </div>

              <div className="border-t border-border pt-6 space-y-4">
                <h3 className="text-lg font-semibold text-foreground">{t('wallet.balances')}</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-5 h-5 text-yellow-400" />
                    <span className="text-muted-foreground">SOL {t('wallet.balance')}</span>
                  </div>
                  <PriceDisplay price={balance} currency="SOL" size="md" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ImageIcon className="w-5 h-5 text-primary" />
                    <span className="text-muted-foreground">CFISH {t('wallet.balance')}</span>
                  </div>
                  <PriceDisplay price={cfishBalance} currency="CFISH" size="md" />
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowSendModal(true)}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary/80 transition-colors"
                >
                  <Send className="w-4 h-4" />
                  <span>{t('send')}</span>
                </button>
                <button
                  onClick={disconnect}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <RefreshCcw className="w-4 h-4" />
                  <span>{t('disconnect')}</span>
                </button>
              </div>
            </div>

            {/* NFTs in Wallet */}
            <div className="lg:col-span-2 bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">{t('wallet.myNFTs')} ({nfts.length})</h2>
              {nfts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {nfts.map(nft => (
                    <NFTCard key={nft.id} nft={nft} />
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <p>{t('wallet.noNFTsInWallet')}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Send Modal */}
      <Modal
        isOpen={showSendModal}
        onClose={() => setShowSendModal(false)}
        title={t('send')}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {t('recipientAddress')}
            </label>
            <input
              type="text"
              value={sendRecipient}
              onChange={(e) => setSendRecipient(e.target.value)}
              placeholder="Solana Address"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {t('amount')}
            </label>
            <input
              type="number"
              value={sendAmount}
              onChange={(e) => setSendAmount(e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.000001"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {t('currency')}
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="sol"
                  checked={sendCurrency === 'sol'}
                  onChange={(e) => setSendCurrency(e.target.value)}
                  className="mr-2"
                />
                SOL
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="cfish"
                  checked={sendCurrency === 'cfish'}
                  onChange={(e) => setSendCurrency(e.target.value)}
                  className="mr-2"
                />
                CFISH
              </label>
            </div>
          </div>
          <div className="flex items-center justify-end space-x-3">
            <button
              onClick={() => setShowSendModal(false)}
              className="px-4 py-2 text-gray-400 hover:text-white"
            >
              {t('cancel')}
            </button>
            <button
              onClick={handleSend}
              disabled={loading}
              className="px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary/80 disabled:opacity-50"
            >
              {loading ? <LoadingSpinner size="sm" /> : t('send')}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default WalletPage;

