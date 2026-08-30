import type { ImageData } from "../types/content";

export function resolveMediaUrl(url?: string | null): string | null {
  return url || null;
}

export function getResponsiveImageUrl(
  imageData: ImageData | null | undefined,
  preferredSize: "thumbnail" | "small" | "medium" | "large" = "medium",
): string | null {
  if (!imageData) return null;

  const preferredUrl = imageData.formats?.[preferredSize]?.url;
  if (preferredUrl) return preferredUrl;

  for (const size of ["large", "medium", "small", "thumbnail"] as const) {
    const fallbackUrl = imageData.formats?.[size]?.url;
    if (fallbackUrl) return fallbackUrl;
  }

  return imageData.url || null;
}
