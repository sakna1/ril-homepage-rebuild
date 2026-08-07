import type { JourneyItem } from './JourneyContext'
import { DISCOVERY_WORLD_NAMES, destinationDiscoveryWorlds } from './discoveryWorlds'

export const regionThemeFallbacks: Record<string, string> = {
  'West Coast & Colombo': DISCOVERY_WORLD_NAMES.sharedHeritage,
  'South Coast': 'Ocean & Discovery',
  'Wild South': 'Wildlife & Wilderness',
  'East Coast': 'Ocean & Discovery',
  'Hill Country': 'Rail & Landscape',
  'Cultural Triangle': 'Heritage & Memory',
  'The North': 'Culture & Human Connection',
  'West Coast': DISCOVERY_WORLD_NAMES.sharedHeritage,
}

export const regionSignatureExperiences: Record<string, string> = {
  'South Coast': "The Mirissa Fishermen's Dawn",
  'Hill Country': 'A Private Tea Estate, Locked Before Dawn',
  'Cultural Triangle': 'The Sigiriya Dawn Ascent',
}

export const experienceThemeFallbacks: Record<string, string> = {
  'The Sigiriya Dawn Ascent': 'Heritage & Memory',
  'A Private Tea Estate, Locked Before Dawn': 'Rail & Landscape',
  'Shared History, Quietly Read': DISCOVERY_WORLD_NAMES.sharedHeritage,
  'The Leopard Research Circuit': 'Wildlife & Wilderness',
  "The Mirissa Fishermen's Dawn": 'Ocean & Discovery',
  'A Private Kandyan Dance Rehearsal': 'Culture & Human Connection',
  'The Deep-Water Hour': 'Ocean & Discovery',
  'Sacred Fire, Private Vantage': 'Culture & Human Connection',
  'The Ancient Grammar of Healing': 'Wellness & Restoration',
  'Sinharaja at First Light': 'Wellness & Restoration',
}

export const experienceRegionFallbacks: Record<string, string> = {
  'The Sigiriya Dawn Ascent': 'Cultural Triangle',
  'A Private Tea Estate, Locked Before Dawn': 'Hill Country',
  'Shared History, Quietly Read': 'Hill Country',
  'The Leopard Research Circuit': 'South Coast',
  "The Mirissa Fishermen's Dawn": 'South Coast',
  'A Private Kandyan Dance Rehearsal': 'Hill Country',
  'The Deep-Water Hour': 'South Coast',
  'Sacred Fire, Private Vantage': 'Hill Country',
  'The Ancient Grammar of Healing': 'West Coast',
  'Sinharaja at First Light': 'West Coast',
}

const regionSignals: Array<{ region: string; signals: string[] }> = [
  {
    region: 'South Coast',
    signals: [
      'south coast',
      'southern coast',
      'southern province',
      'mirissa',
      'galle',
      'galle fort',
      'weligama',
      'tangalle',
      'yala',
    ],
  },
  {
    region: 'Wild South',
    signals: ['wild south', 'deep south', 'yala', 'bundala', 'rekawa', 'leopard country', 'dry-zone wilderness'],
  },
  {
    region: 'East Coast',
    signals: ['east coast', 'eastern coast', 'trincomalee', 'pasikuda', 'nilaveli', 'arugam bay'],
  },
  {
    region: 'Hill Country',
    signals: [
      'hill country',
      'hill province',
      'kandy',
      'nuwara eliya',
      'ella',
      'hatton',
      'tea country',
      'nine arches',
      'hakgala',
      'badulla',
      'peradeniya',
    ],
  },
  {
    region: 'Cultural Triangle',
    signals: ['cultural triangle', 'central province', 'sigiriya', 'anuradhapura', 'polonnaruwa', 'dambulla'],
  },
  {
    region: 'West Coast',
    signals: [
      'west coast & colombo',
      'west coast',
      'western coast',
      'colombo',
      'colombo fort',
      'galle face',
      'negombo',
      'kalpitiya',
      'bentota',
      'sinharaja',
    ],
  },
  {
    region: 'The North',
    signals: ['the north', 'northern peninsula', 'northern province', 'jaffna', 'nallur', 'delft island', 'point pedro'],
  },
]

