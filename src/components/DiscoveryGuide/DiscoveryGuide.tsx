import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import './DiscoveryGuide.css'
import galle from '../../assets/images/Galle.jpeg'
import galleFaceBeach from '../../assets/images/Galle face beach.jpeg'
import theruFestival from '../../assets/images/theru festival.jpg'
import bopathElla from '../../assets/images/Bopath Ella.jpeg'
import naalandaGedige from '../../assets/images/Naalanda gedige Matale.jpg'
import kelaniTempleDetail from '../../assets/images/Kelani temple(1).JPG'
import heroForest from '../../assets/about/hero-forest.jpg'
import reef from '../../assets/experiences/reef.jpg'
import dhoni from '../../assets/experiences/dhoni.jpg'
import { experienceImages } from '../ExperiencesPage/images'
import { RegionCard } from './RegionCard'
import { RegionIcon, type RegionIconId } from './RegionIcon'

const images = {
  westernGateway: galleFaceBeach,
  southernArc: galle,
  wildSouth: experienceImages.leopardFeature,
  eastCoast: experienceImages.mirissaBoats,
  hillCountry: experienceImages.hillCountry,
  ancientKingdoms: experienceImages.sigiriyaMain,
  northernReaches: theruFestival,
} as const

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const

type GalleryImage = { src: string; alt: string }

