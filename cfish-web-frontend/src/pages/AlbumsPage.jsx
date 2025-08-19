import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Plus, Grid, List, Music, Image, Video } from 'lucide-react';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { useNotification } from '../contexts/NotificationContext';

const AlbumsPage = () => {
  const { t } = useTranslation();
  const { addNotification } = useNotification();
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    const fetchAlbums = async () => {
      setLoading(true);
      try {
        // Replace with your actual API endpoint
        const response = await fetch('https://api.example.com/albums');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setAlbums(data);
      } catch (error) {
        console.error('Failed to fetch albums:', error);
        addNotification({
          type: 'error',
          title: t('error'),
          message: t('Failed to load albums')
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAlbums();
  }, [addNotification, t]);

  const filteredAlbums = albums.filter(album => {
    const matchesSearch = album.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         album.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || album.type === filterType;
    return matchesSearch && matchesType;
  });

  const getTypeIcon = (type) => {
    switch (type) {
      case 'music':
        return <Music className="w-4 h-4" />;
      case 'image':
        return <Image className="w-4 h-4" />;
      case 'video':
        return <Video className="w-4 h-4" />;
      default:
        return <Image className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">{t('albums.title')}</h1>
            <p className="text-muted-foreground">{t('albums.description')}</p>
          </div>
          
          <button className="flex items-center gap-2 bg-primary text-black px-4 py-2 rounded-lg font-semibold hover:bg-primary/80 transition-colors mt-4 lg:mt-0">
            <Plus className="w-4 h-4" />
            {t('albums.createAlbum')}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder={t('albums.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">{t('albums.allTypes')}</option>
            <option value="music">{t('albums.musicAlbums')}</option>
            <option value="image">{t('albums.imageAlbums')}</option>
            <option value="video">{t('albums.videoAlbums')}</option>
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
            {filteredAlbums.map((album) => (
              <div key={album.id} className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-colors">
                <div className="aspect-square bg-gray-800 relative">
                  {album.coverImage ? (
                    <img 
                      src={album.coverImage} 
                      alt={album.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      {getTypeIcon(album.type)}
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                    {getTypeIcon(album.type)}
                    {album.itemCount} items
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-foreground mb-2">{album.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{album.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img 
                        src={album.creator.avatar || '/default-avatar.png'} 
                        alt={album.creator.name}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-sm text-muted-foreground">{album.creator.name}</span>
                    </div>
                    <span className="text-sm text-primary font-semibold">
                      {album.totalValue} SOL
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredAlbums.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">{t('albums.noResults')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlbumsPage;

