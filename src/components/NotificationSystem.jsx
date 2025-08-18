import React, { useState, useEffect, useContext, createContext } from 'react';
import { 
  Bell, 
  X, 
  Check, 
  AlertCircle, 
  Info, 
  CheckCircle, 
  XCircle,
  Settings,
  Volume2,
  VolumeX,
  Smartphone,
  Mail,
  MessageSquare
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';

// 通知上下文
const NotificationContext = createContext();

// 通知类型
const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
  NFT_SOLD: 'nft_sold',
  NFT_PURCHASED: 'nft_purchased',
  BID_RECEIVED: 'bid_received',
  BID_OUTBID: 'bid_outbid',
  AUCTION_ENDING: 'auction_ending',
  FOLLOW: 'follow',
  LIKE: 'like',
  COMMENT: 'comment'
};

// 通知图标映射
const getNotificationIcon = (type) => {
  switch (type) {
    case NOTIFICATION_TYPES.SUCCESS:
    case NOTIFICATION_TYPES.NFT_SOLD:
    case NOTIFICATION_TYPES.NFT_PURCHASED:
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case NOTIFICATION_TYPES.ERROR:
      return <XCircle className="h-5 w-5 text-red-500" />;
    case NOTIFICATION_TYPES.WARNING:
    case NOTIFICATION_TYPES.BID_OUTBID:
    case NOTIFICATION_TYPES.AUCTION_ENDING:
      return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    case NOTIFICATION_TYPES.BID_RECEIVED:
    case NOTIFICATION_TYPES.FOLLOW:
    case NOTIFICATION_TYPES.LIKE:
    case NOTIFICATION_TYPES.COMMENT:
      return <Info className="h-5 w-5 text-blue-500" />;
    default:
      return <Info className="h-5 w-5 text-gray-500" />;
  }
};

