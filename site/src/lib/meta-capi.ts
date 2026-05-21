/**
 * Meta Conversions API helper — posts Lead events to graph.facebook.com so
 * Meta receives a server-side mirror of the browser Pixel event. Browser and
 * server events deduplicate when they share the same event_name + event_id,
 * which the React form generates as a UUID and passes both to the dataLayer
 * (consumed by GTM's Pixel tag as eventID) and to the Astro Action.
 *
 * Hashing follows Meta's spec: SHA-256 of lowercased trimmed values, phone
 * normalized to E.164. IP, UA, fbp, fbc are passed unhashed.
 *
 * Designed to be called from inside ctx.waitUntil() in an Astro Action —
 * never throws (logs via console.error), no-ops when env vars are missing so
 * preview deploys without secrets configured don't break.
 *
 * Plan: docs/meta-ads/conversions-api-implementation-plan.md
 */

const GRAPH_API_VERSION = 'v19.0'

interface FireMetaCAPIParams {
  eventName: 'Lead'
  eventId: string
  eventSourceUrl: string
  userData: {
    email?: string
    phone?: string
    firstName?: string
    lastName?: string
    city?: string
    state?: string
    zip?: string
    fbp?: string
    fbc?: string
    clientIp?: string
    clientUserAgent?: string
  }
  customData?: {
    value?: number
    currency?: string
    contentName?: string
    contentCategory?: string
  }
}

export async function fireMetaCAPI(params: FireMetaCAPIParams): Promise<void> {
  const pixelId = import.meta.env.META_PIXEL_ID
  const accessToken = import.meta.env.META_CAPI_ACCESS_TOKEN
  if (!pixelId || !accessToken) {
    // Preview deploys without secrets — silent no-op so they don't break.
    return
  }

  const testEventCode = import.meta.env.META_TEST_EVENT_CODE

  try {
    const userData = await buildUserData(params.userData)
    const customData = buildCustomData(params.customData)

    const body: Record<string, unknown> = {
      data: [
        {
          event_name: params.eventName,
          event_time: Math.floor(Date.now() / 1000),
          event_id: params.eventId,
          event_source_url: params.eventSourceUrl,
          action_source: 'website',
          user_data: userData,
          ...(customData ? { custom_data: customData } : {}),
        },
      ],
    }
    if (testEventCode) {
      body.test_event_code = testEventCode
    }

    const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${pixelId}/events?access_token=${encodeURIComponent(accessToken)}`
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const errBody = await res.text().catch(() => '')
      console.error(
        '[META-CAPI] HTTP error',
        res.status,
        'event_id=',
        params.eventId,
        'body=',
        errBody.slice(0, 500),
      )
      return
    }
    console.log('[META-CAPI] Lead event sent, event_id=', params.eventId)
  } catch (err: any) {
    console.error('[META-CAPI] Failed:', err?.message || err)
  }
}

async function buildUserData(u: FireMetaCAPIParams['userData']): Promise<Record<string, unknown>> {
  const out: Record<string, unknown> = {}

  if (u.email) out.em = await sha256(normalizeEmail(u.email))
  if (u.phone) out.ph = await sha256(normalizePhone(u.phone))
  if (u.firstName) out.fn = await sha256(normalizeName(u.firstName))
  if (u.lastName) out.ln = await sha256(normalizeName(u.lastName))
  if (u.city) out.ct = await sha256(normalizeCityState(u.city))
  if (u.state) out.st = await sha256(normalizeCityState(u.state))
  if (u.zip) out.zp = await sha256(normalizeZip(u.zip))

  if (u.clientIp) out.client_ip_address = u.clientIp
  if (u.clientUserAgent) out.client_user_agent = u.clientUserAgent
  if (u.fbp) out.fbp = u.fbp
  if (u.fbc) out.fbc = u.fbc

  return out
}

function buildCustomData(c?: FireMetaCAPIParams['customData']): Record<string, unknown> | undefined {
  if (!c) return undefined
  const out: Record<string, unknown> = {}
  if (typeof c.value === 'number') out.value = c.value
  if (c.currency) out.currency = c.currency
  if (c.contentName) out.content_name = c.contentName
  if (c.contentCategory) out.content_category = c.contentCategory
  return Object.keys(out).length > 0 ? out : undefined
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

function normalizePhone(phone: string): string {
  // Strip everything except digits. Assume US (+1) if 10 digits; if 11 digits
  // starting with 1, treat as already including the country code. Meta's spec
  // is E.164 *digits only* for the hash input (no '+').
  const digits = phone.replace(/\D/g, '')
  if (digits.length === 10) return `1${digits}`
  if (digits.length === 11 && digits.startsWith('1')) return digits
  return digits
}

function normalizeName(name: string): string {
  return name.trim().toLowerCase()
}

function normalizeCityState(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, '')
}

function normalizeZip(zip: string): string {
  // US zip: keep only the 5-digit base (strip ZIP+4 if present).
  const digits = zip.replace(/\D/g, '')
  return digits.slice(0, 5)
}

async function sha256(input: string): Promise<string> {
  const data = new TextEncoder().encode(input)
  const buf = await crypto.subtle.digest('SHA-256', data)
  const bytes = new Uint8Array(buf)
  let hex = ''
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, '0')
  }
  return hex
}
