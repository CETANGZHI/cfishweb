import React, { useState } from 'react';
import { 
  Album,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Share,
  Copy,
  ExternalLink,
  Grid,
  List,
  Filter,
  Search,
  SortAsc,
  SortDesc,
  Calendar,
  Tag,
  Heart,
  MessageSquare,
  Star,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Image,
  Video,
  Music,
  FileText,
  Download,
  Upload,
  Settings,
  MoreVertical,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Move,
  Crop,
  Layers,
  Palette,
  Brush,
  Eraser,
  Type,
  Save,
  X,
  Check,
  AlertTriangle,
  Info,
  HelpCircle,
  Clock,
  Globe,
  Lock,
  Unlock,
  Award,
  Target,
  Zap,
  Coins,
  Percent,
  BarChart3,
  PieChart,
  LineChart,
  Activity
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Switch } from '../components/ui/switch';
import '../App.css';

const SellerAlbumPage = () => {
  const [activeTab, setActiveTab] = useState('albums');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Mock albums data
  const albums = [
    {
      id: 1,
      title: 'Digital Dreams Collection',
      description: 'A collection of surreal digital artworks exploring the boundaries between reality and imagination.',
      coverImage: '/api/placeholder/400/300',
      nftCount: 24,
      totalValue: 45.6,
      currency: 'SOL',
      visibility: 'public',
      created: '2024-01-15',
      updated: '2024-01-18',
      views: 1247,
      likes: 89,
      shares: 23,
      tags: ['Digital Art', 'Surreal', 'Abstract'],
      category: 'Art',
      status: 'active',
      featured: true
    },
    {
      id: 2,
      title: 'Cyberpunk Chronicles',
      description: 'Futuristic NFTs depicting a neon-lit cyberpunk world with advanced technology and urban landscapes.',
      coverImage: '/api/placeholder/400/300',
      nftCount: 18,
      totalValue: 32.4,
      currency: 'SOL',
      visibility: 'public',
      created: '2024-01-10',
      updated: '2024-01-16',
      views: 892,
      likes: 67,
      shares: 15,
      tags: ['Cyberpunk', 'Futuristic', 'Neon'],
      category: 'Art',
      status: 'active',
      featured: false
    },
    {
      id: 3,
      title: 'Nature\'s Symphony',
      description: 'Beautiful natural landscapes and wildlife captured in stunning detail through digital art.',
      coverImage: '/api/placeholder/400/300',
      nftCount: 31,
      totalValue: 67.8,
      currency: 'SOL',
      visibility: 'public',
      created: '2024-01-05',
      updated: '2024-01-17',
      views: 1856,
      likes: 134,
      shares: 41,
      tags: ['Nature', 'Landscape', 'Wildlife'],
      category: 'Photography',
      status: 'active',
      featured: true
    },
    {
      id: 4,
      title: 'Abstract Emotions',
      description: 'Experimental abstract pieces that convey deep emotions through color, form, and movement.',
      coverImage: '/api/placeholder/400/300',
      nftCount: 12,
      totalValue: 28.9,
      currency: 'SOL',
      visibility: 'private',
      created: '2024-01-12',
      updated: '2024-01-14',
      views: 456,
      likes: 34,
      shares: 8,
      tags: ['Abstract', 'Emotional', 'Experimental'],
      category: 'Art',
      status: 'draft',
      featured: false
    },
    {
      id: 5,
      title: 'Gaming Assets Pack',
      description: 'High-quality 3D models and textures designed for modern video games and virtual worlds.',
      coverImage: '/api/placeholder/400/300',
      nftCount: 56,
      totalValue: 89.2,
      currency: 'SOL',
      visibility: 'public',
      created: '2024-01-08',
      updated: '2024-01-19',
      views: 2134,
      likes: 178,
      shares: 67,
      tags: ['Gaming', '3D Models', 'Textures'],
      category: 'Gaming',
      status: 'active',
      featured: true
    },
    {
      id: 6,
      title: 'Music Visualizations',
      description: 'Dynamic visual representations of music and sound, creating immersive audio-visual experiences.',
      coverImage: '/api/placeholder/400/300',
      nftCount: 15,
      totalValue: 41.3,
      currency: 'SOL',
      visibility: 'public',
      created: '2024-01-13',
      updated: '2024-01-18',
      views: 723,
      likes: 56,
      shares: 19,
      tags: ['Music', 'Visualization', 'Audio'],
      category: 'Music',
      status: 'active',
      featured: false
    }
  ];

  // Mock NFTs in selected album
  const albumNFTs = [
    {
      id: 1,
      title: 'Ethereal Landscape #001',
      image: '/api/placeholder/300/300',
      price: 2.5,
      currency: 'SOL',
      likes: 23,
      views: 156,
      rarity: 'Rare',
      status: 'listed'
    },
    {
      id: 2,
      title: 'Digital Sunset #002',
      image: '/api/placeholder/300/300',
      price: 1.8,
      currency: 'SOL',
      likes: 18,
      views: 134,
      rarity: 'Common',
      status: 'listed'
    },
    {
      id: 3,
      title: 'Neon Dreams #003',
      image: '/api/placeholder/300/300',
      price: 3.2,
      currency: 'SOL',
      likes: 31,
      views: 198,
      rarity: 'Epic',
      status: 'sold'
    },
    {
      id: 4,
      title: 'Abstract Flow #004',
      image: '/api/placeholder/300/300',
      price: 1.5,
      currency: 'SOL',
      likes: 15,
      views: 89,
      rarity: 'Common',
      status: 'draft'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400';
      case 'draft': return 'bg-yellow-500/20 text-yellow-400';
      case 'private': return 'bg-gray-500/20 text-gray-300';
      default: return 'bg-blue-500/20 text-blue-400';
    }
  };

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'Common': return 'bg-gray-500/20 text-gray-300';
      case 'Rare': return 'bg-blue-500/20 text-blue-400';
      case 'Epic': return 'bg-purple-500/20 text-purple-400';
      case 'Legendary': return 'bg-yellow-500/20 text-yellow-400';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  const AlbumCard = ({ album }) => (
    <Card className="album-card cursor-pointer transition-all hover:border-primary/50 group">
      <div className="relative">
        <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-t-lg flex items-center justify-center">
          <Image className="h-16 w-16 text-muted-foreground" />
        </div>
        
        {album.featured && (
          <Badge className="absolute top-2 left-2 bg-yellow-500/20 text-yellow-400">
            <Star className="h-3 w-3 mr-1" />
            Featured
          </Badge>
        )}
        
        <Badge className={`absolute top-2 right-2 ${getStatusColor(album.status)}`}>
          {album.status}
        </Badge>

        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-lg flex items-center justify-center gap-2">
          <Button size="sm" variant="secondary">
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          <Button size="sm" variant="secondary">
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-foreground line-clamp-1">{album.title}</h3>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {album.description}
        </p>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
          <span className="flex items-center gap-1">
            <Image className="h-3 w-3" />
            {album.nftCount} NFTs
          </span>
          <span className="flex items-center gap-1">
            <DollarSign className="h-3 w-3" />
            {album.totalValue} {album.currency}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {album.views}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {album.tags.slice(0, 2).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {album.tags.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{album.tags.length - 2}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Heart className="h-3 w-3" />
              {album.likes}
            </span>
            <span className="flex items-center gap-1">
              <Share className="h-3 w-3" />
              {album.shares}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const NFTCard = ({ nft }) => (
    <Card className="nft-card cursor-pointer transition-all hover:border-primary/50 group">
      <div className="relative">
        <div className="aspect-square bg-gradient-to-br from-primary/20 to-accent/20 rounded-t-lg flex items-center justify-center">
          <Image className="h-12 w-12 text-muted-foreground" />
        </div>
        
        <Badge className={`absolute top-2 left-2 ${getRarityColor(nft.rarity)}`}>
          {nft.rarity}
        </Badge>
        
        <Badge className={`absolute top-2 right-2 ${getStatusColor(nft.status)}`}>
          {nft.status}
        </Badge>

        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-lg flex items-center justify-center gap-2">
          <Button size="sm" variant="secondary">
            <Eye className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="secondary">
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <CardContent className="p-3">
        <h3 className="font-semibold text-foreground text-sm line-clamp-1 mb-2">
          {nft.title}
        </h3>
        
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-foreground">
            {nft.price} {nft.currency}
          </span>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Heart className="h-3 w-3" />
              {nft.likes}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {nft.views}
            </span>
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
                Seller Albums
              </h1>
              <p className="text-muted-foreground">
                Organize and showcase your NFT collections in beautiful albums
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button className="btn-primary" onClick={() => setShowCreateModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Album
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
                  <p className="text-sm font-medium text-muted-foreground">Total Albums</p>
                  <p className="text-2xl font-bold text-foreground">6</p>
                  <p className="text-sm text-green-400 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    +2 this month
                  </p>
                </div>
                <div className="h-12 w-12 bg-primary/20 rounded-full flex items-center justify-center">
                  <Album className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total NFTs</p>
                  <p className="text-2xl font-bold text-foreground">156</p>
                  <p className="text-sm text-green-400 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    +12 this week
                  </p>
                </div>
                <div className="h-12 w-12 bg-accent/20 rounded-full flex items-center justify-center">
                  <Image className="h-6 w-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Value</p>
                  <p className="text-2xl font-bold text-foreground">305.2 SOL</p>
                  <p className="text-sm text-green-400 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    +15.3% (30d)
                  </p>
                </div>
                <div className="h-12 w-12 bg-green-500/20 rounded-full flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Views</p>
                  <p className="text-2xl font-bold text-foreground">7,308</p>
                  <p className="text-sm text-green-400 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    +8.7% (7d)
                  </p>
                </div>
                <div className="h-12 w-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <Eye className="h-6 w-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="albums">Albums</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Albums Tab */}
          <TabsContent value="albums" className="space-y-6">
            {/* Filters and Controls */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Input placeholder="Search albums..." className="flex-1" />
                  <div className="flex gap-2">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select defaultValue="newest">
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Newest</SelectItem>
                        <SelectItem value="oldest">Oldest</SelectItem>
                        <SelectItem value="popular">Most Popular</SelectItem>
                        <SelectItem value="value">Highest Value</SelectItem>
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

            {/* Albums Grid */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {albums.map((album) => (
                  <AlbumCard key={album.id} album={album} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {albums.map((album) => (
                  <Card key={album.id} className="cursor-pointer hover:border-primary/50">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
                          <Image className="h-8 w-8 text-muted-foreground" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-foreground">{album.title}</h3>
                            <div className="flex items-center gap-2">
                              <Badge className={getStatusColor(album.status)}>
                                {album.status}
                              </Badge>
                              {album.featured && (
                                <Badge className="bg-yellow-500/20 text-yellow-400">
                                  <Star className="h-3 w-3 mr-1" />
                                  Featured
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
                            {album.description}
                          </p>
                          
                          <div className="flex items-center gap-6 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Image className="h-3 w-3" />
                              {album.nftCount} NFTs
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-3 w-3" />
                              {album.totalValue} {album.currency}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {album.views} views
                            </span>
                            <span className="flex items-center gap-1">
                              <Heart className="h-3 w-3" />
                              {album.likes} likes
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {album.updated}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Performance Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total Views</span>
                      <span className="font-semibold text-foreground">7,308</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total Likes</span>
                      <span className="font-semibold text-foreground">577</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total Shares</span>
                      <span className="font-semibold text-foreground">173</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Conversion Rate</span>
                      <span className="font-semibold text-green-400">12.4%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Top Performing Albums */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Top Performing Albums
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {albums.slice(0, 4).map((album, index) => (
                    <div key={album.id} className="flex items-center gap-3 p-3 border border-border rounded-lg">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-accent/20 rounded flex items-center justify-center">
                        <span className="text-sm font-semibold">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground text-sm">{album.title}</p>
                        <p className="text-xs text-muted-foreground">{album.views} views</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground text-sm">{album.totalValue} SOL</p>
                        <p className="text-xs text-green-400">+{album.likes} likes</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Detailed Analytics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5" />
                  Album Performance Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Analytics Chart Placeholder</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Album Defaults */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Album Defaults
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Default Visibility
                    </label>
                    <Select defaultValue="public">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                        <SelectItem value="unlisted">Unlisted</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Default Currency
                    </label>
                    <Select defaultValue="SOL">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SOL">SOL</SelectItem>
                        <SelectItem value="CFISH">CFISH</SelectItem>
                        <SelectItem value="USDC">USDC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Auto-publish NFTs</p>
                      <p className="text-sm text-muted-foreground">Automatically publish new NFTs to albums</p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Enable Comments</p>
                      <p className="text-sm text-muted-foreground">Allow comments on your albums</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>

              {/* Sharing & Privacy */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Share className="h-5 w-5" />
                    Sharing & Privacy
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Allow Social Sharing</p>
                      <p className="text-sm text-muted-foreground">Enable sharing to social platforms</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Show View Count</p>
                      <p className="text-sm text-muted-foreground">Display view counts publicly</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Allow Downloads</p>
                      <p className="text-sm text-muted-foreground">Let users download album metadata</p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Featured Albums</p>
                      <p className="text-sm text-muted-foreground">Allow albums to be featured</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Bulk Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5" />
                  Bulk Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-16 flex-col gap-2">
                    <Download className="h-6 w-6" />
                    <span>Export All</span>
                  </Button>
                  
                  <Button variant="outline" className="h-16 flex-col gap-2">
                    <Upload className="h-6 w-6" />
                    <span>Import Albums</span>
                  </Button>
                  
                  <Button variant="outline" className="h-16 flex-col gap-2 text-red-400 hover:text-red-300">
                    <Trash2 className="h-6 w-6" />
                    <span>Delete All Drafts</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Create Album Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Create New Album
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowCreateModal(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Album Title
                  </label>
                  <Input placeholder="Enter album title..." />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Description
                  </label>
                  <Textarea placeholder="Describe your album..." rows={3} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Category
                    </label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="art">Art</SelectItem>
                        <SelectItem value="photography">Photography</SelectItem>
                        <SelectItem value="gaming">Gaming</SelectItem>
                        <SelectItem value="music">Music</SelectItem>
                        <SelectItem value="collectibles">Collectibles</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Visibility
                    </label>
                    <Select defaultValue="public">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                        <SelectItem value="unlisted">Unlisted</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Tags
                  </label>
                  <Input placeholder="Add tags separated by commas..." />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Featured Album</p>
                    <p className="text-sm text-muted-foreground">Highlight this album on your profile</p>
                  </div>
                  <Switch />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button className="btn-primary flex-1">
                    <Save className="h-4 w-4 mr-2" />
                    Create Album
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerAlbumPage;

