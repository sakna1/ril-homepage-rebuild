import { useEffect, useId, useState, type FormEvent } from 'react'
import {
  buildConsultationJourneySummary,
  getPlacesForWhatsApp,
} from '../../consultation/buildConsultationSummary'
import {
  clearConsultationDraft,
  createSubmissionId,
  emptyConsultationFormFields,
  readConsultationDraft,
  saveConsultationSubmission,
  writeConsultationDraft,
  type ConsultationFormFields,
  type ConsultationJourneySummaryCompact,
  type PartySize,
} from '../../consultation/consultationStorage'
import {
  hasValidationErrors,
  validateConsultationForm,
  type ConsultationFieldErrors,
} from '../../consultation/consultationValidation'
import {
  buildConsultationWhatsAppMessage,
  buildWhatsAppHref,
  isWhatsAppConfigured,
} from '../../consultation/whatsApp'
import type { JourneyItem } from '../../journey/JourneyContext'
import './ConsultationForm.css'

type ConsultationFormProps = {
  source?: string
  journeyItems: JourneyItem[]
  journeySummary: ReturnType<typeof buildConsultationJourneySummary>
  seasonPrefill?: string
}

const partySizeOptions: { value: PartySize; label: string }[] = [
  { value: '1', label: '1 traveller' },
  { value: '2', label: '2 travellers' },
  { value: '3-4', label: '3–4 travellers' },
  { value: '5-6', label: '5–6 travellers' },
  { value: '7+', label: '7 or more' },
]

function mergeInitialFields(seasonPrefill?: string): ConsultationFormFields {
  const draft = readConsultationDraft()
  const base = draft ?? emptyConsultationFormFields()

  if (!base.travelTiming.trim() && seasonPrefill?.trim()) {
    return { ...base, travelTiming: seasonPrefill.trim() }
  }

  return base
}

