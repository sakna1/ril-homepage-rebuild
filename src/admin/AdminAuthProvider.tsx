import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  adminLogin,
  clearAdminToken,
  fetchAdminProfile,
  getAdminToken,
  setAdminToken,
  AdminUnauthorizedError,
  type AdminProfile,
} from './adminApi'

type AdminAuthValue = {
  token: string | null
  admin: AdminProfile | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

export const AdminAuthContext = createContext<AdminAuthValue | undefined>(undefined)

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
