import { fetchAPI, getImageData, getImagesData } from '../strapi';
import type {
  StrapiResponse,
  Product,
  ProcessedProduct,
} from '../../types/strapi';

// Fetch all products
export async function getAllProducts(
  filters: Record<string, any> = {}
): Promise<ProcessedProduct[]> {
  try {
    const response = await fetchAPI<StrapiResponse<Product[]>>('/products', {
      populate: '*',
      filters,
      sort: ['order:asc', 'createdAt:desc'],
      pagination: {
        pageSize: 100,
      },
    });

    if (!response.data || response.data.length === 0) {
      console.warn('[Products API] No products found');
      return [];
    }

    return response.data.map((product) => processProduct(product));
  } catch (error) {
    console.error('[Products API] Error fetching products:', error);
    return [];
  }
}

// Fetch featured products only
export async function getFeaturedProducts(
  limit: number = 6
): Promise<ProcessedProduct[]> {
  try {
    const response = await fetchAPI<StrapiResponse<Product[]>>('/products', {
      populate: '*',
      filters: {
        featured: true,
      },
      sort: ['order:asc', 'createdAt:desc'],
      pagination: {
        pageSize: limit,
      },
    });

    if (!response.data || response.data.length === 0) {
      console.warn('[Products API] No featured products found');
      return [];
    }

    return response.data.map((product) => processProduct(product));
  } catch (error) {
    console.error('[Products API] Error fetching featured products:', error);
    return [];
  }
}

// Fetch a single product by slug
export async function getProductBySlug(
  slug: string
): Promise<ProcessedProduct | null> {
  try {
    const response = await fetchAPI<StrapiResponse<Product[]>>('/products', {
      populate: '*',
      filters: {
        slug: {
          $eq: slug,
        },
      },
    });

    if (!response.data || response.data.length === 0) {
      console.warn(`[Products API] Product not found: ${slug}`);
      return null;
    }

    return processProduct(response.data[0]);
  } catch (error) {
    console.error(`[Products API] Error fetching product "${slug}":`, error);
    return null;
  }
}

// Get all product slugs (for generating static paths)
export async function getAllProductSlugs(): Promise<string[]> {
  try {
    const response = await fetchAPI<StrapiResponse<Product[]>>('/products', {
      fields: ['slug'],
      pagination: {
        pageSize: 100,
      },
    });

    if (!response.data || response.data.length === 0) {
      console.warn('[Products API] No product slugs found');
      return [];
    }

    return response.data.map((product) => product.attributes.slug);
  } catch (error) {
    console.error('[Products API] Error fetching product slugs:', error);
    return [];
  }
}

// Get products by category
export async function getProductsByCategory(
  category: string
): Promise<ProcessedProduct[]> {
  return getAllProducts({
    category: {
      $eq: category,
    },
  });
}

// Get in-stock products only
export async function getInStockProducts(): Promise<ProcessedProduct[]> {
  return getAllProducts({
    inStock: true,
  });
}

// Process a single product entity
function processProduct(product: Product): ProcessedProduct {
  return {
    id: product.id,
    name: product.attributes.name,
    slug: product.attributes.slug,
    description: product.attributes.description,
    shortDescription: product.attributes.shortDescription,
    image: getImageData(product.attributes.image) || undefined,
    badge: product.attributes.badge,
    featured: product.attributes.featured,
    category: product.attributes.category,
    order: product.attributes.order,
    detailedDescription: product.attributes.detailedDescription,
    price: product.attributes.price,
    inStock: product.attributes.inStock,
  };
}

// Get unique categories from all products
export async function getProductCategories(): Promise<string[]> {
  const products = await getAllProducts();
  const categories = new Set<string>();

  products.forEach((product) => {
    if (product.category) {
      categories.add(product.category);
    }
  });

  return Array.from(categories).sort();
}