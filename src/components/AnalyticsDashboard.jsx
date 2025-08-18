import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Eye, 
  Heart,
  ShoppingCart,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Award,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// 统计卡片组件
const StatCard = ({ title, value, change, changeType, icon: Icon, color = "blue" }) => {
  const colorClasses = {
    blue: "text-blue-500 bg-blue-500/10",
    green: "text-green-500 bg-green-500/10",
    purple: "text-purple-500 bg-purple-500/10",
    orange: "text-orange-500 bg-orange-500/10",
    red: "text-red-500 bg-red-500/10",
    teal: "text-teal-500 bg-teal-500/10"
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
            {change && (
              <div className="flex items-center mt-1">
                {changeType === 'increase' ? (
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm ${changeType === 'increase' ? 'text-green-500' : 'text-red-500'}`}>
                  {change}
                </span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-full ${colorClasses[color]}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// 主要分析仪表板组件
const AnalyticsDashboard = ({ userId = 'current-user', timeRange = '30d' }) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRange);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 模拟数据生成
  useEffect(() => {
    const generateMockData = () => {
      // 销售数据
      const salesData = Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        sales: Math.floor(Math.random() * 50) + 10,
        revenue: Math.floor(Math.random() * 1000) + 200,
        views: Math.floor(Math.random() * 500) + 100
      }));

      // NFT分类数据
      const categoryData = [
        { name: 'Digital Art', value: 35, color: '#8884d8' },
        { name: 'Photography', value: 25, color: '#82ca9d' },
        { name: 'Music', value: 20, color: '#ffc658' },
        { name: 'Gaming', value: 15, color: '#ff7300' },
        { name: 'Others', value: 5, color: '#00ff88' }
      ];

      // 收益数据
      const revenueData = Array.from({ length: 12 }, (_, i) => ({
        month: new Date(2024, i, 1).toLocaleDateString('en-US', { month: 'short' }),
        revenue: Math.floor(Math.random() * 5000) + 1000,
        commission: Math.floor(Math.random() * 500) + 100
      }));

      // 用户活动数据
      const activityData = Array.from({ length: 7 }, (_, i) => ({
        day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
        likes: Math.floor(Math.random() * 100) + 20,
        comments: Math.floor(Math.random() * 50) + 10,
        shares: Math.floor(Math.random() * 30) + 5
      }));

      return {
        overview: {
          totalRevenue: 12450.75,
          totalSales: 156,
          totalViews: 8924,
          totalLikes: 2341,
          avgPrice: 79.81,
          conversionRate: 3.2
        },
        changes: {
          revenue: { value: '+23.5%', type: 'increase' },
          sales: { value: '+12.3%', type: 'increase' },
          views: { value: '+8.7%', type: 'increase' },
          likes: { value: '+15.2%', type: 'increase' }
        },
        salesData,
        categoryData,
        revenueData,
        activityData,
        topNFTs: [
          { id: 1, title: 'Cosmic Dreams #001', sales: 45, revenue: 2250, image: '🌌' },
          { id: 2, title: 'Digital Sunset', sales: 32, revenue: 1920, image: '🌅' },
          { id: 3, title: 'Neon City', sales: 28, revenue: 1680, image: '🏙️' },
          { id: 4, title: 'Abstract Flow', sales: 24, revenue: 1440, image: '🎨' },
          { id: 5, title: 'Pixel Art Hero', sales: 21, revenue: 1260, image: '👾' }
        ]
      };
    };

    // 模拟API调用延迟
    setTimeout(() => {
      setAnalyticsData(generateMockData());
      setLoading(false);
    }, 1000);
  }, [selectedTimeRange]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-700 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded w-1/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const { overview, changes, salesData, categoryData, revenueData, activityData, topNFTs } = analyticsData;

  return (
    <div className="space-y-6">
      {/* 头部控制 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics Dashboard</h1>
          <p className="text-gray-400">Track your NFT performance and earnings</p>
        </div>
        <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
          <SelectTrigger className="w-40 bg-gray-800 border-gray-600">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-600">
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`${overview.totalRevenue.toLocaleString()} SOL`}
          change={changes.revenue.value}
          changeType={changes.revenue.type}
          icon={DollarSign}
          color="green"
        />
        <StatCard
          title="Total Sales"
          value={overview.totalSales.toLocaleString()}
          change={changes.sales.value}
          changeType={changes.sales.type}
          icon={ShoppingCart}
          color="blue"
        />
        <StatCard
          title="Total Views"
          value={overview.totalViews.toLocaleString()}
          change={changes.views.value}
          changeType={changes.views.type}
          icon={Eye}
          color="purple"
        />
        <StatCard
          title="Total Likes"
          value={overview.totalLikes.toLocaleString()}
          change={changes.likes.value}
          changeType={changes.likes.type}
          icon={Heart}
          color="red"
        />
      </div>

      {/* 主要图表区域 */}
      <Tabs defaultValue="sales" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800">
          <TabsTrigger value="sales">Sales Trends</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Sales Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="#10B981" 
                    fill="#10B981" 
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Revenue & Commission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="revenue" fill="#3B82F6" name="Revenue" />
                  <Bar dataKey="commission" fill="#10B981" name="Commission" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  NFT Categories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <RechartsPieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-white">Category Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {categoryData.map((category, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: category.color }}
                      ></div>
                      <span className="text-white">{category.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-medium">{category.value}%</div>
                      <div className="text-gray-400 text-sm">
                        {Math.floor(overview.totalSales * category.value / 100)} sales
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Activity className="h-5 w-5" />
                User Engagement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="day" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="likes" stroke="#EF4444" strokeWidth={2} name="Likes" />
                  <Line type="monotone" dataKey="comments" stroke="#3B82F6" strokeWidth={2} name="Comments" />
                  <Line type="monotone" dataKey="shares" stroke="#10B981" strokeWidth={2} name="Shares" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 顶级NFT表现 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Award className="h-5 w-5" />
            Top Performing NFTs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topNFTs.map((nft, index) => (
              <div key={nft.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="text-2xl">{nft.image}</div>
                  <div>
                    <h3 className="font-medium text-white">{nft.title}</h3>
                    <p className="text-sm text-gray-400">#{index + 1} Best Seller</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-medium">{nft.sales} sales</div>
                  <div className="text-green-500 text-sm">{nft.revenue} SOL</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 快速洞察 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <Target className="h-5 w-5 text-blue-500" />
              <h3 className="font-medium text-white">Average Price</h3>
            </div>
            <p className="text-2xl font-bold text-white">{overview.avgPrice} SOL</p>
            <p className="text-sm text-gray-400">Per NFT sold</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <Zap className="h-5 w-5 text-yellow-500" />
              <h3 className="font-medium text-white">Conversion Rate</h3>
            </div>
            <p className="text-2xl font-bold text-white">{overview.conversionRate}%</p>
            <p className="text-sm text-gray-400">Views to sales</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <Users className="h-5 w-5 text-purple-500" />
              <h3 className="font-medium text-white">Engagement</h3>
            </div>
            <p className="text-2xl font-bold text-white">
              {((overview.totalLikes / overview.totalViews) * 100).toFixed(1)}%
            </p>
            <p className="text-sm text-gray-400">Like rate</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;

