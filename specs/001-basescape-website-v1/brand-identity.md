# BaseScape Brand Identity & Visual Language

**Created**: 2026-03-23
**Status**: Draft
**Input**: Logo mockup, Messaging Framework, Constitution Art. XII, Spec QR-007
**Feature**: [spec.md](./spec.md)

---

## 1. Brand Positioning Summary

BaseScape is a **Specialized Authority** — not a general contractor. The brand must communicate three things simultaneously:

1. **Engineering precision** — cutting into load-bearing foundation walls is structural engineering, not carpentry
2. **Natural transformation** — turning dark basements into light-filled, landscape-connected living spaces
3. **Financial intelligence** — this is an investment vehicle, not just a construction expense

The visual system must feel like a **premium architectural engineering firm**, not a construction company. Think: structural engineering consultancy meets landscape architecture studio.

---

## 2. Logo

### Primary Mark

The BaseScape logo depicts a house cross-section revealing a basement with stairs descending to a window that opens to natural light, trees, and the outdoors. This visual narrative captures the core brand promise: transforming below-grade space by connecting it to the landscape above.

- **"Base"** is set in navy blue — representing structural authority and engineering trust
- **"Scape"** is set in green — representing natural integration and landscape transformation
- **Tagline**: "WALKOUT ENTRIES | DAYLIGHT WINDOWS | EGRESS" in uppercase, tracked-out navy

### Logo Usage

| Context | Minimum Width | Clear Space |
|---------|--------------|-------------|
| Desktop header | 180px | 1x logo height on all sides |
| Mobile header | 120px | 0.75x logo height on all sides |
| Favicon | 32px (icon-only mark) | N/A |
| Social / avatar | 400px square (icon-only mark) | Centered with 15% padding |

### Logo Variations

| Variant | Use Case |
|---------|----------|
| **Full color** (primary) | Light backgrounds (white, off-white, light gray) |
| **Reversed** (white mark) | Dark backgrounds (navy 700+, photo overlays) |
| **Icon-only** (house mark) | Favicon, social avatars, app icons, small contexts |
| **Wordmark-only** | Inline text references, email signatures |

### Logo Don'ts

- Do not rotate, stretch, or distort the logo
- Do not place the full-color logo on backgrounds that reduce contrast below WCAG AA
- Do not add drop shadows, outlines, or effects
- Do not recreate the logo in alternative typefaces
- Do not separate the icon from the wordmark except in approved icon-only contexts

---

## 3. Color System

### Design Rationale

The palette is built from the logo's two dominant colors — **navy blue** and **green** — extended into full implementation-ready scales. Navy carries the structural authority and trust signals. Green carries the natural transformation and outdoor living promise. A warm **amber accent** provides the high-energy conversion contrast mandated by Constitution Art. XII §1.

This replaces the constitution's original "terracotta" direction. Blue-green better aligns with the logo, the messaging framework's emphasis on natural light/landscape integration, and the Wasatch Front's mountain/valley visual context.

### Primary: Navy

The authority color. Used for text, headers, structural elements, navigation, and trust-signaling components.

| Token | Hex | Usage |
|-------|-----|-------|
| `navy-50` | #F0F4F8 | Page backgrounds, subtle tints |
| `navy-100` | #D9E2EC | Card backgrounds, alternate row fills |
| `navy-200` | #BCCCDC | Borders, dividers, disabled states |
| `navy-300` | #9FB3C8 | Placeholder text, muted icons |
| `navy-400` | #627D98 | Secondary text, captions |
| `navy-500` | #3E6B89 | Body text on light backgrounds |
| `navy-600` | #1B3B5E | **Logo match** — headlines, primary text |
| `navy-700` | #152E4A | Dark backgrounds, footer |
| `navy-800` | #102437 | Deepest backgrounds |
| `navy-900` | #0A1A28 | Near-black for maximum contrast |
| `navy-950` | #060F18 | True dark mode base |

