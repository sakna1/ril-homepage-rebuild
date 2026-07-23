import { useEffect, useId, useState, type FormEvent } from 'react'
import { ArrowIcon } from '../ArrowIcon'
import {
  clearQuickInquiryDraft,
  createQuickInquirySubmissionId,
  emptyQuickInquiryFormFields,
  readQuickInquiryDraft,
  saveQuickInquirySubmission,
  writeQuickInquiryDraft,
  type QuickInquiryFormFields,
} from '../../contact/quickInquiryStorage'
import {
  hasQuickInquiryValidationErrors,
  validateQuickInquiryForm,
  type QuickInquiryFieldErrors,
} from '../../contact/quickInquiryValidation'

type QuickInquiryFormProps = {
  onFieldsChange?: (fields: QuickInquiryFormFields) => void
}

function mergeInitialFields(): QuickInquiryFormFields {
  return readQuickInquiryDraft() ?? emptyQuickInquiryFormFields()
}

export function QuickInquiryForm({ onFieldsChange }: QuickInquiryFormProps) {
  const formId = useId()
  const [fields, setFields] = useState<QuickInquiryFormFields>(() => mergeInitialFields())
  const [errors, setErrors] = useState<QuickInquiryFieldErrors>({})
  const [submitted, setSubmitted] = useState(false)
  const [touched, setTouched] = useState<Partial<Record<keyof QuickInquiryFormFields, boolean>>>({})

  useEffect(() => {
    writeQuickInquiryDraft(fields)
    onFieldsChange?.(fields)
  }, [fields, onFieldsChange])

  function updateField<K extends keyof QuickInquiryFormFields>(key: K, value: QuickInquiryFormFields[K]) {
    setFields((current) => ({ ...current, [key]: value }))
    setTouched((current) => ({ ...current, [key]: true }))
  }

  function handleBlur(key: keyof QuickInquiryFormFields) {
    setTouched((current) => ({ ...current, [key]: true }))
    setErrors(validateQuickInquiryForm(fields))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validateQuickInquiryForm(fields)
    setErrors(nextErrors)
    setTouched({
      name: true,
      email: true,
      phone: true,
      message: true,
    })

    if (hasQuickInquiryValidationErrors(nextErrors)) {
      return
    }

    saveQuickInquirySubmission({
      id: createQuickInquirySubmissionId(),
      submittedAt: new Date().toISOString(),
      form: {
        name: fields.name.trim(),
        email: fields.email.trim(),
        phone: fields.phone.trim(),
        message: fields.message.trim(),
      },
    })

    clearQuickInquiryDraft()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <section className="contact-inquiry-success" aria-live="polite">
        <div className="contact-inquiry-success__mark" aria-hidden="true">
          ✦
        </div>
        <h3>Thank you. Your inquiry has been noted.</h3>
        <p>
          Your message is saved in this browser only. When the enquiry desk is connected, this will become the
          beginning of a more personal conversation.
        </p>
        <a className="contact-text-link" href="/expectations">
          Continue exploring the island
          <ArrowIcon />
        </a>
      </section>
    )
  }

  const nameErrorId = `${formId}-name-error`
  const emailErrorId = `${formId}-email-error`

  return (
    <form className="contact-form contact-form--quick" onSubmit={handleSubmit} noValidate>
      <div className="contact-form-row">
        <div className="contact-field">
          <label className="contact-field-label" htmlFor={`${formId}-name`}>
            Name <span className="contact-field-required" aria-hidden="true">*</span>
          </label>
          <input
            id={`${formId}-name`}
            type="text"
            name="name"
            value={fields.name}
            onChange={(event) => updateField('name', event.target.value)}
            onBlur={() => handleBlur('name')}
            placeholder="Your name"
            autoComplete="name"
            required
            aria-invalid={Boolean(touched.name && errors.name)}
            aria-describedby={touched.name && errors.name ? nameErrorId : undefined}
          />
          {touched.name && errors.name ? (
            <p className="contact-field-error" id={nameErrorId} role="alert">
              {errors.name}
            </p>
          ) : null}
        </div>
        <div className="contact-field">
          <label className="contact-field-label" htmlFor={`${formId}-email`}>
            Email <span className="contact-field-required" aria-hidden="true">*</span>
          </label>
          <input
            id={`${formId}-email`}
            type="email"
            name="email"
            value={fields.email}
            onChange={(event) => updateField('email', event.target.value)}
            onBlur={() => handleBlur('email')}
            placeholder="your@email.com"
            autoComplete="email"
            required
            aria-invalid={Boolean(touched.email && errors.email)}
            aria-describedby={touched.email && errors.email ? emailErrorId : undefined}
          />
          {touched.email && errors.email ? (
            <p className="contact-field-error" id={emailErrorId} role="alert">
              {errors.email}
            </p>
          ) : null}
        </div>
      </div>

      <div className="contact-field contact-field--full">
        <label className="contact-field-label" htmlFor={`${formId}-phone`}>
          Phone / WhatsApp <span className="contact-field-optional">optional</span>
        </label>
        <input
          id={`${formId}-phone`}
          type="tel"
          name="phone"
          value={fields.phone}
          onChange={(event) => updateField('phone', event.target.value)}
          onBlur={() => handleBlur('phone')}
          placeholder="+44 0000 000000"
          autoComplete="tel"
        />
      </div>

      <div className="contact-field contact-field--full">
        <label className="contact-field-label" htmlFor={`${formId}-message`}>
          Message
        </label>
        <textarea
          id={`${formId}-message`}
          name="message"
          value={fields.message}
          onChange={(event) => updateField('message', event.target.value)}
          onBlur={() => handleBlur('message')}
          placeholder="A brief note is enough to begin…"
          rows={4}
        />
      </div>

      <div className="contact-form-actions">
        <button type="submit" className="contact-button contact-button--solid contact-button--wide">
          Send an Inquiry
          <ArrowIcon />
        </button>
        <p className="contact-form-note">
          Saved locally in this browser until an enquiry desk is connected. Nothing is emailed from this prototype.
        </p>
      </div>
    </form>
  )
}