function normalize(value: string) {
  return value.toLowerCase()
}

export function inferJourneyRegion(item: Pick<JourneyItem, 'kind' | 'label' | 'detail' | 'source' | 'parentRegion'>) {
  if (item.kind === 'experience' && experienceRegionFallbacks[item.label]) {
    return experienceRegionFallbacks[item.label]
  }

  if (item.parentRegion) {
    return item.parentRegion
  }

  if (item.kind === 'region') {
    return item.label
  }

  const searchableText = normalize([item.label, item.detail, item.source].filter(Boolean).join(' '))
  if (searchableText.includes('sinharaja')) {
    return 'West Coast'
  }

  return regionSignals.find(({ signals }) => signals.some((signal) => searchableText.includes(signal)))?.region
}

export function inferJourneyTheme(item: Pick<JourneyItem, 'kind' | 'label' | 'parentTheme'>) {
  if (item.kind === 'experience' && experienceThemeFallbacks[item.label]) {
    return experienceThemeFallbacks[item.label]
  }

  if (item.parentTheme) {
    return item.parentTheme
  }

  if (item.kind === 'theme') {
    return item.label
  }

  if (item.kind === 'destination') {
    return destinationDiscoveryWorlds[item.label]?.primary
  }

  return undefined
}

export function getDestinationDiscoveryWorlds(destination: string) {
  return destinationDiscoveryWorlds[destination]
}

/**
 * Designed Trips originally stored a single theme flat on the item. They now
 * hold a `segments` list so one package can carry several themes. Carts saved
 * before that change are upgraded here on load, so an older saved journey
 * cannot reach the UI without its segments.
 */
function migrateDesignedTrip(item: JourneyItem): JourneyItem {
  const trip = item.designedTrip
  if (!trip) return item
  if (Array.isArray(trip.segments)) return item

  // The pre-segments shape, read loosely since it is no longer a known type.
  const legacy = trip as unknown as Record<string, unknown>
  const themeTitle = typeof legacy.themeTitle === 'string' ? legacy.themeTitle : ''

  return {
    ...item,
    designedTrip: {
      packageName: trip.packageName ?? '',
      packageDuration: trip.packageDuration ?? '',
      packagePrice: typeof trip.packagePrice === 'number' ? trip.packagePrice : 0,
      segments: themeTitle
        ? [
            {
              themeTitle,
              subPackageName: typeof legacy.subPackageName === 'string' ? legacy.subPackageName : '',
              subPackageDays: typeof legacy.subPackageDays === 'number' ? legacy.subPackageDays : 0,
              subPackageCoverage:
                typeof legacy.subPackageCoverage === 'string' ? legacy.subPackageCoverage : '',
              subPackagePriceAdd:
                typeof legacy.subPackagePriceAdd === 'number' ? legacy.subPackagePriceAdd : 0,
              hotel: typeof legacy.hotel === 'string' ? legacy.hotel : '',
              activities: Array.isArray(legacy.activities) ? (legacy.activities as string[]) : [],
              inclusions: Array.isArray(legacy.inclusions) ? (legacy.inclusions as string[]) : [],
            },
          ]
        : [],
    },
  }
}

export function normalizeJourneyItem(rawItem: JourneyItem): JourneyItem {
  const item = migrateDesignedTrip(rawItem)

  if (item.kind === 'experience') {
    return {
      ...item,
      parentTheme: inferJourneyTheme(item),
      parentRegion: inferJourneyRegion(item),
    }
  }

  if (item.kind === 'region' && item.parentTheme) {
    const isExperienceAncestor =
      item.detail?.startsWith('A region shaping') || item.detail?.startsWith('A regional setting')

    if (!isExperienceAncestor) {
      const directRegionItem = { ...item }
      delete directRegionItem.parentTheme
      return directRegionItem
    }
  }

  return item
}
