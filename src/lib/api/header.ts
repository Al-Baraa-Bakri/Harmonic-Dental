import { getContentSection } from "../content";

// Types
export interface NavigationItem {
  id: number;
  label: string;
  url: string;
  isExternal: boolean;
  order: number;
}

export interface ProcessedHeaderNavigation {
  logo?: {
    url: string;
    alt: string;
    width: number;
    height: number;
  } | any;
  navigationItems: NavigationItem[];
  phoneNumber: string;
  ctaButton?: {
    label: string;
    url: string;
    isExternal: boolean;
  };
}

export async function getHeaderNavigation(): Promise<ProcessedHeaderNavigation | null> {
  return getContentSection<ProcessedHeaderNavigation>((content) => content.header);
}
