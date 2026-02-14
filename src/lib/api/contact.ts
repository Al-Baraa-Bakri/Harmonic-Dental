import { fetchAPI } from '../strapi';
import type { StrapiResponse } from '../../types/strapi';

// Types
export interface ContactItem {
  id: number;
  label: string;
  value: string;
  order: number;
}

export interface ProcessedContactSection {
  headerBadge: string;
  headerTitle: string;
  headerHighlightedText: string;
  headerSubtitle: string;
  emails: ContactItem[];
  phones: ContactItem[];
  locationTitle?: string;
  address?: string;
  mapUrl?: string;
  locations?: string[];
}

/**
 * Get Contact Section data from Strapi
 * 
 * Strapi Structure:
 * - Contact Section (Single Type)
 *   - API ID: contact-section
 *   - headerBadge: String
 *   - headerTitle: String
 *   - headerHighlightedText: String
 *   - headerSubtitle: Text
 *   - emails (Repeatable Component: components.contact-item):
 *     - label, value, order
 *   - phones (Repeatable Component: components.contact-item):
 *     - label, value, order
 *   - locationTitle: String (optional)
 *   - address: Text (optional)
 *   - mapUrl: String (Google Maps embed URL)
 */
export async function getContactSection(): Promise<ProcessedContactSection | null> {
  try {

    const response = await fetchAPI<StrapiResponse<any>>(
      '/contact-section',
      {
        populate: ['emails', 'phones', 'locations'],
      }
    );

    if (!response.data) {
      console.warn('[Contact Section API] No data found in response');
      return null;
    }

    const attrs = response.data;

    console.log('locations', attrs.locations);
    // Process locations
    const locations = Array.isArray(attrs.locations)
      ? attrs.locations
          .map((item: any) => ({
            id: item.id,
            text: item.text || '',
          }))
          .sort((a: any, b: any) => {
            // Sort by order (1 is first, 0 is last)
            const orderA = a.order === 0 ? 999 : a.order;
            const orderB = b.order === 0 ? 999 : b.order;
            return orderA - orderB;
          })
      : [];

    // Process emails
    const emails = Array.isArray(attrs.emails)
      ? attrs.emails
          .map((item: any) => ({
            id: item.id,
            label: item.label || '',
            value: item.value || '',
            order: item.order || 0,
          }))
          .sort((a: any, b: any) => {
            // Sort by order (1 is first, 0 is last)
            const orderA = a.order === 0 ? 999 : a.order;
            const orderB = b.order === 0 ? 999 : b.order;
            return orderA - orderB;
          })
      : [];

    // Process phones
    const phones = Array.isArray(attrs.phones)
      ? attrs.phones
          .map((item: any) => ({
            id: item.id,
            label: item.label || '',
            value: item.value || '',
            order: item.order || 0,
          }))
          .sort((a: any, b: any) => {
            // Sort by order (1 is first, 0 is last)
            const orderA = a.order === 0 ? 999 : a.order;
            const orderB = b.order === 0 ? 999 : b.order;
            return orderA - orderB;
          })
      : [];


    const result: ProcessedContactSection = {
      headerBadge: attrs.headerBadge || 'Contact Us',
      headerTitle: attrs.headerTitle || 'To start your amazing journey',
      headerHighlightedText: attrs.headerHighlightedText || 'Get in touch with us',
      headerSubtitle: attrs.headerSubtitle || "We're here to help. Reach out to us through any of the channels below.",
      emails,
      phones,
      locationTitle: attrs.locationTitle || undefined,
      address: attrs.locationTitle || undefined,
      mapUrl: attrs.address || undefined,
      locations,
    };

    return result;
  } catch (error) {
    console.error('[Contact Section API] ❌ Error:', error);
    if (error instanceof Error) {
      console.error('[Contact Section API] Error details:', error.message);
    }
    return null;
  }
}