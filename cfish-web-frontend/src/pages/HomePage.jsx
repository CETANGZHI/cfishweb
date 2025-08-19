import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, ChevronRight, Star, Heart, TrendingUp, DollarSign, Users, Image, Music, Gamepad, Brush } from 'lucide-react';
import { Link } from 'react-router-dom';
import NFTCard from '../components/NFT/NFTCard'; // Assuming NFTCard component exists
import CollectionCard from '../components/NFT/CollectionCard'; // Assuming CollectionCard component exists

const TrendingNFTs = () => {
  const { t } = useTranslation();
  const [trendingNFTs, setTrendingNFTs] = useState([]);
  const [loadingTrending, setLoadingTrending] = useState(true);
  const [errorTrending, setErrorTrending] = useState(null);

  useEffect(() => {
    const fetchTrendingNFTs = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await fetch("https://api.example.com/trending-nfts"); 
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTrendingNFTs(data);
      } catch (error) {
        setErrorTrending(error);
      } finally {
        setLoadingTrending(false);
      }
    };

    fetchTrendingNFTs();
  }, []);

  if (loadingTrending) return <div className="text-center py-12">{t("common.loading")}...</div>;
  if (errorTrending) return <div className="text-center py-12 text-red-500">{t("common.error")}</div>;

  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold text-center mb-8 text-primary-foreground">{t("homepage.trendingNFTs")}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {trendingNFTs.map(nft => (
          <NFTCard key={nft.id} nft={nft} />
        ))}
      </div>
      <div className="text-center mt-8">
        <Link to="/marketplace" className="inline-flex items-center text-primary hover:underline text-lg">
          {t("homepage.viewAllNFTs")} <ChevronRight size={20} className="ml-2" />
        </Link>
      </div>
    </section>
  );
};

const FeaturedCollections = () => {
  const { t } = useTranslation();
  const [featuredCollections, setFeaturedCollections] = useState([]);
  const [loadingCollections, setLoadingCollections] = useState(true);
  const [errorCollections, setErrorCollections] = useState(null);

  useEffect(() => {
    const fetchFeaturedCollections = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await fetch("https://api.example.com/featured-collections");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setFeaturedCollections(data);
      } catch (error) {
        setErrorCollections(error);
      } finally {
        setLoadingCollections(false);
      }
    };

    fetchFeaturedCollections();
  }, []);

  if (loadingCollections) return <div className="text-center py-12">{t("common.loading")}...</div>;
  if (errorCollections) return <div className="text-center py-12 text-red-500">{t("common.error")}</div>;

  return (
    <section className="py-12 bg-card/30 rounded-lg">
      <h2 className="text-3xl font-bold text-center mb-8 text-primary-foreground">{t("homepage.featuredCollections")}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredCollections.map(collection => (
          <CollectionCard key={collection.id} collection={collection} />
        ))}
      </div>
      <div className="text-center mt-8">
        <Link to="/collections" className="inline-flex items-center text-primary hover:underline text-lg">
          {t("homepage.viewAllCollections")} <ChevronRight size={20} className="ml-2" />
        </Link>
      </div>
    </section>
  );
};

const MarketplacePreview = () => {
  const { t } = useTranslation();
  const [marketplaceItems, setMarketplaceItems] = useState([]);
  const [loadingMarketplace, setLoadingMarketplace] = useState(true);
  const [errorMarketplace, setErrorMarketplace] = useState(null);

  useEffect(() => {
    const fetchMarketplaceItems = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await fetch("https://api.example.com/marketplace-preview");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setMarketplaceItems(data);
      } catch (error) {
        setErrorMarketplace(error);
      } finally {
        setLoadingMarketplace(false);
      }
    };

    fetchMarketplaceItems();
  }, []);

  if (loadingMarketplace) return <div className="text-center py-12">{t("common.loading")}...</div>;
  if (errorMarketplace) return <div className="text-center py-12 text-red-500">{t("common.error")}</div>;

  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold text-center mb-8 text-primary-foreground">{t("homepage.marketplacePreview")}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {marketplaceItems.map(nft => (
          <NFTCard key={nft.id} nft={nft} />
        ))}
      </div>
      <div className="text-center mt-8">
        <Link to="/marketplace" className="inline-flex items-center text-primary hover:underline text-lg">
          {t("homepage.viewFullMarketplace")} <ChevronRight size={20} className="ml-2" />
        </Link>
      </div>
    </section>
  );
};

