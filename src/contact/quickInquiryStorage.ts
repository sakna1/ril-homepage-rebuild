export const QUICK_INQUIRY_DRAFT_KEY = 'royale-isles-quick-inquiry-draft-v1'
export const QUICK_INQUIRY_SUBMISSIONS_KEY = 'royale-isles-quick-inquiry-submissions-v1'

export const QUICK_INQUIRY_STORAGE_VERSION = 1 as const
export const MAX_STORED_QUICK_INQUIRIES = 10

export type QuickInquiryFormFields = {
  name: string
  email: string
  phone: string
  message: string
}

export type QuickInquiryFormDraft = QuickInquiryFormFields & {
  version: typeof QUICK_INQUIRY_STORAGE_VERSION
  updatedAt: string
}

export type QuickInquirySubmission = {
  id: string
  submittedAt: string
  /** What the enquiry is about, e.g. the Expectations theme it came from. */
  topic?: string
  form: QuickInquiryFormFields
}

export const emptyQuickInquiryFormFields = (): QuickInquiryFormFields => ({
  name: '',
  email: '',
  phone: '',
  message: '',
})

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function parseFormFields(value: unknown): QuickInquiryFormFields | undefined {
  if (!isRecord(value)) {
    return undefined
  }

  return {
    name: typeof value.name === 'string' ? value.name : '',
    email: typeof value.email === 'string' ? value.email : '',
    phone: typeof value.phone === 'string' ? value.phone : '',
    message: typeof value.message === 'string' ? value.message : '',
  }
}

export function readQuickInquiryDraft(): QuickInquiryFormFields | undefined {
  if (typeof window === 'undefined') {
    return undefined
  }

  try {
    const raw = window.localStorage.getItem(QUICK_INQUIRY_DRAFT_KEY)
    if (!raw) {
      return undefined
    }

    const parsed: unknown = JSON.parse(raw)
    if (!isRecord(parsed) || parsed.version !== QUICK_INQUIRY_STORAGE_VERSION) {
      return undefined
    }

    return parseFormFields(parsed)
  } catch {
    return undefined
  }
}

export function writeQuickInquiryDraft(fields: QuickInquiryFormFields): void {
  if (typeof window === 'undefined') {
    return
  }

  const draft: QuickInquiryFormDraft = {
    ...fields,
    version: QUICK_INQUIRY_STORAGE_VERSION,
    updatedAt: new Date().toISOString(),
  }

  window.localStorage.setItem(QUICK_INQUIRY_DRAFT_KEY, JSON.stringify(draft))
}

export function clearQuickInquiryDraft(): void {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.removeItem(QUICK_INQUIRY_DRAFT_KEY)
}

export function readQuickInquirySubmissions(): QuickInquirySubmission[] {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const raw = window.localStorage.getItem(QUICK_INQUIRY_SUBMISSIONS_KEY)
    if (!raw) {
      return []
    }

    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed.filter((entry): entry is QuickInquirySubmission => {
      if (!isRecord(entry)) {
        return false
      }

      const form = parseFormFields(entry.form)
      return typeof entry.id === 'string' && typeof entry.submittedAt === 'string' && form !== undefined
    })
  } catch {
    return []
  }
}

export function saveQuickInquirySubmission(submission: QuickInquirySubmission): void {
  if (typeof window === 'undefined') {
    return
  }

  const existing = readQuickInquirySubmissions()
  const next = [submission, ...existing].slice(0, MAX_STORED_QUICK_INQUIRIES)
  window.localStorage.setItem(QUICK_INQUIRY_SUBMISSIONS_KEY, JSON.stringify(next))
}

export function createQuickInquirySubmissionId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `quick-inquiry-${Date.now()}`
}
