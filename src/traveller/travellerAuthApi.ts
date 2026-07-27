import { apiUrl } from '../services/apiConfig'

export type TravellerProfile = {
  id: number
  fullName: string
  email: string
  phone: string
  passportNumber: string
  passportExpiry: string | null
  nationality: string
  dietaryPreferences: string
  travelStyle: string
  emergencyContactName: string
  emergencyContactPhone: string
}

export type TravellerItineraryStop = {
  id: string
  time: string
  activity: string
  location: string
  notes: string | null
}

export type TravellerItinerary = {
  id: string
  title: string
  destination: string
  startDate: string
  endDate: string
  coverImage: string | null
  stops: TravellerItineraryStop[]
}

const TOKEN_KEY = 'royale-isles-traveller-token'

export function getTravellerToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setTravellerToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearTravellerToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

export class TravellerUnauthorizedError extends Error {
  constructor(message = 'Your session has ended. Please sign in again.') {
    super(message)
    this.name = 'TravellerUnauthorizedError'
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getTravellerToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) ?? {}),
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  let response: Response
  try {
    response = await fetch(apiUrl(path), { ...options, headers })
  } catch {
    throw new Error('Could not reach the server. Please check your connection and try again.')
  }

  if (response.status === 401) {
    throw new TravellerUnauthorizedError()
  }

  if (!response.ok) {
    let detail = 'Something went wrong. Please try again.'
    try {
      const data = await response.json()
      if (data?.detail) {
        detail = typeof data.detail === 'string' ? data.detail : detail
      }
    } catch {
      /* keep default */
    }
    throw new Error(detail)
  }

  if (response.status === 204) {
    return undefined as T
  }
  return (await response.json()) as T
}

type TokenResponse = {
  accessToken: string
  tokenType: string
  traveller: TravellerProfile
}

export type AuthResult = { token: string; traveller: TravellerProfile }

function toAuthResult(data: TokenResponse): AuthResult {
  return { token: data.accessToken, traveller: data.traveller }
}

export async function loginTraveller(email: string, password: string): Promise<AuthResult> {
  return toAuthResult(
    await request<TokenResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  )
}

export async function registerTraveller(
  email: string,
  password: string,
  fullName: string,
): Promise<AuthResult> {
  return toAuthResult(
    await request<TokenResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, fullName }),
    }),
  )
}

export async function googleLoginTraveller(credential: string): Promise<AuthResult> {
  return toAuthResult(
    await request<TokenResponse>('/api/auth/google', {
      method: 'POST',
      body: JSON.stringify({ credential }),
    }),
  )
}

export async function requestPasswordReset(email: string): Promise<void> {
  await request('/api/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
}

export async function resetPassword(token: string, password: string): Promise<AuthResult> {
  return toAuthResult(
    await request<TokenResponse>('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    }),
  )
}

export function fetchTravellerProfile(): Promise<TravellerProfile> {
  return request<TravellerProfile>('/api/auth/me')
}

export function updateTravellerProfile(profile: TravellerProfile): Promise<TravellerProfile> {
  return request<TravellerProfile>('/api/auth/me', {
    method: 'PUT',
    body: JSON.stringify(profile),
  })
}

export function fetchTravellerItineraries(): Promise<TravellerItinerary[]> {
  return request<TravellerItinerary[]>('/api/traveller/itineraries')
}

export function saveTravellerItineraries(
  itineraries: TravellerItinerary[],
): Promise<TravellerItinerary[]> {
  return request<TravellerItinerary[]>('/api/traveller/itineraries', {
    method: 'PUT',
    body: JSON.stringify({ itineraries }),
  })
}
