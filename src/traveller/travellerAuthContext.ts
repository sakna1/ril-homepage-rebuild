import { createContext } from 'react'
import type { TravellerItinerary, TravellerProfile } from './travellerAuthApi'

export type TravellerAuthValue = {
  token: string | null
  traveller: TravellerProfile | null
  itineraries: TravellerItinerary[]
  isLoading: boolean
  error: string
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, fullName: string) => Promise<void>
  googleLogin: (credential: string) => Promise<void>
  completeReset: (token: string, password: string) => Promise<void>
  saveProfile: (profile: TravellerProfile) => Promise<void>
  saveItineraries: (itineraries: TravellerItinerary[]) => Promise<void>
  logout: () => void
  reload: () => void
}

// Kept out of TravellerAuthContext.tsx so that file only exports the provider
// component — a module mixing the two breaks Fast Refresh.
export const TravellerAuthContext = createContext<TravellerAuthValue | undefined>(undefined)
