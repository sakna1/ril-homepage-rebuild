import { useId, useState, type FormEvent } from 'react'
import { groupJourneyPlaces } from '../../journey/journeyPlaceGroups'
import { useJourney } from '../../journey/useJourney'
import './CheckoutPage.css'

const RESERVATION_FEE = {
  amount: 500,
  currency: 'USD',
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type GuestDetails = {
  name: string
  email: string
  phone: string
}

export function CheckoutPage() {
  const { items } = useJourney()
  const formId = useId()

  const [guestDetails, setGuestDetails] = useState<GuestDetails>({ name: '', email: '', phone: '' })
  const [errors, setErrors] = useState<Partial<Record<keyof GuestDetails, string>>>({})
  const [status, setStatus] = useState<'idle' | 'submitted'>('idle')

  const themes = items.filter((item) => item.kind === 'theme' || item.kind === 'discovery-world')
  const placeGroups = groupJourneyPlaces(items)
  const primaryTheme = themes[0]

  function updateField<K extends keyof GuestDetails>(key: K, value: GuestDetails[K]) {
    setGuestDetails((current) => ({ ...current, [key]: value }))
  }

  function validate(): Partial<Record<keyof GuestDetails, string>> {
    const nextErrors: Partial<Record<keyof GuestDetails, string>> = {}
    if (!guestDetails.name.trim()) {
      nextErrors.name = 'Please enter your name.'
    }
    if (!EMAIL_PATTERN.test(guestDetails.email.trim())) {
      nextErrors.email = 'Please enter a valid email address.'
    }
    return nextErrors
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    setStatus('submitted')
  }

  if (items.length === 0) {
    return (
      <main className="checkout-page">
        <div className="checkout-empty">
          <p className="checkout-eyebrow">Reserve Your Journey</p>
          <h1>Your journey is still empty.</h1>
          <p>Explore the island and add a theme, places, or things to do before reserving.</p>
          <a className="checkout-cta" href="/expectations">
            Explore The Island
          </a>
        </div>
      </main>
    )
  }

  if (status === 'submitted') {
    return (
      <main className="checkout-page">
        <div className="checkout-empty">
          <span className="checkout-success-mark" aria-hidden="true">
            ✦
          </span>
          <p className="checkout-eyebrow">Reservation Requested</p>
          <h1>Thank you, {guestDetails.name.trim().split(' ')[0]}.</h1>
          <p>
            Your reservation request has been received. Secure payment processing is being connected —
            our concierge team will reach out to {guestDetails.email} to confirm the details and complete
            payment personally. No charge has been made.
          </p>
          <a className="checkout-cta" href="/my-journey">
            Back To My Journey
          </a>
        </div>
      </main>
    )
  }

  return (
    <main className="checkout-page">
      <header className="checkout-hero">
        <p className="checkout-eyebrow">Reserve Your Journey</p>
        <h1>
          Begin <em>{primaryTheme ? primaryTheme.label : 'your private journey'}</em>.
        </h1>
        <p className="checkout-hero-lede">
          A reservation fee secures your concierge&apos;s time to begin planning. Final routing, timing,
          and the full package cost are confirmed personally before anything further is arranged.
        </p>
      </header>

      <div className="checkout-layout">
        <div className="checkout-summary">
          <h2>Your Journey</h2>

          {primaryTheme ? (
            <div className="checkout-summary-theme">
              <p className="checkout-summary-label">Theme</p>
              <p className="checkout-summary-theme-name">{primaryTheme.label}</p>
            </div>
          ) : null}

          {placeGroups.length > 0 ? (
            <div className="checkout-summary-places">
              {placeGroups.map((group) => (
                <div className="checkout-summary-place" key={group.placeName}>
                  <h3>{group.placeName}</h3>
                  {group.accommodations.length > 0 ? (
                    <ul className="checkout-summary-list">
                      {group.accommodations.map((item) => (
                        <li key={item.id}>
                          <span>Stay</span>
                          {item.label}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  {group.activities.length > 0 ? (
                    <ul className="checkout-summary-list">
                      {group.activities.map((item) => (
                        <li key={item.id}>
                          <span>Do</span>
                          {item.label}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}

          <div className="checkout-total">
            <span>Reservation Fee</span>
            <strong>
              {RESERVATION_FEE.currency} ${RESERVATION_FEE.amount}
            </strong>
          </div>
          <p className="checkout-summary-note">
            A provisional fee, confirmed with you before any charge is made.
          </p>
        </div>

        <form className="checkout-form" onSubmit={handleSubmit} noValidate>
          <h2>Guest Details</h2>

          <div className="checkout-field">
            <label htmlFor={`${formId}-name`}>
              Full Name <span aria-hidden="true">*</span>
            </label>
            <input
              id={`${formId}-name`}
              type="text"
              value={guestDetails.name}
              onChange={(event) => updateField('name', event.target.value)}
              placeholder="Your full name"
              autoComplete="name"
              aria-invalid={Boolean(errors.name)}
            />
            {errors.name ? (
              <p className="checkout-field-error" role="alert">
                {errors.name}
              </p>
            ) : null}
          </div>

          <div className="checkout-field">
            <label htmlFor={`${formId}-email`}>
              Email <span aria-hidden="true">*</span>
            </label>
            <input
              id={`${formId}-email`}
              type="email"
              value={guestDetails.email}
              onChange={(event) => updateField('email', event.target.value)}
              placeholder="your@email.com"
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
            />
            {errors.email ? (
              <p className="checkout-field-error" role="alert">
                {errors.email}
              </p>
            ) : null}
          </div>

          <div className="checkout-field">
            <label htmlFor={`${formId}-phone`}>
              Phone / WhatsApp <span className="checkout-field-optional">optional</span>
            </label>
            <input
              id={`${formId}-phone`}
              type="tel"
              value={guestDetails.phone}
              onChange={(event) => updateField('phone', event.target.value)}
              placeholder="+44 0000 000000"
              autoComplete="tel"
            />
          </div>

          <h2 className="checkout-payment-heading">Payment</h2>
          <p className="checkout-payment-note">
            Secure payment processing is being connected. Submitting this form sends your reservation
            request to our concierge team — no card will be charged yet.
          </p>

          <div className="checkout-card-fields" aria-disabled="true">
            <div className="checkout-field">
              <label htmlFor={`${formId}-card`}>Card Number</label>
              <input id={`${formId}-card`} type="text" placeholder="Available once payment is connected" disabled />
            </div>
            <div className="checkout-card-fields-row">
              <div className="checkout-field">
                <label htmlFor={`${formId}-expiry`}>Expiry</label>
                <input id={`${formId}-expiry`} type="text" placeholder="MM / YY" disabled />
              </div>
              <div className="checkout-field">
                <label htmlFor={`${formId}-cvv`}>CVV</label>
                <input id={`${formId}-cvv`} type="text" placeholder="•••" disabled />
              </div>
            </div>
          </div>

          <button type="submit" className="checkout-submit">
            Confirm Reservation · {RESERVATION_FEE.currency} ${RESERVATION_FEE.amount}
          </button>
        </form>
      </div>
    </main>
  )
}
