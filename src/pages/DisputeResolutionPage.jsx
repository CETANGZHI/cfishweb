import React, { useState } from 'react';
import {
  Gavel,
  MessageSquare,
  FileText,
  User,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  Search,
  Filter,
  MoreVertical,
  Plus,
  Edit,
  Trash2,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Download,
  Upload,
  Save,
  X,
  Check,
  Bell,
  BellOff,
  Link,
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
  Bookmark,
  Flag,
  Shield,
  Target,
  Zap,
  Award,
  TrendingUp,
  TrendingDown,
  MapPin,
  Image,
  Video,
  Music,
  Users,
  Tag,
  DollarSign
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

const DisputeResolutionPage = () => {
  const [activeTab, setActiveTab] = useState('open');
  const [showNewDisputeModal, setShowNewDisputeModal] = useState(false);

  // Mock Dispute Data
  const disputes = [
    {
      id: 1,
      title: 'NFT not as described',
      status: 'open',
      category: 'Item Quality',
      submittedBy: 'BuyerA',
      involvedParties: ['BuyerA', 'SellerX'],
      submittedDate: '2025-08-10T10:00:00Z',
      lastUpdate: '2025-08-18T14:30:00Z',
      description: 'The NFT I received has a different resolution and color profile than advertised.',
      transactionId: 'tx_nft_12345',
      resolutionProposed: 'Full refund and NFT return',
      evidence: ['image_proof1.jpg', 'chat_logs.txt'],
      assignedTo: 'MediatorJohn'
    },
    {
      id: 2,
      title: 'Payment not received',
      status: 'pending_seller_response',
      category: 'Payment Issue',
      submittedBy: 'SellerY',
      involvedParties: ['SellerY', 'BuyerB'],
      submittedDate: '2025-08-12T11:30:00Z',
      lastUpdate: '2025-08-16T09:00:00Z',
      description: 'Buyer has not completed payment for the NFT after 24 hours.',
      transactionId: 'tx_pay_67890',
      resolutionProposed: 'Payment completion or transaction cancellation',
      evidence: ['blockchain_tx_status.png'],
      assignedTo: 'MediatorJane'
    },
    {
      id: 3,
      title: 'NFT delivered to wrong address',
      status: 'closed_resolved',
      category: 'Delivery Issue',
      submittedBy: 'BuyerC',
      involvedParties: ['BuyerC', 'SellerZ'],
      submittedDate: '2025-08-05T15:00:00Z',
      lastUpdate: '2025-08-14T11:00:00Z',
      description: 'I sent the NFT to the address provided by the seller, but it was incorrect.',
      transactionId: 'tx_addr_11223',
      resolutionProposed: 'Seller re-sent NFT to correct address',
      evidence: ['screenshot_wrong_address.png'],
      assignedTo: 'MediatorJohn'
    },
    {
      id: 4,
      title: 'Dispute over royalty distribution',
      status: 'closed_unresolved',
      category: 'Royalty Issue',
      submittedBy: 'ArtistD',
      involvedParties: ['ArtistD', 'Platform'],
      submittedDate: '2025-07-20T09:00:00Z',
      lastUpdate: '2025-08-01T17:00:00Z',
      description: 'My royalty percentage was incorrectly calculated for recent sales.',
      transactionId: 'tx_royalty_44556',
      resolutionProposed: 'Recalculation and payout of missing royalties',
      evidence: ['sales_report.csv'],
      assignedTo: 'MediatorJane'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-red-500/20 text-red-400';
      case 'pending_seller_response': return 'bg-yellow-500/20 text-yellow-400';
      case 'closed_resolved': return 'bg-green-500/20 text-green-400';
      case 'closed_unresolved': return 'bg-gray-500/20 text-gray-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  const DisputeCard = ({ dispute }) => (
    <Card className="dispute-card cursor-pointer transition-all hover:border-primary/50 group">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            dispute.status === 'open' ? 'bg-red-500/20' :
            dispute.status === 'pending_seller_response' ? 'bg-yellow-500/20' :
            dispute.status === 'closed_resolved' ? 'bg-green-500/20' :
            'bg-gray-500/20'
          }`}>
            <Gavel className={`h-6 w-6 ${
              dispute.status === 'open' ? 'text-red-400' :
              dispute.status === 'pending_seller_response' ? 'text-yellow-400' :
              dispute.status === 'closed_resolved' ? 'text-green-400' :
              'text-gray-300'
            }`} />
          </div>
          
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-foreground">{dispute.title}</h3>
                  <Badge className={getStatusColor(dispute.status)}>
                    {dispute.status.replace(/_/g, ' ')}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-3 w-3" />
                  Submitted by @{dispute.submittedBy}
                </div>
              </div>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {dispute.description}
            </p>

            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Submitted {format(new Date(dispute.submittedDate), 'PPP')}
              </span>
              <span className="flex items-center gap-1">
                <RefreshCw className="h-3 w-3" />
                Last Update {format(new Date(dispute.lastUpdate), 'PPP')}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex gap-1">
                <Badge variant="outline" className="text-xs">
                  {dispute.category}
                </Badge>
                {dispute.involvedParties.map((party, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {party}
                  </Badge>
                ))}
              </div>
              
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <Eye className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <MessageSquare className="h-3 w-3" />
                </Button>
              </div>
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
                Dispute Resolution
              </h1>
              <p className="text-muted-foreground">
                Manage and resolve issues related to transactions and NFTs
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowNewDisputeModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Open New Dispute
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
                  <p className="text-sm font-medium text-muted-foreground">Open Disputes</p>
                  <p className="text-2xl font-bold text-foreground">{disputes.filter(d => d.status === 'open' || d.status === 'pending_seller_response').length}</p>
                  <p className="text-sm text-red-400 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    Requires attention
                  </p>
                </div>
                <div className="h-12 w-12 bg-red-500/20 rounded-full flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Resolved Disputes</p>
                  <p className="text-2xl font-bold text-foreground">{disputes.filter(d => d.status === 'closed_resolved').length}</p>
                  <p className="text-sm text-green-400 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Successfully closed
                  </p>
                </div>
                <div className="h-12 w-12 bg-green-500/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Disputes</p>
                  <p className="text-2xl font-bold text-foreground">{disputes.length}</p>
                  <p className="text-sm text-blue-400 flex items-center gap-1">
                    <Gavel className="h-3 w-3" />
                    All time
                  </p>
                </div>
                <div className="h-12 w-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <Gavel className="h-6 w-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg. Resolution Time</p>
                  <p className="text-2xl font-bold text-foreground">3.5 days</p>
                  <p className="text-sm text-yellow-400 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Efficiency metric
                  </p>
                </div>
                <div className="h-12 w-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                  <Clock className="h-6 w-6 text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="open">Open</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
            <TabsTrigger value="all">All Disputes</TabsTrigger>
          </TabsList>

          {/* Filters and Controls */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Input placeholder="Search disputes..." className="flex-1" />
                <div className="flex gap-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="itemQuality">Item Quality</SelectItem>
                      <SelectItem value="paymentIssue">Payment Issue</SelectItem>
                      <SelectItem value="deliveryIssue">Delivery Issue</SelectItem>
                      <SelectItem value="royaltyIssue">Royalty Issue</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select defaultValue="newest">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="oldest">Oldest</SelectItem>
                      <SelectItem value="mostActive">Most Active</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Open Disputes Tab */}
          <TabsContent value="open" className="space-y-4">
            {disputes.filter(d => d.status === 'open' || d.status === 'pending_seller_response').length > 0 ? (
              <div className="space-y-4">
                {disputes.filter(d => d.status === 'open' || d.status === 'pending_seller_response').map((dispute) => (
                  <DisputeCard key={dispute.id} dispute={dispute} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">No open disputes</h3>
                  <p className="text-muted-foreground">
                    All clear! No active issues requiring your attention.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Pending Disputes Tab */}
          <TabsContent value="pending" className="space-y-4">
            {disputes.filter(d => d.status === 'pending_seller_response').length > 0 ? (
              <div className="space-y-4">
                {disputes.filter(d => d.status === 'pending_seller_response').map((dispute) => (
                  <DisputeCard key={dispute.id} dispute={dispute} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">No pending disputes</h3>
                  <p className="text-muted-foreground">
                    All pending issues have been addressed.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Resolved Disputes Tab */}
          <TabsContent value="resolved" className="space-y-4">
            {disputes.filter(d => d.status === 'closed_resolved').length > 0 ? (
              <div className="space-y-4">
                {disputes.filter(d => d.status === 'closed_resolved').map((dispute) => (
                  <DisputeCard key={dispute.id} dispute={dispute} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">No resolved disputes</h3>
                  <p className="text-muted-foreground">
                    No disputes have been resolved yet.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* All Disputes Tab */}
          <TabsContent value="all" className="space-y-4">
            {disputes.length > 0 ? (
              <div className="space-y-4">
                {disputes.map((dispute) => (
                  <DisputeCard key={dispute.id} dispute={dispute} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Gavel className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">No disputes found</h3>
                  <p className="text-muted-foreground">
                    All transactions are running smoothly.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* New Dispute Modal */}
        {showNewDisputeModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Open New Dispute
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowNewDisputeModal(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Dispute Title *
                  </label>
                  <Input placeholder="e.g., NFT not as described" />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Transaction ID *
                  </label>
                  <Input placeholder="Enter the transaction ID related to the dispute" />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Category *
                  </label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select dispute category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="itemQuality">Item Quality</SelectItem>
                      <SelectItem value="paymentIssue">Payment Issue</SelectItem>
                      <SelectItem value="deliveryIssue">Delivery Issue</SelectItem>
                      <SelectItem value="royaltyIssue">Royalty Issue</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Description *
                  </label>
                  <Textarea placeholder="Describe the issue in detail..." rows={4} />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Proposed Resolution
                  </label>
                  <Textarea placeholder="What resolution are you seeking?" rows={2} />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Evidence (Optional)
                  </label>
                  <input type="file" multiple className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                  <p className="text-xs text-muted-foreground mt-1">Max 5 files, 10MB each. Supported formats: images, PDFs, text files.</p>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowNewDisputeModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="flex-1 btn-primary"
                    onClick={() => setShowNewDisputeModal(false)}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Submit Dispute
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

export default DisputeResolutionPage;

