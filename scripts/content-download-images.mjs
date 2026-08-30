import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import {
  IMAGE_MANIFEST_PATH,
  IMAGE_OUTPUT_DIR,
  RAW_EXPORT_PATH,
  collectImageInventory,
  detectImageType,
  fetchSiteSnapshot,
  fetchWithRetry,
  sha256,
} from "./content-shared.mjs";

const concurrency = 8;
const snapshot = await fetchSiteSnapshot();
const inventory = collectImageInventory(snapshot);

await mkdir(IMAGE_OUTPUT_DIR, { recursive: true });
await mkdir(dirname(RAW_EXPORT_PATH), { recursive: true });

let nextIndex = 0;
async function worker() {
  while (nextIndex < inventory.length) {
    const index = nextIndex;
    nextIndex += 1;
    const item = inventory[index];
    const response = await fetchWithRetry(item.sourceUrl);
    const buffer = Buffer.from(await response.arrayBuffer());
    const detectedMime = detectImageType(buffer);

    if (!detectedMime) {
      throw new Error(`Downloaded file is not a supported image: ${item.sourceUrl}`);
    }

    const responseMime = response.headers.get("content-type")?.split(";")[0] || "";
    item.byteSize = buffer.length;
    item.sha256 = sha256(buffer);
    item.mimeType = item.mimeType || responseMime || detectedMime;
    item.detectedMimeType = detectedMime;

    await writeFile(join(IMAGE_OUTPUT_DIR, item.filename), buffer);
    process.stdout.write(`Downloaded ${index + 1}/${inventory.length}: ${item.filename}\n`);
  }
}

await Promise.all(
  Array.from({ length: Math.min(concurrency, inventory.length) }, () => worker()),
);

const manifest = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  source: snapshot.source,
  imageDirectory: IMAGE_OUTPUT_DIR,
  count: inventory.length,
  totalBytes: inventory.reduce((total, item) => total + item.byteSize, 0),
  images: inventory,
};

await writeFile(IMAGE_MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`);
await writeFile(RAW_EXPORT_PATH, `${JSON.stringify(snapshot, null, 2)}\n`);

console.log(
  `Saved ${manifest.count} images (${(manifest.totalBytes / 1024 / 1024).toFixed(2)} MiB).`,
);
console.log(`Manifest: ${IMAGE_MANIFEST_PATH}`);
console.log(`Raw content archive: ${RAW_EXPORT_PATH}`);
