const PAYLOAD_URL = import.meta.env.PAYLOAD_URL || 'http://localhost:3000'
const PAYLOAD_API_KEY = import.meta.env.PAYLOAD_API_KEY || ''

interface PayloadResponse<T> {
  docs: T[]
  totalDocs: number
  limit: number
  page: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

async function fetchPayload<T>(
  endpoint: string,
  query?: string,
  auth?: boolean,
): Promise<PayloadResponse<T>> {
  const url = `${PAYLOAD_URL}/api/${endpoint}${query ? `?${query}` : ''}`
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (auth && PAYLOAD_API_KEY) {
    headers['Authorization'] = `Bearer ${PAYLOAD_API_KEY}`
  }
  const res = await fetch(url, { headers })
  if (!res.ok) {
    throw new Error(`Payload API error: ${res.status} ${res.statusText} for ${endpoint}`)
  }
  return res.json()
}

async function fetchGlobal<T>(slug: string): Promise<T> {
  const url = `${PAYLOAD_URL}/api/globals/${slug}`
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
  })
  if (!res.ok) {
    throw new Error(`Payload API error: ${res.status} for global ${slug}`)
  }
  return res.json()
}

// Collections

export async function fetchServices() {
  return fetchPayload<any>('services', 'where[status][equals]=published&limit=100&depth=2')
}

export async function fetchServiceAreas() {
  return fetchPayload<any>('service-areas', 'where[status][equals]=published&limit=100&depth=2')
}

export async function fetchProjects() {
  return fetchPayload<any>('projects', 'where[status][equals]=published&depth=2&sort=-featured,-createdAt')
}

export async function fetchFAQs() {
  return fetchPayload<any>('faqs', 'where[status][equals]=published&sort=sortOrder')
}

export async function fetchReviews() {
  return fetchPayload<any>('reviews', 'where[status][equals]=published&sort=-featured,-reviewDate')
}

export async function fetchBlogPosts() {
  return fetchPayload<any>('blog-posts', 'where[status][equals]=published&sort=-publishDate&depth=1')
}

export async function fetchLeadMagnets() {
  return fetchPayload<any>('lead-magnets', 'where[status][equals]=published&depth=1')
}

export async function fetchLeadMagnet(slug: string) {
  try {
    const result = await fetchPayload<any>(
      'lead-magnets',
      `where[slug][equals]=${encodeURIComponent(slug)}&where[status][equals]=published&depth=1&limit=1`,
    )
    return result.docs[0] || null
  } catch {
    return null
  }
}

export async function fetchOffers() {
  return fetchPayload<any>('offers', 'where[status][equals]=active')
}

export async function fetchLandingPages() {
  return fetchPayload<any>('paid-landing-pages', 'where[status][equals]=published&depth=2')
}

// Globals

export async function fetchSiteSettings() {
  return fetchGlobal<any>('site-settings')
}

export async function fetchNavigation() {
  return fetchGlobal<any>('navigation')
}

// Write operations (used by Astro Actions)

export async function createLead(data: Record<string, any>) {
  const url = `${PAYLOAD_URL}/api/leads`
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${PAYLOAD_API_KEY}`,
    },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    throw new Error(`Payload API error: ${res.status} ${res.statusText}`)
  }
  return res.json()
}

export async function updateLead(id: string, data: Record<string, any>) {
  const url = `${PAYLOAD_URL}/api/leads/${id}`
  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${PAYLOAD_API_KEY}`,
    },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    throw new Error(`Payload API error: ${res.status} ${res.statusText}`)
  }
  return res.json()
}

export async function findLeadBySessionId(sessionId: string) {
  const result = await fetchPayload<any>(
    'leads',
    `where[sessionId][equals]=${encodeURIComponent(sessionId)}&limit=1`,
    true,
  )
  return result.docs[0] || null
}

// Image resolution — prefer local images over CMS/R2 URLs for static builds

const SERVICE_ALT_TEXT: Record<string, { card: string; hero: string }> = {
  'walkout-basements': {
    card: 'Close-up of a completed walkout basement entry showing sliding glass doors, concrete landing, and stone retaining walls',
    hero: 'Completed walkout basement conversion on a typical Utah suburban home with sliding glass doors opening to a landscaped patio, green lawn, and Wasatch mountains in the distance',
  },
  'basement-remodeling': {
    card: 'Finished basement living area with exterior entry door and large egress window flooding the space with natural light',
    hero: 'Spacious transformed basement with modern finishes and natural light from egress windows',
  },
  'pavers-hardscapes': {
    card: 'Interlocking paver patio with bistro dining set extending from a Utah home, Wasatch foothills in the background',
    hero: 'Custom paver patio and walkway installation extending outdoor living space on a Utah home',
  },
  'retaining-walls': {
    card: 'Tiered stone retaining walls with landscaping creating usable flat outdoor space in a sloped Utah backyard',
    hero: 'Engineered retaining wall system managing a steep slope and creating terraced outdoor space',
  },
  'artificial-turf': {
    card: 'Vibrant green artificial turf lawn with paver borders and a dog playing in a fenced Utah backyard',
    hero: 'Low-maintenance artificial turf installation with clean paver borders in a Utah backyard',
  },
  'egress-windows': {
    card: 'Exterior view of an upgraded egress window well with stone veneer liner and river rock',
    hero: 'Code-compliant egress window installation flooding a basement with natural light',
  },
}

export function resolveServiceImage(
  slug: string,
  variant: 'card' | 'hero',
  cmsImage?: { url?: string; alt?: string } | null,
): { url: string; alt: string } {
  const localUrl = `/images/services/${variant}-${slug}.webp`
  const altMap = SERVICE_ALT_TEXT[slug]
  const defaultAlt = altMap?.[variant] || `BaseScape ${slug.replace(/-/g, ' ')} service`

  const cmsAlt = cmsImage?.alt
  const hasRealAlt = cmsAlt && cmsAlt !== 'Placeholder hero image' && cmsAlt.length > 5
  return {
    url: localUrl,
    alt: hasRealAlt ? cmsAlt : defaultAlt,
  }
}
