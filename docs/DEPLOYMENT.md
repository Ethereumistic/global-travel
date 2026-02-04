# Deployment Guide: Cloudflare Workers + Vercel Studio

## Overview
This project uses a dual deployment strategy:
- **Cloudflare Workers**: Main Next.js website (without studio) using `@cloudflare/next-on-pages`
- **Vercel**: Sanity Studio only (accessible at root)

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Your Domain                              │
│                  (Cloudflare Workers)                        │
│                                                              │
│  Main Website Routes:                                        │
│  • / (homepage)                                              │
│  • /destinations                                             │
│  • /about                                                    │
│  • etc.                                                      │
│                                                              │
│  /studio/* → Redirects to ↓                                 │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ (Rewrites)
                           ↓
┌─────────────────────────────────────────────────────────────┐
│              studio.your-domain.vercel.app                   │
│                    (Vercel)                                  │
│                                                              │
│  Sanity Studio:                                              │
│  • Content editor                                            │
│  • Full CMS functionality                                    │
│  • All routes serve studio                                   │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ (Sanity API)
                           ↓
                    ┌──────────────┐
                    │ Sanity Cloud │
                    │   (Content)  │
                    └──────────────┘
```

---

## Prerequisites

### Required Tools
- Node.js 18+ and pnpm
- Cloudflare account (free tier works)
- Vercel account (free tier works)
- Wrangler CLI: `pnpm install -g wrangler` (installed)
- Vercel CLI: `pnpm install -g vercel` (installed)

### Required Accounts
1. **Cloudflare Account**: https://dash.cloudflare.com/sign-up/workers
2. **Vercel Account**: https://vercel.com/signup (has account)
3. **Sanity Account**: https://sanity.io/manage (has account)

---

## Part 1: Vercel Studio Deployment

Deploy the studio FIRST to get its URL for Cloudflare configuration.

### Step 1: Install Dependencies
```bash
pnpm install
```

### Step 2: Deploy to Vercel

To deploy to vercel we can simply git add . and git commit -m "Deploy" and git push origin migration/cloudflare-workers (or the current branch, since we will probably branch out to /cloudflare and /vercel for the different deployments? )

### Step 3: Note Your Vercel URL
After deployment, Vercel will output a URL like:
```
https://global-travel-sage.vercel.app (this is the URL of the studio)
```
**Save this URL** - you'll need it for Cloudflare configuration.

### Step 4: Set Environment Variables in Vercel Dashboard

Go to: https://vercel.com/dashboard → Your Project → Settings → Environment Variables

Add these variables:
```
NEXT_PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id
NEXT_PUBLIC_SANITY_DATASET=production
```

### Step 5: Redeploy Vercel (with env vars)
```bash
vercel --prod
```

### Step 6: Test Studio
Visit your Vercel URL - you should see the Sanity Studio interface.

---

## Part 2: Cloudflare Workers Deployment

### Step 1: Update Configuration
Create or update `next.config.cloudflare.js` with your Vercel URL:

```javascript
async rewrites() {
  return [
    {
      source: '/studio/:path*',
      destination: 'https://global-travel-sage.vercel.app/:path*',
    },
  ]
}
```

### Step 2: Build for Cloudflare Workers
```bash
pnpm run build:cloudflare
```

This command does three things:
1. Swaps to Cloudflare-specific Next.js config
2. Builds the Next.js app (excluding studio)
3. Converts the build to Cloudflare Workers format using `@cloudflare/next-on-pages`

### Step 3: Preview Locally (Optional)
```bash
pnpm run preview:cloudflare
```

Visit: http://localhost:8788

### Step 4: Deploy to Cloudflare Workers

#### First Time Setup
```bash
# Login to Cloudflare
wrangler login

# Deploy
wrangler pages deploy .vercel/output/static
```

Wrangler will ask you to:
1. Create a new project or select existing
2. Name your project (e.g., "global-travel")

#### Subsequent Deployments
```bash
pnpm run deploy:cloudflare
# OR manually:
wrangler pages deploy .vercel/output/static
```

### Step 5: Set Environment Variables in Cloudflare

Go to: Cloudflare Dashboard → Workers & Pages → Your Project → Settings → Environment Variables

**Production Environment:**
```
NEXT_PUBLIC_SANITY_PROJECT_ID=pldwnwm3
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_STUDIO_URL=https://global-travel-sage.vercel.app
NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY=2ccd8e7d-2ed9-4b2c-b2f0-33beebaf0621

```

**Important**: After adding environment variables, redeploy:
```bash
wrangler pages deploy .vercel/output/static
```

### Step 6: Configure Custom Domain (Optional)

In Cloudflare Dashboard → Workers & Pages → Your Project → Custom Domains:
1. Click "Add Custom Domain"
2. Enter your domain (e.g., `www.yourdomain.com`)
3. Follow DNS configuration instructions

---

## Part 3: Sanity CORS Configuration

### Step 1: Access Sanity Management
Go to: https://sanity.io/manage

### Step 2: Configure CORS Origins
1. Select your project
2. Navigate to **API** → **CORS Origins**
3. Click **Add CORS Origin**

### Step 3: Add Both URLs
Add these origins (replace with your actual URLs):

```
https://global-travel.pages.dev          # Your Cloudflare Workers URL
https://global-travel-sage.vercel.app  # Your Vercel Studio URL
```

**Important**: 
- Include the `https://` protocol
- No trailing slashes
- Add both production URLs
- You may also want to add `http://localhost:3000` for local development

---

## Deployment Workflow Summary

### Complete First-Time Setup:
```bash
# 1. Deploy studio to Vercel
vercel --prod
# Note the Vercel URL

# 2. Update next.config.cloudflare.js with Vercel URL

# 3. Build and deploy to Cloudflare
pnpm run build:cloudflare
wrangler pages deploy .vercel/output/static

# 4. Set environment variables in both platforms

# 5. Configure Sanity CORS
```

### Regular Updates:
```bash
# Update both deployments after code changes:

# 1. Deploy to Vercel (if studio changed)
vercel --prod

# 2. Deploy to Cloudflare (main site)
pnpm run build:cloudflare
wrangler pages deploy .vercel/output/static
```

---

## Testing Checklist

### ✅ Vercel Studio
- [ ] Studio loads at Vercel URL
- [ ] Can login to studio
- [ ] Can create/edit content
- [ ] No CORS errors in console
- [ ] Environment variables are set

### ✅ Cloudflare Workers Site
- [ ] Main site loads at Cloudflare URL
- [ ] All pages work (home, destinations, etc.)
- [ ] Content from Sanity displays correctly
- [ ] Images load properly
- [ ] No console errors
- [ ] Environment variables are set

### ✅ Studio Redirect
- [ ] Visiting `your-cloudflare-url.com/studio` redirects to Vercel
- [ ] Redirect preserves path (e.g., `/studio/desk` works)
- [ ] No redirect loops

### ✅ Content Sync
- [ ] Changes in Vercel studio appear on Cloudflare site
- [ ] Revalidation works (content updates in reasonable time)

---

## Troubleshooting

### Build Errors

#### Error: "Module not found: Can't resolve 'sanity'"
**Solution**: This is expected for Cloudflare build. The `build:cloudflare` script excludes Sanity from the build. Make sure you're using:
```bash
pnpm run build:cloudflare
```
Not just `pnpm run build`.

#### Error: Build exceeds size limit
**Solutions**:
1. Check `next.config.cloudflare.js` excludes studio
2. Enable `removeConsole` in compiler config
3. Review imported dependencies
4. Consider code splitting

### Deployment Errors

#### Error: "Command not found: wrangler"
**Solution**: Install Wrangler globally:
```bash
pnpm install -g wrangler
```

#### Error: Cloudflare deployment fails
**Solutions**:
1. Run `wrangler login` first
2. Check you're in the correct directory
3. Verify `.vercel/output/static` exists after build
4. Try deleting `.vercel` folder and rebuilding

### Runtime Errors

#### Studio shows CORS errors
**Solutions**:
1. Add both URLs to Sanity CORS settings
2. Ensure URLs include `https://`
3. Check for typos in URLs
4. Wait a few minutes after adding CORS origins

#### `/studio` redirect doesn't work
**Solutions**:
1. Verify `NEXT_PUBLIC_STUDIO_URL` is set in Cloudflare
2. Check the URL in `next.config.cloudflare.js` rewrites
3. Redeploy after changing environment variables
4. Clear browser cache

#### Content not updating on main site
**Solutions**:
1. Check Sanity API token (if using preview mode)
2. Verify `NEXT_PUBLIC_SANITY_PROJECT_ID` is correct
3. Check network tab for API request failures
4. Try manual revalidation

### Environment Variable Issues

#### Changes not reflecting after setting env vars
**Solution**: Always redeploy after changing environment variables:
```bash
# For Cloudflare:
wrangler pages deploy .vercel/output/static

# For Vercel:
vercel --prod
```

---

## Bundle Size Optimization

### Current Status
- **Main Site (Cloudflare)**: Target < 1 MB (free tier)
- **Studio (Vercel)**: ~2.48 MB (acceptable on Vercel)

### If Bundle Still Too Large

#### 1. Verify Exclusions
Check that `next.config.cloudflare.js` excludes:
```javascript
outputFileTracingExcludes: {
  '*': [
    './app/studio/**/*',
    './node_modules/sanity/**',
    './node_modules/styled-components/**',
    './node_modules/@sanity/**',
  ],
}
```

#### 2. Add More Exclusions
If still too large, add:
```javascript
'./node_modules/react-icons/**',
'./node_modules/date-fns/**',
// Add other large dependencies not needed for main site
```

#### 3. Dynamic Imports
Convert heavy components to dynamic imports:
```javascript
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div>Loading...</div>,
})
```

#### 4. Analyze Bundle
```bash
# Install bundle analyzer
pnpm add -D @next/bundle-analyzer

