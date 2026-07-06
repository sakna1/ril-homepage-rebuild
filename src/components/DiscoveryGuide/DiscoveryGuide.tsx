import { useState } from 'react'
import './DiscoveryGuide.css'
import galle from '../../assets/images/Galle.jpeg'
import galleFaceBeach from '../../assets/images/Galle face beach.jpeg'
import theruFestival from '../../assets/images/theru festival.jpg'
import { experienceImages } from '../ExperiencesPage/images'

const images = {
  westernGateway: galleFaceBeach,
  southernArc: galle,
  wildSouth: experienceImages.leopardFeature,
  eastCoast: experienceImages.mirissaBoats,
  hillCountry: experienceImages.hillCountry,
  ancientKingdoms: experienceImages.sigiriyaMain,
  northernReaches: theruFestival,
} as const

const heroCollage = [
  {
    id: 'ancient-kingdoms',
    label: 'Ancient Kingdoms',
    image: images.ancientKingdoms,
    alt: 'Sigiriya rock fortress rising above the Sri Lankan forest',
    placement: 'heritage',
  },
  {
    id: 'hill-country',
    label: 'Hill Country',
    image: images.hillCountry,
    alt: 'Misty Sri Lankan tea estate at golden hour',
    placement: 'hills',
  },
  {
    id: 'wild-south',
    label: 'Wild South',
    image: images.wildSouth,
    alt: 'Sri Lankan leopard resting on rock at dusk',
    placement: 'wild',
  },
  {
    id: 'southern-arc',
    label: 'Southern Arc',
    image: images.southernArc,
    alt: 'Galle Fort ramparts above the southern coast',
    placement: 'coast',
  },
  {
    id: 'east-coast',
    label: 'East Coast',
    image: images.eastCoast,
    alt: 'Fishing boats at Mirissa harbour at sunset',
    placement: 'east',
  },
  {
    id: 'northern-reaches',
    label: 'Northern Reaches',
    image: images.northernReaches,
    alt: 'Temple festival procession in northern Sri Lanka',
    placement: 'north',
  },
] as const

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const

const regions = [
  {
    name: 'The Western Gateway',
    journeyRegion: 'The Western Gateway',
    bestMonths: 'November to March, with Colombo rewarding year-round',
    activeMonths: [0, 1, 2, 10, 11],
    image: images.westernGateway,
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
    bestMonths: 'November to April',
    activeMonths: [0, 1, 2, 3, 10, 11],
    image: images.southernArc,
    overview:
      'The southern coast is Sri Lanka in golden light: fortified towns, quiet coves, sea air, and villas held close to the palms.',
    landscapes: 'Golden beaches, colonial streets, cinnamon gardens, reef-fringed bays',
    destinations: ['Galle', 'Weligama', 'Tangalle', 'Mirissa'],
    experiences: ['Private coastal residences', 'Cinnamon estate visits', 'Sunset suppers by the sea'],
    heritageHighlights: {
      title: 'Heritage Highlights',
      places: ['Galle Fort', 'Dutch Reformed Church', 'National Maritime Museum'],
      note: "The coast carries older layers of trade, architecture, and seafaring memory without needing to become a list of attractions.",
    },
    editorialNote:
      'Best when the coast is treated as atmosphere rather than beach time: ramparts at golden hour, cinnamon gardens, private residences, and dinners that unfold without spectacle.',
  },
  {
    name: 'The Wild South',
    journeyRegion: 'The Wild South',
    bestMonths: 'February to September for dry-zone wilderness',
    activeMonths: [1, 2, 3, 4, 5, 6, 7, 8],
    image: images.wildSouth,
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
    bestMonths: 'April to September',
    activeMonths: [3, 4, 5, 6, 7, 8],
    image: images.eastCoast,
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
    bestMonths: 'Year-round, with cooler mornings from December to February',
    activeMonths: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    image: images.hillCountry,
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
    bestMonths: 'May to October',
    activeMonths: [4, 5, 6, 7, 8, 9],
    image: images.ancientKingdoms,
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
    bestMonths: 'January to September',
    activeMonths: [0, 1, 2, 3, 4, 5, 6, 7, 8],
    image: images.northernReaches,
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

  function exploreRegion(index: number) {
    setActiveRegionIndex(index)
  }

  return (
    <main className="discovery-guide">
      <section className="guide-hero">
        <div className="guide-hero-copy">
          <span className="guide-eyebrow">Discover Sri Lanka</span>
          <h1>
            One Island.
            <em>Many Rhythms.</em>
          </h1>
          <p>
            From mist-covered tea country and ancient kingdoms to quiet coastlines, rainforests, and timeless rail
            journeys, Sri Lanka reveals a different character with every region you explore.
          </p>
        </div>
        <figure className="guide-hero-collage" aria-label="Sri Lanka regions collage">
          <div className="guide-hero-collage-grid">
            {heroCollage.map((tile) => (
              <figure
                key={tile.id}
                className={`guide-hero-collage-tile guide-hero-collage-tile--${tile.placement}`}
              >
                <img src={tile.image} alt={tile.alt} />
                <figcaption>{tile.label}</figcaption>
              </figure>
            ))}
          </div>
          <figcaption className="guide-hero-collage-note">
            <span>Seven regions. One island.</span>
            <small>Tea country, ancient stone, wild coast, and northern light — held in a single journey.</small>
          </figcaption>
        </figure>
      </section>

      <section className="guide-regions" aria-label="Explore regions">
        <div className="guide-region-cards">
          {regions.map((region, index) => (
            <article
              className={`guide-region-card${index === activeRegionIndex ? ' is-active' : ''}`}
              key={region.name}
            >
              <button type="button" onClick={() => exploreRegion(index)} aria-pressed={index === activeRegionIndex}>
                <img src={region.image} alt={`${region.name} in Sri Lanka`} />
                <span className="guide-region-title">{region.name}</span>
              </button>
            </article>
          ))}
        </div>

        <article className="guide-region-panel">
          <div>
            <span className="guide-eyebrow">Region In Focus</span>
            <h2>{activeRegion.name}</h2>
            <p>{activeRegion.overview}</p>
          </div>

          <dl className="guide-region-details">
            <div>
              <dt>Best months</dt>
              <dd>{activeRegion.bestMonths}</dd>
            </div>
            <div>
              <dt>Signature landscapes</dt>
              <dd>{activeRegion.landscapes}</dd>
            </div>
          </dl>

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
        </article>
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
            <div
              className="guide-season-row"
              key={region.name}
              role="row"
            >
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
