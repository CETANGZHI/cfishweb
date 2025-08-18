import React, { useState } from 'react';
import {
  Gavel,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
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
  Coins,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  List,
  Grid,
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
  Percent,
  Layers,
  CheckSquare,
  Square,
  Activity,
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
  Target,
  Zap,
  Award,
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
import { Progress } from '../components/ui/progress';
import { format } from 'date-fns';
import '../App.css';

const AuctionManagementPage = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [showCreateAuction, setShowCreateAuction] = useState(false);

  // Mock Auction Data
  const auctions = [
    {
      id: 1,
      title: 'Rare CryptoPunk #7890',
      nftImage: '/api/placeholder/150/150',
      currentBid: 75.00,
      currency: 'SOL',
      endTime: '2025-08-20T14:00:00Z',
      status: 'active',
      bids: 15,
      seller: 'CryptoKing',
      minBidIncrement: 1.00,
      reservePrice: 60.00,
      description: 'A highly sought-after CryptoPunk from the original collection. Perfect for serious collectors.',
      category: 'Collectibles'
    },
    {
      id: 2,
      title: 'Abstract Digital Art Piece',
      nftImage: '/api/placeholder/150/150',
      currentBid: 12.50,
      currency: 'SOL',
      endTime: '2025-08-19T10:30:00Z',
      status: 'active',
      bids: 8,
      seller: 'ArtisticSoul',
      minBidIncrement: 0.50,
      reservePrice: 10.00,
      description: 'Vibrant abstract art, digitally painted with unique textures and colors.',
      category: 'Digital Art'
    },
    {
      id: 3,
      title: 'Gaming Legend Sword NFT',
      nftImage: '/api/placeholder/150/150',
      currentBid: 5.00,
      currency: 'SOL',
      endTime: '2025-08-18T23:59:59Z',
      status: 'ended',
      bids: 20,
      seller: 'GameMaster',
      finalPrice: 7.20,
      description: 'Legendary sword from the popular MMORPG game.'

    }
  ];


  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400';
      case 'ended': return 'bg-red-500/20 text-red-400';
      case 'scheduled': return 'bg-blue-500/20 text-blue-400';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  const AuctionCard = ({ auction }) => (
    <Card className="auction-card cursor-pointer transition-all hover:border-primary/50 group">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <img src={auction.nftImage} alt={auction.title} className="w-24 h-24 rounded-lg object-cover" />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-foreground text-lg">{auction.title}</h3>
              <Badge className={getStatusColor(auction.status)}>
                {auction.status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
              {auction.description}
            </p>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                Current Bid: <span className="font-medium text-foreground">{auction.currentBid} {auction.currency}</span>
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Ends: {format(new Date(auction.endTime), 'MMM dd, hh:mm a')}
              </span>
            </div>
            {auction.status === 'active' && (
              <Progress value={((new Date() - new Date(auction.created)) / (new Date(auction.endTime) - new Date(auction.created))) * 100} className="mt-2" />
            )}
            {auction.status === 'ended' && (
              <div className="flex items-center justify-between text-sm text-muted-foreground mt-2">
                <span className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Final Price: <span className="font-medium text-foreground">{auction.finalPrice} {auction.currency}</span>
                </span>
                <span className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  Seller: {auction.seller}
                </span>
              </div>
            )}
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
                Auction Management
              </h1>
              <p className="text-muted-foreground">
                Manage your NFT auctions and track their progress
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setShowCreateAuction(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create New Auction
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="active">Active Auctions</TabsTrigger>
            <TabsTrigger value="ended">Ended Auctions</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled Auctions</TabsTrigger>
          </TabsList>
          <TabsContent value="active">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {auctions.filter(a => a.status === 'active').map(auction => (
                <AuctionCard key={auction.id} auction={auction} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="ended">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {auctions.filter(a => a.status === 'ended').map(auction => (
                <AuctionCard key={auction.id} auction={auction} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="scheduled">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {auctions.filter(a => a.status === 'scheduled').map(auction => (
                <AuctionCard key={auction.id} auction={auction} />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Create Auction Form (Modal/Overlay) */}
        {showCreateAuction && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-2xl p-6">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  Create New Auction
                  <Button variant="ghost" size="icon" onClick={() => setShowCreateAuction(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div>
                    <label htmlFor="nftTitle" className="block text-sm font-medium text-foreground">NFT Title</label>
                    <Input id="nftTitle" placeholder="e.g., My Unique Digital Art" />
                  </div>
                  <div>
                    <label htmlFor="nftImage" className="block text-sm font-medium text-foreground">NFT Image URL</label>
                    <Input id="nftImage" placeholder="e.g., https://example.com/image.jpg" />
                  </div>
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-foreground">Description</label>
                    <Textarea id="description" placeholder="Describe your NFT" rows="4" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="startBid" className="block text-sm font-medium text-foreground">Starting Bid</label>
                      <Input id="startBid" type="number" placeholder="1.00" />
                    </div>
                    <div>
                      <label htmlFor="currency" className="block text-sm font-medium text-foreground">Currency</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SOL">SOL</SelectItem>
                          <SelectItem value="USDC">USDC</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="endTime" className="block text-sm font-medium text-foreground">End Time</label>
                    <Input id="endTime" type="datetime-local" />
                  </div>
                  <Button type="submit" className="w-full">
                    Create Auction
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuctionManagementPage;


