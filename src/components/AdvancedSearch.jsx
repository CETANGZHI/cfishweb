import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  X, 
  ChevronDown,
  Calendar,
  DollarSign,
  Tag,
  User,
  Clock,
  Star,
  TrendingUp
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Badge } from './ui/badge';
import { Slider } from './ui/slider';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Separator } from './ui/separator';

const AdvancedSearch = ({ onSearch, onClose, initialFilters = {} }) => {
  const [filters, setFilters] = useState({
    query: '',
    category: 'all',
    priceRange: [0, 1000],
    creator: '',
    collection: '',
    rarity: 'all',
    status: 'all',
    sortBy: 'newest',
    dateRange: 'all',
    tags: [],
    verified: false,
    hasOffers: false,
    ...initialFilters
  });

  const [searchHistory, setSearchHistory] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    // 从localStorage加载搜索历史
    const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    setSearchHistory(history.slice(0, 5)); // 只显示最近5条
  }, []);

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'art', label: 'Digital Art' },
    { value: 'music', label: 'Music' },
    { value: 'gaming', label: 'Gaming' },
    { value: 'photography', label: 'Photography' },
    { value: 'video', label: 'Video' },
    { value: 'collectibles', label: 'Collectibles' },
    { value: 'sports', label: 'Sports' },
    { value: 'utility', label: 'Utility' }
  ];

  const rarityLevels = [
    { value: 'all', label: 'All Rarities' },
    { value: 'common', label: 'Common' },
    { value: 'uncommon', label: 'Uncommon' },
    { value: 'rare', label: 'Rare' },
    { value: 'epic', label: 'Epic' },
    { value: 'legendary', label: 'Legendary' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'buy_now', label: 'Buy Now' },
    { value: 'auction', label: 'On Auction' },
    { value: 'offers', label: 'Has Offers' },
    { value: 'new', label: 'New' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest' },
    { value: 'oldest', label: 'Oldest' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'most_liked', label: 'Most Liked' },
    { value: 'most_viewed', label: 'Most Viewed' },
    { value: 'ending_soon', label: 'Ending Soon' }
  ];

  const popularTags = [
    'abstract', 'portrait', 'landscape', 'digital', 'pixel-art',
    'anime', 'fantasy', 'sci-fi', 'nature', 'urban', 'minimalist',
    'colorful', 'black-white', 'vintage', 'modern'
  ];

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleTagToggle = (tag) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) 
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const handleSearch = () => {
    // 保存搜索历史
    if (filters.query.trim()) {
      const newHistory = [
        filters.query,
        ...searchHistory.filter(h => h !== filters.query)
      ].slice(0, 10);
      setSearchHistory(newHistory);
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    }

    onSearch(filters);
  };

  const handleReset = () => {
    setFilters({
      query: '',
      category: 'all',
      priceRange: [0, 1000],
      creator: '',
      collection: '',
      rarity: 'all',
      status: 'all',
      sortBy: 'newest',
      dateRange: 'all',
      tags: [],
      verified: false,
      hasOffers: false
    });
  };

  const handleHistoryClick = (query) => {
    setFilters(prev => ({ ...prev, query }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl text-white flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Advanced Search & Filters
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* 搜索输入 */}
          <div className="space-y-2">
            <Label className="text-white">Search Query</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search NFTs, collections, creators..."
                value={filters.query}
                onChange={(e) => handleFilterChange('query', e.target.value)}
                className="pl-10 bg-gray-800 border-gray-600 text-white"
              />
            </div>
            
            {/* 搜索历史 */}
            {searchHistory.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="text-sm text-gray-400">Recent:</span>
                {searchHistory.map((query, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer hover:bg-gray-600"
                    onClick={() => handleHistoryClick(query)}
                  >
                    {query}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <Separator className="bg-gray-700" />

          {/* 基础筛选 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-white">Category</Label>
              <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  {categories.map(cat => (
                    <SelectItem key={cat.value} value={cat.value} className="text-white">
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-white">Rarity</Label>
              <Select value={filters.rarity} onValueChange={(value) => handleFilterChange('rarity', value)}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  {rarityLevels.map(rarity => (
                    <SelectItem key={rarity.value} value={rarity.value} className="text-white">
                      {rarity.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-white">Status</Label>
              <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  {statusOptions.map(status => (
                    <SelectItem key={status.value} value={status.value} className="text-white">
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 价格范围 */}
          <div className="space-y-4">
            <Label className="text-white flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Price Range (SOL)
            </Label>
            <div className="px-4">
              <Slider
                value={filters.priceRange}
                onValueChange={(value) => handleFilterChange('priceRange', value)}
                max={1000}
                min={0}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-400 mt-2">
                <span>{filters.priceRange[0]} SOL</span>
                <span>{filters.priceRange[1]} SOL</span>
              </div>
            </div>
          </div>

          {/* 创建者和收藏 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white flex items-center gap-2">
                <User className="h-4 w-4" />
                Creator
              </Label>
              <Input
                placeholder="Creator address or name"
                value={filters.creator}
                onChange={(e) => handleFilterChange('creator', e.target.value)}
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white">Collection</Label>
              <Input
                placeholder="Collection name"
                value={filters.collection}
                onChange={(e) => handleFilterChange('collection', e.target.value)}
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
          </div>

          {/* 标签 */}
          <div className="space-y-3">
            <Label className="text-white flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Tags
            </Label>
            <div className="flex flex-wrap gap-2">
              {popularTags.map(tag => (
                <Badge
                  key={tag}
                  variant={filters.tags.includes(tag) ? "default" : "secondary"}
                  className={`cursor-pointer transition-colors ${
                    filters.tags.includes(tag) 
                      ? 'bg-teal-600 hover:bg-teal-700' 
                      : 'hover:bg-gray-600'
                  }`}
                  onClick={() => handleTagToggle(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* 其他选项 */}
          <div className="space-y-3">
            <Label className="text-white">Additional Options</Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="verified"
                  checked={filters.verified}
                  onCheckedChange={(checked) => handleFilterChange('verified', checked)}
                />
                <Label htmlFor="verified" className="text-white text-sm">
                  Verified creators only
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasOffers"
                  checked={filters.hasOffers}
                  onCheckedChange={(checked) => handleFilterChange('hasOffers', checked)}
                />
                <Label htmlFor="hasOffers" className="text-white text-sm">
                  Has offers
                </Label>
              </div>
            </div>
          </div>

          {/* 排序 */}
          <div className="space-y-2">
            <Label className="text-white flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Sort By
            </Label>
            <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange('sortBy', value)}>
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                {sortOptions.map(option => (
                  <SelectItem key={option.value} value={option.value} className="text-white">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator className="bg-gray-700" />

          {/* 操作按钮 */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleSearch}
              className="flex-1 bg-teal-600 hover:bg-teal-700 text-white"
            >
              <Search className="h-4 w-4 mr-2" />
              Apply Filters
            </Button>
            <Button
              variant="outline"
              onClick={handleReset}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Reset
            </Button>
            <Button
              variant="ghost"
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedSearch;

