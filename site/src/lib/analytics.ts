/** Read GA4 client_id from the _ga cookie (format: GA1.1.XXXXXXX.XXXXXXX) */
export function getGaClientId(): string | undefined {
  const match = document.cookie.match(/(?:^|;\s*)_ga=GA\d+\.\d+\.(.+?)(?:;|$)/)
  return match?.[1] || undefined
}

/** Read gclid from current URL search params */
export function getGclid(): string | undefined {
  return new URLSearchParams(window.location.search).get('gclid') || undefined
}
