import type { Experience } from '../data/experiences'
import { getRegionRecommendationMetadata } from '../data/journeyConsultation'
import type { JourneyRegion, RegionDestination } from '../data/journeyRegions'
import { experiences, experiencesById } from '../data/experiences'
import { journeyRegions } from '../data/journeyRegions'
import type { JourneyItem } from './JourneyContext'
import {
  createJourneyItemFromDestination,
  createJourneyItemFromExperience,
  createJourneyItemFromRegion,
  toJourneyId,
} from './journeyItemHelpers'
import { getRegionEditorialName } from './journeyRegionCatalog'
import {
  resolveSavedDestinationIds as resolveSavedDestinationIdsShared,
  resolveSavedRegionIds as resolveSavedRegionIdsShared,
} from './savedPlaceResolution'

export type ContextualRecommendationContext = 'destination' | 'region' | 'experience' | 'theme'

export type ContextualRecommendation = {
  id: string
  label: string
  detail: string
  reason: string
  item: JourneyItem
}

export type ContextualRecommendationGroup = {
  primaryHeading: string
  secondaryHeading?: string
  recommendations: ContextualRecommendation[]
}

const allRegions = journeyRegions

function findRegionByDestinationId(destinationId: string): JourneyRegion | undefined {
  return allRegions.find((region) => region.destinations.some((destination) => destination.id === destinationId))
}

function findDestinationByTitle(title: string): { destination: RegionDestination; region: JourneyRegion } | undefined {
  for (const region of allRegions) {
    const destination = region.destinations.find((entry) => entry.title === title)
    if (destination) {
      return { destination, region }
    }
  }
  return undefined
}

function buildRecommendation(
  item: JourneyItem,
  reason: string,
): ContextualRecommendation {
  return {
    id: item.id,
    label: item.label,
    detail: item.detail ?? '',
    reason,
    item,
  }
}

function getNearbyDestinationRecommendations(
  destination: RegionDestination,
  region: JourneyRegion,
  excludedIds: Set<string>,
): ContextualRecommendation[] {
  const recommendations: ContextualRecommendation[] = []

  destination.nearby.forEach((nearbyTitle) => {
    const match = findDestinationByTitle(nearbyTitle)
    if (!match) {
      return
    }
    const item = createJourneyItemFromDestination(match.destination, match.region)
    if (!excludedIds.has(item.id)) {
      recommendations.push(
        buildRecommendation(item, 'A natural continuation from this destination.'),
      )
    }
  })

  region.destinations
    .filter((entry) => entry.id !== destination.id)
    .slice(0, 2)
    .forEach((entry) => {
      const item = createJourneyItemFromDestination(entry, region)
      if (!excludedIds.has(item.id) && !recommendations.some((rec) => rec.id === item.id)) {
        recommendations.push(
          buildRecommendation(item, 'Elsewhere in this rhythm of the island.'),
        )
      }
    })

  return recommendations.slice(0, 4)
}

function getRegionRecommendations(
  region: JourneyRegion,
  excludedIds: Set<string>,
): ContextualRecommendation[] {
  const recommendations: ContextualRecommendation[] = []

  region.destinations.slice(0, 3).forEach((destination) => {
    const item = createJourneyItemFromDestination(destination, region)
    if (!excludedIds.has(item.id)) {
      recommendations.push(
        buildRecommendation(item, 'A place that belongs naturally within this region.'),
      )
    }
  })

  const metadata = getRegionRecommendationMetadata(region.id)
  metadata?.suggestedExperiences.slice(0, 2).forEach((experienceTitle) => {
    const experience = experiences.find((entry) => entry.title === experienceTitle)
    if (!experience) {
      return
    }
    const item = createJourneyItemFromExperience(experience, undefined, region)
    if (!excludedIds.has(item.id)) {
      recommendations.push(
        buildRecommendation(item, 'A complementary encounter within this region.'),
      )
    }
  })

  return recommendations.slice(0, 4)
}

