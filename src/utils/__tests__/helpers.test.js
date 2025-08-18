import { describe, it, expect, vi } from 'vitest';

// Mock utility functions for testing
const formatPrice = (price, currency = 'SOL') => {
  if (!price) return '0';
  const num = parseFloat(price);
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M ${currency}`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K ${currency}`;
  return `${num.toFixed(2)} ${currency}`;
};

const formatDate = (date) => {
  if (!date) return '';
  const now = new Date();
  const targetDate = new Date(date);
  const diffInSeconds = Math.floor((now - targetDate) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  
  return targetDate.toLocaleDateString();
};

const truncateAddress = (address, startLength = 6, endLength = 4) => {
  if (!address) return '';
  if (address.length <= startLength + endLength) return address;
  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
};

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateWalletAddress = (address) => {
  // Simple Solana address validation (base58, 32-44 characters)
  const solanaAddressRegex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
  return solanaAddressRegex.test(address);
};

const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

const throttle = (func, limit) => {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      func.apply(null, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

const copyToClipboard = async (text) => {
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(text);
  } else {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  }
};

const downloadFile = (data, filename, type = 'application/json') => {
  const blob = new Blob([data], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

describe('Utility Functions', () => {
  describe('formatPrice', () => {
    it('formats small prices correctly', () => {
      expect(formatPrice('1.5')).toBe('1.50 SOL');
      expect(formatPrice('0.001')).toBe('0.00 SOL');
      expect(formatPrice('99.99')).toBe('99.99 SOL');
    });

    it('formats large prices with K suffix', () => {
      expect(formatPrice('1500')).toBe('1.5K SOL');
      expect(formatPrice('25000')).toBe('25.0K SOL');
      expect(formatPrice('999999')).toBe('1000.0K SOL');
    });

    it('formats very large prices with M suffix', () => {
      expect(formatPrice('1500000')).toBe('1.5M SOL');
      expect(formatPrice('25000000')).toBe('25.0M SOL');
    });

    it('handles different currencies', () => {
      expect(formatPrice('1.5', 'USDC')).toBe('1.50 USDC');
      expect(formatPrice('1500', 'ETH')).toBe('1.5K ETH');
    });

    it('handles invalid inputs', () => {
      expect(formatPrice('')).toBe('0');
      expect(formatPrice(null)).toBe('0');
      expect(formatPrice(undefined)).toBe('0');
    });
  });

  describe('formatDate', () => {
    beforeEach(() => {
      // Mock current date
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2024-01-01T12:00:00Z'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('formats recent dates correctly', () => {
      const now = new Date('2024-01-01T12:00:00Z');
      
      expect(formatDate(new Date(now.getTime() - 30 * 1000))).toBe('Just now');
      expect(formatDate(new Date(now.getTime() - 5 * 60 * 1000))).toBe('5m ago');
      expect(formatDate(new Date(now.getTime() - 2 * 60 * 60 * 1000))).toBe('2h ago');
      expect(formatDate(new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000))).toBe('3d ago');
    });

    it('formats old dates with full date', () => {
      const oldDate = new Date('2023-06-15T10:30:00Z');
      const result = formatDate(oldDate);
      expect(result).toMatch(/6\/15\/2023|15\/6\/2023|2023-06-15/); // Different locale formats
    });

    it('handles invalid dates', () => {
      expect(formatDate('')).toBe('');
      expect(formatDate(null)).toBe('');
      expect(formatDate(undefined)).toBe('');
    });
  });

  describe('truncateAddress', () => {
    it('truncates long addresses correctly', () => {
      const address = '1234567890abcdef1234567890abcdef12345678';
      expect(truncateAddress(address)).toBe('123456...5678');
    });

    it('returns short addresses unchanged', () => {
      const shortAddress = '12345';
      expect(truncateAddress(shortAddress)).toBe('12345');
    });

    it('handles custom lengths', () => {
      const address = '1234567890abcdef1234567890abcdef12345678';
      expect(truncateAddress(address, 8, 6)).toBe('12345678...345678');
    });

    it('handles invalid inputs', () => {
      expect(truncateAddress('')).toBe('');
      expect(truncateAddress(null)).toBe('');
      expect(truncateAddress(undefined)).toBe('');
    });
  });

  describe('validateEmail', () => {
    it('validates correct email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name+tag@domain.co.uk')).toBe(true);
      expect(validateEmail('user123@test-domain.org')).toBe(true);
    });

    it('rejects invalid email addresses', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('test..test@example.com')).toBe(false);
    });

    it('handles edge cases', () => {
      expect(validateEmail('')).toBe(false);
      expect(validateEmail(null)).toBe(false);
      expect(validateEmail(undefined)).toBe(false);
    });
  });

  describe('validateWalletAddress', () => {
    it('validates correct Solana addresses', () => {
      expect(validateWalletAddress('11111111111111111111111111111112')).toBe(true);
      expect(validateWalletAddress('So11111111111111111111111111111111111111112')).toBe(true);
    });

    it('rejects invalid addresses', () => {
      expect(validateWalletAddress('invalid-address')).toBe(false);
      expect(validateWalletAddress('123')).toBe(false);
      expect(validateWalletAddress('0x1234567890abcdef')).toBe(false); // Ethereum format
    });

    it('handles edge cases', () => {
      expect(validateWalletAddress('')).toBe(false);
      expect(validateWalletAddress(null)).toBe(false);
      expect(validateWalletAddress(undefined)).toBe(false);
    });
  });

  describe('debounce', () => {
    it('delays function execution', async () => {
      vi.useFakeTimers();
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn('test');
      expect(mockFn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledWith('test');

      vi.useRealTimers();
    });

    it('cancels previous calls', async () => {
      vi.useFakeTimers();
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn('first');
      debouncedFn('second');
      debouncedFn('third');

      vi.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('third');

      vi.useRealTimers();
    });
  });

  describe('throttle', () => {
    it('limits function execution frequency', async () => {
      vi.useFakeTimers();
      const mockFn = vi.fn();
      const throttledFn = throttle(mockFn, 100);

      throttledFn('first');
      throttledFn('second');
      throttledFn('third');

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('first');

      vi.advanceTimersByTime(100);
      throttledFn('fourth');

      expect(mockFn).toHaveBeenCalledTimes(2);
      expect(mockFn).toHaveBeenCalledWith('fourth');

      vi.useRealTimers();
    });
  });

  describe('generateId', () => {
    it('generates unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      
      expect(id1).toBeTruthy();
      expect(id2).toBeTruthy();
      expect(id1).not.toBe(id2);
      expect(typeof id1).toBe('string');
      expect(id1.length).toBeGreaterThan(0);
    });
  });

  describe('copyToClipboard', () => {
    it('copies text to clipboard using modern API', async () => {
      const mockWriteText = vi.fn().mockResolvedValue();
      Object.assign(navigator, {
        clipboard: {
          writeText: mockWriteText,
        },
      });

      await copyToClipboard('test text');
      expect(mockWriteText).toHaveBeenCalledWith('test text');
    });

    it('falls back to legacy method when clipboard API is not available', async () => {
      // Mock legacy clipboard method
      const mockExecCommand = vi.fn();
      document.execCommand = mockExecCommand;
      
      // Remove clipboard API
      Object.assign(navigator, { clipboard: undefined });

      await copyToClipboard('test text');
      expect(mockExecCommand).toHaveBeenCalledWith('copy');
    });
  });

  describe('downloadFile', () => {
    it('creates download link and triggers download', () => {
      // Mock DOM methods
      const mockCreateElement = vi.fn();
      const mockAppendChild = vi.fn();
      const mockRemoveChild = vi.fn();
      const mockClick = vi.fn();
      const mockCreateObjectURL = vi.fn().mockReturnValue('blob:url');
      const mockRevokeObjectURL = vi.fn();

      const mockLink = {
        href: '',
        download: '',
        click: mockClick,
      };

      document.createElement = mockCreateElement.mockReturnValue(mockLink);
      document.body.appendChild = mockAppendChild;
      document.body.removeChild = mockRemoveChild;
      URL.createObjectURL = mockCreateObjectURL;
      URL.revokeObjectURL = mockRevokeObjectURL;

      downloadFile('{"test": "data"}', 'test.json');

      expect(mockCreateElement).toHaveBeenCalledWith('a');
      expect(mockLink.download).toBe('test.json');
      expect(mockClick).toHaveBeenCalled();
      expect(mockAppendChild).toHaveBeenCalledWith(mockLink);
      expect(mockRemoveChild).toHaveBeenCalledWith(mockLink);
      expect(mockRevokeObjectURL).toHaveBeenCalled();
    });
  });
});

