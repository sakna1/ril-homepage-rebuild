import type { JourneyRegion } from './journeyRegions'

const SHARED_HERITAGE_THEME_ID = 'shared-heritage'
const SHARED_HERITAGE_RELATED_THEMES = ['heritage-memory', 'culture-human-connection'] as const

function regionSupportsTheme(metadata: JourneyRecommendationMetadata, themeId: string): boolean {
  if (themeId === SHARED_HERITAGE_THEME_ID) {
    return SHARED_HERITAGE_RELATED_THEMES.some((relatedId) => metadata.journeyThemes.includes(relatedId))
  }
  return metadata.journeyThemes.includes(themeId)
}

export type JourneyTheme = {
  id: string
  iconLabel: string
  title: string
  description: string
}

export type JourneySeason = {
  id: string
  label: string
  description: string
  highlights: string[]
}

export type JourneyConsultationSelection = {
  themeId?: string
  /** When multiple Discovery Worlds are selected, all are considered. */
  themeIds?: string[]
  mood?: string
  seasonId?: string
}

function getSelectionThemeIds(selection: JourneyConsultationSelection): string[] {
  if (selection.themeIds && selection.themeIds.length > 0) {
    return selection.themeIds
  }
  if (selection.themeId) {
    return [selection.themeId]
  }
  return []
}

export type JourneyRecommendationMetadata = {
  journeyThemes: string[]
  journeyMoods: string[]
  bestTimeOptions: string[]
  suggestedExperiences: string[]
  recommendationReason: string
}

export type DestinationRecommendationMetadata = JourneyRecommendationMetadata & {
  journeyRegion: string
  nearby: string[]
}

export type JourneyRecommendation = {
  whyWeChoseThis: string
  regions: JourneyRegion[]
  suggestedExperiences: string[]
}

export const journeyThemes: JourneyTheme[] = [
  {
    id: 'wildlife-wilderness',
    iconLabel: 'W',
    title: 'Wildlife & Wilderness',
    description: 'Leopard country, birdlife, wild coastlines and expert naturalist-led encounters.',
  },
  {
    id: 'ocean-discovery',
    iconLabel: 'O',
    title: 'Ocean & Discovery',
    description:
      'Quiet coastlines, private sailing, hidden beaches and encounters with the Indian Ocean.',
  },
  {
    id: 'heritage-memory',
    iconLabel: 'H',
    title: 'Heritage & Memory',
    description: 'Ancient kingdoms, sacred cities, fort walls and stories held in stone and ritual.',
  },
  {
    id: 'wellness-restoration',
    iconLabel: 'R',
    title: 'Wellness & Restoration',
    description: 'Slow mornings, Ayurveda, private villas, garden quiet and restorative island rhythm.',
  },
  {
    id: 'rail-landscape',
    iconLabel: 'L',
    title: 'Rail & Landscape',
    description: 'Tea country, mountain railways, waterfalls and the romance of moving slowly.',
  },
  {
    id: 'culture-human-connection',
    iconLabel: 'C',
    title: 'Culture & Human Connection',
    description: 'Temple life, local tables, craft, ceremony and thoughtful privately guided context.',
  },
]

export const journeyMoods = [
  'Romantic',
  'Adventure',
  'Reflection',
  'Luxury',
  'Celebration',
  'Family',
  'Photography',
  'Wellness',
  'Culture',
  'Slow Travel',
]

export const journeySeasons: JourneySeason[] = [
  {
    id: 'november-april',
    label: 'November - April',
    description: 'The classic south and west coast season, with calmer seas and golden beach days.',
    highlights: ['Southern Coast', 'West Coast', 'Whale Watching', 'Luxury Sailing', 'Private Beaches'],
  },
  {
    id: 'april-september',
    label: 'April - September',
    description: 'The eastern and northern season, opening luminous bays and summer coastal journeys.',
    highlights: ['East Coast', 'Arugam Bay', 'Trincomalee', 'Pasikudah', 'Surfing'],
  },
  {
    id: 'shoulder-season',
    label: 'Shoulder Season',
    description: 'A softer in-between period for travellers who value atmosphere over predictability.',
    highlights: ['Tea Country', 'Ancient Cities', 'Garden Villas', 'Quiet Coastlines'],
  },
  {
    id: 'year-round',
    label: 'Year Round',
    description: 'Flexible journeys designed around hosting, culture, wellness and carefully chosen timing.',
    highlights: ['Colombo', 'Kandy', 'Cultural Triangle', 'Wellness Retreats'],
  },
]

