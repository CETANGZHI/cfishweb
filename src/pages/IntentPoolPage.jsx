import React, { useState } from 'react';
import {
  Target,
  ArrowLeftRight,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Heart,
  Star,
  Clock,
  Calendar,
  DollarSign,
  Image,
  Users,
  Tag,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  Edit,
  Trash2,
  Share,
  Copy,
  ExternalLink,
  MoreVertical,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Settings,
  Download,
  Upload,
  Save,
  X,
  Check,
  User,
  UserPlus,
  UserMinus,
  Bell,
  BellOff,
  MessageSquare,
  Link,
  QrCode,
  Scan,
  Coins,
  Percent,
  Layers,
  CheckSquare,
  Square,
  Activity,
  BarChart3,
  PieChart,
  LineChart,
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
  Bookmark,
  Flag,
  Shield,
  Zap,
  Award,
  TrendingUp,
  TrendingDown,
  FileText,
  MapPin
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

const IntentPoolPage = () => {
  const [activeTab, setActiveTab] = useState('browse');
  const [showCreateIntent, setShowCreateIntent] = useState(false);

  // Mock Intent Data
  const intents = [
    {
      id: 1,
      type: 'want',
      title: 'Looking for Cyberpunk Art Collection',
      description: 'Seeking high-quality cyberpunk themed NFTs for my collection. Interested in neon aesthetics and futuristic themes.',
      user: {
        username: 'CyberCollector',
        avatar: '/api/placeholder/40/40',
        verified: true
      },
      categories: ['Digital Art', 'Cyberpunk', 'Futuristic'],
      priceRange: {
        min: 1,
        max: 10,
        currency: 'SOL'
      },
      preferences: {
        rarity: ['Rare', 'Epic'],
        style: 'Neon, Dark, Futuristic',
        size: 'Any'
      },
      matches: 12,
      created: '2025-01-15T10:00:00Z',
      expires: '2025-02-15T10:00:00Z',
      status: 'active',
      priority: 'high'
    },
    {
      id: 2,
      type: 'offer',
      title: 'Trading Gaming Assets for Art',
      description: 'I have a collection of rare gaming NFTs and looking to trade for digital art pieces. Open to negotiations.',
      user: {
        username: 'GameTrader',
        avatar: '/api/placeholder/40/40',
        verified: false
      },
      categories: ['Gaming', 'Digital Art', 'Collectibles'],
      offering: [
        { name: 'Legendary Sword #001', value: 5, currency: 'SOL' },
        { name: 'Epic Shield #023', value: 3, currency: 'SOL' }
      ],
      seeking: [
        { category: 'Digital Art', minValue: 6, currency: 'SOL' }
      ],
      matches: 8,
      created: '2025-01-14T14:30:00Z',
      expires: '2025-02-14T14:30:00Z',
      status: 'active',
      priority: 'medium'
    },
    {
      id: 3,
      type: 'want',
      title: 'Seeking Music NFTs for Collection',
      description: 'Building a comprehensive music NFT collection. Particularly interested in electronic and ambient music pieces.',
      user: {
        username: 'MusicLover',
        avatar: '/api/placeholder/40/40',
        verified: true
      },
      categories: ['Music', 'Audio', 'Electronic'],
      priceRange: {
        min: 0.5,
        max: 5,
        currency: 'SOL'
      },
      preferences: {
        genre: 'Electronic, Ambient, Experimental',
        duration: '2-10 minutes',
        quality: 'High-res audio'
      },
      matches: 15,
      created: '2025-01-13T09:15:00Z',
      expires: '2025-02-13T09:15:00Z',
      status: 'active',
      priority: 'medium'
    },
    {
      id: 4,
      type: 'offer',
      title: 'Photography NFTs Available for Trade',
      description: 'Professional photographer offering nature and landscape NFTs in exchange for abstract art or digital illustrations.',
      user: {
        username: 'NatureShots',
        avatar: '/api/placeholder/40/40',
        verified: true
      },
      categories: ['Photography', 'Nature', 'Abstract Art'],
      offering: [
        { name: 'Mountain Sunrise #005', value: 2.5, currency: 'SOL' },
        { name: 'Ocean Waves #012', value: 3, currency: 'SOL' }
      ],
      seeking: [
        { category: 'Abstract Art', minValue: 4, currency: 'SOL' }
      ],
      matches: 6,
      created: '2025-01-12T16:45:00Z',
      expires: '2025-02-12T16:45:00Z',
      status: 'active',
      priority: 'low'
    },
    {
      id: 5,
      type: 'want',
      title: 'Rare Collectibles Wanted',
      description: 'Collector seeking rare and unique NFT collectibles. Especially interested in limited edition pieces and historical significance.',
      user: {
        username: 'RareCollector',
        avatar: '/api/placeholder/40/40',
        verified: false
      },
      categories: ['Collectibles', 'Rare Items', 'Historical'],
      priceRange: {
        min: 5,
        max: 50,
        currency: 'SOL'
      },
      preferences: {
        rarity: ['Epic', 'Legendary'],
        edition: 'Limited Edition',
        provenance: 'Verified'
      },
      matches: 3,
      created: '2025-01-11T11:20:00Z',
      expires: '2025-02-11T11:20:00Z',
      status: 'active',
      priority: 'high'
    }
  ];

  const myIntents = intents.filter(intent => ['CyberCollector', 'GameTrader'].includes(intent.user.username));

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400';
      case 'expired': return 'bg-red-500/20 text-red-400';
      case 'fulfilled': return 'bg-blue-500/20 text-blue-400';
      case 'paused': return 'bg-yellow-500/20 text-yellow-400';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-400';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400';
      case 'low': return 'bg-green-500/20 text-green-400';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  const IntentCard = ({ intent, showActions = true }) => (
    <Card className="intent-card cursor-pointer transition-all hover:border-primary/50 group">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              intent.type === 'want' ? 'bg-blue-500/20' : 'bg-green-500/20'
            }`}>
              {intent.type === 'want' ? (
                <Target className={`h-6 w-6 ${intent.type === 'want' ? 'text-blue-400' : 'text-green-400'}`} />
              ) : (
                <ArrowLeftRight className={`h-6 w-6 ${intent.type === 'want' ? 'text-blue-400' : 'text-green-400'}`} />
              )}
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-foreground">{intent.title}</h3>
                  <Badge className={intent.type === 'want' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'}>
                    {intent.type === 'want' ? 'Want' : 'Offer'}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <img src={intent.user.avatar} alt={intent.user.username} className="w-5 h-5 rounded-full" />
                  <span className="text-sm text-muted-foreground">@{intent.user.username}</span>
                  {intent.user.verified && (
                    <CheckCircle className="h-3 w-3 text-blue-400" />
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(intent.status)}>
                  {intent.status}
                </Badge>
                <Badge className={getPriorityColor(intent.priority)}>
                  {intent.priority}
                </Badge>
                {showActions && (
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {intent.description}
            </p>

            {/* Price Range or Offering/Seeking */}
            {intent.priceRange && (
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                <span className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  {intent.priceRange.min} - {intent.priceRange.max} {intent.priceRange.currency}
                </span>
              </div>
            )}

            {intent.offering && (
              <div className="mb-3">
                <p className="text-xs text-muted-foreground mb-1">Offering:</p>
                <div className="flex flex-wrap gap-1">
                  {intent.offering.map((item, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {item.name} ({item.value} {item.currency})
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {intent.seeking && (
              <div className="mb-3">
                <p className="text-xs text-muted-foreground mb-1">Seeking:</p>
                <div className="flex flex-wrap gap-1">
                  {intent.seeking.map((item, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {item.category} (min {item.minValue} {item.currency})
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
              <span className="flex items-center gap-1">
                <Target className="h-3 w-3" />
                {intent.matches} matches
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Created {new Date(intent.created).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Expires {new Date(intent.expires).toLocaleDateString()}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex gap-1">
                {intent.categories.slice(0, 2).map((category, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {category}
                  </Badge>
                ))}
                {intent.categories.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{intent.categories.length - 2}
                  </Badge>
                )}
              </div>
              
              {showActions && (
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Eye className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <MessageSquare className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Heart className="h-3 w-3" />
                  </Button>
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
                Intent Pool
              </h1>
              <p className="text-muted-foreground">
                Express your trading intentions and discover matching opportunities
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowCreateIntent(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Intent
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
                  <p className="text-sm font-medium text-muted-foreground">Active Intents</p>
                  <p className="text-2xl font-bold text-foreground">{intents.filter(i => i.status === 'active').length}</p>
                  <p className="text-sm text-green-400 flex items-center gap-1">
                    <Target className="h-3 w-3" />
                    Available for matching
                  </p>
                </div>
                <div className="h-12 w-12 bg-primary/20 rounded-full flex items-center justify-center">
                  <Target className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Matches</p>
                  <p className="text-2xl font-bold text-foreground">{intents.reduce((sum, intent) => sum + intent.matches, 0)}</p>
                  <p className="text-sm text-blue-400 flex items-center gap-1">
                    <ArrowLeftRight className="h-3 w-3" />
                    Potential trades
                  </p>
                </div>
                <div className="h-12 w-12 bg-accent/20 rounded-full flex items-center justify-center">
                  <ArrowLeftRight className="h-6 w-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">My Intents</p>
                  <p className="text-2xl font-bold text-foreground">{myIntents.length}</p>
                  <p className="text-sm text-yellow-400 flex items-center gap-1">
                    <User className="h-3 w-3" />
                    Your active intents
                  </p>
                </div>
                <div className="h-12 w-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                  <p className="text-2xl font-bold text-foreground">78%</p>
                  <p className="text-sm text-green-400 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    Successful matches
                  </p>
                </div>
                <div className="h-12 w-12 bg-green-500/20 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-green-400" />
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
                <TabsTrigger value="browse">Browse Intents</TabsTrigger>
                <TabsTrigger value="my-intents">My Intents</TabsTrigger>
                <TabsTrigger value="matches">Matches</TabsTrigger>
              </TabsList>

              {/* Filters and Controls */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Input placeholder="Search intents..." className="flex-1" />
                    <div className="flex gap-2">
                      <Select defaultValue="all">
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="want">Want</SelectItem>
                          <SelectItem value="offer">Offer</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Select defaultValue="all">
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          <SelectItem value="digitalArt">Digital Art</SelectItem>
                          <SelectItem value="gaming">Gaming</SelectItem>
                          <SelectItem value="music">Music</SelectItem>
                          <SelectItem value="collectibles">Collectibles</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select defaultValue="newest">
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="newest">Newest</SelectItem>
                          <SelectItem value="oldest">Oldest</SelectItem>
                          <SelectItem value="mostMatches">Most Matches</SelectItem>
                          <SelectItem value="highPriority">High Priority</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Browse Intents Tab */}
              <TabsContent value="browse" className="space-y-4">
                {intents.length > 0 ? (
                  <div className="space-y-4">
                    {intents.map((intent) => (
                      <IntentCard key={intent.id} intent={intent} />
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-semibold text-foreground mb-2">No intents found</h3>
                      <p className="text-muted-foreground">
                        Be the first to create an intent and start trading.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* My Intents Tab */}
              <TabsContent value="my-intents" className="space-y-4">
                {myIntents.length > 0 ? (
                  <div className="space-y-4">
                    {myIntents.map((intent) => (
                      <IntentCard key={intent.id} intent={intent} />
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-semibold text-foreground mb-2">No intents created</h3>
                      <p className="text-muted-foreground">
                        Create your first intent to start finding trading opportunities.
                      </p>
                      <Button className="btn-primary mt-4" onClick={() => setShowCreateIntent(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Intent
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Matches Tab */}
              <TabsContent value="matches" className="space-y-4">
                <Card>
                  <CardContent className="p-8 text-center">
                    <ArrowLeftRight className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold text-foreground mb-2">No matches yet</h3>
                    <p className="text-muted-foreground">
                      Create intents to discover potential trading matches.
                    </p>
                  </CardContent>
                </Card>
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
                <Button variant="outline" className="w-full justify-start" onClick={() => setShowCreateIntent(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Intent
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <Search className="h-4 w-4 mr-2" />
                  Browse Matches
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <Bell className="h-4 w-4 mr-2" />
                  Manage Alerts
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Export Intents
                </Button>
              </CardContent>
            </Card>

            {/* Popular Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Popular Categories
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { name: 'Digital Art', count: 25, color: 'text-blue-400' },
                  { name: 'Gaming', count: 18, color: 'text-green-400' },
                  { name: 'Music', count: 12, color: 'text-purple-400' },
                  { name: 'Collectibles', count: 9, color: 'text-yellow-400' },
                  { name: 'Photography', count: 7, color: 'text-red-400' }
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

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {intents.slice(0, 3).map((intent) => (
                  <div key={intent.id} className="flex items-center gap-3 p-2 border border-border rounded-lg">
                    <img src={intent.user.avatar} alt={intent.user.username} className="w-8 h-8 rounded-full object-cover" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground line-clamp-1">{intent.title}</p>
                      <p className="text-xs text-muted-foreground">@{intent.user.username}</p>
                      <p className="text-xs text-muted-foreground">{intent.matches} matches</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Create Intent Modal */}
        {showCreateIntent && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Create New Intent
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowCreateIntent(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Intent Type
                  </label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select intent type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="want">Want - Looking for specific NFTs</SelectItem>
                      <SelectItem value="offer">Offer - Trading my NFTs</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Title
                  </label>
                  <Input placeholder="Enter a descriptive title for your intent..." />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Description
                  </label>
                  <Textarea placeholder="Describe what you're looking for or offering..." rows={3} />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Categories
                  </label>
                  <Input placeholder="Enter categories separated by commas..." />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Min Price
                    </label>
                    <Input placeholder="0.5" type="number" step="0.1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Max Price
                    </label>
                    <Input placeholder="10.0" type="number" step="0.1" />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Priority Level
                  </label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowCreateIntent(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="flex-1 btn-primary"
                    onClick={() => setShowCreateIntent(false)}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Create Intent
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

export default IntentPoolPage;

