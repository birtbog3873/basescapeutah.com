# BaseScape Deployment Guide

This project has **two independent deployments** that must both be updated when backend changes are involved.

## Quick Reference

| Component | Platform | URL | Deploy Command |
|-----------|----------|-----|----------------|
| Site | Cloudflare Pages | basescapeutah.com | `npx wrangler pages deploy site/dist --project-name basescape-site` |
| Admin CMS | Vercel | admin.basescapeutah.com | `npx vercel --prod` (from `admin/` directory) |

## Site (Cloudflare Pages)

The Astro static site. Handles all public-facing pages, forms, and client-side validation.

```bash
# 1. Build
pnpm --filter site build

# 2. Deploy
npx wrangler pages deploy site/dist --project-name basescape-site
```

**When to deploy:** Changes to anything under `site/` — pages, components, forms, validation, headers, layouts, actions.

**What it includes:** Static HTML, React form components, Astro Actions (server-side form handlers), `_headers` (security headers), `_redirects`.

## Admin CMS (Vercel) — PRODUCTION BACKEND

The Next.js Payload admin panel. This is the **production CMS** — it handles emails, webhooks, lead processing, and the admin UI.

```bash
# Deploy from the admin/ directory
cd admin
npx vercel --prod
```

Or from repo root:
```bash
npx vercel --prod --cwd admin
```

**When to deploy:** Changes to collections, hooks, email templates, or any backend logic under `admin/`.

**Database:** Turso (SQLite) — managed separately, not deployed with code.

## Which Files Live Where

Backend logic is duplicated between `cms/` and `admin/`. **Production uses `admin/`.**

| File | cms/ (dev/workers) | admin/ (production) |
|------|:------------------:|:-------------------:|
| Collections (Leads, Services, etc.) | Yes | Yes — **deploy here** |
| Hooks (afterLeadCreate, etc.) | Yes | Yes — **deploy here** |
| Email templates (lead-confirmation, etc.) | Yes | Yes — **deploy here** |
| Payload config | Yes | Yes — **deploy here** |
| Seed scripts | Yes | No |
| Wrangler config | Yes | No |

**When you change a file in `cms/`, check if `admin/` has a copy that also needs updating.** Key shared files:

- `src/collections/Leads.ts`
- `src/hooks/afterLeadCreate.ts`
- `src/hooks/sendOfflineConversion.ts`
- `src/email/lead-confirmation.ts`
- `src/email/team-notification.ts`
- `src/email/lead-magnet-delivery.ts` (cms/ only — no admin/ copy)

## Deploy Both (Full Stack Change)

When changes span both site and CMS:

```bash
# 1. Build and deploy site
pnpm --filter site build
npx wrangler pages deploy site/dist --project-name basescape-site

# 2. Deploy admin CMS
cd admin && npx vercel --prod
```

## CMS on Cloudflare Workers (NOT production)

The `cms/` directory can also deploy to Cloudflare Workers (D1 + R2). This is **not the production CMS** — it exists for local dev and as a potential future migration target.

```bash
# Local dev only
pnpm --filter cms dev

# Deploy to workers (staging/testing only)
cd cms && npx wrangler deploy
```

## Environment Variables

**Site** (`site/.env`): `PAYLOAD_URL`, `PAYLOAD_API_KEY`

**Admin CMS** (Vercel dashboard or `vercel env`): `PAYLOAD_SECRET`, `RESEND_API_KEY`, `R2_*`, `DEPLOY_HOOK_URL`, `TEAM_NOTIFICATION_EMAIL`, `GOOGLE_SHEETS_WEBHOOK_URL`, `GOOGLE_SHEETS_WEBHOOK_SECRET`, `GA4_MP_API_SECRET`

## Common Mistakes

1. **Editing `cms/` but not `admin/`** — Production uses admin/. If you only change cms/, the deployed CMS won't have your changes.
2. **Forgetting to build before deploying site** — Wrangler deploys the `site/dist/` directory. If you don't build first, you deploy stale output.
3. **Deploying only the site when CMS hooks changed** — Email templates, webhook logic, and hooks live in admin/, not site/. Deploy both when backend behavior changes.
4. **No GitHub remote** — This repo has no remote. All deploys are manual via CLI. There is no CI/CD pipeline.