const coastalRomance = {
  journeyThemes: ['ocean-discovery', 'wellness-restoration'],
  journeyMoods: ['Romantic', 'Luxury', 'Celebration', 'Photography', 'Wellness', 'Slow Travel'],
  bestTimeOptions: ['november-april', 'shoulder-season'],
  suggestedExperiences: ['Private Sailing', 'Whale Encounters', 'Beach Dining', 'Luxury Villas'],
  recommendationReason:
    "Because your answers point toward Sri Lanka's softer coastal season, where private villas, quieter beaches, sailing and ocean encounters are at their best.",
}

const hillCountry = {
  journeyThemes: ['rail-landscape', 'wellness-restoration', 'culture-human-connection'],
  journeyMoods: ['Romantic', 'Reflection', 'Photography', 'Wellness', 'Slow Travel', 'Culture'],
  bestTimeOptions: ['november-april', 'shoulder-season', 'year-round'],
  suggestedExperiences: ['Scenic Rail', 'Tea Tasting', 'Mountain Picnics', 'Waterfall Walks'],
  recommendationReason:
    'Because your answers lean toward mist, tea country and the romance of travelling slowly through the hills.',
}

const culturalTriangle = {
  journeyThemes: ['heritage-memory', 'culture-human-connection'],
  journeyMoods: ['Reflection', 'Culture', 'Photography', 'Luxury', 'Family'],
  bestTimeOptions: ['april-september', 'november-april', 'year-round'],
  suggestedExperiences: ['Private Archaeology', 'Sunrise Climbs', 'Ancient Gardens', 'Village Breakfasts'],
  recommendationReason:
    'Because your answers call for depth, sacred architecture and privately guided context rather than rushed sightseeing.',
}

const eastCoast = {
  journeyThemes: ['ocean-discovery', 'culture-human-connection', 'wellness-restoration'],
  journeyMoods: ['Romantic', 'Adventure', 'Reflection', 'Family', 'Photography', 'Slow Travel'],
  bestTimeOptions: ['april-september', 'shoulder-season'],
  suggestedExperiences: ['Private Bay Swims', 'Temple Cliffs', 'Snorkelling', 'Eastern Coast Drives'],
  recommendationReason:
    'Because your answers match the eastern season, when clear water, temple cliffs and summer coastlines come into their own.',
}

const northernCulture = {
  journeyThemes: ['heritage-memory', 'culture-human-connection'],
  journeyMoods: ['Reflection', 'Culture', 'Photography', 'Slow Travel'],
  bestTimeOptions: ['april-september', 'year-round'],
  suggestedExperiences: ['Temple Dawn Visits', 'Tamil Table Experiences', 'Island Causeway Drives'],
  recommendationReason:
    'Because your answers suggest a more layered Sri Lanka, shaped by Tamil heritage, northern light and cultural conversation.',
}

const wildSouth = {
  journeyThemes: ['wildlife-wilderness', 'ocean-discovery'],
  journeyMoods: ['Adventure', 'Luxury', 'Family', 'Photography'],
  bestTimeOptions: ['april-september', 'shoulder-season'],
  suggestedExperiences: ['Private Leopard Drives', 'Naturalist Guiding', 'Wild Coast Sundowners'],
  recommendationReason:
    'Because your answers point toward wilderness, animal movement and dramatic dry-zone landscapes with expert private guiding.',
}

const westernGateway = {
  journeyThemes: ['culture-human-connection', 'wellness-restoration', 'heritage-memory'],
  journeyMoods: ['Luxury', 'Culture', 'Wellness', 'Slow Travel'],
  bestTimeOptions: ['year-round', 'shoulder-season'],
  suggestedExperiences: ['Garden Villa Arrival', 'Private Gallery Walks', 'Hosted Market Tables'],
  recommendationReason:
    'Because your answers benefit from a composed arrival, where Colombo becomes a hosted first chapter rather than a transit point.',
}

