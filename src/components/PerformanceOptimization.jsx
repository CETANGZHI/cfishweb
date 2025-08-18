import React, { lazy, Suspense, memo, useMemo, useCallback, useState, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

// 懒加载组件包装器
export const LazyWrapper = ({ children, fallback = null }) => {
  return (
    <Suspense fallback={fallback || <LoadingSpinner />}>
      {children}
    </Suspense>
  );
};

// 加载动画组件
export const LoadingSpinner = memo(({ size = 'medium', text = 'Loading...' }) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className={`animate-spin rounded-full border-2 border-primary border-t-transparent ${sizeClasses[size]}`} />
      {text && <p className="mt-2 text-sm text-gray-400">{text}</p>}
    </div>
  );
});

// 错误边界组件
export const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-red-50 border border-red-200 rounded-lg">
      <h2 className="text-lg font-semibold text-red-800 mb-2">Something went wrong</h2>
      <p className="text-sm text-red-600 mb-4">{error.message}</p>
      <button
        onClick={resetErrorBoundary}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
      >
        Try again
      </button>
    </div>
  );
};

// 图片懒加载组件
export const LazyImage = memo(({ 
  src, 
  alt, 
  className = '', 
  placeholder = '/api/placeholder/300/300',
  onLoad,
  onError 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const imgElement = document.getElementById(`lazy-img-${src}`);
    if (imgElement) {
      observer.observe(imgElement);
    }

    return () => observer.disconnect();
  }, [src]);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setHasError(true);
    onError?.();
  }, [onError]);

  return (
    <div id={`lazy-img-${src}`} className={`relative overflow-hidden ${className}`}>
      {!isInView && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      
      {isInView && (
        <>
          {!isLoaded && !hasError && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          )}
          
          <img
            src={hasError ? placeholder : src}
            alt={alt}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={handleLoad}
            onError={handleError}
            loading="lazy"
          />
        </>
      )}
    </div>
  );
});

// 虚拟滚动组件
export const VirtualList = memo(({ 
  items, 
  itemHeight, 
  containerHeight, 
  renderItem,
  overscan = 5 
}) => {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleStart = Math.floor(scrollTop / itemHeight);
  const visibleEnd = Math.min(
    visibleStart + Math.ceil(containerHeight / itemHeight),
    items.length - 1
  );

  const startIndex = Math.max(0, visibleStart - overscan);
  const endIndex = Math.min(items.length - 1, visibleEnd + overscan);

  const visibleItems = useMemo(() => {
    return items.slice(startIndex, endIndex + 1).map((item, index) => ({
      ...item,
      index: startIndex + index
    }));
  }, [items, startIndex, endIndex]);

  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  return (
    <div
      style={{ height: containerHeight }}
      className="overflow-auto"
      onScroll={(e) => setScrollTop(e.target.scrollTop)}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item) => (
            <div key={item.index} style={{ height: itemHeight }}>
              {renderItem(item, item.index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

// 防抖Hook
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// 节流Hook
export const useThrottle = (value, limit) => {
  const [throttledValue, setThrottledValue] = useState(value);
  const [lastRan, setLastRan] = useState(Date.now());

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan >= limit) {
        setThrottledValue(value);
        setLastRan(Date.now());
      }
    }, limit - (Date.now() - lastRan));

    return () => {
      clearTimeout(handler);
    };
  }, [value, limit, lastRan]);

  return throttledValue;
};

