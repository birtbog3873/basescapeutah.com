# Quickstart: BaseScape Website V1

> Local development setup guide.

## Prerequisites

- **Node.js**: 20.x LTS or later
- **pnpm**: 9.x (package manager)
- **Wrangler**: Cloudflare CLI (`npm install -g wrangler`)
- **Git**: Current branch `001-basescape-website-v1`

## Project Structure

```
basescape/
├── site/          # Astro frontend (Cloudflare Pages)
├── cms/           # Payload CMS (Cloudflare Workers + D1 + R2)
├── package.json   # Root workspace config
└── pnpm-workspace.yaml
```

## 1. Initial Setup

```bash
# Clone and switch to feature branch
cd /Users/stevenbunker/clients/general-contracting
git checkout 001-basescape-website-v1

# Install dependencies
pnpm install

# Authenticate with Cloudflare (one-time)
wrangler login
```

## 2. Payload CMS (Backend)

```bash
cd cms/

# Create local D1 database
wrangler d1 create basescape-cms-dev
# Copy the database_id to wrangler.jsonc

# Create local R2 bucket (for media uploads)
wrangler r2 bucket create basescape-media-dev

# Set secrets (local dev uses .dev.vars file)
cp .dev.vars.example .dev.vars
# Edit .dev.vars with:
#   PAYLOAD_SECRET=<random-32-char-string>
#   RESEND_API_KEY=<from-resend-dashboard>
#   TEAM_NOTIFICATION_EMAIL=<your-email>

# Start Payload CMS dev server
pnpm dev
# → Admin panel: http://localhost:3000/admin
# → REST API: http://localhost:3000/api
```

On first run, Payload will:
1. Run database migrations (push schema to D1)
2. Prompt you to create an admin user

## 3. Astro Site (Frontend)

```bash
cd site/

# Set environment variables
cp .env.example .env
# Edit .env with:
#   PAYLOAD_URL=http://localhost:3000
#   PAYLOAD_API_KEY=<generated-from-payload-admin>
#   PLAUSIBLE_DOMAIN=localhost  (or omit for dev)

# Start Astro dev server
pnpm dev
# → Site: http://localhost:4321
```

## 4. Running Both Together

From the repository root:

```bash
# Starts both CMS and site in parallel
pnpm dev
```

Root `package.json` script:
```json
{
  "scripts": {
    "dev": "pnpm --filter cms dev & pnpm --filter site dev",
    "build": "pnpm --filter cms build && pnpm --filter site build",
    "test": "pnpm --filter site test",
    "test:e2e": "pnpm --filter site test:e2e",
    "test:lighthouse": "pnpm --filter site test:lighthouse"
  }
}
```

## 5. Testing

```bash
cd site/

# Unit tests (Vitest)
pnpm test

# E2E + visual regression (Playwright)
pnpm test:e2e

# Accessibility (axe-core via Playwright)
pnpm test:a11y

# Performance (Lighthouse CI)
pnpm test:lighthouse
```

## 6. Deploying

### Payload CMS → Cloudflare Workers

```bash
cd cms/
wrangler deploy
```

### Astro Site → Cloudflare Pages

Cloudflare Pages is connected to the Git repository. Push to trigger:

```bash
git push origin 001-basescape-website-v1
# → Cloudflare Pages builds and deploys a preview URL
# → Merge to main → production deployment
```

## 7. Key URLs

| Service | Local | Production |
|---------|-------|------------|
| Astro site | http://localhost:4321 | https://basescape.com |
| Payload admin | http://localhost:3000/admin | https://cms.basescape.com/admin |
| Payload API | http://localhost:3000/api | https://cms.basescape.com/api |

## 8. Environment Variables Reference

### Astro Site (`site/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `PAYLOAD_URL` | ✅ | Payload CMS base URL |
| `PAYLOAD_API_KEY` | ✅ | API key for lead creation |
| `PLAUSIBLE_DOMAIN` | ❌ | Plausible analytics domain (omit in dev) |
| `GOOGLE_PLACES_API_KEY` | ❌ | Google Places Autocomplete (address form) |

### Payload CMS (`cms/.dev.vars`)

| Variable | Required | Description |
|----------|----------|-------------|
| `PAYLOAD_SECRET` | ✅ | JWT signing secret (random 32+ chars) |
| `RESEND_API_KEY` | ✅ | Resend transactional email API key |
| `TEAM_NOTIFICATION_EMAIL` | ✅ | Email address for lead notifications |
| `DATABASE_URL` | auto | D1 binding (managed by Wrangler) |
| `R2_BUCKET` | auto | R2 binding (managed by Wrangler) |

## 9. Seeding Content (Development)

After Payload CMS is running, seed initial content:

```bash
cd cms/
pnpm seed
```

This creates:
- 3 services (Walkout Basements, Egress Windows, Window Well Upgrades)
- 25 service areas (launch cities with placeholder content)
- SiteSettings global (NAP, hours, license info)
- Navigation global
- Sample FAQs, reviews, and a test project

## 10. Fonts

Variable fonts are self-hosted via Fontsource:
- **Fraunces** (serif headlines): `@fontsource-variable/fraunces`
- **Space Grotesk** (sans-serif body): `@fontsource-variable/space-grotesk`

Imported in `site/src/layouts/BaseLayout.astro`. No external font CDN calls.
