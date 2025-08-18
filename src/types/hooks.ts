import { User, NFT, Collection, Notification, Transaction, Wallet, Language } from './index';

// 基础Hook返回类型
export interface UseStateReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export interface UseMutationReturn<T, P = any> {
  mutate: (params: P) => Promise<T>;
  loading: boolean;
  error: string | null;
  reset: () => void;
}

// 用户相关Hook类型
export interface UseUserReturn extends UseStateReturn<User> {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// NFT相关Hook类型
export interface UseNFTsReturn extends UseStateReturn<NFT[]> {
  nfts: NFT[];
  hasMore: boolean;
  loadMore: () => void;
  filters: any;
  setFilters: (filters: any) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
}

export interface UseNFTReturn extends UseStateReturn<NFT> {
  nft: NFT | null;
  like: () => Promise<void>;
  unlike: () => Promise<void>;
  share: () => void;
  buy: (price: string) => Promise<void>;
  makeOffer: (amount: string) => Promise<void>;
  placeBid: (amount: string) => Promise<void>;
}

export interface UseCreateNFTReturn {
  createNFT: (data: CreateNFTData) => Promise<NFT>;
  uploadFile: (file: File) => Promise<string>;
  loading: boolean;
  error: string | null;
  progress: number;
}

export interface CreateNFTData {
  name: string;
  description: string;
  image: string;
  externalUrl?: string;
  collection?: string;
  properties: Array<{ traitType: string; value: string }>;
  levels: Array<{ traitType: string; value: number; maxValue: number }>;
  stats: Array<{ traitType: string; value: number }>;
  unlockableContent?: string;
  explicitContent: boolean;
  supply: number;
  royalties: number;
}

// 收藏相关Hook类型
export interface UseCollectionsReturn extends UseStateReturn<Collection[]> {
  collections: Collection[];
  hasMore: boolean;
  loadMore: () => void;
  featured: Collection[];
  trending: Collection[];
}

export interface UseCollectionReturn extends UseStateReturn<Collection> {
  collection: Collection | null;
  nfts: NFT[];
  stats: any;
  follow: () => Promise<void>;
  unfollow: () => Promise<void>;
  isFollowing: boolean;
}

// 钱包相关Hook类型
export interface UseWalletReturn {
  wallet: Wallet | null;
  connect: (provider: string) => Promise<void>;
  disconnect: () => void;
  sendTransaction: (to: string, amount: string) => Promise<string>;
  signMessage: (message: string) => Promise<string>;
  connected: boolean;
  connecting: boolean;
  error: string | null;
}

export interface UseBalanceReturn {
  balance: string;
  balanceUSD: string;
  tokens: any[];
  loading: boolean;
  refresh: () => void;
}

// 搜索相关Hook类型
export interface UseSearchReturn {
  query: string;
  setQuery: (query: string) => void;
  results: SearchResults;
  loading: boolean;
  error: string | null;
  search: (query: string) => void;
  clear: () => void;
  suggestions: string[];
  history: string[];
}

export interface SearchResults {
  nfts: NFT[];
  collections: Collection[];
  users: User[];
  total: number;
}

export interface UseFiltersReturn {
  filters: SearchFilters;
  setFilters: (filters: Partial<SearchFilters>) => void;
  resetFilters: () => void;
  activeFiltersCount: number;
  isFiltered: boolean;
}

export interface SearchFilters {
  category?: string;
  priceMin?: number;
  priceMax?: number;
  currency?: string;
  rarity?: string[];
  properties?: Record<string, string[]>;
  collections?: string[];
  creators?: string[];
  saleType?: string[];
}

// 通知相关Hook类型
export interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  clearAll: () => Promise<void>;
  subscribe: () => void;
  unsubscribe: () => void;
}

// 语言相关Hook类型
export interface UseLanguageReturn {
  currentLanguage: string;
  setLanguage: (language: string) => void;
  t: (key: string, params?: Record<string, any>) => string;
  languages: Record<string, Language>;
  isRTL: boolean;
}

export interface UseTranslationReturn {
  t: (key: string, params?: Record<string, any>) => string;
  language: string;
}

export interface UseFormattingReturn {
  formatNumber: (number: number) => string;
  formatCurrency: (amount: number, currency?: string) => string;
  formatDate: (date: string | Date, options?: Intl.DateTimeFormatOptions) => string;
  formatRelativeTime: (date: string | Date) => string;
}

// 性能相关Hook类型
export interface UseDebounceReturn<T> {
  debouncedValue: T;
  cancel: () => void;
}

