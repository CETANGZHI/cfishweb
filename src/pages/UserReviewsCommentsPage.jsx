import React, { useState } from 'react';
import {
  Star,
  MessageSquare,
  User,
  ThumbsUp,
  ThumbsDown,
  Edit,
  Trash2,
  Filter,
  Search,
  SortAsc,
  SortDesc,
  Plus,
  Eye,
  MoreVertical,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  Clock,
  Calendar,
  Image,
  Video,
  Music,
  FileText,
  DollarSign,
  ExternalLink,
  Share,
  Copy,
  Award,
  TrendingUp,
  TrendingDown,
  Zap,
  Users,
  Tag,
  Heart,
  Send,
  Reply,
  Flag,
  Shield,
  Bell,
  Settings
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Switch } from '../components/ui/switch';
import '../App.css';

const UserReviewsCommentsPage = () => {
  const [activeTab, setActiveTab] = useState('allReviews');
  const [showWriteReviewModal, setShowWriteReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);

  // Mock reviews data
  const reviews = [
    {
      id: 1,
      nftId: 'nft-123',
      nftTitle: 'Ethereal Landscape #001',
      nftImage: '/api/placeholder/100/100',
      reviewer: 'CryptoCollector',
      reviewerAvatar: '/api/placeholder/50/50',
      rating: 5,
      comment: 'Absolutely stunning piece! The details are incredible and it truly captures the essence of digital art. Highly recommend this artist!',
      timestamp: '2025-01-15T10:30:00Z',
      likes: 25,
      dislikes: 2,
      replies: [
        { id: 101, user: 'ArtistX', avatar: '/api/placeholder/50/50', comment: 'Thank you so much for your kind words! I appreciate your support.', timestamp: '2025-01-15T11:00:00Z' }
      ],
      status: 'published'
    },
    {
      id: 2,
      nftId: 'nft-456',
      nftTitle: 'Cyberpunk Cityscape #002',
      nftImage: '/api/placeholder/100/100',
      reviewer: 'NFTEnthusiast',
      reviewerAvatar: '/api/placeholder/50/50',
      rating: 4,
      comment: 'Great concept and execution. The neon lights really pop. Only minor feedback is that the resolution could be higher for larger displays.',
      timestamp: '2025-01-14T14:00:00Z',
      likes: 18,
      dislikes: 5,
      replies: [],
      status: 'published'
    },
    {
      id: 3,
      nftId: 'nft-789',
      nftTitle: 'Nature\'s Symphony #003',
      nftImage: '/api/placeholder/100/100',
      reviewer: 'ArtLover123',
      reviewerAvatar: '/api/placeholder/50/50',
      rating: 5,
      comment: 'Breathtaking! This piece brings so much tranquility. A must-have for any nature lover.',
      timestamp: '2025-01-13T09:00:00Z',
      likes: 30,
      dislikes: 1,
      replies: [],
      status: 'published'
    },
    {
      id: 4,
      nftId: 'nft-101',
      nftTitle: 'Abstract Emotions #004',
      nftImage: '/api/placeholder/100/100',
      reviewer: 'DigitalNomad',
      reviewerAvatar: '/api/placeholder/50/50',
      rating: 3,
      comment: 'Interesting use of colors, but a bit too abstract for my taste. Still, a unique piece.',
      timestamp: '2025-01-12T16:00:00Z',
      likes: 10,
      dislikes: 8,
      replies: [],
      status: 'published'
    },
    {
      id: 5,
      nftId: 'nft-202',
      nftTitle: 'Gaming Assets Pack #005',
      nftImage: '/api/placeholder/100/100',
      reviewer: 'GameDevPro',
      reviewerAvatar: '/api/placeholder/50/50',
      rating: 5,
      comment: 'Fantastic assets! Perfect for my new game project. High quality and well-optimized.',
      timestamp: '2025-01-11T11:00:00Z',
      likes: 40,
      dislikes: 0,
      replies: [],
      status: 'published'
    },
    {
      id: 6,
      nftId: 'nft-303',
      nftTitle: 'Music Visualizations #006',
      nftImage: '/api/placeholder/100/100',
      reviewer: 'MusicProducer',
      reviewerAvatar: '/api/placeholder/50/50',
      rating: 4,
      comment: 'Visually stunning and syncs well with audio. Could use more customization options.',
      timestamp: '2025-01-10T13:00:00Z',
      likes: 22,
      dislikes: 3,
      replies: [],
      status: 'published'
    },
    {
      id: 7,
      nftId: 'nft-404',
      nftTitle: 'Unreleased Masterpiece',
      nftImage: '/api/placeholder/100/100',
      reviewer: 'PendingReviewer',
      reviewerAvatar: '/api/placeholder/50/50',
      rating: 0,
      comment: 'This is a draft review. Waiting for approval.',
      timestamp: '2025-01-09T10:00:00Z',
      likes: 0,
      dislikes: 0,
      replies: [],
      status: 'pending'
    }
  ];

  // Mock seller reviews data
  const sellerReviews = [
    {
      id: 1,
      seller: 'ArtistX',
      sellerAvatar: '/api/placeholder/50/50',
      reviewer: 'CryptoCollector',
      reviewerAvatar: '/api/placeholder/50/50',
      rating: 5,
      comment: 'ArtistX is a pleasure to work with. Very responsive and delivers high-quality NFTs. Highly recommended!',
      timestamp: '2025-01-16T10:00:00Z',
      likes: 15,
      dislikes: 0,
      status: 'published'
    },
    {
      id: 2,
      seller: 'DigitalCreator',
      sellerAvatar: '/api/placeholder/50/50',
      reviewer: 'NFTEnthusiast',
      reviewerAvatar: '/api/placeholder/50/50',
      rating: 4,
      comment: 'Good communication and unique art style. Transaction was smooth.',
      timestamp: '2025-01-15T14:00:00Z',
      likes: 10,
      dislikes: 1,
      status: 'published'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'bg-green-500/20 text-green-400';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400';
      case 'rejected': return 'bg-red-500/20 text-red-400';
      default: return 'bg-blue-500/20 text-blue-400';
    }
  };

  const ReviewCard = ({ review, type }) => (
    <Card className="review-card transition-all hover:border-primary/50">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <img src={review.reviewerAvatar} alt={review.reviewer} className="w-12 h-12 rounded-full object-cover" />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  {review.reviewer}
                  {type === 'nft' && (
                    <span className="text-sm text-muted-foreground">on <a href={`/nft/${review.nftId}`} className="text-primary hover:underline">{review.nftTitle}</a></span>
                  )}
                  {type === 'seller' && (
                    <span className="text-sm text-muted-foreground">for <a href={`/profile/${review.seller}`} className="text-primary hover:underline">{review.seller}</a></span>
                  )}
                </h3>
                <div className="flex items-center gap-1 text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'fill-current' : 'text-muted-foreground'}`} />
                  ))}
                  <span className="text-sm text-muted-foreground ml-1">({review.rating}.0)</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(review.status)}>
                  {review.status}
                </Badge>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mb-3">
              {review.comment}
            </p>

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(review.timestamp).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  <ThumbsUp className="h-3 w-3" />
                  {review.likes}
                </span>
                <span className="flex items-center gap-1">
                  <ThumbsDown className="h-3 w-3" />
                  {review.dislikes}
                </span>
                {review.replies && review.replies.length > 0 && (
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" />
                    {review.replies.length} replies
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Reply className="h-4 w-4 mr-1" />
                  Reply
                </Button>
                <Button variant="ghost" size="sm">
                  <Flag className="h-4 w-4 mr-1" />
                  Report
                </Button>
              </div>
            </div>

            {review.replies && review.replies.length > 0 && (
              <div className="mt-4 space-y-3 border-t border-border pt-4">
                {review.replies.map(reply => (
                  <div key={reply.id} className="flex items-start gap-3">
                    <img src={reply.avatar} alt={reply.user} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <p className="font-semibold text-foreground text-sm">{reply.user}</p>
                      <p className="text-sm text-muted-foreground">{reply.comment}</p>
                      <span className="text-xs text-muted-foreground">{new Date(reply.timestamp).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderStarRating = () => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-6 w-6 cursor-pointer ${i < reviewRating ? 'fill-current text-yellow-400' : 'text-muted-foreground'}`}
            onClick={() => setReviewRating(i + 1)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="fullscreen-layout pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-responsive-xl font-bold text-foreground mb-2">
                Reviews & Comments
              </h1>
              <p className="text-muted-foreground">
                See what others are saying about NFTs and sellers
              </p>
            </div>
            <div className="flex gap-2">
              <Button className="btn-primary" onClick={() => setShowWriteReviewModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Write a Review
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total NFT Reviews</p>
                  <p className="text-2xl font-bold text-foreground">{reviews.length}</p>
                  <p className="text-sm text-green-400 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    +5 this month
                  </p>
                </div>
                <div className="h-12 w-12 bg-primary/20 rounded-full flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Average NFT Rating</p>
                  <p className="text-2xl font-bold text-foreground">4.5 <span className="text-yellow-400">★</span></p>
                  <p className="text-sm text-blue-400 flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    Based on {reviews.length} reviews
                  </p>
                </div>
                <div className="h-12 w-12 bg-accent/20 rounded-full flex items-center justify-center">
                  <Star className="h-6 w-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Seller Reviews</p>
                  <p className="text-2xl font-bold text-foreground">{sellerReviews.length}</p>
                  <p className="text-sm text-green-400 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    +1 this month
                  </p>
                </div>
                <div className="h-12 w-12 bg-green-500/20 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Average Seller Rating</p>
                  <p className="text-2xl font-bold text-foreground">4.8 <span className="text-yellow-400">★</span></p>
                  <p className="text-sm text-blue-400 flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    Based on {sellerReviews.length} reviews
                  </p>
                </div>
                <div className="h-12 w-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <Award className="h-6 w-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="allReviews">NFT Reviews</TabsTrigger>
            <TabsTrigger value="sellerReviews">Seller Reviews</TabsTrigger>
          </TabsList>

          {/* NFT Reviews Tab */}
          <TabsContent value="allReviews" className="space-y-6">
            {/* Filters and Controls */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Input placeholder="Search reviews..." className="flex-1" />
                  <div className="flex gap-2">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select defaultValue="newest">
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Newest</SelectItem>
                        <SelectItem value="oldest">Oldest</SelectItem>
                        <SelectItem value="highestRating">Highest Rating</SelectItem>
                        <SelectItem value="lowestRating">Lowest Rating</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reviews List */}
            <div className="space-y-4">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} type="nft" />
                ))
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold text-foreground mb-2">No NFT reviews yet</h3>
                    <p className="text-muted-foreground">
                      Be the first to review an NFT!
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Seller Reviews Tab */}
          <TabsContent value="sellerReviews" className="space-y-6">
            {/* Filters and Controls */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Input placeholder="Search seller reviews..." className="flex-1" />
                  <div className="flex gap-2">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select defaultValue="newest">
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Newest</SelectItem>
                        <SelectItem value="oldest">Oldest</SelectItem>
                        <SelectItem value="highestRating">Highest Rating</SelectItem>
                        <SelectItem value="lowestRating">Lowest Rating</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Seller Reviews List */}
            <div className="space-y-4">
              {sellerReviews.length > 0 ? (
                sellerReviews.map((review) => (
                  <ReviewCard key={review.id} review={review} type="seller" />
                ))
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold text-foreground mb-2">No seller reviews yet</h3>
                    <p className="text-muted-foreground">
                      No reviews for sellers at the moment.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Write Review Modal */}
        {showWriteReviewModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Write a Review
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowWriteReviewModal(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Your Rating
                  </label>
                  {renderStarRating()}
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Review for (NFT or Seller)
                  </label>
                  <Input placeholder="Enter NFT title or Seller name..." />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Your Comment
                  </label>
                  <Textarea placeholder="Share your thoughts..." rows={5} />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowWriteReviewModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button className="btn-primary flex-1">
                    <Send className="h-4 w-4 mr-2" />
                    Submit Review
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserReviewsCommentsPage;

