import type { JourneyItem } from '../journey/JourneyContext'
import { getRegionEditorialName, REGION_RHYTHM_ORDER } from '../journey/journeyRegionCatalog'
import { normalizeRegionLabel } from '../journey/savedJourneyDisplay'
import {
  orderDestinationIdsEditorially,
  resolveSavedDestinationIds,
  resolveSavedRegionIds,
} from '../journey/savedPlaceResolution'
import {
  adaptCatalogExperience,
  adaptRegionDestination,
  buildDestinationsFromRegions,
  buildExperiencesFromCatalog,
  findCatalogDestinationById,
  findRegionForDestinationId,
} from '../data/journey/adapters'
import { mockJourneyRhythms } from '../data/journey/mockJourneyRhythms'
import { mockSignatureJourneys } from '../data/journey/mockSignatureJourneys'
import { mockRecommendations } from '../data/journey/mockRecommendations'
import { mockTravelConnections } from '../data/journey/mockTravelConnections'
import {
  ILLUSTRATIVE_DISCLAIMER,
  ITINERARY_DISCLAIMER,
} from '../data/journey/mockJourneyTypes'
import type {
  Destination,
  IllustrativeItinerary,
  ItineraryInput,
  JourneyExperience,
  Recommendation,
  RecommendationInput,
  SignatureJourney,
  SuggestedJourneyRhythm,
  SuggestedRhythmResult,
  TravelConnection,
} from '../data/journey/types'

export interface JourneyRepository {
  getDestinations(): Promise<Destination[]>
  getDestinationById(id: string): Promise<Destination | undefined>
  getExperiences(): Promise<JourneyExperience[]>
  getExperiencesForDestination(destinationId: string): Promise<JourneyExperience[]>
  getRecommendations(input: RecommendationInput): Promise<Recommendation[]>
  getTravelConnection(fromId: string, toId: string): Promise<TravelConnection | undefined>
  getTravelConnectionsForDestinations(destinationIds: string[]): Promise<TravelConnection[]>
  getSuggestedRhythm(savedItemIds: string[], contextItems?: JourneyItem[]): Promise<SuggestedRhythmResult | undefined>
  getJourneyRhythms(): Promise<SuggestedJourneyRhythm[]>
  getJourneyRhythmById(id: string): Promise<SuggestedJourneyRhythm | undefined>
  generateIllustrativeItinerary(input: ItineraryInput, contextItems?: JourneyItem[]): Promise<IllustrativeItinerary | undefined>
  getSignatureJourneysForTheme(themeId: string): Promise<SignatureJourney[]>
}

const REGION_SEGMENT_SUMMARIES: Record<string, string> = {
  'The Western Gateway': 'Arrive, settle in, and begin at the island’s western edge.',
  'The Southern Arc': 'Coastal heritage, time to linger, and a gentler close to the journey.',
  'The Hill Country': 'A slower rhythm through tea country, rail, and landscape.',
  'The Ancient Kingdoms': 'Cultural depth among ruins, rock fortresses, and ancient landscapes.',
  'The East Coast': 'Quieter shores and a different seasonal rhythm along the eastern edge.',
  'The Wild South': 'Wild terrain, early mornings, and landscapes that reward patience.',
  'The Northern Reaches': 'A more remote reading of the island’s northern peninsula.',
}

function slugify(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-')
}

function matchRhythmToSavedItems(
  savedDestinationIds: string[],
  savedRegionIds: string[],
): SuggestedJourneyRhythm | undefined {
  if (savedDestinationIds.length === 0 && savedRegionIds.length === 0) {
    return undefined
  }

  let bestMatch: SuggestedJourneyRhythm | undefined
  let bestScore = 0

  mockJourneyRhythms.forEach((rhythm) => {
    const destinationMatches = rhythm.destinationIds.filter((id) => savedDestinationIds.includes(id)).length
    const rhythmRegionIds = rhythm.destinationIds
      .map((id) => findRegionForDestinationId(id)?.id)
      .filter((id): id is string => Boolean(id))
    const regionMatches = rhythmRegionIds.filter((id) => savedRegionIds.includes(id)).length
    const score = destinationMatches * 2 + regionMatches

    if (score > bestScore) {
      bestScore = score
      bestMatch = rhythm
    }
  })

  return bestScore >= 2 ? bestMatch : undefined
}

