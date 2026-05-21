import { useState, useEffect, type FormEvent } from 'react'
import { actions } from 'astro:actions'
import { getGaClientId, getGclid, getFbpCookie, getFbcCookie } from '../../lib/analytics'

type ServiceType =
  | 'walkout-basement'
  | 'basement-remodeling'
  | 'concrete'
  | 'concrete-flatwork'
  | 'concrete-driveways'
  | 'concrete-stamped'
  | 'concrete-patios'
  | 'concrete-garage-rv-pads'
  | 'concrete-sidewalks'
  | 'concrete-pool-decks'
  | 'concrete-footings'
  | 'pavers-hardscapes'
  | 'retaining-walls'
  | 'artificial-turf'
  | 'egress-windows'

interface Props {
  sourcePage?: string
  serviceType?: ServiceType
  submitLabel?: string
  variant?: 'card' | 'inline'
  title?: string
  description?: string
}

export default function QuickCallback({
  sourcePage = '/',
  serviceType,
  submitLabel = 'Call Me Back',
  variant = 'card',
  title = 'Request a Callback',
  description = "Leave your number and we'll call you back within the hour.",
}: Props) {
  const [sessionId, setSessionId] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setSessionId(crypto.randomUUID())
  }, [])

  const handleSubmit = async (e?: FormEvent) => {
    if (e) e.preventDefault()
    setError('')
    if (!name.trim()) return setError('Please enter your name')
    if (!phone.trim()) return setError('Please enter your phone number')

    setLoading(true)
    // Meta CAPI dedup pairing — see MultiStepForm.handleStep3 for rationale.
    const eventId = crypto.randomUUID()
    const fbp = getFbpCookie()
    const fbc = getFbcCookie()
    try {
      const params = new URLSearchParams(window.location.search)
      const { data, error: actionError } = await actions.submitQuickCallback({
        sessionId,
        name: name.trim(),
        phone: phone.trim(),
        notes: notes.trim() || undefined,
        serviceType,
        honeypot,
        source: {
          page: sourcePage || window.location.pathname,
          utmSource: params.get('utm_source') || undefined,
          utmMedium: params.get('utm_medium') || undefined,
          utmCampaign: params.get('utm_campaign') || undefined,
          referrer: document.referrer || undefined,
          gaClientId: getGaClientId(),
          gclid: getGclid(),
        },
        eventId,
        fbp,
        fbc,
      })

      if (actionError) {
        setError('Something went wrong. Please try again or call us directly.')
      } else {
        const w = window as any
        w.dataLayer = w.dataLayer || []
        const eventId = crypto.randomUUID()
        let navigated = false
        const navigate = () => {
          if (navigated) return
          navigated = true
          window.location.href = '/thank-you/callback'
        }
        w.dataLayer.push({
          event: 'lead_submit',
          event_id: eventId,
          form_id: 'quick_callback',
          service: serviceType,
          source_page: sourcePage,
          variant,
          eventCallback: navigate,
          eventTimeout: 2000,
        })
        setTimeout(navigate, 2500)
        return
      }
    } catch {
      setError('Something went wrong. Please try again or call us directly.')
    }
    setLoading(false)
  }

  return (
    <form
      className={`callback-form callback-form--${variant}`}
      onSubmit={handleSubmit}
      noValidate
    >
      <h3 className="callback-form__title">{title}</h3>
      <p className="callback-form__desc">{description}</p>

      {/* Honeypot */}
      <div style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true">
        <input
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      {error && <p className="callback-form__error">{error}</p>}

      <div className="callback-form__fields">
        <input
          type="text"
          placeholder="Your name"
          aria-label="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="callback-form__input"
          autoComplete="name"
        />
        <input
          type="tel"
          placeholder="Phone number"
          aria-label="Phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="callback-form__input"
          autoComplete="tel"
        />
        <textarea
          placeholder="Brief note (optional)"
          aria-label="Brief note"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="callback-form__textarea"
          rows={2}
        />
        <button
          type="submit"
          disabled={loading}
          className={`callback-form__submit ${variant === 'inline' ? 'callback-form__submit--primary' : ''}`}
        >
          {loading ? 'Sending...' : submitLabel}
        </button>
      </div>
    </form>
  )
}
