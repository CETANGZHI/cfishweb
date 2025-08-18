import React, { useState } from 'react';
import { 
  MessageSquare,
  Users,
  Hash,
  Plus,
  Search,
  Send,
  Smile,
  Paperclip,
  Phone,
  Video,
  MoreVertical,
  Star,
  Heart,
  Share,
  Reply,
  Pin,
  Settings,
  Bell,
  BellOff,
  UserPlus,
  Crown,
  Shield,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Calendar,
  TrendingUp,
  Zap,
  Award,
  Globe,
  Lock,
  Eye,
  ThumbsUp,
  MessageCircle,
  Bookmark,
  Flag
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import '../App.css';

const CommunityPage = () => {
  const [activeTab, setActiveTab] = useState('chat');
  const [selectedChannel, setSelectedChannel] = useState('general');
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [postContent, setPostContent] = useState('');

  // Mock channels data
  const channels = [
    {
      id: 'general',
      name: 'general',
      type: 'text',
      description: 'General discussion about CFISH',
      members: 1247,
      unread: 3,
      isPublic: true
    },
    {
      id: 'nft-showcase',
      name: 'nft-showcase',
      type: 'text',
      description: 'Show off your latest NFT finds',
      members: 892,
      unread: 0,
      isPublic: true
    },
    {
      id: 'trading-tips',
      name: 'trading-tips',
      type: 'text',
      description: 'Share trading strategies and tips',
      members: 634,
      unread: 7,
      isPublic: true
    },
    {
      id: 'barter-zone',
      name: 'barter-zone',
      type: 'text',
      description: 'Discuss barter opportunities',
      members: 445,
      unread: 2,
      isPublic: true
    },
    {
      id: 'voice-lounge',
      name: 'voice-lounge',
      type: 'voice',
      description: 'Voice chat for community members',
      members: 23,
      active: 5,
      isPublic: true
    }
  ];

  // Mock messages data
  const messages = [
    {
      id: 1,
      user: 'CryptoArtist',
      avatar: '👨‍🎨',
      content: 'Just minted my latest piece! Check it out in the showcase channel 🎨',
      timestamp: '10:30 AM',
      reactions: [
        { emoji: '🔥', count: 12, users: ['user1', 'user2'] },
        { emoji: '❤️', count: 8, users: ['user3'] }
      ],
      replies: 3
    },
    {
      id: 2,
      user: 'NFTCollector',
      avatar: '🎭',
      content: 'Anyone interested in trading some gaming NFTs? I have some rare items from the latest drop.',
      timestamp: '10:25 AM',
      reactions: [
        { emoji: '👀', count: 5, users: ['user4'] }
      ],
      replies: 7
    },
    {
      id: 3,
      user: 'DigitalDreamer',
      avatar: '🌟',
      content: 'The new CFISH staking rewards are amazing! Already earning 15% APY 💰',
      timestamp: '10:20 AM',
      reactions: [
        { emoji: '💎', count: 15, users: ['user5', 'user6'] },
        { emoji: '🚀', count: 9, users: ['user7'] }
      ],
      replies: 12
    },
    {
      id: 4,
      user: 'MetaTrader',
      avatar: '🤖',
      content: 'Market analysis: SOL is looking bullish, perfect time for NFT investments! 📈',
      timestamp: '10:15 AM',
      reactions: [
        { emoji: '📊', count: 6, users: ['user8'] }
      ],
      replies: 4
    }
  ];

  // Mock direct messages
  const conversations = [
    {
      id: 1,
      user: 'ArtDealer',
      avatar: '🎨',
      lastMessage: 'Interested in your Cosmic Whale NFT...',
      timestamp: '2 min ago',
      unread: 2,
      online: true
    },
    {
      id: 2,
      user: 'GameMaster',
      avatar: '🎮',
      lastMessage: 'Thanks for the trade! Great doing business',
      timestamp: '1 hour ago',
      unread: 0,
      online: false
    },
    {
      id: 3,
      user: 'MusicMaker',
      avatar: '🎵',
      lastMessage: 'Check out my new music NFT collection',
      timestamp: '3 hours ago',
      unread: 1,
      online: true
    }
  ];

  // Mock community posts
  const communityPosts = [
    {
      id: 1,
      user: 'CommunityMod',
      avatar: '👑',
      role: 'Moderator',
      content: 'Welcome to the CFISH Community! 🎉\n\nWe\'re excited to have you join our growing family of NFT enthusiasts, traders, and creators. Here are some quick tips to get started:\n\n• Check out #nft-showcase for amazing art\n• Visit #trading-tips for market insights\n• Use #barter-zone for direct trades\n• Join voice channels for real-time discussions\n\nRemember to follow our community guidelines and be respectful to all members. Happy trading! 🚀',
      timestamp: '2 hours ago',
      likes: 47,
      comments: 12,
      shares: 8,
      pinned: true,
      images: []
    },
    {
      id: 2,
      user: 'TechAnalyst',
      avatar: '📊',
      role: 'Verified',
      content: 'Weekly Market Report 📈\n\nThis week has been incredible for the NFT space:\n\n• Total volume up 23%\n• CFISH token gained 15%\n• New collections launched: 12\n• Successful barter trades: 156\n\nThe community is growing stronger every day! What are your thoughts on the current market trends?',
      timestamp: '4 hours ago',
      likes: 89,
      comments: 23,
      shares: 15,
      pinned: false,
      images: ['📊', '📈']
    },
    {
      id: 3,
      user: 'ArtistSpotlight',
      avatar: '🎨',
      role: 'Creator',
      content: 'Artist Spotlight: @DigitalDreamer 🌟\n\nThis week we\'re featuring the amazing work of DigitalDreamer, whose surreal digital landscapes have been taking the community by storm!\n\n• 50+ NFTs created\n• Average sale price: 3.2 SOL\n• Community favorite rating: 4.9/5\n\nCheck out their latest collection "Cosmic Journeys" - absolutely stunning work! 🚀',
      timestamp: '1 day ago',
      likes: 156,
      comments: 34,
      shares: 28,
      pinned: false,
      images: ['🌌', '🎭', '✨']
    }
  ];

  const MessageBubble = ({ message, isOwn = false }) => (
    <div className={`flex gap-3 mb-4 ${isOwn ? 'flex-row-reverse' : ''}`}>
      {!isOwn && (
        <div className="text-2xl">{message.avatar}</div>
      )}
      <div className={`flex-1 max-w-md ${isOwn ? 'text-right' : ''}`}>
        {!isOwn && (
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-sm text-foreground">{message.user}</span>
            <span className="text-xs text-muted-foreground">{message.timestamp}</span>
          </div>
        )}
        <div className={`p-3 rounded-lg ${
          isOwn 
            ? 'bg-primary text-primary-foreground ml-auto' 
            : 'bg-secondary/20 text-foreground'
        }`}>
          <p className="text-sm">{message.content}</p>
        </div>
        
        {/* Reactions */}
        {message.reactions && message.reactions.length > 0 && (
          <div className="flex gap-1 mt-2">
            {message.reactions.map((reaction, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs hover:bg-secondary/20"
              >
                <span className="mr-1">{reaction.emoji}</span>
                <span>{reaction.count}</span>
              </Button>
            ))}
          </div>
        )}
        
        {/* Reply count */}
        {message.replies > 0 && (
          <Button variant="ghost" size="sm" className="mt-1 h-6 px-2 text-xs text-muted-foreground">
            <Reply className="h-3 w-3 mr-1" />
            {message.replies} replies
          </Button>
        )}
      </div>
    </div>
  );

  const CommunityPost = ({ post }) => (
    <Card className="community-post mb-6">
      <CardContent className="p-6">
        {/* Post Header */}
        <div className="flex items-start gap-3 mb-4">
          <div className="text-2xl">{post.avatar}</div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-foreground">{post.user}</span>
              {post.role && (
                <Badge variant="outline" className="text-xs">
                  {post.role === 'Moderator' && <Crown className="h-3 w-3 mr-1" />}
                  {post.role === 'Verified' && <Shield className="h-3 w-3 mr-1" />}
                  {post.role === 'Creator' && <Star className="h-3 w-3 mr-1" />}
                  {post.role}
                </Badge>
              )}
              {post.pinned && (
                <Badge variant="secondary" className="text-xs">
                  <Pin className="h-3 w-3 mr-1" />
                  Pinned
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{post.timestamp}</p>
          </div>
          <Button variant="ghost" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>

        {/* Post Content */}
        <div className="mb-4">
          <p className="text-foreground whitespace-pre-line">{post.content}</p>
          
          {/* Post Images */}
          {post.images && post.images.length > 0 && (
            <div className="flex gap-2 mt-3">
              {post.images.map((image, index) => (
                <div key={index} className="w-16 h-16 bg-secondary/20 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">{image}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Post Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex gap-4">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <ThumbsUp className="h-4 w-4 mr-1" />
              {post.likes}
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <MessageCircle className="h-4 w-4 mr-1" />
              {post.comments}
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <Share className="h-4 w-4 mr-1" />
              {post.shares}
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm">
              <Bookmark className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Flag className="h-4 w-4" />
            </Button>
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-responsive-xl font-bold text-foreground mb-2">
                Community Hub
              </h1>
              <p className="text-muted-foreground">
                Connect, chat, and collaborate with the CFISH community
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <UserPlus className="h-4 w-4 mr-2" />
                Invite Friends
              </Button>
              <Button className="btn-primary">
                <Plus className="h-4 w-4 mr-2" />
                Create Post
              </Button>
            </div>
          </div>
        </div>

        {/* Community Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Members</p>
                  <p className="text-2xl font-bold text-foreground">2,847</p>
                  <p className="text-sm text-green-400 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    +127 this week
                  </p>
                </div>
                <div className="h-12 w-12 bg-primary/20 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Online Now</p>
                  <p className="text-2xl font-bold text-foreground">342</p>
                  <p className="text-sm text-muted-foreground">12% of members</p>
                </div>
                <div className="h-12 w-12 bg-green-500/20 rounded-full flex items-center justify-center">
                  <Zap className="h-6 w-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Messages Today</p>
                  <p className="text-2xl font-bold text-foreground">1,234</p>
                  <p className="text-sm text-accent">Very active!</p>
                </div>
                <div className="h-12 w-12 bg-accent/20 rounded-full flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Community Score</p>
                  <p className="text-2xl font-bold text-foreground">4.9</p>
                  <p className="text-sm text-yellow-400 flex items-center gap-1">
                    <Award className="h-3 w-3" />
                    Excellent
                  </p>
                </div>
                <div className="h-12 w-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                  <Star className="h-6 w-6 text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="chat">Chat Rooms</TabsTrigger>
            <TabsTrigger value="posts">Community Posts</TabsTrigger>
            <TabsTrigger value="direct">Direct Messages</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
          </TabsList>

          {/* Chat Rooms Tab */}
          <TabsContent value="chat" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
              {/* Channels Sidebar */}
              <Card className="lg:col-span-1">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Channels</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-1">
                    {channels.map((channel) => (
                      <button
                        key={channel.id}
                        onClick={() => setSelectedChannel(channel.id)}
                        className={`w-full text-left p-3 hover:bg-secondary/20 transition-colors ${
                          selectedChannel === channel.id ? 'bg-primary/20 border-r-2 border-primary' : ''
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {channel.type === 'voice' ? (
                            <Volume2 className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Hash className="h-4 w-4 text-muted-foreground" />
                          )}
                          <span className="font-medium text-foreground">{channel.name}</span>
                          {channel.unread > 0 && (
                            <Badge variant="destructive" className="ml-auto text-xs">
                              {channel.unread}
                            </Badge>
                          )}
                          {channel.type === 'voice' && channel.active > 0 && (
                            <Badge variant="secondary" className="ml-auto text-xs">
                              {channel.active}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 truncate">
                          {channel.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Chat Area */}
              <Card className="lg:col-span-3 flex flex-col">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Hash className="h-5 w-5 text-muted-foreground" />
                      <span className="font-semibold text-foreground">{selectedChannel}</span>
                      <Badge variant="outline" className="text-xs">
                        {channels.find(c => c.id === selectedChannel)?.members} members
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Bell className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Pin className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {/* Messages */}
                <CardContent className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <MessageBubble key={message.id} message={message} />
                    ))}
                  </div>
                </CardContent>

                {/* Message Input */}
                <div className="p-4 border-t border-border">
                  <div className="flex gap-2">
                    <Input
                      placeholder={`Message #${selectedChannel}...`}
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      className="flex-1"
                    />
                    <Button variant="ghost" size="sm">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Smile className="h-4 w-4" />
                    </Button>
                    <Button className="btn-primary">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Community Posts Tab */}
          <TabsContent value="posts" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Posts Feed */}
              <div className="lg:col-span-2">
                {/* Create Post */}
                <Card className="mb-6">
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <div className="text-2xl">👤</div>
                      <div className="flex-1">
                        <Textarea
                          placeholder="What's happening in the CFISH community?"
                          value={postContent}
                          onChange={(e) => setPostContent(e.target.value)}
                          className="mb-3"
                        />
                        <div className="flex items-center justify-between">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Paperclip className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Smile className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Calendar className="h-4 w-4" />
                            </Button>
                          </div>
                          <Button className="btn-primary">
                            <Send className="h-4 w-4 mr-2" />
                            Post
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Posts */}
                {communityPosts.map((post) => (
                  <CommunityPost key={post.id} post={post} />
                ))}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Trending Topics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Trending Topics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-foreground">#NFTDrop</span>
                      <span className="text-xs text-muted-foreground">234 posts</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-foreground">#BarterTrade</span>
                      <span className="text-xs text-muted-foreground">189 posts</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-foreground">#CFISHStaking</span>
                      <span className="text-xs text-muted-foreground">156 posts</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-foreground">#ArtShowcase</span>
                      <span className="text-xs text-muted-foreground">142 posts</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Active Members */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Active Members
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {['CryptoArtist', 'NFTCollector', 'DigitalDreamer', 'MetaTrader'].map((user, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="text-lg">👤</div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">{user}</p>
                          <p className="text-xs text-muted-foreground">Online now</p>
                        </div>
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Direct Messages Tab */}
          <TabsContent value="direct" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
              {/* Conversations List */}
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Messages</CardTitle>
                    <Button variant="ghost" size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <Input placeholder="Search conversations..." className="mt-2" />
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-1">
                    {conversations.map((conv) => (
                      <button
                        key={conv.id}
                        onClick={() => setSelectedConversation(conv.id)}
                        className={`w-full text-left p-3 hover:bg-secondary/20 transition-colors ${
                          selectedConversation === conv.id ? 'bg-primary/20' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="text-xl">{conv.avatar}</div>
                            {conv.online && (
                              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-background"></div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-foreground truncate">{conv.user}</span>
                              <span className="text-xs text-muted-foreground">{conv.timestamp}</span>
                            </div>
                            <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                          </div>
                          {conv.unread > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              {conv.unread}
                            </Badge>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Chat Area */}
              <Card className="lg:col-span-2 flex flex-col">
                {selectedConversation ? (
                  <>
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-xl">
                            {conversations.find(c => c.id === selectedConversation)?.avatar}
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">
                              {conversations.find(c => c.id === selectedConversation)?.user}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {conversations.find(c => c.id === selectedConversation)?.online ? 'Online' : 'Last seen 2h ago'}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Phone className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Video className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="flex-1 overflow-y-auto p-4">
                      <div className="space-y-4">
                        <MessageBubble 
                          message={{
                            content: "Hey! I saw your Cosmic Whale NFT and I'm really interested. Would you consider a trade?",
                            timestamp: "10:30 AM"
                          }} 
                        />
                        <MessageBubble 
                          message={{
                            content: "Sure! What do you have in mind? I'm looking for something in the digital art space.",
                            timestamp: "10:32 AM"
                          }} 
                          isOwn={true}
                        />
                        <MessageBubble 
                          message={{
                            content: "I have a rare piece from the Abstract Dreams collection. It's valued at around 2.8 SOL. I can also add some CFISH tokens to make it fair.",
                            timestamp: "10:35 AM"
                          }} 
                        />
                      </div>
                    </CardContent>

                    <div className="p-4 border-t border-border">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Type a message..."
                          className="flex-1"
                        />
                        <Button variant="ghost" size="sm">
                          <Paperclip className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Smile className="h-4 w-4" />
                        </Button>
                        <Button className="btn-primary">
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">Select a conversation</h3>
                      <p className="text-muted-foreground">Choose a conversation from the list to start chatting</p>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border border-border rounded-lg p-4">
                    <div className="flex items-start gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">18</div>
                        <div className="text-sm text-muted-foreground">JAN</div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">CFISH Community AMA</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          Join our founders for a live Q&A session about the future of CFISH
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>🕐 2:00 PM UTC</span>
                          <span>👥 234 attending</span>
                          <span>🎤 Voice Chat</span>
                        </div>
                      </div>
                      <Button className="btn-primary">Join</Button>
                    </div>
                  </div>

                  <div className="border border-border rounded-lg p-4">
                    <div className="flex items-start gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">20</div>
                        <div className="text-sm text-muted-foreground">JAN</div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">NFT Art Contest</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          Submit your best digital art for a chance to win 50 CFISH tokens
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>🏆 50 CFISH Prize</span>
                          <span>📅 Deadline: Jan 25</span>
                          <span>🎨 Digital Art</span>
                        </div>
                      </div>
                      <Button variant="outline">Learn More</Button>
                    </div>
                  </div>

                  <div className="border border-border rounded-lg p-4">
                    <div className="flex items-start gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">25</div>
                        <div className="text-sm text-muted-foreground">JAN</div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">Trading Workshop</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          Learn advanced NFT trading strategies from community experts
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>🕐 6:00 PM UTC</span>
                          <span>👥 89 attending</span>
                          <span>📚 Educational</span>
                        </div>
                      </div>
                      <Button variant="outline">Register</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CommunityPage;

