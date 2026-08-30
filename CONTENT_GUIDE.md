# Site content and images

The production site is fully static. It reads content from
`src/data/site-content.json` and serves migrated images from
`public/images/strapi/`. Production builds do not contact Strapi.

## Editing content

Edit `src/data/site-content.json`, then validate and build:

```sh
npm run content:validate
npm run build
```

All image URLs in the canonical JSON must use
`/images/strapi/<exact-filename>`. Keep the original hashed filenames so the
one-year immutable cache policy remains safe.

## Refreshing the archived snapshot

While the original public Strapi instance remains available, refresh the
complete snapshot with:

```sh
npm run content:refresh
```

This command downloads the exact media referenced by the site, verifies every
file, refreshes the raw archive and manifest under `content/`, and regenerates
the canonical JSON. It fails on filename collisions, corrupt images, missing
content, or missing media references.

The raw export is retained only as a recovery source. The application never
loads it.
