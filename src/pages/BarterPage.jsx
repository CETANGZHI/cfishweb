import React, { useState } from 'react';
import { 
  ArrowLeftRight,
  Plus,
  Search,
  Filter,
  Grid3X3,
  List,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Heart,
  MessageSquare,
  Send,
  Coins,
  DollarSign,
  Star,
  User,
  Calendar,
  TrendingUp,
  Shuffle,
  Target,
  Zap,
  RefreshCw,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import '../App.css';

const BarterPage = () => {
  const [activeTab, setActiveTab] = useState('browse');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock barter data
  const barterOffers = [
    {
      id: 1,
      title: 'Cosmic Whale #001 ⇄ Digital Dreams Collection',
      offeredNFT: {
        id: 1,
        title: 'Cosmic Whale #001',
        image: '🐋',
        value: '2.5 SOL',
        owner: 'CryptoArtist'
      },
      requestedNFT: {
        id: 2,
        title: 'Digital Dreams #42',
        image: '🌟',
        value: '2.8 SOL',
        owner: 'DreamCollector'
      },
      status: 'pending',
      createdAt: '2025-01-16',
      expiresAt: '2025-01-23',
      message: 'I love your Digital Dreams collection! Would you be interested in trading for my Cosmic Whale?',
      matchScore: 95
    },
    {
      id: 2,
      title: 'Neon City #42 ⇄ Abstract Flow',
      offeredNFT: {
        id: 3,
        title: 'Neon City #42',
        image: '🌃',
        value: '3.8 SOL',
        owner: 'CyberPunk'
      },
      requestedNFT: {
        id: 4,
        title: 'Abstract Flow',
        image: '🎭',
        value: '1.2 SOL',
        owner: 'AbstractArt'
      },
      additionalSOL: '2.6 SOL',
      status: 'accepted',
      createdAt: '2025-01-15',
      completedAt: '2025-01-16',
      message: 'Great piece! I can add some SOL to make it fair.',
      matchScore: 78
    },
    {
      id: 3,
      title: 'Music NFT Bundle ⇄ Gaming Assets',
      offeredNFT: {
        id: 5,
        title: 'Electronic Beats #1-5',
        image: '🎵',
        value: '5.2 SOL',
        owner: 'MusicMaker'
      },
      requestedNFT: {
        id: 6,
        title: 'Sword of Power',
        image: '⚔️',
        value: '4.8 SOL',
        owner: 'GameMaster'
      },
      status: 'rejected',
      createdAt: '2025-01-14',
      rejectedAt: '2025-01-15',
      message: 'Bundle of 5 music NFTs for your legendary sword!',
      rejectionReason: 'Not interested in music NFTs at the moment.',
      matchScore: 62
    }
  ];

  // Mock intention pool data
  const intentionPool = [
    {
      id: 1,
      user: 'ArtCollector',
      avatar: '👨‍🎨',
      offering: 'Digital Art',
      seeking: 'Gaming Assets',
      budget: '1-5 SOL',
      preferences: ['Rare', 'Animated', 'Limited Edition'],
      matchScore: 89,
      activeOffers: 3,
      successRate: 87
    },
    {
      id: 2,
      user: 'GameEnthusiast',
      avatar: '🎮',
      offering: 'Gaming NFTs',
      seeking: 'Music & Audio',
      budget: '0.5-3 SOL',
      preferences: ['Electronic', 'Ambient', 'Original'],
      matchScore: 76,
      activeOffers: 7,
      successRate: 92
    },
    {
      id: 3,
      user: 'MusicLover',
      avatar: '🎵',
      offering: 'Music NFTs',
      seeking: 'Abstract Art',
      budget: '2-8 SOL',
      preferences: ['Colorful', 'Modern', 'Unique'],
      matchScore: 83,
      activeOffers: 2,
      successRate: 78
    }
  ];

  // Mock my barter history
  const myBarterHistory = [
    {
      id: 1,
      type: 'sent',
      title: 'Cosmic Whale #001 ⇄ Digital Dreams #42',
      status: 'pending',
      createdAt: '2025-01-16',
      partner: 'DreamCollector'
    },
    {
      id: 2,
      type: 'received',
      title: 'Space Explorer #15 ⇄ Ocean Depths #8',
      status: 'accepted',
      createdAt: '2025-01-15',
      partner: 'SpaceTrader'
    },
    {
      id: 3,
      type: 'sent',
      title: 'Abstract Flow ⇄ Neon Lights #33',
      status: 'rejected',
      createdAt: '2025-01-14',
      partner: 'NeonArtist'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400';
      case 'accepted': return 'bg-green-500/20 text-green-400';
      case 'rejected': return 'bg-red-500/20 text-red-400';
      case 'completed': return 'bg-blue-500/20 text-blue-400';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'accepted': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const BarterOfferCard = ({ offer }) => (
    <Card className="barter-card group cursor-pointer hover:border-primary/50 transition-colors">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <Badge className={getStatusColor(offer.status)}>
            {getStatusIcon(offer.status)}
            <span className="ml-1 capitalize">{offer.status}</span>
          </Badge>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Star className="h-4 w-4 text-yellow-400" />
            <span>{offer.matchScore}% match</span>
          </div>
        </div>
        <h3 className="font-semibold text-foreground">{offer.title}</h3>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* NFT Exchange Visual */}
        <div className="flex items-center gap-4">
          {/* Offered NFT */}
          <div className="flex-1">
            <div className="aspect-square bg-secondary/20 rounded-lg flex items-center justify-center mb-2">
              <span className="text-4xl">{offer.offeredNFT.image}</span>
            </div>
            <h4 className="font-medium text-sm text-foreground">{offer.offeredNFT.title}</h4>
            <p className="text-xs text-muted-foreground">by {offer.offeredNFT.owner}</p>
            <p className="text-sm font-medium text-primary">{offer.offeredNFT.value}</p>
          </div>

          {/* Exchange Arrow */}
          <div className="flex flex-col items-center gap-2">
            <ArrowLeftRight className="h-6 w-6 text-accent" />
            {offer.additionalSOL && (
              <div className="text-xs text-center">
                <span className="text-muted-foreground">+</span>
                <span className="text-primary font-medium">{offer.additionalSOL}</span>
              </div>
            )}
          </div>

          {/* Requested NFT */}
          <div className="flex-1">
            <div className="aspect-square bg-secondary/20 rounded-lg flex items-center justify-center mb-2">
              <span className="text-4xl">{offer.requestedNFT.image}</span>
            </div>
            <h4 className="font-medium text-sm text-foreground">{offer.requestedNFT.title}</h4>
            <p className="text-xs text-muted-foreground">by {offer.requestedNFT.owner}</p>
            <p className="text-sm font-medium text-primary">{offer.requestedNFT.value}</p>
          </div>
        </div>

        {/* Message */}
        <div className="bg-secondary/10 rounded-lg p-3">
          <p className="text-sm text-muted-foreground italic">"{offer.message}"</p>
          {offer.rejectionReason && (
            <p className="text-sm text-red-400 mt-2">Rejection: {offer.rejectionReason}</p>
          )}
        </div>

        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Created {offer.createdAt}
          </span>
          {offer.expiresAt && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Expires {offer.expiresAt}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          {offer.status === 'pending' && (
            <>
              <Button size="sm" className="btn-primary flex-1">
                <CheckCircle className="h-4 w-4 mr-1" />
                Accept
              </Button>
              <Button size="sm" variant="outline" className="flex-1">
                <XCircle className="h-4 w-4 mr-1" />
                Reject
              </Button>
              <Button size="sm" variant="outline">
                <MessageSquare className="h-4 w-4" />
              </Button>
            </>
          )}
          {offer.status === 'accepted' && (
            <Button size="sm" variant="outline" className="w-full">
              <Eye className="h-4 w-4 mr-1" />
              View Transaction
            </Button>
          )}
          {offer.status === 'rejected' && (
            <Button size="sm" variant="outline" className="w-full">
              <RefreshCw className="h-4 w-4 mr-1" />
              Make Counter Offer
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const IntentionCard = ({ intention }) => (
    <Card className="intention-card hover:border-primary/50 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="text-2xl">{intention.avatar}</div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-foreground">{intention.user}</h3>
              <div className="flex items-center gap-1 text-sm">
                <Star className="h-4 w-4 text-yellow-400" />
                <span className="text-muted-foreground">{intention.matchScore}%</span>
              </div>
            </div>
            
            <div className="space-y-2 mb-3">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Offering:</span>
                <Badge variant="outline" className="text-green-400 border-green-400/30">
                  {intention.offering}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Seeking:</span>
                <Badge variant="outline" className="text-blue-400 border-blue-400/30">
                  {intention.seeking}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Budget:</span>
                <span className="text-primary font-medium">{intention.budget}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1 mb-3">
              {intention.preferences.map((pref, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {pref}
                </Badge>
              ))}
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
              <span>{intention.activeOffers} active offers</span>
              <span>{intention.successRate}% success rate</span>
            </div>

            <div className="flex gap-2">
              <Button size="sm" className="btn-primary flex-1">
                <Send className="h-4 w-4 mr-1" />
                Send Offer
              </Button>
              <Button size="sm" variant="outline">
                <MessageSquare className="h-4 w-4" />
              </Button>
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
                Barter & Exchange
              </h1>
              <p className="text-muted-foreground">
                Trade NFTs directly with other collectors. No fees when using CFISH!
              </p>
            </div>
            <Button className="btn-primary">
              <Plus className="h-4 w-4 mr-2" />
              Create Barter Offer
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Offers</p>
                  <p className="text-2xl font-bold text-foreground">12</p>
                  <p className="text-sm text-green-400 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    +3 this week
                  </p>
                </div>
                <div className="h-12 w-12 bg-primary/20 rounded-full flex items-center justify-center">
                  <ArrowLeftRight className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Successful Trades</p>
                  <p className="text-2xl font-bold text-foreground">8</p>
                  <p className="text-sm text-muted-foreground">87% success rate</p>
                </div>
                <div className="h-12 w-12 bg-green-500/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Value Traded</p>
                  <p className="text-2xl font-bold text-foreground">23.4 SOL</p>
                  <p className="text-sm text-muted-foreground">$1,170 USD</p>
                </div>
                <div className="h-12 w-12 bg-accent/20 rounded-full flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Match Score</p>
                  <p className="text-2xl font-bold text-foreground">89%</p>
                  <p className="text-sm text-yellow-400 flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    High compatibility
                  </p>
                </div>
                <div className="h-12 w-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                  <Target className="h-6 w-6 text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="browse">Browse Offers</TabsTrigger>
            <TabsTrigger value="intentions">Intention Pool</TabsTrigger>
            <TabsTrigger value="my-offers">My Offers</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          {/* Browse Offers Tab */}
          <TabsContent value="browse" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Search barter offers..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-1" />
                      Filters
                    </Button>
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
              </CardContent>
            </Card>

            {/* Barter Offers Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {barterOffers.map((offer) => (
                <BarterOfferCard key={offer.id} offer={offer} />
              ))}
            </div>
          </TabsContent>

          {/* Intention Pool Tab */}
          <TabsContent value="intentions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shuffle className="h-5 w-5" />
                  Intention Pool
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Find collectors with matching interests for potential trades
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {intentionPool.map((intention) => (
                    <IntentionCard key={intention.id} intention={intention} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* My Offers Tab */}
          <TabsContent value="my-offers" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Send className="h-5 w-5" />
                    My Barter Offers
                  </CardTitle>
                  <Button className="btn-primary">
                    <Plus className="h-4 w-4 mr-2" />
                    New Offer
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {myBarterHistory.filter(h => h.type === 'sent').map((offer) => (
                    <div key={offer.id} className="flex items-center gap-4 p-4 border border-border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{offer.title}</h3>
                        <p className="text-sm text-muted-foreground">To: {offer.partner}</p>
                        <p className="text-xs text-muted-foreground">{offer.createdAt}</p>
                      </div>
                      <Badge className={getStatusColor(offer.status)}>
                        {getStatusIcon(offer.status)}
                        <span className="ml-1 capitalize">{offer.status}</span>
                      </Badge>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Barter History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {myBarterHistory.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 border border-border rounded-lg">
                      <div className="h-10 w-10 bg-secondary/20 rounded-full flex items-center justify-center">
                        {item.type === 'sent' ? (
                          <Send className="h-5 w-5 text-blue-400" />
                        ) : (
                          <ArrowLeftRight className="h-5 w-5 text-green-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {item.type === 'sent' ? 'Sent to' : 'Received from'}: {item.partner}
                        </p>
                        <p className="text-xs text-muted-foreground">{item.createdAt}</p>
                      </div>
                      <Badge className={getStatusColor(item.status)}>
                        {getStatusIcon(item.status)}
                        <span className="ml-1 capitalize">{item.status}</span>
                      </Badge>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BarterPage;

