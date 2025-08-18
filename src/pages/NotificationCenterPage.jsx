import React, { useState } from 'react';
import { 
  Bell,
  BellRing,
  BellOff,
  Check,
  X,
  Trash2,
  Filter,
  Search,
  Settings,
  MoreVertical,
  Eye,
  EyeOff,
  Star,
  Heart,
  MessageSquare,
  Share,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Award,
  Gift,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  User,
  Users,
  Image,
  Video,
  Music,
  FileText,
  ExternalLink,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Download,
  Upload,
  Archive,
  Bookmark,
  Flag,
  Shield,
  Zap,
  Target,
  Coins,
  Percent,
  Globe,
  Smartphone,
  Mail,
  Volume2,
  VolumeX,
  Palette,
  Moon,
  Sun,
  Monitor,
  Languages,
  HelpCircle,
  Plus,
  Minus,
  Edit,
  Save,
  Copy,
  Link,
  QrCode,
  Scan
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Input } from '../components/ui/input';
import { Switch } from '../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import '../App.css';

const NotificationCenterPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [showSettings, setShowSettings] = useState(false);

  // Mock notifications data
  const notifications = [
    {
      id: 1,
      type: 'sale',
      title: 'NFT Sold Successfully',
      message: 'Your NFT "Digital Dreams #001" has been sold for 2.5 SOL',
      timestamp: '2025-01-18 14:30:00',
      read: false,
      priority: 'high',
      category: 'trading',
      icon: <DollarSign className="h-5 w-5" />,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
      actionUrl: '/nft/1',
      actionText: 'View Transaction'
    },
    {
      id: 2,
      type: 'offer',
      title: 'New Offer Received',
      message: 'CryptoCollector made an offer of 1.8 SOL for "Neon Dreams #003"',
      timestamp: '2025-01-18 13:45:00',
      read: false,
      priority: 'medium',
      category: 'trading',
      icon: <TrendingUp className="h-5 w-5" />,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      actionUrl: '/offers/2',
      actionText: 'View Offer'
    },
    {
      id: 3,
      type: 'follow',
      title: 'New Follower',
      message: 'ArtLover123 started following you',
      timestamp: '2025-01-18 12:20:00',
      read: true,
      priority: 'low',
      category: 'social',
      icon: <Users className="h-5 w-5" />,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
      actionUrl: '/profile/artlover123',
      actionText: 'View Profile'
    },
    {
      id: 4,
      type: 'comment',
      title: 'New Comment',
      message: 'Someone commented on your NFT "Abstract Flow #004"',
      timestamp: '2025-01-18 11:15:00',
      read: true,
      priority: 'medium',
      category: 'social',
      icon: <MessageSquare className="h-5 w-5" />,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20',
      actionUrl: '/nft/4',
      actionText: 'View Comment'
    },
    {
      id: 5,
      type: 'like',
      title: 'NFT Liked',
      message: '5 people liked your NFT "Cyberpunk City #002"',
      timestamp: '2025-01-18 10:30:00',
      read: true,
      priority: 'low',
      category: 'social',
      icon: <Heart className="h-5 w-5" />,
      color: 'text-red-400',
      bgColor: 'bg-red-500/20',
      actionUrl: '/nft/2',
      actionText: 'View NFT'
    },
    {
      id: 6,
      type: 'system',
      title: 'Platform Update',
      message: 'New features have been added to the marketplace. Check them out!',
      timestamp: '2025-01-18 09:00:00',
      read: false,
      priority: 'medium',
      category: 'system',
      icon: <Info className="h-5 w-5" />,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      actionUrl: '/updates',
      actionText: 'Learn More'
    },
    {
      id: 7,
      type: 'reward',
      title: 'Staking Rewards',
      message: 'You earned 12.5 CFISH tokens from staking rewards',
      timestamp: '2025-01-18 08:00:00',
      read: true,
      priority: 'high',
      category: 'rewards',
      icon: <Coins className="h-5 w-5" />,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
      actionUrl: '/staking',
      actionText: 'View Rewards'
    },
    {
      id: 8,
      type: 'auction',
      title: 'Auction Ending Soon',
      message: 'Your auction for "Digital Landscape #005" ends in 2 hours',
      timestamp: '2025-01-18 07:30:00',
      read: false,
      priority: 'high',
      category: 'trading',
      icon: <Clock className="h-5 w-5" />,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/20',
      actionUrl: '/auction/5',
      actionText: 'View Auction'
    },
    {
      id: 9,
      type: 'security',
      title: 'Security Alert',
      message: 'New login detected from a different device',
      timestamp: '2025-01-17 22:15:00',
      read: true,
      priority: 'high',
      category: 'security',
      icon: <Shield className="h-5 w-5" />,
      color: 'text-red-400',
      bgColor: 'bg-red-500/20',
      actionUrl: '/security',
      actionText: 'Review Activity'
    },
    {
      id: 10,
      type: 'barter',
      title: 'Barter Proposal',
      message: 'NFTTrader wants to trade "Space Art #001" for your "Ocean Waves #003"',
      timestamp: '2025-01-17 20:45:00',
      read: false,
      priority: 'medium',
      category: 'trading',
      icon: <RefreshCw className="h-5 w-5" />,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/20',
      actionUrl: '/barter/10',
      actionText: 'View Proposal'
    }
  ];

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    tradingAlerts: true,
    socialNotifications: true,
    systemUpdates: true,
    securityAlerts: true,
    rewardNotifications: true,
    auctionAlerts: true,
    barterNotifications: true,
    quietHours: false,
    quietStart: '22:00',
    quietEnd: '08:00',
    frequency: 'instant',
    soundEnabled: true,
    vibrationEnabled: true
  });

  const getNotificationsByCategory = (category) => {
    if (category === 'all') return notifications;
    if (category === 'unread') return notifications.filter(n => !n.read);
    return notifications.filter(n => n.category === category);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-500';
    }
  };

  const markAsRead = (id) => {
    // Mark notification as read logic
    console.log('Marking notification as read:', id);
  };

  const markAllAsRead = () => {
    // Mark all notifications as read logic
    console.log('Marking all notifications as read');
  };

  const deleteNotification = (id) => {
    // Delete notification logic
    console.log('Deleting notification:', id);
  };

  const deleteSelected = () => {
    // Delete selected notifications logic
    console.log('Deleting selected notifications:', selectedNotifications);
    setSelectedNotifications([]);
  };

  const toggleSelection = (id) => {
    setSelectedNotifications(prev => 
      prev.includes(id) 
        ? prev.filter(nId => nId !== id)
        : [...prev, id]
    );
  };

  const selectAll = () => {
    const currentNotifications = getNotificationsByCategory(activeTab);
    setSelectedNotifications(currentNotifications.map(n => n.id));
  };

  const clearSelection = () => {
    setSelectedNotifications([]);
  };

  const NotificationItem = ({ notification }) => (
    <Card className={`notification-item cursor-pointer transition-all hover:border-primary/50 border-l-4 ${getPriorityColor(notification.priority)} ${!notification.read ? 'bg-secondary/10' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={selectedNotifications.includes(notification.id)}
              onChange={() => toggleSelection(notification.id)}
              className="rounded border-border"
            />
            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${notification.bgColor}`}>
              <span className={notification.color}>
                {notification.icon}
              </span>
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className={`font-semibold ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {notification.title}
                  {!notification.read && (
                    <span className="ml-2 w-2 h-2 bg-primary rounded-full inline-block"></span>
                  )}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {notification.message}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {notification.priority}
                </Badge>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {notification.timestamp.split(' ')[1]}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {notification.timestamp.split(' ')[0]}
                </span>
                <Badge variant="outline" className="text-xs">
                  {notification.category}
                </Badge>
              </div>
              
              <div className="flex items-center gap-2">
                {notification.actionUrl && (
                  <Button variant="outline" size="sm">
                    {notification.actionText}
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                )}
                
                <div className="flex items-center gap-1">
                  {!notification.read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => markAsRead(notification.id)}
                      className="h-6 w-6 p-0"
                    >
                      <Check className="h-3 w-3" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteNotification(notification.id)}
                    className="h-6 w-6 p-0 text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const SettingItem = ({ icon, title, description, children, action }) => (
    <div className="flex items-center justify-between p-4 border border-border rounded-lg">
      <div className="flex items-start gap-3 flex-1">
        <div className="h-10 w-10 bg-secondary/20 rounded-full flex items-center justify-center">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
          {children}
        </div>
      </div>
      {action && (
        <div className="ml-4">
          {action}
        </div>
      )}
    </div>
  );

  return (
    <div className="fullscreen-layout pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-responsive-xl font-bold text-foreground mb-2">
                Notification Center
              </h1>
              <p className="text-muted-foreground">
                Stay updated with all your platform activities and alerts
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowSettings(!showSettings)}>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button variant="outline" onClick={markAllAsRead}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark All Read
              </Button>
              <Button className="btn-primary">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Notifications</p>
                  <p className="text-2xl font-bold text-foreground">{notifications.length}</p>
                  <p className="text-sm text-blue-400 flex items-center gap-1">
                    <Bell className="h-3 w-3" />
                    All time
                  </p>
                </div>
                <div className="h-12 w-12 bg-primary/20 rounded-full flex items-center justify-center">
                  <Bell className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Unread</p>
                  <p className="text-2xl font-bold text-foreground">
                    {notifications.filter(n => !n.read).length}
                  </p>
                  <p className="text-sm text-orange-400 flex items-center gap-1">
                    <BellRing className="h-3 w-3" />
                    Needs attention
                  </p>
                </div>
                <div className="h-12 w-12 bg-orange-500/20 rounded-full flex items-center justify-center">
                  <BellRing className="h-6 w-6 text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">High Priority</p>
                  <p className="text-2xl font-bold text-foreground">
                    {notifications.filter(n => n.priority === 'high').length}
                  </p>
                  <p className="text-sm text-red-400 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    Urgent
                  </p>
                </div>
                <div className="h-12 w-12 bg-red-500/20 rounded-full flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Today</p>
                  <p className="text-2xl font-bold text-foreground">
                    {notifications.filter(n => n.timestamp.includes('2025-01-18')).length}
                  </p>
                  <p className="text-sm text-green-400 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    Recent activity
                  </p>
                </div>
                <div className="h-12 w-12 bg-green-500/20 rounded-full flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Notifications List */}
          <div className="lg:col-span-3 space-y-6">
            {/* Filters and Controls */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Input placeholder="Search notifications..." className="flex-1" />
                  <div className="flex gap-2">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="trading">Trading</SelectItem>
                        <SelectItem value="social">Social</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                        <SelectItem value="security">Security</SelectItem>
                        <SelectItem value="rewards">Rewards</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select defaultValue="newest">
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Newest</SelectItem>
                        <SelectItem value="oldest">Oldest</SelectItem>
                        <SelectItem value="priority">Priority</SelectItem>
                        <SelectItem value="unread">Unread First</SelectItem>
                      </SelectContent>
                    </Select>

                    {selectedNotifications.length > 0 && (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={deleteSelected}>
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete ({selectedNotifications.length})
                        </Button>
                        <Button variant="outline" size="sm" onClick={clearSelection}>
                          <X className="h-4 w-4 mr-1" />
                          Clear
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {selectedNotifications.length === 0 && (
                  <div className="flex items-center gap-2 mt-4">
                    <Button variant="outline" size="sm" onClick={selectAll}>
                      <Check className="h-4 w-4 mr-1" />
                      Select All
                    </Button>
                    <Button variant="outline" size="sm" onClick={markAllAsRead}>
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Mark All Read
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Notification Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="unread">Unread</TabsTrigger>
                <TabsTrigger value="trading">Trading</TabsTrigger>
                <TabsTrigger value="social">Social</TabsTrigger>
                <TabsTrigger value="system">System</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="space-y-4">
                {getNotificationsByCategory(activeTab).length > 0 ? (
                  getNotificationsByCategory(activeTab).map((notification) => (
                    <NotificationItem key={notification.id} notification={notification} />
                  ))
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <BellOff className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-semibold text-foreground mb-2">No notifications</h3>
                      <p className="text-muted-foreground">
                        You're all caught up! No {activeTab === 'all' ? '' : activeTab} notifications at the moment.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Settings Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark All Read
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <Archive className="h-4 w-4 mr-2" />
                  Archive Old
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Export History
                </Button>
                
                <Button variant="outline" className="w-full justify-start text-red-400 hover:text-red-300">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All
                </Button>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            {showSettings && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Notification Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <SettingItem
                    icon={<Mail className="h-5 w-5" />}
                    title="Email Notifications"
                    description="Receive notifications via email"
                    action={
                      <Switch
                        checked={notificationSettings.emailNotifications}
                        onCheckedChange={(checked) => 
                          setNotificationSettings({...notificationSettings, emailNotifications: checked})
                        }
                      />
                    }
                  />

                  <SettingItem
                    icon={<Smartphone className="h-5 w-5" />}
                    title="Push Notifications"
                    description="Receive push notifications"
                    action={
                      <Switch
                        checked={notificationSettings.pushNotifications}
                        onCheckedChange={(checked) => 
                          setNotificationSettings({...notificationSettings, pushNotifications: checked})
                        }
                      />
                    }
                  />

                  <SettingItem
                    icon={<DollarSign className="h-5 w-5" />}
                    title="Trading Alerts"
                    description="NFT sales and offers"
                    action={
                      <Switch
                        checked={notificationSettings.tradingAlerts}
                        onCheckedChange={(checked) => 
                          setNotificationSettings({...notificationSettings, tradingAlerts: checked})
                        }
                      />
                    }
                  />

                  <SettingItem
                    icon={<Users className="h-5 w-5" />}
                    title="Social Notifications"
                    description="Follows, likes, and comments"
                    action={
                      <Switch
                        checked={notificationSettings.socialNotifications}
                        onCheckedChange={(checked) => 
                          setNotificationSettings({...notificationSettings, socialNotifications: checked})
                        }
                      />
                    }
                  />

                  <SettingItem
                    icon={<Volume2 className="h-5 w-5" />}
                    title="Sound Effects"
                    description="Play sounds for notifications"
                    action={
                      <Switch
                        checked={notificationSettings.soundEnabled}
                        onCheckedChange={(checked) => 
                          setNotificationSettings({...notificationSettings, soundEnabled: checked})
                        }
                      />
                    }
                  />

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Notification Frequency
                    </label>
                    <Select 
                      value={notificationSettings.frequency}
                      onValueChange={(value) => 
                        setNotificationSettings({...notificationSettings, frequency: value})
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="instant">Instant</SelectItem>
                        <SelectItem value="hourly">Hourly Digest</SelectItem>
                        <SelectItem value="daily">Daily Digest</SelectItem>
                        <SelectItem value="weekly">Weekly Digest</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Notification Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Categories
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { key: 'trading', label: 'Trading', count: notifications.filter(n => n.category === 'trading').length, color: 'text-green-400' },
                  { key: 'social', label: 'Social', count: notifications.filter(n => n.category === 'social').length, color: 'text-purple-400' },
                  { key: 'system', label: 'System', count: notifications.filter(n => n.category === 'system').length, color: 'text-blue-400' },
                  { key: 'security', label: 'Security', count: notifications.filter(n => n.category === 'security').length, color: 'text-red-400' },
                  { key: 'rewards', label: 'Rewards', count: notifications.filter(n => n.category === 'rewards').length, color: 'text-yellow-400' }
                ].map((category) => (
                  <button
                    key={category.key}
                    onClick={() => setActiveTab(category.key)}
                    className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors ${
                      activeTab === category.key ? 'bg-primary/10 border border-primary/20' : 'hover:bg-secondary/10'
                    }`}
                  >
                    <span className="text-foreground">{category.label}</span>
                    <Badge variant="outline" className={category.color}>
                      {category.count}
                    </Badge>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationCenterPage;