export interface UseThrottleReturn<T> {
  throttledValue: T;
  cancel: () => void;
}

export interface UseCacheReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  invalidate: () => void;
  refresh: () => void;
}

export interface UseVirtualListReturn {
  visibleItems: any[];
  scrollToIndex: (index: number) => void;
  scrollToTop: () => void;
  scrollToBottom: () => void;
}

// 移动端相关Hook类型
export interface UseMobileReturn {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  orientation: 'portrait' | 'landscape';
  screenSize: 'sm' | 'md' | 'lg' | 'xl';
}

export interface UseGesturesReturn {
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: () => { isLeftSwipe: boolean; isRightSwipe: boolean; distance: number } | undefined;
  touchHandlers: {
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchMove: (e: React.TouchEvent) => void;
    onTouchEnd: () => void;
  };
}

// 分析相关Hook类型
export interface UseAnalyticsReturn {
  data: AnalyticsData | null;
  loading: boolean;
  error: string | null;
  timeRange: string;
  setTimeRange: (range: string) => void;
  refresh: () => void;
}

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
  category: string;
  count: number;
  volume: string;
  percentage: number;
}

// 交易相关Hook类型
export interface UseTransactionsReturn {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  filter: TransactionFilter;
  setFilter: (filter: Partial<TransactionFilter>) => void;
}

export interface TransactionFilter {
  type?: string[];
  status?: string[];
  dateFrom?: string;
  dateTo?: string;
  amountMin?: number;
  amountMax?: number;
}

// 社交功能相关Hook类型
export interface UseSocialReturn {
  like: (id: string) => Promise<void>;
  unlike: (id: string) => Promise<void>;
  share: (item: any) => void;
  follow: (userId: string) => Promise<void>;
  unfollow: (userId: string) => Promise<void>;
  comment: (id: string, text: string) => Promise<void>;
  deleteComment: (commentId: string) => Promise<void>;
}

export interface UseCommentsReturn {
  comments: Comment[];
  loading: boolean;
  addComment: (text: string) => Promise<void>;
  replyToComment: (commentId: string, text: string) => Promise<void>;
  likeComment: (commentId: string) => Promise<void>;
  deleteComment: (commentId: string) => Promise<void>;
  loadMore: () => void;
  hasMore: boolean;
}

export interface Comment {
  id: string;
  text: string;
  author: User;
  createdAt: string;
  likes: number;
  isLiked: boolean;
  replies: Comment[];
  replyCount: number;
}

// 表单相关Hook类型
export interface UseFormReturn<T> {
  values: T;
  errors: Record<keyof T, string>;
  touched: Record<keyof T, boolean>;
  isValid: boolean;
  isSubmitting: boolean;
  setValue: (field: keyof T, value: any) => void;
  setError: (field: keyof T, error: string) => void;
  setTouched: (field: keyof T, touched: boolean) => void;
  handleSubmit: (onSubmit: (values: T) => void | Promise<void>) => (e: React.FormEvent) => void;
  reset: () => void;
  validate: () => boolean;
}

export interface UseValidationReturn {
  validate: (value: any, rules: ValidationRule[]) => string | null;
  validateForm: (values: Record<string, any>, schema: ValidationSchema) => Record<string, string>;
}

export interface ValidationRule {
  type: 'required' | 'email' | 'min' | 'max' | 'pattern' | 'custom';
  value?: any;
  message: string;
  validator?: (value: any) => boolean;
}

export interface ValidationSchema {
  [field: string]: ValidationRule[];
}

// 本地存储相关Hook类型
export interface UseLocalStorageReturn<T> {
  value: T;
  setValue: (value: T) => void;
  removeValue: () => void;
}

export interface UseSessionStorageReturn<T> {
  value: T;
  setValue: (value: T) => void;
  removeValue: () => void;
}

// 网络状态相关Hook类型
export interface UseNetworkReturn {
  isOnline: boolean;
  isOffline: boolean;
  connectionType: string;
  effectiveType: string;
  downlink: number;
  rtt: number;
}

// 导出所有Hook类型
export type {
  UseStateReturn,
  UseMutationReturn,
  UseUserReturn,
  UseNFTsReturn,
  UseNFTReturn,
  UseWalletReturn,
  UseSearchReturn,
  UseNotificationsReturn,
  UseLanguageReturn,
  UseTranslationReturn,
  UseFormattingReturn,
  UseMobileReturn,
  UseAnalyticsReturn,
  UseFormReturn,
  UseLocalStorageReturn
};

