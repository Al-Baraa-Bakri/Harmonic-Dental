import { fetchAPI, getImageData } from "../strapi";
import type { StrapiResponse } from "../../types/strapi";

export interface ProcessedTechnology {
  headerBadge: string;
  headerTitle: string;
  headerHighlightedText: string;
  headerSubtitle: string;
  processSteps: any[];
  ctaButton?: {
    label: string;
    url: string;
    isExternal: boolean;
  };
}

export async function getTechnologySection(): Promise<ProcessedTechnology | null> {
  try {
    const response = await fetchAPI<StrapiResponse<any>>(
      "/technology-section",
      {
        populate: ["processSteps", "processSteps.image", "ctaButton"],
      }
    );

    if (!response.data) {
      console.warn("[Technology API] No data found");
      return null;
    }

    const attrs = response.data;

    // Process steps
    const processSteps = Array.isArray(attrs.processSteps)
      ? attrs.processSteps
          .map((step: any) => ({
            id: step.id,
            number: step.number || "",
            title: step.title || "",
            description: step.description || "",
            image: step.image ? getImageData(step.image) : undefined,
            order: step.order || 0,
          }))
          .sort((a: any, b: any) => a.order - b.order)
      : [];

    return {
      headerBadge: attrs.headerBadge || "Advanced Technology",
      headerTitle: attrs.headerTitle || "",
      headerHighlightedText: attrs.headerHighlightedText || "",
      headerSubtitle: attrs.headerSubtitle || "",
      processSteps,
      ctaButton: attrs.ctaButton || undefined,
    };
  } catch (error) {
    console.error("[Technology API] Error:", error);
    return null;
  }
}
