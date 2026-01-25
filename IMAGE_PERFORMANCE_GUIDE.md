# Image Performance Optimization Guide

## 🎯 Problem: Slow Image Rendering

Even though your images load quickly from Strapi (1 MB), they can render slowly on screen due to:

1. **Large pixel dimensions** - 1 MB image can still be 3000x2000+ pixels
2. **Browser decoding** - Decompressing and decoding takes CPU time
3. **GPU rendering** - Large images strain graphics processing
4. **Multiple simultaneous images** - Rendering 6+ images compounds the issue

---

## ✅ Solutions Implemented

### 1. **Responsive Images with srcset** ⭐ MOST IMPORTANT

We now use Strapi's automatically generated image formats (thumbnail, small, medium, large):

```tsx
// ProductsPage.tsx
const largeUrl = getResponsiveImageUrl(product.image, 'large') || imageUrl;
const mediumUrl = getResponsiveImageUrl(product.image, 'medium') || largeUrl;
const smallUrl = getResponsiveImageUrl(product.image, 'small') || mediumUrl;

const srcSet = [
  smallUrl && `${smallUrl} 500w`,
  mediumUrl && `${mediumUrl} 750w`,
  largeUrl && `${largeUrl} 1000w`,
  imageUrl && `${imageUrl} 1920w`,
].filter(Boolean).join(', ');

<img 
  src={largeUrl} // Default to large for better quality
  srcSet={srcSet}
  sizes="(max-width: 640px) 500px, (max-width: 768px) 600px, (max-width: 1024px) 750px, 1000px"
/>
```

**Benefits:**
- **Default quality: LARGE** - Better quality baseline
- Mobile devices load ~300KB images (good quality)
- Tablets load ~500KB images (high quality)
- Desktop loads ~750KB images (excellent quality)
- Original only loaded on very large screens
- **Specific pixel sizes** in `sizes` attribute = browser downloads exactly what's needed

### 2. **Priority Loading**

```tsx
loading={index < 2 ? "eager" : "lazy"}
fetchPriority={index === 0 ? "high" : "auto"}
```

- First 2 images load immediately (eager)
- First image gets highest priority
- Other images lazy load as you scroll

### 3. **Async Decoding**

```tsx
decoding="async"
```

- Images decode off the main thread
- Page remains responsive during image processing
- No blocking of user interactions

### 4. **Content Visibility & Image Rendering**

```tsx
style={{
  contentVisibility: 'auto',
  willChange: 'auto',
  imageRendering: 'high-quality',
}}
```

- Browser optimizes rendering for off-screen images
- Reduces initial render cost
- Improves scroll performance
- **High-quality rendering** ensures sharp images

### 5. **CSS Enhancements**

Added global CSS for better image quality:

```css
/* High-quality image rendering */
img {
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
}

/* Product images - enhanced quality */
img[loading="lazy"],
img[loading="eager"] {
  image-rendering: auto;
  -webkit-backface-visibility: hidden;
  -webkit-transform: translate3d(0, 0, 0);
}
```

- Enables browser's best quality rendering
- Prevents blurry images on certain browsers
- Hardware acceleration for smoother display

---

## 📊 Expected Performance Improvements

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Mobile Image Size | 1 MB | ~300 KB | **70% smaller** |
| Tablet Image Size | 1 MB | ~500 KB | **50% smaller** |
| Desktop Image Size | 1 MB | ~750 KB | **25% smaller** |
| Image Quality | Variable | **High** | **Consistent** |
| First Image Render | Slow | Fast | **Priority loading** |
| Scroll Performance | Laggy | Smooth | **Lazy loading** |
| Browser Responsiveness | Blocked | Smooth | **Async decode** |

---

## 🔧 Strapi Configuration (Backend)

### What Strapi Does Automatically

When you upload an image, Strapi automatically generates:

```javascript
{
  url: "/uploads/original.jpg",          // Original: 1 MB, 3000x2000px
  formats: {
    thumbnail: {
      url: "/uploads/thumbnail.jpg",     // ~10 KB, 245x164px
      width: 245,
      height: 164
    },
    small: {
      url: "/uploads/small.jpg",         // ~150 KB, 500x333px
      width: 500,
      height: 333
    },
    medium: {
      url: "/uploads/medium.jpg",        // ~400 KB, 750x500px
      width: 750,
      height: 500
    },
    large: {
      url: "/uploads/large.jpg",         // ~750 KB, 1000x667px
      width: 1000,
      height: 667
    }
  }
}
```

