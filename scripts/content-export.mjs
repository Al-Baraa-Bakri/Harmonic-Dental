import { readFile, writeFile } from "node:fs/promises";
import { basename } from "node:path";
import {
  CONTENT_DATA_PATH,
  IMAGE_MANIFEST_PATH,
  RAW_EXPORT_PATH,
  publicAssetUrl,
} from "./content-shared.mjs";

const snapshot = JSON.parse(await readFile(RAW_EXPORT_PATH, "utf8"));
const manifest = JSON.parse(await readFile(IMAGE_MANIFEST_PATH, "utf8"));
const knownFilenames = new Set(manifest.images.map((image) => image.filename));
const byPath = new Map(
  snapshot.entries.map((entry) => [entry.path, entry.response.data]),
);

function required(path) {
  const value = byPath.get(path);
  if (value === undefined || value === null) {
    throw new Error(`Raw export is missing ${path}`);
  }
  return value;
}

function unwrapMedia(media) {
  if (!media) return null;
  if (media.attributes) return media.attributes;
  if (media.data) {
    const value = Array.isArray(media.data) ? media.data[0] : media.data;
    return value?.attributes || value || null;
  }
  return media;
}

function filenameFromUrl(url) {
  const filename = basename(decodeURIComponent(new URL(url).pathname));
  if (!knownFilenames.has(filename)) {
    throw new Error(`Media is missing from the verified manifest: ${filename}`);
  }
  return filename;
}

function mapFormat(format) {
  if (!format?.url) return undefined;
  return {
    ...format,
    url: publicAssetUrl(filenameFromUrl(format.url)),
  };
}

function imageData(media) {
  const image = unwrapMedia(media);
  if (!image?.url) return undefined;

  const formats = image.formats
    ? Object.fromEntries(
        Object.entries(image.formats)
          .map(([name, format]) => [name, mapFormat(format)])
          .filter(([, format]) => Boolean(format)),
      )
    : null;

  return {
    url: publicAssetUrl(filenameFromUrl(image.url)),
    alternativeText: image.alternativeText || image.name || "",
    width: Number(image.width) || 0,
    height: Number(image.height) || 0,
    formats,
  };
}

const orderValue = (value) => (Number(value) === 0 ? 999 : Number(value) || 999);
const sortByOrder = (left, right) => orderValue(left.order) - orderValue(right.order);

const headerSource = required("/header-navigation");
const header = {
  logo: imageData(headerSource.logo),
  navigationItems: (headerSource.navigationItems || [])
    .map((item) => ({
      id: item.id,
      label: item.label || "",
      url: item.href || "",
      isExternal: Boolean(item.isExternal),
      order: Number(item.order) || 0,
    }))
    .sort(sortByOrder),
  phoneNumber: headerSource.phoneNumber || "",
  ctaButton: headerSource.ctaButton
    ? {
        label: headerSource.ctaButton.label || "",
        url: headerSource.ctaButton.url || "",
        isExternal: Boolean(headerSource.ctaButton.isExternal),
      }
    : undefined,
};

const footerSource = required("/footer");
const footer = {
  logo: imageData(footerSource.logo),
  description: footerSource.description || "",
  phoneNumber: footerSource.phoneNumber || "",
  email: footerSource.email || "",
  address: footerSource.address || "",
  navigationColumns: (footerSource.navigationColumns || [])
    .map((column) => ({
      id: column.id,
      title: column.title || "",
      links: (column.links || []).map((link) => ({
        id: link.id,
        label: link.name || "",
        url: link.href || "",
        isExternal: Boolean(link.isExternal),
      })),
      order: Number(column.order) || 0,
    }))
    .sort(sortByOrder),
  companyName: footerSource.companyName || "Harmonic Dental",
  socialLinks: (footerSource.socialLinks || []).map((social) => ({
    id: social.id,
    platform: social.platform || "",
    url: social.url || "",
    icon: social.icon || undefined,
  })),
};

