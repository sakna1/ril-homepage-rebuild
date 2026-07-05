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

export type JourneyItem = {
  id: string
  kind: JourneyItemKind
  label: string
  detail?: string
  source?: string
  parentTheme?: string
  parentRegion?: string
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
