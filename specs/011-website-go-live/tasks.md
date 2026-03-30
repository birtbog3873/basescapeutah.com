# Tasks: BaseScape Website Go-Live

**Input**: Design documents from `/specs/011-website-go-live/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Not explicitly requested -- test tasks omitted. QA verification is covered in Phase 8.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Cloudflare Infrastructure Provisioning)

**Purpose**: Provision all Cloudflare resources needed for production deployment. These are manual Cloudflare dashboard/CLI operations, not code changes.

- [X] T001 Create Cloudflare D1 database named `basescape-cms` via `wrangler d1 create basescape-cms` and record the database_id
- [X] T002 [P] Create Cloudflare R2 bucket named `basescape-media` via `wrangler r2 bucket create basescape-media` and create R2 API token with read/write access
- [X] T003 [P] Create Cloudflare Pages project named `basescape-site` via `wrangler pages project create basescape-site`
- [ ] T004 Create Cloudflare Pages deploy hook in dashboard (Settings > Builds > Deploy hooks) and record the URL
- [X] T005 Update `cms/wrangler.jsonc` with the real D1 `database_id` from T001 output (replace placeholder `00000000-0000-0000-0000-000000000000`)

**Checkpoint**: All Cloudflare resources provisioned. D1 database_id, R2 credentials, Pages deploy hook URL are available for use.

---

## Phase 2: Foundational (CMS Code Changes)

**Purpose**: Wire R2 storage adapter, implement deploy webhook, and update environment variable documentation. MUST complete before deployment.

- [X] T006 Wire R2 s3Storage adapter in `cms/payload.config.ts` -- configure with env vars R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_ENDPOINT, R2_BUCKET_NAME; bind to Media collection
- [X] T007 [P] Create deploy webhook hook at `cms/src/hooks/deployHook.ts` -- afterChange hook that POSTs to DEPLOY_HOOK_URL env var with 30-second debounce; non-blocking error logging
- [X] T008 Register deploy hook in `cms/payload.config.ts` on content collections: Services, FAQs, Reviews, Projects, ServiceAreas and globals: SiteSettings, Navigation
- [X] T009 [P] Update `cms/.dev.vars.example` to add R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_ENDPOINT, R2_BUCKET_NAME, DEPLOY_HOOK_URL, PAYLOAD_BASE_URL

**Checkpoint**: CMS code is ready for production deployment with R2 media storage and auto-rebuild webhook.

---

## Phase 3: User Story 1 - Homeowner Submits a Lead (Priority: P1) 🎯 MVP

**Goal**: Site is live at basescape.com, multi-step form creates leads in CMS, both emails (homeowner confirmation + team notification) send within 15 seconds.

**Independent Test**: Submit the multi-step form on basescape.com with a valid Wasatch Front zip code. Verify lead appears in CMS admin, confirmation email arrives to homeowner, team notification arrives to team email.

### Implementation for User Story 1

- [X] T010 [US1] Set CMS production secrets via `wrangler secret put` -- PAYLOAD_SECRET (random 32+ chars), RESEND_API_KEY, TEAM_NOTIFICATION_EMAIL, R2 credentials (4 vars), DEPLOY_HOOK_URL, PAYLOAD_BASE_URL
- [X] T011 [US1] Deploy CMS to Cloudflare Workers via `wrangler deploy` from `cms/` directory
- [X] T012 [US1] Create first admin user by visiting the CMS admin panel at the Workers URL
- [X] T013 [US1] Run seed to populate initial data -- `pnpm seed` from `cms/` or populate via admin panel
- [X] T014 [US1] Set site environment variables in Cloudflare Pages dashboard -- PAYLOAD_URL (production CMS URL), PAYLOAD_API_KEY (from CMS admin)
- [X] T015 [US1] Build and deploy site to Cloudflare Pages -- `pnpm build` from `site/`, then `wrangler pages deploy dist/`
- [ ] T016 [US1] Configure DNS: `basescape.com` CNAME to Cloudflare Pages, `cms.basescape.com` CNAME to Cloudflare Workers, enable proxy, set TTL 300s
- [ ] T017 [US1] Verify homepage loads at basescape.com over HTTPS with all content, images, and navigation
- [ ] T018 [US1] Test multi-step form end-to-end: complete all 3 steps with valid Wasatch Front zip code, verify lead created in CMS with status "complete", verify homeowner confirmation email and team notification email both arrive within 15 seconds
- [ ] T019 [US1] Test out-of-service-area zip code: submit form with non-service-area zip, verify lead is captured and flagged as isOutOfServiceArea
- [ ] T020 [US1] Test honeypot spam protection: submit form with honeypot field filled, verify no lead is created and fake success response is returned

**Checkpoint**: Site is live at basescape.com. Multi-step form captures leads and sends both emails. This is the MVP -- the business can now capture leads.

---

## Phase 4: User Story 2 - Quality & Performance Checks (Priority: P2)

**Goal**: All pages render correctly on mobile/tablet/desktop. Lighthouse scores meet thresholds. SEO metadata is correct. Fallback content works when CMS is unavailable.

**Independent Test**: Run Lighthouse on homepage, check mobile rendering at 375px, verify sitemap.xml and robots.txt, test CMS fallback.

### Implementation for User Story 2

- [ ] T021 [US2] Run Lighthouse audit on homepage -- verify Performance 90+, Accessibility 95+, Best Practices 90+, SEO 95+; fix any issues found
- [ ] T022 [P] [US2] Test mobile rendering at 375px width on all page types (homepage, service page, location page, about, FAQ, financing); fix any horizontal scroll, unreadable text, or untappable CTAs
- [ ] T023 [P] [US2] Verify sitemap.xml includes all public pages (homepage, 6 service pages, 24 location pages, about, how-it-works, FAQ, financing, privacy) and robots.txt allows crawling
- [ ] T024 [P] [US2] Verify JSON-LD structured data on homepage (Organization, LocalBusiness), service pages, and blog pages (Article schema) using Google Rich Results Test
- [ ] T025 [US2] Test CMS fallback: temporarily point PAYLOAD_URL to invalid endpoint, verify site still renders with hardcoded fallback content on all page types

**Checkpoint**: Site passes quality checks. All pages render correctly across devices with valid SEO metadata.

---

## Phase 5: User Story 3 - Professional Content & CMS Management (Priority: P3)

**Goal**: All 6 service pages and 24 location pages display polished professional copy. CMS admin is accessible to team members. Content changes trigger auto-rebuild.

**Independent Test**: Log into CMS admin, verify all collections have professional content, edit a service page, verify the change appears on the live site within 5 minutes.

### Implementation for User Story 3

- [X] T026 [US3] Update `cms/src/seed.ts` to add basement-remodeling service with title, slug, tagline, value pillars, anxiety stack (7 parts), and related FAQs
- [X] T027 [P] [US3] Update `cms/src/seed.ts` to add retaining-walls service with title, slug, tagline, value pillars, anxiety stack (7 parts), and related FAQs
- [X] T028 [US3] Rewrite all 6 service descriptions in `cms/src/seed.ts` with polished professional marketing copy (not developer placeholder text)
- [X] T029 [P] [US3] Rewrite all FAQ answers in `cms/src/seed.ts` with professional tone and accurate information
- [X] T030 [P] [US3] Update review content in `cms/src/seed.ts` with credible professional testimonials; set showReviews to true in SiteSettings
- [X] T031 [US3] Verify SiteSettings in `cms/src/seed.ts` has correct phone number, email, business address, operating hours, license number, and service area zip codes
- [ ] T032 [US3] Re-seed CMS on production with updated content -- run `pnpm seed` or update via admin panel
- [ ] T033 [US3] Verify all 6 service pages display polished professional content on live site (not seed placeholder text)
- [ ] T034 [US3] Verify all 24 location pages render with city-specific messaging on live site
- [ ] T035 [US3] Test auto-rebuild: edit a service description in CMS admin panel, verify the change appears on basescape.com within 5 minutes without developer intervention
- [ ] T036 [US3] Create CMS admin credentials for business partner; verify they can log in and edit content

**Checkpoint**: All pages display professional content. CMS is accessible to the team. Auto-rebuild webhook works.

---

## Phase 6: User Story 4 - GA4 Analytics (Priority: P4)

**Goal**: GA4 tracks page views on all pages and conversion events on all form submissions from the moment the site is live.

**Independent Test**: Visit the site, submit a form, verify page views and conversion events appear in GA4 Real-Time reports within 5 minutes.

### Implementation for User Story 4

- [X] T037 [US4] Add GA4 gtag.js script to `site/src/layouts/BaseLayout.astro` in `<head>`, conditioned on GA4_MEASUREMENT_ID env var being set (do not remove existing Plausible script)
- [X] T038 [US4] Add GA4 conversion events to `site/src/components/forms/MultiStepForm.tsx` -- fire `form_step_1`, `form_step_2`, `form_complete` events via gtag()
- [X] T039 [P] [US4] Add GA4 conversion event to `site/src/components/forms/QuickCallback.tsx` -- fire `quick_callback_submit` event via gtag()
- [X] T040 [P] [US4] Add GA4 conversion event to `site/src/components/forms/LeadMagnetForm.tsx` -- fire `lead_magnet_submit` event via gtag()
- [ ] T041 [US4] Update `site/.env.example` to add GA4_MEASUREMENT_ID variable
- [ ] T042 [US4] Set GA4_MEASUREMENT_ID environment variable in Cloudflare Pages dashboard and redeploy site
- [ ] T043 [US4] Verify GA4 Real-Time reports show page views when visiting basescape.com and conversion events when submitting a form

**Checkpoint**: GA4 is tracking all page views and form submission events from day one.

---

## Phase 7: User Story 5 - Secondary Forms (Priority: P5)

**Goal**: Quick Callback and Lead Magnet forms work end-to-end on the live site, creating leads with correct formType and sending notifications.

**Independent Test**: Submit each secondary form type on the live site, verify leads appear in CMS with correct formType field and emails are sent.

### Implementation for User Story 5

- [ ] T044 [US5] Test Quick Callback form on live site: submit name + phone, verify lead created in CMS with formType "quick-callback" and team notification email sent
- [ ] T045 [US5] Test Lead Magnet form on live site: submit email, verify lead created in CMS with formType "lead-magnet" and user receives access to PDF download

**Checkpoint**: All three form types (multi-step, quick callback, lead magnet) work end-to-end on production.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Google Places autocomplete integration, final cross-device QA, and launch readiness verification.

- [X] T046 Integrate Google Places Autocomplete in `site/src/components/forms/MultiStepForm.tsx` step 3 -- lazy load Google Maps JS API with `libraries=places`, bind Autocomplete widget to address input, restrict to US addresses with Utah bias, graceful fallback if API unavailable
- [ ] T047 Set GOOGLE_PLACES_API_KEY environment variable in Cloudflare Pages dashboard and redeploy site
- [ ] T048 [P] Test address autocomplete on live site: type a partial address in multi-step form step 3, verify suggestions appear and selecting one fills the field
- [ ] T049 [P] Test tablet rendering at 768px and desktop at 1024px on all page types -- verify layout, navigation, and forms work correctly
- [ ] T050 Run full existing test suite locally (`pnpm test` and `pnpm test:e2e`) and fix any failures
- [ ] T051 Final smoke test: visit every page type on basescape.com (homepage, all 6 service pages, 3 sample location pages, about, how-it-works, FAQ, financing, privacy) and verify no broken content, images, or links

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies -- start immediately
- **Foundational (Phase 2)**: T006 depends on T002 (R2 credentials); T008 depends on T007 (deploy hook created). T007, T009 can start immediately in parallel with Phase 1.
- **US1 (Phase 3)**: Depends on Phase 1 (infrastructure) + Phase 2 (CMS code ready). This is the critical path.
- **US2 (Phase 4)**: Depends on US1 (site must be live to test quality)
- **US3 (Phase 5)**: T026-T031 (content writing) can start in parallel with Phase 1 and Phase 2. T032-T036 (deployment verification) depends on US1 (CMS must be deployed).
- **US4 (Phase 6)**: T037-T041 (code changes) can start in parallel with Phase 1 and Phase 2. T042-T043 (deployment verification) depends on US1 (site must be deployed).
- **US5 (Phase 7)**: Depends on US1 (forms must work on live site)
- **Polish (Phase 8)**: T046-T047 (Places autocomplete) can start in parallel with earlier phases. T048-T051 depend on site being deployed.

### User Story Dependencies

- **US1 (P1)**: CRITICAL PATH -- depends on Phase 1 + Phase 2 completion. All other stories depend on this.
- **US2 (P2)**: Depends on US1 (live site needed for quality testing)
- **US3 (P3)**: Content writing (T026-T031) is INDEPENDENT -- can start immediately. Deployment verification (T032-T036) depends on US1.
- **US4 (P4)**: Code changes (T037-T041) are INDEPENDENT -- can start immediately. Deployment verification (T042-T043) depends on US1.
- **US5 (P5)**: Depends on US1 (live forms needed for testing)

### Parallel Opportunities

Four independent work streams can run simultaneously before deployment:

```
Stream A: Phase 1 (T001-T005) -- Infrastructure provisioning
Stream B: Phase 2 (T006-T009) -- CMS code changes (R2, deploy hook)
Stream C: US4 code (T037-T041) -- GA4 script + events
Stream D: US3 content (T026-T031) -- Seed data rewriting
```

All four converge at T010 (deploy CMS with secrets).

---

## Parallel Example: Pre-Deployment Work

```bash
# These four streams can all run in parallel:

