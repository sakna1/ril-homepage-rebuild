import { experienceImages } from '../ExperiencesPage/images'

/**
 * The Designed Trips flow: package -> theme -> sub-package -> locked inclusions.
 *
 * Themes and their two sub-packages ("The Glimpse", 2 days / half, and "The
 * Immersion", 4 days / full) are served by the backend from
 * `/api/content/themes`. The curated data below is the fallback used until — or
 * if — that call fails, matching the pattern already used for packages.
 */

export type ThemeSubPackage = {
  id: string
  tier: 'glimpse' | 'immersion'
  name: string
  days: number
  coverage: 'half' | 'full'
  summary: string
  /** The locked hotel for this sub-package — not editable by the traveller. */
  hotel: string
  activities: readonly string[]
  inclusions: readonly string[]
  /** USD per person, added on top of the chosen package's "from" price. */
  priceAdd: number
}

export type ItineraryTheme = {
  id: string
  title: string
  description: string
  traveller: string
  image: string
  imageAlt: string
  subPackages: readonly ThemeSubPackage[]
}

/** Theme images live in the frontend; the DB stores no bundled asset. */
const themeImages: Record<string, { image: string; imageAlt: string }> = {
  'Wildlife & Wilderness': {
    image: experienceImages.leopardFeature,
    imageAlt: 'Sri Lankan leopard resting on rock at dusk in the wild',
  },
  'Ocean & Discovery': {
    image: experienceImages.mirissaBoats,
    imageAlt: 'Fishing boats at Mirissa harbour at sunset',
  },
  'Heritage & Memory': {
    image: experienceImages.sigiriyaRock,
    imageAlt: 'Sigiriya rock fortress rising above the forest',
  },
  'Wellness & Restoration': {
    image: experienceImages.ayurveda,
    imageAlt: 'Ayurvedic treatment pavilion set within a tropical rainforest retreat',
  },
  'Rail & Landscape': {
    image: experienceImages.hillCountry,
    imageAlt: 'Nuwara Eliya hill country landscape',
  },
  'Culture & Human Connection': {
    image: experienceImages.artisanMasks,
    imageAlt: 'Hand-carved Sri Lankan masks in an artisan workshop',
  },
  'Shared Heritage': {
    image: experienceImages.galleDutchChurch,
    imageAlt: 'The Dutch Reformed Church inside Galle Fort',
  },
}

export type ThemeShot = { src: string; alt: string }

/**
 * Indicative photographs per theme, grouped to match the three columns of the
 * locked inclusions: one for the property, three for the activities, three for
 * what the price covers. They illustrate the theme rather than the specific
 * hotel, which is why the panel is captioned as indicative.
 */
export type ThemeGallery = {
  hotel: ThemeShot
  doing: readonly ThemeShot[]
  included: readonly ThemeShot[]
}

