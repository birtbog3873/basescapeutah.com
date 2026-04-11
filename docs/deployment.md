# BaseScape Deployment Guide

Deployments are automated from GitHub (`github.com/birtbog3873/basescapeutah.com`). Pushing to `main` triggers both platforms via two different mechanisms.

## Quick Reference

| Component | Platform | URL | Trigger |
|-----------|----------|-----|---------|
| Site | Cloudflare Pages (`basescape-site`) | basescapeutah.com | GitHub Actions workflow on push to `main` when `site/**` changes |
| Admin CMS | Vercel (`admin` project, team `stevenabunker-3859s-projects`) | admin.basescapeutah.com | Vercel native Git integration on push to `main` |

## How It Works

```
Push to main on GitHub
  ├── .github/workflows/deploy-site.yml
  │     → pnpm install → writes site/.env from GH Actions secrets
  │     → pnpm --filter site build
  │     → wrangler pages deploy site/dist --project-name basescape-site
  │
  └── Vercel Git integration (admin project)
        → Next.js + Payload build from admin/
        → Deployed to admin.basescapeutah.com

CMS content edited in the admin UI
  └── admin/src/hooks/deployHook.ts (debounced 30s)
        → fetches DEPLOY_HOOK_URL (Cloudflare Pages deploy hook)
        → Cloudflare Pages rebuilds the site
```

- **Site** reads from the production CMS (`admin.basescapeutah.com`) at build time
- **Admin CMS** triggers a site rebuild via `DEPLOY_HOOK_URL` when content changes
- **Site preview deployments** on PRs are NOT currently wired up — the workflow only runs on `push` to `main`. Add a `pull_request` trigger and a separate `wrangler pages deploy --branch=<pr-branch>` step if you want them.
- **Admin preview deployments** are created automatically by Vercel on PRs

## Why GitHub Actions for the site (instead of Cloudflare Pages native Git)?

Cloudflare Pages' native Git integration would also work, but the Actions workflow gives us finer control over the build environment (pnpm workspace filter, explicit `.env` composition from secrets). Both approaches are valid — do not migrate without a reason.

## Pull Request Workflow

1. Create a branch and open a PR against `main`
2. Vercel creates an admin preview URL automatically
3. `.github/workflows/ci.yml` runs `pnpm test` (vitest unit tests)
4. Merge to `main` triggers production deploys on both platforms

## Environment Variables

### Site — GitHub Actions secrets (written to `site/.env` by the workflow)
- `PAYLOAD_URL` — `https://admin.basescapeutah.com`
- `PAYLOAD_API_KEY` — Bearer auth for form submission writes
- `GOOGLE_SHEETS_WEBHOOK_URL`, `GOOGLE_SHEETS_WEBHOOK_SECRET` — Lead → Google Sheet
- `RESEND_API_KEY` — Resend REST API key for lead notification emails
- `TEAM_NOTIFICATION_EMAIL` — Recipient of new-lead alerts
- `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN` — used by wrangler-action itself (not passed to the site build)

Manage with `gh secret list` / `gh secret set`.

### Admin CMS — Vercel project settings
- `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN` — Database
- `PAYLOAD_SECRET` — CMS auth secret
- `PAYLOAD_API_KEY` — Must match the value the site uses (Leads collection grants API access to this Bearer token)
- `RESEND_API_KEY` — Used by Payload's Resend adapter for user invites / password resets (lead emails are now fired from the site action, not here)
- `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_ENDPOINT`, `R2_BUCKET_NAME` — Media storage
- `DEPLOY_HOOK_URL` — Cloudflare Pages deploy hook (triggers site rebuild on content changes)
- `TEAM_NOTIFICATION_EMAIL`, `PAYLOAD_BASE_URL` — kept for parity with the site but currently unused in admin/
- `GA4_MP_API_SECRET` — Offline conversion reporting

Manage with `vercel env ls` / `vercel env add` / `vercel env rm` from `admin/`.

> **Env var hygiene:** When setting values via stdin, use `printf '...'` rather than `echo` to avoid trailing newlines. `\n` contamination in `GOOGLE_SHEETS_WEBHOOK_URL` and `PAYLOAD_API_KEY` previously caused silent webhook failures and 403s on lead lookups.

## Lead Pipeline Architecture

Lead notification emails + the Google Sheets webhook are **fired from the Astro action** (`site/src/actions/index.ts`), not from a Payload `afterChange` hook. The Astro action runs in the Cloudflare Worker runtime where `ctx.waitUntil` is reliably respected, so the thank-you page flushes immediately while Resend and Apps Script finish in the background.

The previous `afterLeadCreate.ts` hook blocked form submissions for 3–15 seconds because Vercel's `waitUntil` is not respected inside Payload hook contexts — it has been deleted.

## Manual Deploy (Fallback)

If you need to deploy without pushing to GitHub:

```bash
# Site
pnpm --filter site build
npx wrangler pages deploy site/dist --project-name basescape-site

# Admin CMS — from admin/ directory
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
