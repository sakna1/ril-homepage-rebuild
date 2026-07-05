import './ExperiencesPage.css'
import { useState, type MouseEvent, type ReactNode } from 'react'
import { ArrowIcon } from '../ArrowIcon'
import { experienceImages } from './images'
import { useJourney } from '../../journey/useJourney'
import { inferJourneyRegion } from '../../journey/journeyTaxonomy'
import { normalizeRegionLabel } from '../../journey/savedJourneyDisplay'
import { sharedHeritageRecommendations, sharedHeritageWorld } from '../../journey/discoveryWorlds'
import ahangama from '../../assets/images/Ahangama.jpeg'
import galle from '../../assets/images/Galle.jpeg'
import galleBeach from '../../assets/images/Galle beach.jpeg'
import gorakaElla from '../../assets/images/Goraka ella.jpg'
import kandyPerahera from '../../assets/images/Kandy Perahera.JPG'
import kelaniTemple from '../../assets/images/Kelani temple.jpeg'
import kithulgala from '../../assets/images/Kithulgala.jpeg'
import maduRiver from '../../assets/images/Madu River.jpeg'
import nuwaraEliya from '../../assets/images/NuwaraEliya .jpg'
import peradeniya from '../../assets/images/Peradeniya.jpg'
import sigiriya from '../../assets/images/Sigiriya.JPG'

type Detail = {
  label: string
  value: string
}

const experienceThemeOptions = [
  'All Encounters',
  'Wildlife & Wilderness',
  'Ocean & Discovery',
  'Heritage & Memory',
  'Wellness & Restoration',
  'Rail & Landscape',
  'Culture & Human Connection',
  sharedHeritageWorld.name,
] as const

type ExperienceTheme = (typeof experienceThemeOptions)[number]

type Encounter = {
  id: string
  theme?: Exclude<ExperienceTheme, 'All Encounters'>
  category: string
  title: string
  note: string
  curator: string
  curatorImage: string
  image: string
  imageAlt: string
  badge?: string
  caption: string
  details: Detail[]
}

const curatorTitles = {
  arjun: 'Founder & Lead Curator',
  amara: 'Head of Heritage & Cultural Research',
  dilini: 'Co-Founder',
  kavindra: 'Head Naturalist',
  sahan: 'Coastal Experiences Lead',
  malini: 'Cultural Lead',
} as const

const stats = [
  { value: '1:1', label: 'Curator Planning' },
  { value: 'Immediate', label: 'Concierge Attention' },
  { value: 'Private', label: 'Closed-Circle Access' },
  { value: 'Bespoke', label: 'Designed Around You' },
] as const

const heroProofs = ['Private routing', 'Discreet hosts', 'Closed-door access'] as const

const localImages = {
  ahangama,
  galle,
  galleBeach,
  gorakaElla,
  kandyPerahera,
  kelaniTemple,
  kithulgala,
  maduRiver,
  nuwaraEliya,
  peradeniya,
  sigiriya,
} as const

