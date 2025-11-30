// Central API exports for Strapi data fetching

// Hero Section API
export { getHeroSection, isHeroSectionValid } from "./hero";

export { getTechnologySection } from "./technology";
export type { ProcessedTechnology } from "./technology";
export { getServicesSection } from "./services";
// Products API
export {
  getAllProducts,
  getFeaturedProducts,
  getProductBySlug,
  getAllProductSlugs,
  getProductsByCategory,
  getInStockProducts,
  getProductCategories,
} from "./products";

// Core Strapi utilities
export { fetchAPI, getStrapiURL, getImageData, getImagesData } from "../strapi";

// Types
export type {
  StrapiResponse,
  StrapiEntity,
  StrapiImage,
  StrapiMediaField,
  ImageData,
  ProcessedProduct,
  ProcessedHeroSection,
  ButtonComponent,
  StatComponent,
} from "../../types/strapi";

export { getOurStorySection } from "./story";

export type { ProcessedOurStory } from "./story";
