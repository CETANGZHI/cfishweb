import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Wallet, Check, AlertCircle, ExternalLink } from 'lucide-react';

const WalletConnection = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [balance, setBalance] = useState(0);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');

  // 支持的钱包列表
  const supportedWallets = [
    {
      name: 'Phantom',
      icon: '👻',
      description: '最受欢迎的Solana钱包',
      installed: typeof window !== 'undefined' && window.solana?.isPhantom,
      downloadUrl: 'https://phantom.app/'
    },
    {
      name: 'Solflare',
      icon: '🔥',
      description: '功能丰富的Solana钱包',
      installed: typeof window !== 'undefined' && window.solflare,
      downloadUrl: 'https://solflare.com/'
    },
    {
      name: 'Backpack',
      icon: '🎒',
      description: '新一代多链钱包',
      installed: typeof window !== 'undefined' && window.backpack,
      downloadUrl: 'https://backpack.app/'
    }
  ];

  // 连接钱包
  const connectWallet = async (walletName) => {
    setIsConnecting(true);
    setError('');

    try {
      let provider;
      
      switch (walletName) {
        case 'Phantom':
          if (window.solana?.isPhantom) {
            provider = window.solana;
          }
          break;
        case 'Solflare':
          if (window.solflare) {
            provider = window.solflare;
          }
          break;
        case 'Backpack':
          if (window.backpack) {
            provider = window.backpack;
          }
          break;
        default:
          throw new Error('不支持的钱包');
      }

      if (!provider) {
        throw new Error(`${walletName} 钱包未安装`);
      }

      // 请求连接
      const response = await provider.connect();
      const publicKey = response.publicKey.toString();
      
      setWalletAddress(publicKey);
      setIsConnected(true);
      
      // 模拟获取余额
      setBalance(Math.random() * 100);
      
      // 保存连接状态
      localStorage.setItem('walletConnected', 'true');
      localStorage.setItem('walletAddress', publicKey);
      localStorage.setItem('walletType', walletName);
      
    } catch (err) {
      setError(err.message || '连接钱包失败');
    } finally {
      setIsConnecting(false);
    }
  };

  // 断开连接
  const disconnectWallet = () => {
    setIsConnected(false);
    setWalletAddress('');
    setBalance(0);
    localStorage.removeItem('walletConnected');
    localStorage.removeItem('walletAddress');
    localStorage.removeItem('walletType');
  };

  // 检查已连接的钱包
  useEffect(() => {
    const connected = localStorage.getItem('walletConnected');
    const address = localStorage.getItem('walletAddress');
    
    if (connected && address) {
      setIsConnected(true);
      setWalletAddress(address);
      setBalance(Math.random() * 100);
    }
  }, []);

  // 格式化地址
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  if (isConnected) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Check className="h-5 w-5 text-green-500" />
            钱包已连接
          </CardTitle>
          <CardDescription>
            您的钱包已成功连接到CFISH平台
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">地址:</span>
              <Badge variant="outline">{formatAddress(walletAddress)}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">余额:</span>
              <span className="font-medium">{balance.toFixed(2)} SOL</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigator.clipboard.writeText(walletAddress)}
            >
              复制地址
            </Button>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={disconnectWallet}
            >
              断开连接
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          连接钱包
        </CardTitle>
        <CardDescription>
          选择一个钱包来连接到CFISH平台
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
        )}
        
        <div className="space-y-2">
          {supportedWallets.map((wallet) => (
            <div key={wallet.name} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{wallet.icon}</span>
                <div>
                  <div className="font-medium">{wallet.name}</div>
                  <div className="text-sm text-gray-500">{wallet.description}</div>
                </div>
              </div>
              
              {wallet.installed ? (
                <Button
                  size="sm"
                  onClick={() => connectWallet(wallet.name)}
                  disabled={isConnecting}
                >
                  {isConnecting ? '连接中...' : '连接'}
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.open(wallet.downloadUrl, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  安装
                </Button>
              )}
            </div>
          ))}
        </div>
        
        <div className="text-xs text-gray-500 text-center">
          连接钱包即表示您同意我们的服务条款和隐私政策
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletConnection;

