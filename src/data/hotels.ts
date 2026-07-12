import type { RegionDestination } from './journeyRegions'

export type HotelListing = {
  id: string
  name: string
  description: string
  priceHint: string
}

/**
 * Placeholder hotel data. There is no real hotel/partner content yet — once
 * clients supply it, replace this with a real fetch (API or database) keyed
 * by destination id, keeping the same HotelListing shape so callers don't
 * need to change.
 */
export function getHotelsForDestination(destination: RegionDestination): HotelListing[] {
  return [
    {
      id: `${destination.id}-manor`,
      name: `${destination.title} Manor House`,
      description: `A private residence near ${destination.title}, held for guests seeking discretion and unhurried mornings.`,
      priceHint: 'Sample listing — pending confirmed partner rates',
    },
    {
      id: `${destination.id}-retreat`,
      name: `The ${destination.title} Retreat`,
      description: `A small boutique stay close to ${destination.title}, arranged as a quiet base for this world's encounters.`,
      priceHint: 'Sample listing — pending confirmed partner rates',
    },
  ]
}