function getExperienceRecommendations(
  experience: Experience,
  destination: RegionDestination | undefined,
  region: JourneyRegion | undefined,
  excludedIds: Set<string>,
): ContextualRecommendation[] {
  const recommendations: ContextualRecommendation[] = []

  experience.relatedExperiences.forEach((experienceId) => {
    const related = experiencesById[experienceId]
    if (!related) {
      return
    }
    const item = createJourneyItemFromExperience(related, destination, region)
    if (!excludedIds.has(item.id)) {
      recommendations.push(
        buildRecommendation(item, 'For a quieter continuation of this direction.'),
      )
    }
  })

  if (destination && region) {
    region.destinations
      .filter((entry) => entry.id !== destination.id)
      .slice(0, 2)
      .forEach((entry) => {
        const item = createJourneyItemFromDestination(entry, region)
        if (!excludedIds.has(item.id) && !recommendations.some((rec) => rec.id === item.id)) {
          recommendations.push(
            buildRecommendation(item, 'Consider adding a nearby destination to deepen the stay.'),
          )
        }
      })
  }

  return recommendations.slice(0, 4)
}

function getThemeRecommendations(themeId: string, excludedIds: Set<string>): ContextualRecommendation[] {
  const recommendations: ContextualRecommendation[] = []

  allRegions
    .filter((region) => {
      const metadata = getRegionRecommendationMetadata(region.id)
      return metadata?.journeyThemes.includes(themeId)
    })
    .slice(0, 3)
    .forEach((region) => {
      const item = createJourneyItemFromRegion(region)
      if (!excludedIds.has(item.id)) {
        recommendations.push(
          buildRecommendation(item, 'A region that resonates with this direction.'),
        )
      }
    })

  return recommendations.slice(0, 4)
}

export function getContextualRecommendations(
  context: ContextualRecommendationContext,
  savedItems: JourneyItem[],
  options: {
    destination?: RegionDestination
    region?: JourneyRegion
    experience?: Experience
    themeId?: string
  },
): ContextualRecommendationGroup | null {
  const excludedIds = new Set(savedItems.map((item) => item.id))

  if (context === 'destination' && options.destination && options.region) {
    return {
      primaryHeading: 'A Natural Continuation',
      secondaryHeading: 'You May Also Be Drawn To',
      recommendations: getNearbyDestinationRecommendations(
        options.destination,
        options.region,
        excludedIds,
      ),
    }
  }

  if (context === 'region' && options.region) {
    return {
      primaryHeading: 'Continue Through the Island',
      secondaryHeading: 'Elsewhere in This Rhythm',
      recommendations: getRegionRecommendations(options.region, excludedIds),
    }
  }

  if (context === 'experience' && options.experience) {
    const resolvedRegion =
      options.region ?? findRegionByDestinationId(options.experience.destinationId)
    const resolvedDestination =
      options.destination ??
      resolvedRegion?.destinations.find((entry) => entry.id === options.experience?.destinationId)

    return {
      primaryHeading: 'Deepen This Direction',
      recommendations: getExperienceRecommendations(
        options.experience,
        resolvedDestination,
        resolvedRegion,
        excludedIds,
      ),
    }
  }

  if (context === 'theme' && options.themeId) {
    return {
      primaryHeading: 'Continue Through the Island',
      recommendations: getThemeRecommendations(options.themeId, excludedIds),
    }
  }

  return null
}

export function itemMatchesSavedFilter(item: JourneyItem, savedIds: Set<string>): boolean {
  return savedIds.has(item.id)
}

export function getSavedRegionIds(savedItems: JourneyItem[], regions: JourneyRegion[]): string[] {
  return resolveSavedRegionIdsShared(savedItems, regions)
}

export function getSavedDestinationIds(savedItems: JourneyItem[], regions: JourneyRegion[]): string[] {
  return resolveSavedDestinationIdsShared(savedItems, regions)
}

export function isItemSaved(savedItems: JourneyItem[], id: string): boolean {
  return savedItems.some((item) => item.id === id)
}

export function getJourneyItemIdForRegion(region: JourneyRegion): string {
  return toJourneyId('region', getRegionEditorialName(region.id))
}

export function getJourneyItemIdForDestination(destination: RegionDestination): string {
  return toJourneyId('destination', destination.title)
}

export function getJourneyItemIdForExperience(experience: Experience): string {
  return toJourneyId('experience', experience.title)
}
