import React from 'react';
import { NFT, User, Collection, Notification, Transaction, Language } from './index';

// 基础组件Props
export interface BaseProps {
  className?: string;
  children?: React.ReactNode;
}

// UI组件Props
export interface ButtonProps extends BaseProps {
  variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'default' | 'lg' | 'icon';
  disabled?: boolean;
  loading?: boolean;
  asChild?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
}

export interface InputProps extends BaseProps {
  type?: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  required?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

export interface TextareaProps extends BaseProps {
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  required?: boolean;
  rows?: number;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export interface SelectProps extends BaseProps {
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  required?: boolean;
  onValueChange?: (value: string) => void;
}

export interface CheckboxProps extends BaseProps {
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  required?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export interface SwitchProps extends BaseProps {
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export interface SliderProps extends BaseProps {
  value?: number[];
  defaultValue?: number[];
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  onValueChange?: (value: number[]) => void;
}

// 卡片组件Props
export interface CardProps extends BaseProps {
  variant?: 'default' | 'outline' | 'ghost';
  padding?: 'none' | 'sm' | 'default' | 'lg';
}

export interface CardHeaderProps extends BaseProps {}
export interface CardContentProps extends BaseProps {}
export interface CardFooterProps extends BaseProps {}

// 模态框组件Props
export interface ModalProps extends BaseProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export interface DialogProps extends ModalProps {}
export interface AlertDialogProps extends ModalProps {}

export interface DialogContentProps extends BaseProps {
  size?: 'sm' | 'default' | 'lg' | 'xl' | 'full';
}

// 下拉菜单组件Props
export interface DropdownMenuProps extends BaseProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export interface DropdownMenuContentProps extends BaseProps {
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'right' | 'bottom' | 'left';
  sideOffset?: number;
}

export interface DropdownMenuItemProps extends BaseProps {
  disabled?: boolean;
  onSelect?: (event: Event) => void;
}

// NFT相关组件Props
export interface NFTCardProps extends BaseProps {
  nft: NFT;
  showCreator?: boolean;
  showOwner?: boolean;
  showPrice?: boolean;
  showLikes?: boolean;
  compact?: boolean;
  onLike?: (nftId: string, liked: boolean) => void;
  onShare?: (nft: NFT) => void;
  onBuy?: (nft: NFT) => void;
  onClick?: (nft: NFT) => void;
}

export interface NFTGridProps extends BaseProps {
  nfts: NFT[];
  loading?: boolean;
  columns?: number;
  gap?: 'sm' | 'default' | 'lg';
  onLoadMore?: () => void;
  hasMore?: boolean;
  onNFTClick?: (nft: NFT) => void;
  onNFTLike?: (nftId: string, liked: boolean) => void;
  onNFTShare?: (nft: NFT) => void;
  onNFTBuy?: (nft: NFT) => void;
}

export interface NFTDetailProps extends BaseProps {
  nft: NFT;
  onBuy?: (nft: NFT) => void;
  onMakeOffer?: (nft: NFT, amount: string) => void;
  onPlaceBid?: (nft: NFT, amount: string) => void;
  onTransfer?: (nft: NFT, to: string) => void;
  onLike?: (nftId: string, liked: boolean) => void;
  onShare?: (nft: NFT) => void;
}

// 用户相关组件Props
export interface UserCardProps extends BaseProps {
  user: User;
  showStats?: boolean;
  showFollowButton?: boolean;
  compact?: boolean;
  onFollow?: (userId: string, following: boolean) => void;
  onClick?: (user: User) => void;
}

export interface UserAvatarProps extends BaseProps {
  user: User;
  size?: 'sm' | 'default' | 'lg' | 'xl';
  showVerified?: boolean;
  showOnlineStatus?: boolean;
}

// 收藏相关组件Props
export interface CollectionCardProps extends BaseProps {
  collection: Collection;
  showStats?: boolean;
  compact?: boolean;
  onClick?: (collection: Collection) => void;
}

export interface CollectionGridProps extends BaseProps {
  collections: Collection[];
  loading?: boolean;
  columns?: number;
  onLoadMore?: () => void;
  hasMore?: boolean;
  onCollectionClick?: (collection: Collection) => void;
}

// 搜索和筛选组件Props
export interface SearchBarProps extends BaseProps {
  placeholder?: string;
  value?: string;
  onSearch?: (query: string) => void;
  onClear?: () => void;
  loading?: boolean;
  suggestions?: string[];
  onSuggestionClick?: (suggestion: string) => void;
}

export interface FilterPanelProps extends BaseProps {
  filters: any;
  onFiltersChange?: (filters: any) => void;
  onReset?: () => void;
  categories?: string[];
  collections?: Collection[];
  priceRange?: [number, number];
  rarities?: string[];
}

export interface SortSelectorProps extends BaseProps {
  value?: string;
  options: Array<{
    value: string;
    label: string;
  }>;
  onValueChange?: (value: string) => void;
}

// 通知相关组件Props
export interface NotificationBellProps extends BaseProps {
  notifications?: Notification[];
  unreadCount?: number;
  onNotificationClick?: (notification: Notification) => void;
  onMarkAllRead?: () => void;
  onClearAll?: () => void;
}

export interface NotificationItemProps extends BaseProps {
  notification: Notification;
  onClick?: (notification: Notification) => void;
  onMarkRead?: (notificationId: string) => void;
  onDelete?: (notificationId: string) => void;
}

export interface NotificationListProps extends BaseProps {
  notifications: Notification[];
  loading?: boolean;
  onNotificationClick?: (notification: Notification) => void;
  onMarkRead?: (notificationId: string) => void;
  onDelete?: (notificationId: string) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

// 语言选择器组件Props
export interface LanguageSelectorProps extends BaseProps {
  variant?: 'default' | 'compact';
  size?: 'sm' | 'default' | 'lg';
  showLabel?: boolean;
  languages?: Language[];
  currentLanguage?: string;
  onLanguageChange?: (language: string) => void;
}

// 移动端组件Props
export interface MobileNavbarProps extends BaseProps {
  isOpen?: boolean;
  onToggle?: () => void;
  notifications?: number;
}

export interface MobileBottomNavProps extends BaseProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export interface MobileSearchBarProps extends BaseProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  onFilterToggle?: () => void;
}

export interface MobileNFTCardProps extends BaseProps {
  nft: NFT;
  onLike?: (nftId: string, liked: boolean) => void;
  onShare?: (nft: NFT) => void;
  onBuy?: (nft: NFT) => void;
  onClick?: (nft: NFT) => void;
}

export interface MobileGridProps extends BaseProps {
  columns?: number;
  gap?: 'sm' | 'default' | 'lg';
}

// 性能优化组件Props
export interface LazyImageProps extends BaseProps {
  src: string;
  alt: string;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export interface VirtualListProps extends BaseProps {
  items: any[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: any, index: number) => React.ReactNode;
  overscan?: number;
}

export interface LoadingSpinnerProps extends BaseProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
}

export interface ErrorFallbackProps extends BaseProps {
  error: Error;
  resetErrorBoundary: () => void;
}

// 分析组件Props
export interface AnalyticsDashboardProps extends BaseProps {
  data?: any;
  loading?: boolean;
  timeRange?: string;
  onTimeRangeChange?: (range: string) => void;
}

export interface ChartProps extends BaseProps {
  data: any[];
  type?: 'line' | 'bar' | 'pie' | 'area';
  width?: number;
  height?: number;
  responsive?: boolean;
}

// 表单组件Props
export interface FormProps extends BaseProps {
  onSubmit?: (data: any) => void;
  loading?: boolean;
  disabled?: boolean;
}

export interface FormFieldProps extends BaseProps {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
}

// 导航组件Props
export interface NavbarProps extends BaseProps {
  user?: User;
  onLogin?: () => void;
  onLogout?: () => void;
  onWalletConnect?: () => void;
}

export interface SidebarProps extends BaseProps {
  isOpen?: boolean;
  onClose?: () => void;
  user?: User;
}

// 页面组件Props
export interface PageProps extends BaseProps {
  title?: string;
  description?: string;
  loading?: boolean;
  error?: string;
}

export interface HomePageProps extends PageProps {}
export interface MarketplacePageProps extends PageProps {}
export interface NFTDetailPageProps extends PageProps {
  nftId: string;
}
export interface CreateNFTPageProps extends PageProps {}
export interface UserDashboardPageProps extends PageProps {}

// 钱包组件Props
export interface WalletConnectProps extends BaseProps {
  onConnect?: (wallet: any) => void;
  onDisconnect?: () => void;
  connected?: boolean;
  address?: string;
  balance?: string;
}

export interface WalletBalanceProps extends BaseProps {
  balance?: string;
  currency?: string;
  showUSD?: boolean;
}

// 交易组件Props
export interface TransactionListProps extends BaseProps {
  transactions: Transaction[];
  loading?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
  onTransactionClick?: (transaction: Transaction) => void;
}

export interface TransactionItemProps extends BaseProps {
  transaction: Transaction;
  onClick?: (transaction: Transaction) => void;
}

// 社交功能组件Props
export interface SocialFeaturesProps extends BaseProps {
  nft: NFT;
  onLike?: (liked: boolean) => void;
  onShare?: () => void;
  onComment?: (comment: string) => void;
  showComments?: boolean;
}

export interface CommentSectionProps extends BaseProps {
  nftId: string;
  comments?: any[];
  onAddComment?: (comment: string) => void;
  onReply?: (commentId: string, reply: string) => void;
  onLike?: (commentId: string, liked: boolean) => void;
}

// 导出所有组件Props类型
export type {
  BaseProps,
  ButtonProps,
  InputProps,
  NFTCardProps,
  NFTGridProps,
  UserCardProps,
  SearchBarProps,
  NotificationBellProps,
  LanguageSelectorProps,
  MobileNavbarProps,
  AnalyticsDashboardProps,
  FormProps,
  NavbarProps,
  PageProps
};

