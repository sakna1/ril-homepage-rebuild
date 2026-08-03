import { apiUrl } from './apiConfig'

export type PublicPackage = {
  id: number
  name: string
  numeral: string
  duration: string
  character: string
  route: string[]
  inclusions: string[]
  pace: string
  bestFor: string
  reach: string
  imageUrl: string | null
  priceFrom: number | null
  sortOrder: number
}

export type PublicPlace = {
  id: number
  themeId: number
  name: string
  region: string
  description: string
  longitude: number | null
  latitude: number | null
  bestTime: string
  activities: string[]
  sortOrder: number
}

/** A sub-package sold under a theme: "The Glimpse" (2 days) or "The Immersion" (4 days). */
export type PublicThemePackage = {
  id: number
  themeId: number
  tier: string
  name: string
  days: number
  coverage: string
  summary: string
  hotel: string
  activities: string[]
  inclusions: string[]
  /** USD per person, added on top of the chosen package's `priceFrom`. */
  priceAdd: number
  sortOrder: number
}

export type PublicTheme = {
  id: number
  title: string
  description: string
  traveller: string
  encounter: string
  imageUrl: string | null
  sortOrder: number
  places: PublicPlace[]
  themePackages: PublicThemePackage[]
}

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(apiUrl(path))
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`)
  }
  return (await response.json()) as T
}

/** Public content reads. These fail soft — callers fall back to curated data. */
export function fetchPublicPackages(): Promise<PublicPackage[]> {
  return getJson<PublicPackage[]>('/api/content/packages')
}

export function fetchPublicThemes(): Promise<PublicTheme[]> {
  return getJson<PublicTheme[]>('/api/content/themes')
}

export function fetchPublicThemePackages(): Promise<PublicThemePackage[]> {
  return getJson<PublicThemePackage[]>('/api/content/theme-packages')
}
