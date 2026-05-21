/** Read GA4 client_id from the _ga cookie (format: GA1.1.XXXXXXX.XXXXXXX) */
export function getGaClientId(): string | undefined {
  const match = document.cookie.match(/(?:^|;\s*)_ga=GA\d+\.\d+\.(.+?)(?:;|$)/)
  return match?.[1] || undefined
}

/** Read gclid from current URL search params */
export function getGclid(): string | undefined {
  return new URLSearchParams(window.location.search).get('gclid') || undefined
}

/** Read fbclid from current URL search params (Meta click identifier on ad clicks) */
export function getFbclid(): string | undefined {
  return new URLSearchParams(window.location.search).get('fbclid') || undefined
}

/** Read Meta's _fbp browser-pixel cookie (format: fb.1.<ts>.<random>) */
export function getFbpCookie(): string | undefined {
  const match = document.cookie.match(/(?:^|;\s*)_fbp=([^;]+)/)
  return match?.[1] || undefined
}

/**
 * Read Meta's _fbc click-identifier cookie. If the cookie isn't set yet but
 * the URL has an `fbclid` query param (an in-flight ad click), synthesize the
 * cookie format Meta expects: `fb.1.<event-time-ms>.<fbclid>`. The Pixel
 * itself writes this cookie shortly after the click, so we only need this
 * fallback for the first pageview after an ad click.
 */
export function getFbcCookie(): string | undefined {
  const match = document.cookie.match(/(?:^|;\s*)_fbc=([^;]+)/)
  if (match?.[1]) return match[1]
  const fbclid = getFbclid()
  if (!fbclid) return undefined
  return `fb.1.${Date.now()}.${fbclid}`
}
