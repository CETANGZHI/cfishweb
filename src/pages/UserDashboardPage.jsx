import React, { useState } from 'react';
import { 
  User, 
  Wallet,
  TrendingUp,
  TrendingDown,
  Eye,
  Heart,
  ShoppingCart,
  Gavel,
  ArrowLeftRight,
  DollarSign,
  Coins,
  Award,
  Star,
  Calendar,
  Activity,
  BarChart3,
  PieChart,
  Settings,
  Edit,
  Copy,
  ExternalLink,
  Plus,
  Filter,
  Grid3X3,
  List,
  Clock,
  CheckCircle,
  AlertCircle,
  Zap
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Progress } from '../components/ui/progress';
import { Separator } from '../components/ui/separator';
import '../App.css';

const UserDashboardPage = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [selectedPeriod, setSelectedPeriod] = useState('7d');

  // Mock user data
  const userData = {
    username: 'CryptoArtist',
    walletAddress: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
    avatar: null,
    joinDate: '2024-12-15',
    verified: true,
    level: 'Gold Creator',
    followers: 1247,
    following: 89,
    totalEarnings: '45.7 SOL',
    totalEarningsUSD: '$2,285',
    cfishBalance: '12,450 CFISH',
    cfishBalanceUSD: '$622.50'
  };

  // Mock statistics
  const stats = {
    totalNFTs: 23,
    totalSales: 156,
    totalVolume: '45.7 SOL',
    avgPrice: '0.29 SOL',
    successRate: 87,
    views: 12450,
    likes: 3421,
    commissionEarned: '2.3 SOL'
  };

  // Mock NFT data
  const myNFTs = [
    {
      id: 1,
      title: 'Cosmic Whale #001',
      image: '🎨',
      status: 'listed',
      price: '2.5 SOL',
      priceUSD: '$125',
      views: 1205,
      likes: 234,
      listedDate: '2025-01-15',
      category: 'Digital Art'
    },
    {
      id: 2,
      title: 'Digital Dreams',
      image: '🌟',
      status: 'sold',
      price: '1,500 CFISH',
      priceUSD: '$75',
      views: 892,
      likes: 189,
      soldDate: '2025-01-14',
      category: 'Abstract'
    },
    {
      id: 3,
      title: 'Neon City #42',
      image: '🌃',
      status: 'auction',
      price: '3.8 SOL',
      priceUSD: '$190',
      views: 2341,
      likes: 456,
      endDate: '2025-01-20',
      category: 'Cyberpunk'
    },
    {
      id: 4,
      title: 'Abstract Flow',
      image: '🎭',
      status: 'draft',
      price: '1.2 SOL',
      priceUSD: '$60',
      views: 0,
      likes: 0,
      createdDate: '2025-01-16',
      category: 'Abstract'
    }
  ];

  // Mock activity data
  const recentActivity = [
    {
      id: 1,
      type: 'sale',
      title: 'Digital Dreams sold',
      amount: '1,500 CFISH',
      date: '2025-01-14',
      buyer: 'ArtCollector'
    },
    {
      id: 2,
      type: 'bid',
      title: 'New bid on Neon City #42',
      amount: '3.8 SOL',
      date: '2025-01-13',
      bidder: 'CryptoWhale'
    },
    {
      id: 3,
      type: 'list',
      title: 'Cosmic Whale #001 listed',
      amount: '2.5 SOL',
      date: '2025-01-12'
    },
    {
      id: 4,
      type: 'commission',
      title: 'Commission earned',
      amount: '0.15 SOL',
      date: '2025-01-11',
      from: 'Shared NFT sale'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'listed': return 'bg-green-500/20 text-green-400';
      case 'sold': return 'bg-blue-500/20 text-blue-400';
      case 'auction': return 'bg-purple-500/20 text-purple-400';
      case 'draft': return 'bg-gray-500/20 text-gray-300';
      default: return 'bg-muted/20 text-muted-foreground';
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'sale': return <DollarSign className="h-4 w-4" />;
      case 'bid': return <Gavel className="h-4 w-4" />;
      case 'list': return <Plus className="h-4 w-4" />;
      case 'commission': return <Award className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const NFTCard = ({ nft }) => (
    <Card className="nft-card group cursor-pointer">
      <div className="aspect-square bg-secondary/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">{nft.image}</div>
            <p className="text-muted-foreground">{nft.title}</p>
          </div>
        </div>
        
        {/* Status badge */}
        <div className="absolute top-4 left-4">
          <Badge className={getStatusColor(nft.status)}>
            {nft.status}
          </Badge>
        </div>

        {/* Stats */}
        <div className="absolute bottom-4 left-4 flex gap-4">
          <div className="bg-card/80 backdrop-blur-sm rounded-full px-3 py-1 text-sm flex items-center gap-2">
            <Heart className="h-4 w-4" />
            {nft.likes}
          </div>
          <div className="bg-card/80 backdrop-blur-sm rounded-full px-3 py-1 text-sm flex items-center gap-2">
            <Eye className="h-4 w-4" />
            {nft.views}
          </div>
        </div>

        {/* Action buttons */}
        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button size="sm" variant="secondary" className="bg-card/80 backdrop-blur-sm">
            <Edit className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="secondary" className="bg-card/80 backdrop-blur-sm">
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-foreground mb-1">{nft.title}</h3>
        <p className="text-sm text-muted-foreground mb-2">{nft.category}</p>
        
        <div className="flex justify-between items-center mb-3">
          <div>
            <span className="text-primary font-bold">{nft.price}</span>
            <span className="text-sm text-muted-foreground ml-2">{nft.priceUSD}</span>
          </div>
        </div>

        <div className="flex gap-2">
          {nft.status === 'draft' ? (
            <Button size="sm" className="btn-primary flex-1">
              <Plus className="h-4 w-4 mr-1" />
              List NFT
            </Button>
          ) : nft.status === 'listed' ? (
            <Button size="sm" variant="outline" className="flex-1">
              <Edit className="h-4 w-4 mr-1" />
              Edit Listing
            </Button>
          ) : nft.status === 'auction' ? (
            <Button size="sm" variant="outline" className="flex-1">
              <Gavel className="h-4 w-4 mr-1" />
              View Bids
            </Button>
          ) : (
            <Button size="sm" variant="outline" className="flex-1">
              <Eye className="h-4 w-4 mr-1" />
              View Details
            </Button>
          )}
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
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={userData.avatar} />
                <AvatarFallback className="bg-primary/20 text-primary text-xl">
                  {userData.username.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-responsive-xl font-bold text-foreground">
                    {userData.username}
                  </h1>
                  {userData.verified && (
                    <Badge className="bg-blue-500/20 text-blue-400">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                  <Badge className="bg-accent/20 text-accent">
                    {userData.level}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Wallet className="h-4 w-4" />
                    {userData.walletAddress.slice(0, 8)}...{userData.walletAddress.slice(-4)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Joined {new Date(userData.joinDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            <Button className="btn-primary">
              <Settings className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Earnings</p>
                  <p className="text-2xl font-bold text-primary">{userData.totalEarnings}</p>
                  <p className="text-sm text-muted-foreground">{userData.totalEarningsUSD}</p>
                </div>
                <div className="h-12 w-12 bg-primary/20 rounded-full flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">CFISH Balance</p>
                  <p className="text-2xl font-bold text-accent">{userData.cfishBalance}</p>
                  <p className="text-sm text-muted-foreground">{userData.cfishBalanceUSD}</p>
                </div>
                <div className="h-12 w-12 bg-accent/20 rounded-full flex items-center justify-center">
                  <Coins className="h-6 w-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total NFTs</p>
                  <p className="text-2xl font-bold text-foreground">{stats.totalNFTs}</p>
                  <p className="text-sm text-green-400 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    +3 this month
                  </p>
                </div>
                <div className="h-12 w-12 bg-secondary/20 rounded-full flex items-center justify-center">
                  <Award className="h-6 w-6 text-secondary-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                  <p className="text-2xl font-bold text-foreground">{stats.successRate}%</p>
                  <Progress value={stats.successRate} className="mt-2" />
                </div>
                <div className="h-12 w-12 bg-green-500/20 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - NFTs and Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* My NFTs */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    My NFTs ({myNFTs.length})
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {myNFTs.slice(0, 4).map((nft) => (
                      <NFTCard key={nft.id} nft={nft} />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myNFTs.map((nft) => (
                      <div key={nft.id} className="flex items-center gap-4 p-4 border border-border rounded-lg">
                        <div className="w-16 h-16 bg-secondary/20 rounded-lg flex items-center justify-center">
                          <span className="text-2xl">{nft.image}</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">{nft.title}</h3>
                          <p className="text-sm text-muted-foreground">{nft.category}</p>
                          <div className="flex items-center gap-4 mt-1">
                            <Badge className={getStatusColor(nft.status)} size="sm">
                              {nft.status}
                            </Badge>
                            <span className="text-sm text-primary font-medium">{nft.price}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {nft.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="h-4 w-4" />
                            {nft.likes}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {myNFTs.length > 4 && (
                  <div className="text-center mt-4">
                    <Button variant="outline">
                      View All NFTs ({myNFTs.length})
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-secondary/20 rounded-full flex items-center justify-center">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{activity.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {activity.buyer && `Buyer: ${activity.buyer}`}
                          {activity.bidder && `Bidder: ${activity.bidder}`}
                          {activity.from && activity.from}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-primary">{activity.amount}</p>
                        <p className="text-sm text-muted-foreground">{activity.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Analytics and Quick Actions */}
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
                <Button className="w-full btn-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New NFT
                </Button>
                <Button variant="outline" className="w-full">
                  <ArrowLeftRight className="h-4 w-4 mr-2" />
                  Propose Barter
                </Button>
                <Button variant="outline" className="w-full">
                  <Coins className="h-4 w-4 mr-2" />
                  Stake CFISH
                </Button>
                <Button variant="outline" className="w-full">
                  <Wallet className="h-4 w-4 mr-2" />
                  Manage Wallet
                </Button>
              </CardContent>
            </Card>

            {/* Performance Analytics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Views</span>
                    <span className="font-medium text-foreground">{stats.views.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Likes</span>
                    <span className="font-medium text-foreground">{stats.likes.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Avg. Price</span>
                    <span className="font-medium text-foreground">{stats.avgPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Commission Earned</span>
                    <span className="font-medium text-foreground">{stats.commissionEarned}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Social
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">{userData.followers}</p>
                    <p className="text-sm text-muted-foreground">Followers</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">{userData.following}</p>
                    <p className="text-sm text-muted-foreground">Following</p>
                  </div>
                </div>
                <Separator className="my-4" />
                <Button variant="outline" className="w-full">
                  <User className="h-4 w-4 mr-2" />
                  View Public Profile
                </Button>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-blue-500/10 rounded-lg">
                  <div className="h-2 w-2 bg-blue-400 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">New bid received</p>
                    <p className="text-xs text-muted-foreground">Neon City #42 - 3.8 SOL</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-green-500/10 rounded-lg">
                  <div className="h-2 w-2 bg-green-400 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">NFT sold</p>
                    <p className="text-xs text-muted-foreground">Digital Dreams - 1,500 CFISH</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  View All Notifications
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardPage;