const StatsSection = () => {
  const { t } = useTranslation();
  // Placeholder data - will be replaced by API calls
  const stats = [
    { label: t('homepage.totalVolume'), value: '$12.5M', icon: DollarSign },
    { label: t('homepage.totalNFTs'), value: '50K+', icon: Star },
    { label: t('homepage.activeUsers'), value: '10K+', icon: Users },
    { label: t('homepage.newUsers'), value: '500+', icon: TrendingUp },
  ];

  return (
    <section className="py-12 bg-card/30 rounded-lg">
      <h2 className="text-3xl font-bold text-center mb-8 text-primary-foreground">{t('homepage.platformStats')}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-card p-6 rounded-lg shadow-lg text-center flex flex-col items-center justify-center">
            <stat.icon size={48} className="text-primary mb-4" />
            <p className="text-muted-foreground text-lg">{stat.label}</p>
            <h3 className="font-bold text-4xl text-primary-foreground mt-2">{stat.value}</h3>
          </div>
        ))}
      </div>
    </section>
  );
};

const HowItWorks = () => {
  const { t } = useTranslation();
  const steps = [
    { title: t('homepage.step1Title'), description: t('homepage.step1Desc') },
    { title: t('homepage.step2Title'), description: t('homepage.step2Desc') },
    { title: t('homepage.step3Title'), description: t('homepage.step3Desc') },
    { title: t('homepage.step4Title'), description: t('homepage.step4Desc') },
  ];
  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold text-center mb-8 text-primary-foreground">{t('homepage.howItWorks')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((step, index) => (
          <div key={index} className="bg-card p-6 rounded-lg shadow-lg text-center">
            <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              {index + 1}
            </div>
            <h3 className="font-semibold text-xl mb-2 text-primary-foreground">{step.title}</h3>
            <p className="text-muted-foreground text-sm">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

const CategoryBrowse = () => {
  const { t } = useTranslation();
  const categories = [
    { name: t('homepage.categoryArt'), icon: Brush, link: '/marketplace?category=art' },
    { name: t('homepage.categoryMusic'), icon: Music, link: '/marketplace?category=music' },
    { name: t('homepage.categoryGaming'), icon: Gamepad, link: '/marketplace?category=gaming' },
    { name: t('homepage.categoryCollectibles'), icon: Star, link: '/marketplace?category=collectibles' },
    { name: t('homepage.categoryPhotography'), icon: Image, link: '/marketplace?category=photography' },
  ];

  return (
    <section className="py-12 bg-card/30 rounded-lg">
      <h2 className="text-3xl font-bold text-center mb-8 text-primary-foreground">{t('homepage.browseCategories')}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
        {categories.map((category, index) => (
          <Link key={index} to={category.link} className="bg-card p-6 rounded-lg shadow-lg text-center flex flex-col items-center justify-center transform transition-transform hover:scale-105 hover:bg-primary/20">
            <category.icon size={48} className="text-primary mb-4" />
            <h3 className="font-semibold text-xl text-primary-foreground">{category.name}</h3>
          </Link>
        ))}
      </div>
    </section>
  );
};

const HomePage = () => {
  const { t } = useTranslation();

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center text-center bg-cover bg-center rounded-lg overflow-hidden" style={{ backgroundImage: 'url(https://via.placeholder.com/1200x600?text=CFISH+Hero+Background)' }}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        <div className="relative z-10 p-4">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 leading-tight">
            {t('homepage.heroTitle')}
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            {t('homepage.heroSubtitle')}
          </p>
          <div className="flex justify-center">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder={t('common.search')}
                className="w-full py-3 pl-12 pr-4 rounded-full bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
              />
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>
        </div>
      </section>

      <TrendingNFTs />
      <FeaturedCollections />
      <MarketplacePreview />
      <CategoryBrowse /> {/* Added CategoryBrowse component */}
      <StatsSection />
      <HowItWorks />

      {/* Placeholder for other sections like Floating NFT Icons (handled in App.jsx) */}
    </div>
  );
};

export default HomePage;


