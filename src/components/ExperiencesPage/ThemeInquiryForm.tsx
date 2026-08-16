import { useEffect, useId, useState, type FormEvent } from 'react'
import './ThemeInquiryForm.css'
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

type ThemeInquiryFormProps = {
  /** Worlds already marked on the page; editable here too. */
  chosenThemes: readonly string[]
  themes: readonly string[]
  onToggleTheme: (title: string) => void
  /** Fired once the enquiry is stored, so the page can clear the selection. */
  onSubmitted: () => void
  onClose: () => void
}

/** Reads as prose in the heading and the confirmation: "A, B and C". */
function formatThemes(list: readonly string[]): string {
  if (list.length === 0) return 'Sri Lanka'
  if (list.length === 1) return list[0]
  return `${list.slice(0, -1).join(', ')} and ${list[list.length - 1]}`
}

/**
 * A theme on Expectations is an interest, not a booking. This takes that
 * interest and hands it to the destination team as an enquiry — stored with the
 * contact form's submissions so both arrive in one place.
 */
export function ThemeInquiryForm({
  chosenThemes,
  themes,
  onToggleTheme,
  onSubmitted,
  onClose,
}: ThemeInquiryFormProps) {
  const formId = useId()
  const [fields, setFields] = useState<QuickInquiryFormFields>(emptyQuickInquiryFormFields)
  const [errors, setErrors] = useState<QuickInquiryFieldErrors>({})
  const [touched, setTouched] = useState<Partial<Record<keyof QuickInquiryFormFields, boolean>>>({})
  const [submitted, setSubmitted] = useState(false)
  // Held separately: the page clears its selection on send, but the thank-you
  // still needs to name the worlds that went with the enquiry.
  const [sentThemes, setSentThemes] = useState<readonly string[]>([])

  const chosenLabel = formatThemes(chosenThemes)
  // The confirmation names what was sent, not what is currently selected — the
  // page clears its selection the moment the enquiry goes through.
  const sentLabel = formatThemes(sentThemes)

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
      topic: chosenThemes.length > 0 ? chosenThemes.join(', ') : 'General enquiry',
      form: {
        name: fields.name.trim(),
        email: fields.email.trim(),
        phone: fields.phone.trim(),
        message: fields.message.trim(),
      },
    })

    setSentThemes(chosenThemes)
    setSubmitted(true)
    onSubmitted()
  }

  return (
    <div
      className="theme-inquiry"
      role="dialog"
      aria-modal="true"
      aria-label="Send an enquiry"
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
              The destination team will read your interest in <strong>{sentLabel}</strong> and
              reply personally. Nothing is booked and nothing is charged.
            </p>
            <button type="button" className="theme-inquiry__submit" onClick={onClose}>
              Close
            </button>
          </div>
        ) : (
          <>
            <header className="theme-inquiry__head">
              <p className="theme-inquiry__eyebrow">Send an Enquiry</p>
              <h3>{chosenLabel}</h3>
              <p className="theme-inquiry__lede">
                Tell us what draws you to this. The destination team replies personally — there is
                no booking and no payment on this site.
              </p>
            </header>

            <form className="theme-inquiry__form" onSubmit={handleSubmit} noValidate>
              {/* The worlds chosen on the page arrive preselected, and can still
                  be added to or removed from here. */}
              <fieldset className="theme-inquiry__worlds">
                <legend>Interested in</legend>
                <div className="theme-inquiry__world-list">
                  {themes.map((option) => {
                    const isChosen = chosenThemes.includes(option)
                    return (
                      <button
                        type="button"
                        key={option}
                        className={`theme-inquiry__world${isChosen ? ' is-chosen' : ''}`}
                        aria-pressed={isChosen}
                        onClick={() => onToggleTheme(option)}
                      >
                        {option}
                        {isChosen ? <span aria-hidden="true">✓</span> : null}
                      </button>
                    )
                  })}
                </div>
              </fieldset>

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
                <label htmlFor={`${formId}-message`}>What are you hoping for?</label>
                <textarea
                  id={`${formId}-message`}
                  rows={4}
                  value={fields.message}
                  placeholder="Rough dates, how many of you, anything that matters."
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
