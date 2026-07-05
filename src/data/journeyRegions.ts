import blueWhaleSunset from '../assets/experiences/blue-whale-sunset.jpg'
import brassLamp from '../assets/experiences/brass-lamp.jpg'
import galleFort from '../assets/experiences/galle-fort.jpg'
import kandyanDancer from '../assets/experiences/kandyan-dancer.jpg'
import leopardFeature from '../assets/experiences/leopard-feature.jpg'
import mirissaBoats from '../assets/experiences/mirissa-boats.jpg'
import monks from '../assets/experiences/monks.jpg'
import oilLamps from '../assets/experiences/oil-lamps.jpg'
import poolVilla from '../assets/experiences/pool-villa.jpg'
import sigiriyaDawn from '../assets/experiences/sigiriya-dawn.jpg'
import teaEstate from '../assets/experiences/tea-estate.jpg'
import { getDestinationRecommendationMetadata } from './journeyConsultation'
import { getExperienceIdsForDestination } from './experiences'
import { MapMode, type MapMode as MapModeValue } from './mapModes'

export type RegionDestination = {
  id: string
  title: string
  /** Mapbox coordinates are stored as [longitude, latitude]. */
  coordinates: [number, number]
  heroImage: string
  description: string
  bestTimeToVisit: string
  journeyMood: string[]
  nearbyExperiences: string[]
  travelNotes: string
  experienceIds: string[]
  journeyThemes: string[]
  journeyMoods: string[]
  bestTimeOptions: string[]
  journeyRegion: string
  suggestedExperiences: string[]
  nearby: string[]
  recommendationReason: string
  activities: string[]
  experiences: string[]
}

export type JourneyRegion = {
  id: string
  title: string
  description: string
  heroImage: string
  center: [number, number]
  zoom: number
  polygon: [number, number][]
  travellerMoods: string[]
  recommendedSeason: string
  summary: string
  editorialIntroduction: string
  journeyHighlights: string[]
  destinations: RegionDestination[]
}

type RegionDestinationInput = Omit<
  RegionDestination,
  | 'activities'
  | 'experiences'
  | 'experienceIds'
  | 'heroImage'
  | 'journeyThemes'
  | 'journeyMoods'
  | 'bestTimeOptions'
  | 'journeyRegion'
  | 'suggestedExperiences'
  | 'nearby'
  | 'recommendationReason'
> & {
  coverImage?: string
  heroImage?: string
}

const createDestination = (
  destination: RegionDestinationInput,
): RegionDestination => {
  const metadata = getDestinationRecommendationMetadata(destination.id, 'Sri Lanka')

  return {
    ...destination,
    heroImage: destination.heroImage ?? destination.coverImage ?? '',
    experienceIds: getExperienceIdsForDestination(destination.id),
    journeyThemes: metadata.journeyThemes,
    journeyMoods: metadata.journeyMoods,
    bestTimeOptions: metadata.bestTimeOptions,
    journeyRegion: metadata.journeyRegion,
    suggestedExperiences: metadata.suggestedExperiences,
    nearby: metadata.nearby,
    recommendationReason: metadata.recommendationReason,
    activities: [],
    experiences: [],
  }
}

