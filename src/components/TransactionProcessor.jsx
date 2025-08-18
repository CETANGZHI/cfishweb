import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Send, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  ArrowUpRight,
  ArrowDownLeft,
  Repeat,
  ExternalLink,
  Filter
} from 'lucide-react';

const TransactionProcessor = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');

  // 模拟交易数据
  const mockTransactions = [
    {
      id: 'tx_001',
      hash: '5KJp9UYvtfM2aGzRjHqB8vN3xW7cD1eF6gH9iJ0kL2mN4oP5qR6sT7uV8wX9yZ0a',
      type: 'nft_purchase',
      status: 'confirmed',
      amount: 2.5,
      fee: 0.001,
      from: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
      to: 'CFiSH1234567890abcdefghijklmnopqrstuvwxyz',
      timestamp: new Date(Date.now() - 300000),
      confirmations: 32,
      blockHeight: 245678901,
      nftId: 'nft_001',
      nftName: 'Cosmic Fish #001'
    },
    {
      id: 'tx_002',
      hash: 'aB1cD2eF3gH4iJ5kL6mN7oP8qR9sT0uV1wX2yZ3a4B5c6D7e8F9g0H1i2J3k4L5m',
      type: 'token_transfer',
      status: 'pending',
      amount: 100,
      fee: 0.0005,
      from: 'CFiSH1234567890abcdefghijklmnopqrstuvwxyz',
      to: 'STK9876543210zyxwvutsrqponmlkjihgfedcba',
      timestamp: new Date(Date.now() - 120000),
      confirmations: 0,
      blockHeight: null
    },
    {
      id: 'tx_003',
      hash: 'mN6oP7qR8sT9uV0wX1yZ2a3B4c5D6e7F8g9H0i1J2k3L4m5N6o7P8q9R0s1T2u3V',
      type: 'staking',
      status: 'confirmed',
      amount: 500,
      fee: 0.002,
      from: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
      to: 'STK9876543210zyxwvutsrqponmlkjihgfedcba',
      timestamp: new Date(Date.now() - 1800000),
      confirmations: 156,
      blockHeight: 245678845
    },
    {
      id: 'tx_004',
      hash: 'vW4xY5zZ6a7B8c9D0e1F2g3H4i5J6k7L8m9N0o1P2q3R4s5T6u7V8w9X0y1Z2a3B',
      type: 'nft_mint',
      status: 'failed',
      amount: 0.1,
      fee: 0.001,
      from: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
      to: 'NFT9876543210zyxwvutsrqponmlkjihgfedcba',
      timestamp: new Date(Date.now() - 3600000),
      confirmations: 0,
      blockHeight: null,
      error: 'Insufficient balance for minting fee'
    }
  ];

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setTransactions(mockTransactions);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'nft_purchase':
      case 'nft_mint':
        return <ArrowDownLeft className="h-4 w-4 text-blue-500" />;
      case 'token_transfer':
        return <Send className="h-4 w-4 text-purple-500" />;
      case 'staking':
        return <Repeat className="h-4 w-4 text-green-500" />;
      default:
        return <ArrowUpRight className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTypeName = (type) => {
    switch (type) {
      case 'nft_purchase': return 'NFT购买';
      case 'nft_mint': return 'NFT铸造';
      case 'token_transfer': return '代币转账';
      case 'staking': return '质押';
      default: return '未知';
    }
  };

  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 60) {
      return `${minutes}分钟前`;
    } else {
      return `${hours}小时前`;
    }
  };

  const filteredTransactions = transactions.filter(tx => {
    if (filter === 'all') return true;
    return tx.status === filter;
  });

  const stats = {
    total: transactions.length,
    confirmed: transactions.filter(tx => tx.status === 'confirmed').length,
    pending: transactions.filter(tx => tx.status === 'pending').length,
    failed: transactions.filter(tx => tx.status === 'failed').length,
    totalVolume: transactions.reduce((sum, tx) => sum + tx.amount, 0),
    totalFees: transactions.reduce((sum, tx) => sum + tx.fee, 0)
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">交易处理</h2>
          <p className="text-gray-600">监控和管理区块链交易</p>
        </div>
        <Button>
          <Send className="h-4 w-4 mr-2" />
          发起交易
        </Button>
      </div>

      {/* 交易统计 */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm text-gray-500">总交易数</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.confirmed}</div>
              <div className="text-sm text-gray-500">已确认</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <div className="text-sm text-gray-500">待确认</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
              <div className="text-sm text-gray-500">失败</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.totalVolume.toFixed(1)}</div>
              <div className="text-sm text-gray-500">总交易量 (SOL)</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.totalFees.toFixed(4)}</div>
              <div className="text-sm text-gray-500">总手续费 (SOL)</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="recent" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="recent">最近交易</TabsTrigger>
            <TabsTrigger value="pending">待处理</TabsTrigger>
            <TabsTrigger value="analytics">分析</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="border rounded px-3 py-1 text-sm"
            >
              <option value="all">全部状态</option>
              <option value="confirmed">已确认</option>
              <option value="pending">待确认</option>
              <option value="failed">失败</option>
            </select>
          </div>
        </div>

        <TabsContent value="recent" className="space-y-4">
          <div className="space-y-3">
            {filteredTransactions.map((tx) => (
              <Card key={tx.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getTypeIcon(tx.type)}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{getTypeName(tx.type)}</span>
                          {tx.nftName && (
                            <Badge variant="outline" className="text-xs">
                              {tx.nftName}
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatAddress(tx.hash)} • {formatTime(tx.timestamp)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-medium">{tx.amount} SOL</div>
                        <div className="text-sm text-gray-500">手续费: {tx.fee} SOL</div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {getStatusIcon(tx.status)}
                        <Badge className={getStatusColor(tx.status)}>
                          {tx.status === 'confirmed' ? '已确认' : 
                           tx.status === 'pending' ? '待确认' : '失败'}
                        </Badge>
                      </div>
                      
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {tx.status === 'pending' && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span>确认进度</span>
                        <span>{tx.confirmations}/32</span>
                      </div>
                      <Progress value={(tx.confirmations / 32) * 100} className="h-2" />
                    </div>
                  )}
                  
                  {tx.error && (
                    <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                      错误: {tx.error}
                    </div>
                  )}
                  
                  <div className="mt-3 grid grid-cols-2 gap-4 text-sm text-gray-500">
                    <div>
                      <span>发送方: </span>
                      <span className="font-mono">{formatAddress(tx.from)}</span>
                    </div>
                    <div>
                      <span>接收方: </span>
                      <span className="font-mono">{formatAddress(tx.to)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <div className="space-y-3">
            {transactions.filter(tx => tx.status === 'pending').map((tx) => (
              <Card key={tx.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getTypeIcon(tx.type)}
                      <div>
                        <div className="font-medium">{getTypeName(tx.type)}</div>
                        <div className="text-sm text-gray-500">
                          {formatAddress(tx.hash)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-medium">{tx.amount} SOL</div>
                        <div className="text-sm text-gray-500">等待确认中...</div>
                      </div>
                      
                      <Button variant="outline" size="sm">
                        加速交易
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>预计完成时间</span>
                      <span>约 2-5 分钟</span>
                    </div>
                    <Progress value={30} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>交易成功率</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {((stats.confirmed / stats.total) * 100).toFixed(1)}%
                </div>
                <Progress value={(stats.confirmed / stats.total) * 100} className="mt-2" />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>平均确认时间</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">2.3 分钟</div>
                <div className="text-sm text-gray-500 mt-1">
                  比网络平均快 15%
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Gas费用优化</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">节省 23%</div>
                <div className="text-sm text-gray-500 mt-1">
                  智能Gas费用优化已为您节省 0.0045 SOL
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TransactionProcessor;

