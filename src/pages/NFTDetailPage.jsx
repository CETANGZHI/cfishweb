import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Heart, 
  Share2, 
  Eye, 
  Clock, 
  User,
  Tag,
  TrendingUp,
  ShoppingCart,
  Gavel,
  ArrowLeft,
  ExternalLink,
  Copy,
  MoreHorizontal,
  Flag
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Separator } from '../components/ui/separator';
import { LikeButton, ShareButton, CommentSection, SocialStats } from '../components/SocialFeatures';
import { useNFTDetail } from '../hooks/useNFTs';
import '../App.css';

const NFTDetailPage = () => {
  const { id } = useParams();
  const { nft, loading, error } = useNFTDetail(id);
  const [isLiked, setIsLiked] = useState(false);
  const [inCart, setInCart] = useState(false);

  if (loading) {
    return (
      <div className="fullscreen-layout pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading NFT details...</p>
        </div>
      </div>
    );
  }

  if (error || !nft) {
    return (
      <div className="fullscreen-layout pt-16 flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">NFT not found</p>
          <Button asChild variant="outline">
            <Link to="/marketplace">Back to Marketplace</Link>
          </Button>
        </div>
      </div>
    );
  }

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

  return (
    <div className="fullscreen-layout pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/marketplace">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Marketplace
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* NFT Image */}
          <div className="space-y-4">
            <Card className="overflow-hidden">
              <div className="aspect-square bg-secondary/20 relative">
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
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    className="bg-card/80 backdrop-blur-sm"
                    onClick={() => setIsLiked(!isLiked)}
                  >
                    <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                  <Button size="sm" variant="secondary" className="bg-card/80 backdrop-blur-sm">
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="secondary" className="bg-card/80 backdrop-blur-sm">
                    <MoreHorizontal className="h-4 w-4" />
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
              </div>
            </Card>

            {/* Additional Images */}
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square bg-secondary/20 rounded-lg border border-border cursor-pointer hover:border-primary/50 transition-colors">
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <div className="text-2xl">🎨</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* NFT Details */}
          <div className="space-y-6">
            {/* Title and Creator */}
            <div>
              <h1 className="text-responsive-xl font-bold text-foreground mb-2">
                {nft.title}
              </h1>
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={nft.creatorAvatar} />
                  <AvatarFallback>{nft.creator[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm text-muted-foreground">Created by</p>
                  <Link to={`/profile/${nft.creator}`} className="font-medium text-foreground hover:text-primary">
                    {nft.creator}
                  </Link>
                </div>
              </div>
            </div>

            {/* Price and Actions */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {nft.priceType === 'auction' && nft.auctionEndTime && (
                    <div className="flex items-center gap-2 text-accent">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">Auction ends in 2d 14h 32m</span>
                    </div>
                  )}
                  
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {nft.priceType === 'auction' ? 'Current bid' : 'Price'}
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-primary">{nft.price}</span>
                      <span className="text-lg text-muted-foreground">{nft.priceUSD}</span>
                    </div>
                  </div>

                  {nft.priceType === 'auction' && nft.bidders && (
                    <p className="text-sm text-muted-foreground">
                      {nft.bidders} bids placed
                    </p>
                  )}

                  <div className="flex gap-3">
                    <Button 
                      className="flex-1 btn-primary"
                      onClick={() => setInCart(!inCart)}
                    >
                      {nft.priceType === 'auction' ? (
                        <>
                          <Gavel className="h-4 w-4 mr-2" />
                          Place Bid
                        </>
                      ) : nft.priceType === 'barter' ? (
                        <>
                          <Tag className="h-4 w-4 mr-2" />
                          Make Offer
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          {inCart ? 'Remove from Cart' : 'Buy Now'}
                        </>
                      )}
                    </Button>
                    <LikeButton 
                      itemId={nft.id} 
                      itemType="nft" 
                      initialLikes={nft.likes || 0}
                      initialIsLiked={isLiked}
                      showCount={false}
                    />
                    <ShareButton 
                      itemId={nft.id} 
                      itemType="nft" 
                      title={nft.title}
                    />
                  </div>

                  {/* Commission Info */}
                  <div className="bg-accent/10 border border-accent/20 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-accent">
                      <TrendingUp className="h-4 w-4" />
                      <span className="text-sm font-medium">Earn {nft.commission} commission by sharing this NFT</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {nft.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="cursor-pointer hover:bg-primary/20">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Information Tabs */}
        <div className="mt-12">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="properties">Properties</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="offers">Offers</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <p className="text-muted-foreground leading-relaxed">
                    {nft.description}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="properties" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {nft.properties?.map((property, index) => (
                  <Card key={index}>
                    <CardContent className="p-4 text-center">
                      <p className="text-sm text-muted-foreground mb-1">{property.trait}</p>
                      <p className="font-semibold text-foreground">{property.value}</p>
                      <p className="text-xs text-accent mt-1">{property.rarity} have this trait</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="history" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {nft.history?.map((event, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 border border-border rounded-lg">
                        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                          {event.event === 'Minted' ? '🎨' : event.event === 'Listed' ? '🏷️' : '💰'}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{event.event}</p>
                          <p className="text-sm text-muted-foreground">
                            {event.from && `From ${event.from}`}
                            {event.to && ` to ${event.to}`}
                            {event.price && ` for ${event.price}`}
                          </p>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(event.date).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="offers" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  {nft.barterOffers && nft.barterOffers.length > 0 ? (
                    <div className="space-y-4">
                      {nft.barterOffers.map((offer, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{offer.from[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-foreground">{offer.from}</p>
                              <p className="text-sm text-muted-foreground">Offers: {offer.offer}</p>
                            </div>
                          </div>
                          <Badge variant={offer.status === 'pending' ? 'secondary' : 'destructive'}>
                            {offer.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No offers yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Similar NFTs */}
        {/* Comments Section */}
        <div className="mt-12">
          <CommentSection 
            itemId={nft.id} 
            itemType="nft"
            allowReplies={true}
            maxDepth={3}
          />
        </div>

        {/* More from creator */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">More from this creator</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="nft-card group cursor-pointer">
                <div className="aspect-square bg-secondary/20 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <div className="text-4xl">🎨</div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-foreground mb-2">Similar NFT #{i}</h3>
                  <p className="text-sm text-muted-foreground mb-2">by {nft.creator}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-primary font-bold">2.{i} SOL</span>
                    <Button size="sm" className="btn-primary">View</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTDetailPage;