export const journeyRegions: JourneyRegion[] = [
  {
    id: 'southern-coast',
    title: 'Southern Coast',
    description: 'Hidden beaches, private villas and slow coastal rituals beyond the resort circuit.',
    heroImage: galleFort,
    center: [80.48, 6.04],
    zoom: 9,
    polygon: [
      [79.93, 6.02],
      [80.17, 5.91],
      [80.62, 5.86],
      [80.98, 5.95],
      [81.03, 6.15],
      [80.72, 6.29],
      [80.25, 6.26],
      [79.93, 6.02],
    ],
    travellerMoods: ['Romantic', 'Luxury', 'Reflection', 'Celebration'],
    recommendedSeason: 'December - April',
    summary: 'For travellers who want the coast to feel intimate, quiet and carefully hosted.',
    editorialIntroduction:
      'The Southern Coast is chosen by travellers seeking slower mornings, hidden beaches and intimate luxury beyond the resort circuit.',
    journeyHighlights: [
      'Hidden beaches',
      'Private villas',
      'Lagoon experiences',
      'Sea turtles',
      'Sunset dining',
      'Private sailing',
    ],
    destinations: [
      createDestination({
        id: 'tangalle',
        title: 'Tangalle',
        coordinates: [80.7911, 6.024],
        coverImage: mirissaBoats,
        description:
          'A quieter southern coastline of palm shade, long beaches and villas designed for unhurried privacy.',
        bestTimeToVisit: 'December - April',
        journeyMood: ['Romantic', 'Restorative', 'Private'],
        nearbyExperiences: ['Hidden beaches', 'Sea turtles', 'Sunset dining'],
        travelNotes: 'Best approached slowly, with time for coastal rituals rather than a single overnight stop.',
      }),
      createDestination({
        id: 'rekawa',
        title: 'Rekawa',
        coordinates: [80.8356, 6.0477],
        coverImage: blueWhaleSunset,
        description: 'A lagoon-edge coast where twilight, turtle nesting and soft silence define the stay.',
        bestTimeToVisit: 'January - April',
        journeyMood: ['Quiet', 'Romantic', 'Nature-led'],
        nearbyExperiences: ['Lagoon walks', 'Turtle conservation', 'Private beach dinners'],
        travelNotes: 'Evenings are the heart of Rekawa; plan arrivals with sunset in mind.',
      }),
      createDestination({
        id: 'mirissa',
        title: 'Mirissa',
        coordinates: [80.4716, 5.9485],
        coverImage: mirissaBoats,
        description: 'A soft southern bay for ocean mornings, sailing moods and warm coastal evenings.',
        bestTimeToVisit: 'December - April',
        journeyMood: ['Oceanic', 'Romantic', 'Easygoing'],
        nearbyExperiences: ['Private sailing', 'Whale watching', 'Coastal dining'],
        travelNotes: 'Choose quieter edges of the bay for a more Royale Isles interpretation.',
      }),
      createDestination({
        id: 'hiriketiya',
        title: 'Hiriketiya',
        coordinates: [80.7031, 5.9627],
        coverImage: poolVilla,
        description: 'A crescent bay with a relaxed rhythm, best experienced through tucked-away stays nearby.',
        bestTimeToVisit: 'December - April',
        journeyMood: ['Soft adventure', 'Coastal', 'Contemporary'],
        nearbyExperiences: ['Surf mornings', 'Private villas', 'Beach cafes'],
        travelNotes: 'Stay nearby rather than directly in the busiest pocket for a calmer experience.',
      }),
      createDestination({
        id: 'mawella',
        title: 'Mawella',
        coordinates: [80.745, 5.9764],
        coverImage: galleFort,
        description: 'A low-key sweep of sand for travellers who prefer privacy to spectacle.',
        bestTimeToVisit: 'December - April',
        journeyMood: ['Secluded', 'Romantic', 'Slow'],
        nearbyExperiences: ['Beach walks', 'Villa dining', 'Lagoon excursions'],
        travelNotes: 'Ideal as a base for travellers who want the coast without a resort atmosphere.',
      }),
      createDestination({
        id: 'dickwella',
        title: 'Dickwella',
        coordinates: [80.6952, 5.9661],
        coverImage: mirissaBoats,
        description: 'A southern coastal town used as a quiet anchor for nearby bays, temples and villas.',
        bestTimeToVisit: 'December - April',
        journeyMood: ['Coastal', 'Local', 'Relaxed'],
        nearbyExperiences: ['Temple visits', 'Hidden bays', 'Private transfers'],
        travelNotes: 'Works best when curated as part of the wider Tangalle coastline.',
      }),
    ],
  },
  {
    id: 'hill-country',
    title: 'Hill Country',
    description: 'Tea estates, slow rail journeys and cloud-soft mornings in Sri Lanka’s interior.',
    heroImage: teaEstate,
    center: [80.83, 6.93],
    zoom: 9,
    polygon: [
      [80.43, 6.67],
      [80.71, 6.56],
      [81.12, 6.66],
      [81.2, 7.05],
      [80.97, 7.28],
      [80.58, 7.18],
      [80.43, 6.67],
    ],
    travellerMoods: ['Reflection', 'Romantic', 'Slow Travel'],
    recommendedSeason: 'January - April',
    summary: 'For travellers drawn to mist, tea country and the ritual of moving slowly.',
    editorialIntroduction:
      'Hill Country is where Sri Lanka softens into tea, cloud forest and a slower kind of luxury.',
    journeyHighlights: ['Tea estates', 'Railway journeys', 'Mountain retreats', 'Waterfalls'],
    destinations: [
      createDestination({
        id: 'ella',
        title: 'Ella',
        coordinates: [81.0463, 6.8667],
        coverImage: teaEstate,
        description: 'A mountain village framed by tea, ridgelines and railway romance.',
        bestTimeToVisit: 'January - April',
        journeyMood: ['Romantic', 'Scenic', 'Gentle adventure'],
        nearbyExperiences: ['Tea walks', 'Rail journeys', 'Mountain viewpoints'],
        travelNotes: 'Best enjoyed with early mornings and a stay outside the busiest village centre.',
      }),
      createDestination({
        id: 'nuwara-eliya',
        title: 'Nuwara Eliya',
        coordinates: [80.7829, 6.9497],
        coverImage: blueWhaleSunset,
        description: 'Cool air, old estates and a slower colonial-era rhythm among the tea fields.',
        bestTimeToVisit: 'January - April',
        journeyMood: ['Elegant', 'Reflective', 'Cool-climate'],
        nearbyExperiences: ['Estate lunches', 'Tea tastings', 'Garden walks'],
        travelNotes: 'Pack for cool evenings; the atmosphere is part of the charm.',
      }),
      createDestination({
        id: 'haputale',
        title: 'Haputale',
        coordinates: [80.9595, 6.7654],
        coverImage: teaEstate,
        description: 'A high ridge of tea country where morning light moves across the valleys.',
        bestTimeToVisit: 'January - April',
        journeyMood: ['Quiet', 'Scenic', 'Reflective'],
        nearbyExperiences: ['Tea ridges', 'Viewpoints', 'Estate stays'],
        travelNotes: 'Choose clear-weather mornings for the most memorable views.',
      }),
    ],
  },
  {
    id: 'cultural-triangle',
    title: 'Cultural Triangle',
    description: 'Ancient capitals, rock citadels and sacred landscapes held in jungle quiet.',
    heroImage: sigiriyaDawn,
    center: [80.62, 8.02],
    zoom: 8.55,
    polygon: [
      [80.08, 7.53],
      [80.62, 7.34],
      [81.0, 7.75],
      [80.84, 8.45],
      [80.28, 8.58],
      [80.08, 7.53],
    ],
    travellerMoods: ['Wonder', 'Culture', 'Reflection'],
    recommendedSeason: 'January - September',
    summary: 'For travellers seeking depth, sacred architecture and the memory of ancient kingdoms.',
    editorialIntroduction:
      'The Cultural Triangle is not a checklist; it is a gradual encounter with Sri Lanka’s earliest imagination.',
    journeyHighlights: ['Ancient cities', 'Rock citadels', 'Monastic ruins', 'Sacred rituals'],
    destinations: [
      createDestination({
        id: 'sigiriya',
        title: 'Sigiriya',
        coordinates: [80.7603, 7.957],
        coverImage: sigiriyaDawn,
        description: 'A rock citadel rising from jungle and morning gold, best approached before the day gathers.',
        bestTimeToVisit: 'January - September',
        journeyMood: ['Wonder', 'Iconic', 'Dawn'],
        nearbyExperiences: ['Dawn ascent', 'Ancient gardens', 'Private guiding'],
        travelNotes: 'A dawn approach preserves the sense of theatre and quiet.',
      }),
      createDestination({
        id: 'anuradhapura',
        title: 'Anuradhapura',
        coordinates: [80.4037, 8.3114],
        coverImage: oilLamps,
        description: 'Sacred stupas, moonstones and ancient reservoirs beneath wide northern skies.',
        bestTimeToVisit: 'January - September',
        journeyMood: ['Sacred', 'Reflective', 'Historic'],
        nearbyExperiences: ['Temple rituals', 'Cycling circuits', 'Archaeological guiding'],
        travelNotes: 'Dress and pace should reflect the sacred nature of the city.',
      }),
      createDestination({
        id: 'polonnaruwa',
        title: 'Polonnaruwa',
        coordinates: [81.0003, 7.9403],
        coverImage: monks,
        description: 'A compact ancient capital of stone Buddhas, reservoirs and elegant ruins.',
        bestTimeToVisit: 'January - September',
        journeyMood: ['Historic', 'Quiet', 'Architectural'],
        nearbyExperiences: ['Ancient ruins', 'Reservoir views', 'Private guiding'],
        travelNotes: 'Works beautifully as a quieter counterpoint to Sigiriya.',
      }),
    ],
  },
  {
    id: 'east-coast',
    title: 'East Coast',
    description: 'Temple cliffs, luminous water and a gentler coastal season when the south rests.',
    heroImage: monks,
    center: [81.3, 8.25],
    zoom: 8.7,
    polygon: [
      [81.02, 7.55],
      [81.43, 7.65],
      [81.65, 8.48],
      [81.34, 8.78],
      [80.98, 8.42],
      [81.02, 7.55],
    ],
    travellerMoods: ['Oceanic', 'Spiritual', 'Summer'],
    recommendedSeason: 'May - September',
    summary: 'For travellers following the calmer eastern season and a more luminous ocean mood.',
    editorialIntroduction:
      'The East Coast opens when the island’s weather turns, offering blue water, temple cliffs and a quieter summer rhythm.',
    journeyHighlights: ['Temple cliffs', 'Summer beaches', 'Snorkelling', 'Coastal villages'],
    destinations: [
      createDestination({
        id: 'trincomalee',
        title: 'Trincomalee',
        coordinates: [81.233, 8.5874],
        coverImage: monks,
        description: 'A harbour city of sacred cliffs, calm bays and eastern light.',
        bestTimeToVisit: 'May - September',
        journeyMood: ['Spiritual', 'Oceanic', 'Summer'],
        nearbyExperiences: ['Temple visits', 'Bay swimming', 'Private coastal drives'],
        travelNotes: 'Best paired with a slower beach stay rather than rushed sightseeing.',
      }),
      createDestination({
        id: 'nilaveli',
        title: 'Nilaveli',
        coordinates: [81.1719, 8.6825],
        coverImage: blueWhaleSunset,
        description: 'A long pale beach and gateway to the gentle waters off Pigeon Island.',
        bestTimeToVisit: 'May - September',
        journeyMood: ['Beach', 'Restorative', 'Simple'],
        nearbyExperiences: ['Snorkelling', 'Boat trips', 'Beach picnics'],
        travelNotes: 'Choose carefully hosted stays; the coast is better when kept simple.',
      }),
    ],
  },
  {
    id: 'northern-peninsula',
    title: 'Northern Peninsula',
    description: 'Tamil heritage, palmyrah landscapes and a different island rhythm in the far north.',
    heroImage: brassLamp,
    center: [80.12, 9.55],
    zoom: 8.6,
    polygon: [
      [79.68, 9.22],
      [80.12, 9.05],
      [80.55, 9.28],
      [80.45, 9.83],
      [79.82, 9.9],
      [79.68, 9.22],
    ],
    travellerMoods: ['Curious', 'Cultural', 'Independent'],
    recommendedSeason: 'January - September',
    summary: 'For travellers who want Sri Lanka to feel layered, complex and culturally distinct.',
    editorialIntroduction:
      'The Northern Peninsula rewards travellers who are open to a Sri Lanka shaped by Tamil culture, resilience and luminous northern light.',
    journeyHighlights: ['Tamil heritage', 'Island causeways', 'Temples', 'Palmyrah landscapes'],
    destinations: [
      createDestination({
        id: 'jaffna',
        title: 'Jaffna',
        coordinates: [80.0255, 9.6615],
        coverImage: brassLamp,
        description: 'Northern light, temple life and a culture that feels distinct from the rest of the island.',
        bestTimeToVisit: 'January - September',
        journeyMood: ['Curious', 'Cultural', 'Reflective'],
        nearbyExperiences: ['Temple visits', 'Local cuisine', 'Island drives'],
        travelNotes: 'Best with thoughtful guiding and time to understand context.',
      }),
    ],
  },
  {
    id: 'wild-south',
    title: 'Wild South',
    description: 'Dry-zone wilderness, leopard country and coastlines that feel elemental.',
    heroImage: leopardFeature,
    center: [81.35, 6.35],
    zoom: 8.55,
    polygon: [
      [80.82, 6.0],
      [81.35, 5.95],
      [81.83, 6.18],
      [81.7, 6.67],
      [81.08, 6.7],
      [80.82, 6.0],
    ],
    travellerMoods: ['Wildlife', 'Adventure', 'Elemental'],
    recommendedSeason: 'February - September',
    summary: 'For travellers drawn to wilderness, animal movement and the drama of the dry zone.',
    editorialIntroduction:
      'The Wild South is Sri Lanka at its most elemental: scrub jungle, salt air, leopard country and vast skies.',
    journeyHighlights: ['Leopard tracking', 'Dry-zone landscapes', 'Birdlife', 'Wild coast'],
    destinations: [
      createDestination({
        id: 'yala',
        title: 'Yala',
        coordinates: [81.5158, 6.3725],
        coverImage: leopardFeature,
        description: 'Dry-zone wilderness where leopard movement, birdlife and wild coastlines converge.',
        bestTimeToVisit: 'February - September',
        journeyMood: ['Wildlife', 'Dramatic', 'Immersive'],
        nearbyExperiences: ['Private safaris', 'Naturalist guiding', 'Wild coast drives'],
        travelNotes: 'Quality depends on guiding, timing and avoiding the busiest park hours.',
      }),
    ],
  },
  {
    id: 'western-gateway',
    title: 'Western Gateway',
    description: 'Arrival rituals, garden villas, galleries and the soft landing into island life.',
    heroImage: poolVilla,
    center: [79.9, 7.0],
    zoom: 9,
    polygon: [
      [79.66, 6.65],
      [80.05, 6.6],
      [80.18, 7.25],
      [79.83, 7.45],
      [79.66, 6.65],
    ],
    travellerMoods: ['Arrival', 'Urban', 'Ease'],
    recommendedSeason: 'Year-round',
    summary: 'For travellers who want the first arrival to feel considered rather than transactional.',
    editorialIntroduction:
      'The Western Gateway frames arrival as part of the journey: a gentle first impression of galleries, gardens and hosted ease.',
    journeyHighlights: ['Arrival hosting', 'Garden villas', 'Galleries', 'Old clubs'],
    destinations: [
      createDestination({
        id: 'colombo',
        title: 'Colombo',
        coordinates: [79.8612, 6.9271],
        coverImage: poolVilla,
        description: 'A coastal capital of garden villas, galleries, old clubs and modern island rhythm.',
        bestTimeToVisit: 'Year-round',
        journeyMood: ['Arrival', 'Urban', 'Hosted'],
        nearbyExperiences: ['Gallery visits', 'Private dining', 'Garden villas'],
        travelNotes: 'Use Colombo as a composed arrival, not just a transit point.',
      }),
    ],
  },
  {
    id: 'central-highlands',
    title: 'Central Highlands',
    description: 'Sacred hills, botanical calm and the cultural centre of the island.',
    heroImage: kandyanDancer,
    center: [80.64, 7.3],
    zoom: 9,
    polygon: [
      [80.25, 7.05],
      [80.72, 6.96],
      [81.03, 7.32],
      [80.76, 7.68],
      [80.29, 7.58],
      [80.25, 7.05],
    ],
    travellerMoods: ['Culture', 'Ceremony', 'Gardens'],
    recommendedSeason: 'January - April',
    summary: 'For travellers interested in ceremony, hill-country culture and a gentler inland rhythm.',
    editorialIntroduction:
      'The Central Highlands hold the island’s ceremonial heart: temple bells, botanical calm and living Kandyan traditions.',
    journeyHighlights: ['Temple rituals', 'Botanical gardens', 'Kandyan performance', 'Hill culture'],
    destinations: [
      createDestination({
        id: 'kandy',
        title: 'Kandy',
        coordinates: [80.6337, 7.2906],
        coverImage: kandyanDancer,
        description: 'A sacred hill capital of temple bells, lake reflections and living Kandyan culture.',
        bestTimeToVisit: 'January - April',
        journeyMood: ['Ceremonial', 'Cultural', 'Inland'],
        nearbyExperiences: ['Temple rituals', 'Private guiding', 'Botanical gardens'],
        travelNotes: 'Best experienced with context and careful timing around temple rituals.',
      }),
    ],
  },
]

