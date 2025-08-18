import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  TrendingUp,
  Heart,
  ShoppingCart,
  Eye,
  Palette,
  Music,
  Gamepad2,
  Image as ImageIcon,
  Video,
  Globe
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useNFTs } from '../hooks/useNFTs';
import AdvancedSearch from '../components/AdvancedSearch';
import '../App.css';

const MarketplacePage = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({});
  
  const { nfts, loading, error, toggleLike, toggleCart } = useNFTs({
    category: selectedCategory,
    search: searchQuery,
    ...advancedFilters
  });

  const handleAdvancedSearch = (filters) => {
    setAdvancedFilters(filters);
    setSearchQuery(filters.query || '');
    setSelectedCategory(filters.category || 'all');
    setShowAdvancedSearch(false);
  };

  const categories = [
    { id: 'all', name: 'All', icon: Globe, count: 12847 },
    { id: 'art', name: 'Art', icon: Palette, count: 5234 },
    { id: 'music', name: 'Music', icon: Music, count: 2156 },
    { id: 'gaming', name: 'Gaming', icon: Gamepad2, count: 3421 },
    { id: 'photography', name: 'Photography', icon: ImageIcon, count: 1876 },
    { id: 'video', name: 'Video', icon: Video, count: 1160 }
  ];

  const getPriceTypeColor = (type) => {
    switch (type) {
      case 'fixed': return 'bg-primary/20 text-primary';
      case 'auction': return 'bg-accent/20 text-accent';
      case 'barter': return 'bg-secondary/20 text-secondary-foreground';
      default: return 'bg-muted/20 text-muted-foreground';
    }
  };

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

  if (loading) {
    return (
      <div className="fullscreen-layout pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading NFTs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fullscreen-layout pt-16 flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">Error loading NFTs: {error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fullscreen-layout pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-responsive-xl font-bold text-foreground mb-4">
            NFT Marketplace
          </h1>
          <p className="text-responsive-base text-muted-foreground">
            Discover, collect, and trade unique digital assets
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search NFTs, creators, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Advanced Search Button */}
            <Button
              variant="outline"
              onClick={() => setShowAdvancedSearch(true)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Advanced
            </Button>

            {/* Sort */}
            <Select defaultValue="trending">
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="trending">Trending</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="most-liked">Most Liked</SelectItem>
              </SelectContent>
            </Select>

            {/* View Mode */}
            <div className="flex border border-border rounded-lg">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid3X3 className="h-4 w-4" />
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

          {/* Categories */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
              {categories.map((category) => (
                <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
                  <category.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{category.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {category.count.toLocaleString()}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* NFT Grid */}
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1'
        }`}>
          {nfts.map((nft) => (
            <Card key={nft.id} className="nft-card group cursor-pointer">
              {/* NFT Image */}
              <div className="aspect-square bg-secondary/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <Palette className="h-16 w-16 text-primary/40" />
                </div>
                
                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                  <Button size="sm" variant="secondary" className="bg-card/80 backdrop-blur-sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    className="bg-card/80 backdrop-blur-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(nft.id);
                    }}
                  >
                    <Heart className={`h-4 w-4 ${nft.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    className="bg-card/80 backdrop-blur-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCart(nft.id);
                    }}
                  >
                    <ShoppingCart className={`h-4 w-4 ${nft.inCart ? 'fill-primary text-primary' : ''}`} />
                  </Button>
                </div>

                {/* Top badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                  <Badge className={getPriceTypeColor(nft.priceType)}>
                    {nft.priceType}
                  </Badge>
                  <Badge className={getRarityColor(nft.rarity)}>
                    {nft.rarity}
                  </Badge>
                </div>

                {/* Stats */}
                <div className="absolute top-3 right-3 flex flex-col gap-1">
                  <div className="bg-card/80 backdrop-blur-sm rounded-full px-2 py-1 text-xs flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    {nft.likes}
                  </div>
                  <div className="bg-card/80 backdrop-blur-sm rounded-full px-2 py-1 text-xs flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {nft.views}
                  </div>
                </div>

                {/* Commission badge */}
                <div className="absolute bottom-3 left-3">
                  <Badge variant="outline" className="bg-card/80 backdrop-blur-sm">
                    🎁 {nft.commission} Commission
                  </Badge>
                </div>
              </div>

              {/* NFT Info */}
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg text-foreground truncate">
                      {nft.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      by {nft.creator}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {nft.tags.slice(0, 2).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {nft.tags.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{nft.tags.length - 2}
                      </Badge>
                    )}
                  </div>

                  {/* Price and Action */}
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-primary font-bold">
                        {nft.price}
                      </div>
                      <div className="text-muted-foreground text-sm">
                        {nft.priceUSD}
                      </div>
                    </div>
                    <Button size="sm" className="btn-primary">
                      {nft.priceType === 'auction' ? 'Bid' : 
                       nft.priceType === 'barter' ? 'Offer' : 'Buy'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Load More NFTs
          </Button>
        </div>
      </div>

      {/* Advanced Search Modal */}
      {showAdvancedSearch && (
        <AdvancedSearch
          onSearch={handleAdvancedSearch}
          onClose={() => setShowAdvancedSearch(false)}
          initialFilters={{
            query: searchQuery,
            category: selectedCategory,
            ...advancedFilters
          }}
        />
      )}
    </div>
  );
};

export default MarketplacePage;

