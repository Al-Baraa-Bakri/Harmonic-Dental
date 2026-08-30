# Content migration scripts

- `content-download-images.mjs` fetches the currently referenced source images
  into `public/images/strapi/` while preserving exact filenames.
- `content-validate-images.mjs` verifies file size, checksum, and image
  signatures against `content/images/strapi-manifest.json`.
- `content-export.mjs` converts the archived API responses into
  `src/data/site-content.json` and rewrites media URLs to same-origin paths.
- `content-validate.mjs` checks the canonical content structure, local media
  references, and absence of production Strapi dependencies.
- `content-shared.mjs` contains the exact legacy endpoint inventory and shared
  migration helpers.

Run `npm run content:refresh` only while the legacy source remains available.
Normal production builds use only committed JSON and public assets.
