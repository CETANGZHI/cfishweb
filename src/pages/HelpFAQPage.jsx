import React from 'react';

const HelpFAQPage = () => {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">帮助与常见问题 (FAQ)</h1>
      <div className="space-y-6">
        <div className="bg-card p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">如何购买NFT？</h2>
          <p className="text-muted-foreground">您可以在NFT市场页面浏览各种NFT。点击您感兴趣的NFT，进入详情页后，点击“购买”按钮即可完成购买。请确保您的钱包已连接并有足够的余额。</p>
        </div>
        <div className="bg-card p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">如何出售我的NFT？</h2>
          <p className="text-muted-foreground">在用户仪表板中，您可以管理您的NFT。选择您想要出售的NFT，点击“出售”按钮，设置价格和销售类型（一口价或拍卖），然后确认发布。</p>
        </div>
        <div className="bg-card p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">CFISH代币有什么用？</h2>
          <p className="text-muted-foreground">CFISH代币是平台的原生代币，可用于支付交易费用（享受折扣）、参与质押获取奖励、以及参与平台治理投票。</p>
        </div>
        <div className="bg-card p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">如何联系客服？</h2>
          <p className="text-muted-foreground">如果您有其他问题，可以通过社区页面联系我们的客服团队，或发送邮件至 support@cfish.com。</p>
        </div>
      </div>
    </div>
  );
};

export default HelpFAQPage;


