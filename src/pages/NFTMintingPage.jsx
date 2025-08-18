import React, { useState } from 'react';
import {
  Coins,
  Upload,
  Image,
  Video,
  Music,
  FileText,
  Settings,
  Eye,
  Edit,
  Save,
  RefreshCw,
  Download,
  Plus,
  X,
  Check,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  DollarSign,
  Tag,
  Star,
  Heart,
  Share,
  Copy,
  ExternalLink,
  MoreVertical,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  User,
  Users,
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
  Target,
  Zap,
  Award,
  TrendingUp,
  TrendingDown,
  MapPin,
  Search,
  Filter,
  UserPlus,
  UserMinus
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
import '../App.css';

const NFTMintingPage = () => {
  const [activeTab, setActiveTab] = useState('create');
  const [mintingStep, setMintingStep] = useState(1);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  // Mock data for minting history
  const mintingHistory = [
    {
      id: 1,
      title: 'Digital Dreams #001',
      type: 'image',
      status: 'completed',
      mintedDate: '2025-08-15T10:00:00Z',
      transactionId: 'tx_123456789',
      cost: 0.05,
      currency: 'SOL'
    },
    {
      id: 2,
      title: 'Cyberpunk City #002',
      type: 'image',
      status: 'pending',
      mintedDate: '2025-08-18T14:30:00Z',
      transactionId: 'tx_987654321',
      cost: 0.05,
      currency: 'SOL'
    },
    {
      id: 3,
      title: 'Music Track #003',
      type: 'audio',
      status: 'failed',
      mintedDate: '2025-08-17T09:15:00Z',
      transactionId: 'tx_456789123',
      cost: 0.05,
      currency: 'SOL'
    }
  ];

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-400';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400';
      case 'failed': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  const getFileTypeIcon = (type) => {
    switch (type) {
      case 'image': return <Image className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      case 'audio': return <Music className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const renderMintingStep = () => {
    switch (mintingStep) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Step 1: Upload Your Asset
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                {previewUrl ? (
                  <div className="space-y-4">
                    <div className="w-48 h-48 mx-auto bg-secondary rounded-lg overflow-hidden">
                      {selectedFile?.type.startsWith('image/') ? (
                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                      ) : selectedFile?.type.startsWith('video/') ? (
                        <video src={previewUrl} className="w-full h-full object-cover" controls />
                      ) : selectedFile?.type.startsWith('audio/') ? (
                        <div className="w-full h-full flex items-center justify-center">
                          <Music className="h-16 w-16 text-muted-foreground" />
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FileText className="h-16 w-16 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{selectedFile?.name}</p>
                    <Button variant="outline" onClick={() => {setSelectedFile(null); setPreviewUrl('');}}>
                      <X className="h-4 w-4 mr-2" />
                      Remove File
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="h-16 w-16 text-muted-foreground mx-auto" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Upload your digital asset</h3>
                      <p className="text-muted-foreground mb-4">
                        Supported formats: JPG, PNG, GIF, SVG, MP4, WEBM, MP3, WAV, OGG, GLB, GLTF
                      </p>
                      <input
                        type="file"
                        accept="image/*,video/*,audio/*,.glb,.gltf"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                      />
                      <label htmlFor="file-upload">
                        <Button className="btn-primary" asChild>
                          <span>Choose File</span>
                        </Button>
                      </label>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between">
                <Button variant="outline" disabled>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                <Button 
                  className="btn-primary" 
                  disabled={!selectedFile}
                  onClick={() => setMintingStep(2)}
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5" />
                Step 2: Add Metadata
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      NFT Name *
                    </label>
                    <Input placeholder="Enter NFT name..." />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Description
                    </label>
                    <Textarea placeholder="Describe your NFT..." rows={4} />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Category
                    </label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="art">Digital Art</SelectItem>
                        <SelectItem value="photography">Photography</SelectItem>
                        <SelectItem value="music">Music</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="gaming">Gaming</SelectItem>
                        <SelectItem value="collectibles">Collectibles</SelectItem>
                        <SelectItem value="utility">Utility</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Tags
                    </label>
                    <Input placeholder="Enter tags separated by commas..." />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      External Link
                    </label>
                    <Input placeholder="https://..." />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Collection
                    </label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select or create collection" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">+ Create New Collection</SelectItem>
                        <SelectItem value="dreams">Dreams Collection</SelectItem>
                        <SelectItem value="cyberpunk">Cyberpunk Series</SelectItem>
                        <SelectItem value="nature">Nature Collection</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Royalty Percentage
                    </label>
                    <div className="flex items-center gap-2">
                      <Input placeholder="0" type="number" min="0" max="10" step="0.1" />
                      <span className="text-muted-foreground">%</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Suggested: 2.5%. Maximum: 10%
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Supply
                    </label>
                    <Input placeholder="1" type="number" min="1" />
                    <p className="text-xs text-muted-foreground mt-1">
                      Number of copies to mint
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">Explicit Content</p>
                        <p className="text-sm text-muted-foreground">Mark if contains sensitive content</p>
                      </div>
                      <Switch />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">Unlockable Content</p>
                        <p className="text-sm text-muted-foreground">Include bonus content for owner</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setMintingStep(1)}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                <Button className="btn-primary" onClick={() => setMintingStep(3)}>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Step 3: Minting Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Blockchain
                    </label>
                    <Select defaultValue="solana">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="solana">Solana</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Storage
                    </label>
                    <Select defaultValue="ipfs">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ipfs">IPFS (Recommended)</SelectItem>
                        <SelectItem value="arweave">Arweave</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Minting Cost
                    </label>
                    <div className="p-3 bg-secondary/10 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Network Fee</span>
                        <span className="font-medium text-foreground">0.01 SOL</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Storage Fee</span>
                        <span className="font-medium text-foreground">0.02 SOL</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Platform Fee</span>
                        <span className="font-medium text-foreground">0.02 SOL</span>
                      </div>
                      <hr className="my-2 border-border" />
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-foreground">Total</span>
                        <span className="font-bold text-foreground">0.05 SOL</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 border border-border rounded-lg">
                    <h3 className="font-semibold text-foreground mb-3">Preview</h3>
                    <div className="space-y-3">
                      <div className="w-full h-48 bg-secondary rounded-lg overflow-hidden">
                        {previewUrl && selectedFile?.type.startsWith('image/') ? (
                          <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Image className="h-16 w-16 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">NFT Name</h4>
                        <p className="text-sm text-muted-foreground">Collection Name</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Digital Art</Badge>
                        <Badge variant="outline">2.5% Royalty</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">Auto-list after minting</p>
                        <p className="text-sm text-muted-foreground">List for sale immediately</p>
                      </div>
                      <Switch />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">Enable offers</p>
                        <p className="text-sm text-muted-foreground">Allow users to make offers</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setMintingStep(2)}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                <Button className="btn-primary">
                  <Coins className="h-4 w-4 mr-2" />
                  Mint NFT (0.05 SOL)
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fullscreen-layout pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-responsive-xl font-bold text-foreground mb-2">
                NFT Minting
              </h1>
              <p className="text-muted-foreground">
                Create and mint your digital assets as NFTs on the Solana blockchain
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <HelpCircle className="h-4 w-4 mr-2" />
                Minting Guide
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
                  <p className="text-sm font-medium text-muted-foreground">Total Minted</p>
                  <p className="text-2xl font-bold text-foreground">127</p>
                  <p className="text-sm text-green-400 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    +12 this month
                  </p>
                </div>
                <div className="h-12 w-12 bg-primary/20 rounded-full flex items-center justify-center">
                  <Coins className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Minting Cost</p>
                  <p className="text-2xl font-bold text-foreground">0.05 SOL</p>
                  <p className="text-sm text-blue-400 flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    Per NFT
                  </p>
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
                  <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                  <p className="text-2xl font-bold text-foreground">98.5%</p>
                  <p className="text-sm text-green-400 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Successful mints
                  </p>
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
                  <p className="text-sm font-medium text-muted-foreground">Avg. Time</p>
                  <p className="text-2xl font-bold text-foreground">2.3s</p>
                  <p className="text-sm text-yellow-400 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Minting speed
                  </p>
                </div>
                <div className="h-12 w-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                  <Clock className="h-6 w-6 text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create">Create NFT</TabsTrigger>
            <TabsTrigger value="history">Minting History</TabsTrigger>
          </TabsList>

          {/* Create NFT Tab */}
          <TabsContent value="create" className="space-y-6">
            {/* Progress Indicator */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground">Minting Progress</h3>
                  <span className="text-sm text-muted-foreground">Step {mintingStep} of 3</span>
                </div>
                <Progress value={(mintingStep / 3) * 100} className="w-full" />
                <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                  <span className={mintingStep >= 1 ? 'text-primary' : ''}>Upload Asset</span>
                  <span className={mintingStep >= 2 ? 'text-primary' : ''}>Add Metadata</span>
                  <span className={mintingStep >= 3 ? 'text-primary' : ''}>Mint Settings</span>
                </div>
              </CardContent>
            </Card>

            {/* Minting Steps */}
            {renderMintingStep()}
          </TabsContent>

          {/* Minting History Tab */}
          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Minting History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mintingHistory.length > 0 ? (
                    mintingHistory.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-3 border border-border rounded-lg">
                        <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                          {getFileTypeIcon(item.type)}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">{item.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            Minted: {new Date(item.mintedDate).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Tx: {item.transactionId}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-foreground">{item.cost} {item.currency}</p>
                          <Badge className={getStatusColor(item.status)}>
                            {item.status}
                          </Badge>
                        </div>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      <Coins className="h-12 w-12 mx-auto mb-4" />
                      <h3 className="font-semibold text-foreground mb-2">No minting history</h3>
                      <p>Start creating your first NFT to see your minting history here.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default NFTMintingPage;

