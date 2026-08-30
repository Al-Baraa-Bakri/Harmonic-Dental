import { getContentSection } from "../content";
import type { ImageData } from "../../types/content";

// Types
export interface FeatureTag {
  id: number;
  name: string;
  order: number;
}

export interface ProcessedProductType {
  id: number;
  name: string;
  slug: string;
  description: string;
  image?: ImageData;
  badge?: string;
  category?: {
    id: number;
    name: string;
    slug: string;
  };
  features: FeatureTag[];
  detailedDescription?: string;
  price?: number;
  inStock: boolean;
  model3dUrl?: string;
  order: number;
  featured: boolean;
}

export interface ProcessedProductsPage {
  heroTitle: string;
  heroHighlightedText: string;
  heroSubtitle: string;
  backButtonText: string;
  productTypes: ProcessedProductType[];
  categories: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
}

export async function getProductsPage(): Promise<ProcessedProductsPage | null> {
  return getContentSection<ProcessedProductsPage>((content) => content.productsPage);
}

/**
 * Filter product types by category slug
 */
export function filterProductsByCategory(
  productTypes: ProcessedProductType[],
  categorySlug: string
): ProcessedProductType[] {
  if (categorySlug === "all" || !categorySlug) {
    return productTypes;
  }
  return productTypes.filter((pt) => pt.category?.slug === categorySlug);
}

/**
 * Get all unique categories from product types
 */
export function getProductCategories(
  productTypes: ProcessedProductType[]
): Array<{
  id: number;
  name: string;
  slug: string;
  count: number;
}> {
  const categoriesMap = new Map<
    number,
    { id: number; name: string; slug: string; count: number }
  >();

  productTypes.forEach((productType) => {
    if (productType.category) {
      const existing = categoriesMap.get(productType.category.id);
      if (existing) {
        existing.count++;
      } else {
        categoriesMap.set(productType.category.id, {
          ...productType.category,
          count: 1,
        });
      }
    }
  });

  return Array.from(categoriesMap.values());
}
