import React, { useState } from 'react';
import { 
  Coins, 
  Vote, 
  TrendingUp, 
  Clock, 
  Users, 
  DollarSign,
  Lock,
  Unlock,
  Plus,
  Minus,
  Calendar,
  Award,
  Target,
  BarChart3,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Progress } from '../components/ui/progress';
import { Separator } from '../components/ui/separator';
import '../App.css';

const StakingGovernancePage = () => {
  const [stakingAmount, setStakingAmount] = useState('');
  const [selectedPool, setSelectedPool] = useState('pool1');
  const [selectedProposal, setSelectedProposal] = useState(null);

  // Mock data
  const stakingPools = [
    {
      id: 'pool1',
      name: 'CFISH Staking Pool',
      apy: '12.5%',
      totalStaked: '2,450,000 CFISH',
      myStaked: '5,000 CFISH',
      rewards: '125.5 CFISH',
      lockPeriod: '30 days',
      minStake: '100 CFISH'
    },
    {
      id: 'pool2',
      name: 'NFT Rewards Pool',
      apy: '18.2%',
      totalStaked: '1,200,000 CFISH',
      myStaked: '2,500 CFISH',
      rewards: '89.3 CFISH',
      lockPeriod: '90 days',
      minStake: '500 CFISH'
    },
    {
      id: 'pool3',
      name: 'Governance Pool',
      apy: '8.7%',
      totalStaked: '3,100,000 CFISH',
      myStaked: '0 CFISH',
      rewards: '0 CFISH',
      lockPeriod: '180 days',
      minStake: '1,000 CFISH'
    }
  ];

  const proposals = [
    {
      id: 1,
      title: 'Reduce Platform Transaction Fees',
      description: 'Proposal to reduce platform transaction fees from 2% to 1.5% to increase trading volume',
      status: 'active',
      votesFor: 1250000,
      votesAgainst: 340000,
      totalVotes: 1590000,
      quorum: 2000000,
      endDate: '2025-02-15',
      myVote: null,
      category: 'Economic'
    },
    {
      id: 2,
      title: 'Add New NFT Categories',
      description: 'Add support for new NFT categories including Virtual Real Estate and Domain Names',
      status: 'active',
      votesFor: 890000,
      votesAgainst: 120000,
      totalVotes: 1010000,
      quorum: 1500000,
      endDate: '2025-02-20',
      myVote: 'for',
      category: 'Feature'
    },
    {
      id: 3,
      title: 'Implement Cross-Chain Bridge',
      description: 'Develop cross-chain bridge to support Ethereum and Polygon NFTs',
      status: 'passed',
      votesFor: 2100000,
      votesAgainst: 450000,
      totalVotes: 2550000,
      quorum: 2000000,
      endDate: '2025-01-30',
      myVote: 'for',
      category: 'Technical'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-primary/20 text-primary';
      case 'passed': return 'bg-green-500/20 text-green-400';
      case 'rejected': return 'bg-red-500/20 text-red-400';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400';
      default: return 'bg-muted/20 text-muted-foreground';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Economic': return 'bg-blue-500/20 text-blue-400';
      case 'Feature': return 'bg-purple-500/20 text-purple-400';
      case 'Technical': return 'bg-orange-500/20 text-orange-400';
      default: return 'bg-muted/20 text-muted-foreground';
    }
  };

  const handleStake = () => {
    if (!stakingAmount || parseFloat(stakingAmount) <= 0) return;
    // Handle staking logic
    console.log(`Staking ${stakingAmount} CFISH in ${selectedPool}`);
    setStakingAmount('');
  };

  const handleVote = (proposalId, vote) => {
    console.log(`Voting ${vote} on proposal ${proposalId}`);
  };

  return (
    <div className="fullscreen-layout pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-responsive-xl font-bold text-foreground mb-2">
            Staking & Governance
          </h1>
          <p className="text-muted-foreground">
            Stake CFISH tokens to earn rewards and participate in platform governance
          </p>
        </div>

        <Tabs defaultValue="staking" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="staking">Staking</TabsTrigger>
            <TabsTrigger value="governance">Governance</TabsTrigger>
          </TabsList>

          {/* Staking Tab */}
          <TabsContent value="staking" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Staking Overview */}
              <div className="lg:col-span-2 space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                          <Coins className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Total Staked</p>
                          <p className="text-xl font-bold text-foreground">7,500 CFISH</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                          <TrendingUp className="h-5 w-5 text-accent" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Total Rewards</p>
                          <p className="text-xl font-bold text-foreground">214.8 CFISH</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                          <Award className="h-5 w-5 text-green-400" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Avg APY</p>
                          <p className="text-xl font-bold text-foreground">13.1%</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Staking Pools */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="h-5 w-5" />
                      Staking Pools
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {stakingPools.map((pool) => (
                      <div 
                        key={pool.id} 
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedPool === pool.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => setSelectedPool(pool.id)}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-foreground">{pool.name}</h3>
                            <p className="text-sm text-muted-foreground">Lock period: {pool.lockPeriod}</p>
                          </div>
                          <Badge className="bg-accent/20 text-accent">
                            {pool.apy} APY
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Total Staked</p>
                            <p className="font-medium text-foreground">{pool.totalStaked}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">My Staked</p>
                            <p className="font-medium text-foreground">{pool.myStaked}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">My Rewards</p>
                            <p className="font-medium text-primary">{pool.rewards}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Min Stake</p>
                            <p className="font-medium text-foreground">{pool.minStake}</p>
                          </div>
                        </div>

                        {pool.myStaked !== '0 CFISH' && (
                          <div className="mt-3 pt-3 border-t border-border">
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <Plus className="h-4 w-4 mr-1" />
                                Add More
                              </Button>
                              <Button size="sm" variant="outline">
                                <Unlock className="h-4 w-4 mr-1" />
                                Claim Rewards
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Staking Actions */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Stake CFISH</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="amount">Amount to Stake</Label>
                      <div className="relative mt-1">
                        <Input
                          id="amount"
                          type="number"
                          placeholder="0.00"
                          value={stakingAmount}
                          onChange={(e) => setStakingAmount(e.target.value)}
                          className="pr-16"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                          CFISH
                        </div>
                      </div>
                    </div>

                    <div className="text-sm text-muted-foreground">
                      <p>Available: 15,230 CFISH</p>
                      <p>Selected Pool: {stakingPools.find(p => p.id === selectedPool)?.name}</p>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setStakingAmount('1000')}
                      >
                        1K
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setStakingAmount('5000')}
                      >
                        5K
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setStakingAmount('15230')}
                      >
                        Max
                      </Button>
                    </div>

                    <Button 
                      className="w-full btn-primary" 
                      onClick={handleStake}
                      disabled={!stakingAmount || parseFloat(stakingAmount) <= 0}
                    >
                      <Lock className="h-4 w-4 mr-2" />
                      Stake CFISH
                    </Button>
                  </CardContent>
                </Card>

                {/* Rewards Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      Rewards Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Pending Rewards</span>
                        <span className="font-medium text-primary">214.8 CFISH</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Claimed This Month</span>
                        <span className="font-medium text-foreground">89.2 CFISH</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Claimed</span>
                        <span className="font-medium text-foreground">1,245.7 CFISH</span>
                      </div>
                    </div>

                    <Separator />

                    <Button className="w-full btn-primary">
                      <Award className="h-4 w-4 mr-2" />
                      Claim All Rewards
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Governance Tab */}
          <TabsContent value="governance" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Governance Overview */}
              <div className="lg:col-span-2 space-y-6">
                {/* Governance Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                          <Vote className="h-5 w-5 text-blue-400" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Voting Power</p>
                          <p className="text-xl font-bold text-foreground">7,500</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                          <Target className="h-5 w-5 text-purple-400" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Active Proposals</p>
                          <p className="text-xl font-bold text-foreground">2</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-5 w-5 text-green-400" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Votes Cast</p>
                          <p className="text-xl font-bold text-foreground">15</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
                          <BarChart3 className="h-5 w-5 text-orange-400" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Participation</p>
                          <p className="text-xl font-bold text-foreground">87%</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Proposals List */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Vote className="h-5 w-5" />
                      Governance Proposals
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {proposals.map((proposal) => (
                      <div key={proposal.id} className="p-4 border border-border rounded-lg">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-foreground">{proposal.title}</h3>
                              <Badge className={getStatusColor(proposal.status)}>
                                {proposal.status}
                              </Badge>
                              <Badge className={getCategoryColor(proposal.category)}>
                                {proposal.category}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                              {proposal.description}
                            </p>
                          </div>
                        </div>

                        {/* Voting Progress */}
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="text-muted-foreground">
                              {proposal.totalVotes.toLocaleString()} / {proposal.quorum.toLocaleString()} votes
                            </span>
                          </div>
                          <Progress 
                            value={(proposal.totalVotes / proposal.quorum) * 100} 
                            className="h-2"
                          />
                          
                          <div className="flex justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-primary rounded-full"></div>
                              <span className="text-muted-foreground">
                                For: {proposal.votesFor.toLocaleString()} ({((proposal.votesFor / proposal.totalVotes) * 100).toFixed(1)}%)
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                              <span className="text-muted-foreground">
                                Against: {proposal.votesAgainst.toLocaleString()} ({((proposal.votesAgainst / proposal.totalVotes) * 100).toFixed(1)}%)
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>Ends: {new Date(proposal.endDate).toLocaleDateString()}</span>
                          </div>
                          
                          {proposal.status === 'active' && (
                            <div className="flex gap-2">
                              {proposal.myVote ? (
                                <Badge variant="outline">
                                  Voted: {proposal.myVote}
                                </Badge>
                              ) : (
                                <>
                                  <Button 
                                    size="sm" 
                                    className="btn-primary"
                                    onClick={() => handleVote(proposal.id, 'for')}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Vote For
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => handleVote(proposal.id, 'against')}
                                  >
                                    <XCircle className="h-4 w-4 mr-1" />
                                    Vote Against
                                  </Button>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Governance Info */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Governance Power</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary mb-2">7,500</div>
                      <p className="text-sm text-muted-foreground">Voting Power</p>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">From Staking</span>
                        <span className="font-medium text-foreground">7,500</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">From NFT Holdings</span>
                        <span className="font-medium text-foreground">0</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Delegation Received</span>
                        <span className="font-medium text-foreground">0</span>
                      </div>
                    </div>

                    <Button variant="outline" className="w-full">
                      <Users className="h-4 w-4 mr-2" />
                      Delegate Votes
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Governance Guide</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-primary">1</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">Stake CFISH</p>
                          <p className="text-xs text-muted-foreground">Staked tokens give you voting power</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-primary">2</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">Review Proposals</p>
                          <p className="text-xs text-muted-foreground">Read and understand each proposal</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-primary">3</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">Cast Your Vote</p>
                          <p className="text-xs text-muted-foreground">Vote for or against proposals</p>
                        </div>
                      </div>
                    </div>

                    <Button variant="outline" className="w-full">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StakingGovernancePage;

