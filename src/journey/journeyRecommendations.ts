import type { JourneyItem } from './JourneyContext'
import { inferJourneyRegion, inferJourneyTheme, regionThemeFallbacks } from './journeyTaxonomy'

type RecommendationSeed = {
  kind: 'destination' | 'experience'
  label: string
  detail: string
  parentRegion: string
  parentTheme?: string
  reason: string
}

export type JourneyRecommendation = RecommendationSeed & {
  id: string
  item: JourneyItem
}

const regionRecommendationSeeds: Record<string, RecommendationSeed[]> = {
  'South Coast': [
    {
      kind: 'destination',
      label: 'Mirissa',
      detail: 'A southern harbour town for dawn fishing rituals, whale water, and a slower coastal rhythm.',
      parentRegion: 'South Coast',
      parentTheme: 'Ocean & Discovery',
      reason: 'Because South Coast is already in your journey.',
    },
    {
      kind: 'destination',
      label: 'Galle Fort',
      detail: 'A layered coastal fort for architecture, private walks, and late-afternoon history beside the sea.',
      parentRegion: 'South Coast',
      parentTheme: 'Heritage & Memory',
      reason: 'A natural cultural counterpoint to the southern coast.',
    },
    {
      kind: 'destination',
      label: 'Weligama',
      detail: 'A gentle bay for surf, sea air, and easy coastal days between Mirissa and Galle.',
      parentRegion: 'South Coast',
      parentTheme: 'Ocean & Discovery',
      reason: 'Often paired with Mirissa for a softer coastal pace.',
    },
    {
      kind: 'destination',
      label: 'Tangalle',
      detail: 'A quieter southern edge for villas, privacy, and longer pauses by the water.',
      parentRegion: 'South Coast',
      parentTheme: 'Wellness & Restoration',
      reason: 'For travellers who want South Coast with more seclusion.',
    },
    {
      kind: 'experience',
      label: 'The Deep-Water Hour',
      detail: 'A private pre-dawn vessel and marine naturalist for the ocean on its own terms.',
      parentRegion: 'South Coast',
      parentTheme: 'Ocean & Discovery',
      reason: 'A deeper ocean thread from the Mirissa coastline.',
    },
  ],
  'East Coast': [
    {
      kind: 'destination',
      label: 'Trincomalee',
      detail: 'A luminous eastern harbour for ocean mornings, temple cliffs, and seasonal calm.',
      parentRegion: 'East Coast',
      parentTheme: 'Ocean & Discovery',
      reason: 'Because East Coast is already in your journey.',
    },
    {
      kind: 'destination',
      label: 'Nilaveli',
      detail: 'A quieter beach base for clear water and unhurried eastern days.',
      parentRegion: 'East Coast',
      parentTheme: 'Wellness & Restoration',
      reason: 'A softer beach rhythm near Trincomalee.',
    },
    {
      kind: 'destination',
      label: 'Arugam Bay',
      detail: 'A relaxed eastern coast mood for surf, simplicity, and longer summer light.',
      parentRegion: 'East Coast',
      parentTheme: 'Ocean & Discovery',
      reason: 'For a more independent eastern coastline.',
    },
  ],
  'Hill Country': [
    {
      kind: 'destination',
      label: 'Nuwara Eliya',
      detail: 'Tea, gardens, old hill-station air, and cool mornings shaped by landscape.',
      parentRegion: 'Hill Country',
      parentTheme: 'Rail & Landscape',
      reason: 'Because Hill Country is already in your journey.',
    },
    {
      kind: 'destination',
      label: 'Ella',
      detail: 'A scenic highland base for walks, railway views, and soft adventure.',
      parentRegion: 'Hill Country',
      parentTheme: 'Rail & Landscape',
      reason: 'A natural continuation of the hill-country route.',
    },
    {
      kind: 'destination',
      label: 'Nine Arches Bridge',
      detail: 'A railway landmark where engineering, landscape, and timing meet.',
      parentRegion: 'Hill Country',
      parentTheme: 'Rail & Landscape',
      reason: 'For travellers following the rail and landscape thread.',
    },
  ],
  'Cultural Triangle': [
    {
      kind: 'destination',
      label: 'Sigiriya',
      detail: 'A sacred rock and ancient landscape best entered with quiet timing and context.',
      parentRegion: 'Cultural Triangle',
      parentTheme: 'Heritage & Memory',
      reason: 'Because Cultural Triangle is already in your journey.',
    },
    {
      kind: 'destination',
      label: 'Dambulla',
      detail: 'Cave temples, painted memory, and a quieter companion to Sigiriya.',
      parentRegion: 'Cultural Triangle',
      parentTheme: 'Heritage & Memory',
      reason: 'A close heritage pairing for Sigiriya.',
    },
    {
      kind: 'destination',
      label: 'Anuradhapura',
      detail: 'Ancient capitals, sacred trees, and a slower scholarship-led route into memory.',
      parentRegion: 'Cultural Triangle',
      parentTheme: 'Heritage & Memory',
      reason: 'For a deeper ancient-city route.',
    },
  ],
  'West Coast': [
    {
      kind: 'destination',
      label: 'Colombo Fort',
      detail: 'Civic streets, old institutions, and harbour history for a layered first arrival.',
      parentRegion: 'West Coast',
      parentTheme: 'Shared History',
      reason: 'Because West Coast is already in your journey.',
    },
    {
      kind: 'destination',
      label: 'Galle Face Hotel',
      detail: 'A seafront landmark for arrival rituals and Colombo memory.',
      parentRegion: 'West Coast',
      parentTheme: 'Shared History',
      reason: 'A classic Colombo companion.',
    },
    {
      kind: 'destination',
      label: 'Bentota',
      detail: 'River, beach, and first-night ease on the western coastline.',
      parentRegion: 'West Coast',
      parentTheme: 'Wellness & Restoration',
      reason: 'For a softer west-coast landing.',
    },
  ],
}

