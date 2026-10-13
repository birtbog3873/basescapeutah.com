# AGENTS.md

This file provides guidance to AI coding agents (Claude Code, Codex, and others) when working with code in this repository.

## Project Overview

This repo contains two distinct workstreams:

1. **Trade Evaluation Pipeline** — A 4-phase research pipeline to evaluate contractor trades for a direct-to-residential, in-home-selling startup on Utah's Wasatch Front.
2. **BaseScape Website** — A pnpm monorepo (`site/`, `cms/`, `admin/`) for the business website, built with Astro + Payload CMS, deployed to Cloudflare.

## Deployment

See **[docs/deployment.md](docs/deployment.md)** for full deployment instructions.

### Topology

```
GitHub: github.com/birtbog3873/basescapeutah.com (main branch)
  │
  ├── site/ changes      → .github/workflows/deploy-site.yml
  │                         → pnpm --filter site build
  │                         → wrangler pages deploy site/dist
  │                         → Cloudflare Pages: basescape-site
  │                         → basescapeutah.com
  │
  └── admin/ changes     → .github/workflows/deploy-admin.yml
                            → opennextjs-cloudflare build + deploy
                            → Cloudflare Worker: basescape-admin
                            → admin.basescapeutah.com
```

- **Site** deploys via **GitHub Actions + wrangler-action** (not Cloudflare Pages native Git integration). Build env vars are written to `site/.env` by the workflow from GitHub Actions secrets.
- **Admin CMS** runs on a **Cloudflare Worker** (`basescape-admin`, built with OpenNext) and deploys via GitHub Actions (`deploy-admin.yml`, uses `CLOUDFLARE_API_TOKEN`). Moved off Vercel 2026-10-13. Runtime secrets are Worker secrets (`admin/scripts/push-secrets.sh`); non-secret vars and the `EMAIL` send_email binding are in `admin/wrangler.jsonc`. Manual deploy: `pnpm --filter @basescape/admin run deploy` (needs `PAYLOAD_SECRET` set to any value for the build). Bundle is ~3.6 MB gzip, so it needs the Workers Paid plan.
- **`cms/` is dev-only** — `pnpm dev` runs it locally on SQLite. `admin/` is the production codebase. When changing shared backend logic (collections, hooks, globals), **edit both**.
- **CMS content changes** trigger a site rebuild by dispatching `deploy-site.yml` (`GITHUB_DEPLOY_TOKEN`) from `admin/src/hooks/deployHook.ts`, after a 20-second wait inside `ctx.waitUntil` (Workers allow ~30s of background work after the response).

### GitHub Actions secrets (site deploy)
`CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN`, `PAYLOAD_URL`, `PAYLOAD_API_KEY`, `GOOGLE_SHEETS_WEBHOOK_URL`, `GOOGLE_SHEETS_WEBHOOK_SECRET`, `CF_EMAIL_API_TOKEN`, `TEAM_NOTIFICATION_EMAIL`

### Worker secrets (admin CMS)
`TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`, `PAYLOAD_SECRET`, `PAYLOAD_API_KEY`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `GITHUB_DEPLOY_TOKEN`, optional `GA4_MP_API_SECRET` (not set as of 2026-10-13, so offline conversions are off). `R2_BUCKET_NAME` and `R2_ENDPOINT` are plain vars in `admin/wrangler.jsonc`.

## Shared task board (Brian sync)

`tasks.json` is mirrored to a 2-tab Google Sheet ("Steven" / "Brian") so Brian (`brian@basescapeutah.com`) can see his assignments without using Claude Code. Source of truth is `tasks.json`; the sheet is a one-way derived view.

**Conflict-of-interest boundary:** the sheet lives in the **BaseScape Workspace** (owned by `steven@basescapeutah.com`), NOT AchieveCMO. Both scripts hard-code `GOOGLE_WORKSPACE_CLI_CONFIG_DIR=~/.config/gws/basescape` internally — the work profile (`achievecmo`) must never have access to this sheet.

