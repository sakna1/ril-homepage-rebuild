import { API_BASE_URL, apiUrl } from '../services/apiConfig'

export type AdminProfile = { id: number; email: string; fullName: string }

export type Theme = {
  id: number
  title: string
  description: string
  traveller: string
  encounter: string
  imageUrl: string | null
  sortOrder: number
  places?: Place[]
}

export type Place = {
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

export type Package = {
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

export type ReportsOverview = {
  travellers: number
  itineraries: number
  themes: number
  places: number
  packages: number
  googleTravellers: number
  emailTravellers: number
  recentTravellers: { fullName: string; email: string; provider: string; createdAt: string | null }[]
  itinerariesPerTraveller: { fullName: string; email: string; itineraries: number }[]
  placesPerTheme: { theme: string; places: number }[]
}

const TOKEN_KEY = 'royale-isles-admin-token'

export function getAdminToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}
export function setAdminToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}
export function clearAdminToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

export class AdminUnauthorizedError extends Error {
  constructor(message = 'Your admin session has ended. Please sign in again.') {
    super(message)
    this.name = 'AdminUnauthorizedError'
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getAdminToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) ?? {}),
  }
  if (token) headers.Authorization = `Bearer ${token}`

  let response: Response
  try {
    response = await fetch(apiUrl(path), { ...options, headers })
  } catch {
    throw new Error('Could not reach the server. Please check your connection.')
  }

  if (response.status === 401) throw new AdminUnauthorizedError()
  if (!response.ok) {
    let detail = 'Something went wrong. Please try again.'
    try {
      const data = await response.json()
      if (typeof data?.detail === 'string') detail = data.detail
    } catch {
      /* keep default */
    }
    throw new Error(detail)
  }
  if (response.status === 204) return undefined as T
  return (await response.json()) as T
}

type AdminTokenResponse = { accessToken: string; admin: AdminProfile }

export async function adminLogin(email: string, password: string): Promise<{ token: string; admin: AdminProfile }> {
  const data = await request<AdminTokenResponse>('/api/admin/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  return { token: data.accessToken, admin: data.admin }
}

export const fetchAdminProfile = () => request<AdminProfile>('/api/admin/me')

// Themes
export const listThemes = () => request<Theme[]>('/api/admin/themes')
export const createTheme = (t: Omit<Theme, 'id' | 'places'>) =>
  request<Theme>('/api/admin/themes', { method: 'POST', body: JSON.stringify(t) })
export const updateTheme = (id: number, t: Omit<Theme, 'id' | 'places'>) =>
  request<Theme>(`/api/admin/themes/${id}`, { method: 'PUT', body: JSON.stringify(t) })
export const deleteTheme = (id: number) =>
  request<void>(`/api/admin/themes/${id}`, { method: 'DELETE' })

// Places
export const listPlaces = () => request<Place[]>('/api/admin/places')
export const createPlace = (p: Omit<Place, 'id'>) =>
  request<Place>('/api/admin/places', { method: 'POST', body: JSON.stringify(p) })
export const updatePlace = (id: number, p: Omit<Place, 'id'>) =>
  request<Place>(`/api/admin/places/${id}`, { method: 'PUT', body: JSON.stringify(p) })
export const deletePlace = (id: number) =>
  request<void>(`/api/admin/places/${id}`, { method: 'DELETE' })

// Packages
export const listPackages = () => request<Package[]>('/api/admin/packages')
export const createPackage = (p: Omit<Package, 'id'>) =>
  request<Package>('/api/admin/packages', { method: 'POST', body: JSON.stringify(p) })
export const updatePackage = (id: number, p: Omit<Package, 'id'>) =>
  request<Package>(`/api/admin/packages/${id}`, { method: 'PUT', body: JSON.stringify(p) })
export const deletePackage = (id: number) =>
  request<void>(`/api/admin/packages/${id}`, { method: 'DELETE' })

// Reports
export const fetchReports = () => request<ReportsOverview>('/api/admin/reports/overview')
export function travellersCsvUrl(): string {
  return `${API_BASE_URL}/api/admin/reports/travellers.csv`
}