const destinationRecommendationSeeds: Record<string, RecommendationSeed[]> = {
  Mirissa: [
    {
      kind: 'destination',
      label: 'Weligama',
      detail: 'A nearby bay for surf, gentle beach days, and relaxed coastal movement.',
      parentRegion: 'South Coast',
      parentTheme: 'Ocean & Discovery',
      reason: 'Travellers who keep Mirissa often consider Weligama.',
    },
    {
      kind: 'destination',
      label: 'Galle Fort',
      detail: 'A heritage counterpoint to Mirissa, best held for late afternoon walks and private context.',
      parentRegion: 'South Coast',
      parentTheme: 'Heritage & Memory',
      reason: 'A strong contrast to Mirissa within the South Coast.',
    },
    {
      kind: 'experience',
      label: 'The Deep-Water Hour',
      detail: 'A private ocean encounter from Mirissa before the tour boats wake.',
      parentRegion: 'South Coast',
      parentTheme: 'Ocean & Discovery',
      reason: 'A deeper version of the Mirissa ocean thread.',
    },
  ],
  'Galle Fort': [
    {
      kind: 'destination',
      label: 'Mirissa',
      detail: "A dawn ocean counterpoint to the fort town's architecture and history.",
      parentRegion: 'South Coast',
      parentTheme: 'Ocean & Discovery',
      reason: 'Travellers who keep Galle Fort often add a softer coastal morning.',
    },
    {
      kind: 'destination',
      label: 'Tangalle',
      detail: 'A quieter southern stay after the texture of Galle.',
      parentRegion: 'South Coast',
      parentTheme: 'Wellness & Restoration',
      reason: 'A more secluded continuation of the southern coast.',
    },
  ],
  'Nuwara Eliya': [
    {
      kind: 'destination',
      label: 'Nine Arches Bridge',
      detail: 'A railway and landscape thread that pairs naturally with tea country.',
      parentRegion: 'Hill Country',
      parentTheme: 'Rail & Landscape',
      reason: 'Travellers drawn to Nuwara Eliya often follow the rail story.',
    },
    {
      kind: 'destination',
      label: 'Ella',
      detail: 'A softer walking and view-led continuation of the highlands.',
      parentRegion: 'Hill Country',
      parentTheme: 'Rail & Landscape',
      reason: 'A natural next highland chapter.',
    },
  ],
  Sigiriya: [
    {
      kind: 'destination',
      label: 'Dambulla',
      detail: 'Painted cave temples and scholarship-led context close to Sigiriya.',
      parentRegion: 'Cultural Triangle',
      parentTheme: 'Heritage & Memory',
      reason: 'A close cultural pairing for Sigiriya.',
    },
    {
      kind: 'destination',
      label: 'Anuradhapura',
      detail: 'A deeper ancient-city route for travellers drawn to sacred memory.',
      parentRegion: 'Cultural Triangle',
      parentTheme: 'Heritage & Memory',
      reason: 'For a fuller Cultural Triangle journey.',
    },
  ],
}

