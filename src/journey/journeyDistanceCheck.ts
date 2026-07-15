import { journeyRegions, type RegionDestination } from '../data/journeyRegions'

const EARTH_RADIUS_KM = 6371
/** Beyond this, two places sit in clearly different corners of the island. */
const FAR_APART_THRESHOLD_KM = 150

function toRadians(deg: number) {
  return (deg * Math.PI) / 180
}

/** Great-circle distance in kilometres between two [longitude, latitude] points. */
export function haversineDistanceKm(a: readonly [number, number], b: readonly [number, number]): number {
  const [lngA, latA] = a
  const [lngB, latB] = b
  const dLat = toRadians(latB - latA)
  const dLng = toRadians(lngB - lngA)
  const sinDLat = Math.sin(dLat / 2)
  const sinDLng = Math.sin(dLng / 2)
  const h = sinDLat * sinDLat + Math.cos(toRadians(latA)) * Math.cos(toRadians(latB)) * sinDLng * sinDLng
  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h))
}

export type DistanceAdvisory = {
  distanceKm: number
  from: string
  to: string
}

function findDestination(id: string, regions: typeof journeyRegions): RegionDestination | undefined {
  for (const region of regions) {
    const match = region.destinations.find((destination) => destination.id === id)
    if (match) return match
  }
  return undefined
}

/**
 * Returns the single farthest-apart pair among selected destinations, if it
 * exceeds a practical same-trip travel radius — purely advisory, never
 * blocking. Straight-line distance only; driving time/routing is a future
 * enhancement.
 */
export function checkJourneyDistances(
  destinationIds: string[],
  regions: typeof journeyRegions = journeyRegions,
): DistanceAdvisory | null {
  const destinations = destinationIds
    .map((id) => findDestination(id, regions))
    .filter((destination): destination is RegionDestination => Boolean(destination))

  if (destinations.length < 2) {
    return null
  }

  let farthest: DistanceAdvisory | null = null

  for (let i = 0; i < destinations.length; i += 1) {
    for (let j = i + 1; j < destinations.length; j += 1) {
      const distanceKm = haversineDistanceKm(destinations[i].coordinates, destinations[j].coordinates)
      if (distanceKm > FAR_APART_THRESHOLD_KM && (!farthest || distanceKm > farthest.distanceKm)) {
        farthest = { distanceKm, from: destinations[i].title, to: destinations[j].title }
      }
    }
  }

  return farthest
}
