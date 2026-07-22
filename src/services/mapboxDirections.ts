/**
 * Road-following route geometry from the Mapbox Directions API.
 *
 * The journey map previously drew straight lines between stops. This resolves
 * the actual driving route so the line follows real roads, and returns the
 * driving distance/duration Mapbox calculates for it.
 */

export type DrivingRoute = {
  /** Full road geometry as [longitude, latitude] pairs. */
  coordinates: [number, number][]
  distanceKm: number
  durationMinutes: number
}

// The Directions API accepts at most 25 coordinates per request.
const MAX_WAYPOINTS = 25

// Routes for a given set of stops never change, so cache them for the session.
const routeCache = new Map<string, DrivingRoute | null>()

function buildCacheKey(points: [number, number][]): string {
  return points.map(([lng, lat]) => `${lng.toFixed(4)},${lat.toFixed(4)}`).join(';')
}

export async function fetchDrivingRoute(
  points: [number, number][],
): Promise<DrivingRoute | null> {
  const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN

  if (!accessToken || points.length < 2) {
    return null
  }

  const waypoints = points.slice(0, MAX_WAYPOINTS)
  const key = buildCacheKey(waypoints)

  const cached = routeCache.get(key)
  if (cached !== undefined) {
    return cached
  }

  const url =
    `https://api.mapbox.com/directions/v5/mapbox/driving/${key}` +
    `?geometries=geojson&overview=full&access_token=${accessToken}`

  try {
    const response = await fetch(url)
    if (!response.ok) {
      routeCache.set(key, null)
      return null
    }

    const data = await response.json()
    const route = data?.routes?.[0]
    const coordinates = route?.geometry?.coordinates

    if (!Array.isArray(coordinates) || coordinates.length < 2) {
      routeCache.set(key, null)
      return null
    }

    const resolved: DrivingRoute = {
      coordinates: coordinates as [number, number][],
      distanceKm: Math.round((route.distance ?? 0) / 1000),
      durationMinutes: Math.round((route.duration ?? 0) / 60),
    }

    routeCache.set(key, resolved)
    return resolved
  } catch {
    // Offline, blocked, or rate-limited — callers fall back to straight lines.
    routeCache.set(key, null)
    return null
  }
}

export function formatDrivingDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`
  }
  const hours = Math.floor(minutes / 60)
  const remainder = minutes % 60
  return remainder === 0 ? `${hours} hr` : `${hours} hr ${remainder} min`
}
