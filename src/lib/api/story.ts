import { fetchAPI, getImageData } from "../strapi";
import type { StrapiResponse } from "../../types/strapi";

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
  storyImage?: {
    url: string;
    alternativeText: string;
    width: number;
    height: number;
  };
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
  missionImage?: {
    url: string;
    alternativeText: string;
    width: number;
    height: number;
  };
  testimonial?: {
    quote: string;
    author: string;
    authorTitle?: string;
  };
}

export async function getOurStorySection(): Promise<ProcessedOurStory | null> {
  try {
    const response = await fetchAPI<StrapiResponse<any>>("/our-story-section", {
      populate: ["storyImage", "whyChooseUsItems"],
    });

    if (!response.data) {
      console.warn("[Story API] No data found");
      return null;
    }

    const attrs = response.data;


    // Process why choose us items
    const whyChooseUsItems =
      Array.isArray(attrs.whyChooseUsItems) && attrs.whyChooseUsItems.length > 0
        ? attrs.whyChooseUsItems
            .map((item: any) => ({
              id: item.id,
              title: item.title || "",
              description: item.description || "",
              order: item.order || 0,
            }))
            .sort((a: any, b: any) => a.order - b.order)
        : [];

    const result = {
      // Header
      headerBadge: attrs.headerBadge || "About Us",
      headerTitle: attrs.headerTitle || "",
      headerSubtitle: attrs.headerSubtitle || "",

      // Intro Story
      establishedYear: attrs.establishedYear || "2018",
      storyHeading: attrs.storyHeading || "",
      storyParagraph1: attrs.storyParagraph1 || "",
      storyParagraph2: attrs.storyParagraph2 || "",
      storyImage: attrs.storyImage ? getImageData(attrs.storyImage) : undefined,
      storyImageFloatingText:
        attrs.storyImageFloatingText || "CAD/CAM Powered Innovation",

      // Why Choose Us
      whyChooseUsHeading: attrs.whyChooseUsHeading || "Why Partner With Us?",
      whyChooseUsItems,

      // Mission
      missionHeading: attrs.missionHeading || "",
      missionParagraph1: attrs.missionParagraph1 || "",
      missionParagraph2: attrs.missionParagraph2 || "",
      missionImage: attrs.missionImage
        ? getImageData(attrs.missionImage)
        : undefined,
      testimonial: attrs.testimonial || undefined,
    };

    return result as any;
  } catch (error) {
    console.error("[Story API] Error:", error);
    return null;
  }
}