- **Sheet ID** lives in `tasks.json`'s envelope as `sprint_sheet_id` (also `sprint_sheet_url`).
- **Required auth (one-time)**: `GOOGLE_WORKSPACE_CLI_CONFIG_DIR=~/.config/gws/basescape gws auth login` as `steven@basescapeutah.com`. The empty `~/.config/gws/basescape/` dir already has `client_secret.json`; just need a token.
- **One-time setup**: `python3 scripts/setup-sprint-sheet.py` (idempotent — exits early if already configured).
- **Manual refresh**: `/sync-sprint` or `python3 scripts/sync-sprint-to-sheet.py`.
- **Partition rule**: tasks with `assignee` starting with "Brian" land on the Brian tab; everything else (Concentrate/Automate/null/other delegates) lands on Steven's tab.
- **Auto-refresh rule**: After any `/review-inbox` mutation, any `/sprint` status change, or any `/add-task` write to `tasks.json`, run the sync script as the final step before reporting back to the user. Surface a single line in the summary: `Synced N Steven / M Brian tasks → <url>`.

## Commands

```bash
# Development (runs both CMS and site concurrently)
pnpm dev

# Build
pnpm build                    # builds CMS then site sequentially

# Tests (all run from repo root)
pnpm test                     # vitest unit tests (site/tests/unit/)
pnpm test:e2e                 # playwright e2e (site/tests/ — *.spec.ts)
pnpm test:lighthouse          # lighthouse CI

# Single test
pnpm --filter site test -- tests/unit/some-file.test.ts
pnpm --filter site test:e2e -- tests/integration/some-file.spec.ts

# Accessibility tests only
pnpm --filter site test:a11y

# Lint
npx eslint .

# CMS seed data
pnpm --filter cms seed

# CMS type generation (produces cms/payload-types.ts)
pnpm --filter cms build

# Admin (Next.js Payload admin UI — optional, for local/staging)
pnpm --filter admin dev       # next dev on separate port
pnpm --filter admin generate:types
```

## Architecture — BaseScape Website

**Monorepo** managed by pnpm workspaces (`site/`, `cms/`, `admin/`).

### `site/` — Astro 5.x Static Site
- **Output:** Static (`output: 'static'`), deployed to Cloudflare Pages
- **Site URL:** `https://basescapeutah.com`
- **Styling:** Vanilla Extract (`.css.ts` files) + Open Props + CSS custom properties
- **Fonts:** Fraunces (variable) + Space Grotesk (variable)
- **React:** Used only for interactive form components (React 19)
- **Icons:** lucide-astro
- **Path alias:** `@/*` → `src/*`
- **Data fetching:** `site/src/lib/payload.ts` — all CMS reads go through `fetchPayload<T>()` / `fetchGlobal<T>()` at build time
- **Write ops:** `createLead()`, `updateLead()` via Astro Actions (`site/src/actions/`)
- **Pages:** Static service pages (`/services/[slug]`), dynamic routes for areas (`/areas/[...slug]`), blog (`/blog/[...slug]`), and paid landing pages (`/lp/[slug]`)
- **Rich text:** Lexical JSON → HTML via `site/src/lib/serialize-lexical.ts`
- **JSON-LD:** Schema markup generators in `site/src/lib/schema.ts`

### `cms/` — Payload CMS 3.x on Cloudflare Workers
- **DB:** Cloudflare D1 (SQLite) via `@payloadcms/db-d1-sqlite` in prod; file-based SQLite (`cms/data/dev.db`) via `@payloadcms/db-sqlite` in dev
- **Media:** Cloudflare R2 via `@payloadcms/storage-s3`
- **Email:** Resend via `@payloadcms/email-resend`
- **Rich text:** Lexical via `@payloadcms/richtext-lexical`
- **Dev server:** Hono (`cms/src/dev-server.ts`) on port 3000, API at `/api`
- **Worker entry:** `cms/src/index.ts` (Cloudflare Workers with D1 binding)
- **Dev config:** `cms/src/dev-config.ts` (local SQLite, no deploy hook)
- **Collections:** Services, ServiceAreas, FAQs, Reviews, Projects, Leads, Offers, PaidLandingPages, LeadMagnets, BlogPosts, Media
- **Globals:** SiteSettings (business info, operating hours, service area zips, visibility controls), Navigation
- **Wrangler config:** `cms/wrangler.jsonc`

### `admin/` — Next.js Payload Admin UI (Optional)
- Next.js 15 wrapping Payload's admin panel via `@payloadcms/next`
- Uses the same collection/global definitions as `cms/`
- Shares the file-based SQLite dev database

### CMS Hooks
- **`deployHook.ts`** — Triggers site rebuild (via `DEPLOY_HOOK_URL`) on `afterChange` for content collections/globals, debounced 30 seconds
- **`sendOfflineConversion.ts`** — `afterChange` on Leads: posts qualified/closed conversions to the Google Ads API (runs synchronously, short-circuits for non-qualified statuses)
- Lead `beforeValidate` — checks zipCode against `site-settings.serviceAreaZipCodes`, sets `isOutOfServiceArea` flag (defined inline in the Leads collection)

