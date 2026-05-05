/**
 * Adds a Concrete Flatwork Service record to the production CMS, repositions
 * the existing Pavers & Hardscapes Service overview/FAQ, and updates the
 * Navigation global to include the new service.
 *
 * Usage:
 *   SEED_API_BASE=https://admin.basescapeutah.com \
 *   SEED_EMAIL=admin@... \
 *   SEED_PASSWORD=... \
 *   pnpm --filter @basescape/cms exec tsx src/scripts/add-concrete-flatwork.ts
 *
 * Idempotent: re-running checks for existing records and skips/updates instead
 * of duplicating.
 */

const API_BASE = process.env.SEED_API_BASE || (() => {
  throw new Error('SEED_API_BASE env var required (e.g., https://admin.basescapeutah.com)')
})()
const EMAIL = process.env.SEED_EMAIL ?? (() => {
  throw new Error('SEED_EMAIL env var required')
})()
const PASSWORD = process.env.SEED_PASSWORD ?? (() => {
  throw new Error('SEED_PASSWORD env var required')
})()

let token = ''

// ---------------------------------------------------------------------------
// Lexical richText helpers
// ---------------------------------------------------------------------------

function richText(text: string) {
  return {
    root: {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              text,
              format: 0,
              detail: 0,
              mode: 'normal',
              style: '',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          textFormat: 0,
          version: 1,
        },
      ],
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  }
}

// ---------------------------------------------------------------------------
// HTTP helper
// ---------------------------------------------------------------------------

async function api(method: string, path: string, body?: unknown): Promise<any> {
  const url = `${API_BASE}${path}`
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `JWT ${token}`

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await res.text()
  let data: any
  try { data = JSON.parse(text) } catch { data = text }
  if (!res.ok) {
    const err = typeof data === 'object' ? JSON.stringify(data, null, 2) : data
    throw new Error(`${method} ${path} failed (${res.status}): ${err}`)
  }
  return data
}

// ---------------------------------------------------------------------------
// Step 1: Authenticate
// ---------------------------------------------------------------------------

async function login() {
  console.log(`→ Logging in to ${API_BASE} as ${EMAIL}`)
  const res = await fetch(`${API_BASE}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Login failed (${res.status}): ${text}`)
  }
  const data = await res.json() as { token: string }
  token = data.token
  console.log('  ✓ Authenticated')
}

// ---------------------------------------------------------------------------
// Step 2: Reposition Pavers & Hardscapes Service overview
// ---------------------------------------------------------------------------

async function updatePaversOverview() {
  console.log('→ Updating Pavers & Hardscapes overview')
  const found = await api('GET', `/api/services?where[slug][equals]=pavers-hardscapes&limit=1`)
  const pavers = found.docs?.[0]
  if (!pavers) {
    console.log('  ⚠ Pavers service not found — skipping overview update')
    return
  }

  const newOverview = richText(
    'Your outdoor space should be an extension of your home you actually want to use. ' +
    'BaseScape designs and installs custom paver patios, walkways, driveways, fire pit ' +
    'surrounds, and outdoor living areas using premium interlocking pavers, natural stone, ' +
    "and engineered base systems purpose-built for the Wasatch Front's freeze-thaw cycles. " +
    'Pavers shine where joints can flex with ground movement, where individual units can ' +
    'be replaced if a section is damaged, and where the look of distinct units is part of ' +
    'the design. For driveways, garage floors, and large continuous slabs, we also pour ' +
    'concrete flatwork — and we will tell you honestly which material fits your specific project.'
  )

  await api('PATCH', `/api/services/${pavers.id}`, { overview: newOverview })
  console.log(`  ✓ Updated Pavers Service id=${pavers.id}`)
}

// ---------------------------------------------------------------------------
// Step 3: Update the "Are pavers better than concrete for patios?" FAQ
// ---------------------------------------------------------------------------

