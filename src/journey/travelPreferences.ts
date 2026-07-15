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

export type TransportId = 'private-car' | 'suv' | 'luxury-van' | 'chauffeur' | 'coach'

export type TransportOption = {
  id: TransportId
  label: string
  icon: TravelIconId
  capacity: string
  luggage: string
  comfort: string
  recommendedFor: string
}

export const transportOptions: TransportOption[] = [
  {
    id: 'private-car',
    label: 'Private Luxury Car',
    icon: 'sedan',
    capacity: '1 – 3 guests',
    luggage: '2 – 3 bags',
    comfort: 'Premium',
    recommendedFor: 'Couples and solo travellers',
  },
  {
    id: 'suv',
    label: 'SUV',
    icon: 'suv',
    capacity: '1 – 4 guests',
    luggage: '4 – 5 bags',
    comfort: 'Elevated',
    recommendedFor: 'Small families and hill country routes',
  },
  {
    id: 'luxury-van',
    label: 'Luxury Van',
    icon: 'van',
    capacity: 'Up to 6 guests',
    luggage: '6 – 8 bags',
    comfort: 'Spacious',
    recommendedFor: 'Families and small groups',
  },
  {
    id: 'chauffeur',
    label: 'Chauffeur Driven Vehicle',
    icon: 'driver',
    capacity: '1 – 4 guests',
    luggage: '3 – 4 bags',
    comfort: 'Personal',
    recommendedFor: 'Guests who want a dedicated private driver throughout',
  },
  {
    id: 'coach',
    label: 'Premium Coach (Groups)',
    icon: 'coach',
    capacity: 'Up to 20 guests',
    luggage: 'Full group luggage',
    comfort: 'Comfort-class',
    recommendedFor: 'Corporate groups and larger parties',
  },
]

const COMPANION_STORAGE_KEY = 'royale-isles-travel-companion'
const TRANSPORT_STORAGE_KEY = 'royale-isles-transport-preference'

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
