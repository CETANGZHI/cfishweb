import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Filter, Grid, List } from 'lucide-react';
import CollectionCard from '../components/NFT/CollectionCard';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { useNotification } from '../contexts/NotificationContext';

const CollectionsPage = () => {
  const { t } = useTranslation();
  const { addNotification } = useNotification();
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('volume');

  useEffect(() => {
    const fetchCollections = async () => {
      setLoading(true);
      try {
        // Replace with your actual API endpoint
        const response = await fetch('https://api.example.com/collections');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCollections(data);
      } catch (error) {
        console.error('Failed to fetch collections:', error);
        addNotification({
          type: 'error',
          title: t('error'),
          message: t('Failed to load collections')
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, [addNotification, t]);

  const filteredCollections = collections.filter(collection =>
    collection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    collection.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedCollections = [...filteredCollections].sort((a, b) => {
    switch (sortBy) {
      case 'volume':
        return b.volume - a.volume;
      case 'floor':
        return b.floorPrice - a.floorPrice;
      case 'items':
        return b.itemCount - a.itemCount;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">{t('collections.title')}</h1>
            <p className="text-muted-foreground">{t('collections.description')}</p>
          </div>
          
          <div className="flex items-center gap-4 mt-4 lg:mt-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder={t('collections.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="volume">{t('collections.sortByVolume')}</option>
              <option value="floor">{t('collections.sortByFloor')}</option>
              <option value="items">{t('collections.sortByItems')}</option>
              <option value="name">{t('collections.sortByName')}</option>
            </select>
            
            <div className="flex bg-card border border-border rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-primary text-black' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-primary text-black' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {sortedCollections.map((collection) => (
              <CollectionCard
                key={collection.id}
                collection={collection}
                viewMode={viewMode}
              />
            ))}
          </div>
        )}

        {!loading && sortedCollections.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">{t('collections.noResults')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionsPage;

