import content from "../data/site-content.json";

export interface SiteContent {
  schemaVersion: number;
  exportedAt: string;
  header: unknown;
  footer: unknown;
  contact: unknown;
  home: {
    hero: unknown;
    story: unknown;
    technology: unknown;
    services: unknown;
  };
  productsPage: unknown;
  technologyPage: unknown;
}

const siteContent = content as SiteContent;

if (siteContent.schemaVersion !== 1) {
  throw new Error(`Unsupported site content schema: ${siteContent.schemaVersion}`);
}

export function getContentSection<T>(selector: (value: SiteContent) => unknown): T {
  return selector(siteContent) as T;
}
