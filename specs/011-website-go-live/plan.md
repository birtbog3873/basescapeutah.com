# Implementation Plan: BaseScape Website Go-Live

**Branch**: `011-website-go-live` | **Date**: 2026-03-25 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/011-website-go-live/spec.md`

## Summary

Deploy the fully-built BaseScape website (Astro static site + Payload CMS) to production on Cloudflare. This is primarily a deployment, configuration, and content-polishing effort -- the application code is complete. Key work areas: provision Cloudflare infrastructure (D1 database, R2 media, Workers, Pages), configure environment variables and secrets, wire the R2 storage adapter, add GA4 analytics, integrate Google Places autocomplete, implement CMS-to-site auto-rebuild webhook, polish all content from seed data to professional copy, and run QA/testing.

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js 20+
**Primary Dependencies**: Astro 5.7.10, React 19, Payload CMS 3.x, Vanilla Extract, Resend, Zod
**Storage**: Cloudflare D1 (SQLite) for CMS data, Cloudflare R2 for media/images
**Testing**: Vitest (unit), Playwright (e2e, visual, a11y), Lighthouse CI (performance)
**Target Platform**: Cloudflare Pages (site) + Cloudflare Workers (CMS)
**Project Type**: Web application (static site + headless CMS)
**Performance Goals**: <3s page load on 4G, Lighthouse Performance 90+, Accessibility 95+, email notifications <15s
**Constraints**: Under $100K startup budget, ~$290-355/mo operational cost target
**Scale/Scope**: 40+ pages (8 core + 6 service + 24 location + dynamic), 2-person team managing content

## Constitution Check

*No constitution defined for this project -- all placeholder gates. No violations to check.*

**Post-design re-check**: N/A -- no constitution gates.

## Project Structure

### Documentation (this feature)

```text
specs/011-website-go-live/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0: deployment architecture decisions
├── data-model.md        # Phase 1: existing entity reference
├── quickstart.md        # Phase 1: deployment & development guide
├── contracts/
│   └── cms-api.md       # Phase 1: CMS API & deploy hook contracts
├── checklists/
│   └── requirements.md  # Spec quality validation
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
site/                              # Astro frontend (static site)
├── astro.config.ts                # Cloudflare Pages adapter, sitemap, React
├── src/
│   ├── layouts/
│   │   └── BaseLayout.astro       # MODIFY: Add GA4 script tag
│   ├── components/
│   │   └── forms/
│   │       └── MultiStepForm.tsx  # MODIFY: Add Google Places autocomplete + GA4 events
│   ├── actions/
│   │   └── index.ts               # Existing form actions (no changes needed)
│   ├── pages/                     # 40+ page files (no changes needed)
│   ├── lib/
│   │   └── payload.ts             # CMS API client (no changes needed)
│   └── styles/                    # Vanilla Extract tokens (no changes needed)
├── .env.example                   # MODIFY: Add GA4_MEASUREMENT_ID
├── public/images/                 # Static images (no changes needed)
└── tests/                         # 17 test files (run, fix as needed)

