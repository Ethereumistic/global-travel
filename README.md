This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Hosting and catalogue caching

Deploy directly to the existing Netlify project `global-travel-bg` (`659b7567-c434-41d6-9ee4-55deec4de30e`). `netlify.toml` selects Node 22, `pnpm build`, and `.next`. Netlify supplies its maintained Next.js/OpenNext adapter. Keep the existing DNS nameservers; do not add a catch-all SPA redirect.

```bash
pnpm install --frozen-lockfile
pnpm test
pnpm typecheck
npx netlify-cli@27.16.2 link --id 659b7567-c434-41d6-9ee4-55deec4de30e
npx netlify-cli@27.16.2 env:import .env
npx netlify-cli@27.16.2 deploy --remote
# After checking the returned draft URL:
npx netlify-cli@27.16.2 deploy --remote --prod
```

The ignored `.env` contains the five `NEXT_PUBLIC_*` settings used by the site, Sanity and Web3Forms. These are also needed on Netlify for builds and functions. Set `NEXT_PUBLIC_BASE_URL=https://global-travel.bg` on Netlify; a local localhost value must not become the deployed canonical URL. Never commit credentials. Remote builds require committed, pushed source. Prefer Netlify's Linux build rather than uploading a Windows-generated standalone server.

### Why the original catalogue used 1,000 records

The original server actions downloaded the first 1,000 rows, filtered countries locally, then sliced the requested page. The fetch cache reduced network calls but every action still deserialized and filtered the bulk response. Destination dropdowns repeated that processing. Hotels beyond the first 1,000 could not be browsed or found by country.

`lib/planet.ts` now owns the integration:

- Hotels use verified upstream pagination and country UUID filters, with ISO codes resolved through Planet's small country directory. Pagination tracks the raw upstream cursor so hidden/disabled hotels cannot cause missing rows or a premature end. No overall catalogue limit is imposed.
- Holiday and yacht indexes are assembled from successive upstream pages, rather than assuming 1,000 rows means the whole catalogue. Only card fields are cached in small chunks; descriptions, galleries, inventory and other detail data remain available through the existing detail endpoints. These indexes retain global ascending price order and yacht country filtering, which Planet currently ignores.
- The resulting small pages and destination lists are cached separately across requests with Next.js Data Cache (supported by Netlify). A hot visitor request reads its small result rather than deserializing the complete index. Index chunks refresh hourly, result pages every five minutes. Stale-while-revalidate can add a refresh window; this is catalogue caching, not live price confirmation.
- Browser pagination and destination lookups use public, cacheable GET endpoints under `/api/catalogue/`. Netlify's CDN can serve repeat requests without invoking a function. Cache keys vary by query parameters, so countries and offsets remain separate. Errors are never cached.
- Failures throw instead of turning into cached empty catalogues. Load-more buttons retain their cursor and offer a retry after errors. Server actions validate page sizes and country codes. The 100-row request ceiling bounds each response, not how far visitors can browse.
- Hotel destination choices use the complete upstream country directory; countries without current inventory can return an empty result. They are no longer inferred from an arbitrary initial hotel sample.
- `/sitemap.xml` is a sitemap index. Hotel sitemaps each read at most a 1,000-row range, including ranges beyond the old cutoff, instead of loading all hotel records in every sitemap request. URLs use the configured production hostname and actual routes.

The Cloudflare test Worker and its dedicated KV cache were removed. The project uses the normal Next.js runtime again.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
