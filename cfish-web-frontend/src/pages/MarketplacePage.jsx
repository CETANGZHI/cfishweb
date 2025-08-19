import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import NFTCard from '../components/NFT/NFTCard';
import NFTSortFilter from '../components/NFT/NFTSortFilter';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { Grid, List } from 'lucide-react';

const MarketplacePage = () => {
  const { t } = useTranslation();
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [filters, setFilters] = useState({
    priceRange: [0, 1000],
    commissionRange: [0, 10],
    category: 'all',
    status: 'all',
  });
  const [sortOption, setSortOption] = useState('newest');

  // Mock NFT data - in real app, this would come from API/blockchain
  useEffect(() => {
    const fetchNFTs = async () => {
      setLoading(true);
      try {
        // Replace with your actual API endpoint
        const response = await fetch("https://api.example.com/nfts");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        let fetchedNFTs = data; // Assuming the API returns an array of NFTs

        // Apply filters and sort
        let filteredNFTs = fetchedNFTs.filter(nft => {
          const priceMatch = nft.price >= filters.priceRange[0] && nft.price <= filters.priceRange[1];
          const commissionMatch = nft.commission >= filters.commissionRange[0] && nft.commission <= filters.commissionRange[1];
          // Add more filter logic here for category, status etc.
          return priceMatch && commissionMatch;
        });

        filteredNFTs.sort((a, b) => {
          switch (sortOption) {
            case 'newest': return b.id.localeCompare(a.id); // Assuming higher ID means newer
            case 'oldest': return a.id.localeCompare(b.id);
            case 'priceLowToHigh': return a.price - b.price;
            case 'priceHighToLow': return b.price - a.price;
            case 'commissionLowToToHigh': return a.commission - b.commission;
            case 'commissionHighToLow': return b.commission - a.commission;
            case 'rarityLowToHigh': return a.rarity.localeCompare(b.rarity); // Simplified
            case 'rarityHighToLow': return b.rarity.localeCompare(a.rarity); // Simplified
            default: return 0;
          }
        });

        setNfts(filteredNFTs);
      } catch (error) {
        console.error('Failed to fetch NFTs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNFTs();
  }, [filters, sortOption]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSortChange = (newSortOption) => {
    setSortOption(newSortOption);
  };

  return (
    <div className="container mx-auto p-4 lg:p-8">
      <h1 className="text-3xl font-bold text-foreground mb-6">{t('marketplace.title')}</h1>
      <p className="text-muted-foreground mb-8">{t('marketplace.description')}</p>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filter and Sort Sidebar */}
        <div className="lg:w-1/4">
          <NFTSortFilter 
            onFilterChange={handleFilterChange}
            onSortChange={handleSortChange}
            currentFilters={filters}
            currentSortOption={sortOption}
          />
        </div>

        {/* NFT Display Area */}
        <div className="flex-1">
          <div className="flex justify-end mb-4">
            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-gray-700' : 'bg-gray-800'} text-gray-300 hover:bg-gray-700`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-gray-700' : 'bg-gray-800'} text-gray-300 hover:bg-gray-700`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <LoadingSpinner size="lg" />
            </div>
          ) : nfts.length > 0 ? (
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {nfts.map(nft => (
                <NFTCard key={nft.id} nft={nft} viewMode={viewMode} />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400 py-12">
              <p>{t('marketplace.noNFTsFound')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketplacePage;