const regions = [
  {
    name: 'The Western Gateway',
    journeyRegion: 'The Western Gateway',
    icon: 'city' as RegionIconId,
    teaser: 'Garden villas, old clubs, and a lagoon-lit welcome to the island.',
    climate: 'Warm & Coastal',
    travelStyle: 'Arrival & Ease',
    bestMonths: 'November to March, with Colombo rewarding year-round',
    bestMonthsShort: 'Nov – Mar',
    activeMonths: [0, 1, 2, 10, 11],
    image: images.westernGateway,
    gallery: [
      { src: images.westernGateway, alt: 'Galle Face Green and the Colombo seafront at dusk' },
      { src: experienceImages.queenVictoriaStatue, alt: 'Colonial-era civic monument in Colombo' },
      { src: experienceImages.poolVilla, alt: 'Private garden villa pool near Colombo' },
    ] satisfies GalleryImage[],
    overview:
      "The island's first welcome is rarely just an arrival. Colombo's garden houses, galleries, old clubs, and lagoon light create a soft landing into Sri Lankan life.",
    landscapes: 'Coastal capital, lagoon, garden villas, galleries, old institutions',
    destinations: ['Colombo', 'Negombo', 'Bentota', 'Kalutara'],
    experiences: ['Private city introductions', 'Gallery and garden-house visits', 'Lagoon-side arrivals'],
    heritageHighlights: {
      title: 'Heritage Highlights',
      places: ['Galle Face Hotel', 'Old Parliament Building', 'General Post Office'],
      note: "These civic and seafront landmarks reveal another chapter of Colombo's story, held quietly within the texture of arrival.",
    },
    editorialNote:
      'Best for travellers who want the island to begin quietly: a hosted arrival, a first dinner with context, and enough time to settle before moving on.',
  },
  {
    name: 'The Southern Arc',
    journeyRegion: 'The Southern Arc',
    icon: 'coast' as RegionIconId,
    teaser: 'Fortified towns, golden light, and villas held close to the palms.',
    climate: 'Sunny & Coastal',
    travelStyle: 'Coastal Romance',
    bestMonths: 'November to April',
    bestMonthsShort: 'Nov – Apr',
    activeMonths: [0, 1, 2, 3, 10, 11],
    image: images.southernArc,
    gallery: [
      { src: images.southernArc, alt: 'Historic Galle streets under golden light' },
      { src: experienceImages.galleFort, alt: 'Galle Fort ramparts above the southern coast' },
      { src: experienceImages.poolVilla, alt: 'Private coastal villa near Galle' },
    ] satisfies GalleryImage[],
    overview:
      'The southern coast is Sri Lanka in golden light: fortified towns, quiet coves, sea air, and villas held close to the palms.',
    landscapes: 'Golden beaches, colonial streets, cinnamon gardens, reef-fringed bays',
    destinations: ['Galle', 'Weligama', 'Tangalle', 'Mirissa'],
    experiences: ['Private coastal residences', 'Cinnamon estate visits', 'Sunset suppers by the sea'],
    heritageHighlights: {
      title: 'Heritage Highlights',
      places: ['Galle Fort', 'Dutch Reformed Church', 'National Maritime Museum'],
      note: 'The coast carries older layers of trade, architecture, and seafaring memory without needing to become a list of attractions.',
    },
    editorialNote:
      'Best when the coast is treated as atmosphere rather than beach time: ramparts at golden hour, cinnamon gardens, private residences, and dinners that unfold without spectacle.',
  },
  {
    name: 'The Wild South',
    journeyRegion: 'The Wild South',
    icon: 'wild' as RegionIconId,
    teaser: 'Leopard country, dry-zone wilderness, and patient wild encounters.',
    climate: 'Dry & Elemental',
    travelStyle: 'Wildlife & Wilderness',
    bestMonths: 'February to September for dry-zone wilderness',
    bestMonthsShort: 'Feb – Sep',
    activeMonths: [1, 2, 3, 4, 5, 6, 7, 8],
    image: images.wildSouth,
    gallery: [
      { src: images.wildSouth, alt: 'Sri Lankan leopard resting on rock at dusk' },
      { src: experienceImages.leopardCircuit, alt: 'Wild leopard moving through dry-zone forest' },
      { src: heroForest, alt: 'Dense wilderness forest in southern Sri Lanka' },
    ] satisfies GalleryImage[],
    overview:
      'Beyond the softer coast, the south becomes elemental: dry-zone forest, leopard country, birdlife, and a shoreline that feels closer to wilderness than resort.',
    landscapes: 'Leopard country, dry-zone forest, wild coast, wetlands, birdlife',
    destinations: ['Yala', 'Bundala', 'Rekawa', 'Tangalle'],
    experiences: ['Quiet leopard tracking', 'Naturalist-led field mornings', 'Wild coastal retreats'],
    editorialNote:
      'Best for travellers who want nature held with patience: fewer promises, better timing, and guides who understand when not to speak.',
  },
  {
    name: 'The East Coast',
    journeyRegion: 'The East Coast',
    icon: 'wave' as RegionIconId,
    teaser: 'Clear water, temple cliffs, and a gentler summer coastline.',
    climate: 'Warm & Calm Seas',
    travelStyle: 'Sun & Slow Water',
    bestMonths: 'April to September',
    bestMonthsShort: 'Apr – Sep',
    activeMonths: [3, 4, 5, 6, 7, 8],
    image: images.eastCoast,
    gallery: [
      { src: images.eastCoast, alt: 'Fishing boats at Mirissa harbour at sunset' },
      { src: reef, alt: 'Clear reef waters along the east coast' },
      { src: dhoni, alt: 'Traditional boat resting on an east-coast beach' },
    ] satisfies GalleryImage[],
    overview:
      'When the south grows quieter under rain, the east opens into warm ocean mornings, luminous bays, and a gentler coastal rhythm.',
    landscapes: 'Clear water, temple cliffs, broad beaches, sheltered bays',
    destinations: ['Trincomalee', 'Pasikuda', 'Nilaveli', 'Arugam Bay'],
    experiences: ['Blue whale migration', 'Private boat mornings', 'Temple visits above the sea'],
    editorialNote:
      'Best for summer journeys, return visitors, and families who want warmth, water, and a less obvious coastal rhythm.',
  },
  {
    name: 'The Hill Country',
    journeyRegion: 'The Hill Country',
    icon: 'mountain' as RegionIconId,
    teaser: 'Misted tea estates, cool mornings, and quiet mountain rail.',
    climate: 'Cool & Misted',
    travelStyle: 'Stillness & Altitude',
    bestMonths: 'Year-round, with cooler mornings from December to February',
    bestMonthsShort: 'Year-Round',
    activeMonths: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    image: images.hillCountry,
    gallery: [
      { src: images.hillCountry, alt: 'Misty tea estate in the Nuwara Eliya highlands' },
      { src: experienceImages.teaEstate, alt: 'Rows of tea bushes on a hill country estate' },
      { src: bopathElla, alt: 'Bopath Ella waterfall in the central highlands' },
    ] satisfies GalleryImage[],
    overview:
      'The highlands belong to mist, tea, and silence. Days begin cool, the landscape folds in layers, and movement becomes part of the pleasure.',
    landscapes: 'Tea estates, cloud forest, waterfalls, mountain railways',
    destinations: ['Kandy', 'Nuwara Eliya', 'Ella', 'Hatton'],
    experiences: ['Tea estate residences', 'Scenic rail journeys', 'Restorative highland retreats'],
    heritageHighlights: {
      title: 'Heritage Highlights',
      places: ['Nine Arches Bridge', 'Hakgala Botanical Gardens', 'Peradeniya Railway Station'],
      note: 'Railways, gardens, and tea-country institutions give the region its historical texture without disturbing its quiet.',
    },
    editorialNote:
      'Best for guests who value stillness: misted verandas, tea country residences, rail journeys, gardens, and a cooler pace between coast and ancient city.',
  },
  {
    name: 'The Ancient Kingdoms',
    journeyRegion: 'The Ancient Kingdoms',
    icon: 'temple' as RegionIconId,
    teaser: 'Ancient capitals rising from forest, rock, and sacred stone.',
    climate: 'Dry & Sacred',
    travelStyle: 'Heritage & Scholarship',
    bestMonths: 'May to October',
    bestMonthsShort: 'May – Oct',
    activeMonths: [4, 5, 6, 7, 8, 9],
    image: images.ancientKingdoms,
    gallery: [
      { src: images.ancientKingdoms, alt: 'Sigiriya rock fortress rising above the forest' },
      { src: naalandaGedige, alt: 'Ancient stone gedige at Naalanda' },
      { src: kelaniTempleDetail, alt: 'Sacred mural detail inside Kelani temple' },
    ] satisfies GalleryImage[],
    overview:
      'In the island interior, ancient capitals rise from forest and rock. The experience is strongest when entered slowly, with scholarship and careful timing.',
    landscapes: 'Ancient cities, dry plains, jungle, sacred rock, lakes',
    destinations: ['Sigiriya', 'Anuradhapura', 'Polonnaruwa', 'Dambulla'],
    experiences: ['Private dawn access', 'Resident scholar accompaniment', 'Temple rituals'],
    editorialNote:
      'Best when approached slowly: early light, resident scholarship, protected timing, and enough silence for ancient places to retain their dignity.',
  },
  {
    name: 'The Northern Reaches',
    journeyRegion: 'The Northern Reaches',
    icon: 'compass' as RegionIconId,
    teaser: 'Tamil culture, palmyrah landscapes, and luminous northern light.',
    climate: 'Dry & Luminous',
    travelStyle: 'Culture & Distance',
    bestMonths: 'January to September',
    bestMonthsShort: 'Jan – Sep',
    activeMonths: [0, 1, 2, 3, 4, 5, 6, 7, 8],
    image: images.northernReaches,
    gallery: [
      { src: images.northernReaches, alt: 'Temple festival procession in northern Sri Lanka' },
      { src: experienceImages.perahera, alt: 'Ceremonial procession with traditional performers' },
      { src: experienceImages.brassLamp, alt: 'Brass oil lamp used in northern temple ritual' },
    ] satisfies GalleryImage[],
    overview:
      'The north is a different register of Sri Lanka: Tamil culture, palmyrah landscapes, temple colour, long causeways, and a luminous sense of distance.',
    landscapes: 'Tamil heritage, palmyrah country, temple towns, causeways, northern light',
    destinations: ['Jaffna', 'Delft Island', 'Point Pedro', 'Mannar'],
    experiences: ['Hosted cultural introductions', 'Temple mornings', 'Northern island drives'],
    editorialNote:
      'Best for curious, culturally engaged travellers who do not need the obvious version of Sri Lanka and are willing to be rewarded slowly.',
  },
] as const

