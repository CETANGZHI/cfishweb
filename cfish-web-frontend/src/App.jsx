import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import { WalletProvider } from './contexts/WalletContext';
import { NotificationProvider } from './contexts/NotificationContext';
import './i18n';
import './App.css';

// Layout Components
import Layout from './components/Layout/Layout';
import LoadingSpinner from './components/UI/LoadingSpinner';
import FloatingNFTs from './components/UI/FloatingNFTs'; // Import FloatingNFTs component

// Lazy load pages for better performance
const HomePage = React.lazy(() => import('./pages/HomePage'));
const NFTDetailPage = React.lazy(() => import('./pages/NFTDetailPage'));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'));
const CreateNFTPage = React.lazy(() => import('./pages/CreateNFTPage'));
const MarketplacePage = React.lazy(() => import('./pages/MarketplacePage'));
const CollectionsPage = React.lazy(() => import('./pages/CollectionsPage'));
const AlbumsPage = React.lazy(() => import('./pages/AlbumsPage'));
const StakingPage = React.lazy(() => import('./pages/StakingPage'));
const PublishPage = React.lazy(() => import('./pages/PublishPage'));
const WalletPage = React.lazy(() => import('./pages/WalletPage'));
const SettingsPage = React.lazy(() => import('./pages/SettingsPage'));
const NotificationCenterPage = React.lazy(() => import('./pages/NotificationCenterPage'));
const AuctionPage = React.lazy(() => import('./pages/AuctionPage'));
const ExchangePage = React.lazy(() => import('./pages/ExchangePage'));
const GovernancePage = React.lazy(() => import('./pages/GovernancePage'));
const SocialFeedPage = React.lazy(() => import('./pages/SocialFeedPage'));
const AnalyticsPage = React.lazy(() => import('./pages/AnalyticsPage'));
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'));
const TokenExchangePage = React.lazy(() => import('./pages/TokenExchangePage'));

function App() {
  return (
    <AppProvider>
      <WalletProvider>
        <NotificationProvider>
          <Router>
            <div className="min-h-screen bg-background text-foreground">
              {/* Animated Background */}
              <div className="animated-bg"></div>
              
              {/* Floating NFT Icons */}
              <FloatingNFTs /> {/* Integrated FloatingNFTs component */}
              
              <Layout>
                <Suspense fallback={<LoadingSpinner />}>
                  <Routes>
                    {/* Main Pages */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/nft/:id" element={<NFTDetailPage />} />
                    <Route path="/profile/:address?" element={<ProfilePage />} />
                    <Route path="/create" element={<CreateNFTPage />} />
                    <Route path="/marketplace" element={<MarketplacePage />} />
                    <Route path="/collections" element={<CollectionsPage />} />
                    <Route path="/collections/:id" element={<CollectionsPage />} />
                    <Route path="/albums" element={<AlbumsPage />} />
                    <Route path="/albums/:id" element={<AlbumsPage />} />
                    <Route path="/staking" element={<StakingPage />} />
                    <Route path="/publish" element={<PublishPage />} />
                    <Route path="/wallet" element={<WalletPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/notifications" element={<NotificationCenterPage />} />
                    <Route path="/auction" element={<AuctionPage />} />
                    <Route path="/exchange" element={<ExchangePage />} />
                    <Route path="/governance" element={<GovernancePage />} />
                    <Route path="/social" element={<SocialFeedPage />} />
                    <Route path="/analytics" element={<AnalyticsPage />} />
                    <Route path="/token-exchange" element={<TokenExchangePage />} />
                    
                    {/* Legacy routes for compatibility */}
                    <Route path="/explore" element={<MarketplacePage />} />
                    <Route path="/resources" element={<SettingsPage />} />
                    
                    {/* 404 Page */}
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </Suspense>
              </Layout>
            </div>
          </Router>
        </NotificationProvider>
      </WalletProvider>
    </AppProvider>
  );
}

export default App;


