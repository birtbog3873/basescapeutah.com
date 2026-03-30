# Research: Site CTA and Phone Display Updates

**Feature**: 007-site-cta-updates
**Date**: 2026-03-25

## R1: Scope of CTA Label Changes

**Decision**: Change "Get Free Estimate" to "Book Appointment" in CTA button components only (Header, MobileBottomBar, CTABlock). Leave form headings unchanged.

**Rationale**: The user's request targets the CTA buttons that visitors interact with, not the form headings themselves. The form headings ("Get Your Free Estimate" in BaseLayout, LandingLayout, MultiStepForm) describe the form content, not the action button. The submit button text "Get My Free Estimate" in MultiStepForm is also internal to the form and was not mentioned. Changing these would require a separate decision.

**Affected files**:
- `site/src/components/layout/Header.astro` — line 75: "Get Free Estimate" → "Book Appointment"
- `site/src/components/layout/MobileBottomBar.astro` — line 34: "Free Estimate" → "Book Appointment"
- `site/src/components/content/CTABlock.astro` — line 30: "Get Free Estimate" → "Book Appointment"

**Not changed** (form headings/internal text):
- `site/src/layouts/BaseLayout.astro` — line 69: "Get Your Free Estimate" (form section heading)
- `site/src/layouts/LandingLayout.astro` — line 146: "Get Your Free Estimate" (form heading)
- `site/src/components/forms/MultiStepForm.tsx` — line 181: "Get Your Free Estimate" (form title)
- `site/src/components/forms/MultiStepForm.tsx` — line 361: "Get My Free Estimate" (submit button)

## R2: "Call Now" → Phone Icon + Phone Number

**Decision**: Replace "Call Now" text with inline SVG phone icon + the formatted phone number in all three CTA components.

**Rationale**: The existing phone SVG icon is already used in MobileBottomBar and CTABlock. Reuse the same SVG for consistency. The Header currently has no phone icon on its call link — it just shows the number as text. The user wants the phone icon added next to the number in the desktop menu AND on the call button.

**Affected files**:
- `site/src/components/layout/Header.astro` — line 71-73: Add phone icon SVG before phone number in `header__phone` link. Change from plain text to icon + number.
- `site/src/components/layout/MobileBottomBar.astro` — line 21: "Call Now" → phone number with icon (icon already present).
- `site/src/components/content/CTABlock.astro` — line 27: "Call Now" → phone number with icon (icon already present).

## R3: Phone Icon in Desktop Navigation Menu

**Decision**: The `header__phone` element in Header.astro already displays the phone number in the desktop `header__actions` div. Add the same phone SVG icon inline before the number.

**Rationale**: This is User Story 3. Currently the phone number in the desktop header is plain text. Adding the phone icon makes it visually consistent with the call buttons elsewhere and signals "this is a phone number you can call."

**Affected file**: `site/src/components/layout/Header.astro` — line 71-73.

## R4: Phone Icon SVG Source

**Decision**: Reuse the existing inline SVG phone icon from MobileBottomBar.astro / CTABlock.astro.

**Rationale**: Both components use the identical Lucide-style phone SVG (24x24 viewBox, stroke-based). No external icon library import needed. Use `aria-hidden="true"` on decorative icons since the link text (phone number) already provides meaning.

**SVG to reuse**:
```html
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
</svg>
```

## R5: Test File Updates

**Decision**: Update Playwright test selectors in `site/tests/a11y/homepage.spec.ts` and `site/tests/visual/homepage.spec.ts` to match new button text.

**Rationale**: The a11y test looks for `a:has-text("Call Now")` and `a:has-text("Get Free Estimate")`. After the changes, "Call Now" will become the phone number and "Get Free Estimate" will become "Book Appointment". Tests must be updated or they'll fail.

**Affected files**:
- `site/tests/a11y/homepage.spec.ts` — lines 85, 88, 104, 107
- `site/tests/visual/homepage.spec.ts` — line 30

## R6: Accessibility Approach

**Decision**: Use `aria-hidden="true"` on decorative phone SVG icons. The phone number text in the link serves as the accessible label. Add `aria-label` on the header phone link for extra clarity: "Call (888) 414-0007".

**Rationale**: The phone number is already visible text content. The icon is decorative. Screen readers will announce the link text (the phone number). Adding an aria-label provides additional context that this is a phone call action.
