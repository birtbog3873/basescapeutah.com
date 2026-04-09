# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repo contains two distinct workstreams:

1. **Trade Evaluation Pipeline** — A 4-phase research pipeline to evaluate contractor trades for a direct-to-residential, in-home-selling startup on Utah's Wasatch Front.
2. **BaseScape Website** — A pnpm monorepo (`site/`, `cms/`, `admin/`) for the business website, built with Astro + Payload CMS, deployed to Cloudflare.

## Deployment

See **[docs/deployment.md](docs/deployment.md)** for full deployment instructions. Key points:

- **Automated via GitHub** — push to `main` triggers both deploys
- **Site** → Cloudflare Pages (auto-deploy on push, site/ changes)
- **Admin CMS** → Vercel (auto-deploy on push, admin/ changes)
- **Both `cms/` and `admin/` have backend code** — production uses `admin/`. Always sync changes between them.
- CMS content changes trigger site rebuild via deploy hook

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
- **`afterLeadCreate.ts`** — On lead status → "complete": sends confirmation email to homeowner + team notification email (with admin link), updates `confirmationSentAt`/`teamNotifiedAt` timestamps
- **`validateLead.ts`** — `beforeValidate`: checks zipCode against `site-settings.serviceAreaZipCodes`, sets `isOutOfServiceArea` flag

### Data Flow

**Read path (build time):**
```
Astro page → fetchServices() / fetchProjects() / etc. (lib/payload.ts)
  → GET PAYLOAD_URL/api/{collection}?where[status][equals]=published
  → resolveServiceImage() (prefers local /images/services/{variant}-{slug}.webp over CMS)
  → Static HTML output → Cloudflare Pages
```

**Write path (forms):**
```
React form component → client-side Zod validation → Astro Action
  → POST/PATCH PAYLOAD_URL/api/leads (with PAYLOAD_API_KEY)
  → beforeValidate hook: zip code check → afterChange hook: emails
```

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

**Site** (`.env` or `.env.local`):
- `PAYLOAD_URL` — CMS API base (defaults to `http://localhost:3000`)
- `PAYLOAD_API_KEY` — Auth for form submission write ops

**CMS** (`cms/.env`):
- `PAYLOAD_SECRET` — CMS auth secret
- `RESEND_API_KEY` — Email service
- `R2_BUCKET_NAME`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_ENDPOINT` — Media storage
- `DEPLOY_HOOK_URL` — Triggers site rebuild on content changes
- `TEAM_NOTIFICATION_EMAIL` — Lead notification recipient
- `PAYLOAD_BASE_URL` — Admin link in notification emails

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