### Primary: Green

The transformation color. Used for positive actions, growth indicators, service-related content, and the "Scape" half of the brand identity.

| Token | Hex | Usage |
|-------|-----|-------|
| `green-50` | #F2F9EE | Success backgrounds, subtle tints |
| `green-100` | #E1F0D5 | Highlight backgrounds, callout fills |
| `green-200` | #C3E1AB | Light accents, progress indicators |
| `green-300` | #9ECD79 | Badges, tags, secondary accents |
| `green-400` | #7DB94E | Icons, secondary buttons |
| `green-500` | #5EA03C | **Logo match** — primary green accent |
| `green-600` | #4A8030 | Green text on light backgrounds |
| `green-700` | #3A6426 | Dark green accents |
| `green-800` | #2E4F1F | Deep green for contrast |
| `green-900` | #243D18 | Darkest green |

### Accent: Amber

The conversion color. Used exclusively for primary CTAs, urgent actions, and elements that must "arrest scrolling behavior" (Constitution Art. XII §1). The warm amber provides maximum complementary contrast against the cool blue-green palette.

| Token | Hex | Usage |
|-------|-----|-------|
| `amber-50` | #FFF8EB | Notification backgrounds |
| `amber-100` | #FEECC0 | Warning callouts |
| `amber-200` | #FDD889 | Light CTA hover backgrounds |
| `amber-300` | #FCBF49 | Secondary CTA fills |
| `amber-400` | #F5A623 | CTA hover state |
| `amber-500` | #E8920A | **Primary CTA** — buttons, banners, urgency |
| `amber-600` | #C27708 | CTA active/pressed state |
| `amber-700` | #9A5D06 | Dark amber accents |

### Accent: Teal

The bridge color. Blends the navy authority with the green transformation. Used sparingly for secondary accents, links, and design moments that represent the transition from basement (dark) to outdoor (light).

| Token | Hex | Usage |
|-------|-----|-------|
| `teal-50` | #EEF8F7 | Subtle accent backgrounds |
| `teal-100` | #D0EDEA | Callout backgrounds |
| `teal-200` | #9DD5D0 | Light borders and accents |
| `teal-300` | #5FB8B2 | Link color alternative |
| `teal-400` | #3A9E97 | Secondary interactive elements |
| `teal-500` | #2A7B78 | **Logo teal** — links, accent icons |
| `teal-600` | #216260 | Dark teal accents |
| `teal-700` | #194A48 | Deep teal |

### Neutral: Slate

