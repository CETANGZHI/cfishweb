# CFISH Frontend Testing Guide

## 测试框架

本项目使用以下测试工具：

- **Vitest**: 快速的单元测试框架
- **@testing-library/react**: React组件测试工具
- **@testing-library/jest-dom**: DOM断言扩展
- **@testing-library/user-event**: 用户交互模拟

## 测试命令

```bash
# 运行所有测试
pnpm test

# 运行测试并生成覆盖率报告
pnpm test:coverage

# 以监视模式运行测试
pnpm test:watch

# 运行测试UI界面
pnpm test:ui

# 运行测试一次（CI模式）
pnpm test:run
```

## 测试结构

```
src/
├── test/
│   ├── setup.js          # 测试环境设置
│   ├── utils.jsx         # 测试工具函数
│   └── README.md         # 测试文档
├── components/
│   └── __tests__/        # 组件测试
├── pages/
│   └── __tests__/        # 页面测试
├── utils/
│   └── __tests__/        # 工具函数测试
└── hooks/
    └── __tests__/        # Hook测试
```

## 测试覆盖率目标

- **分支覆盖率**: 70%
- **函数覆盖率**: 70%
- **行覆盖率**: 70%
- **语句覆盖率**: 70%

## 编写测试的最佳实践

### 1. 组件测试

```jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../test/utils';
import userEvent from '@testing-library/user-event';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('handles user interactions', async () => {
    const user = userEvent.setup();
    const mockHandler = vi.fn();
    
    render(<MyComponent onClick={mockHandler} />);
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    expect(mockHandler).toHaveBeenCalledTimes(1);
  });
});
```

### 2. Hook测试

```jsx
import { renderHook, act } from '@testing-library/react';
import { useMyHook } from '../useMyHook';

describe('useMyHook', () => {
  it('returns initial state', () => {
    const { result } = renderHook(() => useMyHook());
    
    expect(result.current.value).toBe(initialValue);
  });

  it('updates state correctly', () => {
    const { result } = renderHook(() => useMyHook());
    
    act(() => {
      result.current.setValue('new value');
    });
    
    expect(result.current.value).toBe('new value');
  });
});
```

### 3. 工具函数测试

```jsx
import { describe, it, expect } from 'vitest';
import { formatPrice } from '../helpers';

describe('formatPrice', () => {
  it('formats prices correctly', () => {
    expect(formatPrice('1.5')).toBe('1.50 SOL');
    expect(formatPrice('1500')).toBe('1.5K SOL');
  });

  it('handles edge cases', () => {
    expect(formatPrice('')).toBe('0');
    expect(formatPrice(null)).toBe('0');
  });
});
```

## 测试工具函数

### 数据工厂

使用 `src/test/utils.jsx` 中的工厂函数创建测试数据：

```jsx
import { createMockUser, createMockNFT } from '../../test/utils';

const mockUser = createMockUser({ username: 'testuser' });
const mockNFT = createMockNFT({ title: 'Test NFT' });
```

### 自定义渲染

使用包含所有Provider的自定义render函数：

```jsx
import { render, screen } from '../../test/utils';

// 自动包含LanguageProvider、NotificationProvider等
render(<MyComponent />);
```

### 事件模拟

```jsx
import userEvent from '@testing-library/user-event';

const user = userEvent.setup();
await user.click(button);
await user.type(input, 'text');
await user.selectOptions(select, 'option1');
```

## Mock策略

### 1. 外部依赖Mock

```jsx
// Mock React Router
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

// Mock API调用
vi.mock('../api/nftApi', () => ({
  fetchNFTs: vi.fn().mockResolvedValue([]),
  createNFT: vi.fn().mockResolvedValue({}),
}));
```

### 2. 浏览器API Mock

```jsx
// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock fetch
global.fetch = vi.fn();
```

### 3. 组件Mock

```jsx
// Mock复杂组件
vi.mock('../ComplexComponent', () => ({
  default: ({ children, ...props }) => (
    <div data-testid="complex-component" {...props}>
      {children}
    </div>
  ),
}));
```

## 异步测试

### 等待元素出现

```jsx
import { waitFor } from '@testing-library/react';

await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument();
});
```

### 等待元素消失

```jsx
await waitFor(() => {
  expect(screen.queryByText('Loading')).not.toBeInTheDocument();
});
```

### 模拟异步操作

```jsx
import { waitForLoadingToFinish } from '../../test/utils';

// 等待异步操作完成
await waitForLoadingToFinish();
```

## 可访问性测试

```jsx
// 检查ARIA属性
expect(button).toHaveAttribute('aria-label', 'Close dialog');

// 检查角色
expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();

// 检查焦点管理
expect(document.activeElement).toBe(input);
```

## 错误边界测试

```jsx
import { ErrorBoundary } from 'react-error-boundary';

const ThrowError = () => {
  throw new Error('Test error');
};

render(
  <ErrorBoundary fallback={<div>Error occurred</div>}>
    <ThrowError />
  </ErrorBoundary>
);

expect(screen.getByText('Error occurred')).toBeInTheDocument();
```

## 性能测试

```jsx
import { performance } from 'perf_hooks';

it('renders within performance budget', () => {
  const start = performance.now();
  render(<ExpensiveComponent />);
  const end = performance.now();
  
  expect(end - start).toBeLessThan(100); // 100ms budget
});
```

## 测试调试

### 调试渲染结果

```jsx
import { screen } from '@testing-library/react';

// 打印DOM结构
screen.debug();

// 打印特定元素
screen.debug(screen.getByTestId('my-element'));
```

### 查看查询结果

```jsx
// 查看所有可用的查询
screen.logTestingPlaygroundURL();
```

## CI/CD集成

测试在CI环境中自动运行：

```yaml
# GitHub Actions示例
- name: Run tests
  run: pnpm test:run

- name: Generate coverage
  run: pnpm test:coverage

- name: Upload coverage
  uses: codecov/codecov-action@v3
```

## 常见问题

### 1. 测试超时

```jsx
// 增加超时时间
it('long running test', async () => {
  // test code
}, 10000); // 10秒超时
```

### 2. 内存泄漏

```jsx
// 清理副作用
afterEach(() => {
  vi.clearAllMocks();
  cleanup();
});
```

### 3. 异步状态更新

```jsx
// 使用act包装状态更新
import { act } from '@testing-library/react';

await act(async () => {
  await updateState();
});
```

## 测试报告

测试完成后会生成以下报告：

- **控制台输出**: 测试结果摘要
- **覆盖率报告**: `coverage/index.html`
- **测试UI**: 通过 `pnpm test:ui` 访问

## 持续改进

- 定期审查测试覆盖率
- 重构重复的测试代码
- 更新测试以反映新功能
- 优化测试性能
- 添加集成测试和E2E测试

