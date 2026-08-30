import { getContentSection } from "../content";
import type { ImageData } from "../../types/content";

// Types
export interface ServiceItem {
  id: number;
  text: string;
}

export interface ProcessedService {
  id: number;
  title: string;
  image?: ImageData;
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

export async function getServicesSection(): Promise<ProcessedServices | null> {
  return getContentSection<ProcessedServices>((content) => content.home.services);
}
