# Data Model: Square Founder Headshot

**Feature**: 010-headshot-aspect-ratio
**Date**: 2026-03-25

## Entities

### Founder Headshot Image

| Attribute      | Current Value                                    | Target Value                                     |
| -------------- | ------------------------------------------------ | ------------------------------------------------ |
| File path      | `site/public/images/team-steven-bunker.webp`     | Same                                             |
| Format         | WebP                                             | WebP                                             |
| Width          | 800px                                            | 800px                                            |
| Height         | 750px                                            | 800px                                            |
| Aspect ratio   | ~1.067:1                                         | 1:1                                              |
| Quality        | Current quality level                            | Same or better                                   |

### HTML Reference (about.astro)

| Attribute | Current Value | Target Value |
| --------- | ------------- | ------------ |
| `width`   | `"800"`       | `"800"`      |
| `height`  | `"750"`       | `"800"`      |

## Relationships

- The `<img>` tag in `about.astro` (line 77-83) references the image by path `/images/team-steven-bunker.webp`
- CSS class `.team-member__photo` applies `aspect-ratio: 1/1` and `object-fit: cover` — no CSS changes needed
- No other pages or components reference this image
