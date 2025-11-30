import { fetchAPI, getImageData } from "../strapi";
import type { StrapiResponse } from "../../types/strapi";

// Types
export interface ServiceItem {
  id: number;
  text: string;
}

export interface ProcessedService {
  id: number;
  title: string;
  image?: {
    url: string;
    alternativeText: string;
    width: number;
    height: number;
  };
  items: ServiceItem[];
  order: number;
}

export interface ProcessedServices {
  headerBadge: string;
  headerTitle: string;
  headerHighlightedText: string;
  headerSubtitle: string;
  services: ProcessedService[];
}

/**
 * Get Services Section data from Strapi
 *
 * Working populate strategy: populate[services][populate]=*
 *
 * Strapi Structure:
 * - Our Services Section (Single Type)
 *   - API ID: our-services-section
 *   - services (Repeatable Component: components.service-item):
 *     - title, image, items, order
 */
export async function getServicesSection(): Promise<ProcessedServices | null> {
  try {

    // Use the working populate strategy for your Strapi version
    const response = await fetchAPI<StrapiResponse<any>>(
      "/our-services-section",
      {
        populate: {
          services: {
            populate: "*",
          },
        },
      }
    );

    if (!response.data) {
      console.warn("[Services API] No data found in response");
      return null;
    }

    const attrs = response.data;


    // Process services
    const services = Array.isArray(attrs.services)
      ? attrs.services.map((service: any) => {

          return {
            id: service.id,
            title: service.title || "",
            image: service.image ? getImageData(service.image) : undefined,
            items: Array.isArray(service.items)
              ? service.items.map((item: any) => ({
                  id: item.id,
                  text: item.text || "",
                }))
              : [],
            order: service.order || 0,
          };
        })
      : [];


    const result = {
      headerBadge: attrs.headerBadge || "Our Services",
      headerTitle: attrs.headerTitle || "Precision-crafted solutions",
      headerHighlightedText:
        attrs.headerHighlightedText || "for every dental need",
      headerSubtitle:
        attrs.headerSubtitle || "combining artistry with advanced technology.",
      services,
    };

    return result;
  } catch (error) {
    console.error("[Services API] ❌ Error:", error);
    if (error instanceof Error) {
      console.error("[Services API] Error details:", error.message);
    }
    return null;
  }
}