const contactSource = required("/contact-section");
const contact = {
  headerBadge: contactSource.headerBadge || "Contact Us",
  headerTitle: contactSource.headerTitle || "To start your amazing journey",
  headerHighlightedText:
    contactSource.headerHighlightedText || "Get in touch with us",
  headerSubtitle:
    contactSource.headerSubtitle ||
    "We're here to help. Reach out to us through any of the channels below.",
  emails: (contactSource.emails || [])
    .map((item) => ({
      id: item.id,
      label: item.label || "",
      value: item.value || "",
      order: Number(item.order) || 0,
    }))
    .sort(sortByOrder),
  phones: (contactSource.phones || [])
    .map((item) => ({
      id: item.id,
      label: item.label || "",
      value: item.value || "",
      order: Number(item.order) || 0,
    }))
    .sort(sortByOrder),
  locationTitle: contactSource.locationTitle || undefined,
  address: contactSource.address || undefined,
  mapUrl: contactSource.mapUrl || contactSource.address || undefined,
  locations: (contactSource.locations || [])
    .map((item) => ({
      id: item.id,
      text: item.text || "",
      description: item.description || undefined,
      order: Number(item.order) || 0,
    }))
    .sort(sortByOrder),
};

const heroSource = required("/hero-section");
const hero = {
  badgeText: heroSource.badgeText || "",
  mainHeading: heroSource.mainHeading || "",
  highlightedText: heroSource.highlightedText || "",
  subtitle: heroSource.subtitle || "",
  backgroundImage: imageData(heroSource.backgroundImage),
  primaryButton: heroSource.primaryButton || undefined,
  secondaryButton: heroSource.secondaryButton || undefined,
  stats: [...(heroSource.stats || [])].sort(
    (left, right) => (Number(left.order) || 0) - (Number(right.order) || 0),
  ),
  showcaseProducts: (heroSource.showcaseProducts || []).map((product) => ({
    id: product.id || product.documentId,
    name: product.name || "",
    slug: product.slug || "",
    description: product.description || "",
    image: imageData(product.image),
    badge: product.badge || undefined,
    featured: Boolean(product.featured),
    order: Number(product.order) || 0,
  })),
};

const storySource = required("/our-story-section");
const story = {
  headerBadge: storySource.headerBadge || "About Us",
  headerTitle: storySource.headerTitle || "",
  headerSubtitle: storySource.headerSubtitle || "",
  establishedYear: storySource.establishedYear || "2018",
  storyHeading: storySource.storyHeading || "",
  storyParagraph1: storySource.storyParagraph1 || "",
  storyParagraph2: storySource.storyParagraph2 || "",
  storyImage: imageData(storySource.storyImage),
  storyImageFloatingText:
    storySource.storyImageFloatingText || "CAD/CAM Powered Innovation",
  whyChooseUsHeading: storySource.whyChooseUsHeading || "Why Partner With Us?",
  whyChooseUsItems: (storySource.whyChooseUsItems || [])
    .map((item) => ({
      id: item.id,
      title: item.title || "",
      description: item.description || "",
      order: Number(item.order) || 0,
    }))
    .sort((left, right) => left.order - right.order),
  missionHeading: storySource.missionHeading || "",
  missionParagraph1: storySource.missionParagraph1 || "",
  missionParagraph2: storySource.missionParagraph2 || "",
  missionImage: imageData(storySource.missionImage),
  testimonial: storySource.testimonial || undefined,
};

const servicesSource = required("/our-services-section");
const services = {
  headerBadge: servicesSource.headerBadge || "Our Services",
  headerTitle: servicesSource.headerTitle || "Precision-crafted solutions",
  headerHighlightedText:
    servicesSource.headerHighlightedText || "for every dental need",
  headerSubtitle:
    servicesSource.headerSubtitle ||
    "combining artistry with advanced technology.",
  services: (servicesSource.services || []).map((service) => ({
    id: service.id,
    title: service.title || "",
    image: imageData(service.image),
    items: (service.items || []).map((item) => ({
      id: item.id,
      text: item.text || "",
    })),
    order: Number(service.order) || 0,
  })),
};

