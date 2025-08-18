// 基础类型定义
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
  followers: number;
  following: number;
  totalSales: number;
  totalPurchases: number;
}

// NFT相关类型
export interface NFT {
  id: string;
  tokenId: string;
  title: string;
  description: string;
  image: string;
  animationUrl?: string;
  externalUrl?: string;
  creator: User;
  owner: User;
  collection?: Collection;
  price: string;
  currency: 'SOL' | 'CFISH' | 'USDC';
  priceUSD: string;
  category: NFTCategory;
  rarity: NFTRarity;
  properties: NFTProperty[];
  levels: NFTLevel[];
  stats: NFTStat[];
  likes: number;
  views: number;
  isLiked: boolean;
  isForSale: boolean;
  saleType: 'fixed' | 'auction' | 'offer';
  auctionEndTime?: string;
  highestBid?: string;
  blockchain: 'solana';
  standard: 'SPL';
  royalties: number;
  createdAt: string;
  updatedAt: string;
  lastSale?: {
    price: string;
    currency: string;
    date: string;
    buyer: User;
    seller: User;
  };
}

export interface NFTProperty {
  traitType: string;
  value: string;
  rarity?: number;
}

export interface NFTLevel {
  traitType: string;
  value: number;
  maxValue: number;
}

export interface NFTStat {
  traitType: string;
  value: number;
  maxValue?: number;
}

export type NFTCategory = 
  | 'art' 
  | 'gaming' 
  | 'music' 
  | 'photography' 
  | 'sports' 
  | 'collectibles' 
  | 'utility' 
  | 'virtual';

export type NFTRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

// 收藏相关类型
export interface Collection {
  id: string;
  name: string;
  description: string;
  image: string;
  bannerImage?: string;
  creator: User;
  category: NFTCategory;
  floorPrice: string;
  totalVolume: string;
  totalSupply: number;
  ownersCount: number;
  royalties: number;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

// 交易相关类型
export interface Transaction {
  id: string;
  type: TransactionType;
  nft?: NFT;
  from: User;
  to: User;
  amount: string;
  currency: string;
  amountUSD: string;
  fee: string;
  hash: string;
  status: TransactionStatus;
  createdAt: string;
  confirmedAt?: string;
}

export type TransactionType = 
  | 'mint' 
  | 'sale' 
  | 'transfer' 
  | 'bid' 
  | 'offer' 
  | 'auction_end';

export type TransactionStatus = 'pending' | 'confirmed' | 'failed';

// 通知相关类型
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  createdAt: string;
  user: User;
}

export type NotificationType = 
  | 'sale' 
  | 'purchase' 
  | 'bid' 
  | 'offer' 
  | 'transfer' 
  | 'follow' 
  | 'like' 
  | 'comment' 
  | 'system';

// 搜索和筛选类型
export interface SearchFilters {
  query?: string;
  category?: NFTCategory;
  priceMin?: number;
  priceMax?: number;
  currency?: string;
  rarity?: NFTRarity[];
  properties?: { [key: string]: string[] };
  collections?: string[];
  creators?: string[];
  saleType?: ('fixed' | 'auction' | 'offer')[];
  sortBy?: SortOption;
  sortOrder?: 'asc' | 'desc';
}

export type SortOption = 
  | 'newest' 
  | 'oldest' 
  | 'price_high' 
  | 'price_low' 
  | 'popular' 
  | 'trending' 
  | 'ending_soon';

// API响应类型
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// 钱包相关类型
export interface Wallet {
  address: string;
  balance: string;
  tokens: Token[];
  nfts: NFT[];
  connected: boolean;
  provider: WalletProvider;
}

export interface Token {
  symbol: string;
  name: string;
  balance: string;
  decimals: number;
  mint: string;
  logo?: string;
  price?: string;
  priceChange24h?: number;
}

export type WalletProvider = 'phantom' | 'solflare' | 'sollet' | 'ledger' | 'torus';

// 表单类型
export interface CreateNFTForm {
  file: File | null;
  name: string;
  description: string;
  externalLink?: string;
  collection?: string;
  properties: NFTProperty[];
  levels: NFTLevel[];
  stats: NFTStat[];
  unlockableContent?: string;
  explicitContent: boolean;
  supply: number;
  blockchain: 'solana';
  freezeMetadata: boolean;
}

export interface ListingForm {
  type: 'fixed' | 'auction';
  price?: string;
  startingBid?: string;
  reservePrice?: string;
  duration?: number;
  currency: string;
}

// 分析数据类型
export interface AnalyticsData {
  totalSales: number;
  totalVolume: string;
  averagePrice: string;
  totalNFTs: number;
  salesTrend: ChartDataPoint[];
  volumeTrend: ChartDataPoint[];
  categoryDistribution: CategoryData[];
  topCollections: Collection[];
  recentActivity: Transaction[];
}

export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface CategoryData {
  category: NFTCategory;
  count: number;
  volume: string;
  percentage: number;
}

// 语言和国际化类型
export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export interface TranslationFunction {
  (key: string, params?: Record<string, string | number>): string;
}

// 组件Props类型
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ButtonProps extends BaseComponentProps {
  variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
}

export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

// 错误类型
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
}

// 应用状态类型
export interface AppState {
  user: User | null;
  wallet: Wallet | null;
  notifications: Notification[];
  theme: string;
  language: string;
  loading: boolean;
  error: AppError | null;
}

// 事件类型
export interface NFTEvent {
  id: string;
  type: 'sale' | 'transfer' | 'bid' | 'offer' | 'listing';
  nft: NFT;
  from?: User;
  to?: User;
  price?: string;
  currency?: string;
  timestamp: string;
}

// 拍卖类型
export interface Auction {
  id: string;
  nft: NFT;
  seller: User;
  startingBid: string;
  reservePrice?: string;
  currentBid?: string;
  highestBidder?: User;
  startTime: string;
  endTime: string;
  status: 'active' | 'ended' | 'cancelled';
  bids: Bid[];
}

export interface Bid {
  id: string;
  bidder: User;
  amount: string;
  currency: string;
  timestamp: string;
  status: 'active' | 'outbid' | 'winning' | 'withdrawn';
}

// 报价类型
export interface Offer {
  id: string;
  nft: NFT;
  offerer: User;
  amount: string;
  currency: string;
  expiration: string;
  status: 'active' | 'accepted' | 'rejected' | 'expired' | 'cancelled';
  createdAt: string;
}

// 活动类型
export interface Activity {
  id: string;
  type: 'sale' | 'listing' | 'transfer' | 'bid' | 'offer' | 'mint';
  nft: NFT;
  from?: User;
  to?: User;
  price?: string;
  currency?: string;
  timestamp: string;
  transaction?: Transaction;
}

// 统计类型
export interface Stats {
  totalUsers: number;
  totalNFTs: number;
  totalVolume: string;
  totalSales: number;
  floorPrice: string;
  averagePrice: string;
  marketCap: string;
  activeListings: number;
}

// 导出所有类型
export type {
  // 重新导出以确保类型可用
  User,
  NFT,
  Collection,
  Transaction,
  Notification,
  Wallet,
  Token,
  AnalyticsData,
  Language,
  AppState,
  AppError
};

