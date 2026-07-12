import type { JourneyItem } from './JourneyContext'

export type JourneyPlaceGroup = {
  placeName: string
  accommodations: JourneyItem[]
  activities: JourneyItem[]
}

/**
 * Groups saved accommodation/experience/destination items by the place they
 * belong to (JourneyItem.parentRegion, falling back to source or the item's
 * own label for destination items), preserving first-seen order.
 */
export function groupJourneyPlaces(items: JourneyItem[]): JourneyPlaceGroup[] {
  const order: string[] = []
  const groups = new Map<string, JourneyPlaceGroup>()

  function ensureGroup(placeName: string): JourneyPlaceGroup {
    let group = groups.get(placeName)
    if (!group) {
      group = { placeName, accommodations: [], activities: [] }
      groups.set(placeName, group)
      order.push(placeName)
    }
    return group
  }

  for (const item of items) {
    if (item.kind === 'destination') {
      ensureGroup(item.label)
    }
  }

  for (const item of items) {
    if (item.kind === 'accommodation') {
      ensureGroup(item.parentRegion ?? item.source ?? item.label).accommodations.push(item)
    }
    if (item.kind === 'experience') {
      ensureGroup(item.parentRegion ?? item.source ?? item.label).activities.push(item)
    }
  }

  return order.map((placeName) => groups.get(placeName)!)
}