### Optional: Configure Strapi Quality

If you need higher quality images (at cost of performance), edit `config/plugins.js` in your Strapi backend:

```javascript
module.exports = {
  upload: {
    config: {
      breakpoints: {
        xlarge: 1920,
        large: 1000,
        medium: 750,
        small: 500,
      },
      quality: 90, // Default is 80, max is 100
    },
  },
};
```

### Optional: Enable Image Caching

For even faster performance on subsequent loads:

```javascript
module.exports = {
  "local-image-sharp": {
    config: {
      cacheDir: ".image-cache",
      maxAge: 31536000, // 1 year
    },
  },
};
```

Don't forget to add `.image-cache` to your `.gitignore`!

---

## 🔍 How to Test Performance

### 1. Check Network Transfer

1. Open DevTools (`F12`)
2. Go to **Network** tab
3. Filter by **Img**
4. Reload page (`Ctrl + R`)
5. Look at **Size** column - should see smaller images on mobile

### 2. Check Rendering Performance

1. Open DevTools (`F12`)
2. Go to **Performance** tab
3. Click **Record** (circle icon)
4. Reload page
5. Stop recording
6. Look for:
   - **Faster "Parse HTML"** - async decoding helps
   - **Smaller "Decode Image"** blocks - smaller images help
   - **Shorter "Paint"** times - optimized rendering helps

### 3. Test on Different Screen Sizes

1. Open DevTools (`F12`)
2. Toggle device toolbar (`Ctrl + Shift + M`)
3. Test different devices:
   - **iPhone SE** - Should load small (500w) images
   - **iPad** - Should load medium (750w) images
   - **Desktop** - Should load large (1000w) images

### 4. Check Lighthouse Score

1. Open DevTools (`F12`)
2. Go to **Lighthouse** tab
3. Run report for **Mobile** and **Desktop**
4. Check:
   - **Largest Contentful Paint (LCP)** - Should be < 2.5s
   - **Properly size images** - Should pass
   - **Efficiently encode images** - Should pass

---

## 🚀 Additional Optimizations (Future)

### 1. WebP Format

Modern browsers support WebP (even smaller than JPEG):

```typescript
// In strapi.ts
export function getWebPImageUrl(imageData: ImageData | null): string | null {
  if (!imageData?.formats) return imageData?.url || null;
  
  // Check if WebP version exists
  const format = imageData.formats.medium;
  if (format?.mime === 'image/webp') {
    return getStrapiURL(format.url);
  }
  
  return imageData.url;
}
```

### 2. Blur Placeholder

Add a loading placeholder while images load:

```tsx
const [imageLoaded, setImageLoaded] = useState(false);

<div className="relative">
  {!imageLoaded && (
    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/20 animate-pulse" />
  )}
  <img
    onLoad={() => setImageLoaded(true)}
    className={imageLoaded ? "opacity-100" : "opacity-0"}
    // ... other props
  />
</div>
```

### 3. Intersection Observer

Load images only when they're about to become visible:

```typescript
useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Load image
        }
      });
    },
    { rootMargin: "50px" } // Start loading 50px before visible
  );
  
  // Observe image elements
}, []);
```

---

## 📱 Browser Support

All optimizations work on:

- ✅ Chrome/Edge 90+
- ✅ Firefox 85+
- ✅ Safari 14+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

Graceful degradation for older browsers:
- `srcset` - Falls back to `src`
- `loading="lazy"` - Falls back to normal loading
- `decoding="async"` - Falls back to sync decoding
- `contentVisibility` - Ignored if not supported

---

## 🎓 Key Takeaways

1. **Strapi automatically optimizes images** - 16 MB → 1 MB
2. **Use responsive images** - Serve appropriate sizes for each device
3. **Prioritize above-the-fold content** - Load visible images first
4. **Lazy load off-screen images** - Improve initial page load
5. **Async decode** - Keep page responsive during image processing

---

## 🔗 Resources

- [MDN: Responsive Images](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)
- [Strapi Image Optimization](https://docs.strapi.io/dev-docs/plugins/upload)
- [Web.dev: Optimize Images](https://web.dev/fast/#optimize-your-images)
- [Can I Use: srcset](https://caniuse.com/srcset)

