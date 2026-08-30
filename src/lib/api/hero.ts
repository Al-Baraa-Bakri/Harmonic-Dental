import { getContentSection } from "../content";
import type { ProcessedHeroSection } from "../../types/content";

export async function getHeroSection(): Promise<ProcessedHeroSection | null> {
  return getContentSection<ProcessedHeroSection>((content) => content.home.hero);
}

export function isHeroSectionValid(hero: ProcessedHeroSection | null): boolean {
  if (!hero) return false;
  return !!(hero.mainHeading && hero.highlightedText && hero.subtitle);
}