# Analyze
ANALYZE=true pnpm run build:cloudflare
```

---

## Advanced Configuration

### Custom Wrangler Configuration

Edit `wrangler.toml` for advanced settings:

```toml
name = "global-travel"
compatibility_date = "2024-01-01"
main = ".worker-next/index.mjs"

# Set routes (if using custom domain)
routes = [
  { pattern = "yourdomain.com/*", custom_domain = true }
]

# Increase CPU time for complex operations
limits = { cpu_ms = 50 }

# Add KV namespaces (if needed for caching)
[[kv_namespaces]]
binding = "CACHE"
id = "your_kv_namespace_id"
```

### Enable ISR/SSR

For Incremental Static Regeneration or Server-Side Rendering:

```javascript
// In page component
export const revalidate = 60 // Revalidate every 60 seconds

// Or for on-demand revalidation
import { revalidatePath } from 'next/cache'

export async function POST(request: Request) {
  const path = await request.json()
  revalidatePath(path)
  return Response.json({ revalidated: true })
}
```

---

## Monitoring & Logs

### Cloudflare Workers Logs
```bash
# Tail logs in real-time
wrangler pages deployment tail

# Or view in dashboard
# Cloudflare Dashboard → Workers & Pages → Your Project → Logs
```

### Vercel Logs
```bash
# View logs
vercel logs your-deployment-url

