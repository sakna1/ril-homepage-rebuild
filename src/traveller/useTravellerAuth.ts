import { useContext } from 'react'
import { TravellerAuthContext } from './travellerAuthContext'

export function useTravellerAuth() {
  const context = useContext(TravellerAuthContext)
  if (!context) {
    throw new Error('useTravellerAuth must be used within a TravellerAuthProvider')
  }
  return context
}
