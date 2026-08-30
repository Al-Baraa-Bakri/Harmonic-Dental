import { getContentSection } from "../content";
import type { ImageData } from "../../types/content";

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

export async function getTechnologyPage(): Promise<ProcessedTechnologyPage | null> {
  return getContentSection<ProcessedTechnologyPage>((content) => content.technologyPage);
}