const encounters: Encounter[] = [
  {
    id: 'sigiriya-dawn-ascent',
    theme: 'Heritage & Memory',
    category: 'Heritage — Singular Access',
    title: 'The Sigiriya Dawn Ascent',
    note:
      'There are two Sigiriyas. The one you visit at 9am with three thousand other people, and the one that exists between 5 and 7am — when the frescoes catch low light no photograph has ever adequately described. We negotiated singular access. It takes eight months of patience per year to maintain.',
    curator: `Amara Weerasinghe, ${curatorTitles.amara}`,
    curatorImage: experienceImages.amara,
    image: localImages.sigiriya,
    imageAlt: 'Sigiriya rock fortress rising above the Sri Lankan landscape',
    badge: "Curator's Choice",
    caption: 'Cultural Heritage — Central Province',
    details: [
      { label: 'Duration', value: '3 Hours' },
      { label: 'Best Season', value: 'Jan — Apr' },
      { label: 'Group Size', value: 'Max 4' },
      { label: 'Key Highlight', value: 'Pre-dawn private access, fresco viewing' },
      { label: 'Curator', value: 'Amara W.' },
    ],
  },
  {
    id: 'private-tea-estate',
    theme: 'Rail & Landscape',
    category: 'Tea Country — Immersive',
    title: 'A Private Tea Estate, Locked Before Dawn',
    note:
      'Tea tourism is everywhere. What is almost nowhere is the thing that precedes it: the stillness of a working estate at 4:45am, before the pickers arrive, when the mist sits exactly at shoulder height and the silence has a particular quality I can only describe as earned. This is the version we offer.',
    curator: `Dilini Perera, ${curatorTitles.dilini}`,
    curatorImage: experienceImages.dilini,
    image: localImages.nuwaraEliya,
    imageAlt: 'Nuwara Eliya hill country in soft morning light',
    caption: 'Tea Country — Hill Province',
    details: [
      { label: 'Duration', value: 'Full Day' },
      { label: 'Best Season', value: 'Feb — May' },
      { label: 'Group Size', value: 'Max 2' },
      { label: 'Key Highlight', value: 'Private estate access, master blender session' },
      { label: 'Curator', value: 'Dilini P.' },
    ],
  },
  {
    id: 'shared-heritage-quietly-read',
    theme: sharedHeritageWorld.name,
    category: 'Shared History — Editorial Route',
    title: 'Shared Heritage, Quietly Read',
    note:
      "This is not a tour of colonial relics. It is a considered route through tea country, railway engineering, old gardens, civic streets, and grand hotels where Sri Lankan and British histories still meet in architecture, education, hospitality, and daily ritual.",
    curator: `Amara Weerasinghe, ${curatorTitles.amara}`,
    curatorImage: experienceImages.amara,
    image: localImages.nuwaraEliya,
    imageAlt: 'Nuwara Eliya hill country shaped by tea estates and colonial memory',
    badge: 'New Discovery World',
    caption: 'Tea Country — Railways — Colombo',
    details: [
      { label: 'Duration', value: '3–7 Days' },
      { label: 'Best Season', value: 'Dec — Apr' },
      { label: 'Group Size', value: 'Private' },
      { label: 'Key Highlight', value: 'Tea, railways, gardens, and civic memory' },
      { label: 'Curator', value: 'Amara W.' },
    ],
  },
  {
    id: 'leopard-research-circuit',
    theme: 'Wildlife & Wilderness',
    category: 'Wildlife — Expert-Led',
    title: 'The Leopard Research Circuit',
    note:
      "I spent seven years in Yala before I joined this team. I know which vehicles to avoid, which blocks to enter at which hour, and — more importantly — when to stop the engine and simply wait. Safari isn't about luck. It's about discipline. I've only ever taken four people into Block 5 at dawn. The fifth will be you.",
    curator: `Kavindra Silva, ${curatorTitles.kavindra}`,
    curatorImage: experienceImages.kavindra,
    image: experienceImages.leopardCircuit,
    imageAlt: 'Wild Sri Lankan leopard resting on ancient rock at dusk',
    badge: 'Rare Access',
    caption: 'Wildlife — Southern Province',
    details: [
      { label: 'Duration', value: '3 Days' },
      { label: 'Best Season', value: 'Jun — Oct' },
      { label: 'Group Size', value: 'Max 4' },
      { label: 'Key Highlight', value: 'Block 5 private access, research biologist guide' },
      { label: 'Curator', value: 'Kavindra S.' },
    ],
  },
  {
    id: 'mirissa-fishermens-dawn',
    theme: 'Ocean & Discovery',
    category: 'Southern Coast — Immersive',
    title: "The Mirissa Fishermen's Dawn",
    note:
      'The coast, for most visitors, is an amenity. A view. A backdrop. But Mirissa runs on a different clock — one that starts at 3am, when the tuna boats come in and the auction begins. I have spent years building trust with three families on this stretch of water. You are not joining a tour. You are, briefly, joining a life.',
    curator: `Sahan Mendis, ${curatorTitles.sahan}`,
    curatorImage: experienceImages.sahan,
    image: localImages.ahangama,
    imageAlt: 'Southern Sri Lankan coast at Ahangama',
    caption: 'Southern Coast — Mirissa',
    details: [
      { label: 'Duration', value: '1 Day' },
      { label: 'Best Season', value: 'Nov — Apr' },
      { label: 'Group Size', value: 'Max 3' },
      { label: 'Key Highlight', value: 'Pre-dawn tuna auction, private boat expedition' },
      { label: 'Curator', value: 'Sahan M.' },
    ],
  },
  {
    id: 'kandyan-dance-rehearsal',
    theme: 'Culture & Human Connection',
    category: 'Cultural — Intimate Access',
    title: 'A Private Kandyan Dance Rehearsal',
    note:
      'Performances are for audiences. Rehearsals are where the art lives. We arranged access to a family that has been training in the Kandyan tradition for four generations. You will watch a senior dancer guide a younger student. You will understand something about transmission, about inheritance, that no performance could ever convey.',
    curator: `Amara Weerasinghe, ${curatorTitles.amara}`,
    curatorImage: experienceImages.amara,
    image: localImages.kandyPerahera,
    imageAlt: 'Kandy Perahera procession with ceremonial performers',
    badge: 'By Arrangement',
    caption: 'Cultural — Kandy',
    details: [
      { label: 'Duration', value: '2 Hours' },
      { label: 'Best Season', value: 'Year-round' },
      { label: 'Group Size', value: 'Max 6' },
      { label: 'Key Highlight', value: '4th-generation family, private studio, contextual briefing' },
      { label: 'Curator', value: 'Amara W.' },
    ],
  },
  {
    id: 'deep-water-hour',
    theme: 'Ocean & Discovery',
    category: 'Ocean — Singular Access',
    title: 'The Deep-Water Hour',
    note:
      'At 5am, a private vessel departs before the tour boats have woken. The blue whale, the largest creature alive, surfaces without warning and without ceremony — merely because it must. The privilege is not proximity alone. It is entering the water on its own terms, without performance.',
    curator: `Sahan Mendis, ${curatorTitles.sahan}`,
    curatorImage: experienceImages.sahan,
    image: experienceImages.blueWhaleAerial,
    imageAlt: 'Blue whale surfacing in the Indian Ocean near Mirissa',
    caption: 'Ocean — Mirissa',
    details: [
      { label: 'Duration', value: 'Half Day' },
      { label: 'Best Season', value: 'Nov — Apr' },
      { label: 'Group Size', value: 'Max 4' },
      { label: 'Key Highlight', value: 'Private pre-dawn vessel, marine naturalist' },
      { label: 'Curator', value: 'Sahan M.' },
    ],
  },
  {
    id: 'sacred-fire-private-vantage',
    theme: 'Culture & Human Connection',
    category: 'Ceremony — Private Vantage',
    title: 'Sacred Fire, Private Vantage',
    note:
      "Access to the inner sanctum of the Temple of the Tooth is never treated as spectacle. A private audience with the temple's senior custodian begins with context, restraint, and the understanding that the ceremony is not adjusted for visitors — you adjust yourself to the ceremony.",
    curator: `Malini Fernando, ${curatorTitles.malini}`,
    curatorImage: experienceImages.portraitMalini,
    image: localImages.kandyPerahera,
    imageAlt: 'Kandy Perahera ceremonial procession in Sri Lanka',
    caption: 'Ceremony — Kandy',
    details: [
      { label: 'Duration', value: 'Evening' },
      { label: 'Best Season', value: 'Year-round' },
      { label: 'Group Size', value: 'Max 4' },
      { label: 'Key Highlight', value: 'Senior custodian context, protected vantage' },
      { label: 'Curator', value: 'Malini F.' },
    ],
  },
  {
    id: 'ancient-grammar-of-healing',
    theme: 'Wellness & Restoration',
    category: 'Restoration — Healing Traditions',
    title: 'The Ancient Grammar of Healing',
    note:
      'Embedded within a rainforest reserve, this five-day Ayurvedic immersion is guided by a fourth-generation vaidya. It is not a spa and not a retreat in the decorative sense. It is a diagnostic and restorative system refined for two thousand years, entered slowly and with discipline.',
    curator: `Dilini Perera, ${curatorTitles.dilini}`,
    curatorImage: experienceImages.dilini,
    image: localImages.gorakaElla,
    imageAlt: 'Rainforest waterfall landscape in Sri Lanka',
    badge: 'By Consultation',
    caption: 'Restoration — Sinharaja',
    details: [
      { label: 'Duration', value: '5 Days' },
      { label: 'Best Season', value: 'All Year' },
      { label: 'Group Size', value: 'Individual' },
      { label: 'Key Highlight', value: 'Fourth-generation vaidya, rainforest setting' },
      { label: 'Curator', value: 'Dilini P.' },
    ],
  },
]

