# Research: BaseScape Website V1

> Phase 0 output | Generated 2026-03-23 | 14 research topics resolved

## Summary

All NEEDS CLARIFICATION items from the Technical Context have been resolved. The research validates that the entire stack can run on Cloudflare infrastructure (Pages + Workers + D1 + R2), with Resend for transactional email and Plausible for analytics. No constitution violations or blocking risks were discovered.

---

## R-001: Payload CMS Hosting Strategy

**Decision**: Host Payload CMS on **Cloudflare Workers with D1 (SQLite) + R2 (media storage)**.

**Rationale**: Payload has an official Cloudflare template (`with-cloudflare-d1`) announced via a joint Cloudflare blog post (September 2025). This keeps the entire stack on Cloudflare — Pages for Astro frontend, Workers for Payload CMS, D1 for data, R2 for uploads. Cost: ~$5-10/month (Workers Paid plan required because Payload's bundle exceeds the free tier's 1MB limit).

**Alternatives Considered**:
- **Railway** (~$15-40/mo): Easy setup, PostgreSQL support, one-click Payload template. Best fallback if Cloudflare constraints prove limiting. Separate infrastructure from frontend.
- **Render** (~$15-40/mo): Git-based deploys, managed PostgreSQL. Cold starts on free tier.
- **Fly.io** (~$15-30/mo): Edge distribution, low latency. More ops complexity.
- **Payload Cloud**: New signups paused after Figma acquisition (June 2025). Not available.
- **Self-hosted VPS** (~$5-20/mo): Full control but requires manual ops/maintenance.

**Key Context**: Figma acquired Payload in June 2025. Open-source MIT license is maintained and actively developed. Payload Cloud is paused for new signups while Figma builds a replacement offering.

---

## R-002: Payload CMS Database Choice

**Decision**: **SQLite via Cloudflare D1** using `@payloadcms/db-d1-sqlite` adapter (built on Drizzle ORM).

**Rationale**: The D1 adapter is the only option for Cloudflare Workers deployment and is production-ready (official template). If fallback to Railway is needed, PostgreSQL via `@payloadcms/db-postgres` (also Drizzle-based, full ACID transactions, out of beta) is the alternative.

**Alternatives Considered**:
- **PostgreSQL** (`@payloadcms/db-postgres`): Most robust option. Full ACID. Would use on Railway/Render/VPS fallback.
- **MongoDB** (`@payloadcms/db-mongodb`): Most mature adapter (original) but weaker transaction support.

---

## R-003: Astro + Payload CMS Build-Time Data Fetching

**Decision**: Use **Payload's REST API** with Astro's `getStaticPaths()` for build-time static page generation.

