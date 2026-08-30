import { createHash } from "node:crypto";
import { basename } from "node:path";

export const DEFAULT_STRAPI_URL =
  "https://legendary-delight-abce3e6fc0.strapiapp.com";
export const IMAGE_OUTPUT_DIR = "public/images/strapi";
export const IMAGE_MANIFEST_PATH = "content/images/strapi-manifest.json";
export const RAW_EXPORT_PATH = "content/strapi-raw-export.json";
export const CONTENT_DATA_PATH = "src/data/site-content.json";

const sleep = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

export function buildQuery(value, prefix = "", target = new URLSearchParams()) {
  if (value === undefined || value === null) return target;

  if (Array.isArray(value)) {
    value.forEach((entry, index) =>
      buildQuery(entry, `${prefix}[${index}]`, target),
    );
    return target;
  }

  if (typeof value === "object") {
    Object.entries(value).forEach(([key, entry]) => {
      const nextPrefix = prefix ? `${prefix}[${key}]` : key;
      buildQuery(entry, nextPrefix, target);
    });
    return target;
  }

  target.append(prefix, String(value));
  return target;
}

export async function fetchWithRetry(url, options = {}, attempts = 5) {
  let lastError;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, {
        signal: AbortSignal.timeout(90_000),
        ...options,
      });

      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }

      return response;
    } catch (error) {
      lastError = error;
      if (attempt < attempts) await sleep(attempt * 1_000);
    }
  }

  throw new Error(`Failed after ${attempts} attempts: ${url}`, {
    cause: lastError,
  });
}

async function fetchEndpoint(strapiUrl, path, params = {}) {
  const query = buildQuery(params).toString();
  const url = `${strapiUrl}/api${path}${query ? `?${query}` : ""}`;
  const response = await fetchWithRetry(url);
  const body = await response.json();

  if (!("data" in body) || body.data === null) {
    throw new Error(`Strapi returned no data for ${path}`);
  }

  return { path, params, requestUrl: url, response: body };
}

export async function fetchSiteSnapshot(
  strapiUrl = process.env.STRAPI_URL || DEFAULT_STRAPI_URL,
) {
  const normalizedBaseUrl = strapiUrl.replace(/\/$/, "");
  const entries = [];

  entries.push(
    await fetchEndpoint(normalizedBaseUrl, "/hero-section", {
      populate: [
        "backgroundImage",
        "primaryButton",
        "secondaryButton",
        "stats",
        "showcaseProducts",
        "showcaseProducts.image",
      ],
    }),
    await fetchEndpoint(normalizedBaseUrl, "/header-navigation", {
      populate: ["logo", "navigationItems", "ctaButton"],
    }),
    await fetchEndpoint(normalizedBaseUrl, "/footer", {
      populate: [
        "logo",
        "navigationColumns",
        "navigationColumns.links",
        "socialLinks",
      ],
    }),
    await fetchEndpoint(normalizedBaseUrl, "/contact-section", {
      populate: ["emails", "phones", "locations"],
    }),
    await fetchEndpoint(normalizedBaseUrl, "/our-story-section", {
      populate: ["storyImage", "whyChooseUsItems"],
    }),
    await fetchEndpoint(normalizedBaseUrl, "/our-services-section", {
      populate: { services: { populate: "*" } },
    }),
    await fetchEndpoint(normalizedBaseUrl, "/technology-section", {
      populate: ["processSteps", "processSteps.image", "ctaButton"],
    }),
  );

  const productsPage = await fetchEndpoint(
    normalizedBaseUrl,
    "/products-page",
    { populate: ["product_types"] },
  );
  entries.push(productsPage);

  const relatedProductIds = Array.isArray(productsPage.response.data.product_types)
    ? productsPage.response.data.product_types
        .map((product) => product.id || product.documentId)
        .filter(Boolean)
    : [];

  if (relatedProductIds.length > 0) {
    entries.push(
      await fetchEndpoint(normalizedBaseUrl, "/product-types", {
        pagination: { limit: 100 },
        populate: ["image", "category", "features"],
        filters: { id: { $in: relatedProductIds } },
        sort: ["order:asc"],
      }),
    );
  } else {
    throw new Error("Products page has no related product types");
  }

  entries.push(
    await fetchEndpoint(normalizedBaseUrl, "/technology-page"),
    await fetchEndpoint(normalizedBaseUrl, "/technology-items", {
      populate: ["image", "features"],
      sort: ["order:asc", "createdAt:desc"],
    }),
  );

  return {
    exportedAt: new Date().toISOString(),
    source: normalizedBaseUrl,
    entries,
  };
}

