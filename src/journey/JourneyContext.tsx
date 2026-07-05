import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  JourneyContext,
  type JourneyContextValue,
  type JourneyItem,
} from './journeyContextStore'
import { inferJourneyRegion, inferJourneyTheme, normalizeJourneyItem } from './journeyTaxonomy'
import { normalizeJourneyItemLabels } from './savedJourneyDisplay'

export type { JourneyItem, JourneyItemKind } from './journeyContextStore'

const STORAGE_KEY = 'royale-isles-my-journey'
const HELPER_STORAGE_KEY = 'royale-isles-my-journey-helper-seen'

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
  const [items, setItems] = useState<JourneyItem[]>(() => readStoredJourney())
  const [pendingRemovalId, setPendingRemovalId] = useState<string | null>(null)
  const [hasSeenHelper, setHasSeenHelper] = useState(readStoredHelperState)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  useEffect(() => {
    window.localStorage.setItem(HELPER_STORAGE_KEY, String(hasSeenHelper))
  }, [hasSeenHelper])

  const includeItem = useCallback((item: JourneyItem) => {
    const normalizedItem = normalizeJourneyItemLabels(normalizeJourneyItem(item))

    setItems((currentItems) => {
      const existingIndex = currentItems.findIndex((currentItem) => currentItem.id === normalizedItem.id)

      if (existingIndex >= 0) {
        const nextItems = [...currentItems]
        nextItems[existingIndex] = {
          ...currentItems[existingIndex],
          ...normalizedItem,
        }
        return normalizeJourneyItems(nextItems)
      }

      return normalizeJourneyItems([...currentItems, normalizedItem])
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
        return normalizeJourneyItems(
          currentItems.filter((item) => item.id !== id && inferJourneyRegion(item) !== itemToRemove.label),
        )
      }

      if (itemToRemove?.kind !== 'theme') {
        return normalizeJourneyItems(currentItems.filter((item) => item.id !== id))
      }

      return normalizeJourneyItems(
        currentItems.filter((item) => {
          const itemTheme = inferJourneyTheme(item)
          return item.id !== id && itemTheme !== itemToRemove.label
        }),
      )
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
