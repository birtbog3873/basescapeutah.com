# Implementation Plan: Site CTA and Phone Display Updates

**Branch**: `007-site-cta-updates` | **Date**: 2026-03-25 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/007-site-cta-updates/spec.md`

## Summary

Rename all "Get Free Estimate" CTA buttons to "Book Appointment" and replace "Call Now" labels with a phone icon + visible phone number across three components (Header, MobileBottomBar, CTABlock). Add a phone icon to the desktop nav phone number. Update test selectors to match. No data model or form logic changes.

## Technical Context

**Language/Version**: Astro 5.x, TypeScript, React 19 (for form components only)
**Primary Dependencies**: Astro, inline SVG icons (Lucide-style), CSS custom properties
**Storage**: N/A (CMS read-only via `fetchSiteSettings()`)
**Testing**: Playwright (e2e + a11y), Vitest (unit)
**Target Platform**: Web (Cloudflare Pages), responsive (mobile + desktop)
**Project Type**: Static site with SSR components (Astro)
**Performance Goals**: N/A (text/icon changes only)
**Constraints**: Must preserve existing form submission flow, `tel:` link functionality, and CMS-driven phone number
**Scale/Scope**: 3 Astro components + 2 test files

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

No project constitution defined (template only). No gates to evaluate. **PASS.**

**Post-Phase 1 re-check**: Still no gates. **PASS.**

## Project Structure

### Documentation (this feature)

```text
specs/007-site-cta-updates/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0: scope decisions, affected files
├── data-model.md        # Phase 1: no changes needed
├── quickstart.md        # Phase 1: verification guide
└── tasks.md             # Phase 2 output (via /speckit.tasks)
```

### Source Code (repository root)

```text
site/src/
├── components/
│   ├── layout/
│   │   ├── Header.astro           # CTA rename + phone icon in nav + phone icon on call link
│   │   └── MobileBottomBar.astro  # "Call Now" → phone number, "Free Estimate" → "Book Appointment"
│   ├── content/
│   │   └── CTABlock.astro         # "Call Now" → phone number, "Get Free Estimate" → "Book Appointment"
│   └── forms/                     # NO CHANGES (form internals untouched)
├── layouts/                       # NO CHANGES (form headings untouched)
└── ...

site/tests/
├── a11y/
│   └── homepage.spec.ts           # Update CTA text selectors
└── visual/
    └── homepage.spec.ts           # Update CTA text in comments/selectors
```

**Structure Decision**: Existing Astro component structure. All changes are in-place edits to existing files. No new files or directories needed in `site/src/`.

## Implementation Tasks

### Task 1: Update Header.astro (P1 — User Stories 1, 2, 3)

**Changes**:
1. Add phone SVG icon inside `header__phone` link (before the phone number text)
2. Add `aria-label` attribute to `header__phone` for accessibility
3. Rename "Get Free Estimate" to "Book Appointment" in `header__cta`
4. Add flex/gap styling to `header__phone` to align icon + text

**File**: `site/src/components/layout/Header.astro`

**Before** (lines 70-76):
```html
<div class="header__actions">
  <a href={`tel:${phone.replace(/[^\d+]/g, '')}`} class="header__phone">
    {phone}
  </a>
  <a href="#estimate-form" class="header__cta">
    Get Free Estimate
  </a>
</div>
```

**After**:
```html
<div class="header__actions">
  <a href={`tel:${phone.replace(/[^\d+]/g, '')}`} class="header__phone" aria-label={`Call ${phone}`}>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
    {phone}
  </a>
  <a href="#estimate-form" class="header__cta">
    Book Appointment
  </a>
</div>
```

**CSS addition** — add to `.header__phone`:
```css
.header__phone {
  display: inline-flex;
  align-items: center;
  gap: var(--size-1);
  /* existing styles unchanged */
}
```

### Task 2: Update MobileBottomBar.astro (P1 — User Stories 1, 2)

**Changes**:
1. Replace "Call Now" text with `{phone}` (phone number)
2. Replace "Free Estimate" text with "Book Appointment"
3. Pass phone number dynamically (already available in frontmatter)

**File**: `site/src/components/layout/MobileBottomBar.astro`

**Before** (lines 18-35):
```html
<a href={`tel:${phone.replace(/[^\d+]/g, '')}`} class="mobile-bar__btn mobile-bar__btn--call">
  <svg ...>...</svg>
  Call Now
</a>
<a href="#estimate-form" class="mobile-bar__btn mobile-bar__btn--estimate">
  <svg ...>...</svg>
  Free Estimate
</a>
```

**After**:
```html
<a href={`tel:${phone.replace(/[^\d+]/g, '')}`} class="mobile-bar__btn mobile-bar__btn--call" aria-label={`Call ${phone}`}>
  <svg ...>...</svg>
  {phone}
</a>
<a href="#estimate-form" class="mobile-bar__btn mobile-bar__btn--estimate">
  <svg ...>...</svg>
  Book Appointment
</a>
```

**CSS consideration**: The phone number is longer than "Call Now". May need to reduce font-size slightly or let `flex: 1` handle it. Test at 320px viewport width.

### Task 3: Update CTABlock.astro (P1 — User Stories 1, 2)

**Changes**:
1. Replace "Call Now" text with `{phone}` (phone number)
2. Replace "Get Free Estimate" text with "Book Appointment"
3. Add `aria-label` to call button

**File**: `site/src/components/content/CTABlock.astro`

**Before** (lines 23-31):
```html
<a href={`tel:${phoneClean}`} class="cta-block__btn cta-block__btn--call plausible-event-name=Call+Click">
  <svg ...>...</svg>
  Call Now
</a>
<a href={estimateUrl} class="cta-block__btn cta-block__btn--estimate">
  Get Free Estimate
</a>
```

**After**:
```html
<a href={`tel:${phoneClean}`} class="cta-block__btn cta-block__btn--call plausible-event-name=Call+Click" aria-label={`Call ${phone}`}>
  <svg ...>...</svg>
  {phone}
</a>
<a href={estimateUrl} class="cta-block__btn cta-block__btn--estimate">
  Book Appointment
</a>
```

### Task 4: Update Test Files

**File**: `site/tests/a11y/homepage.spec.ts`
- Line 85: `'a:has-text("Call Now")'` → selector matching phone number pattern
- Line 88: `'a:has-text("Get Free Estimate")'` → `'a:has-text("Book Appointment")'`
- Line 104: `text.includes('Call Now')` → match phone number pattern
- Line 107: `text.includes('Get Free Estimate')` → `text.includes('Book Appointment')`

**File**: `site/tests/visual/homepage.spec.ts`
- Line 30: Update comment text referencing "Call Now + Get Free Estimate"

### Task 5: Visual QA and Responsive Testing

Manual verification:
1. Desktop (1024px+): Header shows phone icon + number in nav, "Book Appointment" button
2. Tablet (~768px): Hamburger menu visible, mobile bottom bar active
3. Mobile (375px, 320px): Bottom bar shows phone icon + number, "Book Appointment"
4. Click-through: Both CTAs still work (form opens, call initiates)
5. CMS fallback: Verify fallback phone number renders correctly

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Phone number too wide for mobile bottom bar | Layout overflow on small screens | Test at 320px width; adjust font-size if needed |
| Test selectors break | CI fails | Task 4 updates selectors before merge |
| Form headings inconsistency with CTA labels | User confusion ("Book Appointment" button → "Get Your Free Estimate" heading) | Noted in research.md as intentional. Can be addressed in a follow-up if desired. |

## Complexity Tracking

No constitution violations to justify. This is a straightforward text/icon replacement across 3 components + 2 test files.