const themeGalleries: Record<string, ThemeGallery> = {
  'Wildlife & Wilderness': {
    hotel: { src: experienceImages.poolVilla, alt: 'A tented wilderness lodge suite' },
    doing: [
      { src: experienceImages.leopardFeature, alt: 'A Sri Lankan leopard at dusk' },
      { src: experienceImages.leopardCircuit, alt: 'A private safari jeep on a park track' },
      { src: experienceImages.sahan, alt: 'A resident naturalist in the field' },
    ],
    included: [
      { src: experienceImages.poolVilla, alt: 'A cocoon suite at the lodge' },
      { src: experienceImages.oilLamps, alt: 'Dinner served by lamplight at camp' },
      { src: experienceImages.spices, alt: 'Meals prepared at the camp kitchen' },
    ],
  },
  'Ocean & Discovery': {
    hotel: { src: experienceImages.poolVilla, alt: 'A private pool villa above the sea' },
    doing: [
      { src: experienceImages.blueWhaleAerial, alt: 'A blue whale surfacing offshore' },
      { src: experienceImages.mirissaBoats, alt: 'Fishing boats at Mirissa harbour' },
      { src: experienceImages.blueWhaleSunset, alt: 'A charter returning at sunset' },
    ],
    included: [
      { src: experienceImages.poolVilla, alt: 'The villa and its private pool' },
      { src: experienceImages.mirissaBoats, alt: 'A private boat charter' },
      { src: experienceImages.spices, alt: 'Fresh coastal cooking' },
    ],
  },
  'Heritage & Memory': {
    hotel: { src: experienceImages.poolVilla, alt: 'A garden residence near the ancient cities' },
    doing: [
      { src: experienceImages.sigiriyaSunrise, alt: 'Sunrise over the Cultural Triangle' },
      { src: experienceImages.monks, alt: 'Monks at a Sri Lankan temple' },
      { src: experienceImages.oilLamps, alt: 'Oil lamps at an evening ritual' },
    ],
    included: [
      { src: experienceImages.poolVilla, alt: 'The garden residence suite' },
      { src: experienceImages.brassLamp, alt: 'A brass lamp and temple detail' },
      { src: experienceImages.spices, alt: 'A meal served in the courtyard' },
    ],
  },
  'Wellness & Restoration': {
    hotel: { src: experienceImages.ayurveda, alt: 'An Ayurvedic treatment pavilion' },
    doing: [
      { src: experienceImages.ayurveda, alt: 'A treatment in the forest pavilion' },
      { src: experienceImages.spices, alt: 'Herbs prepared for treatment' },
      { src: experienceImages.oilLamps, alt: 'Evening meditation by lamplight' },
    ],
    included: [
      { src: experienceImages.poolVilla, alt: 'A retreat suite and pool' },
      { src: experienceImages.brassLamp, alt: 'Oils and vessels for treatment' },
      { src: experienceImages.spices, alt: 'A prescribed wellness menu' },
    ],
  },
  'Rail & Landscape': {
    hotel: { src: experienceImages.teaEstate, alt: 'A tea-estate bungalow in the hills' },
    doing: [
      { src: experienceImages.hillCountry, alt: 'The hill country seen from the train' },
      { src: experienceImages.teaEstate, alt: 'A private walk through the tea estate' },
      { src: experienceImages.spices, alt: 'Tea leaves sorted for tasting' },
    ],
    included: [
      { src: experienceImages.teaEstate, alt: 'The estate chalet' },
      { src: experienceImages.hillCountry, alt: 'Reserved observation-carriage seats' },
      { src: experienceImages.brassLamp, alt: 'Breakfast laid on the estate veranda' },
    ],
  },
  'Culture & Human Connection': {
    hotel: { src: experienceImages.poolVilla, alt: 'A restored courtyard residence' },
    doing: [
      { src: experienceImages.kandyanDancer, alt: 'A Kandyan dancer mid-performance' },
      { src: experienceImages.perahera, alt: 'A ceremonial procession at night' },
      { src: experienceImages.artisanMasks, alt: "Carved masks in an artisan's workshop" },
    ],
    included: [
      { src: experienceImages.poolVilla, alt: 'The courtyard residence suite' },
      { src: experienceImages.oilLamps, alt: 'A temple ritual at dusk' },
      { src: experienceImages.spices, alt: 'A family kitchen meal' },
    ],
  },
  'Shared Heritage': {
    hotel: { src: experienceImages.galleFort, alt: 'A residence within Galle Fort' },
    doing: [
      { src: experienceImages.hillCountry, alt: 'Highland tea country and railway' },
      { src: experienceImages.queenVictoriaStatue, alt: 'A colonial-era statue in Colombo' },
      { src: experienceImages.galleDutchChurch, alt: 'The Dutch Reformed Church, Galle Fort' },
    ],
    included: [
      { src: experienceImages.teaEstate, alt: 'An estate bungalow stay' },
      { src: experienceImages.brassLamp, alt: 'Archive and museum access' },
      { src: experienceImages.spices, alt: 'Dining at a heritage hotel' },
    ],
  },
}

export type ThemeReview = {
  name: string
  origin: string
  rating: number
  quote: string
}

/**
 * PLACEHOLDER DATA — these are written samples, not collected guest feedback.
 * They are labelled as samples in the UI for that reason; replace them with
 * real, attributable reviews before the site goes live.
 */