# Or view in dashboard
# Vercel Dashboard → Your Project → Deployments → View Logs
```

---

## Rollback & Versioning

### Rollback Cloudflare Deployment
1. Go to Cloudflare Dashboard → Workers & Pages → Your Project
2. Click **Deployments** tab
3. Find previous deployment
4. Click **…** → **Rollback to this deployment**

### Rollback Vercel Deployment
1. Go to Vercel Dashboard → Your Project
2. Click **Deployments** tab
3. Find previous deployment
4. Click **…** → **Promote to Production**

---

## Security Considerations

### Environment Variables
- Never commit `.env` files
- Use `.env.example` files for documentation
- Rotate API tokens regularly

### Sanity Studio Access
Consider password-protecting the studio:

```typescript
// app/studio/[[...index]]/page.tsx
import { auth } from '@/lib/auth'

export default async function StudioPage() {
  const session = await auth()
  
  if (!session) {
    redirect('/login')
  }
  
  return <Studio />
}
```

### Content Security Policy
Add CSP headers in `next.config.cloudflare.js`:

```javascript
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        {
          key: 'Content-Security-Policy',
          value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline';",
        },
      ],
    },
  ]
}
```

---

## Performance Optimization

### Edge Caching
Enable caching in Cloudflare:

```javascript
// app/layout.tsx or page.tsx
export const runtime = 'edge'
export const revalidate = 300 // Cache for 5 minutes
```

### Image Optimization
Use Next.js Image component:

```tsx
import Image from 'next/image'

<Image
  src={imageUrl}
  alt="Description"
  width={800}
  height={600}
  priority={isAboveFold}
/>
```

---

## Cost Estimation

### Cloudflare Workers (Free Tier)
- 100,000 requests/day
- 10ms CPU time per request
- **Cost**: Free for most small-medium sites

### Vercel (Hobby Tier)
- 100 GB bandwidth/month
- Unlimited API calls
- **Cost**: Free for studio with light traffic

### Sanity (Free Tier)
- 3 datasets
- 100,000 API calls/month
- **Cost**: Free for most content needs

**Total**: $0/month for small-medium sites on free tiers

---

## Questions & Support

### Before Starting Checklist:
- [ ] What is your Sanity project ID?
- [ ] What dataset are you using? (production/staging)
- [ ] Do you have Cloudflare and Vercel accounts?
- [ ] Do you want the studio password-protected?
- [ ] Do you have a custom domain to configure?

### Getting Help:
- Cloudflare Workers: https://discord.gg/cloudflaredev
- Next.js: https://github.com/vercel/next.js/discussions
- Sanity: https://slack.sanity.io

---

## Success Criteria

✅ **Cloudflare Deployment**
- Bundle < 1 MB (free tier compatible)
- All pages load correctly
- No runtime errors
- Content from Sanity displays

✅ **Vercel Deployment**
- Studio fully functional
- Can create/edit content
- No CORS errors
- Authentication works (if enabled)

✅ **Integration**
- Studio redirect works from main site
- Content changes reflect on main site
- Both deployments are production-ready
- Environment variables configured correctly

✅ **Performance**
- Main site loads in < 2s
- Studio loads in < 3s
- Images optimized
- No console errors
