# Data Model: Integrate Site Images

## Entities

This feature introduces no new entities. It adds data to an existing interface.

### HeroImage (existing interface, unchanged)

Used by ServiceCard and ServiceLayout components.

```
HeroImage {
  url: string   — URL path to the image (e.g., "/images/services/hero-walkout-basements.webp")
  alt: string   — Descriptive alt text for accessibility
}
```

### Image File Mapping

| Logical Name                      | File Path                                        | Dimensions | Max Size |
| --------------------------------- | ------------------------------------------------ | ---------- | -------- |
| Homepage Hero                     | `/images/services/hero-homepage.webp`            | 1200x800   | 500KB    |
| Card: Walkout Basements           | `/images/services/card-walkout-basements.webp`   | 600x400    | 300KB    |
| Card: Egress Windows              | `/images/services/card-egress-windows.webp`      | 600x400    | 300KB    |
| Card: Window Well Upgrades        | `/images/services/card-window-well-upgrades.webp`| 600x400    | 300KB    |
| Service Hero: Walkout Basements   | `/images/services/hero-walkout-basements.webp`   | 1200x800   | 500KB    |
| Service Hero: Egress Windows      | `/images/services/hero-egress-windows.webp`      | 1200x800   | 500KB    |
| Service Hero: Window Well Upgrades| `/images/services/hero-window-well-upgrades.webp`| 1200x800   | 500KB    |

### Source → Destination Mapping

| Source (~/Pictures/gemini-output/)                                    | Destination                          |
| --------------------------------------------------------------------- | ------------------------------------ |
| `photorealistic-...-a-20260325-112643.png`                            | `hero-homepage.webp`                 |
| `photorealistic-...-a-20260325-110138.png`                            | `card-walkout-basements.webp`        |
| `photorealistic-...-an-20260325-112814.png`                           | `card-egress-windows.webp`           |
| `photorealistic-...-a-close-20260325-112854.png`                      | `card-window-well-upgrades.webp`     |
| `photorealistic-...-a-20260325-112735.png`                            | `hero-walkout-basements.webp`        |
| `in-the-window-well-...-20260325-111748.png`                          | `hero-egress-windows.webp`           |
| `remove-the-extra-...-20260325-114551.png`                            | `hero-window-well-upgrades.webp`     |
