import { fetchAPI, getImageData, getImagesData } from '../strapi';
import type { StrapiResponse } from '../../types/strapi';
import type { ImageData } from '../../types/strapi';

// Types
export interface TechnologyFeature {
  id: number;
  name: string;
  order: number;
}

export interface ProcessedTechnologyItem {
  id: number;
  name: string;
  slug: string;
  description: string;
  images: ImageData[];
  badge?: string;
  features: TechnologyFeature[];
  detailedDescription?: string;
  videoUrl?: string;
  order: number;
  featured: boolean;
  icon?: string;
}

export interface ProcessedTechnologyPage {
  heroTitle: string;
  heroHighlightedText: string;
  heroSubtitle: string;
  backButtonText: string;
  sectionTitle?: string;
  sectionDescription?: string;
  technologyItems: ProcessedTechnologyItem[];
}

/**
 * Get Technology Page data from Strapi
 * 
 * Uses simple approach: Fetch Technology Page for header, then fetch all Technology Items
 * 
 * Working URL: /api/technology-items?populate[0]=image&populate[1]=features&sort[0]=order:asc
 */
export async function getTechnologyPage(): Promise<ProcessedTechnologyPage | null> {
  try {
    // Step 1: Get the technology page basic info
    const pageResponse = await fetchAPI<StrapiResponse<any>>(
      '/technology-page',
      {}
    );

    if (!pageResponse.data) {
      console.warn('[Technology Page API] No page data found');
      return null;
    }

    const pageData = pageResponse.data;
    console.log('[Technology Page API] Page data fetched');

    // Step 2: Fetch all technology items with their relations
    console.log('[Technology Page API] Step 2: Fetching technology items...');
    
    const itemsResponse = await fetchAPI<StrapiResponse<any[]>>(
      '/technology-items',
      {
        populate: ['image', 'features'],
        sort: ['order:asc', 'createdAt:desc'],
      }
    );

    let technologyItemsData: any[] = [];
    
    if (itemsResponse.data) {
      technologyItemsData = Array.isArray(itemsResponse.data) 
        ? itemsResponse.data 
        : [itemsResponse.data];
      
      console.log('[Technology Page API] Fetched technology items:', {
        count: technologyItemsData.length,
        withImages: technologyItemsData.filter(item => item.image).length,
        withFeatures: technologyItemsData.filter(item => item.features?.length > 0).length,
      });
    }

    // Process technology items
    const technologyItems = technologyItemsData.map((item: any) => {
      console.log('[Technology Page API] Processing technology item:', item.name);

      // Process features
      const features = Array.isArray(item.features)
        ? item.features
            .map((feature: any) => ({
              id: feature.id,
              name: feature.name || '',
              order: feature.order || 0,
            }))
            .sort((a: TechnologyFeature, b: TechnologyFeature) => {
              const orderA = a.order === 0 ? 999 : a.order;
              const orderB = b.order === 0 ? 999 : b.order;
              return orderA - orderB;
            })
        : [];

      // Process images - handle multiple images or duplicate single image
      let images: ImageData[] = [];
      if (item.image) {
        // Extract raw image data and sort by createdAt (oldest first)
        let rawImages: any[] = [];
        
        // Handle different image data structures from Strapi
        if (Array.isArray(item.image)) {
          rawImages = item.image;
        } else if (item.image.data) {
          rawImages = Array.isArray(item.image.data) ? item.image.data : [item.image.data];
        } else {
          rawImages = [item.image];
        }
        
        // Sort images by createdAt (oldest first - first created shows first)
        rawImages.sort((a: any, b: any) => {
          const createdAtA = a.createdAt || a.attributes?.createdAt || '';
          const createdAtB = b.createdAt || b.attributes?.createdAt || '';
          return createdAtA.localeCompare(createdAtB);
        });
        
        // Process sorted images
        images = getImagesData(rawImages.length === 1 ? rawImages[0] : { data: rawImages });
      }

      return {
        id: item.id || item.documentId,
        name: item.name || '',
        slug: item.slug || '',
        description: item.description || '',
        images,
        badge: item.badge || undefined,
        features,
        detailedDescription: item.detailedDescription || undefined,
        videoUrl: item.videoUrl || undefined,
        order: item.order || 0,
        featured: item.featured || false,
        icon: item.icon || undefined,
      };
    });

    console.log('[Technology Page API] ✅ Success!', {
      technologyItemsCount: technologyItems.length,
      withImages: technologyItems.filter(item => item.images.length > 0).length,
      totalFeatures: technologyItems.reduce((acc, item) => acc + item.features.length, 0),
    });

    const result = {
      heroTitle: pageData.heroTitle || 'The Newest',
      heroHighlightedText: pageData.heroHighlightedText || 'Technology',
      heroSubtitle: pageData.heroSubtitle || 'Explore cutting-edge dental technology that transforms precision and efficiency in every restoration.',
      backButtonText: pageData.backButtonText || 'Back to Home',
      sectionTitle: pageData.sectionTitle || undefined,
      sectionDescription: pageData.sectionDescription || undefined,
      technologyItems,
    };

    return result as any;
  } catch (error) {
    console.error('[Technology Page API] ❌ Error:', error);
    if (error instanceof Error) {
      console.error('[Technology Page API] Error details:', error.message);
    }
    return null;
  }
}