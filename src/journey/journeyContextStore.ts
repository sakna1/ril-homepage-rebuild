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
 * What the traveller chose on the Itineraries page: a package, a theme, and one
 * of that theme's two sub-packages, whose hotel and activities are then locked.
 */
export type DesignedTripSelection = {
  packageName: string
  packageDuration: string
  /** The package's own "from" price per person, before the sub-package is added. */
  packagePrice: number
  themeTitle: string
  subPackageName: string
  subPackageDays: number
  subPackageCoverage: string
  /** USD per person added by the sub-package. */
  subPackagePriceAdd: number
  hotel: string
  activities: string[]
  inclusions: string[]
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
