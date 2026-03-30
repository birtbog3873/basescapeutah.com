# Quickstart: BaseScape Website Go-Live

**Branch**: `011-website-go-live` | **Date**: 2026-03-25

## Prerequisites

- Node.js 20+
- pnpm 9+
- Cloudflare account with Workers, Pages, D1, R2 access
- Wrangler CLI (`npm i -g wrangler`)
- Resend account (for transactional email)
- Google Cloud account (for Places API key + GA4)
- Access to basescape.com domain DNS

## Local Development

```bash
# Install dependencies
pnpm install

# Start CMS (Payload on localhost:3000)
cd cms/
cp .dev.vars.example .dev.vars  # Edit: PAYLOAD_SECRET, RESEND_API_KEY, TEAM_NOTIFICATION_EMAIL
pnpm dev

# Seed initial data
pnpm seed

# Start site (Astro on localhost:4321)
cd ../site/
cp .env.example .env  # Edit: PAYLOAD_URL=http://localhost:3000, GOOGLE_PLACES_API_KEY, GA4_MEASUREMENT_ID
pnpm dev

# Or start both from root:
pnpm dev
```

## Production Deployment

### 1. Provision Cloudflare Resources

```bash
# D1 database
wrangler d1 create basescape-cms

# R2 bucket
wrangler r2 bucket create basescape-media
```

Update `cms/wrangler.jsonc` with the real `database_id` from the D1 create output.

### 2. Deploy CMS

```bash
cd cms/

# Set production secrets
wrangler secret put PAYLOAD_SECRET
wrangler secret put RESEND_API_KEY
wrangler secret put TEAM_NOTIFICATION_EMAIL
wrangler secret put R2_ACCESS_KEY_ID
wrangler secret put R2_SECRET_ACCESS_KEY
wrangler secret put DEPLOY_HOOK_URL

# Deploy
wrangler deploy

# Run seed on production
# (Access admin panel at cms.basescape.com/admin to create first admin user)
```

### 3. Deploy Site

```bash
cd site/

# Connect to Cloudflare Pages (one-time)
wrangler pages project create basescape-site

# Set environment variables in Cloudflare Pages dashboard:
# PAYLOAD_URL=https://cms.basescape.com
# PAYLOAD_API_KEY=<from CMS admin>
# GOOGLE_PLACES_API_KEY=<from Google Cloud Console>
# GA4_MEASUREMENT_ID=<from GA4 admin>

# Deploy
pnpm build
wrangler pages deploy dist/
```

### 4. DNS Configuration

In Cloudflare DNS:
- `basescape.com` → CNAME to Cloudflare Pages project
- `cms.basescape.com` → CNAME to Cloudflare Workers route
- Enable Cloudflare proxy (orange cloud) for automatic SSL

### 5. Deploy Hook (auto-rebuild)

1. In Cloudflare Pages dashboard → Settings → Builds → Deploy hooks
2. Create a deploy hook, copy the URL
3. Set as `DEPLOY_HOOK_URL` secret in CMS Workers

## Testing

```bash
# Unit tests
pnpm test

# E2E tests (requires dev servers running)
pnpm test:e2e

# Accessibility tests
pnpm --filter site test:a11y

# Lighthouse audit
pnpm test:lighthouse
```

## Key URLs (Production)

| Service | URL |
|---------|-----|
| Site | https://basescape.com |
| CMS Admin | https://cms.basescape.com/admin |
| CMS API | https://cms.basescape.com/api |