cms/                               # Payload CMS (Cloudflare Workers)
├── payload.config.ts              # MODIFY: Wire R2 s3Storage adapter
├── wrangler.jsonc                 # MODIFY: Update D1 database_id
├── src/
│   ├── collections/
│   │   └── Leads.ts               # Existing lead collection (no changes needed)
│   ├── hooks/
│   │   ├── afterLeadCreate.ts     # Existing email hooks (no changes needed)
│   │   └── deployHook.ts          # NEW: Webhook trigger for site rebuilds
│   ├── seed.ts                    # MODIFY: Add 2 missing services, polish all content
│   └── dev-server.ts              # Local dev server (no changes needed)
├── .dev.vars.example              # MODIFY: Add R2 + DEPLOY_HOOK_URL vars
└── package.json                   # Existing scripts (no changes needed)
```

**Structure Decision**: Existing monorepo structure with `site/` (Astro frontend) and `cms/` (Payload CMS) packages managed by pnpm workspaces. No structural changes needed -- all work is configuration, content, and minor code modifications.

## Implementation Phases

### Phase A: Infrastructure Provisioning (Cloudflare)
*No code changes -- purely cloud resource creation and configuration.*

1. Create Cloudflare D1 database `basescape-cms`
2. Create Cloudflare R2 bucket `basescape-media`
3. Create R2 API token (access key + secret) for Payload s3Storage adapter
4. Update `cms/wrangler.jsonc` with real D1 `database_id`
5. Create Cloudflare Pages project for the site
6. Create Pages deploy hook URL (for CMS auto-rebuild)

### Phase B: CMS Code Changes
*Wire R2 storage, deploy webhook, polish content.*

1. **Wire R2 storage adapter** in `cms/payload.config.ts`
   - Configure s3Storage with R2 endpoint, credentials (from env vars), bucket name
   - Bind to Media collection

2. **Create deploy hook** at `cms/src/hooks/deployHook.ts`
   - afterChange hook for content collections: Services, FAQs, Reviews, Projects, ServiceAreas, SiteSettings, Navigation
   - POST to `DEPLOY_HOOK_URL` env var
   - 30-second debounce to batch rapid edits
   - Error logging (non-blocking -- content save succeeds even if webhook fails)

3. **Register deploy hook** in `cms/payload.config.ts` globals/collections

4. **Update seed data** in `cms/src/seed.ts`
   - Add basement-remodeling service with anxiety stack, FAQs
   - Add retaining-walls service with anxiety stack, FAQs
   - Rewrite all 6 service descriptions with polished professional copy
   - Rewrite FAQ answers for professional tone
   - Update review content with credible testimonials
   - Set `showReviews: true` in SiteSettings
   - Verify phone, email, address, hours are correct

5. **Update env example** at `cms/.dev.vars.example`
   - Add: R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_ENDPOINT, R2_BUCKET_NAME, DEPLOY_HOOK_URL, PAYLOAD_BASE_URL

### Phase C: Site Code Changes
*GA4 analytics, Google Places autocomplete.*

1. **Add GA4 tracking** to `site/src/layouts/BaseLayout.astro`
   - gtag.js script in `<head>` conditioned on `GA4_MEASUREMENT_ID` env var
   - Page view tracking automatic via gtag config

2. **Add GA4 conversion events** to form components
   - `MultiStepForm.tsx`: Fire `form_step_1`, `form_step_2`, `form_complete` events
   - `QuickCallback.tsx`: Fire `quick_callback_submit` event
   - `LeadMagnetForm.tsx`: Fire `lead_magnet_submit` event

3. **Integrate Google Places autocomplete** in `MultiStepForm.tsx`
   - Load Google Maps JS API with `libraries=places` (lazy load on step 3 only)
   - Bind Autocomplete widget to address input
   - Restrict to US, bias to Utah
   - Graceful fallback if API unavailable (keep plain text input)

4. **Update env example** at `site/.env.example`
   - Add: GA4_MEASUREMENT_ID

### Phase D: Deploy & Configure
*Push to production, set secrets, configure DNS.*

1. **Set CMS secrets** via `wrangler secret put`:
   - PAYLOAD_SECRET (random 32+ chars)
   - RESEND_API_KEY
   - TEAM_NOTIFICATION_EMAIL
   - R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_ENDPOINT, R2_BUCKET_NAME
   - DEPLOY_HOOK_URL
   - PAYLOAD_BASE_URL (https://cms.basescape.com)

2. **Deploy CMS** to Cloudflare Workers
   - `wrangler deploy` from cms/
   - Create admin user via admin panel
   - Run seed (or manually populate via admin panel)

3. **Set site env vars** in Cloudflare Pages dashboard:
   - PAYLOAD_URL (https://cms.basescape.com)
   - PAYLOAD_API_KEY (from CMS admin)
   - GOOGLE_PLACES_API_KEY
   - GA4_MEASUREMENT_ID

4. **Deploy site** to Cloudflare Pages
   - Build: `pnpm build` from site/
   - Deploy: `wrangler pages deploy dist/`

5. **Configure DNS**
   - `basescape.com` → Cloudflare Pages
   - `cms.basescape.com` → Cloudflare Workers
   - Enable Cloudflare proxy for SSL
   - Set TTL to 300s initially

### Phase E: QA & Verification
*Test everything on the live site.*

1. **Smoke test all pages** -- visit every page type on basescape.com
2. **Test multi-step form** end-to-end -- verify lead created, both emails received within 15s
3. **Test quick callback form** -- verify lead created with correct formType
4. **Test lead magnet form** -- verify lead created, download URL returned
5. **Test out-of-area zip code** -- verify lead flagged
6. **Test honeypot** -- verify spam silently rejected
7. **Run Lighthouse audit** on homepage -- verify Performance 90+, Accessibility 95+
8. **Verify GA4** -- check real-time reports show page views and events
9. **Test CMS auto-rebuild** -- edit content in CMS, verify site updates within 5 minutes
10. **Test mobile rendering** -- 375px, 768px, 1024px breakpoints
11. **Verify sitemap.xml and robots.txt** -- correct page list, no blocked routes
12. **Verify JSON-LD schema** -- Organization, LocalBusiness, Article schemas valid

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| D1 database quota exceeded | Low | High | Monitor usage; D1 free tier is 5GB, more than enough for this scale |
| Resend email delivery issues | Medium | High | Test with real email addresses before launch; monitor confirmationSentAt/teamNotifiedAt timestamps |
| Google Places API cost | Low | Low | Restrict API key to basescape.com domain; autocomplete is per-session not per-keystroke |
| CMS webhook fails silently | Medium | Medium | Log webhook errors; team can manually trigger rebuilds as fallback |
| DNS propagation delays | Medium | Low | Set low TTL (300s); Cloudflare proxied records propagate quickly |

## Complexity Tracking

> No constitution gates defined -- no violations to justify.
