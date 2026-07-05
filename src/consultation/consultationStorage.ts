export const CONSULTATION_DRAFT_KEY = 'royale-isles-consultation-draft-v1'
export const CONSULTATION_SUBMISSIONS_KEY = 'royale-isles-consultation-submissions-v1'

export const CONSULTATION_STORAGE_VERSION = 1 as const
export const MAX_STORED_SUBMISSIONS = 10

export type PartySize = '1' | '2' | '3-4' | '5-6' | '7+'

export type ConsultationFormFields = {
  name: string
  email: string
  phone: string
  travelTiming: string
  partySize: PartySize | ''
  note: string
}

export type ConsultationFormDraft = ConsultationFormFields & {
  version: typeof CONSULTATION_STORAGE_VERSION
  updatedAt: string
}

export type ConsultationJourneySummaryCompact = {
  directions?: string[]
  regions?: string[]
  destinations?: string[]
  experiences?: string[]
  mood?: string
  season?: string
  rhythmSequence?: string[]
}

export type ConsultationSubmission = {
  id: string
  submittedAt: string
  source?: string
  form: ConsultationFormFields
  journeySummary?: ConsultationJourneySummaryCompact
}

export const emptyConsultationFormFields = (): ConsultationFormFields => ({
  name: '',
  email: '',
  phone: '',
  travelTiming: '',
  partySize: '',
  note: '',
})

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isPartySize(value: unknown): value is PartySize {
  return value === '1' || value === '2' || value === '3-4' || value === '5-6' || value === '7+'
}

function parseFormFields(value: unknown): ConsultationFormFields | undefined {
  if (!isRecord(value)) {
    return undefined
  }

  return {
    name: typeof value.name === 'string' ? value.name : '',
    email: typeof value.email === 'string' ? value.email : '',
    phone: typeof value.phone === 'string' ? value.phone : '',
    travelTiming: typeof value.travelTiming === 'string' ? value.travelTiming : '',
    partySize: isPartySize(value.partySize) ? value.partySize : '',
    note: typeof value.note === 'string' ? value.note : '',
  }
}

export function readConsultationDraft(): ConsultationFormFields | undefined {
  if (typeof window === 'undefined') {
    return undefined
  }

  try {
    const raw = window.localStorage.getItem(CONSULTATION_DRAFT_KEY)
    if (!raw) {
      return undefined
    }

    const parsed: unknown = JSON.parse(raw)
    if (!isRecord(parsed) || parsed.version !== CONSULTATION_STORAGE_VERSION) {
      return undefined
    }

    return parseFormFields(parsed)
  } catch {
    return undefined
  }
}

export function writeConsultationDraft(fields: ConsultationFormFields): void {
  if (typeof window === 'undefined') {
    return
  }

  const draft: ConsultationFormDraft = {
    ...fields,
    version: CONSULTATION_STORAGE_VERSION,
    updatedAt: new Date().toISOString(),
  }

  window.localStorage.setItem(CONSULTATION_DRAFT_KEY, JSON.stringify(draft))
}

export function clearConsultationDraft(): void {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.removeItem(CONSULTATION_DRAFT_KEY)
}

export function readConsultationSubmissions(): ConsultationSubmission[] {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const raw = window.localStorage.getItem(CONSULTATION_SUBMISSIONS_KEY)
    if (!raw) {
      return []
    }

    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed.filter((entry): entry is ConsultationSubmission => {
      if (!isRecord(entry)) {
        return false
      }

      const form = parseFormFields(entry.form)
      return (
        typeof entry.id === 'string' &&
        typeof entry.submittedAt === 'string' &&
        form !== undefined
      )
    })
  } catch {
    return []
  }
}

export function saveConsultationSubmission(submission: ConsultationSubmission): void {
  if (typeof window === 'undefined') {
    return
  }

  const existing = readConsultationSubmissions()
  const next = [submission, ...existing].slice(0, MAX_STORED_SUBMISSIONS)
  window.localStorage.setItem(CONSULTATION_SUBMISSIONS_KEY, JSON.stringify(next))
}

export function createSubmissionId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `consultation-${Date.now()}`
}
