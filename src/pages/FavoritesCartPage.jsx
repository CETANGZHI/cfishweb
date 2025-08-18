import React, { useState } from 'react';
import { 
  Heart, 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus,
  Eye,
  Share2,
  Filter,
  Grid3X3,
  List,
  DollarSign,
  Clock,
  Tag,
  CheckCircle,
  X,
  Coins
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Separator } from '../components/ui/separator';
import '../App.css';

const FavoritesCartPage = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [selectedItems, setSelectedItems] = useState([]);
  const [sortBy, setSortBy] = useState('date');

  // Mock data
  const favoriteNFTs = [
    {
      id: 1,
      title: 'Cosmic Whale #001',
      creator: 'ArtistDAO',
      price: '2.5 SOL',
      priceUSD: '$125',
      priceType: 'fixed',
      rarity: 'Rare',
      likes: 234,
      views: 1205,
      commission: '5%',
      tags: ['Digital Art', 'Abstract'],
      addedDate: '2025-01-15',
      inCart: false
    },
    {
      id: 2,
      title: 'Digital Dreams',
      creator: 'CryptoVision',
      price: '1,500 CFISH',
      priceUSD: '$75',
      priceType: 'fixed',
      rarity: 'Common',
      likes: 189,
      views: 892,
      commission: '3%',
      tags: ['Surreal', 'Dreams'],
      addedDate: '2025-01-14',
      inCart: true
    },
    {
      id: 3,
      title: 'Neon City #42',
      creator: 'FutureArt',
      price: '3.8 SOL',
      priceUSD: '$190',
      priceType: 'auction',
      rarity: 'Epic',
      likes: 456,
      views: 2341,
      commission: '7%',
      tags: ['Cyberpunk', 'City'],
      addedDate: '2025-01-13',
      inCart: false
    },
    {
      id: 4,
      title: 'Melodic Waves',
      creator: 'SoundMaster',
      price: '1.2 SOL',
      priceUSD: '$60',
      priceType: 'fixed',
      rarity: 'Uncommon',
      likes: 123,
      views: 567,
      commission: '4%',
      tags: ['Electronic', 'Ambient'],
      addedDate: '2025-01-12',
      inCart: true
    }
  ];

  const cartItems = favoriteNFTs.filter(nft => nft.inCart);

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'Common': return 'bg-gray-500/20 text-gray-300';
      case 'Uncommon': return 'bg-green-500/20 text-green-400';
      case 'Rare': return 'bg-blue-500/20 text-blue-400';
      case 'Epic': return 'bg-purple-500/20 text-purple-400';
      case 'Legendary': return 'bg-orange-500/20 text-orange-400';
      default: return 'bg-muted/20 text-muted-foreground';
    }
  };

  const getPriceTypeColor = (type) => {
    switch (type) {
      case 'fixed': return 'bg-primary/20 text-primary';
      case 'auction': return 'bg-accent/20 text-accent';
      case 'barter': return 'bg-secondary/20 text-secondary-foreground';
      default: return 'bg-muted/20 text-muted-foreground';
    }
  };

  const toggleItemSelection = (itemId) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const toggleAllSelection = (items) => {
    const allIds = items.map(item => item.id);
    setSelectedItems(prev => 
      prev.length === allIds.length ? [] : allIds
    );
  };

  const removeFromFavorites = (itemId) => {
    console.log(`Removing item ${itemId} from favorites`);
  };

  const addToCart = (itemId) => {
    console.log(`Adding item ${itemId} to cart`);
  };

  const removeFromCart = (itemId) => {
    console.log(`Removing item ${itemId} from cart`);
  };

  const calculateCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.priceUSD.replace('$', ''));
      return total + price;
    }, 0);
  };

  const NFTCard = ({ nft, showCartActions = false }) => (
    <Card className="nft-card group cursor-pointer">
      <div className="aspect-square bg-secondary/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🎨</div>
            <p className="text-muted-foreground">{nft.title}</p>
          </div>
        </div>
        
        {/* Top badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          <Badge className={getPriceTypeColor(nft.priceType)}>
            {nft.priceType}
          </Badge>
          <Badge className={getRarityColor(nft.rarity)}>
            {nft.rarity}
          </Badge>
        </div>

        {/* Action buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          {showCartActions && (
            <Checkbox
              checked={selectedItems.includes(nft.id)}
              onCheckedChange={() => toggleItemSelection(nft.id)}
              className="bg-card/80 backdrop-blur-sm"
            />
          )}
          <Button size="sm" variant="secondary" className="bg-card/80 backdrop-blur-sm">
            <Eye className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="secondary" className="bg-card/80 backdrop-blur-sm">
            <Share2 className="h-4 w-4" />
          </Button>
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

        {/* Commission badge */}
        <div className="absolute bottom-4 right-4">
          <Badge className="bg-accent/20 text-accent">
            🎁 {nft.commission} Commission
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-foreground mb-1">{nft.title}</h3>
        <p className="text-sm text-muted-foreground mb-2">by {nft.creator}</p>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {nft.tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex justify-between items-center mb-3">
          <div>
            <span className="text-primary font-bold">{nft.price}</span>
            <span className="text-sm text-muted-foreground ml-2">{nft.priceUSD}</span>
          </div>
        </div>

        <div className="flex gap-2">
          {showCartActions ? (
            <>
              <Button 
                size="sm" 
                variant="outline" 
                className="flex-1"
                onClick={() => removeFromCart(nft.id)}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Remove
              </Button>
              <Button size="sm" className="btn-primary flex-1">
                Buy Now
              </Button>
            </>
          ) : (
            <>
              <Button 
                size="sm" 
                variant="outline" 
                className="flex-1"
                onClick={() => removeFromFavorites(nft.id)}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Remove
              </Button>
              <Button 
                size="sm" 
                className={`btn-primary flex-1 ${nft.inCart ? 'opacity-50' : ''}`}
                onClick={() => addToCart(nft.id)}
                disabled={nft.inCart}
              >
                <ShoppingCart className="h-4 w-4 mr-1" />
                {nft.inCart ? 'In Cart' : 'Add to Cart'}
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const NFTListItem = ({ nft, showCartActions = false }) => (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex gap-4">
          {showCartActions && (
            <div className="flex items-center">
              <Checkbox
                checked={selectedItems.includes(nft.id)}
                onCheckedChange={() => toggleItemSelection(nft.id)}
              />
            </div>
          )}
          
          <div className="w-20 h-20 bg-secondary/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <div className="text-2xl">🎨</div>
          </div>
          
          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-foreground">{nft.title}</h3>
                <p className="text-sm text-muted-foreground">by {nft.creator}</p>
              </div>
              <div className="text-right">
                <div className="text-primary font-bold">{nft.price}</div>
                <div className="text-sm text-muted-foreground">{nft.priceUSD}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 mb-2">
              <Badge className={getPriceTypeColor(nft.priceType)} size="sm">
                {nft.priceType}
              </Badge>
              <Badge className={getRarityColor(nft.rarity)} size="sm">
                {nft.rarity}
              </Badge>
              <Badge className="bg-accent/20 text-accent" size="sm">
                🎁 {nft.commission}
              </Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Heart className="h-4 w-4" />
                  {nft.likes}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {nft.views}
                </span>
                <span>Added: {new Date(nft.addedDate).toLocaleDateString()}</span>
              </div>
              
              <div className="flex gap-2">
                {showCartActions ? (
                  <>
                    <Button size="sm" variant="outline" onClick={() => removeFromCart(nft.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button size="sm" className="btn-primary">
                      Buy Now
                    </Button>
                  </>
                ) : (
                  <>
                    <Button size="sm" variant="outline" onClick={() => removeFromFavorites(nft.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      className={`btn-primary ${nft.inCart ? 'opacity-50' : ''}`}
                      onClick={() => addToCart(nft.id)}
                      disabled={nft.inCart}
                    >
                      <ShoppingCart className="h-4 w-4" />
                    </Button>
                  </>
                )}
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
          <h1 className="text-responsive-xl font-bold text-foreground mb-2">
            Favorites & Cart
          </h1>
          <p className="text-muted-foreground">
            Manage your favorite NFTs and shopping cart
          </p>
        </div>

        <Tabs defaultValue="favorites" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="favorites" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Favorites ({favoriteNFTs.length})
            </TabsTrigger>
            <TabsTrigger value="cart" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Cart ({cartItems.length})
            </TabsTrigger>
          </TabsList>

          {/* Favorites Tab */}
          <TabsContent value="favorites" className="mt-6">
            <div className="space-y-6">
              {/* Controls */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="flex gap-4">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">Date Added</SelectItem>
                      <SelectItem value="price">Price</SelectItem>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="creator">Creator</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>

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

              {/* Bulk Actions */}
              {favoriteNFTs.length > 0 && (
                <div className="flex items-center gap-4 p-4 bg-secondary/20 rounded-lg">
                  <Checkbox
                    checked={selectedItems.length === favoriteNFTs.length}
                    onCheckedChange={() => toggleAllSelection(favoriteNFTs)}
                  />
                  <span className="text-sm text-muted-foreground">
                    {selectedItems.length > 0 ? `${selectedItems.length} selected` : 'Select all'}
                  </span>
                  
                  {selectedItems.length > 0 && (
                    <div className="flex gap-2 ml-auto">
                      <Button size="sm" variant="outline">
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart ({selectedItems.length})
                      </Button>
                      <Button size="sm" variant="outline">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove ({selectedItems.length})
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* NFTs Grid/List */}
              {favoriteNFTs.length > 0 ? (
                viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {favoriteNFTs.map((nft) => (
                      <NFTCard key={nft.id} nft={nft} />
                    ))}
                  </div>
                ) : (
                  <div>
                    {favoriteNFTs.map((nft) => (
                      <NFTListItem key={nft.id} nft={nft} />
                    ))}
                  </div>
                )
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No favorites yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Start exploring and add NFTs to your favorites
                    </p>
                    <Button className="btn-primary">
                      Explore Marketplace
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Cart Tab */}
          <TabsContent value="cart" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-6">
                {/* Controls */}
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-foreground">
                    Cart Items ({cartItems.length})
                  </h2>
                  
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

                {/* Bulk Actions */}
                {cartItems.length > 0 && (
                  <div className="flex items-center gap-4 p-4 bg-secondary/20 rounded-lg">
                    <Checkbox
                      checked={selectedItems.length === cartItems.length}
                      onCheckedChange={() => toggleAllSelection(cartItems)}
                    />
                    <span className="text-sm text-muted-foreground">
                      {selectedItems.length > 0 ? `${selectedItems.length} selected` : 'Select all'}
                    </span>
                    
                    {selectedItems.length > 0 && (
                      <div className="flex gap-2 ml-auto">
                        <Button size="sm" variant="outline">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove Selected ({selectedItems.length})
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {/* Cart Items */}
                {cartItems.length > 0 ? (
                  viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {cartItems.map((nft) => (
                        <NFTCard key={nft.id} nft={nft} showCartActions={true} />
                      ))}
                    </div>
                  ) : (
                    <div>
                      {cartItems.map((nft) => (
                        <NFTListItem key={nft.id} nft={nft} showCartActions={true} />
                      ))}
                    </div>
                  )
                ) : (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">Your cart is empty</h3>
                      <p className="text-muted-foreground mb-4">
                        Add some NFTs to your cart to get started
                      </p>
                      <Button className="btn-primary">
                        Browse NFTs
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Cart Summary */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Cart Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Items ({cartItems.length})</span>
                        <span className="font-medium text-foreground">${calculateCartTotal().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Platform Fee (2%)</span>
                        <span className="font-medium text-foreground">${(calculateCartTotal() * 0.02).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Gas Fee (est.)</span>
                        <span className="font-medium text-foreground">$2.50</span>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-foreground">Total</span>
                      <span className="text-primary">${(calculateCartTotal() * 1.02 + 2.5).toFixed(2)}</span>
                    </div>

                    <Button 
                      className="w-full btn-primary" 
                      disabled={cartItems.length === 0}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Checkout ({cartItems.length} items)
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Payment Options</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:border-primary/50">
                      <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                        <DollarSign className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">SOL</p>
                        <p className="text-sm text-muted-foreground">Pay with Solana</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:border-primary/50">
                      <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
                        <Coins className="h-4 w-4 text-accent" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">CFISH</p>
                        <p className="text-sm text-muted-foreground">Save 2% platform fee</p>
                      </div>
                      <Badge className="bg-green-500/20 text-green-400">
                        Recommended
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FavoritesCartPage;