async function updatePaversFAQ() {
  console.log('→ Updating "Are pavers better than concrete for patios?" FAQ')
  const found = await api('GET', `/api/faqs?where[question][equals]=${encodeURIComponent('Are pavers better than concrete for patios?')}&limit=1`)
  const faq = found.docs?.[0]
  if (!faq) {
    console.log('  ⚠ Original FAQ not found — may already be updated. Skipping.')
    return
  }
  await api('PATCH', `/api/faqs/${faq.id}`, {
    question: 'Should I choose pavers or concrete for my patio?',
    answer: richText(
      "Both work in Utah's climate when installed correctly — the question is which fits " +
      'your specific project. Pavers shine for patios, walkways, and pool decks where joints ' +
      'can flex with ground movement, where individual units can be replaced if damaged, and ' +
      'where distinct units are part of the design. Properly poured air-entrained concrete ' +
      'with engineered control joints is an excellent choice for driveways, garage floors, ' +
      'basement slabs, sidewalks, and large continuous patios. BaseScape installs both and ' +
      "recommends the right material for the project rather than the one we'd rather sell you."
    ),
  })
  console.log(`  ✓ Updated FAQ id=${faq.id}`)
}

// ---------------------------------------------------------------------------
// Step 4: Find or fetch the Pavers heroImage media id (reuse for concrete fallback)
// ---------------------------------------------------------------------------

async function getFallbackHeroImageId(): Promise<string | number | null> {
  console.log('→ Locating a fallback heroImage media id (will be replaced via admin UI)')
  const services = await api('GET', `/api/services?where[slug][equals]=pavers-hardscapes&limit=1`)
  const pavers = services.docs?.[0]
  const heroId = pavers?.heroImage?.id ?? pavers?.heroImage ?? null
  if (heroId) {
    console.log(`  ✓ Using media id=${heroId} as initial heroImage`)
    return heroId
  }
  console.log('  ⚠ Could not resolve a fallback heroImage. The new Service may need a heroImage set in admin.')
  return null
}

// ---------------------------------------------------------------------------
// Step 5: Create the Concrete Flatwork Service (idempotent)
// ---------------------------------------------------------------------------

async function createConcreteFlatworkService(heroImageId: string | number | null) {
  console.log('→ Creating Concrete Flatwork Service')
  const existing = await api('GET', `/api/services?where[slug][equals]=concrete-flatwork&limit=1`)
  if (existing.docs?.[0]) {
    console.log(`  ↪ Service already exists (id=${existing.docs[0].id}). Skipping create.`)
    return existing.docs[0].id
  }

  const data: Record<string, unknown> = {
    title: 'Concrete Flatwork',
    slug: 'concrete-flatwork',
    tagline: "Driveways, sidewalks, patios, garage floors, and basement slabs — engineered for Utah's freeze-thaw climate, finished the way it should be.",
    primaryValuePillar: 'transformation',
    serviceType: 'core',
    overview: richText(
      'Concrete flatwork is the unglamorous backbone of a well-built home — the driveway you back ' +
      'out of every morning, the sidewalk that takes a Utah winter, the garage floor your tools ' +
      'roll across, the basement slab everything else is built on top of. BaseScape pours ' +
      'residential concrete for the four projects that matter most to Wasatch Front homeowners: ' +
      'driveways and exterior approaches, sidewalks and patios, basement slabs and foundation ' +
      "flatwork, and garage floors. The difference between concrete that lasts 50 years and " +
      "concrete that fails in five comes down to subgrade preparation, mix design, control " +
      "joints, and curing. We don't cut corners on any of them."
    ),
    anxietyStack: {
      structuralSafety: richText(
        "Slab thickness and reinforcement are spec'd to the load — 4 inches for sidewalks and " +
        'patios, 5–6 inches for residential driveways, 6+ inches for RV pads. Every exterior ' +
        'pour uses 4,500 PSI air-entrained concrete (5–7% entrained air) for freeze-thaw protection.'
      ),
      codeCompliance: richText(
        'Driveway approaches tied to a city street typically require a permit. BaseScape pulls ' +
        "every required permit, schedules inspections, and verifies your specific city's slope " +
        'and approach geometry requirements before forming.'
      ),
      drainageMoisture: richText(
        'Every exterior slab is poured with a minimum 1% slope away from your foundation. ' +
        'Interior basement and garage slabs are installed over a 10–15 mil vapor barrier with ' +
        'verified subgrade drainage.'
      ),
      dustDisruption: richText(
        'Saw-cutting control joints uses water-fed saws with contained work areas. Demolition ' +
        'is scheduled in a single day where possible, with debris hauled the same day. Forms ' +
        'protect lawn, landscaping, and existing hardscape.'
      ),
      costAffordability: richText(
        'Residential concrete on the Wasatch Front typically runs $8–$15 per square foot for ' +
        'standard broom finish, $12–$20 for stamped or exposed aggregate, and $5–$10 for ' +
        'interior basement slabs. A typical 2-car driveway runs $5,000–$9,000.'
      ),
      aesthetics: richText(
        'Choose from broom finish, exposed aggregate, stamped patterns (slate, flagstone, brick, ' +
        'wood plank), salt finish, or smooth troweled interior. Integral colors and acid stains ' +
        'are available. Sample boards are part of the design consultation.'
      ),
      timeline: richText(
        'Most residential concrete projects pour in a single day after 1–2 days of forming and ' +
        'prep. Walk on the slab after 24 hours, drive on it after 7 days, fully cured at 28 ' +
        'days. From signed estimate to finished walkthrough is typically 2–3 weeks.'
      ),
    },
    seo: {
      metaTitle: 'Concrete Driveways, Patios & Garage Floors | BaseScape Utah',
      metaDescription: "Residential concrete done right for Utah's freeze-thaw. Driveways, sidewalks, patios, basement slabs, and garage floors across the Wasatch Front.",
    },
    status: 'published',
  }

  if (heroImageId) data.heroImage = heroImageId

  const created = await api('POST', '/api/services', data)
  const id = created?.doc?.id ?? created?.id
  console.log(`  ✓ Created Concrete Flatwork Service id=${id}`)
  return id
}

