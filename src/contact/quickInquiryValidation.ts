import type { QuickInquiryFormFields } from './quickInquiryStorage'

export type QuickInquiryFieldErrors = Partial<Record<keyof QuickInquiryFormFields, string>>

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateQuickInquiryForm(fields: QuickInquiryFormFields): QuickInquiryFieldErrors {
  const errors: QuickInquiryFieldErrors = {}
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

export function hasQuickInquiryValidationErrors(errors: QuickInquiryFieldErrors): boolean {
  return Object.keys(errors).length > 0
}