export const regionRecommendationMetadata: Record<string, JourneyRecommendationMetadata> = {
  'southern-coast': coastalRomance,
  'romantic-western-southern-provinces': {
    ...coastalRomance,
    suggestedExperiences: ['Private Sailing', 'Whale Encounters', 'Beach Dining', 'Sunset Cruises'],
  },
  'hill-country': hillCountry,
  'romantic-central-province': hillCountry,
  'romantic-uva-province': hillCountry,
  'cultural-triangle': culturalTriangle,
  'central-highlands': {
    ...culturalTriangle,
    journeyThemes: ['heritage-memory', 'culture-human-connection', 'wellness-restoration'],
    suggestedExperiences: ['Temple Bell Evenings', 'Botanical Garden Walks', 'Kandyan Performance'],
  },
  'romantic-sabaragamuwa-province': {
    ...hillCountry,
    journeyThemes: ['rail-landscape', 'wildlife-wilderness', 'wellness-restoration'],
    journeyMoods: ['Romantic', 'Adventure', 'Reflection', 'Wellness'],
    suggestedExperiences: ['Pilgrim Trail Sunrise', 'Canoe Valley Mornings', 'Gentle Trekking'],
  },
  'east-coast': eastCoast,
  'romantic-eastern-province': eastCoast,
  'northern-peninsula': northernCulture,
  'romantic-northern-province': northernCulture,
  'wild-south': wildSouth,
  'romantic-wild-south': wildSouth,
  'western-gateway': westernGateway,
}

const destinationAliases: Record<string, string> = {
  'mirissa-romantic': 'mirissa',
  'tangalle-romantic': 'tangalle',
  'ella-romantic-central': 'ella',
  'ella-romantic-uva': 'ella',
  'nuwara-eliya-romantic': 'nuwara-eliya',
  'haputale-romantic': 'haputale',
  'kandy-romantic': 'kandy',
  'trincomalee-romantic': 'trincomalee',
  'jaffna-romantic': 'jaffna',
  'yala-romantic': 'yala',
  'galle-fort': 'galle',
  'arugam-bay-romantic': 'arugam-bay',
}

export const destinationRecommendationMetadata: Record<string, DestinationRecommendationMetadata> = {
  mirissa: {
    ...coastalRomance,
    journeyThemes: ['ocean-discovery', 'wellness-restoration'],
    journeyMoods: ['Romantic', 'Luxury', 'Photography'],
    journeyRegion: 'Southern Coast',
    nearby: ['Weligama', 'Tangalle', 'Galle'],
    suggestedExperiences: ['Whale Watching', 'Private Sailing', 'Beach Dining'],
  },
  tangalle: {
    ...coastalRomance,
    journeyMoods: ['Romantic', 'Reflection', 'Luxury', 'Wellness'],
    journeyRegion: 'Southern Coast',
    nearby: ['Rekawa', 'Mawella', 'Hiriketiya'],
  },
  rekawa: {
    ...coastalRomance,
    journeyMoods: ['Romantic', 'Reflection', 'Wellness', 'Slow Travel'],
    journeyRegion: 'Southern Coast',
    nearby: ['Tangalle', 'Mawella'],
    suggestedExperiences: ['Turtle Coast Evenings', 'Lagoon Walks', 'Private Beach Suppers'],
  },
  ella: {
    ...hillCountry,
    journeyRegion: 'Hill Country',
    nearby: ['Haputale', 'Nuwara Eliya', 'Bandarawela'],
  },
  sigiriya: {
    ...culturalTriangle,
    journeyRegion: 'Cultural Triangle',
    nearby: ['Dambulla', 'Polonnaruwa', 'Anuradhapura'],
  },
  trincomalee: {
    ...eastCoast,
    journeyRegion: 'East Coast',
    nearby: ['Nilaveli', 'Pasikudah'],
  },
  yala: {
    ...wildSouth,
    journeyRegion: 'Wild South',
    nearby: ['Kataragama', 'Bundala', 'Tangalle'],
  },
  colombo: {
    ...westernGateway,
    journeyRegion: 'Western Gateway',
    nearby: ['Negombo', 'Bentota', 'Galle'],
  },
}

export const getRegionRecommendationMetadata = (regionId: string) =>
  regionRecommendationMetadata[regionId]

export const getDestinationRecommendationMetadata = (
  destinationId: string,
  journeyRegion: string,
): DestinationRecommendationMetadata => {
  const canonicalId = destinationAliases[destinationId] ?? destinationId
  const metadata = destinationRecommendationMetadata[canonicalId]

  return (
    metadata ?? {
      journeyThemes: ['culture-human-connection'],
      journeyMoods: ['Culture', 'Slow Travel'],
      bestTimeOptions: ['year-round'],
      journeyRegion,
      nearby: [],
      suggestedExperiences: [],
      recommendationReason:
        'Because this destination can be shaped around hosted context, thoughtful timing and the wider mood of the journey.',
    }
  )
}

