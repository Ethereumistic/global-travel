# Quick Start Guide

This is a condensed version of the full deployment guide. For complete details, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## What This Does

Deploys your Next.js app to TWO platforms:
1. **Cloudflare Workers**: Main website (fast, cheap, no studio)
2. **Vercel**: Sanity Studio only (CMS interface)

## Prerequisites

```bash
# Install dependencies
pnpm install

# Install global tools (if not already installed)
pnpm install -g wrangler vercel
```

## 5-Minute Deployment

### Step 1: Deploy Studio to Vercel (2 min)
```bash
vercel --prod
```
**Save the URL** (e.g., `https://your-app.vercel.app`)

### Step 2: Set Vercel Environment Variables (1 min)
In Vercel Dashboard → Settings → Environment Variables:
```
NEXT_PUBLIC_SANITY_PROJECT_ID=your_id
NEXT_PUBLIC_SANITY_DATASET=production
```
Then redeploy: `vercel --prod`

### Step 3: Deploy Main Site to Cloudflare (2 min)
```bash
# Build
pnpm run build:cloudflare

# Deploy
wrangler pages deploy .vercel/output/static
```

### Step 4: Set Cloudflare Environment Variables (30 sec)
In Cloudflare Dashboard → Workers & Pages → Settings → Environment Variables:
```
NEXT_PUBLIC_SANITY_PROJECT_ID=your_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_STUDIO_URL=https://your-app.vercel.app
```
Then redeploy: `wrangler pages deploy .vercel/output/static`

### Step 5: Configure Sanity CORS (30 sec)
Go to https://sanity.io/manage → API → CORS Origins

Add both:
- Your Cloudflare URL: `https://your-app.pages.dev`
- Your Vercel URL: `https://your-app.vercel.app`

## Done! 🎉

Test:
- Main site: Your Cloudflare URL
- Studio: Your Vercel URL
- Redirect: Your Cloudflare URL + `/studio`

## Updating Later

```bash
# Update studio
vercel --prod

# Update main site
pnpm run build:cloudflare
wrangler pages deploy .vercel/output/static
```

## Troubleshooting

**Build fails?**
- Make sure you're using `pnpm run build:cloudflare` not just `pnpm build`
- Check that `next.config.cloudflare.js` exists

**CORS errors?**
- Add both URLs to Sanity CORS settings
- Include `https://` in the URLs
- Wait a few minutes after adding

**Studio redirect doesn't work?**
- Check `NEXT_PUBLIC_STUDIO_URL` is set in Cloudflare
- Make sure you redeployed after setting env vars

**Need more help?**
See the full [DEPLOYMENT.md](./DEPLOYMENT.md) guide.

## File Structure

```
your-project/
├── next.config.cloudflare.js  # Cloudflare-specific config
├── next.config.js             # Default Next.js config
├── vercel.json                # Vercel studio config
├── wrangler.toml              # Cloudflare Workers config
├── package.json               # Updated with new scripts
├── .env.example.cloudflare    # Cloudflare env template
├── .env.example.vercel        # Vercel env template
└── DEPLOYMENT.md              # Full deployment guide
```
