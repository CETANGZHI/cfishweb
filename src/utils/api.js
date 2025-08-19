import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/v1'; // Replace with your backend API URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token'); // Assuming token is stored in localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (wallet_address, signature, message) => api.post('/auth/login', { wallet_address, signature, message }),
  refresh: () => api.post('/auth/refresh'),
  logout: () => api.post('/auth/logout'),
};

export const nftApi = {
  getNFTs: (params) => api.get('/nfts', { params }),
  getNFTById: (nftId) => api.get(`/nfts/${nftId}`),
  getNFTHistory: (nftId) => api.get(`/nfts/${nftId}/history`),
  getNFTProperties: (nftId) => api.get(`/nfts/${nftId}/properties`),
  likeNFT: (nftId) => api.post(`/nfts/${nftId}/like`),
  unlikeNFT: (nftId) => api.delete(`/nfts/${nftId}/like`),
  getNFTLikes: (nftId) => api.get(`/nfts/${nftId}/likes`),
};

export const cartApi = {
  addItem: (nft_id) => api.post('/cart/items', { nft_id }),
  getCart: () => api.get('/cart'),
  removeItem: (nft_id) => api.delete(`/cart/items/${nft_id}`),
};

export const notificationApi = {
  getNotifications: () => api.get('/notifications'),
  markAsRead: (notification_id) => api.put(`/notifications/${notification_id}/read`),
  deleteNotification: (notification_id) => api.delete(`/notifications/${notification_id}`),
};

export const userApi = {
  getUserProfile: (userId) => api.get(`/users/${userId}`),
  updateUserProfile: (userId, data) => api.put(`/users/${userId}`, data),
  addSocialLink: (userId, platform, url) => api.post(`/users/${userId}/social-links`, { platform, url }),
  deleteSocialLink: (userId, linkId) => api.delete(`/users/${userId}/social-links/${linkId}`),
  followUser: (userId) => api.post(`/users/${userId}/follow`),
  unfollowUser: (userId) => api.delete(`/users/${userId}/follow`),
  getUserFollowers: (userId) => api.get(`/users/${userId}/followers`),
  getUserFollowing: (userId) => api.get(`/users/${userId}/following`),
};

export const analyticsApi = {
  getDailyMetrics: () => api.get('/analytics/daily-metrics'),
  getNFTPerformance: () => api.get('/analytics/nft-performance'),
  getUserEngagement: () => api.get('/analytics/user-engagement'),
  getSalesTrends: () => api.get('/analytics/sales-trends'),
};

export const referralApi = {
  getReferralCode: () => api.get('/referral/code'),
  getReferralStats: () => api.get('/referral/stats'),
  getReferralHistory: () => api.get('/referral/history'),
};

export const antiBrushingApi = {
  getBrushingLogs: () => api.get('/anti-brushing/logs'),
  blockUser: (userId) => api.post(`/anti-brushing/block/${userId}`),
  unblockUser: (userId) => api.post(`/anti-brushing/unblock/${userId}`),
};

export const stakingApi = {
  getStakingPools: () => api.get('/staking/pools'),
  stake: (poolId, amount) => api.post(`/staking/stake/${poolId}`, { amount }),
  unstake: (poolId, amount) => api.post(`/staking/unstake/${poolId}`, { amount }),
  getRewards: () => api.get('/staking/rewards'),
};

export const walletApi = {
  getWalletBalance: (userId) => api.get(`/wallet/${userId}/balance`),
  getWalletTransactions: (userId) => api.get(`/wallet/${userId}/transactions`),
  deposit: (userId, amount, currency) => api.post(`/wallet/${userId}/deposit`, { amount, currency }),
  withdraw: (userId, amount, currency) => api.post(`/wallet/${userId}/withdraw`, { amount, currency }),
};

export const barterApi = {
  createBarterOffer: (nftId, offerDetails) => api.post(`/barter/offers/${nftId}`, offerDetails),
  getBarterOffers: (nftId) => api.get(`/barter/offers/${nftId}`),
  acceptBarterOffer: (offerId) => api.post(`/barter/offers/${offerId}/accept`),
  rejectBarterOffer: (offerId) => api.post(`/barter/offers/${offerId}/reject`),
};

export const bulkOperationsApi = {
  bulkMint: (data) => api.post('/bulk-operations/mint', data),
  bulkTransfer: (data) => api.post('/bulk-operations/transfer', data),
  bulkList: (data) => api.post('/bulk-operations/list', data),
};

export const activityCalendarApi = {
  getEvents: (params) => api.get('/activity-calendar/events', { params }),
  createEvent: (data) => api.post('/activity-calendar/events', data),
  updateEvent: (eventId, data) => api.put(`/activity-calendar/events/${eventId}`, data),
  deleteEvent: (eventId) => api.delete(`/activity-calendar/events/${eventId}`),
  getCalendars: () => api.get('/activity-calendar/calendars'),
  createCalendar: (data) => api.post('/activity-calendar/calendars', data),
};

export const intentPoolApi = {
  getIntents: (params) => api.get('/intent-pool/intents', { params }),
  createIntent: (data) => api.post('/intent-pool/intents', data),
  getIntentById: (intentId) => api.get(`/intent-pool/intents/${intentId}`),
  respondToIntent: (intentId, data) => api.post(`/intent-pool/intents/${intentId}/respond`, data),
  createIntentMatch: (intentId, data) => api.post(`/intent-pool/intents/${intentId}/match`, data),
  getUserIntents: (userId) => api.get(`/intent-pool/intents/user/${userId}`),
  getIntentPools: () => api.get('/intent-pool/pools'),
  getIntentAlerts: () => api.get('/intent-pool/alerts'),
  createIntentAlert: (data) => api.post('/intent-pool/alerts', data),
};

export const mintingApi = {
  getContractInfo: () => api.get('/minting/contracts'),
  estimateMintingFees: (data) => api.post('/minting/fees/estimate', data),
  recordMintingEvent: (data) => api.post('/minting/events', data),
  getNetworkStatus: () => api.get('/minting/network/status'),
  manageMintingQueue: (data) => api.post('/minting/queue', data),
  getMetadataTemplates: () => api.get('/minting/templates'),
};

export const auctionApi = {
  createAuction: (data) => api.post('/auction/auctions', data),
  getAuctions: (params) => api.get('/auction/auctions', { params }),
  placeBid: (auctionId, data) => api.post(`/auction/auctions/${auctionId}/bid`, data),
  addToWatchlist: (auctionId) => api.post(`/auction/auctions/${auctionId}/watchlist`),
  endAuction: (auctionId) => api.post(`/auction/auctions/${auctionId}/end`),
  getAuctionAnalytics: (auctionId) => api.get(`/auction/auctions/${auctionId}/analytics`),
  getUserBids: (userId) => api.get(`/auction/bids/user/${userId}`),
};

export const disputeApi = {
  submitDispute: (data) => api.post('/dispute/disputes', data),
  getDisputes: (params) => api.get('/dispute/disputes', { params }),
  uploadEvidence: (disputeId, data) => api.post(`/dispute/disputes/${disputeId}/evidence`, data),
  addMessage: (disputeId, data) => api.post(`/dispute/disputes/${disputeId}/messages`, data),
  assignMediator: (disputeId, mediatorId) => api.post(`/dispute/disputes/${disputeId}/assign/${mediatorId}`),
  resolveDispute: (disputeId, data) => api.post(`/dispute/disputes/${disputeId}/resolve`, data),
  getMediators: () => api.get('/dispute/mediators'),
};

export default api;


