// scripts/cache-stats.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CACHE_DIR = path.resolve(process.cwd(), '.strapi-cache');

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

try {
  if (!fs.existsSync(CACHE_DIR)) {
    console.log('ℹ️  No cache directory found');
    console.log('📊 Cached files: 0');
    console.log('📦 Total size: 0 Bytes');
    process.exit(0);
  }

  const files = fs.readdirSync(CACHE_DIR);
  let totalSize = 0;

  files.forEach(file => {
    const stats = fs.statSync(path.join(CACHE_DIR, file));
    totalSize += stats.size;
  });

  console.log('📊 Cache Statistics:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📁 Cached files: ${files.length}`);
  console.log(`📦 Total size: ${formatBytes(totalSize)}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
} catch (error) {
  console.error('❌ Error getting cache stats:', error);
  process.exit(1);
}