const themeRecommendationSeeds: Record<string, RecommendationSeed[]> = {
  'Ocean & Discovery': [
    {
      kind: 'destination',
      label: 'Mirissa',
      detail: 'A southern harbour town for dawn fishing rituals, whale water, and a slower coastal rhythm.',
      parentRegion: 'South Coast',
      parentTheme: 'Ocean & Discovery',
      reason: 'Because Ocean & Discovery is in your journey.',
    },
    {
      kind: 'destination',
      label: 'Trincomalee',
      detail: 'An eastern harbour for luminous ocean mornings and temple cliffs above the sea.',
      parentRegion: 'East Coast',
      parentTheme: 'Ocean & Discovery',
      reason: 'A seasonal ocean counterpoint to the south coast.',
    },
  ],
  'Heritage & Memory': [
    {
      kind: 'destination',
      label: 'Sigiriya',
      detail: 'A sacred rock and ancient landscape best entered with quiet timing and context.',
      parentRegion: 'Cultural Triangle',
      parentTheme: 'Heritage & Memory',
      reason: 'Because Heritage & Memory is in your journey.',
    },
    {
      kind: 'destination',
      label: 'Galle Fort',
      detail: 'A layered coastal fort for architecture, private walks, and late-afternoon history.',
      parentRegion: 'South Coast',
      parentTheme: 'Heritage & Memory',
      reason: 'A coastal expression of the heritage thread.',
    },
  ],
  'Rail & Landscape': [
    {
      kind: 'destination',
      label: 'Nuwara Eliya',
      detail: 'Tea, gardens, old hill-station air, and cool mornings shaped by landscape.',
      parentRegion: 'Hill Country',
      parentTheme: 'Rail & Landscape',
      reason: 'Because Rail & Landscape is in your journey.',
    },
    {
      kind: 'destination',
      label: 'Nine Arches Bridge',
      detail: 'A railway landmark where engineering, landscape, and timing meet.',
      parentRegion: 'Hill Country',
      parentTheme: 'Rail & Landscape',
      reason: 'A natural landmark within the rail story.',
    },
  ],
  'Wellness & Restoration': [
    {
      kind: 'destination',
      label: 'Tangalle',
      detail: 'A quieter southern edge for villas, privacy, and longer pauses by the water.',
      parentRegion: 'South Coast',
      parentTheme: 'Wellness & Restoration',
      reason: 'Because Wellness & Restoration is in your journey.',
    },
    {
      kind: 'destination',
      label: 'Bentota',
      detail: 'River, beach, and first-night ease on the western coastline.',
      parentRegion: 'West Coast',
      parentTheme: 'Wellness & Restoration',
      reason: 'A softer coastal recovery point.',
    },
  ],
  'Culture & Human Connection': [
    {
      kind: 'destination',
      label: 'Kandy',
      detail: 'Ceremony, gardens, dance traditions, and a gentler inland rhythm.',
      parentRegion: 'Hill Country',
      parentTheme: 'Culture & Human Connection',
      reason: 'Because Culture & Human Connection is in your journey.',
    },
    {
      kind: 'destination',
      label: 'Colombo Fort',
      detail: 'Civic streets, old institutions, and harbour history for a layered arrival.',
      parentRegion: 'West Coast',
      parentTheme: 'Culture & Human Connection',
      reason: 'A city-led cultural introduction.',
    },
  ],
  'Wildlife & Wilderness': [
    {
      kind: 'destination',
      label: 'Yala',
      detail: 'Dry-zone wilderness, leopard movement, and expert-led fieldcraft.',
      parentRegion: 'South Coast',
      parentTheme: 'Wildlife & Wilderness',
      reason: 'Because Wildlife & Wilderness is in your journey.',
    },
    {
      kind: 'destination',
      label: 'Sinharaja',
      detail: 'Lowland rainforest, biodiversity, and restoration through deep green silence.',
      parentRegion: 'West Coast',
      parentTheme: 'Wildlife & Wilderness',
      reason: 'A rainforest counterpoint to the dry-zone wilderness.',
    },
  ],
  'Shared History': [
    {
      kind: 'destination',
      label: 'Colombo Fort',
      detail: 'Civic streets, old institutions, and harbour history for a layered first arrival.',
      parentRegion: 'West Coast',
      parentTheme: 'Shared History',
      reason: 'Because Shared History is in your journey.',
    },
    {
      kind: 'destination',
      label: 'Nuwara Eliya',
      detail: 'Tea, gardens, old hill-station air, and a visible shared past in the landscape.',
      parentRegion: 'Hill Country',
      parentTheme: 'Shared History',
      reason: 'A highland expression of the Shared History thread.',
    },
  ],
}

