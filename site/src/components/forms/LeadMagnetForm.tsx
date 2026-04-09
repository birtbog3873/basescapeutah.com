import { useState } from 'react'
import { actions } from 'astro:actions'
import { getGaClientId, getGclid } from '../../lib/analytics'
import './form-styles.css'

interface Props {
  leadMagnetId: string
  requiredFields?: string[]
  ctaText?: string
}

export default function LeadMagnetForm({
  leadMagnetId,
  requiredFields = ['email'],
  ctaText = 'Download Free Guide',
}: Props) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [downloadUrl, setDownloadUrl] = useState('')
  const [honeypot, setHoneypot] = useState('')

  const requiresName = requiredFields.includes('name')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrors({})
    setStatus('submitting')

    try {
      const result = await actions.submitLeadMagnet({
        sessionId: crypto.randomUUID(),
        name: name || undefined,
        email,
        leadMagnetId,
        honeypot,
        source: {
          page: window.location.pathname,
          utmSource: new URLSearchParams(window.location.search).get('utm_source') || undefined,
          utmMedium: new URLSearchParams(window.location.search).get('utm_medium') || undefined,
          utmCampaign: new URLSearchParams(window.location.search).get('utm_campaign') || undefined,
          referrer: document.referrer || undefined,
          gaClientId: getGaClientId(),
          gclid: getGclid(),
        },
      })

      if (result.error) {
        setStatus('error')
        if (result.error.code === 'INPUT_VALIDATION_ERROR' && result.error.fields) {
          const fieldErrors: Record<string, string> = {}
          for (const [field, messages] of Object.entries(result.error.fields)) {
            fieldErrors[field] = (messages as string[]).join(', ')
          }
          setErrors(fieldErrors)
        }
        return
      }

      setStatus('success')
      setDownloadUrl(result.data?.downloadUrl || '#')
      ;(window as any).gtag?.('event', 'lead_magnet_submit')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="form-success">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="form-success__icon">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
        <h3 className="form-success__title">Your guide is ready!</h3>
        {downloadUrl && downloadUrl !== '#' && (
          <a href={downloadUrl} className="form-success__download" target="_blank" rel="noopener noreferrer">
            Download Now
          </a>
        )}
        <p className="form-success__note">
          We've also sent a copy to your email for easy access later.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="lead-magnet-form">
      {/* Honeypot */}
      <div style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true">
        <input
          type="text"
          name="company_website"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      {(requiresName || true) && (
        <div className="form-field">
          <label htmlFor="lm-name" className="form-label">
            Name {!requiresName && <span className="form-optional">(optional)</span>}
          </label>
          <input
            id="lm-name"
            type="text"
            className={`form-input ${errors.name ? 'form-input--error' : ''}`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required={requiresName}
            maxLength={100}
            placeholder="Your name"
          />
          {errors.name && <p className="form-error">{errors.name}</p>}
        </div>
      )}

      <div className="form-field">
        <label htmlFor="lm-email" className="form-label">Email</label>
        <input
          id="lm-email"
          type="email"
          className={`form-input ${errors.email ? 'form-input--error' : ''}`}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="your@email.com"
        />
        {errors.email && <p className="form-error">{errors.email}</p>}
      </div>

      <button
        type="submit"
        className="form-submit"
        disabled={status === 'submitting'}
      >
        {status === 'submitting' ? 'Sending...' : ctaText}
      </button>

      {status === 'error' && !Object.keys(errors).length && (
        <p className="form-error" style={{ textAlign: 'center', marginTop: '8px' }}>
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  )
}
