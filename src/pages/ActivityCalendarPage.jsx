import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Tag,
  Users,
  DollarSign,
  Image,
  ExternalLink,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  RefreshCw,
  Download,
  Upload,
  Settings,
  Info,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ArrowRight,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Star,
  Heart,
  Share,
  Copy,
  Link,
  QrCode,
  Scan,
  User,
  UserPlus,
  UserMinus,
  Bell,
  BellOff,
  Coins,
  Percent,
  Layers,
  CheckSquare,
  Square,
  Activity,
  BarChart3,
  PieChart,
  LineChart,
  Globe,
  Smartphone,
  Mail,
  Volume2,
  VolumeX,
  Palette,
  Moon,
  Sun,
  Monitor,
  Languages,
  HelpCircle,
  Save,
  Bookmark,
  Flag,
  Shield,
  MessageSquare,
  Target,
  Zap,
  Award,
  TrendingUp,
  TrendingDown,
  FileText
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { Calendar } from '../components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '../lib/utils'; // Assuming this utility exists for tailwind-merge
import '../App.css';

const ActivityCalendarPage = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [date, setDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Mock Events Data
  const events = [
    {
      id: 1,
      title: 'Exclusive NFT Drop: Cyberpunk Series',
      date: '2025-08-20T10:00:00Z',
      type: 'NFT Drop',
      category: 'Digital Art',
      location: 'Online - CFISH Platform',
      description: 'Be the first to own a piece of the highly anticipated Cyberpunk Series. Limited edition NFTs will be available.',
      participants: 500,
      price: '0.5 SOL',
      image: '/api/placeholder/300/200?text=Cyberpunk+Drop',
      link: '#',
      status: 'upcoming'
    },
    {
      id: 2,
      title: 'Live Auction: Rare Genesis NFT',
      date: '2025-08-22T14:00:00Z',
      type: 'Auction',
      category: 'Collectibles',
      location: 'Online - CFISH Platform',
      description: 'A unique opportunity to bid on a rare Genesis NFT from a renowned artist. Starting bid at 10 SOL.',
      participants: 120,
      price: '10 SOL (starting bid)',
      image: '/api/placeholder/300/200?text=Rare+NFT+Auction',
      link: '#',
      status: 'upcoming'
    },
    {
      id: 3,
      title: 'Community AMA with ArtistX',
      date: '2025-08-25T18:00:00Z',
      type: 'Community Event',
      category: 'Community',
      location: 'Discord - CFISH Server',
      description: 'Join ArtistX for a live Ask Me Anything session. Get insights into their creative process and upcoming projects.',
      participants: 300,
      price: 'Free',
      image: '/api/placeholder/300/200?text=ArtistX+AMA',
      link: '#',
      status: 'upcoming'
    },
    {
      id: 4,
      title: 'CFISH Platform Update Webinar',
      date: '2025-08-15T11:00:00Z',
      type: 'Webinar',
      category: 'Platform News',
      location: 'Online - Zoom',
      description: 'Learn about the latest features and improvements coming to the CFISH platform. Q&A session included.',
      participants: 400,
      price: 'Free',
      image: '/api/placeholder/300/200?text=Platform+Update',
      link: '#',
      status: 'past'
    },
    {
      id: 5,
      title: 'NFT Art Exhibition: Digital Frontiers',
      date: '2025-07-30T09:00:00Z',
      type: 'Exhibition',
      category: 'Digital Art',
      location: 'Virtual Gallery',
      description: 'Explore a curated collection of cutting-edge digital art from emerging and established artists.',
      participants: 800,
      price: 'Free',
      image: '/api/placeholder/300/200?text=Art+Exhibition',
      link: '#',
      status: 'past'
    }
  ];

  const upcomingEvents = events.filter(event => new Date(event.date) >= new Date());
  const pastEvents = events.filter(event => new Date(event.date) < new Date());

  const EventCard = ({ event }) => (
    <Card className="event-card cursor-pointer transition-all hover:border-primary/50 group">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex-shrink-0 overflow-hidden">
            <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-foreground text-lg">{event.title}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <CalendarIcon className="h-3 w-3" />
                  {format(new Date(event.date), 'PPP')}
                  <Clock className="h-3 w-3 ml-2" />
                  {format(new Date(event.date), 'p')}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-500/20 text-blue-400">
                  {event.type}
                </Badge>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setSelectedEvent(event)}>
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {event.description}
            </p>

            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {event.location}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {event.participants} participants
              </span>
              <span className="flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                {event.price}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-xs">
                {event.category}
              </Badge>
              <Button variant="link" size="sm" className="text-primary">
                View Details
                <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
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
                Activity & Event Calendar
              </h1>
              <p className="text-muted-foreground">
                Stay updated with upcoming NFT drops, auctions, and community events
              </p>
            </div>
            <div className="flex gap-2">
              <Button className="btn-primary">
                <Plus className="h-4 w-4 mr-2" />
                Submit Event
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
                <TabsTrigger value="past">Past Events</TabsTrigger>
              </TabsList>

              {/* Filters and Controls */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Input placeholder="Search events..." className="flex-1" />
                    <div className="flex gap-2">
                      <Select defaultValue="all">
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="drop">NFT Drop</SelectItem>
                          <SelectItem value="auction">Auction</SelectItem>
                          <SelectItem value="community">Community Event</SelectItem>
                          <SelectItem value="webinar">Webinar</SelectItem>
                          <SelectItem value="exhibition">Exhibition</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Select defaultValue="all">
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          <SelectItem value="digitalArt">Digital Art</SelectItem>
                          <SelectItem value="collectibles">Collectibles</SelectItem>
                          <SelectItem value="gaming">Gaming</SelectItem>
                          <SelectItem value="music">Music</SelectItem>
                        </SelectContent>
                      </Select>

                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[280px] justify-start text-left font-normal",
                              !date && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Events Tab */}
              <TabsContent value="upcoming" className="space-y-4">
                {upcomingEvents.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingEvents.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-semibold text-foreground mb-2">No upcoming events</h3>
                      <p className="text-muted-foreground">
                        Check back later for new NFT drops, auctions, and community events.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Past Events Tab */}
              <TabsContent value="past" className="space-y-4">
                {pastEvents.length > 0 ? (
                  <div className="space-y-4">
                    {pastEvents.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-semibold text-foreground mb-2">No past events</h3>
                      <p className="text-muted-foreground">
                        No historical events to display.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Event Details Popover (simplified for example) */}
            {selectedEvent && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Info className="h-5 w-5" />
                      Event Details
                    </CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedEvent(null)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <h3 className="font-semibold text-foreground text-lg">{selectedEvent.title}</h3>
                  <p className="text-sm text-muted-foreground">{selectedEvent.description}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarIcon className="h-4 w-4" />
                    {format(new Date(selectedEvent.date), 'PPP p')}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {selectedEvent.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <DollarSign className="h-4 w-4" />
                    {selectedEvent.price}
                  </div>
                  <Button className="btn-primary w-full mt-4">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Go to Event
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Quick Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Quick Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Tag className="h-4 w-4 mr-2" />
                  NFT Drops
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Auctions
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Community Events
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  This Week
                </Button>
              </CardContent>
            </Card>

            {/* Featured Events (simplified) */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Featured Events
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {events.slice(0, 2).map((event) => (
                  <div key={event.id} className="flex items-center gap-3 p-2 border border-border rounded-lg">
                    <img src={event.image} alt={event.title} className="w-10 h-10 rounded-md object-cover" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground line-clamp-1">{event.title}</p>
                      <p className="text-xs text-muted-foreground">{format(new Date(event.date), 'PPP')}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityCalendarPage;

