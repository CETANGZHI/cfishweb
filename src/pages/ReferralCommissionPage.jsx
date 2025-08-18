import React, { useState } from 'react';
import {
  DollarSign,
  Users,
  Link,
  Share,
  Copy,
  RefreshCw,
  Settings,
  Download,
  Upload,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Grid,
  List,
  MoreVertical,
  Plus,
  X,
  Check,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  Image,
  Video,
  Music,
  FileText,
  ExternalLink,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  User,
  UserPlus,
  UserMinus,
  Bell,
  BellOff,
  MessageSquare,
  QrCode,
  Scan,
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
  Target,
  Zap,
  Award,
  TrendingUp,
  TrendingDown,
  MapPin
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Switch } from '../components/ui/switch';
import { Progress } from '../components/ui/progress';
import { format } from 'date-fns';
import '../App.css';

const ReferralCommissionPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [referralLink, setReferralLink] = useState('https://cfish.io/ref/yourusername');

  // Mock Data
  const overviewStats = {
    totalEarnings: 1250.75,
    pendingEarnings: 89.50,
    totalReferrals: 543,
    activeReferrals: 120,
    commissionRate: 5,
    nextPayout: '2025-09-01',
  };

  const recentReferrals = [
    {
      id: 1,
      username: 'UserA',
      avatar: '/api/placeholder/40/40',
      joinedDate: '2025-08-10',
      lastActivity: '2025-08-18',
      earnings: 15.20,
      status: 'active',
    },
    {
      id: 2,
      username: 'UserB',
      avatar: '/api/placeholder/40/40',
      joinedDate: '2025-08-05',
      lastActivity: '2025-08-17',
      earnings: 8.90,
      status: 'active',
    },
    {
      id: 3,
      username: 'UserC',
      avatar: '/api/placeholder/40/40',
      joinedDate: '2025-07-28',
      lastActivity: '2025-08-15',
      earnings: 22.50,
      status: 'active',
    },
    {
      id: 4,
      username: 'UserD',
      avatar: '/api/placeholder/40/40',
      joinedDate: '2025-07-20',
      lastActivity: '2025-08-10',
      earnings: 5.10,
      status: 'inactive',
    },
  ];

  const payoutHistory = [
    {
      id: 1,
      date: '2025-08-01',
      amount: 150.00,
      status: 'completed',
      transactionId: 'tx_123456789',
    },
    {
      id: 2,
      date: '2025-07-01',
      amount: 120.50,
      status: 'completed',
      transactionId: 'tx_987654321',
    },
    {
      id: 3,
      date: '2025-06-01',
      amount: 95.75,
      status: 'completed',
      transactionId: 'tx_456789123',
    },
  ];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    alert('Referral link copied to clipboard!');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400';
      case 'inactive': return 'bg-yellow-500/20 text-yellow-400';
      case 'completed': return 'bg-blue-500/20 text-blue-400';
      case 'pending': return 'bg-orange-500/20 text-orange-400';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  return (
    <div className="fullscreen-layout pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-responsive-xl font-bold text-foreground mb-2">
                Referral & Commission
              </h1>
              <p className="text-muted-foreground">
                Earn commissions by inviting new users to CFISH
              </p>
            </div>
            <div className="flex gap-2">
              <Button className="btn-primary">
                <DollarSign className="h-4 w-4 mr-2" />
                Request Payout
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
                  <p className="text-sm font-medium text-muted-foreground">Total Earnings</p>
                  <p className="text-2xl font-bold text-foreground">{overviewStats.totalEarnings} SOL</p>
                  <p className="text-sm text-green-400 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    +15% this month
                  </p>
                </div>
                <div className="h-12 w-12 bg-primary/20 rounded-full flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Earnings</p>
                  <p className="text-2xl font-bold text-foreground">{overviewStats.pendingEarnings} SOL</p>
                  <p className="text-sm text-orange-400 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Next payout: {format(new Date(overviewStats.nextPayout), 'PPP')}
                  </p>
                </div>
                <div className="h-12 w-12 bg-accent/20 rounded-full flex items-center justify-center">
                  <Coins className="h-6 w-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Referrals</p>
                  <p className="text-2xl font-bold text-foreground">{overviewStats.totalReferrals}</p>
                  <p className="text-sm text-blue-400 flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    New users invited
                  </p>
                </div>
                <div className="h-12 w-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Commission Rate</p>
                  <p className="text-2xl font-bold text-foreground">{overviewStats.commissionRate}%</p>
                  <p className="text-sm text-green-400 flex items-center gap-1">
                    <Percent className="h-3 w-3" />
                    Your current rate
                  </p>
                </div>
                <div className="h-12 w-12 bg-green-500/20 rounded-full flex items-center justify-center">
                  <Percent className="h-6 w-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Referral Link Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link className="h-5 w-5" />
              Your Referral Link
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Input readOnly value={referralLink} className="flex-1" />
              <Button onClick={handleCopyLink}>
                <Copy className="h-4 w-4 mr-2" />
                Copy Link
              </Button>
              <Button variant="outline">
                <Share className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Share this link to invite new users and earn commissions.
            </p>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="referrals">My Referrals</TabsTrigger>
            <TabsTrigger value="payouts">Payout History</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Earnings Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  {/* Placeholder for a chart */}
                  <p>Chart showing earnings over time will go here.</p>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Referral Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Active Referrals</p>
                    <p className="font-semibold text-foreground">{overviewStats.activeReferrals}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Conversion Rate</p>
                    <p className="font-semibold text-foreground">25%</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Average Earning per Referral</p>
                    <p className="font-semibold text-foreground">2.3 SOL</p>
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    View All Referrals
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Commission Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Your Commission Rate</p>
                    <p className="font-semibold text-foreground">{overviewStats.commissionRate}%</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Minimum Payout</p>
                    <p className="font-semibold text-foreground">50 SOL</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Payout Frequency</p>
                    <p className="font-semibold text-foreground">Monthly</p>
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    Adjust Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* My Referrals Tab */}
          <TabsContent value="referrals" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Recent Referrals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentReferrals.length > 0 ? (
                    recentReferrals.map((referral) => (
                      <div key={referral.id} className="flex items-center gap-4 p-3 border border-border rounded-lg">
                        <img src={referral.avatar} alt={referral.username} className="w-10 h-10 rounded-full object-cover" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">@{referral.username}</h3>
                          <p className="text-sm text-muted-foreground">Joined: {format(new Date(referral.joinedDate), 'PPP')}</p>
                          <p className="text-sm text-muted-foreground">Last Activity: {format(new Date(referral.lastActivity), 'PPP')}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-foreground">{referral.earnings} SOL</p>
                          <Badge className={getStatusColor(referral.status)}>
                            {referral.status}
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      No recent referrals.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payout History Tab */}
          <TabsContent value="payouts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Payout History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {payoutHistory.length > 0 ? (
                    payoutHistory.map((payout) => (
                      <div key={payout.id} className="flex items-center gap-4 p-3 border border-border rounded-lg">
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">{payout.amount} SOL</h3>
                          <p className="text-sm text-muted-foreground">Date: {format(new Date(payout.date), 'PPP')}</p>
                          <p className="text-sm text-muted-foreground">Tx ID: {payout.transactionId}</p>
                        </div>
                        <Badge className={getStatusColor(payout.status)}>
                          {payout.status}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      No payout history.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ReferralCommissionPage;