const experienceThemes = [
  {
    title: 'Wildlife & Wilderness',
    description:
      'Leopards, elephants, forests, field researchers, remote ecosystems, and nature without performance.',
    traveller: 'For the Seeker of Silence',
    image: localImages.kithulgala,
    imageAlt: 'Forest river landscape in Kithulgala, Sri Lanka',
    href: '#leopard-research-circuit',
    encounter: 'The Leopard Research Circuit',
  },
  {
    title: 'Ocean & Discovery',
    description:
      'For travellers drawn to the sea as a living world: whale paths, quiet lagoons, sailing days, and coastlines that reveal themselves with patience.',
    traveller: 'For the Unhurried Wanderer',
    image: localImages.galleBeach,
    imageAlt: 'Southern Sri Lankan beach and ocean light',
    href: '#deep-water-hour',
    encounter: 'The Deep-Water Hour',
  },
  {
    title: 'Heritage & Memory',
    description:
      'Ancient kingdoms, sacred spaces, archaeology, historians, and living traditions carried forward.',
    traveller: 'For the Heritage Guardian',
    image: localImages.sigiriya,
    imageAlt: 'Sigiriya rock fortress in Sri Lanka',
    href: '#sigiriya-dawn-ascent',
    encounter: 'The Sigiriya Dawn Ascent',
  },
  {
    title: 'Wellness & Restoration',
    description:
      'Ayurveda, healing traditions, retreats, slow living, and the quiet work of personal renewal.',
    traveller: 'For the Restorer',
    image: localImages.gorakaElla,
    imageAlt: 'Rainforest waterfall landscape in Sri Lanka',
    href: '#ancient-grammar-of-healing',
    encounter: 'The Ancient Grammar of Healing',
  },
  {
    title: 'Rail & Landscape',
    description:
      'Hill country train journeys, tea estates, mountain routes, and scenery that changes by the hour.',
    traveller: 'For the Reflective Wanderer',
    image: localImages.nuwaraEliya,
    imageAlt: 'Nuwara Eliya hill country landscape',
    href: '#private-tea-estate',
    encounter: 'A Private Tea Estate, Locked Before Dawn',
  },
  {
    title: 'Culture & Human Connection',
    description:
      'Artisans, musicians, dancers, family traditions, private introductions, and everyday Sri Lanka.',
    traveller: 'For the Curious Witness',
    image: localImages.kandyPerahera,
    imageAlt: 'Kandy Perahera cultural procession in Sri Lanka',
    href: '#kandyan-dance-rehearsal',
    encounter: 'A Private Kandyan Dance Rehearsal',
  },
  {
    title: sharedHeritageWorld.name,
    description: sharedHeritageWorld.description,
    traveller: sharedHeritageWorld.traveller,
    image: localImages.nuwaraEliya,
    imageAlt: 'Nuwara Eliya hill country shaped by tea estates and colonial memory',
    href: '#shared-heritage-quietly-read',
    encounter: 'Shared Heritage, Quietly Read',
  },
] as const