const scoreSelection = (
  metadata: JourneyRecommendationMetadata | undefined,
  selection: JourneyConsultationSelection,
) => {
  if (!metadata) {
    return 0
  }

  const themeIds = getSelectionThemeIds(selection)
  const themeScore = themeIds.filter((themeId) => regionSupportsTheme(metadata, themeId)).length * 5

  return (
    themeScore +
    (selection.mood && metadata.journeyMoods.includes(selection.mood) ? 3 : 0) +
    (selection.seasonId && metadata.bestTimeOptions.includes(selection.seasonId) ? 3 : 0)
  )
}

export const getRecommendedRegions = (
  regions: JourneyRegion[],
  selection: JourneyConsultationSelection,
) => {
  const themeIds = getSelectionThemeIds(selection)
  const hasSelection = themeIds.length > 0 || Boolean(selection.mood || selection.seasonId)

  if (!hasSelection) {
    return []
  }

  const scored = regions
    .map((region) => ({
      region,
      metadata: getRegionRecommendationMetadata(region.id),
      score: scoreSelection(getRegionRecommendationMetadata(region.id), selection),
    }))
    .filter(({ score }) => score > 0)
    .sort((left, right) => right.score - left.score)

  if (scored.length === 0) {
    return []
  }

  const selected: JourneyRegion[] = []
  const coveredThemes = new Set<string>()

  // Prefer a coherent, diverse set that reflects multiple selected worlds.
  for (const entry of scored) {
    if (selected.length >= 4) {
      break
    }

    const introducesNewTheme =
      themeIds.length <= 1 ||
      themeIds.some(
        (themeId) =>
          entry.metadata && regionSupportsTheme(entry.metadata, themeId) && !coveredThemes.has(themeId),
      )

    if (selected.length < 2 || introducesNewTheme || selected.length < 3) {
      selected.push(entry.region)
      themeIds.forEach((themeId) => {
        if (entry.metadata && regionSupportsTheme(entry.metadata, themeId)) {
          coveredThemes.add(themeId)
        }
      })
    }
  }

  if (selected.length < 2) {
    for (const entry of scored) {
      if (selected.some((region) => region.id === entry.region.id)) {
        continue
      }
      selected.push(entry.region)
      if (selected.length >= 2) {
        break
      }
    }
  }

  return selected.slice(0, 4)
}

export const getJourneyRecommendation = (
  regions: JourneyRegion[],
  selection: JourneyConsultationSelection,
): JourneyRecommendation | undefined => {
  const recommendedRegions = getRecommendedRegions(regions, selection)

  if (!recommendedRegions.length) {
    return undefined
  }

  const themeIds = getSelectionThemeIds(selection)
  const selectedThemeTitles = themeIds
    .map((themeId) => {
      if (themeId === SHARED_HERITAGE_THEME_ID) {
        return 'Shared History'
      }
      return journeyThemes.find((theme) => theme.id === themeId)?.title
    })
    .filter((title): title is string => Boolean(title))
  const selectedSeason = journeySeasons.find((season) => season.id === selection.seasonId)
  const suggestedExperiences = Array.from(
    new Set(
      recommendedRegions.flatMap(
        (region) => getRegionRecommendationMetadata(region.id)?.suggestedExperiences ?? [],
      ),
    ),
  ).slice(0, 6)
  const reason =
    recommendedRegions
      .map((region) => getRegionRecommendationMetadata(region.id)?.recommendationReason)
      .find(Boolean) ??
    'Because your answers point toward regions where the journey can be shaped with privacy, timing and a strong sense of place.'

  const themePhrase =
    selectedThemeTitles.length === 0
      ? ''
      : selectedThemeTitles.length === 1
        ? selectedThemeTitles[0].toLowerCase()
        : selectedThemeTitles.length === 2
          ? `${selectedThemeTitles[0].toLowerCase()} and ${selectedThemeTitles[1].toLowerCase()}`
          : `${selectedThemeTitles
              .slice(0, -1)
              .map((title) => title.toLowerCase())
              .join(', ')}, and ${selectedThemeTitles[selectedThemeTitles.length - 1].toLowerCase()}`

  return {
    whyWeChoseThis: `${reason}${
      themePhrase && selection.mood && selectedSeason
        ? ` This brings together ${themePhrase} with a ${selection.mood.toLowerCase()} mood during ${selectedSeason.label}.`
        : ''
    }`,
    regions: recommendedRegions,
    suggestedExperiences,
  }
}
