import { access, readFile } from "node:fs/promises";
import { join } from "node:path";
import { CONTENT_DATA_PATH } from "./content-shared.mjs";

const contentText = await readFile(CONTENT_DATA_PATH, "utf8");
const content = JSON.parse(contentText);
const errors = [];

if (content.schemaVersion !== 1) errors.push("Unsupported or missing schemaVersion");
for (const key of ["header", "footer", "contact", "home", "productsPage", "technologyPage"]) {
  if (!content[key]) errors.push(`Missing content section: ${key}`);
}

if (/strapiapp\.com|\/api\/(?:hero|footer|header|contact|product|technology)/i.test(contentText)) {
  errors.push("Canonical content contains a forbidden Strapi URL or endpoint");
}

const mediaUrls = new Set();
function collect(value) {
  if (!value || typeof value !== "object") return;
  for (const [key, child] of Object.entries(value)) {
    if (key === "url" && typeof child === "string" && child.startsWith("/images/strapi/")) {
      mediaUrls.add(child);
    } else {
      collect(child);
    }
  }
}
collect(content);

for (const url of mediaUrls) {
  const relativePath = decodeURIComponent(url.replace(/^\//, ""));
  try {
    await access(join("public", relativePath.replace(/^images[\\/]/, "images/")));
  } catch {
    errors.push(`Missing public image: ${url}`);
  }
}

if (mediaUrls.size === 0) errors.push("Canonical content has no local image URLs");
if (!Array.isArray(content.productsPage?.productTypes) || content.productsPage.productTypes.length === 0) {
  errors.push("Products page has no products");
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(
  `Validated canonical content with ${mediaUrls.size} local media URLs and no Strapi dependencies.`,
);
