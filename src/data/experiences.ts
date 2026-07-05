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

export type Experience = {
  id: string
  destinationId: string
  title: string
  slug: string
  heroImage: string
  description: string
  story: string
  duration: string
  bestSeason: string
  difficulty: string
  luxuryLevel: string
  journeyMoods: string[]
  suitableFor: string[]
  included: string[]
  highlights: string[]
  gallery: string[]
  relatedExperiences: string[]
  futureActivityIds: string[]
}

type ExperienceSeed = {
  destinationId: string
  destinationName: string
  bestSeason: string
  heroImage: string
  journeyMoods: string[]
  luxuryLevel: string
  experiences: Array<{
    title: string
    description: string
    duration: string
    difficulty?: string
    included?: string[]
    highlights?: string[]
    suitableFor?: string[]
    gallery?: string[]
    story?: string
  }>
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

const destinationExperienceSeeds: ExperienceSeed[] = [
  {
    destinationId: 'mirissa',
    destinationName: 'Mirissa',
    bestSeason: 'December - April',
    heroImage: mirissaBoats,
    journeyMoods: ['Romantic', 'Oceanic', 'Luxury', 'Photography'],
    luxuryLevel: 'Private Luxury',
    experiences: [
      {
        title: 'Private Whale Encounter',
        description: 'A quieter ocean morning aboard a private vessel with a marine naturalist.',
        duration: '4 Hours',
        included: ['Luxury transfer', 'Breakfast', 'Marine naturalist', 'Private vessel'],
        highlights: ['Blue whales', 'Dolphins', 'Morning sunrise', 'Champagne breakfast'],
        story:
          "Rather than joining dozens of tourist boats, depart before sunrise aboard a private vessel for a quieter encounter with the Indian Ocean's largest visitors.",
      },
      {
        title: 'Golden Hour Sailing',
        description: 'A soft coastal sail as the bay turns amber and the evening slows.',
        duration: '3 Hours',
      },
      {
        title: 'Barefoot Beach Dining',
        description: 'A candlelit table on the sand, designed around privacy, seafood and sea air.',
        duration: '2.5 Hours',
      },
      {
        title: 'Luxury Ayurveda',
        description: 'A coastal wellness ritual with warm oils, herbal infusions and ocean quiet.',
        duration: '2 Hours',
      },
      {
        title: 'Hidden Beach Picnic',
        description: 'A secluded cove, linen picnic and the luxury of having nowhere else to be.',
        duration: 'Half Day',
      },
      {
        title: 'Ocean Photography',
        description: 'A guided light-and-water session for travellers who collect atmosphere.',
        duration: '2 Hours',
      },
    ],
  },
  {
    destinationId: 'ella',
    destinationName: 'Ella',
    bestSeason: 'January - April',
    heroImage: teaEstate,
    journeyMoods: ['Scenic', 'Romantic', 'Slow Travel', 'Soft Adventure'],
    luxuryLevel: 'Refined Comfort',
    experiences: [
      {
        title: 'Nine Arches Sunrise',
        description: 'Arrive before the crowds as mist lifts around the railway arches.',
        duration: '2 Hours',
      },
      {
        title: 'Tea Estate Experience',
        description: 'Walk through emerald rows with a planter before a private estate breakfast.',
        duration: '3 Hours',
      },
      {
        title: 'Luxury Train Journey',
        description: 'The famous hill-country railway arranged with the right seats, timing and ease.',
        duration: 'Half Day',
      },
      {
        title: 'Private Tea Tasting',
        description: 'A hosted tasting of single-estate teas in a quiet bungalow setting.',
        duration: '90 Minutes',
      },
      {
        title: 'Waterfall Walk',
        description: 'A gentle guided walk toward cool water, forest shade and mountain air.',
        duration: '3 Hours',
      },
      {
        title: 'Mountain Picnic',
        description: 'A linen-set picnic above the valley, timed for the softest afternoon light.',
        duration: 'Half Day',
      },
    ],
  },
  {
    destinationId: 'sigiriya',
    destinationName: 'Sigiriya',
    bestSeason: 'January - September',
    heroImage: sigiriyaDawn,
    journeyMoods: ['Wonder', 'Culture', 'Dawn', 'Luxury'],
    luxuryLevel: 'Signature Luxury',
    experiences: [
      {
        title: 'Sunrise Rock Climb',
        description: 'A dawn ascent of the citadel before the heat and crowds arrive.',
        duration: '3 Hours',
      },
      {
        title: 'Private Archaeologist Tour',
        description: 'Ancient gardens and frescoes interpreted through expert private guiding.',
        duration: '2.5 Hours',
      },
      {
        title: 'Village Breakfast',
        description: 'A slow rural breakfast after the morning light has crossed the fields.',
        duration: '2 Hours',
      },
      {
        title: 'Helicopter Arrival',
        description: 'Approach the rock fortress from above for an unforgettable first chapter.',
        duration: '45 Minutes',
        difficulty: 'Easy',
      },
      {
        title: 'Hot Air Balloon',
        description: 'Float over jungle, lakes and ancient landscapes as the island wakes.',
        duration: '3 Hours',
      },
      {
        title: 'Ancient Kingdom Walk',
        description: 'A quiet ground-level journey through gardens, waterworks and royal memory.',
        duration: '2 Hours',
      },
    ],
  },
  {
    destinationId: 'tangalle',
    destinationName: 'Tangalle',
    bestSeason: 'December - April',
    heroImage: blueWhaleSunset,
    journeyMoods: ['Secluded', 'Romantic', 'Restorative'],
    luxuryLevel: 'Private Luxury',
    experiences: [
      { title: 'Secluded Bay Day', description: 'A hosted beach day on a quieter sweep of southern coast.', duration: 'Half Day' },
      { title: 'Turtle Coast Evening', description: 'A conservation-led twilight encounter along the nesting shore.', duration: '3 Hours' },
      { title: 'Villa Sundowners', description: 'An intimate golden-hour ritual arranged at a private coastal villa.', duration: '2 Hours' },
      { title: 'Lagoon Canoe Morning', description: 'A silent paddle through birdlife, mangrove shade and warm light.', duration: '2.5 Hours' },
    ],
  },
  {
    destinationId: 'rekawa',
    destinationName: 'Rekawa',
    bestSeason: 'January - April',
    heroImage: blueWhaleSunset,
    journeyMoods: ['Quiet', 'Nature-led', 'Romantic'],
    luxuryLevel: 'Conscious Luxury',
    experiences: [
      { title: 'Twilight Turtle Watch', description: 'A careful evening with conservation hosts and soft shoreline light.', duration: '3 Hours' },
      { title: 'Lagoon Edge Walk', description: 'A slow guided walk where waterbirds and village rhythms set the pace.', duration: '2 Hours' },
      { title: 'Private Beach Supper', description: 'A quiet dinner arranged around lanterns, tide and southern seafood.', duration: '2.5 Hours' },
      { title: 'Coastal Stillness Ritual', description: 'A restorative morning of movement, herbal tea and open water.', duration: '90 Minutes' },
    ],
  },
  {
    destinationId: 'hiriketiya',
    destinationName: 'Hiriketiya',
    bestSeason: 'December - April',
    heroImage: poolVilla,
    journeyMoods: ['Contemporary', 'Coastal', 'Soft Adventure'],
    luxuryLevel: 'Boutique Luxury',
    experiences: [
      { title: 'Soft Surf Morning', description: 'A gentle private surf session before the bay grows lively.', duration: '2 Hours' },
      { title: 'Design-Led Villa Lunch', description: 'A tucked-away villa meal shaped by modern coastal simplicity.', duration: '2 Hours' },
      { title: 'Crescent Bay Walk', description: 'A hosted walk around the bay, beach cafes and quieter corners.', duration: '90 Minutes' },
      { title: 'Hidden Headland Sundown', description: 'A short scenic walk to a private sunset viewpoint.', duration: '2 Hours' },
    ],
  },
  {
    destinationId: 'mawella',
    destinationName: 'Mawella',
    bestSeason: 'December - April',
    heroImage: galleFort,
    journeyMoods: ['Secluded', 'Slow', 'Romantic'],
    luxuryLevel: 'Barefoot Luxury',
    experiences: [
      { title: 'Long Beach Morning', description: 'A hosted shoreline walk on one of the south’s quieter beaches.', duration: '90 Minutes' },
      { title: 'Private Villa Dining', description: 'A chef-led meal served in the stillness of a private residence.', duration: '2.5 Hours' },
      { title: 'Lagoon Excursion', description: 'A gentle inland water journey through village edges and birdlife.', duration: '3 Hours' },
      { title: 'Coconut Grove Picnic', description: 'A shaded picnic designed for privacy, conversation and sea breeze.', duration: '2 Hours' },
    ],
  },
  {
    destinationId: 'dickwella',
    destinationName: 'Dickwella',
    bestSeason: 'December - April',
    heroImage: mirissaBoats,
    journeyMoods: ['Coastal', 'Local', 'Relaxed'],
    luxuryLevel: 'Curated Comfort',
    experiences: [
      { title: 'Temple and Bay Drive', description: 'A gentle coastal circuit through temples, coves and local life.', duration: '3 Hours' },
      { title: 'Quiet Cove Swim', description: 'A private swim stop selected for calm water and fewer visitors.', duration: '2 Hours' },
      { title: 'Southern Market Morning', description: 'A hosted look at produce, spice and the everyday coast.', duration: '90 Minutes' },
      { title: 'Sunset Transfer Ritual', description: 'A scenic drive timed to turn movement into part of the journey.', duration: '2 Hours' },
    ],
  },
  {
    destinationId: 'nuwara-eliya',
    destinationName: 'Nuwara Eliya',
    bestSeason: 'January - April',
    heroImage: teaEstate,
    journeyMoods: ['Elegant', 'Reflective', 'Cool-climate'],
    luxuryLevel: 'Heritage Luxury',
    experiences: [
      { title: 'Estate High Tea', description: 'A private high tea among cool gardens and old-world hill-country charm.', duration: '2 Hours' },
      { title: 'Tea Factory Walk', description: 'A guided encounter with plucking, rolling and the craft of Ceylon tea.', duration: '2.5 Hours' },
      { title: 'Garden Morning', description: 'A quiet botanical walk while the air is still crisp and clear.', duration: '90 Minutes' },
      { title: 'Colonial Bungalow Lunch', description: 'A slow lunch in a heritage bungalow above the tea fields.', duration: '2 Hours' },
    ],
  },
  {
    destinationId: 'haputale',
    destinationName: 'Haputale',
    bestSeason: 'January - April',
    heroImage: teaEstate,
    journeyMoods: ['Quiet', 'Scenic', 'Reflective'],
    luxuryLevel: 'Refined Comfort',
    experiences: [
      { title: 'Ridge View Sunrise', description: 'A private viewpoint morning as light spills over tea valleys.', duration: '2 Hours' },
      { title: 'Tea Ridge Walk', description: 'A gentle hosted trail across highland estates and village paths.', duration: '3 Hours' },
      { title: 'Planter Bungalow Tea', description: 'An intimate tea service in the quiet of a hill-country bungalow.', duration: '90 Minutes' },
      { title: 'Cloud Forest Picnic', description: 'A cool-climate picnic framed by mist, ferns and mountain silence.', duration: 'Half Day' },
    ],
  },
  {
    destinationId: 'anuradhapura',
    destinationName: 'Anuradhapura',
    bestSeason: 'January - September',
    heroImage: oilLamps,
    journeyMoods: ['Sacred', 'Reflective', 'Historic'],
    luxuryLevel: 'Cultural Luxury',
    experiences: [
      { title: 'Sacred Stupa Dawn', description: 'A quiet morning among white stupas, pilgrims and first light.', duration: '2 Hours' },
      { title: 'Private Moonstone Walk', description: 'A scholar-led path through thresholds, carvings and ancient symbolism.', duration: '2 Hours' },
      { title: 'Reservoir Sunset', description: 'A still evening by ancient waterworks and wide northern sky.', duration: '90 Minutes' },
      { title: 'Temple Offering Ritual', description: 'A respectful hosted encounter with flowers, lamps and living devotion.', duration: '90 Minutes' },
    ],
  },
  {
    destinationId: 'polonnaruwa',
    destinationName: 'Polonnaruwa',
    bestSeason: 'January - September',
    heroImage: monks,
    journeyMoods: ['Historic', 'Quiet', 'Architectural'],
    luxuryLevel: 'Cultural Luxury',
    experiences: [
      { title: 'Stone Buddha Walk', description: 'A slow private circuit through the city’s most serene carved figures.', duration: '2 Hours' },
      { title: 'Ancient Capital By Bicycle', description: 'A gentle ride through shaded ruins and reservoir breezes.', duration: '3 Hours' },
      { title: 'Reservoir Lunch', description: 'A simple, elegant lunch arranged near the old royal waters.', duration: '2 Hours' },
      { title: 'Architectural Fragments Tour', description: 'A guide-led reading of columns, thresholds and quiet royal spaces.', duration: '2 Hours' },
    ],
  },
  {
    destinationId: 'trincomalee',
    destinationName: 'Trincomalee',
    bestSeason: 'May - September',
    heroImage: monks,
    journeyMoods: ['Spiritual', 'Oceanic', 'Summer'],
    luxuryLevel: 'Coastal Luxury',
    experiences: [
      { title: 'Temple Cliff Morning', description: 'A hosted visit to the cliff temple before the day gathers heat.', duration: '2 Hours' },
      { title: 'Private Bay Swim', description: 'A calm-water morning selected for clarity, privacy and ease.', duration: '2 Hours' },
      { title: 'Eastern Coast Drive', description: 'A scenic hosted drive through coves, villages and temple viewpoints.', duration: 'Half Day' },
      { title: 'Harbour Light Supper', description: 'A quiet seafood supper influenced by the city’s old harbour mood.', duration: '2 Hours' },
    ],
  },
  {
    destinationId: 'nilaveli',
    destinationName: 'Nilaveli',
    bestSeason: 'May - September',
    heroImage: blueWhaleSunset,
    journeyMoods: ['Beach', 'Restorative', 'Simple'],
    luxuryLevel: 'Barefoot Luxury',
    experiences: [
      { title: 'Pigeon Island Snorkel', description: 'A carefully timed boat outing to clearer water and reef life.', duration: '3 Hours' },
      { title: 'Long Beach Picnic', description: 'A shaded picnic on pale sand with the eastern sea in view.', duration: '2 Hours' },
      { title: 'Dawn Swim Ritual', description: 'A calm early swim followed by fresh fruit and tea on the shore.', duration: '90 Minutes' },
      { title: 'Fisher Coast Walk', description: 'A soft local walk along boats, nets and morning shoreline life.', duration: '90 Minutes' },
    ],
  },
  {
    destinationId: 'jaffna',
    destinationName: 'Jaffna',
    bestSeason: 'January - September',
    heroImage: brassLamp,
    journeyMoods: ['Curious', 'Cultural', 'Reflective'],
    luxuryLevel: 'Cultural Luxury',
    experiences: [
      { title: 'Temple Dawn Visit', description: 'A respectful early encounter with colour, bells and northern devotion.', duration: '2 Hours' },
      { title: 'Tamil Table Experience', description: 'A hosted meal that introduces the flavours and generosity of Jaffna.', duration: '2.5 Hours' },
      { title: 'Island Causeway Drive', description: 'A slow drive over lagoons, palmyrah landscapes and northern light.', duration: 'Half Day' },
      { title: 'Palmyrah Craft Walk', description: 'A cultural walk through craft, resilience and local storytelling.', duration: '2 Hours' },
    ],
  },
  {
    destinationId: 'yala',
    destinationName: 'Yala',
    bestSeason: 'February - September',
    heroImage: leopardFeature,
    journeyMoods: ['Wildlife', 'Dramatic', 'Immersive'],
    luxuryLevel: 'Safari Luxury',
    experiences: [
      { title: 'Private Leopard Drive', description: 'A naturalist-led safari timed for quieter movement and better light.', duration: 'Half Day' },
      { title: 'Wild Coast Sundown', description: 'A dramatic coastal pause where dry-zone wilderness meets the sea.', duration: '2 Hours' },
      { title: 'Birdlife Morning', description: 'A gentler safari focused on wetlands, calls and overlooked details.', duration: '3 Hours' },
      { title: 'Naturalist Campfire', description: 'An evening of stories, tracks and wilderness context after the drive.', duration: '90 Minutes' },
    ],
  },
  {
    destinationId: 'colombo',
    destinationName: 'Colombo',
    bestSeason: 'Year-round',
    heroImage: poolVilla,
    journeyMoods: ['Arrival', 'Urban', 'Hosted'],
    luxuryLevel: 'Urban Luxury',
    experiences: [
      { title: 'Garden Villa Arrival', description: 'A composed first landing with tea, shade and a sense of island ease.', duration: '90 Minutes' },
      { title: 'Private Gallery Walk', description: 'A hosted introduction to Colombo’s contemporary art and design mood.', duration: '2 Hours' },
      { title: 'Old Club Aperitif', description: 'A refined early evening shaped by heritage rooms and slow conversation.', duration: '90 Minutes' },
      { title: 'Hosted Market Table', description: 'A polished food-led glimpse of spice, produce and city appetite.', duration: '2.5 Hours' },
    ],
  },
  {
    destinationId: 'kandy',
    destinationName: 'Kandy',
    bestSeason: 'January - April',
    heroImage: kandyanDancer,
    journeyMoods: ['Ceremonial', 'Cultural', 'Inland'],
    luxuryLevel: 'Heritage Luxury',
    experiences: [
      { title: 'Temple Bell Evening', description: 'A carefully timed visit around ceremony, lamps and lake reflection.', duration: '2 Hours' },
      { title: 'Botanical Garden Walk', description: 'A quiet private walk through palms, orchids and colonial-era planting.', duration: '2 Hours' },
      { title: 'Kandyan Performance Salon', description: 'A more intimate interpretation of rhythm, costume and tradition.', duration: '90 Minutes' },
      { title: 'Lake View Tea', description: 'A slow tea pause above the city’s ceremonial heart.', duration: '90 Minutes' },
    ],
  },
  {
    destinationId: 'galle-fort',
    destinationName: 'Galle Fort',
    bestSeason: 'December - April',
    heroImage: galleFort,
    journeyMoods: ['Romantic', 'Historic', 'Sunset'],
    luxuryLevel: 'Boutique Luxury',
    experiences: [
      { title: 'Rampart Sunset Walk', description: 'A golden-hour walk along fort walls, sea wind and old stone.', duration: '90 Minutes' },
      { title: 'Private Courtyard Dinner', description: 'A candlelit meal inside a quiet heritage courtyard.', duration: '2.5 Hours' },
      { title: 'Antique Lanes Morning', description: 'A hosted wander through boutiques, galleries and colonial details.', duration: '2 Hours' },
      { title: 'Fort Photography Hour', description: 'A soft-light session through ochre lanes and sea-facing ramparts.', duration: '90 Minutes' },
    ],
  },
  {
    destinationId: 'bentota',
    destinationName: 'Bentota',
    bestSeason: 'December - April',
    heroImage: poolVilla,
    journeyMoods: ['Luxury', 'Beach', 'Easy Arrival'],
    luxuryLevel: 'Resort Luxury',
    experiences: [
      { title: 'Private River Cruise', description: 'A slow boat journey through mangroves, waterbirds and river shade.', duration: '2 Hours' },
      { title: 'Beach Resort Day', description: 'A polished coastal pause with pool, ocean and attentive hosting.', duration: 'Half Day' },
      { title: 'Cinnamon Garden Visit', description: 'A fragrant inland stop shaped by spice, craft and local knowledge.', duration: '2 Hours' },
      { title: 'Sunset Seafood Table', description: 'An easy west-coast dinner arranged around the evening tide.', duration: '2 Hours' },
    ],
  },
  {
    destinationId: 'hikkaduwa',
    destinationName: 'Hikkaduwa',
    bestSeason: 'December - April',
    heroImage: mirissaBoats,
    journeyMoods: ['Beach', 'Lively', 'Marine'],
    luxuryLevel: 'Curated Comfort',
    experiences: [
      { title: 'Coral Garden Swim', description: 'A guided water morning focused on reef colour and gentle movement.', duration: '2 Hours' },
      { title: 'Coastal Cafe Crawl', description: 'A bright, easygoing taste of the town’s beach rhythm.', duration: '2 Hours' },
      { title: 'Southern Coast Drive', description: 'A flexible drive linking coves, viewpoints and quieter swimming stops.', duration: 'Half Day' },
      { title: 'Marine Photography Walk', description: 'A light-led coastal walk for travellers drawn to water and texture.', duration: '90 Minutes' },
    ],
  },
  {
    destinationId: 'arugam-bay',
    destinationName: 'Arugam Bay',
    bestSeason: 'May - September',
    heroImage: mirissaBoats,
    journeyMoods: ['Laid-back', 'Beach', 'Soft Adventure'],
    luxuryLevel: 'Barefoot Comfort',
    experiences: [
      { title: 'Surf Point Sunrise', description: 'A gentle early visit to watch the bay’s famous wave come alive.', duration: '90 Minutes' },
      { title: 'Lagoon Wildlife Drive', description: 'A soft adventure through water, birds and eastern dry-zone edges.', duration: '3 Hours' },
      { title: 'Beach Cafe Evening', description: 'An informal coastal evening curated with the right table and timing.', duration: '2 Hours' },
      { title: 'Secret Bay Picnic', description: 'A simple hosted picnic away from the busier surf-town pulse.', duration: 'Half Day' },
    ],
  },
  {
    destinationId: 'bandarawela',
    destinationName: 'Bandarawela',
    bestSeason: 'January - April',
    heroImage: poolVilla,
    journeyMoods: ['Colonial', 'Quiet', 'Highland'],
    luxuryLevel: 'Heritage Comfort',
    experiences: [
      { title: 'Bungalow Garden Lunch', description: 'A quiet hill-country lunch among old gardens and cool air.', duration: '2 Hours' },
      { title: 'Scenic Tea Drive', description: 'A composed drive through ridges, estates and soft mountain turns.', duration: 'Half Day' },
      { title: 'Highland Village Walk', description: 'A gentle walk through market life and overlooked colonial details.', duration: '90 Minutes' },
      { title: 'Fireplace Tea Ritual', description: 'A cool-evening pause designed around tea, warmth and stillness.', duration: '90 Minutes' },
    ],
  },
  {
    destinationId: 'adams-peak',
    destinationName: "Adam's Peak",
    bestSeason: 'January - April',
    heroImage: oilLamps,
    journeyMoods: ['Spiritual', 'Sunrise', 'Meaningful'],
    luxuryLevel: 'Purposeful Comfort',
    experiences: [
      { title: 'Pilgrim Trail Sunrise', description: 'A carefully supported ascent for travellers seeking shared meaning.', duration: 'Overnight' },
      { title: 'Tea Valley Recovery', description: 'A restorative post-climb pause with warm food and mountain air.', duration: '2 Hours' },
      { title: 'Lamp-Lit Departure', description: 'A quiet beginning among pilgrims, steps and pre-dawn anticipation.', duration: '1 Hour' },
      { title: 'Summit Reflection', description: 'A guided moment of stillness after the effort of the climb.', duration: '45 Minutes' },
    ],
  },
  {
    destinationId: 'belihuloya',
    destinationName: 'Belihuloya',
    bestSeason: 'January - April',
    heroImage: teaEstate,
    journeyMoods: ['Nature', 'Soft Adventure', 'Quiet'],
    luxuryLevel: 'Nature Comfort',
    experiences: [
      { title: 'Canoe Valley Morning', description: 'A calm water journey through green valley edges and birdlife.', duration: '2 Hours' },
      { title: 'Gentle Trekking Day', description: 'A soft adventure route matched to pace, weather and mood.', duration: 'Half Day' },
      { title: 'Birdsong Breakfast', description: 'An early outdoor breakfast set where the valley is still waking.', duration: '90 Minutes' },
      { title: 'River Stone Picnic', description: 'A simple private picnic beside cool water and forest shade.', duration: '2 Hours' },
    ],
  },
]

const createExperience = (seed: ExperienceSeed, index: number): Experience => {
  const entry = seed.experiences[index]
  const slug = slugify(entry.title)
  const id = `${seed.destinationId}-${slug}`
  const gallery = entry.gallery ?? [seed.heroImage, teaEstate, poolVilla].filter(Boolean)

  return {
    id,
    destinationId: seed.destinationId,
    title: entry.title,
    slug,
    heroImage: seed.heroImage,
    description: entry.description,
    story:
      entry.story ??
      `${entry.title} turns ${seed.destinationName} into a more intimate chapter, shaped by timing, privacy and the kind of detail that lets the place reveal itself slowly.`,
    duration: entry.duration,
    bestSeason: seed.bestSeason,
    difficulty: entry.difficulty ?? 'Easy',
    luxuryLevel: seed.luxuryLevel,
    journeyMoods: seed.journeyMoods,
    suitableFor: entry.suitableFor ?? ['Couples', 'Private journeys', 'Curious travellers'],
    included: entry.included ?? ['Private host', 'Curated timing', 'Refreshments', 'Door-to-door coordination'],
    highlights: entry.highlights ?? ['Atmospheric timing', 'Private guiding', 'Local context', 'Unhurried pace'],
    gallery,
    relatedExperiences: [],
    futureActivityIds: [],
  }
}

export const experiences: Experience[] = destinationExperienceSeeds.flatMap((seed) =>
  seed.experiences.map((_, index) => createExperience(seed, index)),
)

export const experiencesById = Object.fromEntries(
  experiences.map((experience) => [experience.id, experience]),
) as Record<string, Experience>

const canonicalDestinationExperienceIds = Object.fromEntries(
  destinationExperienceSeeds.map((seed) => [
    seed.destinationId,
    seed.experiences.map((entry) => `${seed.destinationId}-${slugify(entry.title)}`),
  ]),
) as Record<string, string[]>

const destinationExperienceAliases: Record<string, string> = {
  galle: 'galle-fort',
  'hidden-beaches': 'tangalle',
  'mirissa-romantic': 'mirissa',
  'mountain-retreats': 'ella',
  'private-villas': 'tangalle',
  'sunset-dining': 'galle-fort',
  'tangalle-romantic': 'tangalle',
  'ella-romantic-central': 'ella',
  'ella-romantic-uva': 'ella',
  'nuwara-eliya-romantic': 'nuwara-eliya',
  'haputale-romantic': 'haputale',
  'kandy-romantic': 'kandy',
  'trincomalee-romantic': 'trincomalee',
  'jaffna-romantic': 'jaffna',
  'yala-romantic': 'yala',
}

export const getExperienceIdsForDestination = (destinationId: string) => {
  const canonicalId = destinationExperienceAliases[destinationId] ?? destinationId

  return canonicalDestinationExperienceIds[canonicalId] ?? []
}

export const destinationExperienceIds = Object.fromEntries(
  [
    ...Object.keys(canonicalDestinationExperienceIds),
    ...Object.keys(destinationExperienceAliases),
  ].map((destinationId) => [destinationId, getExperienceIdsForDestination(destinationId)]),
) as Record<string, string[]>

for (const experienceIds of Object.values(canonicalDestinationExperienceIds)) {
  experienceIds.forEach((experienceId, index) => {
    experiencesById[experienceId].relatedExperiences = experienceIds
      .filter((relatedExperienceId) => relatedExperienceId !== experienceId)
      .slice(index > 0 ? 0 : 1, index > 0 ? 2 : 3)
  })
}
