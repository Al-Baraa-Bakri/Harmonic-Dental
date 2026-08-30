export interface ImageFormat {
  name?: string;
  hash?: string;
  ext?: string;
  mime?: string;
  width: number;
  height: number;
  size?: number;
  path?: string | null;
  url: string;
}

export interface ImageData {
  url: string;
  alternativeText: string;
  width: number;
  height: number;
  formats?: {
    thumbnail?: ImageFormat;
    small?: ImageFormat;
    medium?: ImageFormat;
    large?: ImageFormat;
  } | null;
}

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

export interface ProcessedProduct {
  id: number;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  image?: ImageData;
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
  backgroundImage?: ImageData;
  primaryButton?: ButtonComponent;
  secondaryButton?: ButtonComponent;
  stats: StatComponent[];
  showcaseProducts: ProcessedProduct[];
}
