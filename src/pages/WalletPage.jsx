import React, { useState } from 'react';
import { 
  Wallet,
  Plus,
  Send,
  Download,
  ArrowUpRight,
  ArrowDownLeft,
  Copy,
  ExternalLink,
  Eye,
  EyeOff,
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Coins,
  DollarSign,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Settings,
  History,
  QrCode,
  Smartphone,
  CreditCard,
  Banknote,
  Zap,
  Lock,
  Unlock,
  Star,
  Filter,
  Search,
  Calendar,
  MoreVertical,
  Info,
  Globe,
  Layers,
  Target,
  Award
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Input } from '../components/ui/input';
import { Progress } from '../components/ui/progress';
import '../App.css';

const WalletPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showBalance, setShowBalance] = useState(true);
  const [selectedWallet, setSelectedWallet] = useState('phantom');

  // Mock wallet data
  const wallets = [
    {
      id: 'phantom',
      name: 'Phantom',
      icon: '👻',
      address: 'A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0',
      balance: {
        sol: 12.45,
        cfish: 2847.32,
        usd: 623.45
      },
      connected: true,
      type: 'Hot Wallet'
    },
    {
      id: 'solflare',
      name: 'Solflare',
      icon: '🔥',
      address: 'B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1',
      balance: {
        sol: 5.23,
        cfish: 1234.56,
        usd: 267.89
      },
      connected: false,
      type: 'Hot Wallet'
    },
    {
      id: 'ledger',
      name: 'Ledger',
      icon: '🔒',
      address: 'C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2',
      balance: {
        sol: 25.67,
        cfish: 5678.90,
        usd: 1289.34
      },
      connected: true,
      type: 'Hardware Wallet'
    }
  ];

  // Mock transaction history
  const transactions = [
    {
      id: 1,
      type: 'receive',
      amount: '2.5 SOL',
      usdValue: '$125.00',
      from: 'NFT Sale',
      to: 'Your Wallet',
      timestamp: '2025-01-16 10:30:00',
      status: 'completed',
      txHash: '5KJhF8...',
      fee: '0.00025 SOL'
    },
    {
      id: 2,
      type: 'send',
      amount: '150 CFISH',
      usdValue: '$75.00',
      from: 'Your Wallet',
      to: 'Staking Pool',
      timestamp: '2025-01-16 09:15:00',
      status: 'completed',
      txHash: '3GhD9k...',
      fee: '0 CFISH'
    },
    {
      id: 3,
      type: 'receive',
      amount: '45 CFISH',
      usdValue: '$22.50',
      from: 'Staking Rewards',
      to: 'Your Wallet',
      timestamp: '2025-01-16 08:00:00',
      status: 'completed',
      txHash: '7MnB2x...',
      fee: '0 CFISH'
    },
    {
      id: 4,
      type: 'send',
      amount: '1.2 SOL',
      usdValue: '$60.00',
      from: 'Your Wallet',
      to: 'NFT Purchase',
      timestamp: '2025-01-15 16:45:00',
      status: 'pending',
      txHash: '9QwE4r...',
      fee: '0.00025 SOL'
    },
    {
      id: 5,
      type: 'receive',
      amount: '3.8 SOL',
      usdValue: '$190.00',
      from: 'Barter Trade',
      to: 'Your Wallet',
      timestamp: '2025-01-15 14:20:00',
      status: 'completed',
      txHash: '2AsD7f...',
      fee: '0 SOL'
    }
  ];

  // Mock portfolio data
  const portfolio = [
    {
      token: 'SOL',
      name: 'Solana',
      icon: '◎',
      balance: 43.35,
      usdValue: 2167.50,
      change24h: 5.67,
      percentage: 65.2
    },
    {
      token: 'CFISH',
      name: 'CFISH Token',
      icon: '🐟',
      balance: 9760.78,
      usdValue: 976.08,
      change24h: -2.34,
      percentage: 29.4
    },
    {
      token: 'USDC',
      name: 'USD Coin',
      icon: '💵',
      balance: 180.00,
      usdValue: 180.00,
      change24h: 0.01,
      percentage: 5.4
    }
  ];

  // Mock staking data
  const stakingPools = [
    {
      id: 1,
      name: 'CFISH Staking Pool',
      apy: 15.2,
      staked: 2500,
      rewards: 45.67,
      lockPeriod: '30 days',
      status: 'active'
    },
    {
      id: 2,
      name: 'SOL Validator',
      apy: 6.8,
      staked: 10.5,
      rewards: 0.234,
      lockPeriod: 'Flexible',
      status: 'active'
    }
  ];

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'send': return <ArrowUpRight className="h-4 w-4 text-red-400" />;
      case 'receive': return <ArrowDownLeft className="h-4 w-4 text-green-400" />;
      default: return <RefreshCw className="h-4 w-4 text-blue-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-400';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400';
      case 'failed': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'failed': return <XCircle className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  };

  const WalletCard = ({ wallet }) => (
    <Card className={`wallet-card cursor-pointer transition-all ${
      selectedWallet === wallet.id ? 'ring-2 ring-primary' : 'hover:border-primary/50'
    }`} onClick={() => setSelectedWallet(wallet.id)}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{wallet.icon}</div>
            <div>
              <h3 className="font-semibold text-foreground">{wallet.name}</h3>
              <p className="text-sm text-muted-foreground">{wallet.type}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {wallet.connected ? (
              <Badge className="bg-green-500/20 text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
                Connected
              </Badge>
            ) : (
              <Badge variant="outline">Disconnected</Badge>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Address:</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono text-foreground">{formatAddress(wallet.address)}</span>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>
          
          {wallet.connected && (
            <div className="pt-2 border-t border-border">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-muted-foreground">Total Balance:</span>
                <span className="text-sm font-semibold text-foreground">${wallet.balance.usd}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{wallet.balance.sol} SOL</span>
                <span>{wallet.balance.cfish} CFISH</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const TransactionRow = ({ transaction }) => (
    <div className="flex items-center gap-4 p-4 border border-border rounded-lg hover:bg-secondary/10 transition-colors">
      <div className="h-10 w-10 bg-secondary/20 rounded-full flex items-center justify-center">
        {getTransactionIcon(transaction.type)}
      </div>
      
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-foreground">
            {transaction.type === 'send' ? transaction.to : transaction.from}
          </h3>
          <div className="text-right">
            <p className="font-semibold text-foreground">
              {transaction.type === 'send' ? '-' : '+'}{transaction.amount}
            </p>
            <p className="text-sm text-muted-foreground">{transaction.usdValue}</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{transaction.timestamp}</span>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(transaction.status)}>
              {getStatusIcon(transaction.status)}
              <span className="ml-1 capitalize">{transaction.status}</span>
            </Badge>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fullscreen-layout pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-responsive-xl font-bold text-foreground mb-2">
                Wallet Management
              </h1>
              <p className="text-muted-foreground">
                Manage your crypto assets, view transactions, and connect wallets
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <QrCode className="h-4 w-4 mr-2" />
                Receive
              </Button>
              <Button className="btn-primary">
                <Send className="h-4 w-4 mr-2" />
                Send
              </Button>
            </div>
          </div>
        </div>

        {/* Portfolio Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Balance</p>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold text-foreground">
                      {showBalance ? '$3,323.58' : '••••••'}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => setShowBalance(!showBalance)}
                    >
                      {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="text-sm text-green-400 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    +5.67% (24h)
                  </p>
                </div>
                <div className="h-12 w-12 bg-primary/20 rounded-full flex items-center justify-center">
                  <Wallet className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">SOL Balance</p>
                  <p className="text-2xl font-bold text-foreground">43.35</p>
                  <p className="text-sm text-muted-foreground">$2,167.50</p>
                </div>
                <div className="h-12 w-12 bg-accent/20 rounded-full flex items-center justify-center">
                  <span className="text-xl">◎</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">CFISH Balance</p>
                  <p className="text-2xl font-bold text-foreground">9,760</p>
                  <p className="text-sm text-muted-foreground">$976.08</p>
                </div>
                <div className="h-12 w-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <span className="text-xl">🐟</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Staking Rewards</p>
                  <p className="text-2xl font-bold text-foreground">45.90</p>
                  <p className="text-sm text-green-400 flex items-center gap-1">
                    <Zap className="h-3 w-3" />
                    15.2% APY
                  </p>
                </div>
                <div className="h-12 w-12 bg-green-500/20 rounded-full flex items-center justify-center">
                  <Coins className="h-6 w-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="wallets">Wallets</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="staking">Staking</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Portfolio Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layers className="h-5 w-5" />
                    Portfolio Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {portfolio.map((asset, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{asset.icon}</span>
                          <div>
                            <p className="font-semibold text-foreground">{asset.token}</p>
                            <p className="text-sm text-muted-foreground">{asset.name}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-foreground">${asset.usdValue.toLocaleString()}</p>
                          <p className={`text-sm flex items-center gap-1 ${
                            asset.change24h >= 0 ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {asset.change24h >= 0 ? (
                              <TrendingUp className="h-3 w-3" />
                            ) : (
                              <TrendingDown className="h-3 w-3" />
                            )}
                            {Math.abs(asset.change24h)}%
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={asset.percentage} className="flex-1" />
                        <span className="text-sm text-muted-foreground">{asset.percentage}%</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{asset.balance.toLocaleString()} {asset.token}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Transactions */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <History className="h-5 w-5" />
                      Recent Transactions
                    </CardTitle>
                    <Button variant="outline" size="sm">
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {transactions.slice(0, 5).map((transaction) => (
                    <div key={transaction.id} className="flex items-center gap-3 p-3 border border-border rounded-lg">
                      <div className="h-8 w-8 bg-secondary/20 rounded-full flex items-center justify-center">
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground text-sm">
                          {transaction.type === 'send' ? transaction.to : transaction.from}
                        </p>
                        <p className="text-xs text-muted-foreground">{transaction.timestamp.split(' ')[0]}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground text-sm">
                          {transaction.type === 'send' ? '-' : '+'}{transaction.amount}
                        </p>
                        <Badge className={getStatusColor(transaction.status)} size="sm">
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-20 flex-col gap-2">
                    <Send className="h-6 w-6" />
                    <span>Send</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2">
                    <Download className="h-6 w-6" />
                    <span>Receive</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2">
                    <RefreshCw className="h-6 w-6" />
                    <span>Swap</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2">
                    <Coins className="h-6 w-6" />
                    <span>Stake</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Wallets Tab */}
          <TabsContent value="wallets" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Connected Wallets</h2>
              <Button className="btn-primary">
                <Plus className="h-4 w-4 mr-2" />
                Connect Wallet
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wallets.map((wallet) => (
                <WalletCard key={wallet.id} wallet={wallet} />
              ))}
            </div>

            {/* Wallet Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Wallet Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-16 flex-col gap-2">
                    <Smartphone className="h-6 w-6" />
                    <span>Mobile Wallet</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex-col gap-2">
                    <CreditCard className="h-6 w-6" />
                    <span>Hardware Wallet</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex-col gap-2">
                    <Globe className="h-6 w-6" />
                    <span>Web Wallet</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-6">
            {/* Transaction Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Input placeholder="Search transactions..." className="flex-1" />
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-1" />
                      Filter
                    </Button>
                    <Button variant="outline" size="sm">
                      <Calendar className="h-4 w-4 mr-1" />
                      Date Range
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Transaction List */}
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <TransactionRow key={transaction.id} transaction={transaction} />
              ))}
            </div>

            {/* Load More */}
            <div className="text-center">
              <Button variant="outline">
                Load More Transactions
              </Button>
            </div>
          </TabsContent>

          {/* Staking Tab */}
          <TabsContent value="staking" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Active Stakes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Coins className="h-5 w-5" />
                    Active Stakes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {stakingPools.map((pool) => (
                    <div key={pool.id} className="border border-border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-foreground">{pool.name}</h3>
                        <Badge className="bg-green-500/20 text-green-400">
                          {pool.apy}% APY
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Staked:</span>
                          <span className="text-foreground font-medium">{pool.staked} {pool.name.includes('CFISH') ? 'CFISH' : 'SOL'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Rewards:</span>
                          <span className="text-green-400 font-medium">+{pool.rewards} {pool.name.includes('CFISH') ? 'CFISH' : 'SOL'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Lock Period:</span>
                          <span className="text-foreground">{pool.lockPeriod}</span>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button size="sm" variant="outline" className="flex-1">
                          Claim Rewards
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          Unstake
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Staking Opportunities */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Staking Opportunities
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-foreground">CFISH Governance Pool</h3>
                      <Badge className="bg-yellow-500/20 text-yellow-400">
                        18.5% APY
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Min Stake:</span>
                        <span className="text-foreground">100 CFISH</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Lock Period:</span>
                        <span className="text-foreground">90 days</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Rewards:</span>
                        <span className="text-foreground">CFISH + Governance Rights</span>
                      </div>
                    </div>

                    <Button className="btn-primary w-full">
                      Stake Now
                    </Button>
                  </div>

                  <div className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-foreground">SOL Liquid Staking</h3>
                      <Badge className="bg-blue-500/20 text-blue-400">
                        7.2% APY
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Min Stake:</span>
                        <span className="text-foreground">0.1 SOL</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Lock Period:</span>
                        <span className="text-foreground">Flexible</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Rewards:</span>
                        <span className="text-foreground">SOL</span>
                      </div>
                    </div>

                    <Button variant="outline" className="w-full">
                      Stake SOL
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Security Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Security Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                      <span className="text-foreground">Two-Factor Authentication</span>
                    </div>
                    <Badge className="bg-green-500/20 text-green-400">Enabled</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                      <span className="text-foreground">Hardware Wallet</span>
                    </div>
                    <Badge className="bg-green-500/20 text-green-400">Connected</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-400" />
                      <span className="text-foreground">Backup Phrase</span>
                    </div>
                    <Badge className="bg-yellow-500/20 text-yellow-400">Verify</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                      <XCircle className="h-5 w-5 text-red-400" />
                      <span className="text-foreground">Email Verification</span>
                    </div>
                    <Badge className="bg-red-500/20 text-red-400">Pending</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Security Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Security Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Lock className="h-4 w-4 mr-2" />
                    Change Password
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start">
                    <Smartphone className="h-4 w-4 mr-2" />
                    Setup 2FA
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start">
                    <Eye className="h-4 w-4 mr-2" />
                    Backup Seed Phrase
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start">
                    <Globe className="h-4 w-4 mr-2" />
                    Trusted Devices
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start">
                    <History className="h-4 w-4 mr-2" />
                    Login History
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start text-red-400 hover:text-red-300">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Revoke All Sessions
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Security Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Security Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border border-border rounded-lg">
                    <h3 className="font-semibold text-foreground mb-2">Use Hardware Wallets</h3>
                    <p className="text-sm text-muted-foreground">
                      Store large amounts in hardware wallets for maximum security.
                    </p>
                  </div>
                  
                  <div className="p-4 border border-border rounded-lg">
                    <h3 className="font-semibold text-foreground mb-2">Enable 2FA</h3>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security with two-factor authentication.
                    </p>
                  </div>
                  
                  <div className="p-4 border border-border rounded-lg">
                    <h3 className="font-semibold text-foreground mb-2">Backup Seed Phrase</h3>
                    <p className="text-sm text-muted-foreground">
                      Keep your seed phrase safe and never share it with anyone.
                    </p>
                  </div>
                  
                  <div className="p-4 border border-border rounded-lg">
                    <h3 className="font-semibold text-foreground mb-2">Verify Transactions</h3>
                    <p className="text-sm text-muted-foreground">
                      Always double-check transaction details before confirming.
                    </p>
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

export default WalletPage;