function toJourneyId(kind: JourneyItem['kind'], value: string) {
  return `${kind}:${value.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
}

function getIncludedIds(items: JourneyItem[]) {
  return new Set(items.map((item) => item.id))
}

function getSelectedRegion(item?: JourneyItem) {
  return item ? inferJourneyRegion(item) : undefined
}

function getSelectedDestination(item?: JourneyItem) {
  return item?.kind === 'destination' ? item.label : undefined
}

function getContextItem(items: JourneyItem[], selectedItem?: JourneyItem) {
  return selectedItem ?? [...items].reverse().find((item) => ['destination', 'experience', 'region', 'theme'].includes(item.kind))
}

function buildRecommendation(seed: RecommendationSeed): JourneyRecommendation {
  const parentTheme = seed.parentTheme ?? regionThemeFallbacks[seed.parentRegion]

  return {
    ...seed,
    parentTheme,
    id: toJourneyId(seed.kind, seed.label),
    item: {
      id: toJourneyId(seed.kind, seed.label),
      kind: seed.kind,
      label: seed.label,
      detail: seed.detail,
      source: 'Recommended from My Journey',
      parentTheme,
      parentRegion: seed.parentRegion,
    },
  }
}

export function getJourneyRecommendations(items: JourneyItem[], selectedItem?: JourneyItem) {
  const contextItem = getContextItem(items, selectedItem)
  const includedIds = getIncludedIds(items)
  const selectedDestination = getSelectedDestination(contextItem)
  const selectedRegion = getSelectedRegion(contextItem)
  const selectedTheme = contextItem ? inferJourneyTheme(contextItem) : undefined
  const destinationSeeds = selectedDestination ? destinationRecommendationSeeds[selectedDestination] ?? [] : []
  const regionSeeds = selectedRegion ? regionRecommendationSeeds[selectedRegion] ?? [] : []
  const themeSeeds = selectedTheme ? themeRecommendationSeeds[selectedTheme] ?? [] : []
  const seeds =
    destinationSeeds.length > 0
      ? [...destinationSeeds, ...regionSeeds]
      : regionSeeds.length > 0
        ? regionSeeds
        : themeSeeds
  const uniqueRecommendations = new Map<string, JourneyRecommendation>()

  seeds.map(buildRecommendation).forEach((recommendation) => {
    if (!includedIds.has(recommendation.id) && !uniqueRecommendations.has(recommendation.id)) {
      uniqueRecommendations.set(recommendation.id, recommendation)
    }
  })

  return {
    contextItem,
    contextRegion: selectedRegion,
    recommendations: Array.from(uniqueRecommendations.values()).slice(0, 4),
  }
}