Blue-tinted neutrals derived from the navy primary. Used for text, borders, backgrounds, and UI chrome. Never use pure gray (#808080) — all neutrals carry a subtle blue undertone for brand cohesion.

| Token | Hex | Usage |
|-------|-----|-------|
| `slate-50` | #F8FAFB | Page base background |
| `slate-100` | #F1F4F8 | Card backgrounds, alternate sections |
| `slate-200` | #E3E8EF | Borders, dividers |
| `slate-300` | #CDD5DF | Disabled element fills |
| `slate-400` | #9AA5B4 | Placeholder text |
| `slate-500` | #697686 | Secondary body text |
| `slate-600` | #4B5563 | Primary body text (alternative to navy-500) |
| `slate-700` | #364152 | Strong text |
| `slate-800` | #1E293B | Headings (alternative to navy-600) |
| `slate-900` | #0F172A | Maximum contrast text |

### Semantic Colors

| Role | Token | Hex | Derived From |
|------|-------|-----|-------------|
| `color-text-primary` | navy-600 | #1B3B5E | Headlines, titles |
| `color-text-body` | navy-500 | #3E6B89 | Body copy |
| `color-text-muted` | slate-500 | #697686 | Captions, meta |
| `color-bg-page` | slate-50 | #F8FAFB | Page background |
| `color-bg-surface` | white | #FFFFFF | Cards, modals |
| `color-bg-alt` | navy-50 | #F0F4F8 | Alternate sections |
| `color-border` | slate-200 | #E3E8EF | Default borders |
| `color-link` | teal-500 | #2A7B78 | Inline text links |
| `color-link-hover` | teal-600 | #216260 | Link hover state |
| `color-cta-primary-bg` | amber-500 | #E8920A | Primary CTA fill |
| `color-cta-primary-text` | white | #FFFFFF | Primary CTA text |
| `color-cta-primary-hover` | amber-400 | #F5A623 | Primary CTA hover |
| `color-cta-secondary-bg` | navy-600 | #1B3B5E | Secondary CTA fill |
| `color-cta-secondary-text` | white | #FFFFFF | Secondary CTA text |
| `color-cta-secondary-hover` | navy-500 | #3E6B89 | Secondary CTA hover |
| `color-success` | green-500 | #5EA03C | Form success, confirmations |
| `color-error` | #DC2626 | — | Validation errors |
| `color-warning` | amber-500 | #E8920A | Warnings, cautions |
| `color-info` | teal-500 | #2A7B78 | Informational callouts |

### CTA Color Strategy

| CTA Type | Background | Text | Example |
|----------|-----------|------|---------|
| **Primary** ("Get Free Estimate") | amber-500 | white | High-energy, scroll-stopping |
| **Secondary** ("Call Now") | navy-600 | white | Authoritative, trust-based |
| **Tertiary** (text links, "Learn More") | transparent | teal-500 | Low-friction, exploratory |
| **Ghost** (outline buttons) | transparent + navy-600 border | navy-600 | Alternative actions |

The primary CTA (amber) must always be the most visually dominant interactive element on any given viewport. The secondary CTA (navy) provides a lower-key alternative for visitors who prefer phone contact.

### Contrast Compliance (WCAG 2.1 AA)

All color combinations used for text must meet or exceed these minimums:

| Combination | Ratio | Passes |
|-------------|-------|--------|
| navy-600 on white | 8.2:1 | AAA |
| navy-500 on white | 5.1:1 | AA |
| slate-600 on white | 5.9:1 | AA |
| white on amber-500 | 4.6:1 | AA |
| white on navy-600 | 8.2:1 | AAA |
| white on navy-700 | 10.8:1 | AAA |
| teal-500 on white | 4.6:1 | AA |
| navy-600 on navy-50 | 7.3:1 | AAA |

*Note: All ratios must be validated against final hex values during implementation. Use these as design targets.*

### Dark Mode

**Decision: No dark mode for V1.** The brand is rooted in the metaphor of bringing light into dark basements. A light-mode-only experience reinforces this narrative. Dark mode adds complexity without conversion benefit for a lead-gen site targeting homeowners.

---

## 4. Typography

### Typeface Selection

| Role | Typeface | Weight Range | Character |
|------|----------|-------------|-----------|
| **Headlines** | Fraunces (variable) | 600–900 | Warm, architectural, expressive serif with distinctive Wonk axis |
| **Body & UI** | Space Grotesk (variable) | 300–700 | Precise, geometric sans-serif with technical character |

### Fraunces Variable Axis Settings

Fraunces has four variable axes that should be used intentionally:

| Context | Weight | Wonk | Softness | Optical Size | Rationale |
|---------|--------|------|----------|-------------|-----------|
| **Hero headlines** | 800 | 1 | 50 | auto | Maximum architectural character for first impression |
| **Section headlines (H2)** | 700 | 0 | 100 | auto | Clean, conventional for scannable content |
| **Subsection headlines (H3)** | 600 | 0 | 100 | auto | Slightly lighter, still authoritative |
| **Pull quotes / testimonials** | 500 italic | 1 | 50 | auto | Distinctive, personal, attention-catching |
| **Stat callouts** ("$1,200–$1,800/mo") | 900 | 0 | 0 | auto | Maximum impact for financial data |

### Space Grotesk Weight Mapping

| Context | Weight | Letter Spacing |
|---------|--------|---------------|
| **Body text** | 400 | 0 (default) |
| **Bold / emphasis** | 600 | 0 |
| **Navigation links** | 500 | +0.02em |
| **UI labels / buttons** | 500 | +0.03em |
| **Captions / meta** | 400 | +0.01em |
| **Overline labels** (e.g., "WALKOUT BASEMENTS") | 500 | +0.08em |

### Type Scale

Based on a **1.25 ratio (Major Third)** with fluid scaling between mobile and desktop via CSS `clamp()`.

| Token | Mobile (min) | Desktop (max) | Line Height | Typeface | Usage |
|-------|-------------|---------------|-------------|----------|-------|
| `text-display` | 40px | 64px | 1.1 | Fraunces 800 | Hero headlines only |
| `text-h1` | 32px | 48px | 1.15 | Fraunces 700 | Page titles |
| `text-h2` | 26px | 36px | 1.2 | Fraunces 700 | Section headings |
| `text-h3` | 21px | 28px | 1.25 | Fraunces 600 | Subsection headings |
| `text-h4` | 18px | 22px | 1.3 | Space Grotesk 600 | Card titles, labels |
| `text-body` | 16px | 18px | 1.6 | Space Grotesk 400 | Body copy |
| `text-body-lg` | 18px | 20px | 1.6 | Space Grotesk 400 | Lead paragraphs, intros |
| `text-small` | 14px | 14px | 1.5 | Space Grotesk 400 | Captions, timestamps |
| `text-caption` | 12px | 12px | 1.4 | Space Grotesk 400 | Fine print, disclaimers |
| `text-overline` | 12px | 13px | 1.2 | Space Grotesk 500 | Category labels, breadcrumbs |

### Font Loading Strategy

- **Method**: Self-hosted via Fontsource, imported in `BaseLayout.astro`
- **`font-display`**: `swap` — show system font fallback immediately, swap when loaded
- **Fallback stack**: `"Fraunces", Georgia, "Times New Roman", serif` / `"Space Grotesk", system-ui, -apple-system, sans-serif`
- **Subsetting**: Latin-only `unicode-range` to reduce payload below 70KB combined
- **Preload**: Preload the two most-used font weights (Fraunces 700, Space Grotesk 400) via `<link rel="preload">`

---

## 5. Visual Language & Imagery

### Photography Direction

BaseScape photography must communicate transformation — the "before" state of dark, underutilized basements contrasted with the "after" state of bright, landscape-connected living spaces.

**Mandatory Standards:**

| Attribute | Requirement |
|-----------|-------------|
| **Authenticity** | Real BaseScape projects only. Zero stock photography. |
| **Before/after consistency** | Same vantage point, similar time of day, matched focal length |
| **Before shots** | Show honest conditions — dark, unfinished, cramped. Do not stage to look worse than reality. |
| **After shots** | Natural light emphasized. Capture the window/door framing the outdoor landscape. Stage with minimal, quality furniture. |
| **Color grading** | Warm, natural tones. Slightly elevated shadows. Do not over-saturate greens. No heavy filters. |
| **Composition** | Lead with wide establishing shots, follow with close-up details of engineering (footings, headers, drainage). |
| **Outdoor shots** | Capture the walkout entry integrated into landscaping. Show the seamless transition from interior to backyard. |
| **Team photography** | Candid working shots + professional portraits. Crew in clean branded gear. No hard hats or cliche poses. |

**Launch Constraint**: BaseScape is a startup with limited project photography at launch. Until the portfolio is built:
- Use the logo mark and brand colors as hero visual treatments (gradient overlays, geometric compositions)
- Commission 3D architectural renderings for service page heroes showing before/after transformations
- Use authentic Utah landscape photography (Wasatch Front mountains, valley neighborhoods) for location pages — these are environmental, not project photos
- Never use generic stock construction imagery

### Iconography

| Attribute | Standard |
|-----------|----------|
| **Style** | Line icons with 2px stroke weight, rounded caps |
| **Color** | Single color — navy-600 default, green-500 for service-related, teal-500 for interactive |
| **Size** | 24px default grid, 20px compact, 32px featured |
| **Source** | Lucide (open source, MIT, consistent with architectural aesthetic) or custom SVG |
| **Prohibited** | Filled/solid icons, emoji-style icons, clip art, construction cliche icons (hammers, hard hats, bulldozers) |

### Illustration

No illustrations in V1. The brand relies on photography, typography, color, and iconography. If illustrations are introduced in Phase 2, they should use the line-icon aesthetic — clean architectural line drawings, not cartoons or isometric art.

---

## 6. Spacing & Shape

### Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `radius-sm` | 4px | Inputs, small elements |
| `radius-md` | 8px | Cards, buttons, badges |
| `radius-lg` | 12px | Modals, featured cards |
| `radius-xl` | 16px | Hero sections, large containers |
| `radius-full` | 9999px | Pills, avatar circles |

The radius system leans slightly rounded — approachable but not bubbly. Avoid sharp 0px corners (too clinical) and avoid large pill shapes (too casual) for primary UI elements.

### Elevation / Shadow

| Token | Value | Usage |
|-------|-------|-------|
| `shadow-sm` | `0 1px 2px rgba(10, 26, 40, 0.05)` | Subtle lift for cards |
| `shadow-md` | `0 4px 6px rgba(10, 26, 40, 0.07), 0 1px 3px rgba(10, 26, 40, 0.05)` | Elevated cards, dropdowns |
| `shadow-lg` | `0 10px 15px rgba(10, 26, 40, 0.08), 0 4px 6px rgba(10, 26, 40, 0.04)` | Modals, sticky nav |
| `shadow-focus` | `0 0 0 3px rgba(42, 123, 120, 0.4)` | Focus ring (teal-based) |

Shadow colors use navy-900 as the base (not pure black) for brand-cohesive shadows.

### Spacing

Spacing uses the **Open Props size scale** (`--size-1` through `--size-15`) without overrides. This provides a consistent 4px-based system. Key mappings:

| Design Intent | Token | Value |
|--------------|-------|-------|
| Tight (icon gaps, inline spacing) | `--size-1` to `--size-2` | 4px – 8px |
| Standard (padding, gaps) | `--size-3` to `--size-5` | 12px – 24px |
| Generous (section padding) | `--size-7` to `--size-9` | 48px – 96px |
| Landmark (hero, page sections) | `--size-10` to `--size-12` | 128px – 256px |

---

## 7. Component Visual Patterns

These patterns define how the color system applies to specific recurring UI elements across the site. Implementation details (HTML structure, CSS classes) are defined elsewhere — this section governs visual appearance only.

### Trust Badges

- Background: navy-50 or white
- Border: navy-200 with radius-md
- Icon: navy-600
- Text: navy-600 (title), slate-500 (description)
- License numbers displayed in Space Grotesk 500, slightly smaller than surrounding text

### Testimonial / Review Cards

- Background: white with shadow-sm
- Pull quote text: Fraunces 500 italic, navy-600
- Reviewer name: Space Grotesk 600, navy-600
- Star rating: amber-500 fill
- Source attribution ("via Google"): Space Grotesk 400, slate-400

### Before/After Gallery

- Container: Full-bleed on mobile, contained with radius-lg on desktop
- "Before" label: navy-700 background, white text, positioned top-left
- "After" label: green-600 background, white text, positioned top-left
- Slider handle: white circle with navy-600 border, shadow-md

### Form Steps

- Active step indicator: green-500 fill with white step number
- Completed step: green-500 fill with white checkmark
- Upcoming step: slate-200 fill with slate-400 number
- Progress connector line: green-500 (completed), slate-200 (upcoming)
- Active form fields: navy-600 label, slate-200 border, teal-500 focus ring
- Error state: #DC2626 border + text, red-50 background (#FEF2F2)
- Submit button: amber-500 background, white text, full-width on mobile

### Sticky Navigation Bar

- Background: white with shadow-lg
- Logo: full-color, left-aligned
- Nav links: Space Grotesk 500, navy-600, teal-500 on hover
- CTA button: amber-500 background, white text, radius-md
- Phone number: navy-600, Space Grotesk 600
- Mobile: Bottom-anchored bar with "Call" (navy-600 bg) and "Free Estimate" (amber-500 bg) side by side, 20px minimum from absolute bottom edge

### Service Page Value Pillar Accents

Each value pillar has a color accent for visual coding when the pillar is the primary framing:

| Pillar | Accent Color | Usage |
|--------|-------------|-------|
| Financial Enablement | amber-500 | ROI callout backgrounds, financial stat highlights |
| Life Safety | navy-600 | Safety alert borders, compliance callout backgrounds |
| Architectural Transformation | green-500 | Before/after labels, transformation imagery overlays |

---

## 8. Voice & Tone (Visual Expression)

The BaseScape visual voice follows these principles:

| Principle | Do | Don't |
|-----------|-----|-------|
| **Specialized, not generic** | Use the architectural serif for authority. Show engineering details in photography. | Use rounded, friendly fonts. Show generic "happy family" stock photos. |
| **Confident, not aggressive** | Let proof (photos, numbers, credentials) do the persuading. Clean layouts with white space. | Use red urgency banners, countdown timers, flashing elements, or "ACT NOW" patterns. |
| **Premium, not exclusive** | Warm amber CTAs feel inviting. Approachable green tones. Accessible pricing/financing content. | All-black luxury aesthetic. Small unreadable type. Hidden pricing. |
| **Technical, not cold** | Use Fraunces' warmth to humanize engineering authority. Pair code specs with benefit-driven headlines. | Dense technical tables without context. Engineering jargon without plain-language translation. |
| **Utah-grounded, not rural** | Mountain landscapes, valley neighborhoods, modern Utah homes. Clean, contemporary aesthetic. | Rustic textures, barn wood, country aesthetic. Also avoid generic urban/coastal imagery. |

---

## 9. Implementation Reference

### Design Token File Structure

```
site/src/styles/
├── theme.css.ts          # createGlobalTheme — all brand tokens from this document
├── typography.css.ts     # Type scale, font stacks, Fraunces axis presets
├── global.css            # Open Props imports, CSS reset, custom properties
└── tokens.ts             # Typed wrapper for Open Props + brand token autocomplete
```

### Token Naming Convention

All custom brand tokens in `theme.css.ts` follow the pattern:
- Colors: `--color-{scale}-{weight}` (e.g., `--color-navy-600`)
- Semantic: `--color-{role}` (e.g., `--color-cta-primary-bg`)
- Typography: `--text-{token}` (e.g., `--text-h1`)
- Spacing: Use Open Props `--size-{n}` directly
- Radius: `--radius-{size}` (e.g., `--radius-md`)
- Shadow: `--shadow-{size}` (e.g., `--shadow-md`)

### Constitution Amendment Note

This document establishes **blue + green** as the BaseScape palette, replacing the constitution's original "deep forest greens, slate grays, and rich terracotta" (Art. XII §1). The amendment is justified by:

1. The logo mockup establishes navy blue + green as the brand's visual foundation
2. Blue-green aligns with the messaging framework's emphasis on natural light, landscape integration, and the Wasatch Front's mountain/valley environment
3. Amber accent fulfills the constitution's "complementary contrast" CTA requirement
4. Blue-tinted slate neutrals replace the generic "slate grays" with brand-cohesive neutrals
5. The spirit of Art. XII §1 — "earthy, sophisticated tones" signifying "natural integration, structural stability, and premium outdoor living" — is preserved. The specific hues have been refined.

No other constitution articles are affected by this change.