**Historical:** `afterLeadCreate.ts` used to send confirmation/team emails + fire the Google Sheets webhook from a Payload hook. It added 3–15s of latency to form submissions because Vercel's `waitUntil` does not flush the HTTP response when called inside a Payload hook context. It has been **deleted** — that work now runs from the site's Astro action (see *Lead Pipeline* below).

### Data Flow

**Read path (build time):**
```
Astro page → fetchServices() / fetchProjects() / etc. (lib/payload.ts)
  → GET PAYLOAD_URL/api/{collection}?where[status][equals]=published
  → resolveServiceImage() (prefers local /images/services/{variant}-{slug}.webp over CMS)
  → Static HTML output → Cloudflare Pages
```

**Write path (forms / lead pipeline):**
```
React form component → client-side Zod validation → Astro Action
  (Cloudflare Worker runtime)
  → POST/PATCH PAYLOAD_URL/api/leads (Bearer PAYLOAD_API_KEY)
  → Leads.beforeValidate: zip code check
  → Leads.afterChange: sendOfflineConversion (Google Ads)
  → return { success: true } to the React form
  → (in parallel, ctx.waitUntil) fireLeadWebhook → Google Apps Script → Google Sheet
  → (in parallel, ctx.waitUntil) fireLeadEmails → Cloudflare Email API → homeowner + team@
```

**Why the background work is in the site action, not a Payload hook:** `ctx.waitUntil` is reliably respected in the Cloudflare Worker runtime that Astro runs in. `waitUntil` from `@vercel/functions` did NOT flush the HTTP response when called from inside a Payload hook on Vercel — the user would still wait 6–15s for Resend + Apps Script to finish before seeing the thank-you page. Moving the work to the Astro action fixed this (typical step 3 latency is now ~1.0–1.5s).

The Google Apps Script webhook secret must travel in the POST body (`data.secret`), not in an Authorization header — Apps Script `doPost(e)` does not expose HTTP request headers. See `cms/google-apps-script/lead-webhook.gs`.

### Form Architecture (`site/src/actions/index.ts`)
Three Astro Actions with Zod validation (`site/src/lib/validation.ts`):
- **saveFormStep** — Multi-step form (3 steps: service/zip → purpose/timeline → contact). Session-based (UUID). Uses `withRetry()` for CMS 500 errors.
- **submitQuickCallback** — Single-step callback (name, phone)
- **submitLeadMagnet** — Email capture + file download URL from CMS

All actions include honeypot field for spam prevention and source/UTM tracking.

### Image Handling
- Local static images preferred: `/images/services/{variant}-{slug}.webp` (card, hero variants)
- `resolveServiceImage()` in `lib/payload.ts` falls back to CMS images with semantic alt text
- Service images include variant-specific alt text (card description vs. hero description)

### Styling Stack
```
Open Props (CSS utility variables: --size-*, spacing, etc.)
  → global.css (reset, root design tokens, semantic CSS vars)
  → Vanilla Extract theme (theme.css.ts: color palette, radius, shadows, font families)
  → typography.css.ts (fluid type scale with CSS clamp: H1–H4, body, small, caption, overline)
  → layouts.css.ts (container, grid, flex utilities: grid2, grid3, stack, stackLg)
  → Component-specific .css.ts files
```
Color palette: navy (primary), green (accent), amber (warm accent), teal (cool accent), slate (neutral).

### Test Structure (`site/tests/`)
- `unit/` — Vitest (matched by `*.test.ts`)
- `integration/`, `contract/`, `visual/`, `performance/` — Playwright (matched by `*.spec.ts`)
- `a11y/` — Playwright with axe-core
- Playwright runs 4 viewport projects: mobile (iPhone 13), tablet (768x1024), desktop (1024x768), wide (1440x900)
- E2E expects dev server on `localhost:4321`

### Environment Variables

**Site** (`.env` or `.env.local` in dev; written by `.github/workflows/deploy-site.yml` from GitHub Actions secrets in CI):
- `PAYLOAD_URL` — CMS API base (prod: `https://admin.basescapeutah.com`, dev: `http://localhost:3000`)
- `PAYLOAD_API_KEY` — Bearer auth for form submission writes
- `GOOGLE_SHEETS_WEBHOOK_URL` — Google Apps Script web app URL (lead logging)
- `GOOGLE_SHEETS_WEBHOOK_SECRET` — shared secret, sent in POST body as `data.secret`
- `CF_EMAIL_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` — Cloudflare Email Service (REST) for lead notification emails; token scoped to Email Sending only. Replaced Resend 2026-10-13.
- `TEAM_NOTIFICATION_EMAIL` — Recipient of new-lead alerts (`hello@basescapeutah.com`)

