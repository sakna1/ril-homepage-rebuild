import { apiUrl } from './apiConfig'
import type { QuickInquiryFormFields } from '../contact/quickInquiryStorage'

/** Which form the enquiry was raised from. */
export type EnquirySource = 'contact' | 'itinerary' | 'theme'

export type EnquiryPayload = {
  form: QuickInquiryFormFields
  source: EnquirySource
  /**
   * The journey or theme being asked about. Its presence is what marks the
   * enquiry as "planned" on the server — a contact-page enquiry sends none.
   */
  topic?: string
}

/**
 * Record an enquiry against the backend.
 *
 * Deliberately never throws: the visitor has already been told their enquiry
 * was received, and a transport failure should not retract that. The caller
 * gets a boolean so it can decide whether to keep the local copy as a fallback.
 */
export async function recordEnquiry({ form, source, topic }: EnquiryPayload): Promise<boolean> {
  try {
    const response = await fetch(apiUrl('/api/enquiries'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        phone: form.phone,
        message: form.message,
        source,
        topic: topic ?? null,
        pageUrl: typeof window === 'undefined' ? '' : window.location.href,
      }),
    })
    return response.ok
  } catch {
    return false
  }
}
