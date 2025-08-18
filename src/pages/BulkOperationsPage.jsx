import React, { useState } from 'react';
import {
  Layers,
  CheckSquare,
  Square,
  Upload,
  Download,
  Edit,
  Trash2,
  Archive,
  Eye,
  EyeOff,
  DollarSign,
  Tag,
  Star,
  Heart,
  Share,
  Copy,
  Move,
  RefreshCw,
  Settings,
  Filter,
  Search,
  SortAsc,
  SortDesc,
  Grid,
  List,
  MoreVertical,
  Plus,
  X,
  Check,
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
  Target,
  Zap,
  Award,
  TrendingUp,
  TrendingDown,
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
  Save,
  Bookmark,
  Flag,
  Shield,
  Bell,
  BellOff,
  MessageSquare,
  Link,
  QrCode,
  Scan,
  UserPlus,
  UserMinus,
  Coins,
  Percent
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Switch } from '../components/ui/switch';
import { Checkbox } from '../components/ui/checkbox';
import '../App.css';

const BulkOperationsPage = () => {
  const [activeTab, setActiveTab] = useState('nfts');
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [operationType, setOperationType] = useState('');

  // Mock NFT data
  const nfts = [
    {
      id: 1,
      title: 'Digital Dreams #001',
      image: '/api/placeholder/100/100',
      price: 2.5,
      currency: 'SOL',
      status: 'listed',
      category: 'Digital Art',
      views: 156,
      likes: 23,
      created: '2025-01-15',
      rarity: 'Rare',
      collection: 'Dreams Collection'
    },
    {
      id: 2,
      title: 'Cyberpunk City #002',
      image: '/api/placeholder/100/100',
      price: 1.8,
      currency: 'SOL',
      status: 'draft',
      category: 'Cyberpunk',
      views: 89,
      likes: 15,
      created: '2025-01-14',
      rarity: 'Common',
      collection: 'Cyberpunk Series'
    },
    {
      id: 3,
      title: 'Nature Symphony #003',
      image: '/api/placeholder/100/100',
      price: 3.2,
      currency: 'SOL',
      status: 'sold',
      category: 'Photography',
      views: 234,
      likes: 45,
      created: '2025-01-13',
      rarity: 'Epic',
      collection: 'Nature Collection'
    },
    {
      id: 4,
      title: 'Abstract Flow #004',
      image: '/api/placeholder/100/100',
      price: 1.5,
      currency: 'SOL',
      status: 'listed',
      category: 'Abstract',
      views: 67,
      likes: 12,
      created: '2025-01-12',
      rarity: 'Common',
      collection: 'Abstract Series'
    },
    {
      id: 5,
      title: 'Gaming Asset #005',
      image: '/api/placeholder/100/100',
      price: 4.0,
      currency: 'SOL',
      status: 'auction',
      category: 'Gaming',
      views: 345,
      likes: 67,
      created: '2025-01-11',
      rarity: 'Legendary',
      collection: 'Gaming Pack'
    },
    {
      id: 6,
      title: 'Music Visual #006',
      image: '/api/placeholder/100/100',
      price: 2.2,
      currency: 'SOL',
      status: 'listed',
      category: 'Music',
      views: 123,
      likes: 28,
      created: '2025-01-10',
      rarity: 'Rare',
      collection: 'Music Visuals'
    }
  ];

  // Mock Collections data
  const collections = [
    {
      id: 1,
      name: 'Dreams Collection',
      description: 'A collection of surreal digital artworks',
      nftCount: 24,
      totalValue: 45.6,
      currency: 'SOL',
      status: 'active',
      created: '2024-12-01',
      visibility: 'public'
    },
    {
      id: 2,
      name: 'Cyberpunk Series',
      description: 'Futuristic cyberpunk themed NFTs',
      nftCount: 18,
      totalValue: 32.4,
      currency: 'SOL',
      status: 'active',
      created: '2024-11-15',
      visibility: 'public'
    },
    {
      id: 3,
      name: 'Nature Collection',
      description: 'Beautiful natural landscapes',
      nftCount: 31,
      totalValue: 67.8,
      currency: 'SOL',
      status: 'draft',
      created: '2024-11-01',
      visibility: 'private'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'listed': return 'bg-green-500/20 text-green-400';
      case 'sold': return 'bg-blue-500/20 text-blue-400';
      case 'draft': return 'bg-yellow-500/20 text-yellow-400';
      case 'auction': return 'bg-purple-500/20 text-purple-400';
      case 'active': return 'bg-green-500/20 text-green-400';
      case 'private': return 'bg-gray-500/20 text-gray-300';
      default: return 'bg-gray-500/20 text-gray-300';
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

  const handleSelectItem = (id) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      const currentData = activeTab === 'nfts' ? nfts : collections;
      setSelectedItems(currentData.map(item => item.id));
    }
    setSelectAll(!selectAll);
  };

  const handleBulkOperation = (operation) => {
    setOperationType(operation);
    setShowBulkActions(true);
  };

  const executeBulkOperation = () => {
    console.log(`Executing ${operationType} on items:`, selectedItems);
    setShowBulkActions(false);
    setSelectedItems([]);
    setSelectAll(false);
  };

  const NFTCard = ({ nft }) => (
    <Card className="nft-card cursor-pointer transition-all hover:border-primary/50 group">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="flex items-center gap-3">
            <Checkbox
              checked={selectedItems.includes(nft.id)}
              onCheckedChange={() => handleSelectItem(nft.id)}
            />
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
                <Image className="h-8 w-8 text-muted-foreground" />
              </div>
              <Badge className={`absolute -top-1 -right-1 text-xs ${getRarityColor(nft.rarity)}`}>
                {nft.rarity}
              </Badge>
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-foreground">{nft.title}</h3>
                <p className="text-sm text-muted-foreground">{nft.collection}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(nft.status)}>
                  {nft.status}
                </Badge>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
              <span className="flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                {nft.price} {nft.currency}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {nft.views}
              </span>
              <span className="flex items-center gap-1">
                <Heart className="h-3 w-3" />
                {nft.likes}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {nft.created}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-xs">
                {nft.category}
              </Badge>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <Edit className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <Eye className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-red-400">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const CollectionCard = ({ collection }) => (
    <Card className="collection-card cursor-pointer transition-all hover:border-primary/50 group">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="flex items-center gap-3">
            <Checkbox
              checked={selectedItems.includes(collection.id)}
              onCheckedChange={() => handleSelectItem(collection.id)}
            />
            <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
              <Layers className="h-8 w-8 text-muted-foreground" />
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-foreground">{collection.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-1">{collection.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(collection.status)}>
                  {collection.status}
                </Badge>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
              <span className="flex items-center gap-1">
                <Image className="h-3 w-3" />
                {collection.nftCount} NFTs
              </span>
              <span className="flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                {collection.totalValue} {collection.currency}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {collection.created}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-xs">
                {collection.visibility}
              </Badge>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <Edit className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <Eye className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-red-400">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
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
                Bulk Operations
              </h1>
              <p className="text-muted-foreground">
                Manage multiple NFTs and collections efficiently with bulk actions
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Import CSV
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Selected
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
                  <p className="text-sm font-medium text-muted-foreground">Total NFTs</p>
                  <p className="text-2xl font-bold text-foreground">{nfts.length}</p>
                  <p className="text-sm text-blue-400 flex items-center gap-1">
                    <Image className="h-3 w-3" />
                    Available for bulk ops
                  </p>
                </div>
                <div className="h-12 w-12 bg-primary/20 rounded-full flex items-center justify-center">
                  <Image className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Collections</p>
                  <p className="text-2xl font-bold text-foreground">{collections.length}</p>
                  <p className="text-sm text-green-400 flex items-center gap-1">
                    <Layers className="h-3 w-3" />
                    Organized groups
                  </p>
                </div>
                <div className="h-12 w-12 bg-accent/20 rounded-full flex items-center justify-center">
                  <Layers className="h-6 w-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Selected Items</p>
                  <p className="text-2xl font-bold text-foreground">{selectedItems.length}</p>
                  <p className="text-sm text-yellow-400 flex items-center gap-1">
                    <CheckSquare className="h-3 w-3" />
                    Ready for action
                  </p>
                </div>
                <div className="h-12 w-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                  <CheckSquare className="h-6 w-6 text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Operations Today</p>
                  <p className="text-2xl font-bold text-foreground">12</p>
                  <p className="text-sm text-green-400 flex items-center gap-1">
                    <Activity className="h-3 w-3" />
                    Completed
                  </p>
                </div>
                <div className="h-12 w-12 bg-green-500/20 rounded-full flex items-center justify-center">
                  <Activity className="h-6 w-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bulk Actions Bar */}
        {selectedItems.length > 0 && (
          <Card className="mb-6 border-primary/50 bg-primary/5">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <p className="font-semibold text-foreground">
                    {selectedItems.length} item{selectedItems.length > 1 ? 's' : ''} selected
                  </p>
                  <Button variant="outline" size="sm" onClick={() => setSelectedItems([])}>
                    <X className="h-4 w-4 mr-1" />
                    Clear Selection
                  </Button>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleBulkOperation('edit')}>
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleBulkOperation('updatePrice')}>
                    <DollarSign className="h-4 w-4 mr-1" />
                    Update Price
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleBulkOperation('changeStatus')}>
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Change Status
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleBulkOperation('archive')}>
                    <Archive className="h-4 w-4 mr-1" />
                    Archive
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleBulkOperation('delete')} className="text-red-400 hover:text-red-300">
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="nfts">NFTs</TabsTrigger>
            <TabsTrigger value="collections">Collections</TabsTrigger>
          </TabsList>

          {/* Filters and Controls */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Input placeholder="Search items..." className="flex-1" />
                <div className="flex gap-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="listed">Listed</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="sold">Sold</SelectItem>
                      <SelectItem value="auction">Auction</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select defaultValue="newest">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="oldest">Oldest</SelectItem>
                      <SelectItem value="priceHigh">Price: High to Low</SelectItem>
                      <SelectItem value="priceLow">Price: Low to High</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    variant={selectAll ? "default" : "outline"}
                    onClick={handleSelectAll}
                  >
                    {selectAll ? (
                      <>
                        <CheckSquare className="h-4 w-4 mr-1" />
                        Deselect All
                      </>
                    ) : (
                      <>
                        <Square className="h-4 w-4 mr-1" />
                        Select All
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* NFTs Tab */}
          <TabsContent value="nfts" className="space-y-4">
            {nfts.length > 0 ? (
              <div className="space-y-4">
                {nfts.map((nft) => (
                  <NFTCard key={nft.id} nft={nft} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Image className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">No NFTs found</h3>
                  <p className="text-muted-foreground">
                    Create some NFTs to start using bulk operations.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Collections Tab */}
          <TabsContent value="collections" className="space-y-4">
            {collections.length > 0 ? (
              <div className="space-y-4">
                {collections.map((collection) => (
                  <CollectionCard key={collection.id} collection={collection} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Layers className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">No collections found</h3>
                  <p className="text-muted-foreground">
                    Create some collections to organize your NFTs.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Bulk Operation Modal */}
        {showBulkActions && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Layers className="h-5 w-5" />
                    Bulk {operationType.charAt(0).toUpperCase() + operationType.slice(1)}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowBulkActions(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-secondary/10 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    You are about to perform <strong>{operationType}</strong> operation on <strong>{selectedItems.length}</strong> selected item{selectedItems.length > 1 ? 's' : ''}.
                  </p>
                </div>

                {operationType === 'updatePrice' && (
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      New Price
                    </label>
                    <div className="flex gap-2">
                      <Input placeholder="Enter new price..." type="number" step="0.01" />
                      <Select defaultValue="SOL">
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SOL">SOL</SelectItem>
                          <SelectItem value="CFISH">CFISH</SelectItem>
                          <SelectItem value="USDC">USDC</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {operationType === 'changeStatus' && (
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      New Status
                    </label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select new status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="listed">Listed</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {operationType === 'edit' && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Add Tags
                      </label>
                      <Input placeholder="Enter tags separated by commas..." />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Update Description
                      </label>
                      <Textarea placeholder="Enter new description..." rows={3} />
                    </div>
                  </div>
                )}

                {operationType === 'delete' && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <div className="flex items-center gap-2 text-red-400 mb-2">
                      <AlertTriangle className="h-4 w-4" />
                      <p className="font-semibold">Warning: This action cannot be undone</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Are you sure you want to permanently delete {selectedItems.length} selected item{selectedItems.length > 1 ? 's' : ''}?
                    </p>
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowBulkActions(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    className={`flex-1 ${operationType === 'delete' ? 'bg-red-600 hover:bg-red-700' : 'btn-primary'}`}
                    onClick={executeBulkOperation}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Confirm {operationType.charAt(0).toUpperCase() + operationType.slice(1)}
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

export default BulkOperationsPage;

