import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import Navbar from './components/Navbar';
import { NotificationProvider } from './components/NotificationSystem';
import { LanguageProvider } from './components/LanguageProvider';
import { ErrorFallback } from './components/PerformanceOptimization';
import {
  LazyHomePage,
  LazyMarketplacePage,
  LazyNFTDetailPage,
  LazyCreateNFTPage,
  LazyUserDashboardPage,
  LazyDataAnalyticsPage,
  LazyStakingGovernancePage,
  LazyWalletPage,
  LazySettingsPage,
  LazyBarterPage,
  LazyCommunityPage,
  LazyFavoritesCartPage,
  LazyHelpFAQPage,
  LazyLoginPage,
  LazyAboutUsPage,
  LazySellerAlbumPage,
  LazyNotificationCenterPage,
  LazyUserReviewsCommentsPage,
  LazyFollowSubscribePage,
  LazyBulkOperationsPage,
  LazyActivityCalendarPage,
  LazyIntentPoolPage,
  LazyReferralCommissionPage,
  LazyNFTMintingPage,
  LazyAuctionManagementPage,
  LazyDisputeResolutionPage
} from './utils/lazyRoutes';

import './App.css';

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <LanguageProvider>
        <NotificationProvider>
          <Router>
            <div className="min-h-screen bg-background text-foreground">
              <Navbar />
              <Routes>
                <Route path="/" element={<LazyHomePage />} />
                <Route path="/marketplace" element={<LazyMarketplacePage />} />
                <Route path="/nft/:id" element={<LazyNFTDetailPage />} />
                <Route path="/staking" element={<LazyStakingGovernancePage />} />
                <Route path="/favorites" element={<LazyFavoritesCartPage />} />
              <Route path="/create" element={<LazyCreateNFTPage />} />
              <Route path="/dashboard" element={<LazyUserDashboardPage />} />
              <Route path="/barter" element={<LazyBarterPage />} />
              <Route path="/community" element={<LazyCommunityPage />} />
              <Route path="/wallet" element={<LazyWalletPage />} />
              <Route path="/settings" element={<LazySettingsPage />} />
              <Route path="/help" element={<LazyHelpFAQPage />} />
              <Route path="/login" element={<LazyLoginPage />} />
              <Route path="/about" element={<LazyAboutUsPage />} />
              <Route path="/seller-album" element={<LazySellerAlbumPage />} />
              <Route path="/notifications" element={<LazyNotificationCenterPage />} />
              <Route path="/reviews" element={<LazyUserReviewsCommentsPage />} />
              <Route path="/follow-subscribe" element={<LazyFollowSubscribePage />} />
              <Route path="/analytics" element={<LazyDataAnalyticsPage />} />
              <Route path="/bulk-operations" element={<LazyBulkOperationsPage />} />
              <Route path="/calendar" element={<LazyActivityCalendarPage />} />
              <Route path="/intent-pool" element={<LazyIntentPoolPage />} />
              <Route path="/referral-commission" element={<LazyReferralCommissionPage />} />
              <Route path="/mint" element={<LazyNFTMintingPage />} />
              <Route path="/auction-management" element={<LazyAuctionManagementPage />} />
              <Route path="/dispute-resolution" element={<LazyDisputeResolutionPage />} />
            </Routes>
          </div>
        </Router>
      </NotificationProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;

