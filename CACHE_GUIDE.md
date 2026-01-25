# 🚀 Strapi Cache System for Development

This caching system allows you to rebuild your Astro site **without consuming Strapi API requests**, perfect for development and testing.

---

## 📋 Quick Start

### 1️⃣ First Build (Fetches from Strapi)
```bash
npm run dev
```
This will fetch all data from Strapi and cache it automatically in `.strapi-cache/` directory.

### 2️⃣ Enable Cache Mode
```bash
npm run cache:enable
```

### 3️⃣ Rebuild Without API Requests
```bash
npm run dev
# or
npm run build
```
Now all rebuilds use cached data - **zero API requests to Strapi!** 🎉

---

## 🛠️ Available Commands

| Command | Description |
|---------|-------------|
| `npm run cache:enable` | Enable cache mode (uses cached data) |
| `npm run cache:disable` | Disable cache mode (fetches fresh data) |
| `npm run cache:clear` | Clear all cached data |
| `npm run cache:stats` | View cache statistics |

---

## 💡 Usage Scenarios

### Scenario 1: Working on Frontend Code
```bash
# Enable cache to avoid consuming API requests
npm run cache:enable
npm run dev

# Make your CSS/JavaScript changes
# Rebuild as many times as needed - no API requests!
```

### Scenario 2: Need Fresh Data from Strapi
```bash
# Clear cache and fetch fresh data
npm run cache:clear
npm run cache:disable
npm run dev
```

### Scenario 3: Check Cache Status
```bash
npm run cache:stats
```
Output:
```
📊 Cache Statistics:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📁 Cached files: 17
📦 Total size: 245.6 KB
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 🔍 How It Works

### When Cache is **Enabled** (`USE_STRAPI_CACHE=true`)
1. **First Request**: Fetches from Strapi → Saves to `.strapi-cache/`
2. **Subsequent Requests**: Uses cached data → **No API calls** ✅

### When Cache is **Disabled** (default)
- Always fetches fresh data from Strapi
- Uses API requests (counts toward your 1,000/day limit)

---

## 📊 API Request Savings

Without cache:
- **Every build** = 17 API requests
- **10 builds** = 170 API requests
- **50 builds** = 850 API requests (almost at limit!)

With cache enabled:
- **First build** = 17 API requests
- **Next 100 builds** = 0 API requests 🎉
- **Total savings** = 1,683 requests!

---

## ⚙️ Configuration

The cache is controlled by the `USE_STRAPI_CACHE` environment variable in your `.env` file:

```env
USE_STRAPI_CACHE=true   # Cache enabled
USE_STRAPI_CACHE=false  # Cache disabled (default)
```

---

## 📁 Cache Location

Cached data is stored in:
```
.strapi-cache/
├── aHR0cDovL2xvY2FsaG9zdDoxMzM3L2FwaS9oZWFkZXItbmF2aWdhdGlvbg__.json
├── aHR0cDovL2xvY2FsaG9zdDoxMzM3L2FwaS9mb290ZXI__.json
└── ... (more cached endpoints)
```

This directory is automatically:
- ✅ Created when needed
- ✅ Added to `.gitignore`
- ✅ Excluded from version control

---

## 🎯 Best Practices

### ✅ DO:
- Enable cache when working on frontend code (CSS, React components, layouts)
- Clear cache weekly to ensure data freshness
- Use `cache:stats` to monitor cache size

### ❌ DON'T:
- Keep cache enabled when testing Strapi data changes
- Commit the `.strapi-cache/` directory to git
- Use cached data for production builds

---

## 🐛 Troubleshooting

### Cache not working?
```bash
# Check if cache is enabled
cat .env | grep USE_STRAPI_CACHE

# Should show:
USE_STRAPI_CACHE=true
```

### Getting stale data?
```bash
# Clear cache and rebuild
npm run cache:clear
npm run dev
```

### Want to force fresh data?
```bash
npm run cache:disable
npm run dev
```

---

## 🔄 Typical Development Workflow

```bash
# Monday morning - fetch fresh data
npm run cache:disable
npm run dev

# Enable cache for the week
npm run cache:enable

# Work all week with unlimited rebuilds
npm run dev
npm run build
npm run dev
# ... etc (no API requests!)

# Friday - check what you've saved
npm run cache:stats
# Output: 📁 17 cached files, saving you hundreds of API requests!
```

---

## 📈 Environment Setup

Create a `.env` file in your project root:

```env
# Strapi Configuration
STRAPI_URL=https://your-strapi-instance.com

# Cache Control (set to 'true' to enable caching)
USE_STRAPI_CACHE=false
```

---

## 🎉 Summary

With this caching system, you can:
- ✅ Rebuild unlimited times during development
- ✅ Save your precious Strapi API request quota
- ✅ Work offline once data is cached
- ✅ Speed up build times (no network requests)
- ✅ Focus on coding, not API limits

**Free Strapi Cloud tier**: 1,000 requests/day
**With this cache**: Build 100+ times/day without worrying! 🚀

---

Need help? Check the logs - the cache system logs every action:
```
[Strapi Cache] ✅ Using cached data for /hero-section
[Strapi API] 🌐 Fetching from: /hero-section
[Strapi Cache] 💾 Cached data for /hero-section
```