const themeReviews: Record<string, readonly ThemeReview[]> = {
  'Wildlife & Wilderness': [
    {
      name: 'H. Tanaka',
      origin: 'Tokyo',
      rating: 5,
      quote:
        'Our tracker read the forest like a page. Two leopards in three mornings, and not another vehicle in sight.',
    },
    {
      name: 'M. Okonjo',
      origin: 'London',
      rating: 5,
      quote: 'The camp was quiet in the way only a well-run camp is. Nothing needed asking for.',
    },
  ],
  'Ocean & Discovery': [
    {
      name: 'C. Lindqvist',
      origin: 'Stockholm',
      rating: 5,
      quote:
        'A blue whale surfaced beside us on the second morning. The marine biologist aboard made the difference.',
    },
    {
      name: 'R. Marchetti',
      origin: 'Milan',
      rating: 4,
      quote: 'Long, unhurried days at sea. The villa afterwards felt like the right full stop.',
    },
  ],
  'Heritage & Memory': [
    {
      name: 'A. Fernández',
      origin: 'Madrid',
      rating: 5,
      quote:
        'We had Sigiriya almost to ourselves at first light. The scholar who joined us changed how we saw it.',
    },
    {
      name: 'J. Whitmore',
      origin: 'Melbourne',
      rating: 5,
      quote: 'Ancient cities explained with care rather than recited. Rare, and worth it.',
    },
  ],
  'Wellness & Restoration': [
    {
      name: 'S. Bergström',
      origin: 'Oslo',
      rating: 5,
      quote: 'Treatments prescribed rather than chosen from a menu. I left genuinely rested.',
    },
    {
      name: 'P. Nair',
      origin: 'Singapore',
      rating: 4,
      quote: 'The forest pavilion at dawn is the part I still think about.',
    },
  ],
  'Rail & Landscape': [
    {
      name: 'E. Dubois',
      origin: 'Paris',
      rating: 5,
      quote:
        'The observation carriage was reserved and waiting. Tea country passed by for three hours and I never opened my book.',
    },
    {
      name: 'D. Hartley',
      origin: 'Edinburgh',
      rating: 5,
      quote: 'The estate bungalow felt like staying with friends who happen to grow tea.',
    },
  ],
  'Culture & Human Connection': [
    {
      name: 'L. Moreau',
      origin: 'Geneva',
      rating: 5,
      quote:
        'A dance rehearsal rather than a performance, then a family kitchen. We were guests, not an audience.',
    },
    {
      name: 'T. Abioye',
      origin: 'Lagos',
      rating: 5,
      quote: 'The evening puja was handled with real respect. That mattered to us.',
    },
  ],
  'Shared Heritage': [
    {
      name: 'G. Chandra',
      origin: 'Toronto',
      rating: 5,
      quote:
        'History presented honestly, neither romanticised nor flattened. The Galle walk was the highlight.',
    },
    {
      name: 'N. Halvorsen',
      origin: 'Copenhagen',
      rating: 4,
      quote: 'Thoughtful context at every stop. We came away understanding more than we expected.',
    },
  ],
}

export function reviewsForTheme(title: string): readonly ThemeReview[] {
  return themeReviews[title] ?? []
}

/** Falls back to the theme's own photograph when a theme has no set. */
export function galleryForTheme(title: string): ThemeGallery {
  const gallery = themeGalleries[title]
  if (gallery) return gallery

  const { image, imageAlt } = imageForTheme(title)
  const shot = { src: image, alt: imageAlt }
  return { hotel: shot, doing: [shot], included: [shot] }
}

export function imageForTheme(title: string): { image: string; imageAlt: string } {
  return (
    themeImages[title] ?? {
      image: experienceImages.sigiriyaMain,
      imageAlt: `${title} in Sri Lanka`,
    }
  )
}

