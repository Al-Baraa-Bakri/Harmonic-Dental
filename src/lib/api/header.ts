import { fetchAPI, getImageData } from '../strapi';
import type { StrapiResponse } from '../../types/strapi';

// Types
export interface NavigationItem {
  id: number;
  label: string;
  url: string;
  isExternal: boolean;
  order: number;
}

export interface ProcessedHeaderNavigation {
  logo?: {
    url: string;
    alt: string;
    width: number;
    height: number;
  } | any;
  navigationItems: NavigationItem[];
  phoneNumber: string;
  ctaButton?: {
    label: string;
    url: string;
    isExternal: boolean;
  };
}

/**
 * Get Header Navigation data from Strapi
 * 
 * Strapi Structure:
 * - Header Navigation (Single Type)
 *   - API ID: header-navigation
 *   - logo: Media (image)
 *   - navigationItems (Repeatable Component: components.navigation-item):
 *     - label, url, isExternal, order
 *   - phoneNumber: String
 *   - ctaButton (Component: components.button):
 *     - label, url, isExternal
 */
export async function getHeaderNavigation(): Promise<ProcessedHeaderNavigation | null> {
  try {
    const response = await fetchAPI<StrapiResponse<any>>(
      '/header-navigation',
      {
        populate: ['logo', 'navigationItems', 'ctaButton'],
      }
    );

    if (!response.data) {
      console.warn('[Header Navigation API] No data found in response');
      return null;
    }

    const attrs = response.data;
    
    // Process navigation items
    const navigationItems = Array.isArray(attrs.navigationItems)
      ? attrs.navigationItems
          .map((item: any) => ({
            id: item.id,
            label: item.label || '',
            url: item.href || '',
            isExternal: item.isExternal || false,
            order: item.order || 0,
          }))
          .sort((a: any, b: any) => {
            // Sort by order (1 is first, 0 is last)
            const orderA = a.order === 0 ? 999 : a.order;
            const orderB = b.order === 0 ? 999 : b.order;
            return orderA - orderB;
          })
      : [];

    const result: ProcessedHeaderNavigation = {
      logo: attrs.logo ? getImageData(attrs.logo) : undefined,
      navigationItems,
      phoneNumber: attrs.phoneNumber || '',
      ctaButton: attrs.ctaButton
        ? {
            label: attrs.ctaButton.label || '',
            url: attrs.ctaButton.url || '',
            isExternal: attrs.ctaButton.isExternal || false,
          }
        : undefined,
    };

    return result;
  } catch (error) {
    console.error('[Header Navigation API] ❌ Error:', error);
    if (error instanceof Error) {
      console.error('[Header Navigation API] Error details:', error.message);
    }
    return null;
  }
}