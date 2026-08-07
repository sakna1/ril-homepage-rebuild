import type { TravelIconId } from '../pages/MyJourneyPage/TravelIcon'

export type CompanionId =
  | 'solo'
  | 'couple'
  | 'family'
  | 'friends'
  | 'honeymoon'
  | 'corporate'
  | 'photography'
  | 'luxury-escape'

export type CompanionOption = {
  id: CompanionId
  label: string
  icon: TravelIconId
}

export const companionOptions: CompanionOption[] = [
  { id: 'solo', label: 'Solo Traveller', icon: 'solo' },
  { id: 'couple', label: 'Couple', icon: 'couple' },
  { id: 'family', label: 'Family', icon: 'family' },
  { id: 'friends', label: 'Friends', icon: 'friends' },
  { id: 'honeymoon', label: 'Honeymoon', icon: 'honeymoon' },
  { id: 'corporate', label: 'Corporate Group', icon: 'corporate' },
  { id: 'photography', label: 'Photography Tour', icon: 'camera' },
  { id: 'luxury-escape', label: 'Luxury Escape', icon: 'crown' },
]

export type TransportId = 'private-car' | 'luxury-van' | 'chauffeur' | 'helicopter'

export type TransportOption = {
  id: TransportId
  label: string
  icon: TravelIconId
  capacity: string
  luggage: string
  comfort: string
  recommendedFor: string
  /**
   * USD per person added to the journey. The first option is the standard
   * vehicle included in every package, so it carries no supplement.
   */
  priceAdd: number
}

/**
 * Listed standard-first. The Private Luxury Car is included in every package;
 * anything above it is an upgrade and carries a supplement per person.
 */
export const transportOptions: TransportOption[] = [
  {
    id: 'private-car',
    label: 'Private Luxury Car',
    icon: 'sedan',
    capacity: '1 – 3 guests',
    luggage: '2 – 3 bags',
    comfort: 'Premium',
    recommendedFor: 'Couples and solo travellers',
    priceAdd: 0,
  },
  {
    id: 'luxury-van',
    label: 'Luxury Van',
    icon: 'van',
    capacity: 'Up to 6 guests',
    luggage: '6 – 8 bags',
    comfort: 'Spacious',
    recommendedFor: 'Families and small groups',
    priceAdd: 420,
  },
  {
    id: 'chauffeur',
    label: 'Chauffeur Driven Vehicle',
    icon: 'driver',
    capacity: '1 – 4 guests',
    luggage: '3 – 4 bags',
    comfort: 'Personal',
    recommendedFor: 'Guests who want a dedicated private driver throughout',
    priceAdd: 680,
  },
  {
    id: 'helicopter',
    label: 'Heli Transfers',
    icon: 'helicopter',
    capacity: '1 – 5 guests',
    luggage: '2 – 3 bags',
    comfort: 'Exceptional',
    recommendedFor: 'Guests crossing the island quickly, with scenic private transfers',
    priceAdd: 2400,
  },
]

/** The supplement for a chosen vehicle; zero when none is chosen. */
export function transportPriceAdd(transportId: TransportId | null): number {
  if (!transportId) return 0
  return transportOptions.find((option) => option.id === transportId)?.priceAdd ?? 0
}

const COMPANION_STORAGE_KEY = 'royale-isles-travel-companion'
const TRANSPORT_STORAGE_KEY = 'royale-isles-transport-preference'
const DATES_STORAGE_KEY = 'royale-isles-travel-dates'

export type TravelDates = {
  /** Preferred start date, ISO 'YYYY-MM-DD', or '' if unset. */
  startDate: string
  /** Preferred end date, ISO 'YYYY-MM-DD', or '' if unset. */
  endDate: string
  /** Number of travellers (>= 1). */
  travellers: number
}

const DEFAULT_TRAVEL_DATES: TravelDates = { startDate: '', endDate: '', travellers: 2 }

export function readStoredDates(): TravelDates {
  if (typeof window === 'undefined') return { ...DEFAULT_TRAVEL_DATES }
  try {
    const raw = window.localStorage.getItem(DATES_STORAGE_KEY)
    if (!raw) return { ...DEFAULT_TRAVEL_DATES }
    const parsed = JSON.parse(raw) as Partial<TravelDates>
    return {
      startDate: typeof parsed.startDate === 'string' ? parsed.startDate : '',
      endDate: typeof parsed.endDate === 'string' ? parsed.endDate : '',
      travellers:
        typeof parsed.travellers === 'number' && parsed.travellers >= 1
          ? Math.floor(parsed.travellers)
          : DEFAULT_TRAVEL_DATES.travellers,
    }
  } catch {
    return { ...DEFAULT_TRAVEL_DATES }
  }
}

/**
 * Optional close-protection detail, charged in addition to the journey.
 * Indicative placeholder pricing, in line with the rest of the site.
 */
export const SECURITY_DETAIL_USD_PER_DAY = 180

const SECURITY_STORAGE_KEY = 'royale-isles-security-detail'

export function readStoredSecurity(): boolean {
  if (typeof window === 'undefined') return false
  return window.localStorage.getItem(SECURITY_STORAGE_KEY) === 'true'
}

export function writeStoredSecurity(enabled: boolean) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(SECURITY_STORAGE_KEY, enabled ? 'true' : 'false')
}

/** Nights between the two dates; 0 when either is unset or the range is invalid. */
export function nightsBetween(startDate: string, endDate: string): number {
  if (!startDate || !endDate) return 0
  const start = Date.parse(startDate)
  const end = Date.parse(endDate)
  if (Number.isNaN(start) || Number.isNaN(end) || end <= start) return 0
  return Math.round((end - start) / 86_400_000)
}

export function writeStoredDates(dates: TravelDates) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(DATES_STORAGE_KEY, JSON.stringify(dates))
}

export function readStoredCompanion(): CompanionId | null {
  if (typeof window === 'undefined') return null
  const stored = window.localStorage.getItem(COMPANION_STORAGE_KEY)
  return companionOptions.some((option) => option.id === stored) ? (stored as CompanionId) : null
}

export function writeStoredCompanion(companionId: CompanionId | null) {
  if (typeof window === 'undefined') return
  if (companionId) {
    window.localStorage.setItem(COMPANION_STORAGE_KEY, companionId)
  } else {
    window.localStorage.removeItem(COMPANION_STORAGE_KEY)
  }
}

export function readStoredTransport(): TransportId | null {
  if (typeof window === 'undefined') return null
  const stored = window.localStorage.getItem(TRANSPORT_STORAGE_KEY)
  return transportOptions.some((option) => option.id === stored) ? (stored as TransportId) : null
}

export function writeStoredTransport(transportId: TransportId | null) {
  if (typeof window === 'undefined') return
  if (transportId) {
    window.localStorage.setItem(TRANSPORT_STORAGE_KEY, transportId)
  } else {
    window.localStorage.removeItem(TRANSPORT_STORAGE_KEY)
  }
}
