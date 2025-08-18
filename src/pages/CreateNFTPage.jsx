import React, { useState } from 'react';
import { 
  Upload, 
  Image as ImageIcon, 
  Video, 
  Music, 
  FileText,
  Plus,
  X,
  Eye,
  DollarSign,
  Coins,
  Clock,
  Gavel,
  ArrowLeftRight,
  Info,
  Tag,
  Palette,
  Globe,
  Users,
  Zap,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Separator } from '../components/ui/separator';
import { Switch } from '../components/ui/switch';
import { Slider } from '../components/ui/slider';
import '../App.css';

const CreateNFTPage = () => {
  const [activeTab, setActiveTab] = useState('create');
  const [nftType, setNftType] = useState('image');
  const [pricingType, setPricingType] = useState('fixed');
  const [paymentToken, setPaymentToken] = useState('both');
  const [enableCommission, setEnableCommission] = useState(false);
  const [commissionRate, setCommissionRate] = useState([5]);
  const [enableBarter, setEnableBarter] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [customTags, setCustomTags] = useState([]);
  const [newTag, setNewTag] = useState('');

  // Mock data for categories and collections
  const categories = [
    'Digital Art', 'Photography', 'Music', 'Video', 'Gaming', 
    'Sports', 'Collectibles', 'Virtual Real Estate', 'Domain Names'
  ];

  const rarityLevels = [
    { value: 'common', label: 'Common', color: 'bg-gray-500/20 text-gray-300' },
    { value: 'uncommon', label: 'Uncommon', color: 'bg-green-500/20 text-green-400' },
    { value: 'rare', label: 'Rare', color: 'bg-blue-500/20 text-blue-400' },
    { value: 'epic', label: 'Epic', color: 'bg-purple-500/20 text-purple-400' },
    { value: 'legendary', label: 'Legendary', color: 'bg-orange-500/20 text-orange-400' }
  ];

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile({
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
        type: file.type,
        preview: URL.createObjectURL(file)
      });
    }
  };

  const addCustomTag = () => {
    if (newTag.trim() && !customTags.includes(newTag.trim())) {
      setCustomTags([...customTags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeCustomTag = (tagToRemove) => {
    setCustomTags(customTags.filter(tag => tag !== tagToRemove));
  };

  const getNFTTypeIcon = (type) => {
    switch (type) {
      case 'image': return <ImageIcon className="h-5 w-5" />;
      case 'video': return <Video className="h-5 w-5" />;
      case 'audio': return <Music className="h-5 w-5" />;
      case 'document': return <FileText className="h-5 w-5" />;
      default: return <ImageIcon className="h-5 w-5" />;
    }
  };

  const getPricingIcon = (type) => {
    switch (type) {
      case 'fixed': return <DollarSign className="h-4 w-4" />;
      case 'auction': return <Gavel className="h-4 w-4" />;
      case 'barter': return <ArrowLeftRight className="h-4 w-4" />;
      default: return <DollarSign className="h-4 w-4" />;
    }
  };

  return (
    <div className="fullscreen-layout pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-responsive-xl font-bold text-foreground mb-2">
            Create & List NFT
          </h1>
          <p className="text-muted-foreground">
            Mint new NFTs or list existing ones on the CFISH marketplace
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create New NFT
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              List Existing NFT
            </TabsTrigger>
          </TabsList>

          {/* Create New NFT Tab */}
          <TabsContent value="create" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Upload & Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* File Upload */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Upload className="h-5 w-5" />
                      Upload Your NFT
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* NFT Type Selection */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { type: 'image', label: 'Image', icon: ImageIcon },
                        { type: 'video', label: 'Video', icon: Video },
                        { type: 'audio', label: 'Audio', icon: Music },
                        { type: 'document', label: 'Document', icon: FileText }
                      ].map(({ type, label, icon: Icon }) => (
                        <Button
                          key={type}
                          variant={nftType === type ? 'default' : 'outline'}
                          className="h-16 flex-col gap-2"
                          onClick={() => setNftType(type)}
                        >
                          <Icon className="h-5 w-5" />
                          {label}
                        </Button>
                      ))}
                    </div>

                    {/* Upload Area */}
                    <div className="border-2 border-dashed border-border rounded-lg p-8">
                      {uploadedFile ? (
                        <div className="text-center">
                          <div className="mb-4">
                            {uploadedFile.type.startsWith('image/') ? (
                              <img
                                src={uploadedFile.preview}
                                alt="Preview"
                                className="max-h-48 mx-auto rounded-lg"
                              />
                            ) : (
                              <div className="w-24 h-24 bg-secondary/20 rounded-lg flex items-center justify-center mx-auto">
                                {getNFTTypeIcon(nftType)}
                              </div>
                            )}
                          </div>
                          <p className="font-medium text-foreground">{uploadedFile.name}</p>
                          <p className="text-sm text-muted-foreground">{uploadedFile.size}</p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={() => setUploadedFile(null)}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center">
                          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Upload className="h-8 w-8 text-primary" />
                          </div>
                          <p className="text-lg font-medium text-foreground mb-2">
                            Upload your {nftType}
                          </p>
                          <p className="text-muted-foreground mb-4">
                            Drag and drop or click to browse
                          </p>
                          <input
                            type="file"
                            id="file-upload"
                            className="hidden"
                            onChange={handleFileUpload}
                            accept={nftType === 'image' ? 'image/*' : nftType === 'video' ? 'video/*' : nftType === 'audio' ? 'audio/*' : '*'}
                          />
                          <Button asChild className="btn-primary">
                            <label htmlFor="file-upload" className="cursor-pointer">
                              Choose File
                            </label>
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* NFT Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Palette className="h-5 w-5" />
                      NFT Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="nft-name">NFT Name *</Label>
                        <Input
                          id="nft-name"
                          placeholder="Enter NFT name"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="collection">Collection</Label>
                        <Select>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select collection" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">Create New Collection</SelectItem>
                            <SelectItem value="cosmic-art">Cosmic Art Collection</SelectItem>
                            <SelectItem value="digital-dreams">Digital Dreams</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe your NFT..."
                        className="mt-1 min-h-24"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category.toLowerCase().replace(' ', '-')}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="rarity">Rarity Level</Label>
                        <Select>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select rarity" />
                          </SelectTrigger>
                          <SelectContent>
                            {rarityLevels.map((rarity) => (
                              <SelectItem key={rarity.value} value={rarity.value}>
                                <div className="flex items-center gap-2">
                                  <div className={`w-3 h-3 rounded-full ${rarity.color}`}></div>
                                  {rarity.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Custom Tags */}
                    <div>
                      <Label>Custom Tags</Label>
                      <div className="mt-2 space-y-2">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add custom tag"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addCustomTag()}
                          />
                          <Button onClick={addCustomTag} size="sm">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        {customTags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {customTags.map((tag, index) => (
                              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                {tag}
                                <X
                                  className="h-3 w-3 cursor-pointer"
                                  onClick={() => removeCustomTag(tag)}
                                />
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Pricing & Sales */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Pricing & Sales
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Pricing Type */}
                    <div>
                      <Label>Pricing Type</Label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
                        {[
                          { type: 'fixed', label: 'Fixed Price', icon: DollarSign },
                          { type: 'auction', label: 'Auction', icon: Gavel },
                          { type: 'barter', label: 'Barter Only', icon: ArrowLeftRight }
                        ].map(({ type, label, icon: Icon }) => (
                          <Button
                            key={type}
                            variant={pricingType === type ? 'default' : 'outline'}
                            className="h-16 flex-col gap-2"
                            onClick={() => setPricingType(type)}
                          >
                            <Icon className="h-5 w-5" />
                            {label}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Payment Token Selection */}
                    {pricingType !== 'barter' && (
                      <div>
                        <Label>Payment Token</Label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
                          {[
                            { type: 'sol', label: 'SOL Only', desc: '2% platform fee' },
                            { type: 'cfish', label: 'CFISH Only', desc: 'No platform fee' },
                            { type: 'both', label: 'Both SOL & CFISH', desc: 'Flexible payment' }
                          ].map(({ type, label, desc }) => (
                            <Button
                              key={type}
                              variant={paymentToken === type ? 'default' : 'outline'}
                              className="h-16 flex-col gap-1 text-left"
                              onClick={() => setPaymentToken(type)}
                            >
                              <span className="font-medium">{label}</span>
                              <span className="text-xs text-muted-foreground">{desc}</span>
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Price Input */}
                    {pricingType === 'fixed' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {paymentToken !== 'cfish' && (
                          <div>
                            <Label htmlFor="sol-price">SOL Price</Label>
                            <Input
                              id="sol-price"
                              type="number"
                              placeholder="0.00"
                              className="mt-1"
                            />
                          </div>
                        )}
                        {paymentToken !== 'sol' && (
                          <div>
                            <Label htmlFor="cfish-price">CFISH Price</Label>
                            <Input
                              id="cfish-price"
                              type="number"
                              placeholder="0"
                              className="mt-1"
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {/* Auction Settings */}
                    {pricingType === 'auction' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="starting-bid">Starting Bid</Label>
                          <Input
                            id="starting-bid"
                            type="number"
                            placeholder="0.00"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="auction-duration">Duration (days)</Label>
                          <Select>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select duration" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1 Day</SelectItem>
                              <SelectItem value="3">3 Days</SelectItem>
                              <SelectItem value="7">7 Days</SelectItem>
                              <SelectItem value="14">14 Days</SelectItem>
                              <SelectItem value="30">30 Days</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Advanced Options */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      Advanced Options
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Commission Settings */}
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Enable Commission</Label>
                        <p className="text-sm text-muted-foreground">
                          Allow others to earn commission by sharing your NFT
                        </p>
                      </div>
                      <Switch
                        checked={enableCommission}
                        onCheckedChange={setEnableCommission}
                      />
                    </div>

                    {enableCommission && (
                      <div>
                        <Label>Commission Rate: {commissionRate[0]}%</Label>
                        <Slider
                          value={commissionRate}
                          onValueChange={setCommissionRate}
                          max={50}
                          min={1}
                          step={1}
                          className="mt-2"
                        />
                        <div className="flex justify-between text-sm text-muted-foreground mt-1">
                          <span>1%</span>
                          <span>50%</span>
                        </div>
                      </div>
                    )}

                    {/* Barter Settings */}
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Accept Barter Offers</Label>
                        <p className="text-sm text-muted-foreground">
                          Allow users to propose NFT exchanges
                        </p>
                      </div>
                      <Switch
                        checked={enableBarter}
                        onCheckedChange={setEnableBarter}
                      />
                    </div>

                    {/* Royalties */}
                    <div>
                      <Label htmlFor="royalties">Creator Royalties (%)</Label>
                      <Input
                        id="royalties"
                        type="number"
                        placeholder="2.5"
                        max="10"
                        min="0"
                        step="0.1"
                        className="mt-1"
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        Percentage you'll receive from future sales (max 10%)
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Preview & Summary */}
              <div className="space-y-6">
                {/* Preview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="h-5 w-5" />
                      Preview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-square bg-secondary/20 rounded-lg flex items-center justify-center mb-4">
                      {uploadedFile && uploadedFile.type.startsWith('image/') ? (
                        <img
                          src={uploadedFile.preview}
                          alt="NFT Preview"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="text-center">
                          <div className="text-6xl mb-4">🎨</div>
                          <p className="text-muted-foreground">NFT Preview</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-semibold text-foreground">Untitled NFT</h3>
                      <p className="text-sm text-muted-foreground">by You</p>
                      
                      {pricingType !== 'barter' && (
                        <div className="flex justify-between items-center">
                          <span className="text-primary font-bold">
                            {pricingType === 'fixed' ? 'Price' : 'Starting Bid'}
                          </span>
                          <span className="text-primary font-bold">--</span>
                        </div>
                      )}
                      
                      <div className="flex gap-2">
                        <Badge className="bg-primary/20 text-primary">
                          {pricingType}
                        </Badge>
                        {enableCommission && (
                          <Badge className="bg-accent/20 text-accent">
                            🎁 {commissionRate[0]}% Commission
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Fee Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Info className="h-5 w-5" />
                      Fee Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Minting Fee</span>
                      <span className="font-medium text-foreground">0.01 SOL</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Platform Fee</span>
                      <span className="font-medium text-foreground">
                        {paymentToken === 'cfish' ? 'Free' : '2%'}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-foreground">Total</span>
                      <span className="text-primary">0.01 SOL</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button className="w-full btn-primary" size="lg">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Create & List NFT
                  </Button>
                  <Button variant="outline" className="w-full" size="lg">
                    <Eye className="h-5 w-5 mr-2" />
                    Preview Only
                  </Button>
                </div>

                {/* Tips */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-accent mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-foreground mb-1">Pro Tips</p>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          <li>• Use CFISH pricing to save on platform fees</li>
                          <li>• Enable commission to boost visibility</li>
                          <li>• High-quality images get more views</li>
                          <li>• Detailed descriptions improve sales</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* List Existing NFT Tab */}
          <TabsContent value="list" className="mt-6">
            <Card>
              <CardContent className="p-12 text-center">
                <Tag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">List Existing NFT</h3>
                <p className="text-muted-foreground mb-4">
                  Import and list NFTs from other platforms or wallets
                </p>
                <Button className="btn-primary">
                  Connect Wallet to Import
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CreateNFTPage;

