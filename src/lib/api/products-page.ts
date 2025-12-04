import { fetchAPI, getImageData } from "../strapi";
import type { StrapiResponse } from "../../types/strapi";

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
  image?: {
    url: string;
    alternativeText: string;
    width: number;
    height: number;
  };
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

/**
 * Get Products Page data from Strapi
 *
 * Strapi Structure:
 * - Products Page (Single Type)
 *   - API ID: products-page
 *   - heroTitle: "Our"
 *   - heroHighlightedText: "Products"
 *   - heroSubtitle: "Explore our comprehensive..."
 *   - backButtonText: "Back to Home"
 *   - product_types (One-to-Many relation to Product Type collection):
 *     - name, slug, description, image, badge
 *     - category (Many-to-One relation to Product)
 *     - features, order, featured, inStock, etc.
 */
export async function getProductsPage(): Promise<ProcessedProductsPage | null> {
  try {
    // First, get the products page with product_types
    const response = await fetchAPI<StrapiResponse<any>>("/products-page", {
      populate: ["product_types"],
    });

    if (!response.data) {
      console.warn("[Products Page API] No data found in response");
      return null;
    }

    const attrs = response.data;

    // Now fetch each product type with its relations
    let productTypesData: any[] = [];

    if (Array.isArray(attrs.product_types) && attrs.product_types.length > 0) {
      // Fetch all product types with their relations
      const productTypesResponse = await fetchAPI<StrapiResponse<any[]>>(
        "/product-types",
        {
          populate: ["image", "category", "features"],
          filters: {
            id: {
              $in: attrs.product_types.map((pt: any) => pt.id || pt.documentId),
            },
          },
          sort: ["order:asc"],
        }
      );

      if (productTypesResponse.data) {
        productTypesData = Array.isArray(productTypesResponse.data)
          ? productTypesResponse.data
          : [productTypesResponse.data];
      }
    }

    if (!response.data) {
      console.warn("[Products Page API] No data found in response");
      return null;
    }

    // Process product types and sort manually
    const productTypes = Array.isArray(productTypesData)
      ? productTypesData
          .map((productType: any) => {
            // Process features
            const features = Array.isArray(productType.features)
              ? productType.features
                  .map((feature: any) => ({
                    id: feature.id,
                    name: feature.name || "",
                    order: feature.order || 0,
                  }))
                  .sort((a: FeatureTag, b: FeatureTag) => {
                    const orderA = a.order === 0 ? 999 : a.order;
                    const orderB = b.order === 0 ? 999 : b.order;
                    return orderA - orderB;
                  })
              : [];

            // Process category
            let category;
            if (productType.category) {
              category = {
                id: productType.category.id || productType.category.documentId,
                name: productType.category.name || "",
                slug: productType.category.slug || "",
              };
            }

            return {
              id: productType.id || productType.documentId,
              name: productType.name || "",
              slug: productType.slug || "",
              description: productType.description || "",
              image: productType.image
                ? getImageData(productType.image)
                : undefined,
              badge: productType.badge || undefined,
              category,
              features,
              detailedDescription: productType.detailedDescription || undefined,
              price: productType.price || undefined,
              inStock: productType.inStock !== false, // Default to true
              model3dUrl: productType.model3dUrl || undefined,
              order: productType.order || 0,
              featured: productType.featured || false,
            };
          })
          .sort((a, b) => {
            // Sort by order (1 is first, 0 is last)
            const orderA = a.order === 0 ? 999 : a.order;
            const orderB = b.order === 0 ? 999 : b.order;
            return orderA - orderB;
          })
      : [];

    // Extract unique categories from product types
    const categoriesMap = new Map<
      number,
      { id: number; name: string; slug: string }
    >();
    productTypes.forEach((productType) => {
      if (productType.category) {
        categoriesMap.set(productType.category.id, productType.category);
      }
    });
    const categories = Array.from(categoriesMap.values());

    const result = {
      heroTitle: attrs.heroTitle || "Our",
      heroHighlightedText: attrs.heroHighlightedText || "Products",
      heroSubtitle:
        attrs.heroSubtitle ||
        "Explore our comprehensive range of precision-crafted dental prosthetics.",
      backButtonText: attrs.backButtonText || "Back to Home",
      productTypes,
      categories,
    };

    return result as any;
  } catch (error) {
    console.error("[Products Page API] ❌ Error:", error);
    if (error instanceof Error) {
      console.error("[Products Page API] Error details:", error.message);
    }
    return null;
  }
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
