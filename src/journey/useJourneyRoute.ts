import { useEffect, useMemo, useState } from 'react'
import { findCatalogDestinationById } from '../data/journey/adapters'
import { fetchDrivingRoute, type DrivingRoute } from '../services/mapboxDirections'

export type JourneyRoute = {
  /** Straight-line coordinates for each saved stop, in journey order. */
  stopCoordinates: [number, number][]
  /** Road-following geometry once the Directions API responds, else null. */
  route: DrivingRoute | null
  isLoading: boolean
}

/**
 * Resolves the driving route between the saved stops.
 *
 * While the request is in flight (or if it fails) callers fall back to the
 * straight-line stop coordinates, so the map always draws something.
 */
export function useJourneyRoute(destinationIds: string[]): JourneyRoute {
  const idKey = destinationIds.join('|')

  const stopCoordinates = useMemo(() => {
    return destinationIds
      .map((id) => findCatalogDestinationById(id)?.destination.coordinates)
      .filter((coordinates): coordinates is [number, number] => Boolean(coordinates))
    // idKey captures the meaningful change; destinationIds identity may vary.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idKey])

  const [route, setRoute] = useState<DrivingRoute | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (stopCoordinates.length < 2) {
      setRoute(null)
      setIsLoading(false)
      return
    }

    let cancelled = false
    setIsLoading(true)

    fetchDrivingRoute(stopCoordinates).then((resolved) => {
      if (cancelled) return
      setRoute(resolved)
      setIsLoading(false)
    })

    return () => {
      cancelled = true
    }
  }, [stopCoordinates])

  return { stopCoordinates, route, isLoading }
}