function buildRhythmFromSavedRegions(regionIds: string[]): SuggestedRhythmResult | undefined {
  if (regionIds.length < 2) {
    return undefined
  }

  const ordered = REGION_RHYTHM_ORDER.filter((id) => regionIds.includes(id)).map((id) =>
    getRegionEditorialName(id),
  )

  if (ordered.length < 2) {
    return undefined
  }

  return {
    sequence: ordered,
    summary: 'A considered beginning, ready to be refined privately.',
    isIllustrative: true,
  }
}

function buildItinerarySegments(regionNames: string[]): IllustrativeItinerary['segments'] {
  const daysPerRegion = Math.max(2, Math.floor(14 / Math.max(regionNames.length, 1)))
  let dayStart = 1

  return regionNames.map((regionName) => {
    const dayEnd = dayStart + daysPerRegion - 1
    const dayLabel = dayStart === dayEnd ? `Day ${dayStart}` : `Days ${dayStart}–${dayEnd}`
    dayStart = dayEnd + 1

    return {
      dayLabel,
      regionName,
      summary: REGION_SEGMENT_SUMMARIES[regionName] ?? 'Time to settle into this chapter of the island.',
    }
  })
}

class MockJourneyRepository implements JourneyRepository {
  private destinations = buildDestinationsFromRegions()
  private experiences = buildExperiencesFromCatalog()

  async getDestinations(): Promise<Destination[]> {
    return this.destinations
  }

  async getDestinationById(id: string): Promise<Destination | undefined> {
    return this.destinations.find((destination) => destination.id === id)
  }

  async getExperiences(): Promise<JourneyExperience[]> {
    return this.experiences
  }

  async getExperiencesForDestination(destinationId: string): Promise<JourneyExperience[]> {
    return this.experiences.filter((experience) => experience.destinationId === destinationId)
  }

  async getRecommendations(input: RecommendationInput): Promise<Recommendation[]> {
    const limit = input.limit ?? 4
    return mockRecommendations
      .filter(
        (recommendation) =>
          recommendation.sourceType === input.sourceType && recommendation.sourceId === input.sourceId,
      )
      .slice(0, limit)
  }

  async getTravelConnection(fromId: string, toId: string): Promise<TravelConnection | undefined> {
    return mockTravelConnections.find(
      (connection) =>
        connection.fromDestinationId === fromId && connection.toDestinationId === toId,
    )
  }

  async getTravelConnectionsForDestinations(destinationIds: string[]): Promise<TravelConnection[]> {
    if (destinationIds.length < 2) {
      return []
    }

    const orderedIds = orderDestinationIdsEditorially(destinationIds)
    const connections: TravelConnection[] = []
    for (let index = 0; index < orderedIds.length - 1; index += 1) {
      const fromId = orderedIds[index]
      const toId = orderedIds[index + 1]
      const connection =
        (await this.getTravelConnection(fromId, toId)) ??
        (await this.getTravelConnection(toId, fromId))
      if (connection) {
        connections.push(connection)
      }
    }
    return connections
  }

  async getSuggestedRhythm(
    savedItemIds: string[],
    contextItems?: JourneyItem[],
  ): Promise<SuggestedRhythmResult | undefined> {
    const items =
      contextItems ??
      savedItemIds.map((id) => ({ id, kind: 'destination' as const, label: id }))
    const savedDestinationIds = resolveSavedDestinationIds(items)
    const savedRegionIds = resolveSavedRegionIds(items)

    const matchedRhythm = matchRhythmToSavedItems(savedDestinationIds, savedRegionIds)
    if (matchedRhythm) {
      const sequence = matchedRhythm.destinationIds
        .map((id) => {
          const regionName = this.destinations.find((destination) => destination.id === id)?.regionName
          return regionName ? normalizeRegionLabel(regionName) : undefined
        })
        .filter((name, index, array): name is string => Boolean(name) && array.indexOf(name) === index)

      if (sequence.length >= 2) {
        return {
          sequence,
          summary: matchedRhythm.summary,
          rhythmId: matchedRhythm.id,
          isIllustrative: true,
        }
      }
    }

    return buildRhythmFromSavedRegions(savedRegionIds)
  }