function isImageObject(value) {
  if (!value || typeof value !== "object" || typeof value.url !== "string") {
    return false;
  }

  return (
    String(value.mime || "").startsWith("image/") ||
    /\.(?:avif|gif|jpe?g|png|svg|webp)(?:\?.*)?$/i.test(value.url)
  );
}

function sourceFilename(url) {
  const filename = basename(decodeURIComponent(new URL(url).pathname));
  if (!filename || filename === "." || filename === "/") {
    throw new Error(`Unable to determine filename for ${url}`);
  }
  return filename;
}

export function collectImageInventory(snapshot) {
  const byUrl = new Map();
  const filenameToUrl = new Map();

  function visit(value, context) {
    if (!value || typeof value !== "object") return;

    if (isImageObject(value)) {
      const url = value.url;
      const filename = sourceFilename(url);
      const existingUrl = filenameToUrl.get(filename);

      if (existingUrl && existingUrl !== url) {
        throw new Error(
          `Filename collision: ${filename}\n- ${existingUrl}\n- ${url}`,
        );
      }

      filenameToUrl.set(filename, url);
      const existing = byUrl.get(url);
      const reference = `${context.endpoint}:${context.path}`;

      if (existing) {
        if (!existing.references.includes(reference)) {
          existing.references.push(reference);
        }
      } else {
        byUrl.set(url, {
          sourceUrl: url,
          filename,
          byteSize: 0,
          mimeType: value.mime || "",
          width: Number(value.width) || 0,
          height: Number(value.height) || 0,
          sha256: "",
          responsiveFormat: context.format || "original",
          references: [reference],
        });
      }
    }

    Object.entries(value).forEach(([key, child]) => {
      const format = ["thumbnail", "small", "medium", "large"].includes(key)
        ? key
        : context.format;
      visit(child, {
        endpoint: context.endpoint,
        path: `${context.path}.${key}`,
        format,
      });
    });
  }

  snapshot.entries.forEach((entry) => {
    visit(entry.response, {
      endpoint: entry.path,
      path: "response",
      format: "",
    });
  });

  return [...byUrl.values()].sort((left, right) =>
    left.filename.localeCompare(right.filename),
  );
}

export function sha256(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

export function detectImageType(buffer) {
  if (buffer.length < 12) return null;
  if (buffer.subarray(0, 8).equals(Buffer.from("89504e470d0a1a0a", "hex"))) {
    return "image/png";
  }
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "image/jpeg";
  }
  if (
    buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
    buffer.subarray(8, 12).toString("ascii") === "WEBP"
  ) {
    return "image/webp";
  }
  if (["GIF87a", "GIF89a"].includes(buffer.subarray(0, 6).toString("ascii"))) {
    return "image/gif";
  }
  const prefix = buffer.subarray(0, 512).toString("utf8").trimStart();
  if (prefix.startsWith("<svg") || prefix.startsWith("<?xml")) {
    return "image/svg+xml";
  }
  return null;
}

export function publicAssetUrl(filename, assetBaseUrl = "/images/strapi") {
  return `${assetBaseUrl.replace(/\/$/, "")}/${encodeURIComponent(filename)}`;
}