**Rationale**: Documented in the [official Astro + Payload guide](https://docs.astro.build/en/guides/cms/payload/). Payload mounts REST routes at `/api/{collection}`. Pattern: `getStaticPaths()` fetches all documents, maps `docs` array to `params` + `props`, Astro pre-renders each page. Response format: `{ docs: [...], totalDocs, ... }`.

**Alternatives Considered**:
- **Local API** (`payload.find()`): For same-process apps (Next.js + Payload). Not applicable for decoupled Astro.
- **GraphQL**: More setup, not fully supported on Cloudflare Workers yet.
- **Content Layer API**: Could wrap Payload REST calls but adds abstraction complexity.

---

## R-004: Astro Actions on Cloudflare Workers

**Decision**: **Fully supported**. Use Astro Actions for server-side form handling via `@astrojs/cloudflare` adapter.

**Rationale**: Cloudflare adapter docs explicitly list Actions, Server Islands, and Sessions as supported. Actions use `defineAction()` with Zod input validation, running as Cloudflare Workers functions. Astro 5+ defaults all pages to static; individual routes/actions opt into server rendering with `export const prerender = false`.

**Known Limitations**:
- Astro 6 changes env access: `Astro.locals.runtime.env` → `import { env } from "cloudflare:workers"`
- Disable Cloudflare Auto Minify to prevent hydration mismatches
- Monitor Worker bundle size (10MB limit on paid plan)

**Form Architecture**: Astro Action validates via Zod on the edge, then calls Payload's REST API to create a lead record, which triggers Payload's `afterChange` hook for email notification. This keeps validation in the Astro codebase while CMS handles persistence and notifications.

---

## R-005: Payload CMS Transactional Email

**Decision**: Use **Resend** via `@payloadcms/email-resend` adapter. Trigger via Payload's `afterChange` hook on the Leads collection.

**Rationale**: Resend uses HTTP REST calls (not SMTP sockets), which is compatible with Cloudflare Workers. Configuration is minimal. Resend's API typically responds in <500ms. Total pipeline (form submit → Payload creates document → afterChange fires → Resend API → email queued) should complete well under the 3-second confirmation target.

**Reliability Note**: There is a documented issue where `afterChange` hooks don't execute consistently in some server action contexts. Test thoroughly in deployment environment. Consider `afterOperation` or the Form Builder plugin's `beforeEmail` hook as alternatives if issues arise.

**Alternatives Considered**:
- **SendGrid** via Nodemailer: Mature, but requires SMTP (may not work in Workers).
- **Postmark** via Nodemailer: Best deliverability reputation, but SMTP dependency.
- **AWS SES**: Cheapest at scale ($0.10/1000) but complex setup and SMTP dependency.

---

## R-006: Vanilla Extract + Astro Integration

**Decision**: Use Vanilla Extract via the **Vite plugin** — Astro has official, documented support.

**Rationale**: Vanilla Extract maintains an [official Astro integration page](https://vanilla-extract.style/documentation/integrations/astro/). Since Astro is built on Vite, integration is straightforward through `@vanilla-extract/vite-plugin`.

**Setup**:
1. Install: `@vanilla-extract/css` + `@vanilla-extract/vite-plugin`
2. Configure `astro.config.ts` with `vite: { plugins: [vanillaExtractPlugin()] }`
3. Create `.css.ts` files, import into `.astro` components

**Alternatives Considered**:
- **CSS Modules**: Native to Astro but lacks TypeScript type safety and composability (recipes, sprinkles).
- **Tailwind CSS**: Prohibited by constitution (Article II) — utility-class markup pollution.

---

## R-007: Open Props + Vanilla Extract Together

**Decision**: Use Open Props as a **global CSS custom property layer**, referenced inside Vanilla Extract styles as `var()` string literals.

**Rationale**: These operate at different levels — Open Props provides design tokens as CSS custom properties (`:root`), Vanilla Extract consumes them at build time producing zero-runtime CSS.

**Pattern**:
1. Import Open Props globally in Astro layout (`import 'open-props/style'`)
2. Create a typed wrapper module (`src/styles/tokens.ts`) mapping Open Props variable names to constants for IDE autocomplete
3. Reference in `.css.ts` files: `padding: 'var(--size-3)'`
4. Use Vanilla Extract's `createGlobalTheme` for project-specific tokens (brand colors) extending beyond Open Props

---

## R-008: Variable Font Selection

**Decision**: **Fraunces** (expressive serif for headlines) + **Space Grotesk** (geometric sans-serif for body).

**Rationale**:

*Fraunces*: 4 variable axes (Weight, Optical Size, Softness, Wonk). The Wonk axis provides architectural character that can be dialed up for hero moments. Optical size adjusts automatically for different display sizes. Open source (SIL OFL). Via Fontsource: `@fontsource-variable/fraunces`. ~67KB variable font file.

*Space Grotesk*: Variable weight (300-700). Proportional variant of Space Mono — retains technical, architectural character. Distinctive cuts give personality without sacrificing readability. Open source (SIL OFL). Via Fontsource: `@fontsource-variable/space-grotesk`. ~22KB variable font file.

**Combined payload**: ~89KB (before subsetting). With `unicode-range` Latin-only subsetting, reduces further.

**Why this pairing**: Strong typographic contrast — warm, high-contrast serif for attention at headline size + precise geometric sans for clean readability at body size. Both share a "crafted" character suited to an architectural/contracting brand. Neither is overused (unlike Playfair Display + Inter).

**Alternatives Considered**:
- **Playfair Display**: Overused. Feels generic despite 2.0 update.
- **Literata**: Optimized for long-form reading, not display headlines.
- **Inter**: Clinical and ubiquitous. Lacks personality for premium brand.
- **Outfit**: Fewer OpenType features, less character than Space Grotesk.
- **General Sans**: ITF Free Font License (closed source) — cannot subset or modify.

---

## R-009: Testing Setup

**Decision**: **Vitest + Playwright + Lighthouse CI + axe-core**, each handling a distinct layer.

**Rationale**:

| Layer | Tool | What It Tests |
|-------|------|---------------|
| Unit | Vitest | Zod schemas, utility functions, data transforms. Uses Astro's `getViteConfig()` helper. |
| E2E + Visual Regression | Playwright | Page navigation, form flows, visual snapshot comparison across breakpoints (375px, 768px, 1024px, 1440px). |
| Accessibility | @axe-core/playwright | WCAG 2.1 AA compliance per page. Granular per-component testing. |
| Performance | Lighthouse CI | Core Web Vitals thresholds (Article I). Run against Cloudflare Pages preview URLs. |

**CI Pipeline Order**: Lint/Type-check → Vitest → Build → Deploy to CF Pages preview → Playwright E2E + visual + axe → Lighthouse CI against preview URL.

**Key Detail**: Cloudflare Pages preview deployments run on the actual edge network, so Lighthouse scores reflect real-world performance.

---

## R-010: Honeypot + Rate Limiting on Cloudflare Workers

**Decision**: Three-layer defense: (1) honeypot field, (2) Cloudflare Workers Rate Limiting binding, (3) optional Cloudflare Turnstile escalation.

**Rationale**:

*Layer 1 — Honeypot*: Hidden CSS field. Server-side check in Astro Action handler. If populated, silently return fake success. Zero UX impact. Catches ~80-90% of simple bots.

*Layer 2 — CF Workers Rate Limiting*: Native binding configured in `wrangler.jsonc`. Near-zero latency. 5 submissions per 60s per IP. Accessible via `context.locals.runtime.env.FORM_RATE_LIMITER`. Included with Workers plan.

*Layer 3 — Turnstile (optional)*: Privacy-preserving CAPTCHA replacement. Free. Only add if spam gets through layers 1+2.

**Alternatives Considered**:
- **KV-based DIY**: Eventual consistency (60s delay), 1 write/sec/key limit. Native binding is purpose-built.
- **Durable Objects**: Strongly consistent but overkill for form spam.
- **reCAPTCHA/hCaptcha**: UX friction. Turnstile is the better option if CAPTCHA needed.

---

## R-011: Multi-Step Form Partial Data Capture

**Decision**: Single Astro Island (`client:load`) with per-step independent POSTs to Astro Actions. Client-generated UUID session token links partial submissions.

**Rationale**:

1. **FR-014 requires it**: Partial data captured at each step for abandoned submission retargeting.
2. **Architecture**: Form component generates UUID on mount. Step 1 POST creates `PartialLead` in Payload CMS. Steps 2-3 PATCH/update the record. Final submission promotes to `Lead` with `status: 'complete'`. Partials with `status: 'abandoned'` after 24h TTL become retargeting candidates.
3. **Island model**: Single Island owns all step state (accumulated answers, current step, session token, validation errors). `client:load` for immediate hydration (conversion-critical). Step transitions are client-side state changes; only background POSTs cross the network.
4. **Progressive enhancement**: JS-disabled visitors get a single-page HTML form fallback or phone CTA direction.

**Alternatives Considered**:
- **Single final POST with localStorage**: Loses partial data on tab close. Fails FR-014.
- **Cookie-based session**: Unnecessary complexity. UUID is sufficient (no auth/privilege).
- **Multiple Islands per step**: Bad pattern — cannot share state across hydration boundaries.

---

## R-012: Address Autocomplete API

**Decision**: **Google Places Autocomplete (New)** for V1.

**Rationale**: At launch, realistic volume is 100-500 autocomplete sessions/month — entirely within Google's 10,000 free requests/month tier. Best UX quality (users expect Google-quality suggestions). Sets up Google Cloud project for Phase 2 review API integration. No map display required.

**Alternatives Considered**:
- **Mapbox Address Autofill**: Most generous free tier (100K/month). Strong runner-up. Requires Mapbox attribution.
- **Radar**: No pre-built form widget (custom dropdown needed). Opaque pricing.
- **Smarty (SmartyStreets)**: Best for validation, not autocomplete UX. 250/month free tier too restrictive.

---

## R-013: Analytics Implementation

**Decision**: **Plausible Analytics** (Business plan, $19/month) as primary. GA4 as hedge for Google Ads conversion import if needed.

**Rationale**: ~1KB script vs GA4's ~45KB (critical for 250KB page weight budget). No cookies = no consent banner needed (aligns with trust-first design). Custom events from Islands via global `plausible()` function. UTM parameter tracking built-in. Business plan includes custom properties and funnel visualization for multi-step form analysis.

**Event Implementation**:
- Form steps: `plausible('Form Step N', { props: { service } })`
- Call clicks: CSS class method `plausible-event-name=Call+Click` (works in static HTML)
- Lead magnets: `plausible('Lead Magnet Download', { props: { resource } })`

**GA4 Hedge**: If running Google Ads, add GA4 alongside (not instead of) for conversion import. Dual-tracking overhead is minimal.

**Alternatives Considered**:
- **GA4 only**: Free, but 45KB script, requires cookie consent banner, complex interface for non-technical team.
- **Fathom**: Close competitor ($15/mo, 100K pageviews). Loses on custom property support and funnel visualization.

---

## R-014: Image Optimization Pipeline

**Decision**: Hybrid approach — **Astro `<Picture>` + Sharp** for local images at build time, **Cloudflare Image Transformations** for Payload CMS remote images at edge.

**Rationale**:

| Image Source | Method | When |
|---|---|---|
| Local (`src/assets/`) | Astro `<Picture>` with `formats={['avif', 'webp']}` via Sharp | Build time |
| Payload CMS (remote) | Cloudflare Image Transformations with `format=auto` | Edge (runtime, cached) |
| Static (`public/`) | Pre-optimized manually or via build script | Build time |

Cloudflare Image Transformations: included free up to 5,000 unique transformations/month. Automatically serves AVIF/WebP/JPEG based on browser support via `format=auto`. Offloads optimization from build time to CDN edge.

**Cloudflare adapter note**: Use `compile` image service mode for SSG builds (Sharp runs at build time in CI, not on edge). Authorize CMS domain in `image.domains` config.

**Alternatives Considered**:
- **All build-time Sharp**: Remote images increase build time significantly. Stale images between builds.
- **Cloudflare Polish**: Does NOT convert to AVIF/WebP. Only compresses within original format. Insufficient.
- **Third-party CDN (Cloudinary, imgix)**: Unnecessary service dependency. CF Image Transformations achieves same result in existing account.

---

## Monthly Cost Summary (V1 Launch)

| Service | Cost | Purpose |
|---------|------|---------|
| Cloudflare Workers Paid | $5/mo | Payload CMS hosting (D1 + R2 included) |
| Cloudflare Pages | Free | Astro static site hosting |
| Resend | Free (100 emails/day) | Transactional email |
| Plausible Business | $19/mo | Analytics |
| Google Places API | Free (10K/mo) | Address autocomplete |
| Fontsource | Free | Self-hosted variable fonts |
| **Total** | **~$24/mo** | |
