import React, { useState, useEffect } from 'react';
import { mintingApi } from '../utils/api';
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
  const [previewUrl, setPreviewUrl] = useState("");
  const [mintingCost, setMintingCost] = useState(null);
  const [mintingHistory, setMintingHistory] = useState([]);
  const [formData, setFormData] = useState({
    nftName: "",
    description: "",
    category: "",
    tags: "",
    externalLink: "",
    collection: "",
    royaltyPercentage: 0,
    supply: 1,
    explicitContent: false,
    unlockableContent: false,
    blockchain: "solana",
    storage: "ipfs",
  });

  useEffect(() => {
    const fetchMintingHistory = async () => {
      try {
        const response = await mintingApi.recordMintingEvent(); // Assuming this endpoint fetches history if no data is sent
        setMintingHistory(response.data);
      } catch (error) {
        console.error("Error fetching minting history:", error);
      }
    };
    fetchMintingHistory();
  }, []);

  useEffect(() => {
    const estimateCost = async () => {
      try {
        const response = await mintingApi.estimateMintingFees({
          blockchain: formData.blockchain,
          storage: formData.storage,
          supply: formData.supply,
        });
        setMintingCost(response.data);
      } catch (error) {
        console.error("Error estimating minting fees:", error);
        setMintingCost(null);
      }
    };
    estimateCost();
  }, [formData.blockchain, formData.storage, formData.supply]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMintNFT = async () => {
    try {
      // In a real application, you would upload the file to IPFS/Arweave first
      // and then send the CID along with other metadata to the backend.
      // For this example, we'll just simulate the minting event.
      const mintingData = {
        ...formData,
        file_name: selectedFile ? selectedFile.name : '',
        file_type: selectedFile ? selectedFile.type : '',
        // In a real scenario, you'd get the actual CIDs after upload
        image_ipfs_cid: 'mock_image_cid',
        metadata_ipfs_cid: 'mock_metadata_cid',
      };
      const response = await mintingApi.recordMintingEvent(mintingData);
      console.log('Minting successful:', response.data);
      // Optionally, update minting history or show success message
      setMintingStep(4); // Move to success step
    } catch (error) {
      console.error('Minting failed:', error);
      // Show error message
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
                    <Input name="nftName" value={formData.nftName} onChange={handleInputChange} placeholder="Enter NFT name..." />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Description
                    </label>
                    <Textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Describe your NFT..." rows={4} />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Category
                    </label>
                    <Select name="category" value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
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
                    <Input name="tags" value={formData.tags} onChange={handleInputChange} placeholder="Enter tags separated by commas..." />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      External Link
                    </label>
                    <Input name="externalLink" value={formData.externalLink} onChange={handleInputChange} placeholder="https://..." />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Collection
                    </label>
                    <Select name="collection" value={formData.collection} onValueChange={(value) => handleSelectChange("collection", value)}>
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
                      <Input name="royaltyPercentage" value={formData.royaltyPercentage} onChange={handleInputChange} placeholder="0" type="number" min="0" max="10" step="0.1" />
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
                    <Input name="supply" value={formData.supply} onChange={handleInputChange} placeholder="1" type="number" min="1" />
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
                      <Switch name="explicitContent" checked={formData.explicitContent} onCheckedChange={(checked) => handleInputChange({ target: { name: 'explicitContent', type: 'checkbox', checked } })} />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">Unlockable Content</p>
                        <p className="text-sm text-muted-foreground">Include bonus content for owner</p>
                      </div>
                      <Switch name="unlockableContent" checked={formData.unlockableContent} onCheckedChange={(checked) => handleInputChange({ target: { name: 'unlockableContent', type: 'checkbox', checked } })} />
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
                        <span className="font-medium text-foreground">0.005 SOL</span>
                      </div>
                      <div className="border-t border-border mt-2 pt-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-foreground">Total</span>
                          <span className="font-bold text-foreground">0.015 SOL</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Preview
                    </label>
                    <div className="border border-border rounded-lg p-4">
                      <div className="w-full h-48 bg-secondary rounded-lg overflow-hidden mb-3">
                        {previewUrl && selectedFile?.type.startsWith('image/') ? (
                          <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Image className="h-16 w-16 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <h3 className="font-semibold text-foreground mb-1">
                        {formData.nftName || "Untitled NFT"}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {formData.description || "No description provided"}
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">{formData.category || "Uncategorized"}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {formData.royaltyPercentage}% royalty
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setMintingStep(2)}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                <Button className="btn-primary" onClick={handleMintNFT}>
                  <Coins className="h-4 w-4 mr-2" />
                  Mint NFT
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Minting Successful!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-center">
              <div className="w-24 h-24 mx-auto bg-green-500/20 rounded-full flex items-center justify-center">
                <CheckCircle className="h-12 w-12 text-green-500" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Your NFT has been minted successfully!
                </h3>
                <p className="text-muted-foreground">
                  Your NFT is now available on the blockchain and can be viewed in your collection.
                </p>
              </div>
              <div className="flex gap-4 justify-center">
                <Button variant="outline" onClick={() => setMintingStep(1)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Mint Another
                </Button>
                <Button className="btn-primary">
                  <Eye className="h-4 w-4 mr-2" />
                  View NFT
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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">NFT Minting Studio</h1>
            <p className="text-muted-foreground">
              Create and mint your digital assets on the Solana blockchain
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="create">Create NFT</TabsTrigger>
              <TabsTrigger value="history">Minting History</TabsTrigger>
              <TabsTrigger value="tools">Tools</TabsTrigger>
            </TabsList>

            <TabsContent value="create" className="space-y-6">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-foreground">Create New NFT</h2>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3].map((step) => (
                        <div
                          key={step}
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                            step <= mintingStep
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-secondary text-muted-foreground'
                          }`}
                        >
                          {step}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <Progress value={(mintingStep / 3) * 100} className="h-2" />
              </div>

              {renderMintingStep()}
            </TabsContent>

            <TabsContent value="history" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">Minting History</h2>
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>

              <div className="space-y-4">
                {mintingHistory.length > 0 ? (
                  mintingHistory.map((item, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {getFileTypeIcon(item.file_type)}
                            <div>
                              <h3 className="font-medium text-foreground">{item.nft_name}</h3>
                              <p className="text-sm text-muted-foreground">{item.file_name}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge className={getStatusColor(item.status)}>
                              {item.status}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {new Date(item.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-semibold text-foreground mb-2">No minting history</h3>
                      <p className="text-muted-foreground">
                        Your minted NFTs will appear here once you start creating.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="tools" className="space-y-6">
              <h2 className="text-xl font-semibold text-foreground">Minting Tools</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Fee Calculator
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Estimate minting costs for different blockchain networks and storage options.
                    </p>
                    <Button variant="outline" className="w-full">
                      <DollarSign className="h-4 w-4 mr-2" />
                      Calculate Fees
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      Network Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Check the current status and congestion of blockchain networks.
                    </p>
                    <Button variant="outline" className="w-full">
                      <Activity className="h-4 w-4 mr-2" />
                      Check Status
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Metadata Templates
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Use pre-built metadata templates for different types of NFTs.
                    </p>
                    <Button variant="outline" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Browse Templates
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Layers className="h-5 w-5" />
                      Batch Minting
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Mint multiple NFTs at once with bulk upload and processing.
                    </p>
                    <Button variant="outline" className="w-full">
                      <Upload className="h-4 w-4 mr-2" />
                      Batch Mint
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default NFTMintingPage;