function isActiveMonth(activeMonths: readonly number[], monthIndex: number) {
  return activeMonths.includes(monthIndex)
}

export function DiscoveryGuide() {
  const [activeRegionIndex, setActiveRegionIndex] = useState(0)
  const activeRegion = regions[activeRegionIndex]
  const prefersReducedMotion = useReducedMotion()

  function exploreRegion(index: number) {
    setActiveRegionIndex(index)
    window.requestAnimationFrame(() => {
      document.getElementById('region-detail')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  return (
    <main className="discovery-guide">
      <section className="guide-hero">
        <div className="guide-hero-backdrop" aria-hidden="true">
          <span className="guide-hero-orb guide-hero-orb--one" />
          <span className="guide-hero-orb guide-hero-orb--two" />
          <span className="guide-hero-orb guide-hero-orb--three" />
          <span className="guide-hero-grain" />
        </div>

        <motion.div
          className="guide-hero-copy"
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.span
            className="guide-eyebrow"
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Discover Sri Lanka
          </motion.span>
          <motion.h1
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            One Island.
            <em>Many Rhythms.</em>
          </motion.h1>
          <motion.p
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.32 }}
          >
            From mist-covered tea country and ancient kingdoms to quiet coastlines, rainforests, and timeless rail
            journeys, Sri Lanka reveals a different character with every region you explore.
          </motion.p>
          <motion.a
            className="guide-hero-cta"
            href="#region-explorer"
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.44 }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            Begin Exploring
            <span aria-hidden="true">→</span>
          </motion.a>
        </motion.div>

        <motion.a
          className="guide-scroll-indicator"
          href="#region-explorer"
          aria-label="Scroll to regions"
          initial={prefersReducedMotion ? undefined : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          <span className="guide-scroll-indicator__line" />
          Scroll
        </motion.a>
      </section>

      <section className="guide-regions" id="region-explorer" aria-label="Explore regions">
        <header className="guide-section-heading guide-section-heading--centered">
          <span>Seven Regions. One Island.</span>
          <h2>Choose your rhythm</h2>
          <p>
            Tea country, ancient stone, wild coast, and northern light — each region holds its own season, pace, and
            reason to visit.
          </p>
        </header>

        <div className="guide-region-cards">
          {regions.map((region, index) => (
            <RegionCard
              key={region.name}
              region={region}
              index={index}
              isActive={index === activeRegionIndex}
              onSelect={() => exploreRegion(index)}
            />
          ))}
        </div>

        <div id="region-detail" className="guide-region-panel-wrap">
          <motion.article
            className="guide-region-panel"
            key={activeRegion.name}
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
              <div className="guide-region-panel__intro">
                <span className="guide-region-panel__icon">
                  <RegionIcon id={activeRegion.icon} />
                </span>
                <div>
                  <span className="guide-eyebrow">Region In Focus</span>
                  <h2>{activeRegion.name}</h2>
                  <p>{activeRegion.overview}</p>
                </div>
              </div>

              <dl className="guide-region-details">
                <div>
                  <dt>Best months</dt>
                  <dd>{activeRegion.bestMonths}</dd>
                </div>
                <div>
                  <dt>Climate</dt>
                  <dd>{activeRegion.climate}</dd>
                </div>
                <div>
                  <dt>Travel style</dt>
                  <dd>{activeRegion.travelStyle}</dd>
                </div>
                <div>
                  <dt>Signature landscapes</dt>
                  <dd>{activeRegion.landscapes}</dd>
                </div>
              </dl>

              <div className="guide-region-gallery" aria-label={`${activeRegion.name} gallery`}>
                {activeRegion.gallery.map((photo) => (
                  <figure key={photo.src} className="guide-region-gallery__item">
                    <img src={photo.src} alt={photo.alt} loading="lazy" />
                  </figure>
                ))}
              </div>

              <div className="guide-region-editorial">
                <p>{activeRegion.editorialNote}</p>
                <div className="guide-region-glimpses" aria-label={`${activeRegion.name} highlights`}>
                  <section>
                    <h3>Places to begin</h3>
                    <ul>
                      {activeRegion.destinations.map((destination) => (
                        <li key={destination}>
                          <span>{destination}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                  <section>
                    <h3>Private moments</h3>
                    <ul>
                      {activeRegion.experiences.map((experience) => (
                        <li key={experience}>
                          <span>{experience}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                </div>
                {'heritageHighlights' in activeRegion && activeRegion.heritageHighlights ? (
                  <section className="guide-region-heritage">
                    <h3>{activeRegion.heritageHighlights.title}</h3>
                    <p>{activeRegion.heritageHighlights.note}</p>
                    <ul>
                      {activeRegion.heritageHighlights.places.map((place) => (
                        <li key={place}>{place}</li>
                      ))}
                    </ul>
                  </section>
                ) : null}
              </div>
          </motion.article>
        </div>
      </section>

      <section className="guide-seasons" aria-labelledby="season-heading">
        <div className="guide-section-heading">
          <span>Seasonal Intelligence</span>
          <h2 id="season-heading">The Rhythm of the Island</h2>
          <p>
            Sri Lanka is not one climate, but a set of overlapping moods. The markers below show when each region most
            naturally comes forward, not only because of weather, but because of privacy, wildlife movement, sea
            conditions, festivals, and the softness of access.
          </p>
        </div>

        <div className="guide-season-table" role="table" aria-label="Sri Lanka seasonal region guide">
          <div className="guide-season-months" role="row">
            <span />
            {months.map((month) => (
              <span key={month}>{month}</span>
            ))}
            <span />
          </div>
          {regions.map((region) => (
            <div className="guide-season-row" key={region.name} role="row">
              <span className="guide-season-region">
                <strong>{region.name}</strong>
                <small>{region.overview}</small>
              </span>
              {months.map((month, index) => (
                <span
                  key={month}
                  className={isActiveMonth(region.activeMonths, index) ? 'is-active' : ''}
                  aria-label={`${month}: ${isActiveMonth(region.activeMonths, index) ? 'in season' : 'quieter season'}`}
                />
              ))}
              <span className="guide-season-best">{region.bestMonths}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="guide-closing">
        <span>The Island Has Introduced Itself</span>
        <h2>
          What remains is not a decision.
          <em>It is a feeling beginning to take shape.</em>
        </h2>
        <p>
          Some travellers remember Sri Lanka in the hush of tea country before the day warms. Others carry home the
          colour of temple flowers, the salt of a southern evening, or the long quiet between ancient stones. You have
          met the island in its regions, seasons, and rhythms. The next chapter is simply to notice which of those
          impressions stays with you.
        </p>
        <a href="/expectations">Begin Shaping Your Journey</a>
      </section>
    </main>
  )
}