export const fallbackThemes: readonly ItineraryTheme[] = [
  {
    id: 'wildlife-wilderness',
    title: 'Wildlife & Wilderness',
    description:
      'Leopards, elephants, forests, field researchers, remote ecosystems, and nature without performance.',
    traveller: 'For the Seeker of Silence',
    ...imageForTheme('Wildlife & Wilderness'),
    subPackages: [
      {
        id: 'wildlife-wilderness-glimpse',
        tier: 'glimpse',
        name: 'The Glimpse',
        days: 2,
        coverage: 'half',
        priceAdd: 780,
        summary: 'Two dawn drives in leopard country, with the afternoons left to the lodge veranda.',
        hotel: 'Wild Coast Tented Lodge, Yala',
        activities: [
          'A private dawn safari in Yala Block I',
          'An evening waterhole drive',
          "A naturalist's briefing over dinner",
        ],
        inclusions: [
          'Two nights, cocoon suite',
          'Park fees and private jeep',
          'Resident naturalist throughout',
          'All meals and soft drinks',
        ],
      },
      {
        id: 'wildlife-wilderness-immersion',
        tier: 'immersion',
        name: 'The Immersion',
        days: 4,
        coverage: 'full',
        priceAdd: 1960,
        summary:
          "Four days across two wildernesses — Yala's leopards and Wilpattu's quieter, older forest.",
        hotel: 'Wild Coast Tented Lodge, Yala & Leopard Trails Camp, Wilpattu',
        activities: [
          'Full-day Yala leopard tracking',
          'Wilpattu villu circuit with a field researcher',
          'A night-sound walk with the camp naturalist',
          'Elephant gathering at Minneriya (seasonal)',
        ],
        inclusions: [
          'Four nights across two camps',
          'All park fees and private jeeps',
          'Dedicated naturalist and tracker',
          'All meals, wines and camp transfers',
        ],
      },
    ],
  },
  {
    id: 'ocean-discovery',
    title: 'Ocean & Discovery',
    description:
      'Whale paths, quiet lagoons, sailing days, and coastlines that reveal themselves with patience.',
    traveller: 'For the Unhurried Wanderer',
    ...imageForTheme('Ocean & Discovery'),
    subPackages: [
      {
        id: 'ocean-discovery-glimpse',
        tier: 'glimpse',
        name: 'The Glimpse',
        days: 2,
        coverage: 'half',
        priceAdd: 640,
        summary: 'A blue-whale morning off Mirissa, then the coast at its own unhurried pace.',
        hotel: 'Cape Weligama, Southern Coast',
        activities: [
          'A private whale-watching charter at first light',
          'An afternoon on the cliff-edge pool',
          'Sunset supper by the sea',
        ],
        inclusions: [
          'Two nights, ocean-view villa',
          'Private charter and marine guide',
          'Breakfast and one supper',
          'Coastal transfers',
        ],
      },
      {
        id: 'ocean-discovery-immersion',
        tier: 'immersion',
        name: 'The Immersion',
        days: 4,
        coverage: 'full',
        priceAdd: 1680,
        summary:
          'Four days of open water — whales, a sailing day, and the lagoons most travellers never see.',
        hotel: 'Cape Weligama & Amanwella, Tangalle',
        activities: [
          'Blue-whale charter with a marine biologist',
          'A full sailing day along the southern bays',
          'Kayaking the Rekawa lagoon at dusk',
          'Turtle-nesting watch with a conservation ranger',
        ],
        inclusions: [
          'Four nights across two properties',
          'All charters, skipper and marine guide',
          'All meals and a private beach supper',
          'Conservation contribution included',
        ],
      },
    ],
  },
  {
    id: 'heritage-memory',
    title: 'Heritage & Memory',
    description:
      'Ancient kingdoms, sacred spaces, archaeology, historians, and living traditions carried forward.',
    traveller: 'For the Heritage Guardian',
    ...imageForTheme('Heritage & Memory'),
    subPackages: [
      {
        id: 'heritage-memory-glimpse',
        tier: 'glimpse',
        name: 'The Glimpse',
        days: 2,
        coverage: 'half',
        priceAdd: 720,
        summary: "Sigiriya before the gates open, and Dambulla's cave ceilings in the cool of the day.",
        hotel: 'Water Garden Sigiriya',
        activities: [
          'The Sigiriya dawn ascent, ahead of the crowds',
          'The Dambulla cave temples with a resident scholar',
          'An evening of village cooking',
        ],
        inclusions: [
          'Two nights, garden villa',
          'Private dawn access and site fees',
          'Resident-scholar accompaniment',
          'All meals',
        ],
      },
      {
        id: 'heritage-memory-immersion',
        tier: 'immersion',
        name: 'The Immersion',
        days: 4,
        coverage: 'full',
        priceAdd: 1840,
        summary: 'Four days through three ancient capitals, read slowly and in the right order.',
        hotel: 'Water Garden Sigiriya & Ulagalla, Anuradhapura',
        activities: [
          'The Sigiriya dawn ascent',
          "Anuradhapura's sacred precinct and Bodhi Tree",
          'Polonnaruwa by bicycle at dawn',
          'A private evening at the Temple of the Tooth',
        ],
        inclusions: [
          'Four nights across two properties',
          'All site fees and private access',
          'Archaeologist accompaniment throughout',
          'All meals and inter-site transfers',
        ],
      },
    ],
  },
  {
    id: 'wellness-restoration',
    title: 'Wellness & Restoration',
    description:
      'Ayurveda, healing traditions, retreats, slow living, and the quiet work of personal renewal.',
    traveller: 'For the Restorer',
    ...imageForTheme('Wellness & Restoration'),
    subPackages: [
      {
        id: 'wellness-restoration-glimpse',
        tier: 'glimpse',
        name: 'The Glimpse',
        days: 2,
        coverage: 'half',
        priceAdd: 590,
        summary: 'Two days of Ayurvedic mornings and long, uninterrupted afternoons.',
        hotel: 'Santani Wellness, Kandy',
        activities: [
          "A physician's Ayurvedic consultation",
          'Two guided treatment mornings',
          'Sunrise yoga above the valley',
        ],
        inclusions: [
          'Two nights, valley-view chalet',
          'Consultation and prescribed treatments',
          'Full wellness cuisine',
          'Daily yoga and meditation',
        ],
      },
      {
        id: 'wellness-restoration-immersion',
        tier: 'immersion',
        name: 'The Immersion',
        days: 4,
        coverage: 'full',
        priceAdd: 1520,
        summary: 'A four-day prescribed programme — long enough for the treatments to actually work.',
        hotel: 'Santani Wellness, Kandy',
        activities: [
          'A full Ayurvedic assessment and personal programme',
          'Daily panchakarma treatments',
          'Forest-bathing and silent walking',
          'A herbal-garden morning with the resident physician',
        ],
        inclusions: [
          'Four nights, valley-view chalet',
          'Complete prescribed treatment course',
          'All wellness cuisine and herbal preparations',
          'Take-home preparations and follow-up notes',
        ],
      },
    ],
  },
  {
    id: 'rail-landscape',
    title: 'Rail & Landscape',
    description:
      'Hill country train journeys, tea estates, mountain routes, and scenery that changes by the hour.',
    traveller: 'For the Reflective Wanderer',
    ...imageForTheme('Rail & Landscape'),
    subPackages: [
      {
        id: 'rail-landscape-glimpse',
        tier: 'glimpse',
        name: 'The Glimpse',
        days: 2,
        coverage: 'half',
        priceAdd: 540,
        summary:
          'The Kandy–Ella leg in a reserved observation carriage, and a tea estate at the end of it.',
        hotel: '98 Acres Resort, Ella',
        activities: [
          'The Nanu Oya–Ella rail leg, reserved seating',
          'A private tea-estate walk and tasting',
          'Nine Arches Bridge at first light',
        ],
        inclusions: [
          'Two nights, estate chalet',
          'Reserved observation-carriage seats',
          'Estate tour and tasting',
          'Breakfast and one estate lunch',
        ],
      },
      {
        id: 'rail-landscape-immersion',
        tier: 'immersion',
        name: 'The Immersion',
        days: 4,
        coverage: 'full',
        priceAdd: 1440,
        summary:
          "The full hill-country line, ridden in stages, with a planter's bungalow at each pause.",
        hotel: 'Ceylon Tea Trails, Bogawantalawa & 98 Acres Resort, Ella',
        activities: [
          'The complete Kandy–Ella line, ridden in two stages',
          'A tea-estate bungalow stay with a resident planter',
          'Plucking and factory morning with an estate manager',
          'Highland walking on the Horton Plains escarpment',
        ],
        inclusions: [
          'Four nights across two bungalows',
          'All reserved rail seating and transfers',
          'Private estate access and tastings',
          'All meals, afternoon teas and house drinks',
        ],
      },
    ],
  },
  {
    id: 'culture-human-connection',
    title: 'Culture & Human Connection',
    description:
      'Artisans, musicians, dancers, family traditions, private introductions, and everyday Sri Lanka.',
    traveller: 'For the Curious Witness',
    ...imageForTheme('Culture & Human Connection'),
    subPackages: [
      {
        id: 'culture-human-connection-glimpse',
        tier: 'glimpse',
        name: 'The Glimpse',
        days: 2,
        coverage: 'half',
        priceAdd: 610,
        summary: 'Two days in Kandy — a dance rehearsal, a temple ritual, and a family kitchen.',
        hotel: 'Kings Pavilion, Kandy',
        activities: [
          'A private Kandyan dance rehearsal',
          'The evening puja at the Temple of the Tooth',
          'A family kitchen and market morning',
        ],
        inclusions: [
          'Two nights, heritage suite',
          'Private introductions and interpreter',
          'Temple access and offerings',
          'All meals',
        ],
      },
      {
        id: 'culture-human-connection-immersion',
        tier: 'immersion',
        name: 'The Immersion',
        days: 4,
        coverage: 'full',
        priceAdd: 1580,
        summary:
          'Four days with the people who keep the crafts alive — artisans, musicians and their workshops.',
        hotel: 'Kings Pavilion, Kandy & Wallawwa, Colombo',
        activities: [
          'A private Kandyan dance rehearsal and drum lesson',
          "A mask-carver's workshop in Ambalangoda",
          "A silversmith's studio afternoon in Kandy",
          'A village cooking day with a family, start to finish',
        ],
        inclusions: [
          'Four nights across two properties',
          'All artisan fees and materials',
          'Dedicated interpreter throughout',
          'All meals and a farewell supper',
        ],
      },
    ],
  },
  {
    id: 'shared-heritage',
    title: 'Shared Heritage',
    description:
      'Rolling tea estates, timeless hill stations, railway journeys, old gardens, and civic architecture.',
    traveller: 'For the Thoughtful Historian',
    ...imageForTheme('Shared Heritage'),
    subPackages: [
      {
        id: 'shared-heritage-glimpse',
        tier: 'glimpse',
        name: 'The Glimpse',
        days: 2,
        coverage: 'half',
        priceAdd: 560,
        summary: "Galle Fort's ramparts and a hill-station afternoon — two days of borrowed architecture.",
        hotel: 'Amangalla, Galle Fort',
        activities: [
          'A Galle Fort rampart walk with a historian',
          'The Dutch Reformed Church and archive',
          'Colonial-era afternoon tea on the veranda',
        ],
        inclusions: [
          'Two nights, chamber suite',
          'Historian-led walking tour',
          'Archive and museum access',
          'Breakfast and afternoon tea',
        ],
      },
      {
        id: 'shared-heritage-immersion',
        tier: 'immersion',
        name: 'The Immersion',
        days: 4,
        coverage: 'full',
        priceAdd: 1500,
        summary:
          "Four days reading the island's shared chapter — fort towns, hill stations and old gardens.",
        hotel: 'Amangalla, Galle Fort & Grand Hotel, Nuwara Eliya',
        activities: [
          'Galle Fort ramparts, archive and church',
          "Nuwara Eliya's hill-station architecture and old gardens",
          'The Colombo civic and Cinnamon Gardens circuit',
          'A private library afternoon with a resident historian',
        ],
        inclusions: [
          'Four nights across two heritage properties',
          'Historian accompaniment throughout',
          'All archive, museum and garden access',
          'All meals and afternoon teas',
        ],
      },
    ],
  },
] as const
