import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useWallet } from '../contexts/WalletContext';
import { useNotification } from '../contexts/NotificationContext';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import Modal from '../components/UI/Modal';

const StakingPage = () => {
  const { t } = useTranslation();
  const { isConnected, publicKey } = useWallet();
  const { addNotification } = useNotification();

  const [loading, setLoading] = useState(true);
  const [cfishBalance, setCfishBalance] = useState(0);
  const [stakedBalance, setStakedBalance] = useState(0);
  const [rewards, setRewards] = useState(0);
  const [showStakeModal, setShowStakeModal] = useState(false);
  const [showUnstakeModal, setShowUnstakeModal] = useState(false);
  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');

  useEffect(() => {
    const fetchStakingData = async () => {
      setLoading(true);
      try {
        // Replace with your actual API endpoint to fetch staking data
        const response = await fetch(`https://api.example.com/staking/${publicKey.toBase58()}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCfishBalance(data.cfishBalance);
        setStakedBalance(data.stakedBalance);
        setRewards(data.rewards);
      } catch (error) {
        console.error('Failed to fetch staking data:', error);
        addNotification({
          type: 'error',
          title: t('error'),
          message: t('Failed to load staking data')
        });
      } finally {
        setLoading(false);
      }
    };

    if (isConnected) {
      fetchStakingData();
    }
  }, [isConnected, addNotification, t]);

  const handleStake = async () => {
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) {
      addNotification({
        type: 'warning',
        title: t('Invalid Amount'),
        message: t('Please enter a valid amount to stake')
      });
      return;
    }
    if (parseFloat(stakeAmount) > cfishBalance) {
      addNotification({
        type: 'warning',
        title: t('Insufficient Balance'),
        message: t('You do not have enough CFISH to stake')
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`https://api.example.com/staking/${publicKey.toBase58()}/stake`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: parseFloat(stakeAmount),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      const updatedData = await response.json();
      setCfishBalance(updatedData.cfishBalance);
      setStakedBalance(updatedData.stakedBalance);

      addNotification({
        type: "success",
        title: t("success"),
        message: `${t("Staked")} ${stakeAmount} CFISH successfully!`,
      });
      setShowStakeModal(false);
      setStakeAmount("");
    } catch (error) {
      addNotification({
        type: 'error',
        title: t('error'),
        message: t('Staking failed. Please try again.')
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUnstake = async () => {
    if (!unstakeAmount || parseFloat(unstakeAmount) <= 0) {
      addNotification({
        type: 'warning',
        title: t('Invalid Amount'),
        message: t('Please enter a valid amount to unstake')
      });
      return;
    }
    if (parseFloat(unstakeAmount) > stakedBalance) {
      addNotification({
        type: 'warning',
        title: t('Insufficient Staked Balance'),
        message: t('You do not have enough staked CFISH to unstake')
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`https://api.example.com/staking/${publicKey.toBase58()}/unstake`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: parseFloat(unstakeAmount),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      const updatedData = await response.json();
      setCfishBalance(updatedData.cfishBalance);
      setStakedBalance(updatedData.stakedBalance);

      addNotification({
        type: "success",
        title: t("success"),
        message: `${t("Unstaked")} ${unstakeAmount} CFISH successfully!`,
      });
      setShowUnstakeModal(false);
      setUnstakeAmount("");
    } catch (error) {
      addNotification({
        type: 'error',
        title: t('error'),
        message: t('Unstaking failed. Please try again.')
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClaimRewards = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://api.example.com/staking/${publicKey.toBase58()}/claim-rewards`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      const updatedData = await response.json();
      setCfishBalance(updatedData.cfishBalance);
      setStakedBalance(updatedData.stakedBalance);
      setRewards(updatedData.rewards);

      addNotification({
        type: "success",
        title: t("success"),
        message: `${t("Claimed")} ${rewards} CFISH rewards successfully!`,
      });
    } catch (error) {
      addNotification({
        type: "error",
        title: t("error"),
        message: t("Claiming rewards failed. Please try again."),
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
          <p className="text-gray-400 mb-6">{t('wallet.connectToViewStaking')}</p>
          {/* WalletMultiButton would be here in a real app, but for simplicity, just a message */}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-6">{t('staking.title')}</h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="bg-card border border-border rounded-lg p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-gray-800 rounded-lg">
                <p className="text-muted-foreground text-sm">{t('staking.yourBalance')}</p>
                <h3 className="text-2xl font-bold text-primary-foreground">{cfishBalance} CFISH</h3>
              </div>
              <div className="p-4 bg-gray-800 rounded-lg">
                <p className="text-muted-foreground text-sm">{t('staking.stakedBalance')}</p>
                <h3 className="text-2xl font-bold text-green-400">{stakedBalance} CFISH</h3>
              </div>
              <div className="p-4 bg-gray-800 rounded-lg">
                <p className="text-muted-foreground text-sm">{t('staking.rewardsEarned')}</p>
                <h3 className="text-2xl font-bold text-yellow-400">{rewards} CFISH</h3>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => setShowStakeModal(true)}
                className="flex-1 px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary/80 transition-colors"
              >
                {t('staking.stake')}
              </button>
              <button
                onClick={() => setShowUnstakeModal(true)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                {t('staking.unstake')}
              </button>
              <button
                onClick={handleClaimRewards}
                disabled={rewards === 0}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {t('staking.claimRewards')}
              </button>
            </div>

            {/* Staking Info / APR etc. */}
            <div className="border-t border-border pt-6 mt-6 space-y-4">
              <h3 className="text-xl font-semibold text-foreground">{t('staking.howItWorks')}</h3>
              <p className="text-muted-foreground">{t('staking.description')}</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>{t('staking.info1')}</li>
                <li>{t('staking.info2')}</li>
                <li>{t('staking.info3')}</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Stake Modal */}
      <Modal
        isOpen={showStakeModal}
        onClose={() => setShowStakeModal(false)}
        title={t('staking.stakeCFISH')}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {t('amountToStake')}
            </label>
            <input
              type="number"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.000001"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary"
            />
            <p className="text-xs text-gray-400 mt-1">{t('yourAvailableBalance')}: {cfishBalance} CFISH</p>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowStakeModal(false)}
              className="px-4 py-2 text-gray-400 hover:text-white"
            >
              {t('cancel')}
            </button>
            <button
              onClick={handleStake}
              disabled={loading}
              className="px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary/80 disabled:opacity-50"
            >
              {loading ? <LoadingSpinner size="sm" /> : t('staking.stake')}
            </button>
          </div>
        </div>
      </Modal>

      {/* Unstake Modal */}
      <Modal
        isOpen={showUnstakeModal}
        onClose={() => setShowUnstakeModal(false)}
        title={t('staking.unstakeCFISH')}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {t('amountToUnstake')}
            </label>
            <input
              type="number"
              value={unstakeAmount}
              onChange={(e) => setUnstakeAmount(e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.000001"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary"
            />
            <p className="text-xs text-gray-400 mt-1">{t('yourStakedBalance')}: {stakedBalance} CFISH</p>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowUnstakeModal(false)}
              className="px-4 py-2 text-gray-400 hover:text-white"
            >
              {t('cancel')}
            </button>
            <button
              onClick={handleUnstake}
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? <LoadingSpinner size="sm" /> : t('staking.unstake')}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default StakingPage;


