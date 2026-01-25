# Strapi Cache Management Scripts

This directory contains scripts to manage your Strapi API cache.

## Available Scripts

### `npm run cache:enable`
Enable Strapi cache for development builds. This will use cached API responses instead of making new requests to Strapi.

### `npm run cache:disable`
Disable Strapi cache. All builds will fetch fresh data from Strapi.

### `npm run cache:clear`
Clear all cached Strapi data. Useful when you want to fetch fresh data from Strapi.

### `npm run cache:stats`
View cache statistics (number of cached files and total size).

## Usage Example

```bash
# First build - fetches from Strapi and caches the data
npm run dev

# Enable cache for subsequent builds
npm run cache:enable

# Now rebuild as many times as you want without consuming API requests
npm run dev
npm run build

# When you need fresh data from Strapi
npm run cache:clear
npm run dev
```

## How It Works

- When cache is **enabled** (`USE_STRAPI_CACHE=true`):
  - First request: Fetches from Strapi and saves to `.strapi-cache/` directory
  - Subsequent requests: Uses cached data, no API calls made
  
- When cache is **disabled** (default):
  - Always fetches fresh data from Strapi
  - No caching occurs

## Environment Variable

The cache system is controlled by the `USE_STRAPI_CACHE` environment variable:
- `true` = Cache enabled
- `false` or not set = Cache disabled

