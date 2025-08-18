import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  TrendingUp, 
  Users, 
  Zap, 
  Shield,
  Globe,
  Coins,
  Palette
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { 
  MobileContainer, 
  MobileGrid, 
  MobileNFTCard,
  PWAInstallPrompt 
} from '../components/MobileOptimization';
import '../App.css';

const HomePage = () => {
  const featuredNFTs = [
    {
      id: 1,
      title: "Cosmic Whale #001",
      price: "2.5 SOL",
      priceUSD: "$125",
      image: "/api/placeholder/300/300",
      creator: "ArtistDAO",
      likes: 234
    },
    {
      id: 2,
      title: "Digital Dreams",
      price: "1,500 CFISH",
      priceUSD: "$75",
      image: "/api/placeholder/300/300",
      creator: "CryptoVision",
      likes: 189
    },
    {
      id: 3,
      title: "Neon City #42",
      price: "3.8 SOL",
      priceUSD: "$190",
      image: "/api/placeholder/300/300",
      creator: "FutureArt",
      likes: 456
    }
  ];

  const stats = [
    { label: "Total Volume", value: "2.4M SOL", icon: TrendingUp },
    { label: "Active Users", value: "45K+", icon: Users },
    { label: "NFTs Traded", value: "128K", icon: Zap },
    { label: "Artists", value: "8.2K", icon: Palette }
  ];

  const features = [
    {
      icon: Shield,
      title: "Secure Trading",
      description: "Built on Solana blockchain with advanced security protocols"
    },
    {
      icon: Globe,
      title: "Global Marketplace",
      description: "Connect with creators and collectors worldwide"
    },
    {
      icon: Coins,
      title: "CFISH Rewards",
      description: "Earn CFISH tokens through trading and staking"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Sub-second transaction speeds on Solana network"
    }
  ];

  return (
    <div className="fullscreen-layout cfish-gradient-bg">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="space-y-8">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
              The Future of
              <span className="block text-primary">NFT Trading</span>
            </h1>
            
            <p className="text-responsive-lg text-muted-foreground max-w-3xl mx-auto">
              Discover, create, and trade unique digital assets on the world's most advanced 
              Web3 C2C marketplace powered by Solana blockchain.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="btn-primary text-lg px-8 py-6">
                <Link to="/marketplace">
                  Explore Marketplace
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
                <Link to="/create">
                  Create NFT
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <stat.icon className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl md:text-3xl font-bold text-foreground">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-primary rounded-full flex justify-center">
            <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Featured NFTs Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-responsive-xl font-bold text-foreground mb-4">
              Featured NFTs
            </h2>
            <p className="text-responsive-base text-muted-foreground">
              Discover the most popular and trending digital assets
            </p>
          </div>

          {/* 桌面端网格 */}
          <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredNFTs.map((nft) => (
              <Card key={nft.id} className="nft-card group cursor-pointer">
                <div className="aspect-square bg-secondary/20 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <Palette className="h-16 w-16 text-primary/40" />
                  </div>
                  <div className="absolute top-4 right-4 bg-card/80 backdrop-blur-sm rounded-full px-3 py-1 text-sm">
                    ❤️ {nft.likes}
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg text-foreground mb-2">
                    {nft.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    by {nft.creator}
                  </p>
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
                      Buy Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 移动端网格 */}
          <div className="lg:hidden">
            <MobileContainer>
              <MobileGrid columns={2}>
                {featuredNFTs.map((nft) => (
                  <MobileNFTCard
                    key={nft.id}
                    nft={nft}
                    onLike={(id, liked) => console.log('Like:', id, liked)}
                    onShare={(nft) => console.log('Share:', nft)}
                    onBuy={(nft) => console.log('Buy:', nft)}
                  />
                ))}
              </MobileGrid>
            </MobileContainer>
          </div>

          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg">
              <Link to="/marketplace">
                View All NFTs
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-responsive-xl font-bold text-foreground mb-4">
              Why Choose CFISH?
            </h2>
            <p className="text-responsive-base text-muted-foreground">
              Experience the next generation of NFT trading
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center p-8 hover:border-primary/50 transition-colors">
                <CardContent className="space-y-4">
                  <feature.icon className="h-12 w-12 text-primary mx-auto" />
                  <h3 className="text-xl font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-responsive-xl font-bold text-foreground mb-6">
            Ready to Start Your NFT Journey?
          </h2>
          <p className="text-responsive-base text-muted-foreground mb-8">
            Join thousands of creators and collectors in the CFISH ecosystem
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="btn-primary text-lg px-8 py-6">
              <Link to="/create">
                Create Your First NFT
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
              <Link to="/marketplace">
                Browse Collection
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* PWA安装提示 */}
      <PWAInstallPrompt />
    </div>
  );
};

export default HomePage;

