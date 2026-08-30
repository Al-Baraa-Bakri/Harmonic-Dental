import { getContentSection } from "../content";
import type { ImageData } from "../../types/content";

export interface ProcessedOurStory {
  // Header
  headerBadge: string;
  headerTitle: string;
  headerSubtitle: string;

  // Intro Story
  establishedYear: string;
  storyHeading: string;
  storyParagraph1: string;
  storyParagraph2: string;
  storyImage?: ImageData;
  storyImageFloatingText?: string;

  // Why Choose Us
  whyChooseUsHeading: string;
  whyChooseUsItems: Array<{
    id: number;
    title: string;
    description: string;
    order: number;
  }>;

  // Mission
  missionHeading: string;
  missionParagraph1: string;
  missionParagraph2: string;
  missionImage?: ImageData;
  testimonial?: {
    quote: string;
    author: string;
    authorTitle?: string;
  };
}

export async function getOurStorySection(): Promise<ProcessedOurStory | null> {
  return getContentSection<ProcessedOurStory>((content) => content.home.story);
}
