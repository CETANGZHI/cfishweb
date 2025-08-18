import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Code, 
  Zap, 
  Shield, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  ExternalLink 
} from 'lucide-react';

const SmartContractIntegration = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);

  // 模拟智能合约数据
  const mockContracts = [
    {
      id: 'nft-marketplace',
      name: 'NFT Marketplace',
      address: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
      type: 'Marketplace',
      status: 'active',
      version: '1.2.0',
      deployedAt: '2024-01-15',
      transactions: 15420,
      volume: 2847.5,
      fees: 142.4,
      description: '主要的NFT交易市场合约，处理买卖、拍卖等功能'
    },
    {
      id: 'cfish-token',
      name: 'CFISH Token',
      address: 'CFiSH1234567890abcdefghijklmnopqrstuvwxyz',
      type: 'Token',
      status: 'active',
      version: '1.0.0',
      deployedAt: '2024-01-10',
      transactions: 8932,
      volume: 1245.8,
      fees: 62.3,
      description: 'CFISH平台的原生代币合约'
    },
    {
      id: 'staking-pool',
      name: 'Staking Pool',
      address: 'STK9876543210zyxwvutsrqponmlkjihgfedcba',
      type: 'Staking',
      status: 'active',
      version: '1.1.0',
      deployedAt: '2024-01-20',
      transactions: 3456,
      volume: 892.1,
      fees: 44.6,
      description: '质押池合约，用户可以质押CFISH代币获得奖励'
    },
    {
      id: 'governance',
      name: 'Governance',
      address: 'GOV5555666677778888999900001111222233334444',
      type: 'Governance',
      status: 'pending',
      version: '1.0.0-beta',
      deployedAt: '2024-02-01',
      transactions: 234,
      volume: 45.2,
      fees: 2.3,
      description: '治理合约，用于社区投票和提案管理'
    }
  ];

  // 合约函数列表
  const contractFunctions = {
    'nft-marketplace': [
      { name: 'listNFT', description: '上架NFT', gasEstimate: 0.001 },
      { name: 'buyNFT', description: '购买NFT', gasEstimate: 0.002 },
      { name: 'cancelListing', description: '取消上架', gasEstimate: 0.0005 },
      { name: 'makeOffer', description: '出价', gasEstimate: 0.0015 },
      { name: 'acceptOffer', description: '接受出价', gasEstimate: 0.002 }
    ],
    'cfish-token': [
      { name: 'transfer', description: '转账', gasEstimate: 0.0005 },
      { name: 'approve', description: '授权', gasEstimate: 0.0003 },
      { name: 'mint', description: '铸造', gasEstimate: 0.001 },
      { name: 'burn', description: '销毁', gasEstimate: 0.0008 }
    ],
    'staking-pool': [
      { name: 'stake', description: '质押', gasEstimate: 0.002 },
      { name: 'unstake', description: '解除质押', gasEstimate: 0.0025 },
      { name: 'claimRewards', description: '领取奖励', gasEstimate: 0.0015 },
      { name: 'compound', description: '复投', gasEstimate: 0.003 }
    ],
    'governance': [
      { name: 'createProposal', description: '创建提案', gasEstimate: 0.005 },
      { name: 'vote', description: '投票', gasEstimate: 0.001 },
      { name: 'executeProposal', description: '执行提案', gasEstimate: 0.003 }
    ]
  };

  useEffect(() => {
    setLoading(true);
    // 模拟加载合约数据
    setTimeout(() => {
      setContracts(mockContracts);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'inactive': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return '运行中';
      case 'pending': return '待部署';
      case 'inactive': return '已停用';
      default: return '未知';
    }
  };

  const executeFunction = async (contractId, functionName) => {
    setLoading(true);
    // 模拟合约调用
    setTimeout(() => {
      alert(`执行合约函数: ${functionName}`);
      setLoading(false);
    }, 2000);
  };

  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">智能合约集成</h2>
          <p className="text-gray-600">管理和监控CFISH平台的智能合约</p>
        </div>
        <Button>
          <Code className="h-4 w-4 mr-2" />
          部署新合约
        </Button>
      </div>

      {/* 合约概览 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-500" />
              <div>
                <div className="text-sm text-gray-500">活跃合约</div>
                <div className="text-2xl font-bold">{contracts.filter(c => c.status === 'active').length}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              <div>
                <div className="text-sm text-gray-500">总交易数</div>
                <div className="text-2xl font-bold">{contracts.reduce((sum, c) => sum + c.transactions, 0).toLocaleString()}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <div>
                <div className="text-sm text-gray-500">总交易量</div>
                <div className="text-2xl font-bold">{contracts.reduce((sum, c) => sum + c.volume, 0).toFixed(1)} SOL</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-purple-500" />
              <div>
                <div className="text-sm text-gray-500">总手续费</div>
                <div className="text-2xl font-bold">{contracts.reduce((sum, c) => sum + c.fees, 0).toFixed(1)} SOL</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="contracts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="contracts">合约列表</TabsTrigger>
          <TabsTrigger value="functions">合约函数</TabsTrigger>
          <TabsTrigger value="monitoring">监控面板</TabsTrigger>
        </TabsList>

        <TabsContent value="contracts" className="space-y-4">
          <div className="grid gap-4">
            {contracts.map((contract) => (
              <Card key={contract.id} className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedContract(contract)}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(contract.status)}`}></div>
                      {contract.name}
                      <Badge variant="outline">{contract.type}</Badge>
                    </CardTitle>
                    <Badge variant={contract.status === 'active' ? 'default' : 'secondary'}>
                      {getStatusText(contract.status)}
                    </Badge>
                  </div>
                  <CardDescription>{contract.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-gray-500">地址</div>
                      <div className="font-mono">{formatAddress(contract.address)}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">版本</div>
                      <div>{contract.version}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">交易数</div>
                      <div>{contract.transactions.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">交易量</div>
                      <div>{contract.volume.toFixed(1)} SOL</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="functions" className="space-y-4">
          {selectedContract ? (
            <Card>
              <CardHeader>
                <CardTitle>{selectedContract.name} - 合约函数</CardTitle>
                <CardDescription>
                  合约地址: {selectedContract.address}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {contractFunctions[selectedContract.id]?.map((func, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{func.name}</div>
                        <div className="text-sm text-gray-500">{func.description}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-sm text-gray-500">
                          Gas: {func.gasEstimate} SOL
                        </div>
                        <Button 
                          size="sm"
                          onClick={() => executeFunction(selectedContract.id, func.name)}
                          disabled={loading}
                        >
                          执行
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-gray-500">请先选择一个合约查看其函数</div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>合约健康状态</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contracts.map((contract) => (
                    <div key={contract.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(contract.status)}`}></div>
                        <span>{contract.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {contract.status === 'active' ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        )}
                        <Progress value={contract.status === 'active' ? 100 : 60} className="w-20" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>实时统计</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500">今日交易数</div>
                    <div className="text-2xl font-bold">1,234</div>
                  </div>
                  <div>
                    <div className="text-gray-500">今日交易量</div>
                    <div className="text-2xl font-bold">456.7 SOL</div>
                  </div>
                  <div>
                    <div className="text-gray-500">平均Gas费</div>
                    <div className="text-2xl font-bold">0.0015 SOL</div>
                  </div>
                  <div>
                    <div className="text-gray-500">成功率</div>
                    <div className="text-2xl font-bold">99.8%</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SmartContractIntegration;

