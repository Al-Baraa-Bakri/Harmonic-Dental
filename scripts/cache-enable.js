// scripts/cache-enable.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(process.cwd(), '.env');

try {
  let envContent = '';
  
  // Read existing .env if it exists
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf-8');
    
    // Update existing USE_STRAPI_CACHE or add it
    if (envContent.includes('USE_STRAPI_CACHE')) {
      envContent = envContent.replace(
        /USE_STRAPI_CACHE=.*/,
        'USE_STRAPI_CACHE=true'
      );
    } else {
      envContent += '\nUSE_STRAPI_CACHE=true\n';
    }
  } else {
    // Create new .env file
    envContent = 'USE_STRAPI_CACHE=true\n';
  }
  
  fs.writeFileSync(envPath, envContent, 'utf-8');
  console.log('✅ Strapi cache ENABLED');
  console.log('💡 Rebuilds will use cached data instead of making API requests');
} catch (error) {
  console.error('❌ Error enabling cache:', error);
  process.exit(1);
}

