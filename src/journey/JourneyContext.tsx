import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { inferJourneyRegion, inferJourneyTheme, normalizeJourneyItem } from './journeyTaxonomy'
import { normalizeJourneyItemLabels } from './savedJourneyDisplay'

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

type JourneyContextValue = {
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

const STORAGE_KEY = 'royale-isles-my-journey'
const HELPER_STORAGE_KEY = 'royale-isles-my-journey-helper-seen'

const JourneyContext = createContext<JourneyContextValue | undefined>(undefined)

function normalizeJourneyItems(items: JourneyItem[]) {
  const normalizedItems = items
    .map((item) => normalizeJourneyItemLabels(normalizeJourneyItem(item)))
    .filter(
      (item) =>
        !(item.kind === 'experience' && item.detail?.startsWith('A signature encounter naturally aligned with')),
    )
  const experienceThemes = new Set(
    normalizedItems
      .filter((item) => item.kind === 'experience' && item.parentTheme)
      .map((item) => item.parentTheme),
  )

  return normalizedItems.filter(
    (item) =>
      !(
        item.kind === 'theme' &&
        item.detail?.startsWith('The primary way') &&
        !experienceThemes.has(item.label)
      ),
  )
}

function readStoredJourney() {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const storedValue = window.localStorage.getItem(STORAGE_KEY)
    if (!storedValue) {
      return []
    }

    const parsedValue = JSON.parse(storedValue)
    return Array.isArray(parsedValue) ? normalizeJourneyItems(parsedValue as JourneyItem[]) : []
  } catch {
    return []
  }
}

function readStoredHelperState() {
  if (typeof window === 'undefined') {
    return false
  }

  return window.localStorage.getItem(HELPER_STORAGE_KEY) === 'true'
}

export function JourneyProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<JourneyItem[]>(readStoredJourney)
  const [pendingRemovalId, setPendingRemovalId] = useState<string | null>(null)
  const [hasSeenHelper, setHasSeenHelper] = useState(readStoredHelperState)

  useEffect(() => {
    setItems((currentItems) => {
      const normalizedItems = normalizeJourneyItems(currentItems)
      return JSON.stringify(normalizedItems) === JSON.stringify(currentItems) ? currentItems : normalizedItems
    })
  })

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  useEffect(() => {
    window.localStorage.setItem(HELPER_STORAGE_KEY, String(hasSeenHelper))
  }, [hasSeenHelper])

  const includeItem = useCallback((item: JourneyItem) => {
    const normalizedItem = normalizeJourneyItem(item)

    setItems((currentItems) => {
      const existingIndex = currentItems.findIndex((currentItem) => currentItem.id === normalizedItem.id)

      if (existingIndex >= 0) {
        const nextItems = [...currentItems]
        nextItems[existingIndex] = {
          ...currentItems[existingIndex],
          ...normalizedItem,
        }
        return nextItems
      }

      return [...currentItems, normalizedItem]
    })
    setPendingRemovalId(null)
  }, [])

  const requestRemoveItem = useCallback((id: string) => {
    setPendingRemovalId((currentId) => (currentId === id ? null : id))
  }, [])

  const confirmRemoveItem = useCallback((id: string) => {
    setItems((currentItems) => {
      const itemToRemove = currentItems.find((item) => item.id === id)

      if (itemToRemove?.kind === 'region' && itemToRemove.parentTheme) {
        return currentItems.filter((item) => item.id !== id && inferJourneyRegion(item) !== itemToRemove.label)
      }

      if (itemToRemove?.kind !== 'theme') {
        return currentItems.filter((item) => item.id !== id)
      }

      return currentItems.filter((item) => {
        const itemTheme = inferJourneyTheme(item)
        return item.id !== id && itemTheme !== itemToRemove.label
      })
    })
    setPendingRemovalId(null)
  }, [])

  const dismissHelper = useCallback(() => {
    setHasSeenHelper(true)
  }, [])

  const value = useMemo<JourneyContextValue>(() => {
    const pendingRemovalItem = pendingRemovalId ? items.find((item) => item.id === pendingRemovalId) : undefined

    return {
      items,
      count: items.length,
      hasSeenHelper,
      pendingRemovalId,
      includeItem,
      requestRemoveItem,
      confirmRemoveItem,
      isIncluded: (id: string) => items.some((item) => item.id === id),
      getItem: (id: string) => (id === pendingRemovalId ? pendingRemovalItem : items.find((item) => item.id === id)),
      dismissHelper,
    }
  }, [confirmRemoveItem, dismissHelper, hasSeenHelper, includeItem, items, pendingRemovalId, requestRemoveItem])

  return <JourneyContext.Provider value={value}>{children}</JourneyContext.Provider>
}

export function useJourney() {
  const context = useContext(JourneyContext)

  if (!context) {
    throw new Error('useJourney must be used within JourneyProvider')
  }

  return context
}
