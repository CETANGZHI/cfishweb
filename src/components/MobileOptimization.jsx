import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  Search, 
  Filter,
  Grid,
  List,
  ChevronDown,
  ChevronUp,
  Heart,
  Share2,
  ShoppingCart,
  User,
  Bell,
  Settings,
  Home,
  Compass,
  Plus,
  Wallet
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';

// 移动端导航栏组件
export const MobileNavbar = ({ isOpen, onToggle, notifications = 0 }) => {
  return (
    <div className="lg:hidden">
      {/* 顶部导航栏 */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="p-2"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <h1 className="text-lg font-bold text-white">CFISH</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="p-2 relative">
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {notifications > 9 ? '9+' : notifications}
                </span>
              )}
            </Button>
            <Button variant="ghost" size="sm" className="p-2">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* 侧边栏菜单 */}
      {isOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={onToggle} />
          <div className="fixed left-0 top-0 bottom-0 w-64 bg-gray-900 border-r border-gray-700 pt-16">
            <div className="p-4 space-y-2">
              <MobileNavItem icon={Home} label="Home" href="/" />
              <MobileNavItem icon={Compass} label="Marketplace" href="/marketplace" />
              <MobileNavItem icon={Plus} label="Create" href="/create" />
              <MobileNavItem icon={Wallet} label="Wallet" href="/wallet" />
              <MobileNavItem icon={User} label="Profile" href="/dashboard" />
              <MobileNavItem icon={Settings} label="Settings" href="/settings" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 移动端导航项
const MobileNavItem = ({ icon: Icon, label, href, active = false }) => {
  return (
    <a
      href={href}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
        active 
          ? 'bg-teal-600 text-white' 
          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
      }`}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </a>
  );
};

// 移动端底部导航栏
export const MobileBottomNav = ({ activeTab = 'home' }) => {
  const navItems = [
    { id: 'home', icon: Home, label: 'Home', href: '/' },
    { id: 'marketplace', icon: Compass, label: 'Market', href: '/marketplace' },
    { id: 'create', icon: Plus, label: 'Create', href: '/create' },
    { id: 'wallet', icon: Wallet, label: 'Wallet', href: '/wallet' },
    { id: 'profile', icon: User, label: 'Profile', href: '/dashboard' }
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-gray-900/95 backdrop-blur-sm border-t border-gray-700">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => (
          <a
            key={item.id}
            href={item.href}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
              activeTab === item.id
                ? 'text-teal-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-xs">{item.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
};

// 移动端搜索栏
export const MobileSearchBar = ({ onSearch, placeholder = "Search NFTs..." }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="lg:hidden px-4 py-3 bg-gray-900 border-b border-gray-700">
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-800 border-gray-600 text-white"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                onSearch?.(searchTerm);
              }
            }}
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="border-gray-600"
        >
          <Filter className="h-4 w-4" />
        </Button>
      </div>
      
      {showFilters && (
        <div className="mt-3 space-y-2">
          <div className="flex gap-2 overflow-x-auto pb-2">
            <Badge variant="secondary" className="whitespace-nowrap">All</Badge>
            <Badge variant="outline" className="whitespace-nowrap">Art</Badge>
            <Badge variant="outline" className="whitespace-nowrap">Gaming</Badge>
            <Badge variant="outline" className="whitespace-nowrap">Music</Badge>
            <Badge variant="outline" className="whitespace-nowrap">Photography</Badge>
          </div>
        </div>
      )}
    </div>
  );
};

// 移动端NFT卡片
export const MobileNFTCard = ({ nft, onLike, onShare, onBuy }) => {
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike?.(nft.id, !isLiked);
  };

  return (
    <Card className="bg-gray-800 border-gray-700 overflow-hidden">
      <div className="aspect-square relative">
        <img
          src={nft.image || '/api/placeholder/300/300'}
          alt={nft.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className={`p-1 rounded-full bg-black/50 backdrop-blur-sm ${
              isLiked ? 'text-red-500' : 'text-white'
            }`}
          >
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onShare?.(nft)}
            className="p-1 rounded-full bg-black/50 backdrop-blur-sm text-white"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <CardContent className="p-3">
        <div className="space-y-2">
          <h3 className="font-medium text-white text-sm truncate">{nft.title}</h3>
          <p className="text-xs text-gray-400 truncate">by {nft.creator}</p>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400">Price</p>
              <p className="font-bold text-teal-400">{nft.price}</p>
            </div>
            <Button
              size="sm"
              onClick={() => onBuy?.(nft)}
              className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-1 text-xs"
            >
              Buy
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// 移动端网格布局
export const MobileGrid = ({ children, columns = 2 }) => {
  return (
    <div className={`grid grid-cols-${columns} gap-3 p-4`}>
      {children}
    </div>
  );
};

// 移动端视图切换器
export const MobileViewToggle = ({ view, onViewChange }) => {
  return (
    <div className="lg:hidden flex items-center justify-center gap-1 p-2 bg-gray-800 rounded-lg">
      <Button
        variant={view === 'grid' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('grid')}
        className="p-2"
      >
        <Grid className="h-4 w-4" />
      </Button>
      <Button
        variant={view === 'list' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('list')}
        className="p-2"
      >
        <List className="h-4 w-4" />
      </Button>
    </div>
  );
};

// 移动端可折叠部分
export const MobileCollapsible = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="lg:hidden border border-gray-700 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 bg-gray-800 text-white hover:bg-gray-700 transition-colors"
      >
        <span className="font-medium">{title}</span>
        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      {isOpen && (
        <div className="p-3 bg-gray-900">
          {children}
        </div>
      )}
    </div>
  );
};

// 移动端触摸手势处理
export const useMobileGestures = () => {
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    return { isLeftSwipe, isRightSwipe, distance };
  };

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    touchHandlers: {
      onTouchStart,
      onTouchMove,
      onTouchEnd
    }
  };
};

// 移动端响应式容器
export const MobileContainer = ({ children, className = '' }) => {
  return (
    <div className={`
      w-full max-w-sm mx-auto lg:max-w-none lg:mx-0
      px-4 lg:px-0
      ${className}
    `}>
      {children}
    </div>
  );
};

// PWA安装提示
export const PWAInstallPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    
    setDeferredPrompt(null);
  };

  if (!showPrompt) return null;

  return (
    <div className="lg:hidden fixed bottom-20 left-4 right-4 z-50">
      <Card className="bg-gray-800 border-gray-600">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-white">Install CFISH App</h3>
              <p className="text-sm text-gray-400">Get the full experience</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPrompt(false)}
                className="text-gray-400"
              >
                Later
              </Button>
              <Button
                size="sm"
                onClick={handleInstall}
                className="bg-teal-600 hover:bg-teal-700"
              >
                Install
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default {
  MobileNavbar,
  MobileBottomNav,
  MobileSearchBar,
  MobileNFTCard,
  MobileGrid,
  MobileViewToggle,
  MobileCollapsible,
  MobileContainer,
  PWAInstallPrompt,
  useMobileGestures
};

