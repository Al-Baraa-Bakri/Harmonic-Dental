import { fetchAPI, getImageData } from '../strapi';
import type { StrapiResponse } from '../../types/strapi';

// Types
export interface FooterLink {
  id: number;
  label: string;
  url: string;
  isExternal: boolean;
}

export interface FooterColumn {
  id: number;
  title: string;
  links: FooterLink[];
  order: number;
}

export interface SocialLink {
  id: number;
  platform: string;
  url: string;
  icon?: string;
}

export interface ProcessedFooter {
  logo?: {
    url: string;
    alternativeText: string;
    width: number;
    height: number;
  } | any;
  description: string;
  phoneNumber: string;
  email: string;
  address: string;
  navigationColumns: FooterColumn[];
  companyName: string;
  socialLinks: SocialLink[];
}

/**
 * Get Footer data from Strapi
 * 
 * Strapi Structure:
 * - Footer (Single Type)
 *   - API ID: footer
 *   - logo: Media (image)
 *   - description: Text
 *   - phoneNumber: String
 *   - email: Email
 *   - address: Text
 *   - navigationColumns (Repeatable Component: components.footer-column):
 *     - title, links (footer-link), order
 *   - companyName: String
 *   - socialLinks (Repeatable Component: components.social-link):
 *     - platform, url, icon
 */
export async function getFooter(): Promise<ProcessedFooter> {
  try {

    const response = await fetchAPI<StrapiResponse<any>>(
      '/footer',
      {
        populate: ['logo', 'navigationColumns', 'navigationColumns.links', 'socialLinks'],
      }
    );

    if (!response.data) {
      console.warn('[Footer API] No data found in response');
      return null;
    }

    const attrs = response.data;


    // Process navigation columns
    const navigationColumns = Array.isArray(attrs.navigationColumns)
      ? attrs.navigationColumns
          .map((column: any) => ({
            id: column.id,
            title: column.title || '',
            links: Array.isArray(column.links)
              ? column.links.map((link: any) => ({
                  id: link.id,
                  label: link.name || '',
                  url: link.href || '',
                  isExternal: link.isExternal || false,
                }))
              : [],
            order: column.order || 0,
          }))
          .sort((a: any, b: any) => {
            // Sort by order (1 is first, 0 is last)
            const orderA = a.order === 0 ? 999 : a.order;
            const orderB = b.order === 0 ? 999 : b.order;
            return orderA - orderB;
          })
      : [];

    // Process social links
    const socialLinks = Array.isArray(attrs.socialLinks)
      ? attrs.socialLinks.map((social: any) => ({
          id: social.id,
          platform: social.platform || '',
          url: social.url || '',
          icon: social.icon || undefined,
        }))
      : [];



    const result: ProcessedFooter = {
      logo: attrs.logo ? getImageData(attrs.logo) : undefined,
      description: attrs.description || '',
      phoneNumber: attrs.phoneNumber || '',
      email: attrs.email || '',
      address: attrs.address || '',
      navigationColumns,
      companyName: attrs.companyName || 'Harmonic Dental',
      socialLinks,
    };

    return result;
  } catch (error) {
    console.error('[Footer API] ❌ Error:', error);
    if (error instanceof Error) {
      console.error('[Footer API] Error details:', error.message);
    }
    return null;
  }
}