const photoStrip = [
  { src: localImages.peradeniya, alt: 'Peradeniya gardens in soft daylight', wide: false },
  { src: localImages.nuwaraEliya, alt: 'Nuwara Eliya hill country landscape', wide: true },
  { src: localImages.kelaniTemple, alt: 'Kelani temple sacred architecture and ritual setting', wide: false },
  { src: localImages.maduRiver, alt: 'Madu River winding through coastal wetland and jungle', wide: true },
  { src: localImages.galle, alt: 'Galle coastal heritage landscape', wide: false },
  { src: localImages.kandyPerahera, alt: 'Kandy Perahera ceremonial procession', wide: false },
] as const

function Eyebrow({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <div className={`experiences-eyebrow${dark ? ' experiences-eyebrow--dark' : ''}`}>
      <span />
      <p>{children}</p>
    </div>
  )
}

function TextLink({
  children,
  href = '#begin',
  inverse = false,
  onClick,
}: {
  children: ReactNode
  href?: string
  inverse?: boolean
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void
}) {
  return (
    <a className={`experiences-text-link${inverse ? ' experiences-text-link--inverse' : ''}`} href={href} onClick={onClick}>
      {children}
      <ArrowIcon />
    </a>
  )
}

const encounterNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'] as const

function toJourneyId(kind: string, value: string) {
  return `${kind}:${value.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
}

function readInitialExpectationTheme(): ExperienceTheme {
  if (typeof window === 'undefined') {
    return 'All Encounters'
  }

  const world = new URLSearchParams(window.location.search).get('world')
  return experienceThemeOptions.includes(world as ExperienceTheme) ? (world as ExperienceTheme) : 'All Encounters'
}

function EncounterCard({ encounter, index }: { encounter: Encounter; index: number }) {
  const { confirmRemoveItem, includeItem, isIncluded } = useJourney()
  const enquiryHref =
    encounter.title === 'The Sigiriya Dawn Ascent'
      ? '/expectations/the-sigiriya-dawn-ascent'
      : '#begin'
  const journeyId = toJourneyId('experience', encounter.title)
  const isEncounterIncluded = isIncluded(journeyId)

  function includeEncounterInJourney() {
    const parentRegion = inferJourneyRegion({
      kind: 'experience',
      label: encounter.title,
      detail: encounter.note,
      source: `${encounter.category} ${encounter.caption}`,
    })

    if (encounter.theme) {
      includeItem({
        id: toJourneyId('theme', encounter.theme),
        kind: 'theme',
        label: encounter.theme,
        source: 'Expectations',
      })
    }

    if (encounter.theme && parentRegion && !isIncluded(toJourneyId('region', normalizeRegionLabel(parentRegion)))) {
      const editorialRegion = normalizeRegionLabel(parentRegion)
      includeItem({
        id: toJourneyId('region', editorialRegion),
        kind: 'region',
        label: editorialRegion,
        source: 'Expectations',
        parentTheme: encounter.theme,
      })
    }

    includeItem({
      id: journeyId,
      kind: 'experience',
      label: encounter.title,
      detail: encounter.note,
      source: encounter.category,
      parentTheme: encounter.theme,
      parentRegion: parentRegion ? normalizeRegionLabel(parentRegion) : undefined,
    })
  }

  function toggleEncounterJourney(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    event.stopPropagation()

    if (isEncounterIncluded) {
      confirmRemoveItem(journeyId)
      return
    }

    includeEncounterInJourney()
  }

  function handleEnquireClick(event: MouseEvent<HTMLAnchorElement>) {
    if (!isEncounterIncluded) {
      includeEncounterInJourney()
    }
  }

  return (
    <article
      id={encounter.id}
      className={`encounter-row experiences-reveal journey-selectable${isEncounterIncluded ? ' is-included' : ''}`}
    >
      <div className="encounter-index">
        <span>{encounterNumerals[index] ?? String(index + 1)}</span>
        <i />
      </div>

      <div className="encounter-image-panel">
        <div className="encounter-image-frame">
          <img src={encounter.image} alt={encounter.imageAlt} />
        </div>
        {encounter.badge ? <span className="encounter-badge">{encounter.badge}</span> : null}
        <span className="encounter-caption">{encounter.caption}</span>
      </div>

      <div className="encounter-copy">
        <p className="experiences-kicker">{encounter.category}</p>
        <h2>{encounter.title}</h2>
        <div className="curator-note">
          <p className="curator-note-label">Curator's Note</p>
          <blockquote>"{encounter.note}"</blockquote>
          <div className="curator-byline">
            <img src={encounter.curatorImage} alt="" />
            <span>— {encounter.curator}</span>
          </div>
        </div>
        <TextLink href={enquiryHref} onClick={handleEnquireClick}>
          Enquire About This Encounter
        </TextLink>
      </div>

      <aside className="encounter-details-panel" aria-label={`${encounter.title} details`}>
        <div className="encounter-details-toolbar">
          <button
            className="encounter-journey-toggle"
            type="button"
            aria-pressed={isEncounterIncluded}
            aria-label={`${isEncounterIncluded ? 'Remove' : 'Add'} ${encounter.title} ${isEncounterIncluded ? 'from' : 'to'} your journey`}
            onClick={toggleEncounterJourney}
          >
            {isEncounterIncluded ? 'Remove from Journey' : 'Add to Journey'}
          </button>
        </div>
        <dl className="encounter-details">
        {encounter.details.map((detail) => (
          <div key={detail.label}>
            <dt>{detail.label}</dt>
            <dd>{detail.value}</dd>
          </div>
        ))}
        </dl>
      </aside>
    </article>
  )
}

export function ExpectationsPage() {
  const [selectedTheme, setSelectedTheme] = useState<ExperienceTheme>(readInitialExpectationTheme)
  const { confirmRemoveItem, includeItem, isIncluded } = useJourney()
  const filteredEncounters =
    selectedTheme === 'All Encounters'
      ? encounters
      : encounters.filter((encounter) => encounter.theme === selectedTheme)
  const curatedOpeningsCount = filteredEncounters.length

  function includeSharedHeritageRecommendations() {
    sharedHeritageRecommendations.slice(1, 5).forEach(({ destination }) => {
      const parentRegion = inferJourneyRegion({
        kind: 'destination',
        label: destination,
        source: 'Shared Heritage recommendations',
      })
      includeItem({
        id: toJourneyId('destination', destination),
        kind: 'destination',
        label: destination,
        source: 'Expectations',
        parentTheme: sharedHeritageWorld.name,
        parentRegion: parentRegion ? normalizeRegionLabel(parentRegion) : undefined,
      })
    })
  }

  function handleThemeExplore(
    theme: Exclude<ExperienceTheme, 'All Encounters'>,
    event: MouseEvent<HTMLAnchorElement>,
  ) {
    event.preventDefault()
    setSelectedTheme(theme)

    window.requestAnimationFrame(() => {
      document.getElementById('encounters')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  function toggleThemeJourney(theme: Exclude<ExperienceTheme, 'All Encounters'>) {
    const journeyId = toJourneyId('theme', theme)

    if (isIncluded(journeyId)) {
      confirmRemoveItem(journeyId)
      return
    }

    includeItem({
      id: journeyId,
      kind: 'theme',
      label: theme,
      source: 'Expectations',
    })

    if (theme === sharedHeritageWorld.name) {
      includeSharedHeritageRecommendations()
    }
  }

  function handleThemeFilter(theme: ExperienceTheme) {
    setSelectedTheme(theme)

    if (theme === 'All Encounters') {
      return
    }

    includeItem({
      id: toJourneyId('theme', theme),
      kind: 'theme',
      label: theme,
      source: 'Expectations',
    })

    if (theme === sharedHeritageWorld.name) {
      includeSharedHeritageRecommendations()
    }
  }

  return (
    <main className="experiences-page">
      <section className="experiences-hero experiences-reveal">
        <div className="experiences-container experiences-hero-grid">
          <div className="experiences-hero-copy">
            <Eyebrow>Expectations — Journey Curation Begins</Eyebrow>
            <h1>
              What
              <br />
              <em>Should</em>
              <br />
              Sri Lanka Feel Like?
            </h1>
            <p>
              This is where Royale Isles Lanka asks you to shape the journey. Choose the moods,
              regions, and styles of access that feel true; only here do those preferences begin forming
              My Journey.
            </p>
            <ul className="experiences-hero-proof-list" aria-label="Expectation standards">
              {heroProofs.map((proof) => (
                <li key={proof}>{proof}</li>
              ))}
            </ul>
            <TextLink href="#experience-themes-title">Begin With Expectations</TextLink>
            <aside className="opening-note">
              <p>Curator's Note</p>
              <blockquote>
                "For our most private guests, luxury is not excess. It is timing, trust, and the
                assurance that no one else is moving through the same moment."
              </blockquote>
              <div>
                <img src={experienceImages.arjun} alt="" />
                <span>
                  <strong>Arjun Fernando</strong>
                  <small>{curatorTitles.arjun}</small>
                </span>
              </div>
            </aside>
          </div>

          <div className="experiences-hero-image">
            <div className="hero-image-frame">
              <img src={localImages.sigiriya} alt="Sigiriya rock fortress in Sri Lanka" />
            </div>
            <span className="hero-feature-label">Featured Private Access</span>
            <span className="hero-choice">By Introduction Only</span>
            <div className="hero-access-card" aria-label="Arrival protocol">
              <p>Arrival Protocol</p>
              <strong>Pre-dawn ascent, sealed route, curator in attendance.</strong>
              <span>Sigiriya — Central Province</span>
            </div>
            <div className="experiences-stat-strip">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="experience-themes experiences-reveal" aria-labelledby="experience-themes-title">
        <div className="experiences-container">
          <header className="experience-themes-header">
            <div>
              <Eyebrow>Journey Themes</Eyebrow>
              <h2 id="experience-themes-title">
                The Shape
                <br />
                <em>Of The Journey.</em>
              </h2>
            </div>
            <p>
              This is not a catalogue of activities. It is a quiet reading of what should matter:
              wilderness, memory, restoration, movement, coast, culture, or histories still held in the landscape.
            </p>
          </header>

          <div className="experience-themes-salon">
            <aside className="experience-themes-note">
              <span>Curatorial Reading</span>
              <p>
                Choose only what feels instinctive. A preference here is not a commitment; it is a signal your
                concierge can read with discretion.
              </p>
              <small>Every path remains private, edited, and shaped around timing.</small>
            </aside>

            <div className="experience-themes-board">
              {experienceThemes.map((theme) => {
                const themeJourneyId = toJourneyId('theme', theme.title)
                const isThemeIncluded = isIncluded(themeJourneyId)

                return (
                  <article
                    key={theme.title}
                    className={`theme-chapter-shell journey-selectable${isThemeIncluded ? ' is-included' : ''}`}
                  >
                    <button
                      className="theme-journey-toggle"
                      type="button"
                      aria-pressed={isThemeIncluded}
                      aria-label={`${isThemeIncluded ? 'Remove' : 'Add'} ${theme.title} ${isThemeIncluded ? 'from' : 'to'} your journey`}
                      onClick={(event) => {
                        event.preventDefault()
                        event.stopPropagation()
                        toggleThemeJourney(theme.title)
                      }}
                    >
                      {isThemeIncluded ? 'Remove from Journey' : 'Add to Journey'}
                    </button>
                    <a
                      className="theme-chapter"
                      href="#encounters"
                      onClick={(event) => handleThemeExplore(theme.title, event)}
                      aria-label={`${theme.title}: explore matching expectation paths`}
                    >
                      <figure>
                        <img src={theme.image} alt={theme.imageAlt} />
                      </figure>
                      <div className="theme-chapter-copy">
                        <p>{theme.traveller}</p>
                        <h3>{theme.title}</h3>
                        <p>{theme.description}</p>
                        <small>{theme.encounter}</small>
                      </div>
                    </a>
                  </article>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="region-filter experiences-reveal" aria-label="Set journey expectations by theme">
        <div className="region-filter-copy">
          <span>Set A Preference</span>
          <label htmlFor="experience-theme">Preferred Journey Theme</label>
        </div>
        <div className="region-filter-select-wrap">
          <select
            id="experience-theme"
            value={selectedTheme}
            onChange={(event) => handleThemeFilter(event.target.value as ExperienceTheme)}
          >
            {experienceThemeOptions.map((theme) => (
              <option key={theme} value={theme}>
                {theme}
              </option>
            ))}
          </select>
        </div>
        <p>
          {curatedOpeningsCount} {curatedOpeningsCount === 1 ? 'Expectation Path' : 'Expectation Paths'}
        </p>
      </section>

      <section className="encounters-collection" id="encounters">
        <div className="experiences-container">
          <header className="encounters-collection-header experiences-reveal">
            <p>Personally Introduced</p>
            <h2>
              These are quiet signals that help your concierge understand the kind of journey to begin
              composing.
            </h2>
          </header>
          {filteredEncounters.length > 0 ? (
            filteredEncounters.map((encounter, index) => (
              <EncounterCard key={encounter.title} encounter={encounter} index={index} />
            ))
          ) : (
            <div className="encounters-empty experiences-reveal">
              <p>New encounters are being prepared for this expectation path.</p>
              <span>This pathway is currently available through private consultation.</span>
            </div>
          )}
        </div>
      </section>

      <section className="photo-strip experiences-reveal" aria-label="Expectation photography carousel">
        <div className="photo-strip-track">
          <div className="photo-strip-set">
            {photoStrip.map((photo) => (
              <img key={photo.alt} className={photo.wide ? 'wide' : ''} src={photo.src} alt={photo.alt} />
            ))}
          </div>
          <div className="photo-strip-set" aria-hidden="true">
            {photoStrip.map((photo) => (
              <img key={`repeat-${photo.alt}`} className={photo.wide ? 'wide' : ''} src={photo.src} alt="" />
            ))}
          </div>
        </div>
      </section>

      <section className="experiences-final-cta experiences-reveal" id="begin">
        <div className="experiences-final-cta-inner">
          <div className="experiences-final-cta-mark" aria-hidden="true">
            ✦
          </div>
          <p>Expectation Briefing</p>
          <h2>
            Begin with the question
            <br />
            <em>that opens the right door.</em>
          </h2>
          <p>
            A quiet conversation with Arjun or Dilini, shaped around privacy, timing, and the kind of
            access that should never feel public. If an encounter cannot be arranged with integrity, we
            will say so.
          </p>
          <div className="experiences-final-cta-actions">
            <a href="#begin" className="primary-cta">
              Request A Private Briefing
            </a>
            <TextLink inverse>Review Expectations</TextLink>
          </div>
          <small>Discreet planning. No packaged itineraries. Introductions only where trust exists.</small>
        </div>
      </section>
    </main>
  )
}
