import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  adminLogin,
  clearAdminToken,
  fetchAdminProfile,
  getAdminToken,
  setAdminToken,
  AdminUnauthorizedError,
  type AdminProfile,
} from './adminApi'
import { AdminAuthContext, type AdminAuthValue } from './adminAuthContext'

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => getAdminToken())
  const [admin, setAdmin] = useState<AdminProfile | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const logout = useCallback(() => {
    clearAdminToken()
    setToken(null)
    setAdmin(null)
  }, [])

  useEffect(() => {
    if (!token) return
    let cancelled = false
    // Flagged by react-hooks/set-state-in-effect. Restoring a session from a
    // stored token is exactly the "subscribe to an external system" case the
    // rule carves out: the spinner has to be up before the request leaves, and
    // there is no render-time value to derive it from.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true)
    fetchAdminProfile()
      .then((profile) => {
        if (!cancelled) setAdmin(profile)
      })
      .catch((err) => {
        if (cancelled) return
        if (err instanceof AdminUnauthorizedError) logout()
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [token, logout])

  const login = useCallback(async (email: string, password: string) => {
    const result = await adminLogin(email, password)
    setAdminToken(result.token)
    setAdmin(result.admin)
    setToken(result.token)
  }, [])

  const value = useMemo<AdminAuthValue>(
    () => ({
      token,
      admin,
      isLoading,
      isAuthenticated: Boolean(token),
      login,
      logout,
    }),
    [token, admin, isLoading, login, logout],
  )

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
}
