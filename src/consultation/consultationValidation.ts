import type { ConsultationFormFields } from './consultationStorage'

export type ConsultationFieldErrors = Partial<Record<keyof ConsultationFormFields, string>>

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateConsultationForm(fields: ConsultationFormFields): ConsultationFieldErrors {
  const errors: ConsultationFieldErrors = {}
  const name = fields.name.trim()
  const email = fields.email.trim()

  if (!name) {
    errors.name = 'Please enter your name.'
  } else if (name.length < 2) {
    errors.name = 'Please enter your full name.'
  }

  if (!email) {
    errors.email = 'Please enter your email address.'
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = 'Please enter a valid email address.'
  }

  return errors
}

export function hasValidationErrors(errors: ConsultationFieldErrors): boolean {
  return Object.keys(errors).length > 0
}
