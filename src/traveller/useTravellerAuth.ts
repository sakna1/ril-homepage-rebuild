import { useContext } from 'react'
import { TravellerAuthContext } from './TravellerAuthContext'

export function useTravellerAuth() {
  const context = useContext(TravellerAuthContext)
  if (!context) {
    throw new Error('useTravellerAuth must be used within a TravellerAuthProvider')
  }
  return context
}