export function ConsultationForm({
  source,
  journeyItems,
  journeySummary,
  seasonPrefill,
}: ConsultationFormProps) {
  const formId = useId()
  const [fields, setFields] = useState<ConsultationFormFields>(() => mergeInitialFields(seasonPrefill))
  const [errors, setErrors] = useState<ConsultationFieldErrors>({})
  const [submitted, setSubmitted] = useState(false)
  const [touched, setTouched] = useState<Partial<Record<keyof ConsultationFormFields, boolean>>>({})

  useEffect(() => {
    writeConsultationDraft(fields)
  }, [fields])

  function updateField<K extends keyof ConsultationFormFields>(key: K, value: ConsultationFormFields[K]) {
    setFields((current) => ({ ...current, [key]: value }))
    setTouched((current) => ({ ...current, [key]: true }))
  }

  function handleBlur(key: keyof ConsultationFormFields) {
    setTouched((current) => ({ ...current, [key]: true }))
    setErrors(validateConsultationForm(fields))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validateConsultationForm(fields)
    setErrors(nextErrors)
    setTouched({
      name: true,
      email: true,
      phone: true,
      travelTiming: true,
      partySize: true,
      note: true,
    })

    if (hasValidationErrors(nextErrors)) {
      return
    }

    const compactSummary: ConsultationJourneySummaryCompact = {
      ...journeySummary.compact,
    }

    saveConsultationSubmission({
      id: createSubmissionId(),
      submittedAt: new Date().toISOString(),
      source,
      form: {
        name: fields.name.trim(),
        email: fields.email.trim(),
        phone: fields.phone.trim(),
        travelTiming: fields.travelTiming.trim(),
        partySize: fields.partySize,
        note: fields.note.trim(),
      },
      journeySummary: compactSummary.directions?.length || compactSummary.regions?.length ? compactSummary : undefined,
    })

    clearConsultationDraft()
    setSubmitted(true)
  }

  if (submitted) {
    const whatsAppEnabled = isWhatsAppConfigured()
    const whatsAppHref = whatsAppEnabled
      ? buildWhatsAppHref(
          buildConsultationWhatsAppMessage({
            name: fields.name.trim(),
            directions: journeySummary.compact.directions ?? [],
            places: getPlacesForWhatsApp(journeySummary),
            travelTiming: fields.travelTiming.trim() || undefined,
          }),
        )
      : ''

    return (
      <section className="consultation-success" aria-live="polite">
        <div className="consultation-success__mark" aria-hidden="true">
          ✦
        </div>
        <h2>Thank you. Your journey has been noted.</h2>
        <p>
          Your ideas are now gathered in one place. When the consultation desk is connected, this
          will become the beginning of a more personal conversation.
        </p>
        <div className="consultation-success__actions">
          {journeyItems.length > 0 ? (
            <a className="consultation-success__action consultation-success__action--primary" href="/my-journey">
              Return to My Journey
            </a>
          ) : null}
          <a className="consultation-success__action" href="/discover-sri-lanka">
            Continue exploring the island
          </a>
          {whatsAppEnabled && whatsAppHref ? (
            <a
              className="consultation-success__action consultation-success__action--whatsapp"
              href={whatsAppHref}
              target="_blank"
              rel="noreferrer"
            >
              Continue on WhatsApp
            </a>
          ) : null}
        </div>
      </section>
    )
  }

  const nameErrorId = `${formId}-name-error`
  const emailErrorId = `${formId}-email-error`

  return (
    <section className="consultation-form-section" aria-labelledby="consultation-form-heading">
      <div className="consultation-form-section__intro">
        <h2 id="consultation-form-heading">A few details to begin</h2>
        <p>
          Share what feels useful now. Nothing here is binding — it simply helps shape the
          conversation ahead.
        </p>
      </div>

      <form className="consultation-form" noValidate onSubmit={handleSubmit}>
        <div className="consultation-form__field">
          <label htmlFor={`${formId}-name`}>Name</label>
          <input
            id={`${formId}-name`}
            name="name"
            type="text"
            autoComplete="name"
            required
            value={fields.name}
            aria-invalid={Boolean(touched.name && errors.name)}
            aria-describedby={touched.name && errors.name ? nameErrorId : undefined}
            onChange={(event) => updateField('name', event.target.value)}
            onBlur={() => handleBlur('name')}
          />
          {touched.name && errors.name ? (
            <p className="consultation-form__error" id={nameErrorId} role="alert">
              {errors.name}
            </p>
          ) : null}
        </div>

        <div className="consultation-form__field">
          <label htmlFor={`${formId}-email`}>Email</label>
          <input
            id={`${formId}-email`}
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            value={fields.email}
            aria-invalid={Boolean(touched.email && errors.email)}
            aria-describedby={touched.email && errors.email ? emailErrorId : undefined}
            onChange={(event) => updateField('email', event.target.value)}
            onBlur={() => handleBlur('email')}
          />
          {touched.email && errors.email ? (
            <p className="consultation-form__error" id={emailErrorId} role="alert">
              {errors.email}
            </p>
          ) : null}
        </div>

        <div className="consultation-form__field">
          <label htmlFor={`${formId}-phone`}>
            Phone / WhatsApp <span className="consultation-form__optional">(recommended)</span>
          </label>
          <input
            id={`${formId}-phone`}
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            value={fields.phone}
            onChange={(event) => updateField('phone', event.target.value)}
            onBlur={() => handleBlur('phone')}
          />
        </div>

        <div className="consultation-form__field">
          <label htmlFor={`${formId}-travel-timing`}>
            Approximate travel month or dates{' '}
            <span className="consultation-form__optional">(recommended)</span>
          </label>
          <input
            id={`${formId}-travel-timing`}
            name="travelTiming"
            type="text"
            autoComplete="off"
            placeholder="e.g. November 2026"
            value={fields.travelTiming}
            onChange={(event) => updateField('travelTiming', event.target.value)}
            onBlur={() => handleBlur('travelTiming')}
          />
        </div>

        <div className="consultation-form__field">
          <label htmlFor={`${formId}-party-size`}>
            Party size <span className="consultation-form__optional">(recommended)</span>
          </label>
          <select
            id={`${formId}-party-size`}
            name="partySize"
            value={fields.partySize}
            onChange={(event) => updateField('partySize', event.target.value as PartySize | '')}
            onBlur={() => handleBlur('partySize')}
          >
            <option value="">Select party size</option>
            {partySizeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="consultation-form__field">
          <label htmlFor={`${formId}-note`}>
            What would make this journey feel meaningful to you?{' '}
            <span className="consultation-form__optional">(recommended)</span>
          </label>
          <textarea
            id={`${formId}-note`}
            name="note"
            rows={4}
            value={fields.note}
            onChange={(event) => updateField('note', event.target.value)}
            onBlur={() => handleBlur('note')}
          />
        </div>

        <div className="consultation-form__actions">
          <button className="consultation-form__submit" type="submit">
            Share your details
          </button>
        </div>

        <p className="consultation-form__note">
          Your details remain in this browser until a consultation desk is connected. A privacy
          policy will be published before live enquiry collection begins.
        </p>
      </form>
    </section>
  )
}