// ---------------------------------------------------------------------------
// Step 6: Update Navigation global to include Concrete Flatwork
// ---------------------------------------------------------------------------

async function updateNavigation() {
  console.log('→ Updating Navigation global')
  const nav = await api('GET', '/api/globals/navigation')

  const concreteLink = { label: 'Concrete Flatwork', url: '/services/concrete-flatwork' }

  function insertAfterBasementRemodeling(items: any[]): { items: any[]; changed: boolean } {
    if (!Array.isArray(items)) return { items: items, changed: false }
    if (items.some((i: any) => i?.url === '/services/concrete-flatwork')) {
      return { items, changed: false }
    }
    const idx = items.findIndex((i: any) => i?.url === '/services/basement-remodeling')
    const insertIdx = idx >= 0 ? idx + 1 : items.length
    const next = [...items]
    next.splice(insertIdx, 0, concreteLink)
    return { items: next, changed: true }
  }

  const mainNav = (nav.mainNav || []).map((item: any) => {
    if (item?.label === 'Services' && Array.isArray(item.children)) {
      const { items, changed } = insertAfterBasementRemodeling(item.children)
      return changed ? { ...item, children: items } : item
    }
    return item
  })

  const footerNav = (nav.footerNav || []).map((section: any) => {
    if (section?.heading === 'Services' && Array.isArray(section.links)) {
      const { items, changed } = insertAfterBasementRemodeling(section.links)
      return changed ? { ...section, links: items } : section
    }
    return section
  })

  await api('POST', '/api/globals/navigation', { mainNav, footerNav })
  console.log('  ✓ Navigation updated')
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('Concrete Flatwork — production CMS sync')
  console.log('---')
  await login()
  await updatePaversOverview()
  await updatePaversFAQ()
  const heroImageId = await getFallbackHeroImageId()
  const newServiceId = await createConcreteFlatworkService(heroImageId)
  await updateNavigation()
  console.log('---')
  console.log('Done.')
  console.log(`Concrete Flatwork Service id: ${newServiceId}`)
  console.log('Next: in admin UI, replace the Concrete Flatwork heroImage with the proper card/hero images uploaded to Media.')
}

main().catch((err) => {
  console.error('FAILED:', err)
  process.exit(1)
})
