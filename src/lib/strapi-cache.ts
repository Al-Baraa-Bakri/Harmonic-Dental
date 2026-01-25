// src/lib/strapi-cache.ts
// Server-side only cache module - uses dynamic imports for Node.js modules

// Check if we're in a server environment
const isServer = typeof process !== 'undefined' && process.versions?.node;

// Enable/disable cache via environment variable
const USE_CACHE = import.meta.env.USE_STRAPI_CACHE === 'true';

/**
 * Generate cache key from endpoint and params
 */
function getCacheKey(endpoint: string, params: Record<string, any>): string {
  const paramsStr = JSON.stringify(params);
  // Create a simple hash that's safe for filenames and cross-platform
  let hash = endpoint + paramsStr;
  // Use a simple encoding for cross-platform compatibility
  hash = hash.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 100);
  return `${hash}.json`;
}

/**
 * Get cached data if available
 */
export async function getCachedData<T>(endpoint: string, params: Record<string, any> = {}): Promise<T | null> {
  if (!USE_CACHE || !isServer) return null;

  try {
    const fs = await import('fs');
    const path = await import('path');
    
    const CACHE_DIR = path.resolve(process.cwd(), '.strapi-cache');
    
    // Initialize cache directory if needed
    if (!fs.existsSync(CACHE_DIR)) {
      fs.mkdirSync(CACHE_DIR, { recursive: true });
    }
    
    const cacheKey = getCacheKey(endpoint, params);
    const cachePath = path.join(CACHE_DIR, cacheKey);

    if (fs.existsSync(cachePath)) {
      const cachedData = fs.readFileSync(cachePath, 'utf-8');
      console.log(`[Strapi Cache] ✅ Using cached data for ${endpoint}`);
      return JSON.parse(cachedData) as T;
    }
  } catch (error) {
    console.warn('[Strapi Cache] Error reading cache:', error);
  }

  return null;
}

/**
 * Save data to cache
 */
export async function setCachedData(endpoint: string, params: Record<string, any> = {}, data: any): Promise<void> {
  if (!USE_CACHE || !isServer) return;

  try {
    const fs = await import('fs');
    const path = await import('path');
    
    const CACHE_DIR = path.resolve(process.cwd(), '.strapi-cache');
    
    // Initialize cache directory if needed
    if (!fs.existsSync(CACHE_DIR)) {
      fs.mkdirSync(CACHE_DIR, { recursive: true });
    }
    
    const cacheKey = getCacheKey(endpoint, params);
    const cachePath = path.join(CACHE_DIR, cacheKey);

    fs.writeFileSync(cachePath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`[Strapi Cache] 💾 Cached data for ${endpoint}`);
  } catch (error) {
    console.warn('[Strapi Cache] Error writing cache:', error);
  }
}

/**
 * Clear all cached data
 */
export async function clearCache(): Promise<void> {
  if (!isServer) return;
  
  try {
    const fs = await import('fs');
    const path = await import('path');
    
    const CACHE_DIR = path.resolve(process.cwd(), '.strapi-cache');
    
    if (fs.existsSync(CACHE_DIR)) {
      const files = fs.readdirSync(CACHE_DIR);
      files.forEach((file: string) => {
        fs.unlinkSync(path.join(CACHE_DIR, file));
      });
      console.log('[Strapi Cache] 🗑️  Cache cleared');
    }
  } catch (error) {
    console.warn('[Strapi Cache] Error clearing cache:', error);
  }
}

/**
 * Get cache statistics
 */
export async function getCacheStats(): Promise<{ files: number; size: number }> {
  if (!isServer) return { files: 0, size: 0 };
  
  try {
    const fs = await import('fs');
    const path = await import('path');
    
    const CACHE_DIR = path.resolve(process.cwd(), '.strapi-cache');
    
    if (!fs.existsSync(CACHE_DIR)) {
      return { files: 0, size: 0 };
    }

    const files = fs.readdirSync(CACHE_DIR);
    let totalSize = 0;

    files.forEach((file: string) => {
      const stats = fs.statSync(path.join(CACHE_DIR, file));
      totalSize += stats.size;
    });

    return {
      files: files.length,
      size: totalSize,
    };
  } catch (error) {
    return { files: 0, size: 0 };
  }
}