  async getJourneyRhythms(): Promise<SuggestedJourneyRhythm[]> {
    return mockJourneyRhythms
  }

  async getJourneyRhythmById(id: string): Promise<SuggestedJourneyRhythm | undefined> {
    return mockJourneyRhythms.find((rhythm) => rhythm.id === id)
  }

  async generateIllustrativeItinerary(
    input: ItineraryInput,
    contextItems?: JourneyItem[],
  ): Promise<IllustrativeItinerary | undefined> {
    if (input.rhythmId) {
      const rhythm = await this.getJourneyRhythmById(input.rhythmId)
      if (rhythm) {
        const regionNames = rhythm.destinationIds
          .map((id) => this.destinations.find((destination) => destination.id === id)?.regionName)
          .filter((name, index, array): name is string => Boolean(name) && array.indexOf(name) === index)

        if (regionNames.length >= 2) {
          return {
            id: `itinerary-${rhythm.id}`,
            segments: buildItinerarySegments(regionNames),
            isIllustrative: true,
            note: ITINERARY_DISCLAIMER,
          }
        }
      }
    }

    const regionIds = input.regionIds ?? resolveSavedRegionIds(contextItems ?? [])
    if (regionIds.length < 2) {
      const items = contextItems ?? []
      const destinationIds = resolveSavedDestinationIds(items)
      destinationIds.forEach((id) => {
        const region = findRegionForDestinationId(id)
        if (region && !regionIds.includes(region.id)) {
          regionIds.push(region.id)
        }
      })
    }

    const orderedRegionNames = REGION_RHYTHM_ORDER.filter((id) => regionIds.includes(id)).map((id) =>
      getRegionEditorialName(id),
    )

    if (orderedRegionNames.length < 2) {
      return undefined
    }

    return {
      id: `itinerary-${orderedRegionNames.map(slugify).join('-')}`,
      segments: buildItinerarySegments(orderedRegionNames),
      isIllustrative: true,
      note: ITINERARY_DISCLAIMER,
    }
  }

  async getSignatureJourneysForTheme(themeId: string): Promise<SignatureJourney[]> {
    return mockSignatureJourneys.filter((journey) => journey.themeIds.includes(themeId))
  }
}

export const journeyRepository: JourneyRepository = new MockJourneyRepository()

export { ILLUSTRATIVE_DISCLAIMER, ITINERARY_DISCLAIMER }

export function resolveDestinationFromJourneyItem(item: JourneyItem): Destination | undefined {
  const destinations = buildDestinationsFromRegions()
  if (item.kind === 'destination') {
    return destinations.find((destination) => destination.name === item.label)
  }
  return undefined
}

export function getDestinationCoordinates(destinationIds: string[]): [number, number][] {
  return destinationIds
    .map((id) => findCatalogDestinationById(id)?.destination.coordinates)
    .filter((coords): coords is [number, number] => Boolean(coords))
}

export function adaptSavedItemsToRepositoryInput(items: JourneyItem[]): {
  savedItemIds: string[]
  regionIds: string[]
  destinationIds: string[]
} {
  const destinationIds = orderDestinationIdsEditorially(resolveSavedDestinationIds(items))
  return {
    savedItemIds: items.map((item) => item.id),
    regionIds: resolveSavedRegionIds(items),
    destinationIds,
  }
}

export { orderDestinationIdsEditorially, resolveSavedDestinationIds, resolveSavedRegionIds }

// Re-export adapters for components that need catalog → journey mapping
export { adaptRegionDestination, adaptCatalogExperience, findCatalogDestinationById }
