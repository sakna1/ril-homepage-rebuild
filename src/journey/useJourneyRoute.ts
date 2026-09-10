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

  const isRoutable = stopCoordinates.length >= 2

  useEffect(() => {
    if (!isRoutable) return

    let cancelled = false
    // Flagged by react-hooks/set-state-in-effect: the Directions request is an
    // external system, and the in-flight flag has to be raised before it is
    // dispatched. Every other branch of this hook is derived (see below).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true)

    fetchDrivingRoute(stopCoordinates).then((resolved) => {
      if (cancelled) return
      setRoute(resolved)
      setIsLoading(false)
    })

    return () => {
      cancelled = true
    }
  }, [stopCoordinates, isRoutable])

  // Derived rather than reset through state: with fewer than two stops there is
  // nothing to route, so the last response must not leak into the next render.
  return {
    stopCoordinates,
    route: isRoutable ? route : null,
    isLoading: isRoutable && isLoading,
  }
}