const technologySource = required("/technology-section");
const technology = {
  headerBadge: technologySource.headerBadge || "Advanced Technology",
  headerTitle: technologySource.headerTitle || "",
  headerHighlightedText: technologySource.headerHighlightedText || "",
  headerSubtitle: technologySource.headerSubtitle || "",
  processSteps: (technologySource.processSteps || [])
    .map((step) => ({
      id: step.id,
      number: step.number || "",
      title: step.title || "",
      description: step.description || "",
      image: imageData(step.image),
      order: Number(step.order) || 0,
    }))
    .sort((left, right) => left.order - right.order),
  ctaButton: technologySource.ctaButton || undefined,
};

const productsPageSource = required("/products-page");
const productTypesSource = required("/product-types");
const productTypes = productTypesSource
  .map((product) => ({
    id: product.id || product.documentId,
    name: product.name || "",
    slug: product.slug || "",
    description: product.description || "",
    image: imageData(product.image),
    badge: product.badge || undefined,
    category: product.category
      ? {
          id: product.category.id || product.category.documentId,
          name: product.category.name || "",
          slug: product.category.slug || "",
        }
      : undefined,
    features: (product.features || [])
      .map((feature) => ({
        id: feature.id,
        name: feature.name || "",
        order: Number(feature.order) || 0,
      }))
      .sort(sortByOrder),
    detailedDescription: product.detailedDescription || undefined,
    price: product.price ?? undefined,
    inStock: product.inStock !== false,
    model3dUrl: product.model3dUrl || undefined,
    order: Number(product.order) || 0,
    featured: Boolean(product.featured),
  }))
  .sort(sortByOrder);

const categoryMap = new Map();
productTypes.forEach((product) => {
  if (product.category) categoryMap.set(product.category.id, product.category);
});
const productsPage = {
  heroTitle: productsPageSource.heroTitle || "Our",
  heroHighlightedText: productsPageSource.heroHighlightedText || "Products",
  heroSubtitle:
    productsPageSource.heroSubtitle ||
    "Explore our comprehensive range of precision-crafted dental prosthetics.",
  backButtonText: productsPageSource.backButtonText || "Back to Home",
  productTypes,
  categories: [...categoryMap.values()],
};

const technologyPageSource = required("/technology-page");
const technologyItemsSource = required("/technology-items");
const technologyPage = {
  heroTitle: technologyPageSource.heroTitle || "The Newest",
  heroHighlightedText:
    technologyPageSource.heroHighlightedText || "Technology",
  heroSubtitle:
    technologyPageSource.heroSubtitle ||
    "Explore cutting-edge dental technology that transforms precision and efficiency in every restoration.",
  backButtonText: technologyPageSource.backButtonText || "Back to Home",
  sectionTitle: technologyPageSource.sectionTitle || undefined,
  sectionDescription: technologyPageSource.sectionDescription || undefined,
  technologyItems: technologyItemsSource.map((item) => {
    const rawImages = Array.isArray(item.image)
      ? [...item.image]
      : item.image?.data
        ? Array.isArray(item.image.data)
          ? [...item.image.data]
          : [item.image.data]
        : item.image
          ? [item.image]
          : [];
    rawImages.sort((left, right) =>
      String(left.createdAt || left.attributes?.createdAt || "").localeCompare(
        String(right.createdAt || right.attributes?.createdAt || ""),
      ),
    );
    return {
      id: item.id || item.documentId,
      name: item.name || "",
      slug: item.slug || "",
      description: item.description || "",
      images: rawImages.map(imageData).filter(Boolean),
      badge: item.badge || undefined,
      features: (item.features || [])
        .map((feature) => ({
          id: feature.id,
          name: feature.name || "",
          order: Number(feature.order) || 0,
        }))
        .sort(sortByOrder),
      detailedDescription: item.detailedDescription || undefined,
      videoUrl: item.videoUrl || undefined,
      order: Number(item.order) || 0,
      featured: Boolean(item.featured),
      icon: item.icon || undefined,
    };
  }),
};

const content = {
  schemaVersion: 1,
  exportedAt: snapshot.exportedAt,
  header,
  footer,
  contact,
  home: { hero, story, technology, services },
  productsPage,
  technologyPage,
};

await writeFile(CONTENT_DATA_PATH, `${JSON.stringify(content, null, 2)}\n`);
console.log(
  `Generated ${CONTENT_DATA_PATH} with ${productTypes.length} products and ${technologyPage.technologyItems.length} technology items.`,
);
