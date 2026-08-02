import { useId, useState, type FormEvent } from 'react'
import { groupJourneyPlaces } from '../../journey/journeyPlaceGroups'
import { useJourney } from '../../journey/useJourney'
import {
  nightsBetween,
  readStoredDates,
  readStoredSecurity,
  SECURITY_DETAIL_USD_PER_DAY,
} from '../../journey/travelPreferences'
import { getTravellerToken } from '../../traveller/travellerAuthApi'
import './CheckoutPage.css'

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

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

  const packages = items.filter((item) => item.kind === 'package')
  const perPersonTotal = packages.reduce((total, item) => total + (item.pricePerPerson ?? 0), 0)
  const { travellers, startDate, endDate } = readStoredDates()
  // The full amount for the party: per-person package total × travellers.
  const packagesAmount = perPersonTotal * Math.max(1, travellers)
  // Optional security detail is charged per day, on top of the party total.
  const wantsSecurity = readStoredSecurity()
  const securityDays = Math.max(1, nightsBetween(startDate, endDate))
  const securityCost = wantsSecurity ? securityDays * SECURITY_DETAIL_USD_PER_DAY : 0
  const fullAmount = packagesAmount + securityCost
  const hasPricing = perPersonTotal > 0 || securityCost > 0
  const alreadySignedIn = Boolean(getTravellerToken())

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
          <p className="checkout-eyebrow">Journey Requested</p>
          <h1>Thank you, {guestDetails.name.trim().split(' ')[0]}.</h1>
          <p>
            Your journey request has been received. Secure payment processing is being connected —
            our concierge team will reach out to {guestDetails.email} to confirm the details and take
            payment personally. No charge has been made.
          </p>
          <p className="checkout-profile-note">
            {alreadySignedIn
              ? 'Your journey is saved to your traveller profile — stay signed in to track it anytime.'
              : 'Save this journey to a traveller profile so you can sign back in and track it — you’ll stay logged in on this device.'}
          </p>
          <div className="checkout-success-actions">
            <a className="checkout-cta" href={alreadySignedIn ? '/traveller' : '/login/traveller'}>
              {alreadySignedIn ? 'Go To Your Profile' : 'Create Your Profile'}
            </a>
            <a className="checkout-cta checkout-cta--ghost" href="/my-journey">
              Back To My Journey
            </a>
          </div>
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
          Review your journey and confirm. Your concierge personally verifies the routing, timing, and
          final amount, then takes payment securely — nothing is charged automatically.
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

          {packages.length > 0 ? (
            <div className="checkout-packages">
              {packages.map((pkg) => (
                <div className="checkout-total" key={pkg.id}>
                  <span>{pkg.label}</span>
                  <strong>
                    {typeof pkg.pricePerPerson === 'number'
                      ? `${usd.format(pkg.pricePerPerson)} pp`
                      : 'Priced on request'}
                  </strong>
                </div>
              ))}
            </div>
          ) : null}

          {hasPricing ? (
            <>
              <div className="checkout-total checkout-total--sub">
                <span>Per person</span>
                <strong>{usd.format(perPersonTotal)}</strong>
              </div>
              <div className="checkout-total checkout-total--sub">
                <span>Travellers</span>
                <strong>× {Math.max(1, travellers)}</strong>
              </div>
              {securityCost > 0 ? (
                <div className="checkout-total checkout-total--sub">
                  <span>
                    Security detail · {securityDays} {securityDays === 1 ? 'day' : 'days'}
                  </span>
                  <strong>{usd.format(securityCost)}</strong>
                </div>
              ) : null}
              <div className="checkout-total checkout-total--grand">
                <span>Total Due</span>
                <strong>{usd.format(fullAmount)}</strong>
              </div>
              <p className="checkout-summary-note">
                This is the full journey amount for your party. Payment processing is being
                connected — your concierge confirms and takes payment personally; nothing is charged
                automatically.
              </p>
            </>
          ) : (
            <>
              <div className="checkout-total checkout-total--grand">
                <span>Total Due</span>
                <strong>Confirmed by concierge</strong>
              </div>
              <p className="checkout-summary-note">
                Your journey is custom-built, so the final amount is confirmed personally by your
                concierge before any charge is made.
              </p>
            </>
          )}
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
            {hasPricing ? `Confirm Journey · ${usd.format(fullAmount)}` : 'Confirm Journey'}
          </button>
        </form>
      </div>
    </main>
  )
}