**Admin CMS** (`admin/.env` in dev; Worker secrets in prod):
- `PAYLOAD_SECRET` — CMS auth secret
- `PAYLOAD_API_KEY` — same value as the site — Leads access control grants read/create/update to this Bearer token
- `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN` — Production database
- Email (user invites, password resets) goes through `admin/src/email/cloudflareAdapter.ts` → the `EMAIL` send_email binding. No key needed. Replaced Resend 2026-10-13.
- `R2_BUCKET_NAME`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_ENDPOINT` — Media storage
- `GITHUB_DEPLOY_TOKEN` — dispatches deploy-site.yml (site rebuild on content changes)
- `TEAM_NOTIFICATION_EMAIL`, `PAYLOAD_BASE_URL` — currently unused in admin/ after the hook removal, but kept for parity with the site

**Dev CMS** (`cms/.env`): same as admin, minus the Turso vars — `pnpm dev` uses file-based SQLite at `cms/data/dev.db`.

### Spec-Driven Development
Feature specs live in `specs/NNN-feature-name/` with numbered prefixes (currently 001–011). Each contains spec, plan, and tasks files generated by the speckit workflow.

## Trade Evaluation Pipeline

### Business Model (Non-Negotiable)
- **Model:** Direct to Residential, In-Home Selling
- **Market:** Wasatch Front, Utah (SLC, Utah County, Davis County)
- **Year 1 Revenue Target:** $500K-$1M
- **Startup Capital:** Under $100K
- **Founders:** Steven Bunker (marketing, offer-building, lead gen) + Business Partner (sales, field ops, crew management)

### Pipeline Phases
```
Phase 1: List Building        →  data/master-trade-list.md     (~80-120 trades)
Phase 2: First Pass Screening →  data/first-pass-results.md    (Rejected + Consideration)
Phase 3: Research Validation   →  data/candidate-list.md        (~5-10 candidates)
Phase 4: Deep Analysis         →  data/final-analysis.md        (Ranked recommendation)
```

Each phase has a prompt in `prompts/` and produces output in `data/`. Steven reviews at each gate before proceeding.

### Scoring
- **Max score:** 410 points (16 dimensions, weighted 1-10, scored 1-5)
- **Big 4:** Competition (10) + Job Size (9) + Differentiation (8) + Margin (8) = max 175
- **Phase 2 cutoffs:** Total 230+ AND Big 4 105+
- **Phase 3 cutoffs:** Total 290+ AND Big 4 122+
- **Conservative default:** When uncertain, score lower

### Reference Lists (Phase 1 Input)
Raw source files at repo root: `AngisList List of Services`, `Thumbtack Services`, `HomeAdvisor List`, `Houzz List of Professionals`, `Houzz Design Ideas`, `List of Trades`, `Top500 - Sheet1.csv`

### Excluded Trades
Roofing, Windows/Doors, Bath/Kitchen Remodel, Pergolas/Pavilions/Decks (non-compete), Retaining Walls (conflict of interest).

### Important Rules
- Each phase prompt runs in a **fresh Claude session**
- Do NOT fabricate research data — "No data found" is acceptable
- Use full 1-5 score range; avoid clustering at 3
- Output uses markdown tables with metadata: `> Phase N output | Generated [date] | [count] trades`

## Code Style
- Prettier: no semicolons, single quotes, trailing commas, 100 char width, 2-space indent
- ESLint: `@typescript-eslint` + `eslint-plugin-astro`
- TypeScript strict mode (extends `astro/tsconfigs/strict`)

## Active Technologies
- TypeScript, Astro 5.7.x, React 19.1.x + Astro, React, Vanilla Extract, Zod, Payload CMS 3.x, Lucide (icons) (013-hero-contact-page)
- Cloudflare D1 (SQLite) via Payload CMS, Cloudflare R2 (media) (013-hero-contact-page)

## Recent Changes
- 013-hero-contact-page: Added TypeScript, Astro 5.7.x, React 19.1.x + Astro, React, Vanilla Extract, Zod, Payload CMS 3.x, Lucide (icons)