const romanticJourneyRegions: JourneyRegion[] = [
  {
    id: 'romantic-western-southern-provinces',
    title: 'Western & Southern Provinces',
    description: 'Golden beaches, colonial ramparts, river cruises and boutique coastal stays.',
    heroImage: galleFort,
    center: [80.28, 6.13],
    zoom: 8.7,
    polygon: [
      [79.74, 6.5],
      [79.94, 6.02],
      [80.45, 5.88],
      [80.98, 5.96],
      [81.0, 6.2],
      [80.42, 6.44],
      [79.95, 6.65],
      [79.74, 6.5],
    ],
    travellerMoods: ['Romantic', 'Luxury', 'Beach', 'Celebration'],
    recommendedSeason: 'December - April',
    summary:
      'For romantic travellers seeking beach luxury, sunset walks, river journeys and intimate boutique stays.',
    editorialIntroduction:
      'The western and southern coast is the classic romantic introduction to Sri Lanka: Galle Fort at sunset, Bentota’s river mood, Mirissa’s ocean mornings and Tangalle’s secluded villas.',
    journeyHighlights: [
      'Galle Fort sunset walks',
      'Bentota river cruises',
      'Mirissa whale watching',
      'Tangalle boutique resorts',
      'Rekawa turtle watching',
      'Hikkaduwa coral reefs',
    ],
    destinations: [
      createDestination({
        id: 'galle-fort',
        title: 'Galle Fort',
        coordinates: [80.2168, 6.0269],
        coverImage: galleFort,
        description:
          'Colonial ramparts, sea air and golden-hour walks through one of the island’s most atmospheric coastal towns.',
        bestTimeToVisit: 'December - April',
        journeyMood: ['Romantic', 'Historic', 'Sunset'],
        nearbyExperiences: ['Rampart walks', 'Private dining', 'Boutique stays'],
        travelNotes: 'Plan the fort for late afternoon, when the light and sea breeze soften the town.',
      }),
      createDestination({
        id: 'bentota',
        title: 'Bentota',
        coordinates: [79.9971, 6.4214],
        coverImage: poolVilla,
        description:
          'A west-coast resort mood shaped by river bends, beach hotels and slow waterborne afternoons.',
        bestTimeToVisit: 'December - April',
        journeyMood: ['Luxury', 'Beach', 'Easy arrival'],
        nearbyExperiences: ['River cruises', 'Beach resorts', 'Private transfers'],
        travelNotes: 'Works beautifully as a soft coastal pause after arrival or before departure.',
      }),
      createDestination({
        id: 'mirissa-romantic',
        title: 'Mirissa',
        coordinates: [80.4716, 5.9485],
        coverImage: mirissaBoats,
        description: 'A romantic southern bay for whale watching, barefoot dinners and intimate beach stays.',
        bestTimeToVisit: 'December - April',
        journeyMood: ['Oceanic', 'Romantic', 'Barefoot'],
        nearbyExperiences: ['Whale watching', 'Private sailing', 'Beach dining'],
        travelNotes: 'Stay on the quieter edges for a more private interpretation of Mirissa.',
      }),
      createDestination({
        id: 'tangalle-romantic',
        title: 'Tangalle',
        coordinates: [80.7911, 6.024],
        coverImage: blueWhaleSunset,
        description:
          'Secluded boutique resorts, long beaches and turtle-watching evenings along the island’s quieter south.',
        bestTimeToVisit: 'December - April',
        journeyMood: ['Secluded', 'Romantic', 'Boutique'],
        nearbyExperiences: ['Rekawa turtles', 'Hidden beaches', 'Infinity-pool villas'],
        travelNotes: 'Tangalle rewards travellers who want space, privacy and a slower coastal rhythm.',
      }),
      createDestination({
        id: 'hikkaduwa',
        title: 'Hikkaduwa',
        coordinates: [80.1014, 6.1395],
        coverImage: mirissaBoats,
        description: 'A livelier beach stop with coral reefs, warm water and an easygoing coastal pulse.',
        bestTimeToVisit: 'December - April',
        journeyMood: ['Beach', 'Lively', 'Marine'],
        nearbyExperiences: ['Coral reefs', 'Beach cafes', 'Coastal drives'],
        travelNotes: 'Best framed as a bright coastal interlude rather than a secluded hideaway.',
      }),
    ],
  },
  {
    id: 'romantic-central-province',
    title: 'Central Province',
    description: 'Cultural romance, gardens, tea estates and colonial highland charm.',
    heroImage: teaEstate,
    center: [80.72, 7.16],
    zoom: 8.75,
    polygon: [
      [80.28, 6.82],
      [80.82, 6.78],
      [81.08, 7.22],
      [80.86, 7.62],
      [80.33, 7.5],
      [80.28, 6.82],
    ],
    travellerMoods: ['Romantic', 'Culture', 'Tea Country', 'Scenic'],
    recommendedSeason: 'January - April',
    summary:
      'For romantic travellers drawn to hill-country coolness, gardens, temple rituals and scenic train journeys.',
    editorialIntroduction:
      'Central Province softens romance into culture and landscape: Kandy’s temple gardens, Nuwara Eliya’s colonial charm and the famous railway journey toward Ella.',
    journeyHighlights: [
      'Temple of the Tooth',
      'Botanical gardens',
      'Gregory Lake',
      'Tea estates',
      'Kandy to Ella train',
      'High tea rituals',
    ],
    destinations: [
      createDestination({
        id: 'kandy-romantic',
        title: 'Kandy',
        coordinates: [80.6337, 7.2906],
        coverImage: kandyanDancer,
        description:
          'A cultural hill capital for couples who want temple ritual, botanical gardens and lakeside calm.',
        bestTimeToVisit: 'January - April',
        journeyMood: ['Cultural', 'Romantic', 'Garden'],
        nearbyExperiences: ['Temple of the Tooth', 'Botanical gardens', 'Private guiding'],
        travelNotes: 'Kandy is most romantic when paced slowly around gardens, ceremony and lake light.',
      }),
      createDestination({
        id: 'nuwara-eliya-romantic',
        title: 'Nuwara Eliya',
        coordinates: [80.7829, 6.9497],
        coverImage: teaEstate,
        description:
          'Little England romance: cool air, Gregory Lake, tea estates and old-world highland hospitality.',
        bestTimeToVisit: 'January - April',
        journeyMood: ['Colonial charm', 'Tea Country', 'Elegant'],
        nearbyExperiences: ['High tea', 'Gregory Lake', 'Estate walks'],
        travelNotes: 'Pack layers; the cool evenings are central to the romance of the highlands.',
      }),
      createDestination({
        id: 'ella-romantic-central',
        title: 'Ella',
        coordinates: [81.0463, 6.8667],
        coverImage: teaEstate,
        description:
          'A scenic mountain escape of Nine Arch Bridge, Little Adam’s Peak and the island’s most romantic train approach.',
        bestTimeToVisit: 'January - April',
        journeyMood: ['Scenic', 'Romantic', 'Soft adventure'],
        nearbyExperiences: ['Nine Arch Bridge', 'Little Adam’s Peak', 'Scenic train ride'],
        travelNotes: 'The Kandy-to-Ella train is a signature romantic journey when timed and seated well.',
      }),
    ],
  },
  {
    id: 'romantic-eastern-province',
    title: 'Eastern Province',
    description: 'Secluded summer beaches, snorkeling waters and relaxed coastal hideaways.',
    heroImage: blueWhaleSunset,
    center: [81.45, 7.65],
    zoom: 8.35,
    polygon: [
      [81.02, 6.65],
      [81.65, 6.7],
      [81.78, 8.55],
      [81.28, 8.85],
      [80.98, 8.2],
      [81.02, 6.65],
    ],
    travellerMoods: ['Romantic', 'Secluded', 'Summer Coast', 'Oceanic'],
    recommendedSeason: 'May - September',
    summary:
      'For couples seeking the quieter eastern season: clear water, slow beaches and less-travelled coastal stays.',
    editorialIntroduction:
      'The Eastern Province offers a different romantic coastline, especially when the south rests: Trincomalee’s pristine bays, Uga Bay-style seclusion and Arugam’s laid-back beach rhythm.',
    journeyHighlights: [
      'Pristine beaches',
      'Snorkeling',
      'Romantic coastal stays',
      'Surf-town energy',
      'Temple cliffs',
    ],
    destinations: [
      createDestination({
        id: 'trincomalee-romantic',
        title: 'Trincomalee',
        coordinates: [81.233, 8.5874],
        coverImage: monks,
        description:
          'Pristine beaches, temple cliffs and warm eastern waters for a quieter romantic coastal stay.',
        bestTimeToVisit: 'May - September',
        journeyMood: ['Secluded', 'Oceanic', 'Spiritual'],
        nearbyExperiences: ['Snorkeling', 'Temple cliffs', 'Beach stays'],
        travelNotes: 'Best in the eastern season, when the water and weather feel most generous.',
      }),
      createDestination({
        id: 'arugam-bay-romantic',
        title: 'Arugam Bay',
        coordinates: [81.8368, 6.8404],
        coverImage: mirissaBoats,
        description: 'A laid-back eastern beach mood for couples who like surf, simplicity and coastal ease.',
        bestTimeToVisit: 'May - September',
        journeyMood: ['Laid-back', 'Beach', 'Soft adventure'],
        nearbyExperiences: ['Surf watching', 'Lagoon drives', 'Beach cafes'],
        travelNotes: 'More relaxed than polished; best for travellers who enjoy a casual beach rhythm.',
      }),
    ],
  },
  {
    id: 'romantic-uva-province',
    title: 'Uva Province',
    description: 'Mountain escapes, eco-lodges, waterfalls and panoramic tea-country views.',
    heroImage: teaEstate,
    center: [80.99, 6.81],
    zoom: 8.9,
    polygon: [
      [80.62, 6.52],
      [81.18, 6.5],
      [81.42, 6.98],
      [81.08, 7.22],
      [80.66, 7.06],
      [80.62, 6.52],
    ],
    travellerMoods: ['Romantic', 'Mountain', 'Eco-luxury', 'Scenic'],
    recommendedSeason: 'January - April',
    summary:
      'For couples who want the romance of height: waterfalls, tea plantation walks, panoramic bungalows and mountain air.',
    editorialIntroduction:
      'Uva Province is a romantic mountain escape, shaped by Ella’s eco-lodges, Bandarawela’s colonial bungalows and Haputale’s vast ridgeline views.',
    journeyHighlights: [
      'Eco-lodges',
      'Waterfalls',
      'Tea plantation walks',
      'Colonial bungalows',
      'Panoramic hikes',
      'Horton Plains access',
    ],
    destinations: [
      createDestination({
        id: 'ella-romantic-uva',
        title: 'Ella',
        coordinates: [81.0463, 6.8667],
        coverImage: teaEstate,
        description: 'Eco-lodges, waterfalls, tea walks and sunrise hikes wrapped in mountain romance.',
        bestTimeToVisit: 'January - April',
        journeyMood: ['Mountain', 'Romantic', 'Adventure'],
        nearbyExperiences: ['Little Adam’s Peak', 'Waterfalls', 'Tea plantation walks'],
        travelNotes: 'Stay slightly outside town for a quieter, more intimate mountain atmosphere.',
      }),
      createDestination({
        id: 'bandarawela',
        title: 'Bandarawela',
        coordinates: [80.9909, 6.8289],
        coverImage: poolVilla,
        description: 'Colonial bungalows and scenic hill walks for couples seeking old-world quiet.',
        bestTimeToVisit: 'January - April',
        journeyMood: ['Colonial', 'Quiet', 'Highland'],
        nearbyExperiences: ['Bungalow stays', 'Scenic hikes', 'Tea country drives'],
        travelNotes: 'A refined base for travellers who prefer quiet hills to busy viewpoints.',
      }),
      createDestination({
        id: 'haputale-romantic',
        title: 'Haputale',
        coordinates: [80.9595, 6.7654],
        coverImage: teaEstate,
        description: 'A panoramic ridge of tea country views, cool air and dramatic highland mornings.',
        bestTimeToVisit: 'January - April',
        journeyMood: ['Panoramic', 'Reflective', 'Mountain'],
        nearbyExperiences: ['Viewpoints', 'Tea ridges', 'Horton Plains access'],
        travelNotes: 'Best for clear mornings and couples who enjoy scenic drives and quiet viewpoints.',
      }),
    ],
  },
  {
    id: 'romantic-sabaragamuwa-province',
    title: 'Sabaragamuwa Province',
    description: 'Sunrise pilgrim peaks, trekking valleys and soft adventure for nature-led couples.',
    heroImage: oilLamps,
    center: [80.55, 6.63],
    zoom: 8.65,
    polygon: [
      [80.08, 6.25],
      [80.62, 6.18],
      [80.92, 6.72],
      [80.62, 7.06],
      [80.16, 6.92],
      [80.08, 6.25],
    ],
    travellerMoods: ['Romantic', 'Spiritual', 'Adventure', 'Nature'],
    recommendedSeason: 'January - April',
    summary:
      'For couples seeking meaning through sunrise hikes, nature, birdlife and soft adventure away from the coast.',
    editorialIntroduction:
      'Sabaragamuwa brings a quieter romantic intensity: Adam’s Peak at sunrise, Belihuloya’s canoeing and the feeling of sharing a landscape with purpose.',
    journeyHighlights: [
      'Adam’s Peak sunrise',
      'Trekking',
      'Canoeing',
      'Bird watching',
      'Nature retreats',
    ],
    destinations: [
      createDestination({
        id: 'adams-peak',
        title: 'Adam’s Peak',
        coordinates: [80.4994, 6.8096],
        coverImage: oilLamps,
        description:
          'A spiritually significant sunrise hike for couples drawn to shared effort and quiet meaning.',
        bestTimeToVisit: 'January - April',
        journeyMood: ['Spiritual', 'Sunrise', 'Meaningful'],
        nearbyExperiences: ['Sunrise hike', 'Pilgrim trail', 'Mountain views'],
        travelNotes: 'Requires careful timing and preparation; the reward is emotional rather than luxurious.',
      }),
      createDestination({
        id: 'belihuloya',
        title: 'Belihuloya',
        coordinates: [80.7543, 6.7167],
        coverImage: teaEstate,
        description: 'A nature-led valley for trekking, canoeing, bird watching and quiet outdoor romance.',
        bestTimeToVisit: 'January - April',
        journeyMood: ['Nature', 'Soft adventure', 'Quiet'],
        nearbyExperiences: ['Trekking', 'Canoeing', 'Bird watching'],
        travelNotes: 'Best for couples who want active days and simple, restorative evenings.',
      }),
    ],
  },
  {
    id: 'romantic-northern-province',
    title: 'Northern Province',
    description: 'Quiet lagoons, cultural heritage and untouched beaches for solitude-seeking couples.',
    heroImage: brassLamp,
    center: [80.05, 9.55],
    zoom: 8.5,
    polygon: [
      [79.68, 9.2],
      [80.1, 9.04],
      [80.58, 9.26],
      [80.46, 9.86],
      [79.78, 9.92],
      [79.68, 9.2],
    ],
    travellerMoods: ['Romantic', 'Solitude', 'Cultural', 'Untouched'],
    recommendedSeason: 'January - September',
    summary:
      'For romantic travellers who prefer quiet culture, lagoons and less-touristed beaches to conventional luxury.',
    editorialIntroduction:
      'The Northern Province is a less obvious romantic choice, but deeply rewarding for couples seeking solitude, cultural heritage and untouched coastal edges.',
    journeyHighlights: ['Quiet lagoons', 'Tamil heritage', 'Untouched beaches', 'Cultural walks'],
    destinations: [
      createDestination({
        id: 'jaffna-romantic',
        title: 'Jaffna',
        coordinates: [80.0255, 9.6615],
        coverImage: brassLamp,
        description:
          'A culturally rich northern city for couples who want solitude, heritage and a less travelled island story.',
        bestTimeToVisit: 'January - September',
        journeyMood: ['Solitude', 'Cultural', 'Curious'],
        nearbyExperiences: ['Quiet lagoons', 'Temple visits', 'Untouched beaches'],
        travelNotes: 'Most rewarding with thoughtful guiding and time to understand the region’s layered history.',
      }),
    ],
  },
  {
    id: 'romantic-wild-south',
    title: 'Private Safari South',
    description: 'Leopard country, private safari rhythm and dramatic wild landscapes for adventurous couples.',
    heroImage: leopardFeature,
    center: [81.5, 6.37],
    zoom: 8.7,
    polygon: [
      [81.02, 6.02],
      [81.6, 5.96],
      [81.86, 6.3],
      [81.62, 6.75],
      [81.05, 6.62],
      [81.02, 6.02],
    ],
    travellerMoods: ['Romantic', 'Wildlife', 'Private Safari', 'Adventure'],
    recommendedSeason: 'February - September',
    summary:
      'For couples who want romance to include wilderness, expert naturalists and the drama of the dry zone.',
    editorialIntroduction:
      'Private safari in the south turns romance toward the wild: leopard movement, elephants, dry-zone light and quiet evenings after the drive.',
    journeyHighlights: ['Private safari', 'Leopard tracking', 'Elephants', 'Wild coast', 'Naturalist guiding'],
    destinations: [
      createDestination({
        id: 'yala-romantic',
        title: 'Yala National Park',
        coordinates: [81.5158, 6.3725],
        coverImage: leopardFeature,
        description:
          'A dramatic private safari landscape for couples drawn to leopards, elephants and wild southern skies.',
        bestTimeToVisit: 'February - September',
        journeyMood: ['Wildlife', 'Adventure', 'Private'],
        nearbyExperiences: ['Private safaris', 'Naturalist guiding', 'Wild coast drives'],
        travelNotes: 'The romantic version of Yala depends on private timing, expert guiding and avoiding crowded hours.',
      }),
    ],
  },
]

export const journeyRegionCollections: Record<MapModeValue, JourneyRegion[]> = {
  [MapMode.DISCOVER]: journeyRegions,
  [MapMode.PERSONALISED]: romanticJourneyRegions,
}
