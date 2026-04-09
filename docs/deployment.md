# BaseScape Deployment Guide

Deployments are automated via GitHub. Pushing to `main` triggers both platforms.

## Quick Reference

| Component | Platform | URL | Trigger |
|-----------|----------|-----|---------|
| Site | Cloudflare Pages | basescapeutah.com | Push to `main` (site/ changes) |
| Admin CMS | Vercel | admin.basescapeutah.com | Push to `main` (admin/ changes) |

## How It Works

```
Push to main
  ├── Cloudflare Pages builds site/ (Astro static)
  └── Vercel builds admin/ (Next.js + Payload CMS)

CMS content edited
  └── deployHook.ts fires → Cloudflare Pages rebuilds site
```

- **Site** reads from the production CMS (`admin.basescapeutah.com`) at build time
- **Admin CMS** triggers a site rebuild via `DEPLOY_HOOK_URL` when content changes
- **Preview deployments** are created automatically on pull requests by both platforms

## Pull Request Workflow

1. Create a branch and open a PR
2. Both platforms create preview URLs automatically
3. Site preview fetches from the production CMS (shows real content at a preview URL)
4. Merge to `main` triggers production deploys

## Environment Variables

**Site** (Cloudflare Pages dashboard):
- `PAYLOAD_URL` — CMS API endpoint (`https://admin.basescapeutah.com`)
- `PAYLOAD_API_KEY` — Auth for form submission write ops
- `NODE_VERSION` — Set to `20`

**Admin CMS** (Vercel dashboard or `vercel env`):
- `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN` — Database
- `PAYLOAD_SECRET` — CMS auth secret
- `RESEND_API_KEY`, `TEAM_NOTIFICATION_EMAIL` — Email
- `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_ENDPOINT`, `R2_BUCKET_NAME` — Media storage
- `DEPLOY_HOOK_URL` — Cloudflare Pages deploy hook (triggers site rebuild)
- `GOOGLE_SHEETS_WEBHOOK_URL`, `GOOGLE_SHEETS_WEBHOOK_SECRET` — Lead tracking
- `GA4_MP_API_SECRET` — Analytics

## Manual Deploy (Fallback)

If you need to deploy without pushing to GitHub:

```bash
# Site
pnpm --filter site build
npx wrangler pages deploy site/dist --project-name basescape-site

# Admin CMS
cd admin && npx vercel --prod
```

## Which Files Live Where

Backend logic is duplicated between `cms/` and `admin/`. **Production uses `admin/`.**

| File | cms/ (dev only) | admin/ (production) |
|------|:---------------:|:-------------------:|
| Collections (Leads, Services, etc.) | Yes | Yes -- **deploy here** |
| Hooks (afterLeadCreate, etc.) | Yes | Yes -- **deploy here** |
| Email templates | Yes | Yes -- **deploy here** |
| Payload config | Yes | Yes -- **deploy here** |
| Seed scripts | Yes | No |

**When you change a file in `cms/`, check if `admin/` has a copy that also needs updating.**

## Common Mistakes

1. **Editing `cms/` but not `admin/`** -- Production uses admin/. Changes to cms/ alone won't reach production.
2. **Pushing site changes when CMS schema changed** -- Deploy admin first if the site depends on new CMS fields.
