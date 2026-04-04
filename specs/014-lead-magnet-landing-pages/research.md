# Research: Lead Magnet Dedicated Landing Pages

**Feature**: 014-lead-magnet-landing-pages
**Date**: 2026-04-04

## R1: URL Pattern for Guide Landing Pages

**Decision**: Use `/guides/[slug]` route pattern

**Rationale**: The `/lp/` prefix is already used for PaidLandingPages (ad-driven campaigns with suppressed navigation, noindex meta tags, and campaign-specific UTMs). Lead magnet guides are organic content pages that should be indexable and use standard site navigation. A `/guides/` prefix semantically communicates "free educational resource" and avoids confusion with paid campaigns.

**Alternatives considered**:
- `/lp/[slug]` -- Rejected: Conflates paid ad landing pages with organic guide pages. PaidLandingPages use a LandingLayout with suppressed nav and noindex, which is wrong for SEO-friendly guide pages.
- `/resources/[slug]` -- Viable but more generic. `/guides/` is more specific and matches the "Download Free Guide" CTA language.
- `/lead-magnets/[slug]` -- Rejected: Exposes internal marketing terminology to visitors.

---

## R2: Layout Choice for Guide Pages

**Decision**: Create a new `GuideLayout.astro` that wraps `BaseLayout`

**Rationale**: Guide landing pages need standard site navigation (header, footer, mobile bottom bar) unlike PaidLandingPages which suppress navigation. However, the page structure differs from service pages -- it needs a two-column hero with cover image + form. A dedicated layout keeps the guide-specific markup clean without bloating existing layouts.

**Alternatives considered**:
- Reuse `LandingLayout.astro` -- Rejected: Designed for paid campaigns with suppressed navigation, noindex, campaign UTMs. Would require conditional logic that adds complexity.
- Inline in `[slug].astro` page -- Rejected: Would duplicate BaseLayout boilerplate and be harder to maintain if more guides are added.

---

## R3: CMS Field Types for New Lead Magnet Fields

**Decision**: `coverImage` as upload (relationTo: 'media'), `benefits` as richText (Lexical)

**Rationale**:
- `coverImage`: Same pattern as `thumbnailImage` already on the collection. Upload to media collection for R2 storage, consistent with all other image fields in the project.
- `benefits`: Rich text (Lexical) allows bullet lists, bold text, and flexible formatting. The project already uses `@payloadcms/richtext-lexical` for `bodyContent` on PaidLandingPages and `content` on BlogPosts. The existing `serialize-lexical.ts` utility handles Lexical JSON → HTML conversion.

**Alternatives considered**:
- `benefits` as array of text fields -- Rejected: Too rigid. Rich text allows formatting freedom (bold key phrases, nested bullets, links) that a flat text array cannot.
- `benefits` as textarea -- Rejected: No formatting support. Rich text is already the standard for content fields in this project.

---

## R4: Reuse vs. New Form Component

**Decision**: Reuse existing `LeadMagnetForm.tsx` unchanged

**Rationale**: The form already handles email capture, honeypot protection, source tracking (UTM, referrer, page), GA4 event tracking (`lead_magnet_submit`), and download link display on success. The `leadMagnetId` prop maps to the slug used in CMS queries. No functional changes needed -- just render it on the new landing page.

**Alternatives considered**:
- New form component with more fields -- Rejected: The spec calls for the same email capture form. Adding complexity would reduce conversion rates.
- Embed form in layout instead of component -- Rejected: The React component handles client-side validation and state management which can't be done in Astro.

---

## R5: Service Page CTA Link Strategy

**Decision**: Add optional `landingPageUrl` prop to `LeadMagnetCTA.astro`; when present, override the `#anchor` href

**Rationale**: The CTA component currently uses `href="#lead-magnet-{leadMagnetId}"` to scroll to an inline form. Adding an optional `landingPageUrl` prop allows progressive migration: service pages pass the guide URL, while any future use case that needs inline forms can omit it. This is backward-compatible and requires minimal component changes.

**Alternatives considered**:
- Always use URL (remove anchor support) -- Rejected: Blog posts or other contexts might want inline behavior in the future.
- Create a new `LeadMagnetLink` component -- Rejected: Unnecessary component proliferation. One prop addition is simpler.

---

## R6: Handling Missing Cover Image / Benefits

**Decision**: Graceful degradation -- render without missing elements

**Rationale**: Both `coverImage` and `benefits` are optional CMS fields. The landing page should render a valid layout even if one or both are missing. If no cover image: show only the form and benefits text. If no benefits: show cover image and form. If neither: show title, description, and form (minimal viable page). This matches the edge cases defined in the spec.

**Alternatives considered**:
- Require both fields for publication -- Rejected: Adds friction for CMS admins. A landing page with just a title, description, and form is still functional for lead capture.
