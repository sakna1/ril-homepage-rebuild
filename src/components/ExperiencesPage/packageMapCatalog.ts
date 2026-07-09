import { journeyThemes } from '../../data/journeyConsultation'
import { journeyRegions, type JourneyRegion, type RegionDestination } from '../../data/journeyRegions'
import { sharedHeritageWorld } from '../../journey/discoveryWorlds'
import { getThemeTitleForId } from '../../journey/journeyRegionCatalog'

export type PackageThemeTitle =
  | 'Wildlife & Wilderness'
  | 'Ocean & Discovery'
  | 'Heritage & Memory'
  | 'Wellness & Restoration'
  | 'Rail & Landscape'
  | 'Culture & Human Connection'
  | typeof sharedHeritageWorld.name

export type PackagePlace = {
  destination: RegionDestination
  region: JourneyRegion
  encounterIds: string[]
  isPrimary: boolean
}

/** Encounter article → primary destination for map focus. */
export const encounterDestinationIds: Record<string, string> = {
  'sigiriya-dawn-ascent': 'sigiriya',
  'private-tea-estate': 'nuwara-eliya',
  'shared-heritage-quietly-read': 'colombo',
  'leopard-research-circuit': 'yala',
  'mirissa-fishermens-dawn': 'mirissa',
  'kandyan-dance-rehearsal': 'kandy',
  'deep-water-hour': 'mirissa',
  'sacred-fire-private-vantage': 'kandy',
  'ancient-grammar-of-healing': 'belihuloya',
}

/** Curated companion places that complete each theme-as-package constellation. */
const themeCompanionDestinationIds: Record<string, string[]> = {
  'wildlife-wilderness': ['yala', 'belihuloya', 'adams-peak'],
  'ocean-discovery': ['mirissa', 'tangalle', 'rekawa', 'hiriketiya', 'trincomalee', 'nilaveli'],
  'heritage-memory': ['sigiriya', 'anuradhapura', 'polonnaruwa', 'galle-fort'],
  'wellness-restoration': ['belihuloya', 'bentota', 'nuwara-eliya', 'tangalle'],
  'rail-landscape': ['nuwara-eliya', 'ella', 'haputale', 'bandarawela'],
  'culture-human-connection': ['kandy', 'colombo', 'jaffna', 'galle-fort'],
  [sharedHeritageWorld.id]: ['colombo', 'nuwara-eliya', 'galle-fort', 'ella'],
}

const destinationsById = new Map<string, { destination: RegionDestination; region: JourneyRegion }>()

for (const region of journeyRegions) {
  const isRomantic = region.id.startsWith('romantic-')
  for (const destination of region.destinations) {
    const existing = destinationsById.get(destination.id)
    if (!existing || (existing.region.id.startsWith('romantic-') && !isRomantic)) {
      destinationsById.set(destination.id, { destination, region })
    }
  }
}

export function themeTitleToId(theme: PackageThemeTitle): string {
  if (theme === sharedHeritageWorld.name) {
    return sharedHeritageWorld.id
  }

  const matched = journeyThemes.find((entry) => entry.title === theme)
  return matched?.id ?? theme.toLowerCase().replace(/[^a-z0-9]+/g, '-')
}

export function themeIdToTitle(themeId: string): PackageThemeTitle | undefined {
  const title = getThemeTitleForId(themeId)
  return title as PackageThemeTitle | undefined
}

export function resolveDestinationRef(destinationId: string) {
  return destinationsById.get(destinationId)
}

export function getPackagePlacesForTheme(
  theme: PackageThemeTitle,
  encounterIdsByDestination: Record<string, string[]> = {},
  primaryDestinationId?: string,
): PackagePlace[] {
  const themeId = themeTitleToId(theme)
  const companionIds = themeCompanionDestinationIds[themeId] ?? []
  const orderedIds = [
    ...(primaryDestinationId ? [primaryDestinationId] : []),
    ...companionIds.filter((id) => id !== primaryDestinationId),
  ]

  const uniqueIds = [...new Set(orderedIds)]

  return uniqueIds.flatMap((destinationId) => {
    const ref = destinationsById.get(destinationId)
    if (!ref) {
      return []
    }

    return [
      {
        destination: ref.destination,
        region: ref.region,
        encounterIds: encounterIdsByDestination[destinationId] ?? [],
        isPrimary: destinationId === primaryDestinationId,
      },
    ]
  })
}

export function getEncounterPackageContext(encounterId: string, theme: PackageThemeTitle) {
  const primaryDestinationId = encounterDestinationIds[encounterId]
  const encounterIdsByDestination: Record<string, string[]> = {}

  for (const [id, destinationId] of Object.entries(encounterDestinationIds)) {
    if (!encounterIdsByDestination[destinationId]) {
      encounterIdsByDestination[destinationId] = []
    }
    encounterIdsByDestination[destinationId].push(id)
  }

  const places = getPackagePlacesForTheme(theme, encounterIdsByDestination, primaryDestinationId)
  const focused =
    places.find((place) => place.destination.id === primaryDestinationId) ?? places[0] ?? null

  return {
    themeId: themeTitleToId(theme),
    theme,
    places,
    focused,
  }
}
