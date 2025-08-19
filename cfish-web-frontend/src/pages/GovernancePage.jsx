import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNotification } from '../contexts/NotificationContext';
import { useWallet } from '../contexts/WalletContext';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import Modal from '../components/UI/Modal';

const GovernancePage = () => {
  const { t } = useTranslation();
  const { addNotification } = useNotification();
  const { isConnected, publicKey } = useWallet();

  const [loading, setLoading] = useState(true);
  const [proposals, setProposals] = useState([]);
  const [activeTab, setActiveTab] = useState('active'); // 'active', 'passed', 'failed'
  const [showVoteModal, setShowVoteModal] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [voteOption, setVoteOption] = useState(''); // 'for', 'against', 'abstain'

  useEffect(() => {
    const fetchProposals = async () => {
      setLoading(true);
      try {
        // Replace with your actual API endpoint for fetching governance proposals
        const response = await fetch(`https://api.example.com/governance/proposals?status=${activeTab}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProposals(data);
      } catch (error) {
        console.error('Failed to fetch proposals:', error);
        addNotification({
          type: 'error',
          title: t('error'),
          message: t('Failed to load governance proposals')
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, [activeTab, addNotification, t]);

  const handleVote = async () => {
    if (!voteOption) {
      addNotification({
        type: 'warning',
        title: t('No Option Selected'),
        message: t('Please select a vote option')
      });
      return;
    }

    setLoading(true);
    try {
      // Simulate voting transaction
      const response = await fetch(`https://api.example.com/governance/proposals/${selectedProposal.id}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization headers if needed
        },
        body: JSON.stringify({
          walletAddress: publicKey.toBase58(),
          option: voteOption,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      addNotification({
        type: 'success',
        title: t('success'),
        message: `${t('Vote cast successfully for proposal')} ${selectedProposal.title}!`
      });
      setShowVoteModal(false);
      setVoteOption('');
      // Refresh proposals to show updated vote counts
      const responseRefresh = await fetch(`https://api.example.com/governance/proposals?status=${activeTab}`);
      if (!responseRefresh.ok) {
        throw new Error(`HTTP error! status: ${responseRefresh.status}`);
      }
      const dataRefresh = await responseRefresh.json();
      setProposals(dataRefresh);

    } catch (error) {
      addNotification({
        type: 'error',
        title: t('error'),
        message: t('Voting failed. Please try again.')
      });
    } finally {
      setLoading(false);
    }
  };

  const openVoteModal = (proposal) => {
    setSelectedProposal(proposal);
    setVoteOption(''); // Reset vote option
    setShowVoteModal(true);
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">{t('wallet.connectYourWallet')}</h2>
          <p className="text-gray-400 mb-6">{t('wallet.connectToViewGovernance')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-6">{t('governance.title')}</h1>

        <div className="flex justify-center mb-6">
          <div className="bg-card p-1 rounded-lg flex space-x-1">
            <button
              onClick={() => setActiveTab('active')}
              className={`py-2 px-4 rounded-md text-sm font-medium ${
                activeTab === 'active' ? 'bg-primary text-black' : 'text-gray-400 hover:text-white'
              }`}
            >
              {t('governance.activeProposals')}
            </button>
            <button
              onClick={() => setActiveTab('passed')}
              className={`py-2 px-4 rounded-md text-sm font-medium ${
                activeTab === 'passed' ? 'bg-primary text-black' : 'text-gray-400 hover:text-white'
              }`}
            >
              {t('governance.passedProposals')}
            </button>
            <button
              onClick={() => setActiveTab('failed')}
              className={`py-2 px-4 rounded-md text-sm font-medium ${
                activeTab === 'failed' ? 'bg-primary text-black' : 'text-gray-400 hover:text-white'
              }`}
            >
              {t('governance.failedProposals')}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          proposals.length > 0 ? (
            <div className="space-y-6">
              {proposals.map(proposal => (
                <div key={proposal.id} className="bg-card border border-border rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-2">{proposal.title}</h2>
                  <p className="text-muted-foreground text-sm mb-4">{proposal.description}</p>
                  <div className="flex justify-between items-center text-sm text-gray-400 mb-4">
                    <span>{t('governance.proposer')}: {proposal.proposer}</span>
                    <span>{t('governance.endsIn')}: {new Date(proposal.endDate).toLocaleString()}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center mb-4">
                    <div className="p-2 bg-gray-800 rounded-lg">
                      <p className="text-xs text-muted-foreground">{t('governance.for')}</p>
                      <p className="font-bold text-green-400">{proposal.votesFor}</p>
                    </div>
                    <div className="p-2 bg-gray-800 rounded-lg">
                      <p className="text-xs text-muted-foreground">{t('governance.against')}</p>
                      <p className="font-bold text-red-400">{proposal.votesAgainst}</p>
                    </div>
                    <div className="p-2 bg-gray-800 rounded-lg">
                      <p className="text-xs text-muted-foreground">{t('governance.abstain')}</p>
                      <p className="font-bold text-yellow-400">{proposal.votesAbstain}</p>
                    </div>
                  </div>
                  {activeTab === 'active' && (
                    <button
                      onClick={() => openVoteModal(proposal)}
                      className="w-full px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary/80 transition-colors"
                    >
                      {t('governance.vote')}
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-12">
              <p>{t('governance.noProposalsFound')}</p>
            </div>
          )
        )}
      </div>

      {/* Vote Modal */}
      <Modal
        isOpen={showVoteModal}
        onClose={() => setShowVoteModal(false)}
        title={t('governance.voteOnProposal') + ': ' + (selectedProposal?.title || '')}
      >
        {selectedProposal && (
          <div className="space-y-4">
            <p className="text-muted-foreground">{selectedProposal.description}</p>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('governance.yourVote')}
              </label>
              <div className="flex space-x-4">
                <button
                  onClick={() => setVoteOption('for')}
                  className={`flex-1 px-4 py-2 rounded-lg ${voteOption === 'for' ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                >
                  {t('governance.for')}
                </button>
                <button
                  onClick={() => setVoteOption('against')}
                  className={`flex-1 px-4 py-2 rounded-lg ${voteOption === 'against' ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                >
                  {t('governance.against')}
                </button>
                <button
                  onClick={() => setVoteOption('abstain')}
                  className={`flex-1 px-4 py-2 rounded-lg ${voteOption === 'abstain' ? 'bg-yellow-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                >
                  {t('governance.abstain')}
                </button>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowVoteModal(false)}
                className="px-4 py-2 text-gray-400 hover:text-white"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleVote}
                disabled={loading || !voteOption}
                className="px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary/80 disabled:opacity-50"
              >
                {loading ? <LoadingSpinner size="sm" /> : t('governance.submitVote')}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default GovernancePage;


