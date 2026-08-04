import { createContext } from 'react'

export type JourneyItemKind =
  | 'theme'
  | 'discovery-world'
  | 'region'
  | 'destination'
  | 'mood'
  | 'accommodation'
  | 'experience'
  | 'season'
  | 'interest'
  | 'package'

export type JourneyItem = {
  id: string
  kind: JourneyItemKind
  label: string
  detail?: string
  source?: string
  parentTheme?: string
  parentRegion?: string
  /** Indicative price per person, in USD. Only set for `package` items. */
  pricePerPerson?: number
  /** Duration label for package items, e.g. "10 Days". */
  duration?: string
  /** The Designed Trips selection, set on `package` items built by the Itineraries flow. */
  designedTrip?: DesignedTripSelection
}

/**
 * One theme + sub-package committed against a package. A package may hold
 * several, so long as their days fit inside the package length.
 */
export type DesignedTripSegment = {
  themeTitle: string
  subPackageName: string
  subPackageDays: number
  subPackageCoverage: string
  /** USD per person added by this sub-package, on top of the package price. */
  subPackagePriceAdd: number
  hotel: string
  activities: string[]
  inclusions: string[]
}

/**
 * What the traveller chose on the Itineraries page. The package is the frame
 * and is priced once; each segment adds days and cost inside it. Keyed on the
 * package alone, so adding a second theme extends this selection rather than
 * creating a duplicate package line.
 */
export type DesignedTripSelection = {
  packageName: string
  packageDuration: string
  /** The package's own "from" price per person, before any sub-package. */
  packagePrice: number
  segments: DesignedTripSegment[]
}

/**
 * Segments of a trip, defensively. Journeys are restored from localStorage and
 * may predate the segments model, so never assume the array is there.
 */
export function designedTripSegments(trip: DesignedTripSelection): DesignedTripSegment[] {
  return Array.isArray(trip?.segments) ? trip.segments : []
}

/** Days committed across every segment of a designed trip. */
export function designedTripDaysUsed(trip: DesignedTripSelection): number {
  return designedTripSegments(trip).reduce(
    (total, segment) => total + (segment.subPackageDays || 0),
    0,
  )
}

/** Package price plus every segment's addition — the base is counted once. */
export function designedTripTotal(trip: DesignedTripSelection): number {
  return designedTripSegments(trip).reduce(
    (total, segment) => total + (segment.subPackagePriceAdd || 0),
    trip?.packagePrice || 0,
  )
}

export type JourneyContextValue = {
  items: JourneyItem[]
  count: number
  hasSeenHelper: boolean
  pendingRemovalId: string | null
  includeItem: (item: JourneyItem) => void
  requestRemoveItem: (id: string) => void
  confirmRemoveItem: (id: string) => void
  isIncluded: (id: string) => boolean
  getItem: (id: string) => JourneyItem | undefined
  dismissHelper: () => void
}

export const JourneyContext = createContext<JourneyContextValue | undefined>(undefined)
