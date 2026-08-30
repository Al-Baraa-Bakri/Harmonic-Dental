// Central exports for repository-owned site content.

// Hero Section API
export { getHeroSection, isHeroSectionValid } from "./hero";

export { getTechnologySection } from "./technology";
export type { ProcessedTechnology } from "./technology";
export { getServicesSection } from "./services";
// Types
export type {
  ImageData,
  ProcessedProduct,
  ProcessedHeroSection,
  ButtonComponent,
  StatComponent,
} from "../../types/content";

export { getOurStorySection } from "./story";

export type { ProcessedOurStory } from "./story";