// 通知提供者组件
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [settings, setSettings] = useState({
    sound: true,
    push: true,
    email: false,
    sms: false,
    types: {
      [NOTIFICATION_TYPES.NFT_SOLD]: true,
      [NOTIFICATION_TYPES.NFT_PURCHASED]: true,
      [NOTIFICATION_TYPES.BID_RECEIVED]: true,
      [NOTIFICATION_TYPES.BID_OUTBID]: true,
      [NOTIFICATION_TYPES.AUCTION_ENDING]: true,
      [NOTIFICATION_TYPES.FOLLOW]: true,
      [NOTIFICATION_TYPES.LIKE]: false,
      [NOTIFICATION_TYPES.COMMENT]: true
    }
  });
  const [unreadCount, setUnreadCount] = useState(0);

  // 模拟WebSocket连接
  useEffect(() => {
    // 模拟实时通知
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30%概率收到通知
        const mockNotifications = [
          {
            id: Date.now(),
            type: NOTIFICATION_TYPES.BID_RECEIVED,
            title: 'New Bid Received',
            message: 'Someone bid 5.2 SOL on your "Digital Sunset"',
            timestamp: new Date(),
            read: false,
            data: { nftId: '123', bidAmount: '5.2' }
          },
          {
            id: Date.now() + 1,
            type: NOTIFICATION_TYPES.NFT_SOLD,
            title: 'NFT Sold!',
            message: 'Your "Cosmic Dreams" has been sold for 12.5 SOL',
            timestamp: new Date(),
            read: false,
            data: { nftId: '456', saleAmount: '12.5' }
          },
          {
            id: Date.now() + 2,
            type: NOTIFICATION_TYPES.FOLLOW,
            title: 'New Follower',
            message: 'CryptoArtist_42 started following you',
            timestamp: new Date(),
            read: false,
            data: { userId: '789' }
          },
          {
            id: Date.now() + 3,
            type: NOTIFICATION_TYPES.AUCTION_ENDING,
            title: 'Auction Ending Soon',
            message: 'Your auction for "Neon City" ends in 30 minutes',
            timestamp: new Date(),
            read: false,
            data: { nftId: '101', timeLeft: '30m' }
          }
        ];
        
        const randomNotification = mockNotifications[Math.floor(Math.random() * mockNotifications.length)];
        addNotification(randomNotification);
      }
    }, 10000); // 每10秒检查一次

    return () => clearInterval(interval);
  }, []);

  // 添加通知
  const addNotification = (notification) => {
    if (!settings.types[notification.type]) return; // 检查类型设置

    setNotifications(prev => [notification, ...prev.slice(0, 49)]); // 最多保留50条
    setUnreadCount(prev => prev + 1);

    // 播放声音
    if (settings.sound) {
      playNotificationSound();
    }

    // 显示浏览器通知
    if (settings.push && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        tag: notification.id
      });
    }
  };

  // 播放通知声音
  const playNotificationSound = () => {
    try {
      const audio = new Audio('/notification.mp3');
      audio.volume = 0.3;
      audio.play().catch(() => {
        // 忽略播放失败
      });
    } catch (error) {
      // 忽略音频错误
    }
  };

  // 标记为已读
  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  // 标记全部为已读
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  // 删除通知
  const removeNotification = (notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    setUnreadCount(prev => {
      const notification = notifications.find(n => n.id === notificationId);
      return notification && !notification.read ? Math.max(0, prev - 1) : prev;
    });
  };

  // 清空所有通知
  const clearAllNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  // 更新设置
  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    localStorage.setItem('notificationSettings', JSON.stringify({ ...settings, ...newSettings }));
  };

  // 请求通知权限
  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return Notification.permission === 'granted';
  };

  // 加载设置
  useEffect(() => {
    const savedSettings = localStorage.getItem('notificationSettings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Failed to load notification settings:', error);
      }
    }
  }, []);

  const value = {
    notifications,
    unreadCount,
    settings,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    updateSettings,
    requestNotificationPermission
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// 使用通知的Hook
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

// 通知铃铛组件
export const NotificationBell = () => {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    removeNotification,
    clearAllNotifications 
  } = useNotifications();

  const [isOpen, setIsOpen] = useState(false);

  const formatTime = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative p-2"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-80 p-0 bg-gray-900 border-gray-700" align="end">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-white">Notifications</CardTitle>
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs text-gray-400 hover:text-white"
                >
                  Mark all read
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllNotifications}
                className="text-xs text-gray-400 hover:text-white"
              >
                Clear all
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0 max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-400">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No notifications yet</p>
            </div>
          ) : (
            <div className="space-y-1">
              {notifications.slice(0, 10).map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 border-b border-gray-700 hover:bg-gray-800 cursor-pointer ${
                    !notification.read ? 'bg-gray-800/50' : ''
                  }`}
                  onClick={() => !notification.read && markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-white truncate">
                          {notification.title}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeNotification(notification.id);
                          }}
                          className="p-1 h-auto text-gray-400 hover:text-white"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatTime(notification.timestamp)}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </PopoverContent>
    </Popover>
  );
};

// 通知设置组件
export const NotificationSettings = () => {
  const { 
    settings, 
    updateSettings, 
    requestNotificationPermission 
  } = useNotifications();

  const [localSettings, setLocalSettings] = useState(settings);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleSettingChange = (key, value) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
    updateSettings(newSettings);
  };

  const handleTypeSettingChange = (type, value) => {
    const newSettings = {
      ...localSettings,
      types: { ...localSettings.types, [type]: value }
    };
    setLocalSettings(newSettings);
    updateSettings(newSettings);
  };

  const handleEnablePush = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      handleSettingChange('push', true);
    }
  };

  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Notification Settings
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* 通知方式 */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-white">Delivery Methods</h3>
          
          <div className="flex items-center justify-between">
            <Label className="text-white flex items-center gap-2">
              <Volume2 className="h-4 w-4" />
              Sound notifications
            </Label>
            <Switch
              checked={localSettings.sound}
              onCheckedChange={(checked) => handleSettingChange('sound', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label className="text-white flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              Push notifications
            </Label>
            <Switch
              checked={localSettings.push}
              onCheckedChange={localSettings.push ? 
                (checked) => handleSettingChange('push', checked) : 
                handleEnablePush
              }
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label className="text-white flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email notifications
            </Label>
            <Switch
              checked={localSettings.email}
              onCheckedChange={(checked) => handleSettingChange('email', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label className="text-white flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              SMS notifications
            </Label>
            <Switch
              checked={localSettings.sms}
              onCheckedChange={(checked) => handleSettingChange('sms', checked)}
            />
          </div>
        </div>

        <Separator className="bg-gray-700" />

        {/* 通知类型 */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-white">Notification Types</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-white">NFT Sales</Label>
              <Switch
                checked={localSettings.types[NOTIFICATION_TYPES.NFT_SOLD]}
                onCheckedChange={(checked) => handleTypeSettingChange(NOTIFICATION_TYPES.NFT_SOLD, checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label className="text-white">NFT Purchases</Label>
              <Switch
                checked={localSettings.types[NOTIFICATION_TYPES.NFT_PURCHASED]}
                onCheckedChange={(checked) => handleTypeSettingChange(NOTIFICATION_TYPES.NFT_PURCHASED, checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label className="text-white">Bid Received</Label>
              <Switch
                checked={localSettings.types[NOTIFICATION_TYPES.BID_RECEIVED]}
                onCheckedChange={(checked) => handleTypeSettingChange(NOTIFICATION_TYPES.BID_RECEIVED, checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label className="text-white">Bid Outbid</Label>
              <Switch
                checked={localSettings.types[NOTIFICATION_TYPES.BID_OUTBID]}
                onCheckedChange={(checked) => handleTypeSettingChange(NOTIFICATION_TYPES.BID_OUTBID, checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label className="text-white">Auction Ending</Label>
              <Switch
                checked={localSettings.types[NOTIFICATION_TYPES.AUCTION_ENDING]}
                onCheckedChange={(checked) => handleTypeSettingChange(NOTIFICATION_TYPES.AUCTION_ENDING, checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label className="text-white">New Followers</Label>
              <Switch
                checked={localSettings.types[NOTIFICATION_TYPES.FOLLOW]}
                onCheckedChange={(checked) => handleTypeSettingChange(NOTIFICATION_TYPES.FOLLOW, checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label className="text-white">Likes</Label>
              <Switch
                checked={localSettings.types[NOTIFICATION_TYPES.LIKE]}
                onCheckedChange={(checked) => handleTypeSettingChange(NOTIFICATION_TYPES.LIKE, checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label className="text-white">Comments</Label>
              <Switch
                checked={localSettings.types[NOTIFICATION_TYPES.COMMENT]}
                onCheckedChange={(checked) => handleTypeSettingChange(NOTIFICATION_TYPES.COMMENT, checked)}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationSystem;

