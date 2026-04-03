import { useState, useEffect, useRef, useCallback } from 'react'
import { actions } from 'astro:actions'
import './form-styles.css'

const SERVICE_OPTIONS = [
  { value: 'walkout-basement', label: 'Walkout Basement' },
  { value: 'retaining-walls', label: 'Retaining Walls' },
  { value: 'basement-remodeling', label: 'Basement Remodeling' },
  { value: 'pavers-hardscapes', label: 'Pavers & Hardscapes' },
  { value: 'artificial-turf', label: 'Artificial Turf' },
  { value: 'egress-windows', label: 'Egress Windows' },
]

const TIME_OPTIONS = [
  { value: 'morning', label: 'Morning' },
  { value: 'afternoon', label: 'Afternoon' },
  { value: 'evening', label: 'Evening' },
]

const STEP_LABELS = ['Services', 'Date & Time', 'Contact']

interface Props {
  sourcePage?: string
  phone?: string
  preselectedService?: string
}

export default function MultiStepForm({ sourcePage = '/', phone = '(888) 414-0007', preselectedService }: Props) {
  const [step, setStep] = useState(1)
  const [sessionId, setSessionId] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [serviceType, setServiceType] = useState(preselectedService || '')
  const [zipCode, setZipCode] = useState(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search).get('zip') || ''
    }
    return ''
  })
  const [preferredDate, setPreferredDate] = useState('')
  const [dateSelected, setDateSelected] = useState(false)
  const [timePreference, setTimePreference] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [emailField, setEmailField] = useState('')
  const [phoneField, setPhoneField] = useState('')
  const [address, setAddress] = useState('')
  const [comments, setComments] = useState('')
  const [smsConsent, setSmsConsent] = useState(false)
  const [honeypot, setHoneypot] = useState('')

  const addressInputRef = useRef<HTMLInputElement>(null)
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)
  const placesLoadedRef = useRef(false)
  const calendarScrollRef = useRef<HTMLDivElement>(null)
  const todayCellRef = useRef<HTMLButtonElement>(null)

  const phoneClean = phone.replace(/[^\d+]/g, '')

  useEffect(() => {
    setSessionId(crypto.randomUUID())
  }, [])

  useEffect(() => {
    if (step === 2 && !dateSelected && calendarScrollRef.current && todayCellRef.current) {
      const container = calendarScrollRef.current
      const cell = todayCellRef.current
      const cellTop = cell.offsetTop - container.offsetTop
      const cellHeight = cell.offsetHeight
      const containerHeight = container.clientHeight
      container.scrollTop = cellTop - containerHeight / 2 + cellHeight / 2
    }
  }, [step, dateSelected])

  const initPlacesAutocomplete = useCallback(() => {
    if (placesLoadedRef.current || !addressInputRef.current) return
    if (typeof google === 'undefined' || !google.maps?.places) return

    placesLoadedRef.current = true
    autocompleteRef.current = new google.maps.places.Autocomplete(addressInputRef.current, {
      componentRestrictions: { country: 'us' },
      types: ['address'],
    })
    autocompleteRef.current.addListener('place_changed', () => {
      const place = autocompleteRef.current?.getPlace()
      if (place?.formatted_address) {
        setAddress(place.formatted_address)
      }
    })
  }, [])

  useEffect(() => {
    if (step !== 3) return
    const apiKey = (window as any).__GOOGLE_PLACES_API_KEY
    if (!apiKey) return

    if (typeof google !== 'undefined' && google.maps?.places) {
      initPlacesAutocomplete()
      return
    }

    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]')
    if (existingScript) return

    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
    script.async = true
    script.onload = () => initPlacesAutocomplete()
    document.head.appendChild(script)
  }, [step, initPlacesAutocomplete])

  const getSource = () => {
    const params = new URLSearchParams(window.location.search)
    return {
      page: sourcePage || window.location.pathname,
      utmSource: params.get('utm_source') || undefined,
      utmMedium: params.get('utm_medium') || undefined,
      utmCampaign: params.get('utm_campaign') || undefined,
      utmContent: params.get('utm_content') || undefined,
      utmTerm: params.get('utm_term') || undefined,
      referrer: document.referrer || undefined,
    }
  }

  const handleStep1 = async () => {
    setErrors({})
    const newErrors: Record<string, string> = {}
    if (!serviceType) newErrors.serviceType = 'Please select a service'
    if (!/^\d{5}$/.test(zipCode)) newErrors.zipCode = 'Enter a valid 5-digit zip code'
    if (Object.keys(newErrors).length) return setErrors(newErrors)

    setLoading(true)
    try {
      await actions.saveFormStep({
        step: 1 as const,
        sessionId,
        serviceType: serviceType as any,
        zipCode,
        honeypot,
        source: getSource(),
      })
    } catch {
      // CMS save failed — continue anyway, final submit will capture all data
    }
    setStep(2)
    ;(window as any).dataLayer?.push({ event: 'form_step_1', service: serviceType })
    setLoading(false)
  }

  const handleStep2 = async () => {
    setErrors({})
    if (!timePreference) return setErrors({ timePreference: 'Please select a time preference' })

    setLoading(true)
    try {
      await actions.saveFormStep({
        step: 2 as const,
        sessionId,
        preferredDate,
        timePreference: timePreference as any,
        honeypot,
      })
    } catch {
      // CMS save failed — continue anyway
    }
    setStep(3)
    ;(window as any).dataLayer?.push({ event: 'form_step_2', service: serviceType })
    setLoading(false)
  }

  const handleStep3 = async () => {
    setErrors({})
    const newErrors: Record<string, string> = {}
    if (!firstName.trim()) newErrors.firstName = 'First name is required'
    if (!lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!emailField.trim()) newErrors.email = 'Email is required'
    if (!phoneField.trim()) newErrors.phone = 'Phone number is required'
    if (!smsConsent) newErrors.smsConsent = 'Sorry, due to federal TCPA compliance, you must agree to receive communications for us to contact you. 😊'
    if (Object.keys(newErrors).length) return setErrors(newErrors)

    setLoading(true)
    try {
      const result = await actions.saveFormStep({
        step: 3 as const,
        sessionId,
        serviceType: serviceType as any,
        zipCode,
        preferredDate: preferredDate || undefined,
        timePreference: (timePreference as any) || undefined,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: emailField.trim(),
        phone: phoneField.trim(),
        address: address.trim() || undefined,
        comments: comments.trim() || undefined,
        smsConsent,
        honeypot,
        source: getSource(),
      })

      if (result.error) {
        console.error('[Form Step 3] Action error:', JSON.stringify(result.error, null, 2))
        setErrors({ form: 'Something went wrong. Please try again.' })
      } else if (result.data && !result.data.success) {
        console.error('[Form Step 3] CMS error:', (result.data as any).debugError)
        setErrors({ form: 'Something went wrong. Please try again.' })
      } else {
        setSuccess(true)
        // Hide the hero and scroll to top for clean thank-you view
        const hero = document.querySelector('.contact-hero') as HTMLElement
        if (hero) hero.style.display = 'none'
        const scrollArea = document.querySelector('.page-scroll') as HTMLElement
        if (scrollArea) scrollArea.scrollTop = 0
        else window.scrollTo({ top: 0 })
        ;(window as any).dataLayer?.push({ event: 'form_complete', service: serviceType })
      }
    } catch (err: any) {
      console.error('[Form Step 3] Catch error:', err)
      setErrors({ form: `Error: ${err?.message || 'Network error'}` })
    }
    setLoading(false)
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayIso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  const formatDateLabel = (iso: string) => {
    const d = new Date(iso + 'T00:00:00')
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
  }

  const calendarMonths = (() => {
    const now = new Date()
    const months: Date[] = []
    // Current month + next month
    for (let offset = 0; offset <= 1; offset++) {
      months.push(new Date(now.getFullYear(), now.getMonth() + offset, 1))
    }
    return months
  })()

  const renderMonthGrid = (monthDate: Date) => {
    const year = monthDate.getFullYear()
    const month = monthDate.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const monthLabel = monthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

    const days: (number | null)[] = Array(firstDay).fill(null)
    for (let d = 1; d <= daysInMonth; d++) days.push(d)

    return (
      <div key={monthLabel} className="calendar__month-section">
        <h4 className="calendar__month-label">{monthLabel}</h4>
        <div className="calendar__grid">
          {days.map((day, i) => {
            if (day === null) return <span key={`empty-${i}`} className="calendar__cell calendar__cell--empty" />
            const cellDate = new Date(year, month, day)
            const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            const isPast = cellDate < today
            const isToday = iso === todayIso
            const isSelected = preferredDate === iso
            return (
              <button
                key={iso}
                type="button"
                ref={isToday ? todayCellRef : undefined}
                disabled={isPast}
                className={`calendar__cell${isSelected ? ' calendar__cell--selected' : ''}${isToday && !isSelected ? ' calendar__cell--today' : ''}${isPast ? ' calendar__cell--disabled' : ''}`}
                onClick={() => {
                  setPreferredDate(iso)
                  setDateSelected(true)
                }}
                aria-label={`${cellDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}${isToday ? ' (today)' : ''}`}
                aria-pressed={isSelected}
              >
                {day}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  const renderCalendar = () => (
    <div className="calendar">
      <div className="calendar__weekdays">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
          <span key={d} className="calendar__weekday">{d}</span>
        ))}
      </div>
      <div className="calendar__scroll" ref={calendarScrollRef}>
        {calendarMonths.map(renderMonthGrid)}
      </div>
    </div>
  )

  const renderFooter = () => (
    <div className="multi-form__footer">
      <a href={`tel:${phoneClean}`} className="multi-form__footer-call" onClick={() => (window as any).dataLayer?.push({ event: 'phone_click', location: 'form_footer_rush' })}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
        </svg>
        In a rush? Call us.
      </a>
      <div className="multi-form__footer-alt">
        <p className="multi-form__footer-alt-text">
          Not ready to schedule an appointment yet, but have questions or need assistance?
        </p>
        <a href={`tel:${phoneClean}`} className="multi-form__footer-alt-btn" onClick={() => (window as any).dataLayer?.push({ event: 'phone_click', location: 'form_footer_contact' })}>
          Contact Our Team
        </a>
      </div>
    </div>
  )

  if (success) {
    return (
      <div className="multi-form">
        <div className="form-success">
          <div className="form-success__icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h3 className="form-success__title">Thank You for Scheduling an Appointment!</h3>
          <p className="form-success__text">
            A BaseScape specialist will be in touch shortly to confirm your appointment details.
          </p>

          <div className="form-success__guide">
            <h4 className="form-success__guide-title">Pre-Appointment Guide</h4>
            <p className="form-success__guide-intro">Here's what to expect and how to prepare:</p>
            <ol className="form-success__guide-list">
              <li className="form-success__guide-item">
                <strong>Confirmation Call</strong>
                <span>We'll reach out within 24 hours to confirm your preferred date and time.</span>
              </li>
              <li className="form-success__guide-item">
                <strong>On-Site Design Visit</strong>
                <span>A BaseScape design specialist will visit your property to assess the space, take measurements, and discuss your vision.</span>
              </li>
              <li className="form-success__guide-item">
                <strong>Custom Design & Estimate</strong>
                <span>You'll receive a detailed design plan and transparent estimate — completely free, no obligation.</span>
              </li>
            </ol>

            <div className="form-success__prepare">
              <h4 className="form-success__guide-title">How to Prepare</h4>
              <ul className="form-success__prepare-list">
                <li>Have a general idea of the area you'd like to transform</li>
                <li>Note any HOA requirements or property boundaries</li>
                <li>Gather any inspiration photos or ideas you've collected</li>
                <li>Think about your budget range — this helps us design to your needs</li>
              </ul>
            </div>
          </div>

          <p className="form-success__phone">
            Questions before your appointment? Call{' '}
            <a href={`tel:${phoneClean}`}>{phone}</a>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="multi-form">
      <h2 className="multi-form__title">Schedule your Free Design</h2>

      {/* Progress indicator */}
      <div className="multi-form__progress" aria-label={`Step ${step} of 3`}>
        {STEP_LABELS.map((label, i) => (
          <div key={label} className={`multi-form__step ${i + 1 < step ? 'completed' : ''} ${i + 1 === step ? 'active' : ''}`}>
            <div className="multi-form__step-circle">
              {i + 1 < step ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                i + 1
              )}
            </div>
            <span className="multi-form__step-label">{label}</span>
          </div>
        ))}
      </div>

      {/* Honeypot */}
      <div style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          type="text"
          id="website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      {errors.form && <p className="multi-form__error">{errors.form}</p>}

      {/* Step 1: Services */}
      {step === 1 && (
        <div className="multi-form__fields">
          <p className="multi-form__subtitle">What do you need help with?</p>
          <label className="multi-form__label">I am looking for...</label>
          <div className="multi-form__card-grid">
            {SERVICE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`multi-form__card ${serviceType === opt.value ? 'multi-form__card--selected' : ''}`}
                onClick={() => setServiceType(opt.value)}
                aria-pressed={serviceType === opt.value}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {errors.serviceType && <p className="multi-form__field-error">{errors.serviceType}</p>}

          <div className="multi-form__field">
            <label htmlFor="zipCode" className="multi-form__label">Postal Code</label>
            <input
              id="zipCode"
              type="text"
              inputMode="numeric"
              pattern="\d{5}"
              maxLength={5}
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value.replace(/\D/g, ''))}
              className={`multi-form__input multi-form__input--zip ${errors.zipCode ? 'multi-form__input--error' : ''}`}
              autoComplete="postal-code"
              placeholder="84101"
            />
            {errors.zipCode && <p className="multi-form__field-error">{errors.zipCode}</p>}
          </div>

          <button
            type="button"
            onClick={handleStep1}
            disabled={loading}
            className="multi-form__submit"
          >
            {loading ? 'Saving...' : 'Next'}
          </button>
          {renderFooter()}
        </div>
      )}

      {/* Step 2: Date & Time */}
      {step === 2 && !dateSelected && (
        <div className="multi-form__fields">
          <p className="multi-form__subtitle">Select your preferred date</p>
          {renderCalendar()}
          {renderFooter()}
        </div>
      )}

      {step === 2 && dateSelected && (
        <div className="multi-form__fields">
          <p className="multi-form__subtitle">Select your preferred time</p>
          <p className="multi-form__date-badge">
            {formatDateLabel(preferredDate)}
            <button
              type="button"
              className="multi-form__date-change"
              onClick={() => setDateSelected(false)}
            >
              Change
            </button>
          </p>
          <div className="multi-form__card-grid multi-form__card-grid--stacked">
            {TIME_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`multi-form__card ${timePreference === opt.value ? 'multi-form__card--selected' : ''}`}
                onClick={() => setTimePreference(opt.value)}
                aria-pressed={timePreference === opt.value}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <a
            href={`tel:${phoneClean}`}
            className="multi-form__not-sure-link"
            onClick={() => {
              setTimePreference('not-sure')
              ;(window as any).dataLayer?.push({ event: 'phone_click', location: 'form_not_sure' })
            }}
          >
            Not sure yet?
          </a>
          {errors.timePreference && <p className="multi-form__field-error">{errors.timePreference}</p>}
          <button type="button" onClick={handleStep2} disabled={loading} className="multi-form__submit">
            {loading ? 'Saving...' : 'Next'}
          </button>
          {renderFooter()}
        </div>
      )}

      {/* Step 3: Contact Info */}
      {step === 3 && (
        <div className="multi-form__fields">
          <p className="multi-form__subtitle">How should we contact you?</p>

          <div className="multi-form__name-row">
            <div className="multi-form__field">
              <label htmlFor="firstName" className="multi-form__label">First Name</label>
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={`multi-form__input ${errors.firstName ? 'multi-form__input--error' : ''}`}
                autoComplete="given-name"
              />
              {errors.firstName && <p className="multi-form__field-error">{errors.firstName}</p>}
            </div>
            <div className="multi-form__field">
              <label htmlFor="lastName" className="multi-form__label">Last Name</label>
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className={`multi-form__input ${errors.lastName ? 'multi-form__input--error' : ''}`}
                autoComplete="family-name"
              />
              {errors.lastName && <p className="multi-form__field-error">{errors.lastName}</p>}
            </div>
          </div>

          <div className="multi-form__field">
            <label htmlFor="email" className="multi-form__label">Email</label>
            <input
              id="email"
              type="email"
              value={emailField}
              onChange={(e) => setEmailField(e.target.value)}
              className={`multi-form__input ${errors.email ? 'multi-form__input--error' : ''}`}
              autoComplete="email"
            />
            {errors.email && <p className="multi-form__field-error">{errors.email}</p>}
          </div>

          <div className="multi-form__field">
            <label htmlFor="phone" className="multi-form__label">Phone</label>
            <input
              id="phone"
              type="tel"
              value={phoneField}
              onChange={(e) => setPhoneField(e.target.value)}
              className={`multi-form__input ${errors.phone ? 'multi-form__input--error' : ''}`}
              autoComplete="tel"
            />
            {errors.phone && <p className="multi-form__field-error">{errors.phone}</p>}
          </div>

          <div className="multi-form__field">
            <label htmlFor="address" className="multi-form__label">
              Address <span className="multi-form__optional">(optional)</span>
            </label>
            <input
              id="address"
              ref={addressInputRef}
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="multi-form__input"
              autoComplete="street-address"
            />
          </div>

          <div className="multi-form__field">
            <label htmlFor="comments" className="multi-form__label">
              Comments <span className="multi-form__optional">(optional)</span>
            </label>
            <textarea
              id="comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="multi-form__textarea"
              rows={3}
            />
          </div>

          <div className={`multi-form__consent${errors.smsConsent ? ' multi-form__consent--error' : ''}`}>
            <label className="multi-form__checkbox">
              <input
                type="checkbox"
                checked={smsConsent}
                onChange={(e) => { setSmsConsent(e.target.checked); if (e.target.checked) setErrors((prev) => { const { smsConsent: _, ...rest } = prev; return rest }) }}
                className="multi-form__checkbox-input"
              />
              <span className="multi-form__checkbox-text">
                By clicking this box, I agree to receive marketing, customer care, and account
                notification messages via text, including autodialed texts, to the telephone
                numbers that you provide from BaseScape. Consent is not a condition of purchase.
                Message and frequency vary. Message and data rates may apply.
                <br />
                Text HELP for help and STOP to unsubscribe. For more information, visit{' '}
                <a href="/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a> and{' '}
                <a href="/terms" target="_blank" rel="noopener noreferrer">Terms and Conditions</a>.
              </span>
            </label>
            {errors.smsConsent && <p className="multi-form__consent-error">{errors.smsConsent}</p>}

            <p className="multi-form__legal">
              By clicking submit, I agree to receive marketing, customer care, and account
              notification messages via autodialed, artificial, and prerecorded calls at the
              number(s) you provide and email. Consent is not a condition of purchase.
              <br />
              For more information, visit{' '}
              <a href="/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a> and{' '}
              <a href="/terms" target="_blank" rel="noopener noreferrer">Terms and Conditions</a>.
            </p>
          </div>

          <button type="button" onClick={handleStep3} disabled={loading} className="multi-form__submit multi-form__submit--final">
            {loading ? 'Submitting...' : 'Submit'}
          </button>

          <div className="multi-form__footer">
            <a href={`tel:${phoneClean}`} className="multi-form__footer-call" onClick={() => (window as any).dataLayer?.push({ event: 'phone_click', location: 'form_step3_rush' })}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              In a rush? Call us.
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
