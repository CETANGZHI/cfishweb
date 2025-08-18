import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { LanguageProvider } from '../components/LanguageProvider';
import { NotificationProvider } from '../components/NotificationSystem';

// 创建测试用的包装器组件
const AllTheProviders = ({ children }) => {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
};

// 自定义render函数，包含所有必要的Provider
const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// 重新导出所有testing-library的工具
export * from '@testing-library/react';

// 覆盖render方法
export { customRender as render };

// 测试数据工厂函数
export const createMockUser = (overrides = {}) => ({
  id: 'user-1',
  username: 'testuser',
  email: 'test@example.com',
  avatar: 'https://example.com/avatar.jpg',
  bio: 'Test user bio',
  verified: true,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  followers: 100,
  following: 50,
  totalSales: 10,
  totalPurchases: 5,
  ...overrides,
});

export const createMockNFT = (overrides = {}) => ({
  id: 'nft-1',
  tokenId: 'token-1',
  title: 'Test NFT',
  description: 'A test NFT for testing purposes',
  image: 'https://example.com/nft.jpg',
  creator: createMockUser({ id: 'creator-1', username: 'creator' }),
  owner: createMockUser({ id: 'owner-1', username: 'owner' }),
  price: '1.5',
  currency: 'SOL',
  priceUSD: '150.00',
  category: 'art',
  rarity: 'rare',
  properties: [
    { traitType: 'Color', value: 'Blue', rarity: 20 },
    { traitType: 'Style', value: 'Abstract', rarity: 15 },
  ],
  levels: [
    { traitType: 'Power', value: 80, maxValue: 100 },
  ],
  stats: [
    { traitType: 'Strength', value: 75 },
  ],
  likes: 25,
  views: 150,
  isLiked: false,
  isForSale: true,
  saleType: 'fixed',
  blockchain: 'solana',
  standard: 'SPL',
  royalties: 5,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  ...overrides,
});

export const createMockCollection = (overrides = {}) => ({
  id: 'collection-1',
  name: 'Test Collection',
  description: 'A test collection for testing purposes',
  image: 'https://example.com/collection.jpg',
  creator: createMockUser({ id: 'creator-1', username: 'creator' }),
  category: 'art',
  floorPrice: '0.5',
  totalVolume: '100.0',
  totalSupply: 1000,
  ownersCount: 250,
  royalties: 5,
  verified: true,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  ...overrides,
});

export const createMockNotification = (overrides = {}) => ({
  id: 'notification-1',
  type: 'sale',
  title: 'NFT Sold',
  message: 'Your NFT "Test NFT" has been sold for 1.5 SOL',
  data: { nftId: 'nft-1', price: '1.5', currency: 'SOL' },
  read: false,
  createdAt: '2024-01-01T00:00:00Z',
  user: createMockUser(),
  ...overrides,
});

export const createMockTransaction = (overrides = {}) => ({
  id: 'transaction-1',
  type: 'sale',
  nft: createMockNFT(),
  from: createMockUser({ id: 'seller-1', username: 'seller' }),
  to: createMockUser({ id: 'buyer-1', username: 'buyer' }),
  amount: '1.5',
  currency: 'SOL',
  amountUSD: '150.00',
  fee: '0.025',
  hash: '0x1234567890abcdef',
  status: 'confirmed',
  createdAt: '2024-01-01T00:00:00Z',
  confirmedAt: '2024-01-01T00:05:00Z',
  ...overrides,
});

export const createMockWallet = (overrides = {}) => ({
  address: '0x1234567890abcdef1234567890abcdef12345678',
  balance: '10.5',
  tokens: [
    {
      symbol: 'SOL',
      name: 'Solana',
      balance: '10.5',
      decimals: 9,
      mint: 'So11111111111111111111111111111111111111112',
      price: '100.00',
      priceChange24h: 5.2,
    },
    {
      symbol: 'CFISH',
      name: 'CFISH Token',
      balance: '1000.0',
      decimals: 6,
      mint: 'CFISHxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      price: '0.50',
      priceChange24h: -2.1,
    },
  ],
  nfts: [createMockNFT()],
  connected: true,
  provider: 'phantom',
  ...overrides,
});

// 测试用的事件处理器
export const createMockHandlers = () => ({
  onClick: vi.fn(),
  onSubmit: vi.fn(),
  onChange: vi.fn(),
  onFocus: vi.fn(),
  onBlur: vi.fn(),
  onMouseEnter: vi.fn(),
  onMouseLeave: vi.fn(),
});

// 等待异步操作的工具函数
export const waitForLoadingToFinish = () =>
  new Promise(resolve => setTimeout(resolve, 0));

// 模拟API响应
export const mockApiResponse = (data, delay = 0) =>
  new Promise(resolve =>
    setTimeout(() => resolve({ ok: true, json: () => Promise.resolve(data) }), delay)
  );

// 模拟API错误
export const mockApiError = (error = 'API Error', delay = 0) =>
  new Promise((_, reject) =>
    setTimeout(() => reject(new Error(error)), delay)
  );

// 模拟文件上传
export const createMockFile = (name = 'test.jpg', type = 'image/jpeg', size = 1024) => {
  const file = new File(['test content'], name, { type });
  Object.defineProperty(file, 'size', { value: size });
  return file;
};

// 模拟图片加载
export const mockImageLoad = (src) => {
  const img = new Image();
  img.src = src;
  setTimeout(() => {
    img.onload && img.onload();
  }, 100);
  return img;
};

// 模拟拖拽事件
export const createMockDragEvent = (type, files = []) => {
  const event = new Event(type, { bubbles: true });
  event.dataTransfer = {
    files,
    items: files.map(file => ({ kind: 'file', type: file.type, getAsFile: () => file })),
    types: ['Files'],
  };
  return event;
};

// 模拟触摸事件
export const createMockTouchEvent = (type, touches = []) => {
  const event = new Event(type, { bubbles: true });
  event.touches = touches;
  event.changedTouches = touches;
  return event;
};

// 断言工具
export const expectElementToBeVisible = (element) => {
  expect(element).toBeInTheDocument();
  expect(element).toBeVisible();
};

export const expectElementToHaveText = (element, text) => {
  expect(element).toBeInTheDocument();
  expect(element).toHaveTextContent(text);
};

export const expectElementToHaveClass = (element, className) => {
  expect(element).toBeInTheDocument();
  expect(element).toHaveClass(className);
};

// 测试ID工具
export const getTestId = (id) => `[data-testid="${id}"]`;
export const getByTestId = (container, id) => container.querySelector(getTestId(id));

// 表单测试工具
export const fillForm = async (user, form) => {
  for (const [field, value] of Object.entries(form)) {
    const input = screen.getByLabelText(new RegExp(field, 'i'));
    await user.clear(input);
    await user.type(input, value);
  }
};

export const submitForm = async (user, submitButton) => {
  await user.click(submitButton);
};