# Stream A: Infrastructure
Task T001: "Create D1 database via wrangler d1 create basescape-cms"
Task T002: "Create R2 bucket via wrangler r2 bucket create basescape-media"
Task T003: "Create Pages project via wrangler pages project create basescape-site"

# Stream B: CMS Code Changes
Task T007: "Create deploy webhook hook at cms/src/hooks/deployHook.ts"
Task T009: "Update cms/.dev.vars.example with new env vars"

# Stream C: GA4 Integration
Task T037: "Add GA4 gtag.js to site/src/layouts/BaseLayout.astro"
Task T038: "Add GA4 events to site/src/components/forms/MultiStepForm.tsx"

# Stream D: Content Polish
Task T026: "Add basement-remodeling service to cms/src/seed.ts"
Task T027: "Add retaining-walls service to cms/src/seed.ts"
Task T028: "Rewrite all 6 service descriptions in cms/src/seed.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (provision Cloudflare resources)
2. Complete Phase 2: Foundational (R2 adapter, deploy hook)
3. Complete Phase 3: US1 (deploy, DNS, test form e2e)
4. **STOP and VALIDATE**: Submit a real lead on basescape.com, verify both emails arrive
5. The business can now capture leads -- everything else is improvement

### Incremental Delivery

1. Streams A+B+C+D in parallel → Code and content ready
2. Deploy CMS + Site → US1 complete (MVP!)
3. Run quality checks → US2 complete
4. Verify content + auto-rebuild → US3 complete
5. Deploy GA4 + verify → US4 complete
6. Test secondary forms → US5 complete
7. Polish (autocomplete, final QA) → Launch complete

### Single-Developer Sequence

Since Steven is the primary developer, the recommended sequence is:

1. **Day 1**: Streams B+C+D (code changes + content) -- all local work
2. **Day 2**: Stream A (provision infra) + deploy CMS + deploy site (Phase 1 + Phase 3)
3. **Day 3**: Phases 4-8 (QA, content verification, GA4, polish)

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [Story] label maps task to specific user story for traceability
- No new collections, models, or schema changes needed -- this is deployment + configuration + content
- Operations stack (JobTread, n8n, Nimbata, OpenPhone, YouCanBook.me) is OUT OF SCOPE
- Phone number routing for Quick Callback is OUT OF SCOPE -- forms capture leads in CMS only
