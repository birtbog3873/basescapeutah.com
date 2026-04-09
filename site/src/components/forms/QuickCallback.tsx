import { useState, useEffect } from 'react'
import { actions } from 'astro:actions'
import { getGaClientId, getGclid } from '../../lib/analytics'

interface Props {
  sourcePage?: string
}

export default function QuickCallback({ sourcePage = '/' }: Props) {
  const [sessionId, setSessionId] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setSessionId(crypto.randomUUID())
  }, [])

  const handleSubmit = async () => {
    setError('')
    if (!name.trim()) return setError('Please enter your name')
    if (!phone.trim()) return setError('Please enter your phone number')

    setLoading(true)
    try {
      const params = new URLSearchParams(window.location.search)
      const { data, error: actionError } = await actions.submitQuickCallback({
        sessionId,
        name: name.trim(),
        phone: phone.trim(),
        notes: notes.trim() || undefined,
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
      })

      if (actionError) {
        setError('Something went wrong. Please try again or call us directly.')
      } else {
        setSuccess(true)
        ;(window as any).gtag?.('event', 'quick_callback_submit')
      }
    } catch {
      setError('Something went wrong. Please try again or call us directly.')
    }
    setLoading(false)
  }

  if (success) {
    return (
      <div className="callback-success">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-green500)' }}>
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
        <p className="callback-success__text">
          We'll call you back shortly!
        </p>
      </div>
    )
  }

  return (
    <div className="callback-form">
      <h3 className="callback-form__title">Request a Callback</h3>
      <p className="callback-form__desc">Leave your number and we'll call you back within the hour.</p>

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
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="callback-form__submit"
        >
          {loading ? 'Sending...' : 'Call Me Back'}
        </button>
      </div>
    </div>
  )
}
