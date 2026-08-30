import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import {
  IMAGE_MANIFEST_PATH,
  IMAGE_OUTPUT_DIR,
  detectImageType,
  sha256,
} from "./content-shared.mjs";

const manifest = JSON.parse(await readFile(IMAGE_MANIFEST_PATH, "utf8"));
const files = await readdir(IMAGE_OUTPUT_DIR);
const expectedFiles = new Set(manifest.images.map((image) => image.filename));
const unexpectedFiles = files.filter((filename) => !expectedFiles.has(filename));
const errors = [];
let totalBytes = 0;

if (manifest.count !== manifest.images.length) {
  errors.push(`Manifest count is ${manifest.count}, found ${manifest.images.length} entries`);
}

if (unexpectedFiles.length > 0) {
  errors.push(`Unexpected files: ${unexpectedFiles.join(", ")}`);
}

const duplicateFilenames = manifest.images
  .map((image) => image.filename)
  .filter((filename, index, all) => all.indexOf(filename) !== index);
if (duplicateFilenames.length > 0) {
  errors.push(`Duplicate filenames: ${[...new Set(duplicateFilenames)].join(", ")}`);
}

for (const image of manifest.images) {
  try {
    const buffer = await readFile(join(IMAGE_OUTPUT_DIR, image.filename));
    totalBytes += buffer.length;
    if (buffer.length === 0) errors.push(`${image.filename}: empty file`);
    if (buffer.length !== image.byteSize) {
      errors.push(`${image.filename}: expected ${image.byteSize} bytes, found ${buffer.length}`);
    }
    if (sha256(buffer) !== image.sha256) {
      errors.push(`${image.filename}: checksum mismatch`);
    }
    const detectedMime = detectImageType(buffer);
    if (!detectedMime) errors.push(`${image.filename}: unsupported or corrupt image`);
    if (image.detectedMimeType && detectedMime !== image.detectedMimeType) {
      errors.push(
        `${image.filename}: expected ${image.detectedMimeType}, detected ${detectedMime}`,
      );
    }
  } catch (error) {
    errors.push(`${image.filename}: ${error.message}`);
  }
}

if (totalBytes !== manifest.totalBytes) {
  errors.push(`Expected ${manifest.totalBytes} total bytes, found ${totalBytes}`);
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(
  `Validated ${manifest.count} images (${(totalBytes / 1024 / 1024).toFixed(2)} MiB) with matching checksums and image signatures.`,
);