// 内存化搜索Hook
export const useMemoizedSearch = (items, searchTerm, searchFields) => {
  return useMemo(() => {
    if (!searchTerm) return items;
    
    return items.filter(item => 
      searchFields.some(field => 
        item[field]?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [items, searchTerm, searchFields]);
};

// 缓存管理器
class CacheManager {
  constructor(maxSize = 100) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  get(key) {
    if (this.cache.has(key)) {
      // 移动到最后（LRU）
      const value = this.cache.get(key);
      this.cache.delete(key);
      this.cache.set(key, value);
      return value;
    }
    return null;
  }

  set(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      // 删除最旧的项
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }

  clear() {
    this.cache.clear();
  }

  size() {
    return this.cache.size;
  }
}

// 全局缓存实例
export const globalCache = new CacheManager();

// 缓存Hook
export const useCache = (key, fetcher, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cachedData = globalCache.get(key);
    if (cachedData) {
      setData(cachedData);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    fetcher()
      .then(result => {
        globalCache.set(key, result);
        setData(result);
      })
      .catch(err => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [key, ...dependencies]);

  return { data, loading, error };
};

// 预加载Hook
export const usePreload = (urls) => {
  useEffect(() => {
    urls.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = url;
      document.head.appendChild(link);
    });

    return () => {
      // 清理预加载的链接
      urls.forEach(url => {
        const links = document.querySelectorAll(`link[href="${url}"]`);
        links.forEach(link => link.remove());
      });
    };
  }, [urls]);
};

// 性能监控Hook
export const usePerformanceMonitor = (componentName) => {
  useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      if (renderTime > 16) { // 超过一帧的时间
        console.warn(`${componentName} render time: ${renderTime.toFixed(2)}ms`);
      }
    };
  });
};

// 代码分割的路由组件
export const createLazyRoute = (importFunc, fallback) => {
  const LazyComponent = lazy(importFunc);
  
  return memo((props) => (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={fallback || <LoadingSpinner />}>
        <LazyComponent {...props} />
      </Suspense>
    </ErrorBoundary>
  ));
};

// 批量状态更新Hook
export const useBatchedUpdates = () => {
  const [updates, setUpdates] = useState([]);
  
  const batchUpdate = useCallback((updateFn) => {
    setUpdates(prev => [...prev, updateFn]);
  }, []);

  useEffect(() => {
    if (updates.length > 0) {
      // 使用 React 的批量更新
      Promise.resolve().then(() => {
        updates.forEach(updateFn => updateFn());
        setUpdates([]);
      });
    }
  }, [updates]);

  return batchUpdate;
};

// Web Worker Hook
export const useWebWorker = (workerScript) => {
  const [worker, setWorker] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const workerInstance = new Worker(workerScript);
    setWorker(workerInstance);

    return () => {
      workerInstance.terminate();
    };
  }, [workerScript]);

  const postMessage = useCallback((data) => {
    if (worker) {
      setIsLoading(true);
      worker.postMessage(data);
      
      return new Promise((resolve, reject) => {
        worker.onmessage = (e) => {
          setIsLoading(false);
          resolve(e.data);
        };
        
        worker.onerror = (error) => {
          setIsLoading(false);
          reject(error);
        };
      });
    }
  }, [worker]);

  return { postMessage, isLoading };
};

// 性能优化的NFT网格组件
export const OptimizedNFTGrid = memo(({ 
  nfts, 
  onNFTClick, 
  itemsPerPage = 20,
  enableVirtualization = false 
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  
  const paginatedNFTs = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return nfts.slice(startIndex, startIndex + itemsPerPage);
  }, [nfts, currentPage, itemsPerPage]);

  const renderNFTItem = useCallback((nft, index) => (
    <div 
      key={nft.id} 
      className="nft-card cursor-pointer"
      onClick={() => onNFTClick(nft)}
    >
      <LazyImage
        src={nft.image}
        alt={nft.title}
        className="aspect-square"
      />
      <div className="p-3">
        <h3 className="font-medium text-white truncate">{nft.title}</h3>
        <p className="text-sm text-gray-400">{nft.price}</p>
      </div>
    </div>
  ), [onNFTClick]);

  if (enableVirtualization && nfts.length > 100) {
    return (
      <VirtualList
        items={nfts}
        itemHeight={300}
        containerHeight={600}
        renderItem={renderNFTItem}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {paginatedNFTs.map((nft, index) => renderNFTItem(nft, index))}
    </div>
  );
});

export default {
  LazyWrapper,
  LoadingSpinner,
  ErrorFallback,
  LazyImage,
  VirtualList,
  OptimizedNFTGrid,
  useDebounce,
  useThrottle,
  useMemoizedSearch,
  useCache,
  usePreload,
  usePerformanceMonitor,
  createLazyRoute,
  useBatchedUpdates,
  useWebWorker,
  globalCache
};

