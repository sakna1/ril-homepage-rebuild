import { createContext } from 'react'
import type { AdminProfile } from './adminApi'

export type AdminAuthValue = {
  token: string | null
  admin: AdminProfile | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

// Kept out of AdminAuthContext.tsx so that file only exports the provider
// component — a module mixing the two breaks Fast Refresh.
export const AdminAuthContext = createContext<AdminAuthValue | undefined>(undefined)
