import { getContentSection } from "../content";

// Types
export interface FooterLink {
  id: number;
  label: string;
  url: string;
  isExternal: boolean;
}

export interface FooterColumn {
  id: number;
  title: string;
  links: FooterLink[];
  order: number;
}

export interface SocialLink {
  id: number;
  platform: string;
  url: string;
  icon?: string;
}

export interface ProcessedFooter {
  logo?: {
    url: string;
    alternativeText: string;
    width: number;
    height: number;
  } | any;
  description: string;
  phoneNumber: string;
  email: string;
  address: string;
  navigationColumns: FooterColumn[];
  companyName: string;
  socialLinks: SocialLink[];
}

export async function getFooter(): Promise<ProcessedFooter | null> {
  return getContentSection<ProcessedFooter>((content) => content.footer);
}
