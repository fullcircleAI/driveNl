// Performance Optimization Service
// Handles caching, memoization, and lazy loading for better app performance

interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage?: number;
}

class PerformanceOptimizer {
  private cache: Map<string, CacheItem<any>> = new Map();
  private metrics: PerformanceMetrics[] = [];
  private isInitialized = false;

  // Initialize the performance optimizer
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Load cached data from localStorage
      this.loadCacheFromStorage();
      
      // Set up performance monitoring
      this.setupPerformanceMonitoring();
      
      // Clean up expired cache entries
      this.cleanupExpiredCache();
      
      this.isInitialized = true;
      console.log('PerformanceOptimizer initialized');
    } catch (error) {
      console.error('Error initializing PerformanceOptimizer:', error);
    }
  }

  // Cache data with TTL
  setCache<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
    const cacheItem: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      ttl
    };
    
    this.cache.set(key, cacheItem);
    this.saveCacheToStorage();
  }

  // Get cached data
  getCache<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) return null;
    
    // Check if cache is expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      this.saveCacheToStorage();
      return null;
    }
    
    return item.data;
  }

  // Clear specific cache entry
  clearCache(key: string): void {
    this.cache.delete(key);
    this.saveCacheToStorage();
  }

  // Clear all cache
  clearAllCache(): void {
    this.cache.clear();
    localStorage.removeItem('performanceCache');
  }

  // Lazy load function with caching
  async lazyLoad<T>(
    key: string,
    loader: () => Promise<T>,
    ttl: number = 10 * 60 * 1000
  ): Promise<T> {
    // Check cache first
    const cached = this.getCache<T>(key);
    if (cached) {
      return cached;
    }

    // Load data
    const startTime = performance.now();
    const data = await loader();
    const loadTime = performance.now() - startTime;

    // Cache the result
    this.setCache(key, data, ttl);

    // Record metrics
    this.recordMetric({ loadTime, renderTime: 0 });

    return data;
  }

  // Debounce function for performance
  debounce<T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): (...args: Parameters<T>) => void {
    let timeoutId: NodeJS.Timeout;
    
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  }

  // Throttle function for performance
  throttle<T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): (...args: Parameters<T>) => void {
    let lastCall = 0;
    
    return (...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        func(...args);
      }
    };
  }

  // Memoize expensive calculations
  memoize<T extends (...args: any[]) => any>(
    func: T,
    keyGenerator?: (...args: Parameters<T>) => string
  ): T {
    const cache = new Map<string, ReturnType<T>>();
    
    return ((...args: Parameters<T>): ReturnType<T> => {
      const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args);
      
      if (cache.has(key)) {
        return cache.get(key)!;
      }
      
      const result = func(...args);
      cache.set(key, result);
      return result;
    }) as T;
  }

  // Preload critical resources
  async preloadResources(resources: string[]): Promise<void> {
    const preloadPromises = resources.map(resource => {
      return new Promise<void>((resolve, reject) => {
        if (resource.endsWith('.css')) {
          const link = document.createElement('link');
          link.rel = 'preload';
          link.as = 'style';
          link.href = resource;
          link.onload = () => resolve();
          link.onerror = () => reject();
          document.head.appendChild(link);
        } else if (resource.endsWith('.js')) {
          const script = document.createElement('script');
          script.src = resource;
          script.onload = () => resolve();
          script.onerror = () => reject();
          document.head.appendChild(script);
        } else {
          // For other resources, just resolve
          resolve();
        }
      });
    });

    try {
      await Promise.all(preloadPromises);
      console.log('Resources preloaded successfully');
    } catch (error) {
      console.warn('Some resources failed to preload:', error);
    }
  }

  // Record performance metrics
  recordMetric(metric: PerformanceMetrics): void {
    this.metrics.push(metric);
    
    // Keep only last 100 metrics
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100);
    }
  }

  // Get performance metrics
  getMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }

  // Get average load time
  getAverageLoadTime(): number {
    if (this.metrics.length === 0) return 0;
    
    const totalLoadTime = this.metrics.reduce((sum, metric) => sum + metric.loadTime, 0);
    return totalLoadTime / this.metrics.length;
  }

  // Optimize images for mobile
  optimizeImageUrl(url: string, width: number, quality: number = 80): string {
    // This is a placeholder for image optimization
    // In a real implementation, you might use a CDN or image optimization service
    return url;
  }

  // Setup performance monitoring
  private setupPerformanceMonitoring(): void {
    // Monitor long tasks
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) { // Tasks longer than 50ms
            console.warn('Long task detected:', entry);
          }
        }
      });
      
      observer.observe({ entryTypes: ['longtask'] });
    }

    // Monitor memory usage (if available)
    if ('memory' in performance) {
      setInterval(() => {
        const memory = (performance as any).memory;
        if (memory.usedJSHeapSize > 50 * 1024 * 1024) { // 50MB
          console.warn('High memory usage detected:', memory);
        }
      }, 30000); // Check every 30 seconds
    }
  }

  // Clean up expired cache entries
  private cleanupExpiredCache(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
      }
    }
    this.saveCacheToStorage();
  }

  // Save cache to localStorage
  private saveCacheToStorage(): void {
    try {
      const cacheData = Object.fromEntries(this.cache);
      localStorage.setItem('performanceCache', JSON.stringify(cacheData));
    } catch (error) {
      console.warn('Failed to save cache to localStorage:', error);
    }
  }

  // Load cache from localStorage
  private loadCacheFromStorage(): void {
    try {
      const cacheData = localStorage.getItem('performanceCache');
      if (cacheData) {
        const parsed = JSON.parse(cacheData);
        this.cache = new Map(Object.entries(parsed));
      }
    } catch (error) {
      console.warn('Failed to load cache from localStorage:', error);
    }
  }

  // Get cache statistics
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

// Export singleton instance
export const performanceOptimizer = new PerformanceOptimizer();

// Export utility functions
export const debounce = performanceOptimizer.debounce.bind(performanceOptimizer);
export const throttle = performanceOptimizer.throttle.bind(performanceOptimizer);
export const memoize = performanceOptimizer.memoize.bind(performanceOptimizer);
