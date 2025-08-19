import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNotification } from '../contexts/NotificationContext';
import { useWallet } from '../contexts/WalletContext';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import Modal from '../components/UI/Modal';

const ExchangePage = () => {
  const { t } = useTranslation();
  const { addNotification } = useNotification();
  const { isConnected, publicKey } = useWallet();

  const [loading, setLoading] = useState(true);
  const [solBalance, setSolBalance] = useState(0);
  const [cfishBalance, setCfishBalance] = useState(0);
  const [exchangeRate, setExchangeRate] = useState(0); // CFISH per SOL
  const [solAmount, setSolAmount] = useState('');
  const [cfishAmount, setCfishAmount] = useState('');
  const [exchangeDirection, setExchangeDirection] = useState('solToCfish'); // 'solToCfish' or 'cfishToSol'

  useEffect(() => {
    const fetchExchangeData = async () => {
      setLoading(true);
      try {
        // Fetch balances
        const solResponse = await fetch(`https://api.example.com/wallet/${publicKey.toBase58()}/sol-balance`);
        const solData = await solResponse.json();
        setSolBalance(solData.balance);

        const cfishResponse = await fetch(`https://api.example.com/wallet/${publicKey.toBase58()}/cfish-balance`);
        const cfishData = await cfishResponse.json();
        setCfishBalance(cfishData.balance);

        // Fetch exchange rate
        const rateResponse = await fetch('https://api.example.com/exchange/rate');
        const rateData = await rateResponse.json();
        setExchangeRate(rateData.cfishPerSol);

      } catch (error) {
        console.error('Failed to fetch exchange data:', error);
        addNotification({
          type: 'error',
          title: t('error'),
          message: t('Failed to load exchange data')
        });
      } finally {
        setLoading(false);
      }
    };

    if (isConnected && publicKey) {
      fetchExchangeData();
    }
  }, [isConnected, publicKey, addNotification, t]);

  useEffect(() => {
    if (exchangeDirection === 'solToCfish' && solAmount) {
      setCfishAmount((parseFloat(solAmount) * exchangeRate).toFixed(6));
    } else if (exchangeDirection === 'cfishToSol' && cfishAmount) {
      setSolAmount((parseFloat(cfishAmount) / exchangeRate).toFixed(6));
    }
  }, [solAmount, cfishAmount, exchangeRate, exchangeDirection]);

  const handleAmountChange = (e, type) => {
    const value = e.target.value;
    if (type === 'sol') {
      setSolAmount(value);
      setExchangeDirection('solToCfish');
    } else {
      setCfishAmount(value);
      setExchangeDirection('cfishToSol');
    }
  };

  const handleExchange = async () => {
    if (exchangeDirection === 'solToCfish') {
      if (!solAmount || parseFloat(solAmount) <= 0) {
        addNotification({
          type: 'warning',
          title: t('Invalid Amount'),
          message: t('Please enter a valid SOL amount to exchange')
        });
        return;
      }
      if (parseFloat(solAmount) > solBalance) {
        addNotification({
          type: 'warning',
          title: t('Insufficient Balance'),
          message: t('You do not have enough SOL for this exchange')
        });
        return;
      }
    } else {
      if (!cfishAmount || parseFloat(cfishAmount) <= 0) {
        addNotification({
          type: 'warning',
          title: t('Invalid Amount'),
          message: t('Please enter a valid CFISH amount to exchange')
        });
        return;
      }
      if (parseFloat(cfishAmount) > cfishBalance) {
        addNotification({
          type: 'warning',
          title: t('Insufficient Balance'),
          message: t('You do not have enough CFISH for this exchange')
        });
        return;
      }
    }

    setLoading(true);
    try {
      const endpoint = exchangeDirection === 'solToCfish' ? 'sol-to-cfish' : 'cfish-to-sol';
      const amountToSend = exchangeDirection === 'solToCfish' ? parseFloat(solAmount) : parseFloat(cfishAmount);

      const response = await fetch(`https://api.example.com/exchange/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization headers if needed
        },
        body: JSON.stringify({
          walletAddress: publicKey.toBase58(),
          amount: amountToSend,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setSolBalance(result.solBalance);
      setCfishBalance(result.cfishBalance);

      addNotification({
        type: 'success',
        title: t('success'),
        message: t('Exchange successful!')
      });
      setSolAmount('');
      setCfishAmount('');
    } catch (error) {
      console.error('Exchange failed:', error);
      addNotification({
        type: 'error',
        title: t('error'),
        message: t('Exchange failed. Please try again.')
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
          <p className="text-gray-400 mb-6">{t('wallet.connectToUseExchange')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-6">{t('exchange.title')}</h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="bg-card border border-border rounded-lg p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-muted-foreground text-sm">{t('exchange.yourSOLBalance')}</p>
                <h3 className="text-2xl font-bold text-primary-foreground">{solBalance.toFixed(6)} SOL</h3>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">{t('exchange.yourCFISHBalance')}</p>
                <h3 className="text-2xl font-bold text-green-400">{cfishBalance.toFixed(6)} CFISH</h3>
              </div>
            </div>

            <div className="border-t border-border pt-6 mt-6 space-y-4">
              <h3 className="text-xl font-semibold text-foreground">{t('exchange.exchangeRate')}</h3>
              <p className="text-muted-foreground">
                1 SOL = <span className="font-bold text-primary">{exchangeRate.toFixed(6)} CFISH</span>
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t('exchange.solAmount')}
                </label>
                <input
                  type="number"
                  value={solAmount}
                  onChange={(e) => handleAmountChange(e, 'sol')}
                  placeholder="0.00"
                  min="0"
                  step="0.000001"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t('exchange.cfishAmount')}
                </label>
                <input
                  type="number"
                  value={cfishAmount}
                  onChange={(e) => handleAmountChange(e, 'cfish')}
                  placeholder="0.00"
                  min="0"
                  step="0.000001"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary"
                />
              </div>
              <button
                onClick={handleExchange}
                disabled={loading || (!solAmount && !cfishAmount) || (exchangeDirection === 'solToCfish' && parseFloat(solAmount) > solBalance) || (exchangeDirection === 'cfishToSol' && parseFloat(cfishAmount) > cfishBalance)}
                className="w-full px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary/80 transition-colors disabled:opacity-50"
              >
                {loading ? <LoadingSpinner size="sm" /> : t('exchange.performExchange')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExchangePage;


