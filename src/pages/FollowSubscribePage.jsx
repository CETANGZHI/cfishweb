import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  UserMinus,
  Bell,
  BellOff,
  Star,
  Heart,
  Eye,
  MessageSquare,
  Share,
  Filter,
  Search,
  SortAsc,
  SortDesc,
  Grid,
  List,
  MoreVertical,
  Settings,
  Plus,
  X,
  Check,
  Clock,
  Calendar,
  TrendingUp,
  TrendingDown,
  Award,
  Target,
  Zap,
  Image,
  Video,
  Music,
  FileText,
  DollarSign,
  ExternalLink,
  Copy,
  Link,
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
  Edit,
  Save,
  Trash2,
  Archive,
  Bookmark,
  Flag,
  Shield,
  Info,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  Upload,
  Activity,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Input } from '../components/ui/input';
import { Switch } from '../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import '../App.css';

const FollowSubscribePage = () => {
  const [activeTab, setActiveTab] = useState('following');
  const [viewMode, setViewMode] = useState('grid');
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);

  // Mock following data
  const following = [
    {
      id: 1,
      username: 'ArtistX',
      displayName: 'Digital Artist X',
      avatar: '/api/placeholder/80/80',
      bio: 'Creating stunning digital art and NFTs. Passionate about cyberpunk aesthetics.',
      followers: 2847,
      following: 156,
      nfts: 45,
      totalSales: 234.5,
      currency: 'SOL',
      isVerified: true,
      isFollowing: true,
      notificationsEnabled: true,
      lastActive: '2025-01-18T10:30:00Z',
      joinDate: '2024-03-15',
      categories: ['Digital Art', 'Cyberpunk', 'Abstract'],
      recentActivity: 'Listed new NFT "Neon Dreams #007"',
      activityTime: '2 hours ago'
    },
    {
      id: 2,
      username: 'CryptoCollector',
      displayName: 'Crypto Collector Pro',
      avatar: '/api/placeholder/80/80',
      bio: 'Collecting rare and valuable NFTs. Focus on gaming assets and digital collectibles.',
      followers: 1523,
      following: 89,
      nfts: 128,
      totalSales: 567.8,
      currency: 'SOL',
      isVerified: false,
      isFollowing: true,
      notificationsEnabled: false,
      lastActive: '2025-01-18T08:15:00Z',
      joinDate: '2024-01-20',
      categories: ['Gaming', 'Collectibles', 'Rare Items'],
      recentActivity: 'Purchased "Gaming Asset Pack #003"',
      activityTime: '5 hours ago'
    },
    {
      id: 3,
      username: 'NaturePhotographer',
      displayName: 'Nature\'s Eye',
      avatar: '/api/placeholder/80/80',
      bio: 'Capturing the beauty of nature through digital photography and art.',
      followers: 3421,
      following: 234,
      nfts: 67,
      totalSales: 189.3,
      currency: 'SOL',
      isVerified: true,
      isFollowing: true,
      notificationsEnabled: true,
      lastActive: '2025-01-17T22:45:00Z',
      joinDate: '2024-02-10',
      categories: ['Photography', 'Nature', 'Landscape'],
      recentActivity: 'Created album "Mountain Serenity"',
      activityTime: '1 day ago'
    },
    {
      id: 4,
      username: 'MusicProducer',
      displayName: 'Beat Master',
      avatar: '/api/placeholder/80/80',
      bio: 'Electronic music producer creating audio-visual NFT experiences.',
      followers: 987,
      following: 67,
      nfts: 23,
      totalSales: 98.7,
      currency: 'SOL',
      isVerified: false,
      isFollowing: true,
      notificationsEnabled: true,
      lastActive: '2025-01-18T14:20:00Z',
      joinDate: '2024-05-08',
      categories: ['Music', 'Audio', 'Electronic'],
      recentActivity: 'Released "Synthwave Collection #001"',
      activityTime: '3 hours ago'
    },
    {
      id: 5,
      username: 'GameDevStudio',
      displayName: 'Indie Game Studio',
      avatar: '/api/placeholder/80/80',
      bio: 'Independent game development studio creating unique gaming NFTs and assets.',
      followers: 5632,
      following: 145,
      nfts: 89,
      totalSales: 445.2,
      currency: 'SOL',
      isVerified: true,
      isFollowing: true,
      notificationsEnabled: false,
      lastActive: '2025-01-18T11:00:00Z',
      joinDate: '2024-01-05',
      categories: ['Gaming', '3D Models', 'Assets'],
      recentActivity: 'Updated "RPG Character Pack #005"',
      activityTime: '4 hours ago'
    },
    {
      id: 6,
      username: 'AbstractArtist',
      displayName: 'Abstract Visionary',
      avatar: '/api/placeholder/80/80',
      bio: 'Exploring the boundaries of abstract art through digital mediums.',
      followers: 1876,
      following: 203,
      nfts: 34,
      totalSales: 156.9,
      currency: 'SOL',
      isVerified: false,
      isFollowing: true,
      notificationsEnabled: true,
      lastActive: '2025-01-18T09:30:00Z',
      joinDate: '2024-04-22',
      categories: ['Abstract', 'Experimental', 'Digital Art'],
      recentActivity: 'Started auction for "Chaos Theory #012"',
      activityTime: '6 hours ago'
    }
  ];

  // Mock followers data
  const followers = [
    {
      id: 1,
      username: 'NFTEnthusiast',
      displayName: 'NFT Enthusiast',
      avatar: '/api/placeholder/80/80',
      bio: 'Passionate about discovering new and emerging NFT artists.',
      followers: 456,
      following: 789,
      nfts: 12,
      totalSales: 23.4,
      currency: 'SOL',
      isVerified: false,
      isFollowingBack: false,
      followedDate: '2025-01-15T10:00:00Z',
      categories: ['Collector', 'Art Lover']
    },
    {
      id: 2,
      username: 'DigitalArtLover',
      displayName: 'Digital Art Lover',
      avatar: '/api/placeholder/80/80',
      bio: 'Collecting beautiful digital art pieces and supporting artists.',
      followers: 234,
      following: 567,
      nfts: 8,
      totalSales: 45.6,
      currency: 'SOL',
      isVerified: false,
      isFollowingBack: true,
      followedDate: '2025-01-12T14:30:00Z',
      categories: ['Collector', 'Digital Art']
    },
    {
      id: 3,
      username: 'CryptoInvestor',
      displayName: 'Crypto Investor',
      avatar: '/api/placeholder/80/80',
      bio: 'Investing in promising NFT projects and digital assets.',
      followers: 1234,
      following: 345,
      nfts: 56,
      totalSales: 234.7,
      currency: 'SOL',
      isVerified: true,
      isFollowingBack: false,
      followedDate: '2025-01-10T09:15:00Z',
      categories: ['Investor', 'Trader']
    }
  ];

  // Mock suggested users
  const suggestedUsers = [
    {
      id: 1,
      username: 'EmergingArtist',
      displayName: 'Emerging Digital Artist',
      avatar: '/api/placeholder/80/80',
      bio: 'New to the NFT space but creating amazing digital art.',
      followers: 89,
      following: 45,
      nfts: 15,
      totalSales: 12.3,
      currency: 'SOL',
      isVerified: false,
      categories: ['Digital Art', 'Emerging'],
      reason: 'Similar interests in digital art'
    },
    {
      id: 2,
      username: 'VirtualWorldBuilder',
      displayName: 'Virtual World Builder',
      avatar: '/api/placeholder/80/80',
      bio: 'Creating immersive virtual worlds and metaverse assets.',
      followers: 567,
      following: 123,
      nfts: 34,
      totalSales: 89.4,
      currency: 'SOL',
      isVerified: false,
      categories: ['Metaverse', '3D', 'Virtual Worlds'],
      reason: 'Popular in your network'
    },
    {
      id: 3,
      username: 'AIArtCreator',
      displayName: 'AI Art Creator',
      avatar: '/api/placeholder/80/80',
      bio: 'Exploring the intersection of AI and digital art creation.',
      followers: 1234,
      following: 234,
      nfts: 67,
      totalSales: 156.7,
      currency: 'SOL',
      isVerified: true,
      categories: ['AI Art', 'Technology', 'Innovation'],
      reason: 'Trending artist'
    }
  ];

  const handleFollow = (userId) => {
    console.log('Following user:', userId);
  };

  const handleUnfollow = (userId) => {
    console.log('Unfollowing user:', userId);
  };

  const toggleNotifications = (userId) => {
    console.log('Toggling notifications for user:', userId);
  };

  const UserCard = ({ user, type }) => (
    <Card className="user-card cursor-pointer transition-all hover:border-primary/50 group">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="relative">
            <img src={user.avatar} alt={user.username} className="w-16 h-16 rounded-full object-cover" />
            {user.isVerified && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                <Check className="h-3 w-3 text-white" />
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  {user.displayName}
                  {user.isVerified && (
                    <Badge className="bg-blue-500/20 text-blue-400">
                      <Check className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </h3>
                <p className="text-sm text-muted-foreground">@{user.username}</p>
              </div>
              
              <div className="flex items-center gap-2">
                {type === 'following' && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleNotifications(user.id)}
                      className="h-8 w-8 p-0"
                    >
                      {user.notificationsEnabled ? (
                        <Bell className="h-4 w-4 text-primary" />
                      ) : (
                        <BellOff className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUnfollow(user.id)}
                    >
                      <UserMinus className="h-4 w-4 mr-1" />
                      Unfollow
                    </Button>
                  </>
                )}
                
                {type === 'followers' && (
                  <Button
                    variant={user.isFollowingBack ? "outline" : "default"}
                    size="sm"
                    onClick={() => user.isFollowingBack ? handleUnfollow(user.id) : handleFollow(user.id)}
                  >
                    {user.isFollowingBack ? (
                      <>
                        <UserMinus className="h-4 w-4 mr-1" />
                        Unfollow
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4 mr-1" />
                        Follow Back
                      </>
                    )}
                  </Button>
                )}
                
                {type === 'suggested' && (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleFollow(user.id)}
                  >
                    <UserPlus className="h-4 w-4 mr-1" />
                    Follow
                  </Button>
                )}
                
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {user.bio}
            </p>

            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {user.followers} followers
              </span>
              <span className="flex items-center gap-1">
                <UserPlus className="h-3 w-3" />
                {user.following} following
              </span>
              <span className="flex items-center gap-1">
                <Image className="h-3 w-3" />
                {user.nfts} NFTs
              </span>
              {user.totalSales && (
                <span className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  {user.totalSales} {user.currency}
                </span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex gap-1">
                {user.categories.slice(0, 2).map((category, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {category}
                  </Badge>
                ))}
                {user.categories.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{user.categories.length - 2}
                  </Badge>
                )}
              </div>
              
              {user.recentActivity && (
                <div className="text-xs text-muted-foreground">
                  <p className="line-clamp-1">{user.recentActivity}</p>
                  <p>{user.activityTime}</p>
                </div>
              )}
              
              {user.reason && (
                <div className="text-xs text-primary">
                  {user.reason}
                </div>
              )}
              
              {user.followedDate && (
                <div className="text-xs text-muted-foreground">
                  Followed {new Date(user.followedDate).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="fullscreen-layout pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-responsive-xl font-bold text-foreground mb-2">
                Follow & Subscribe
              </h1>
              <p className="text-muted-foreground">
                Connect with artists, collectors, and creators in the CFISH community
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowNotificationSettings(!showNotificationSettings)}>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button className="btn-primary">
                <Search className="h-4 w-4 mr-2" />
                Discover Users
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
                  <p className="text-sm font-medium text-muted-foreground">Following</p>
                  <p className="text-2xl font-bold text-foreground">{following.length}</p>
                  <p className="text-sm text-green-400 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    +3 this month
                  </p>
                </div>
                <div className="h-12 w-12 bg-primary/20 rounded-full flex items-center justify-center">
                  <UserPlus className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Followers</p>
                  <p className="text-2xl font-bold text-foreground">{followers.length}</p>
                  <p className="text-sm text-blue-400 flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    +1 this week
                  </p>
                </div>
                <div className="h-12 w-12 bg-accent/20 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Notifications</p>
                  <p className="text-2xl font-bold text-foreground">
                    {following.filter(u => u.notificationsEnabled).length}
                  </p>
                  <p className="text-sm text-yellow-400 flex items-center gap-1">
                    <Bell className="h-3 w-3" />
                    Active alerts
                  </p>
                </div>
                <div className="h-12 w-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                  <Bell className="h-6 w-6 text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Suggestions</p>
                  <p className="text-2xl font-bold text-foreground">{suggestedUsers.length}</p>
                  <p className="text-sm text-green-400 flex items-center gap-1">
                    <Target className="h-3 w-3" />
                    Recommended
                  </p>
                </div>
                <div className="h-12 w-12 bg-green-500/20 rounded-full flex items-center justify-center">
                  <Target className="h-6 w-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="following">Following</TabsTrigger>
                <TabsTrigger value="followers">Followers</TabsTrigger>
                <TabsTrigger value="suggested">Suggested</TabsTrigger>
              </TabsList>

              {/* Filters and Controls */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Input placeholder="Search users..." className="flex-1" />
                    <div className="flex gap-2">
                      <Select defaultValue="all">
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Users</SelectItem>
                          <SelectItem value="verified">Verified</SelectItem>
                          <SelectItem value="active">Recently Active</SelectItem>
                          <SelectItem value="notifications">With Notifications</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Select defaultValue="newest">
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="newest">Newest</SelectItem>
                          <SelectItem value="oldest">Oldest</SelectItem>
                          <SelectItem value="mostFollowers">Most Followers</SelectItem>
                          <SelectItem value="mostActive">Most Active</SelectItem>
                        </SelectContent>
                      </Select>

                      <div className="flex border border-border rounded-lg">
                        <Button
                          variant={viewMode === 'grid' ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => setViewMode('grid')}
                          className="rounded-r-none"
                        >
                          <Grid className="h-4 w-4" />
                        </Button>
                        <Button
                          variant={viewMode === 'list' ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => setViewMode('list')}
                          className="rounded-l-none"
                        >
                          <List className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Following Tab */}
              <TabsContent value="following" className="space-y-4">
                {following.length > 0 ? (
                  <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-4'}>
                    {following.map((user) => (
                      <UserCard key={user.id} user={user} type="following" />
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <UserPlus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-semibold text-foreground mb-2">Not following anyone yet</h3>
                      <p className="text-muted-foreground">
                        Discover and follow artists and creators to see their latest work.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Followers Tab */}
              <TabsContent value="followers" className="space-y-4">
                {followers.length > 0 ? (
                  <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-4'}>
                    {followers.map((user) => (
                      <UserCard key={user.id} user={user} type="followers" />
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-semibold text-foreground mb-2">No followers yet</h3>
                      <p className="text-muted-foreground">
                        Create amazing NFTs and engage with the community to gain followers.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Suggested Tab */}
              <TabsContent value="suggested" className="space-y-4">
                {suggestedUsers.length > 0 ? (
                  <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-4'}>
                    {suggestedUsers.map((user) => (
                      <UserCard key={user.id} user={user} type="suggested" />
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-semibold text-foreground mb-2">No suggestions available</h3>
                      <p className="text-muted-foreground">
                        Check back later for personalized user recommendations.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
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
                  <Search className="h-4 w-4 mr-2" />
                  Find Friends
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Invite Friends
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <Bell className="h-4 w-4 mr-2" />
                  Manage Notifications
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Export Contacts
                </Button>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            {showNotificationSettings && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notification Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">New Followers</p>
                      <p className="text-sm text-muted-foreground">Get notified when someone follows you</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Following Activity</p>
                      <p className="text-sm text-muted-foreground">Updates from people you follow</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">New NFT Releases</p>
                      <p className="text-sm text-muted-foreground">When followed users release new NFTs</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Price Drops</p>
                      <p className="text-sm text-muted-foreground">When followed users lower NFT prices</p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Auction Alerts</p>
                      <p className="text-sm text-muted-foreground">When followed users start auctions</p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Activity Feed */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {following.slice(0, 4).map((user) => (
                  <div key={user.id} className="flex items-center gap-3 p-2 border border-border rounded-lg">
                    <img src={user.avatar} alt={user.username} className="w-8 h-8 rounded-full object-cover" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{user.username}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{user.recentActivity}</p>
                      <p className="text-xs text-muted-foreground">{user.activityTime}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Popular Categories
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { name: 'Digital Art', count: 45, color: 'text-blue-400' },
                  { name: 'Gaming', count: 32, color: 'text-green-400' },
                  { name: 'Photography', count: 28, color: 'text-purple-400' },
                  { name: 'Music', count: 19, color: 'text-yellow-400' },
                  { name: 'Collectibles', count: 15, color: 'text-red-400' }
                ].map((category) => (
                  <button
                    key={category.name}
                    className="w-full flex items-center justify-between p-2 rounded-lg transition-colors hover:bg-secondary/10"
                  >
                    <span className="text-foreground">{category.name}</span>
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

export default FollowSubscribePage;

