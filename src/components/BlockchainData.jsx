import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  Users, 
  Coins, 
  BarChart3,
  RefreshCw,
  Clock,
  Database
} from 'lucide-react';

const BlockchainData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // 模拟区块链数据
  const mockData = {
    network: {
      name: 'Solana Mainnet',
      status: 'healthy',
      blockHeight: 245678901,
      tps: 2847,
      avgBlockTime: 0.4,
      totalValidators: 1456,
      activeValidators: 1398,
      networkLoad: 67
    },
    market: {
      solPrice: 98.45,
      solChange24h: 5.67,
      cfishPrice: 0.0234,
      cfishChange24h: -2.34,
      marketCap: 45678901,
      volume24h: 12345678,
      totalSupply: 1000000000,
      circulatingSupply: 750000000
    },
    platform: {
      totalNFTs: 156789,
      totalUsers: 45678,
      totalTransactions: 2345678,
      totalVolume: 987654.32,
      activeUsers24h: 3456,
      transactions24h: 12345,
      volume24h: 45678.90,
      avgTransactionFee: 0.00125
    },
    validators: [
      { name: 'Validator 1', stake: 1234567, commission: 5, status: 'active' },
      { name: 'Validator 2', stake: 987654, commission: 7, status: 'active' },
      { name: 'Validator 3', stake: 876543, commission: 6, status: 'delinquent' },
      { name: 'Validator 4', stake: 765432, commission: 8, status: 'active' },
      { name: 'Validator 5', stake: 654321, commission: 5, status: 'active' }
    ],
    recentBlocks: [
      { height: 245678901, time: new Date(Date.now() - 400), transactions: 2847, leader: 'Validator 1' },
      { height: 245678900, time: new Date(Date.now() - 800), transactions: 3156, leader: 'Validator 2' },
      { height: 245678899, time: new Date(Date.now() - 1200), transactions: 2934, leader: 'Validator 3' },
      { height: 245678898, time: new Date(Date.now() - 1600), transactions: 3421, leader: 'Validator 1' },
      { height: 245678897, time: new Date(Date.now() - 2000), transactions: 2756, leader: 'Validator 4' }
    ]
  };

  useEffect(() => {
    // 模拟数据加载
    const loadData = () => {
      setLoading(true);
      setTimeout(() => {
        setData(mockData);
        setLastUpdate(new Date());
        setLoading(false);
      }, 1000);
    };

    loadData();
    
    // 每30秒更新一次数据
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy':
      case 'active':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'error':
      case 'delinquent':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (loading || !data) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">区块链实时数据</h2>
            <p className="text-gray-600">监控Solana网络和CFISH平台数据</p>
          </div>
          <div className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span className="text-sm text-gray-500">加载中...</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">区块链实时数据</h2>
          <p className="text-gray-600">监控Solana网络和CFISH平台数据</p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${getStatusColor(data.network.status)}`}></div>
          <span className="text-sm text-gray-500">
            最后更新: {formatTime(lastUpdate)}
          </span>
        </div>
      </div>

      {/* 网络概览 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-500" />
              <div>
                <div className="text-sm text-gray-500">当前TPS</div>
                <div className="text-2xl font-bold">{data.network.tps.toLocaleString()}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-green-500" />
              <div>
                <div className="text-sm text-gray-500">区块高度</div>
                <div className="text-2xl font-bold">{formatNumber(data.network.blockHeight)}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-purple-500" />
              <div>
                <div className="text-sm text-gray-500">平均出块时间</div>
                <div className="text-2xl font-bold">{data.network.avgBlockTime}s</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-orange-500" />
              <div>
                <div className="text-sm text-gray-500">活跃验证者</div>
                <div className="text-2xl font-bold">{data.network.activeValidators}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="network" className="space-y-4">
        <TabsList>
          <TabsTrigger value="network">网络状态</TabsTrigger>
          <TabsTrigger value="market">市场数据</TabsTrigger>
          <TabsTrigger value="platform">平台统计</TabsTrigger>
          <TabsTrigger value="blocks">最新区块</TabsTrigger>
        </TabsList>

        <TabsContent value="network" className="space-y-4">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>网络健康状态</CardTitle>
                <CardDescription>Solana主网实时状态监控</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>网络负载</span>
                    <div className="flex items-center gap-2">
                      <Progress value={data.network.networkLoad} className="w-32" />
                      <span className="text-sm">{data.network.networkLoad}%</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span>验证者在线率</span>
                    <div className="flex items-center gap-2">
                      <Progress 
                        value={(data.network.activeValidators / data.network.totalValidators) * 100} 
                        className="w-32" 
                      />
                      <span className="text-sm">
                        {((data.network.activeValidators / data.network.totalValidators) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <div className="text-sm text-gray-500">总验证者数量</div>
                      <div className="text-xl font-bold">{data.network.totalValidators}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">活跃验证者</div>
                      <div className="text-xl font-bold text-green-600">{data.network.activeValidators}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>验证者列表</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.validators.map((validator, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(validator.status)}`}></div>
                        <div>
                          <div className="font-medium">{validator.name}</div>
                          <div className="text-sm text-gray-500">
                            质押: {formatNumber(validator.stake)} SOL
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm">佣金: {validator.commission}%</div>
                        <Badge variant={validator.status === 'active' ? 'default' : 'destructive'}>
                          {validator.status === 'active' ? '活跃' : '离线'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="market" className="space-y-4">
          <div className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Coins className="h-5 w-5" />
                    SOL 价格
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-3xl font-bold">${data.market.solPrice}</div>
                    <div className="flex items-center gap-2">
                      {data.market.solChange24h > 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      )}
                      <span className={`text-sm ${data.market.solChange24h > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {data.market.solChange24h > 0 ? '+' : ''}{data.market.solChange24h}% (24h)
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    CFISH 价格
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-3xl font-bold">${data.market.cfishPrice}</div>
                    <div className="flex items-center gap-2">
                      {data.market.cfishChange24h > 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      )}
                      <span className={`text-sm ${data.market.cfishChange24h > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {data.market.cfishChange24h > 0 ? '+' : ''}{data.market.cfishChange24h}% (24h)
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>市场统计</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">市值</div>
                    <div className="text-xl font-bold">${formatNumber(data.market.marketCap)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">24h交易量</div>
                    <div className="text-xl font-bold">${formatNumber(data.market.volume24h)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">总供应量</div>
                    <div className="text-xl font-bold">{formatNumber(data.market.totalSupply)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">流通供应量</div>
                    <div className="text-xl font-bold">{formatNumber(data.market.circulatingSupply)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="platform" className="space-y-4">
          <div className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{formatNumber(data.platform.totalNFTs)}</div>
                    <div className="text-sm text-gray-500">总NFT数量</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{formatNumber(data.platform.totalUsers)}</div>
                    <div className="text-sm text-gray-500">总用户数</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{formatNumber(data.platform.totalTransactions)}</div>
                    <div className="text-sm text-gray-500">总交易数</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{formatNumber(data.platform.totalVolume)} SOL</div>
                    <div className="text-sm text-gray-500">总交易量</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>24小时活动</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">活跃用户</div>
                    <div className="text-xl font-bold text-blue-600">{formatNumber(data.platform.activeUsers24h)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">交易数量</div>
                    <div className="text-xl font-bold text-green-600">{formatNumber(data.platform.transactions24h)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">交易量</div>
                    <div className="text-xl font-bold text-purple-600">{formatNumber(data.platform.volume24h)} SOL</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">平均手续费</div>
                    <div className="text-xl font-bold text-orange-600">{data.platform.avgTransactionFee} SOL</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="blocks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>最新区块</CardTitle>
              <CardDescription>实时区块信息</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.recentBlocks.map((block, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                      </div>
                      <div>
                        <div className="font-medium">区块 #{block.height}</div>
                        <div className="text-sm text-gray-500">
                          {formatTime(block.time)} • 验证者: {block.leader}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-medium">{block.transactions} 笔交易</div>
                      <div className="text-sm text-gray-500">
                        {((Date.now() - block.time) / 1000).toFixed(1)}s 前
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BlockchainData;

