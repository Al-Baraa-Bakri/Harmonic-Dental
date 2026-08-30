import { getContentSection } from "../content";
import type { ImageData } from "../../types/content";

export interface ProcessStep {
  id: number;
  number: string;
  title: string;
  description: string;
  image?: ImageData;
  order: number;
}

export interface ProcessedTechnology {
  headerBadge: string;
  headerTitle: string;
  headerHighlightedText: string;
  headerSubtitle: string;
  processSteps: ProcessStep[];
  ctaButton?: {
    label: string;
    url: string;
    isExternal: boolean;
  };
}

export async function getTechnologySection(): Promise<ProcessedTechnology | null> {
  return getContentSection<ProcessedTechnology>((content) => content.home.technology);
}
