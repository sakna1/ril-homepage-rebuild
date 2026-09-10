import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  clearTravellerToken,
  fetchTravellerItineraries,
  fetchTravellerProfile,
  getTravellerToken,
  googleLoginTraveller,
  loginTraveller,
  registerTraveller,
  resetPassword,
  saveTravellerItineraries,
  setTravellerToken,
  TravellerUnauthorizedError,
  updateTravellerProfile,
  type TravellerItinerary,
  type TravellerProfile,
} from './travellerAuthApi'
import { TravellerAuthContext, type TravellerAuthValue } from './travellerAuthContext'

export function TravellerAuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => getTravellerToken())
  const [traveller, setTraveller] = useState<TravellerProfile | null>(null)
  const [itineraries, setItineraries] = useState<TravellerItinerary[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  const logout = useCallback(() => {
    clearTravellerToken()
    setToken(null)
    setTraveller(null)
    setItineraries([])
  }, [])

  // Load profile + itineraries whenever we hold a token (login, reload, retry).
  useEffect(() => {
    if (!token) return
    let cancelled = false

    ;(async () => {
      setIsLoading(true)
      setError('')
      try {
        const [profile, trips] = await Promise.all([
          fetchTravellerProfile(),
          fetchTravellerItineraries(),
        ])
        if (cancelled) return
        setTraveller(profile)
        setItineraries(trips)
      } catch (err) {
        if (cancelled) return
        if (err instanceof TravellerUnauthorizedError) {
          logout()
        } else {
          setError(err instanceof Error ? err.message : 'Could not load your account.')
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [token, reloadKey, logout])

  const applyToken = useCallback((newToken: string, profile: TravellerProfile) => {
    setTravellerToken(newToken)
    setTraveller(profile)
    setToken(newToken)
  }, [])

  const login = useCallback(
    async (email: string, password: string) => {
      const result = await loginTraveller(email, password)
      applyToken(result.token, result.traveller)
    },
    [applyToken],
  )

  const register = useCallback(
    async (email: string, password: string, fullName: string) => {
      const result = await registerTraveller(email, password, fullName)
      applyToken(result.token, result.traveller)
    },
    [applyToken],
  )

  const googleLogin = useCallback(
    async (credential: string) => {
      const result = await googleLoginTraveller(credential)
      applyToken(result.token, result.traveller)
    },
    [applyToken],
  )

  const completeReset = useCallback(
    async (resetToken: string, password: string) => {
      const result = await resetPassword(resetToken, password)
      applyToken(result.token, result.traveller)
    },
    [applyToken],
  )

  const saveProfile = useCallback(
    async (profile: TravellerProfile) => {
      setTraveller(profile) // optimistic
      try {
        const saved = await updateTravellerProfile(profile)
        setTraveller(saved)
      } catch (err) {
        if (err instanceof TravellerUnauthorizedError) logout()
        else throw err
      }
    },
    [logout],
  )

  const saveItineraries = useCallback(
    async (nextItineraries: TravellerItinerary[]) => {
      const previous = itineraries
      setItineraries(nextItineraries) // optimistic
      try {
        const saved = await saveTravellerItineraries(nextItineraries)
        setItineraries(saved)
      } catch (err) {
        setItineraries(previous) // roll back on failure
        if (err instanceof TravellerUnauthorizedError) logout()
        else throw err
      }
    },
    [itineraries, logout],
  )

  const reload = useCallback(() => setReloadKey((key) => key + 1), [])

  const value = useMemo<TravellerAuthValue>(
    () => ({
      token,
      traveller,
      itineraries,
      isLoading,
      error,
      isAuthenticated: Boolean(token),
      login,
      register,
      googleLogin,
      completeReset,
      saveProfile,
      saveItineraries,
      logout,
      reload,
    }),
    [
      token,
      traveller,
      itineraries,
      isLoading,
      error,
      login,
      register,
      googleLogin,
      completeReset,
      saveProfile,
      saveItineraries,
      logout,
      reload,
    ],
  )

  return <TravellerAuthContext.Provider value={value}>{children}</TravellerAuthContext.Provider>
}
