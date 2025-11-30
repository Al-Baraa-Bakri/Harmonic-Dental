// src/lib/api/hero.ts - Final version for your data structure

import { fetchAPI, getImageData } from '../strapi';
import type {
  StrapiResponse,
  ProcessedHeroSection,
} from '../../types/strapi';

export async function getHeroSection(): Promise<ProcessedHeroSection | null> {
  try {
    const response = await fetchAPI<StrapiResponse<any>>(
      '/hero-section',
      {
        populate: [
          'backgroundImage',
          'primaryButton',
          'secondaryButton',
          'stats',
          'showcaseProducts',
          'showcaseProducts.image'
        ],
      }
    );

    if (!response.data) {
      console.warn('[Hero API] No data found');
      return null;
    }

    const attrs = response.data;
    
    // Process showcase products
    const showcaseProducts = Array.isArray(attrs.showcaseProducts) && attrs.showcaseProducts.length > 0
      ? attrs.showcaseProducts.map((product: any) => {
          return {
            id: product.id || product.documentId,
            name: product.name || '',
            slug: product.slug || '',
            description: product.description || '',
            image: product.image ? getImageData(product.image) : undefined,
            badge: product.badge,
            featured: product.featured || false,
            order: product.order || 0,
          };
        })
      : [];

    // Process stats
    const stats = Array.isArray(attrs.stats) && attrs.stats.length > 0
      ? attrs.stats.sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
      : [];

    const result = {
      badgeText: attrs.badgeText || '',
      mainHeading: attrs.mainHeading || '',
      highlightedText: attrs.highlightedText || '',
      subtitle: attrs.subtitle || '',
      backgroundImage: attrs.backgroundImage ? getImageData(attrs.backgroundImage) : undefined,
      primaryButton: attrs.primaryButton || undefined,
      secondaryButton: attrs.secondaryButton || undefined,
      stats,
      showcaseProducts,
    };

    return result;
  } catch (error) {
    console.error('[Hero API] Error:', error);
    return null;
  }
}

export function isHeroSectionValid(hero: ProcessedHeroSection | null): boolean {
  if (!hero) return false;
  return !!(hero.mainHeading && hero.highlightedText && hero.subtitle);
}