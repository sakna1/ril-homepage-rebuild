import { useEffect, useId, useState, type FormEvent } from 'react'
// Shares the Expectations enquiry styling so both modals read as one thing.
import '../ExperiencesPage/ThemeInquiryForm.css'
import {
  createQuickInquirySubmissionId,
  emptyQuickInquiryFormFields,
  saveQuickInquirySubmission,
  type QuickInquiryFormFields,
} from '../../contact/quickInquiryStorage'
import {
  hasQuickInquiryValidationErrors,
  validateQuickInquiryForm,
  type QuickInquiryFieldErrors,
} from '../../contact/quickInquiryValidation'

type JourneyInquiryFormProps = {
  /** The journey being asked about, e.g. "Discovery". */
  journey: string
  /** Shown under the heading, e.g. "9 Nights · 10 Days". */
  detail?: string
  onClose: () => void
}

/**
 * The enquiry raised from a journey page. It carries the journey with it, so
 * the destination team can see what was being read when the question came in.
 */
export function JourneyInquiryForm({ journey, detail, onClose }: JourneyInquiryFormProps) {
  const formId = useId()
  const [fields, setFields] = useState<QuickInquiryFormFields>(emptyQuickInquiryFormFields)
  const [errors, setErrors] = useState<QuickInquiryFieldErrors>({})
  const [touched, setTouched] = useState<Partial<Record<keyof QuickInquiryFormFields, boolean>>>({})
  const [submitted, setSubmitted] = useState(false)

  // Escape closes, and the page behind must not scroll while this is open.
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKey)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKey)
    }
  }, [onClose])

  function updateField<K extends keyof QuickInquiryFormFields>(
    key: K,
    value: QuickInquiryFormFields[K],
  ) {
    setFields((current) => ({ ...current, [key]: value }))
    setTouched((current) => ({ ...current, [key]: true }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validateQuickInquiryForm(fields)
    setErrors(nextErrors)
    setTouched({ name: true, email: true, phone: true, message: true })

    if (hasQuickInquiryValidationErrors(nextErrors)) return

    saveQuickInquirySubmission({
      id: createQuickInquirySubmissionId(),
      submittedAt: new Date().toISOString(),
      topic: detail ? `${journey} — ${detail}` : journey,
      form: {
        name: fields.name.trim(),
        email: fields.email.trim(),
        phone: fields.phone.trim(),
        message: fields.message.trim(),
      },
    })

    setSubmitted(true)
  }

  return (
    <div
      className="theme-inquiry"
      role="dialog"
      aria-modal="true"
      aria-label={`Enquire about ${journey}`}
      onClick={onClose}
    >
      <div className="theme-inquiry__panel" onClick={(event) => event.stopPropagation()}>
        <button type="button" className="theme-inquiry__close" onClick={onClose} aria-label="Close">
          ×
        </button>

        {submitted ? (
          <div className="theme-inquiry__success" aria-live="polite">
            <span className="theme-inquiry__mark" aria-hidden="true">
              ✦
            </span>
            <h3>Thank you. Your enquiry has been noted.</h3>
            <p>
              The destination team will read your interest in <strong>{journey}</strong> and reply
              personally. Nothing is booked and nothing is charged.
            </p>
            <button type="button" className="theme-inquiry__submit" onClick={onClose}>
              Close
            </button>
          </div>
        ) : (
          <>
            <header className="theme-inquiry__head">
              <p className="theme-inquiry__eyebrow">Enquire About This Journey</p>
              <h3>{journey}</h3>
              <p className="theme-inquiry__lede">
                {detail ? `${detail}. ` : ''}Tell us your dates and who is travelling, and we will
                shape these days around you. There is no booking and no payment here.
              </p>
            </header>

            <form className="theme-inquiry__form" onSubmit={handleSubmit} noValidate>
              <div className="theme-inquiry__row">
                <div className="theme-inquiry__field">
                  <label htmlFor={`${formId}-name`}>
                    Name <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id={`${formId}-name`}
                    type="text"
                    value={fields.name}
                    autoComplete="name"
                    onChange={(event) => updateField('name', event.target.value)}
                    onBlur={() => setErrors(validateQuickInquiryForm(fields))}
                    aria-invalid={Boolean(touched.name && errors.name)}
                    aria-describedby={touched.name && errors.name ? `${formId}-name-error` : undefined}
                  />
                  {touched.name && errors.name ? (
                    <p className="theme-inquiry__error" id={`${formId}-name-error`} role="alert">
                      {errors.name}
                    </p>
                  ) : null}
                </div>

                <div className="theme-inquiry__field">
                  <label htmlFor={`${formId}-email`}>
                    Email <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id={`${formId}-email`}
                    type="email"
                    value={fields.email}
                    autoComplete="email"
                    onChange={(event) => updateField('email', event.target.value)}
                    onBlur={() => setErrors(validateQuickInquiryForm(fields))}
                    aria-invalid={Boolean(touched.email && errors.email)}
                    aria-describedby={
                      touched.email && errors.email ? `${formId}-email-error` : undefined
                    }
                  />
                  {touched.email && errors.email ? (
                    <p className="theme-inquiry__error" id={`${formId}-email-error`} role="alert">
                      {errors.email}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="theme-inquiry__field">
                <label htmlFor={`${formId}-phone`}>Phone or WhatsApp</label>
                <input
                  id={`${formId}-phone`}
                  type="tel"
                  value={fields.phone}
                  autoComplete="tel"
                  onChange={(event) => updateField('phone', event.target.value)}
                />
              </div>

              <div className="theme-inquiry__field">
                <label htmlFor={`${formId}-message`}>When are you thinking of travelling?</label>
                <textarea
                  id={`${formId}-message`}
                  rows={4}
                  value={fields.message}
                  placeholder="Rough dates, how many of you, anything you would like changed."
                  onChange={(event) => updateField('message', event.target.value)}
                />
              </div>

              <button type="submit" className="theme-inquiry__submit">
                Send Enquiry
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
