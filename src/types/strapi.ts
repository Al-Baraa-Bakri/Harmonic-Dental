// Base Strapi Response Types
export interface StrapiResponse<T> {
  data: T;
  meta?: StrapiMeta;
}

export interface StrapiMeta {
  pagination?: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
}

export interface StrapiEntity<T> {
  id: number;
  attributes: T;
}

export interface StrapiImage {
  id: number;
  attributes: {
    name: string;
    alternativeText: string | null;
    caption: string | null;
    width: number;
    height: number;
    formats: {
      thumbnail?: ImageFormat;
      small?: ImageFormat;
      medium?: ImageFormat;
      large?: ImageFormat;
    };
    hash: string;
    ext: string;
    mime: string;
    size: number;
    url: string;
    previewUrl: string | null;
    provider: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface ImageFormat {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  width: number;
  height: number;
  size: number;
  path: string | null;
  url: string;
}

export interface StrapiMediaField {
  data: StrapiImage | StrapiImage[] | null;
}

// Component Types
export interface ButtonComponent {
  id: number;
  label: string;
  url: string;
  isExternal: boolean;
}

export interface StatComponent {
  id: number;
  value: string;
  label: string;
  order: number;
}

// Hero Section Types
export interface HeroSectionAttributes {
  badgeText: string;
  mainHeading: string;
  highlightedText: string;
  subtitle: string;
  backgroundImage: StrapiMediaField;
  primaryButton: ButtonComponent;
  secondaryButton: ButtonComponent;
  stats: StatComponent[];
  showcaseProducts?: {
    data: StrapiEntity<ProductAttributes>[];
  };
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export type HeroSection = StrapiEntity<HeroSectionAttributes>;

// Product Types
export interface ProductAttributes {
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  image: StrapiMediaField;
  badge?: string;
  featured: boolean;
  category?: string;
  order: number;
  detailedDescription?: string;
  price?: number;
  inStock: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export type Product = StrapiEntity<ProductAttributes>;

// Helper Types for Frontend
export interface ImageData {
  url: string;
  alternativeText: string;
  width: number;
  height: number;
}

export interface ProcessedProduct {
  id: number;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  image?: any;
  badge?: string;
  featured: boolean;
  category?: string;
  order: number;
  detailedDescription?: string;
  price?: number;
  inStock?: boolean;
}

export interface ProcessedHeroSection {
  badgeText: string;
  mainHeading: string;
  highlightedText: string;
  subtitle: string;
  backgroundImage?: any;
  primaryButton: ButtonComponent;
  secondaryButton: ButtonComponent;
  stats: StatComponent[];
  showcaseProducts: ProcessedProduct[];
}

export interface ProcessedTechnology {
  headerBadge: string;
  headerTitle: string;
  headerHighlightedText: string;
  headerSubtitle: string;
  processSteps: any[];
  ctaButton: {
    label: string;
    url: string;
    isExternal: boolean;
  };
}
