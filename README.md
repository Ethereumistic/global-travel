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
- `/sitemap.xml` publishes static pages, holidays and yachts. Publishing the full supplier hotel catalogue requires the explicit `INDEX_HOTEL_CATALOGUE=true` setting. It is off by default: the supplier has over 530,000 hotels, and advertising every detail URL invites a large cold-page crawl. All hotels remain searchable, paginated and accessible to visitors. Previously advertised hotel sitemap URLs return a cacheable `410` while this setting is off.

### Function-invocation safeguards

The legacy Netlify Free plan counts function invocations. Reducing CPU work or caching only supplier JSON does not stop an uncached HTML/RSC request from invoking Next.js.

- Hotel and holiday detail pages use on-demand ISR (`generateStaticParams` returns an empty array, with hourly revalidation). This caches complete rendered responses, without prebuilding or limiting the catalogue.
- Public catalogue listing/detail routes explicitly opt into Netlify's durable CDN cache. Country filters and the yacht country hint remain in their cache keys, alongside Next.js's RSC variation. Server Actions and authenticated preview cookies are excluded from this override.
- Offer-card links disable automatic prefetching. Scrolling through a catalogue no longer automatically requests every linked detail page. Clicking and client navigation continue to work.
- Supplier errors such as `403`/`429` throw instead of becoming false `404` responses. This lets ISR keep an existing successful page during an upstream outage.

### Free-plan traffic protections

- Next.js is updated from 16.0.10 to 16.4.4, which includes the fix for the App Router/Server Actions CPU denial-of-service advisory [GHSA-p3m5-59mp-jv5r](https://github.com/vercel/next.js/security/advisories/GHSA-p3m5-59mp-jv5r). The old version was affected; existing invocation logs do not establish exploitation.
- Catalogue helpers now use `server-only` instead of `use server`. They are used internally by server rendering; browsers already use the cacheable GET API. This removes unnecessary publicly callable Server Actions and the POST route around GET caching, without changing catalogue behavior.
- If Planet is unavailable during a fresh build, the homepage still publishes its marketing/contact content with an explicit catalogue error and manual retry. Runtime ISR still throws on supplier errors, retaining an already successful homepage instead of replacing it with an empty catalogue. Supplier data is never cached as an empty success.
- Catalogue JSON varies only by `limit`, `offset` and `country`; destination JSON ignores irrelevant query arguments. Random tracking/cache-busting arguments no longer create separate CDN entries for the same data.
- A local Netlify build plugin appends two native rate-limit forward rules **after** the Next adapter's image CDN redirects. They allow 30 API requests/minute and 120 other matched requests/minute per IP/domain, returning platform `429` responses above the threshold. No runtime middleware, edge function or paid counter service is added. Image CDN redirects retain precedence. Native rate-limit acceptance must be confirmed in deploy post-processing logs and an HTTP smoke test; a passing local build alone does not establish enforcement.
- `robots.txt` discourages compliant crawlers from fetching JSON APIs and requests a 10-second crawl delay. This is advisory: Google does not honor crawl delay, and hostile bots can ignore robots.txt entirely. Public offer pages remain crawlable.

Netlify Free supports per-IP/domain rate limiting, not a shared global origin budget. Enforcement can lag by up to 10 seconds. Multiple clients behind one IP share its allowance; distributed or slow traffic can still consume a monthly quota. These controls cannot honestly promise that a free hosting account will never be paused. See [Netlify rate limiting](https://docs.netlify.com/manage/security/secure-access-to-sites/rate-limiting/).

For an isolated deployment, verify its actual plan allowances rather than assuming a new account has the legacy 125,000-function allowance. New credit-based Free teams have request-level Observability (legacy teams do not): inspect paths, response statuses, clients and cache results immediately after launch, then narrow any blocks using actual traffic evidence. Keep automatic purchases disabled. See [Observability availability](https://docs.netlify.com/manage/monitoring/observability/overview/).

These changes reduce avoidable requests and repeated rendering; they cannot guarantee that an arbitrary volume of unique URLs or abusive traffic fits a free monthly quota. A Netlify account suspension is an account/billing state and cannot be cleared by deploying code.

The Cloudflare test Worker and its dedicated KV cache were removed. The project uses the normal Next.js runtime again.

### Vercel recovery deployment

Deploy the patched branch, not an older copy of the repository. Import the five `NEXT_PUBLIC_*` settings from the ignored local `.env`, overriding `NEXT_PUBLIC_BASE_URL` to `https://global-travel.bg` for production. A duplicate repository is optional; the existing source already contains the fixes.

Public catalogue responses include `Vercel-CDN-Cache-Control` as well as the Netlify-specific headers. Supplier errors explicitly disable CDN caching. Netlify's `Netlify-Vary` query selection and native traffic-guard plugin do not configure Vercel: Vercel uses its own cache keys and firewall settings. Before switching DNS, configure Vercel's Bot Protection managed ruleset in Challenge mode and a native per-IP rate-limit rule, then verify real browser access, cache hits, and provider data on the deployment URL. Verified search-engine bots should remain allowed; identify any further blocks from actual Firewall/Observability traffic.

Keep Netlify nameservers and email records. Add `global-travel.bg` and `www.global-travel.bg` to the new Vercel project, complete any ownership TXT verification, then use the exact A/CNAME values that project supplies. Test HTTPS and content before directing public traffic to it. The current local Vercel CLI account must not be assumed to match a browser login; verify the deployment account/team explicitly.

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
