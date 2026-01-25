// src/lib/strapi-cache.ts
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cache directory in project root
const CACHE_DIR = path.resolve(process.cwd(), '.strapi-cache');

// Enable/disable cache via environment variable
const USE_CACHE = import.meta.env.USE_STRAPI_CACHE === 'true';

/**
 * Initialize cache directory
 */
function initCacheDir() {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }
}

/**
 * Generate cache key from endpoint and params
 */
function getCacheKey(endpoint: string, params: Record<string, any>): string {
  const paramsStr = JSON.stringify(params);
  const hash = Buffer.from(endpoint + paramsStr).toString('base64').replace(/[/+=]/g, '_');
  return `${hash}.json`;
}

/**
 * Get cached data if available
 */
export function getCachedData<T>(endpoint: string, params: Record<string, any> = {}): T | null {
  if (!USE_CACHE) return null;

  try {
    initCacheDir();
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
export function setCachedData(endpoint: string, params: Record<string, any> = {}, data: any): void {
  if (!USE_CACHE) return;

  try {
    initCacheDir();
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
export function clearCache(): void {
  try {
    if (fs.existsSync(CACHE_DIR)) {
      const files = fs.readdirSync(CACHE_DIR);
      files.forEach(file => {
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
export function getCacheStats(): { files: number; size: number } {
  try {
    if (!fs.existsSync(CACHE_DIR)) {
      return { files: 0, size: 0 };
    }

    const files = fs.readdirSync(CACHE_DIR);
    let totalSize = 0;

    files.forEach(file => {
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

