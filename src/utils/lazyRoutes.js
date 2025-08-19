import { lazy } from 'react';
import { createLazyRoute } from '../components/PerformanceOptimization';

// 懒加载页面组件
export const LazyHomePage = createLazyRoute(
  () => import('../pages/HomePage'),
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
      <p className="text-muted-foreground">Loading Home...</p>
    </div>
  </div>
);

export const LazyMarketplacePage = createLazyRoute(
  () => import('../pages/MarketplacePage'),
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
      <p className="text-muted-foreground">Loading Marketplace...</p>
    </div>
  </div>
);

export const LazyNFTDetailPage = createLazyRoute(
  () => import('../pages/NFTDetailPage'),
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
      <p className="text-muted-foreground">Loading NFT Details...</p>
    </div>
  </div>
);

export const LazyCreateNFTPage = createLazyRoute(
  () => import('../pages/CreateNFTPage'),
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
      <p className="text-muted-foreground">Loading Create NFT...</p>
    </div>
  </div>
);

export const LazyUserDashboardPage = createLazyRoute(
  () => import('../pages/UserDashboardPageSimple'),
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
      <p className="text-muted-foreground">Loading Dashboard...</p>
    </div>
  </div>
);

export const LazyDataAnalyticsPage = createLazyRoute(
  () => import('../pages/DataAnalyticsPage'),
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
      <p className="text-muted-foreground">Loading Analytics...</p>
    </div>
  </div>
);

export const LazyStakingGovernancePage = createLazyRoute(
  () => import('../pages/StakingGovernancePage'),
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
      <p className="text-muted-foreground">Loading Staking...</p>
    </div>
  </div>
);

export const LazyWalletPage = createLazyRoute(
  () => import('../pages/WalletPage'),
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
      <p className="text-muted-foreground">Loading Wallet...</p>
    </div>
  </div>
);

export const LazySettingsPage = createLazyRoute(
  () => import('../pages/SettingsPage'),
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
      <p className="text-muted-foreground">Loading Settings...</p>
    </div>
  </div>
);

// 其他页面的懒加载
export const LazyBarterPage = createLazyRoute(() => import('../pages/BarterPage'));
export const LazyCommunityPage = createLazyRoute(() => import('../pages/CommunityPage'));
export const LazyFavoritesCartPage = createLazyRoute(() => import('../pages/FavoritesCartPage'));
export const LazyHelpFAQPage = createLazyRoute(() => import('../pages/HelpFAQPage'));

export const LazyAboutUsPage = createLazyRoute(() => import('../pages/AboutUsPage'));

// 新增功能页面
export const LazySellerAlbumPage = createLazyRoute(() => import('../pages/SellerAlbumPage'));
export const LazyNotificationCenterPage = createLazyRoute(() => import('../pages/NotificationCenterPage'));
export const LazyUserReviewsCommentsPage = createLazyRoute(() => import('../pages/UserReviewsCommentsPage'));
export const LazyFollowSubscribePage = createLazyRoute(() => import('../pages/FollowSubscribePage'));
export const LazyBulkOperationsPage = createLazyRoute(() => import('../pages/BulkOperationsPage'));
export const LazyActivityCalendarPage = createLazyRoute(() => import('../pages/ActivityCalendarPage'));
export const LazyIntentPoolPage = createLazyRoute(() => import('../pages/IntentPoolPage'));
export const LazyReferralCommissionPage = createLazyRoute(() => import('../pages/ReferralCommissionPage'));
export const LazyNFTMintingPage = createLazyRoute(() => import('../pages/NFTMintingPage'));
export const LazyAuctionManagementPage = createLazyRoute(() => import('../pages/AuctionManagementPage'));
export const LazyDisputeResolutionPage = createLazyRoute(() => import('../pages/DisputeResolutionPage'));

