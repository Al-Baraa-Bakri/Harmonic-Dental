// scripts/cache-clear.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CACHE_DIR = path.resolve(process.cwd(), '.strapi-cache');

try {
  if (fs.existsSync(CACHE_DIR)) {
    const files = fs.readdirSync(CACHE_DIR);
    
    files.forEach(file => {
      fs.unlinkSync(path.join(CACHE_DIR, file));
    });
    
    console.log(`✅ Cache cleared (${files.length} files removed)`);
  } else {
    console.log('ℹ️  No cache directory found');
  }
} catch (error) {
  console.error('❌ Error clearing cache:', error);
  process.exit(1);
}

