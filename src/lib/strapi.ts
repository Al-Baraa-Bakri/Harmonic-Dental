// src/lib/strapi.ts - Updated to handle direct image objects

import qs from 'qs';
import type { StrapiMediaField, ImageData } from '../types/strapi';

const STRAPI_URL = import.meta.env.STRAPI_URL || 'http://localhost:1337';

export async function fetchAPI<T>(
  path: string,
  urlParamsObject: Record<string, any> = {},
  options: RequestInit = {}
): Promise<T> {
  try {
    const queryString = qs.stringify(urlParamsObject, { 
      encodeValuesOnly: true,
    });
    
    const requestUrl = `${STRAPI_URL}/api${path}${
      queryString ? `?${queryString}` : ''
    }`;

    const response = await fetch(requestUrl, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`Strapi API error: ${response.status}`);
    }

    const data = await response.json();
    
    return data;
  } catch (error) {
    console.error('[Strapi API] Error:', error);
    throw error;
  }
}

export function getStrapiURL(url?: string | null): string | null {
  if (!url) return null;
  if (url.startsWith('http') || url.startsWith('//')) return url;
  return `${STRAPI_URL}${url}`;
}

// Updated to handle both formats: direct object or wrapped in data
export function getImageData(media?: any): ImageData | null {
  if (!media) return null;
  
  // Handle direct image object (your current format)
  if (media.url) {
    return {
      url: getStrapiURL(media.url) || '',
      alternativeText: media.alternativeText || media.name || '',
      width: media.width || 0,
      height: media.height || 0,
    };
  }
  
  // Handle wrapped format (media.data.attributes)
  if (media.data) {
    const imageData = Array.isArray(media.data) ? media.data[0] : media.data;
    
    if (!imageData) return null;
    
    // Check if it has attributes (old format)
    if (imageData.attributes) {
      return {
        url: getStrapiURL(imageData.attributes.url) || '',
        alternativeText: imageData.attributes.alternativeText || '',
        width: imageData.attributes.width || 0,
        height: imageData.attributes.height || 0,
      };
    }
    
    // Direct data format
    return {
      url: getStrapiURL(imageData.url) || '',
      alternativeText: imageData.alternativeText || imageData.name || '',
      width: imageData.width || 0,
      height: imageData.height || 0,
    };
  }
  
  return null;
}

// Handle multiple images
export function getImagesData(media?: any): ImageData[] {
  if (!media) return [];
  
  // If it's an array directly
  if (Array.isArray(media)) {
    return media.map(img => getImageData(img)).filter(Boolean) as ImageData[];
  }
  
  // If it's wrapped in data
  if (media.data && Array.isArray(media.data)) {
    return media.data.map((img: any) => getImageData(img)).filter(Boolean) as ImageData[];
  }
  
  // Single image
  const single = getImageData(media);
  return single ? [single] : [];
}