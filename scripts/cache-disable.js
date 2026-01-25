// scripts/cache-disable.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(process.cwd(), '.env');

try {
  if (fs.existsSync(envPath)) {
    let envContent = fs.readFileSync(envPath, 'utf-8');
    
    // Update USE_STRAPI_CACHE to false
    if (envContent.includes('USE_STRAPI_CACHE')) {
      envContent = envContent.replace(
        /USE_STRAPI_CACHE=.*/,
        'USE_STRAPI_CACHE=false'
      );
      fs.writeFileSync(envPath, envContent, 'utf-8');
    }
  }
  
  console.log('✅ Strapi cache DISABLED');
  console.log('💡 Rebuilds will fetch fresh data from Strapi');
} catch (error) {
  console.error('❌ Error disabling cache:', error);
  process.exit(1);
}

