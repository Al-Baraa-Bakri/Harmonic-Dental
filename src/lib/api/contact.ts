import { getContentSection } from "../content";

// Types
export interface ContactItem {
  id: number;
  label: string;
  value: string;
  order: number;
}

export interface ProcessedContactSection {
  headerBadge: string;
  headerTitle: string;
  headerHighlightedText: string;
  headerSubtitle: string;
  emails: ContactItem[];
  phones: ContactItem[];
  locationTitle?: string;
  address?: string;
  mapUrl?: string;
  locations?: Array<{
    id: number;
    text: string;
    description?: string;
    order: number;
  }>;
}

export async function getContactSection(): Promise<ProcessedContactSection | null> {
  return getContentSection<ProcessedContactSection>((content) => content.contact);
}
