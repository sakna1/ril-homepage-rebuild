import { useRef, useState } from 'react'
import { ArrowIcon } from '../ArrowIcon'
import './ConciergeDesk.css'
import { experienceImages } from '../ExperiencesPage/images'
import { sharedHeritageWorld } from '../../journey/discoveryWorlds'

const assets = {
  tangalle: 'https://www.figma.com/api/mcp/asset/3889a33d-1629-4928-bc7f-9d5451b6f3dd',
  rekawa: 'https://www.figma.com/api/mcp/asset/26b19b17-7fd8-491f-b588-c5611a03c6f8',
  pasikuda: 'https://www.figma.com/api/mcp/asset/f481f85f-8dda-4d1e-b6ca-de001516ae64',
}

const suggestedEnquiries = [
  'Where would you recommend for our first evening together?',
  'Which experiences feel unlike anything we have seen before?',
  'What property offers the most genuine privacy?',
  'Tell me about the best time to visit the Hill Country.',
  `Build around ${sharedHeritageWorld.name}.`,
]

const defaultRecommendations = [
  {
    image: assets.tangalle,
    number: '01',
    title: 'Tangalle',
    region: 'Southern Coast',
    copy: 'A coastline that resists the resort circuit. Intimate coves, palm-fringed sand and a quietness that has become increasingly rare.',
  },
  {
    image: assets.rekawa,
    number: '02',
    title: 'Rekawa Lagoon',
    region: 'Southern Coast',
    copy: 'A lagoon sunset reached by boat. Nesting sea turtles, if the season allows, and the peace of somewhere genuinely undiscovered.',
  },
  {
    image: assets.pasikuda,
    number: '03',
    title: 'Pasikuda',
    region: 'Eastern Coast',
    copy: 'Calm, shallow waters stretching far to sea. A beach for unhurried mornings and the pleasure of having found somewhere still belonging to itself.',
  },
]

const sharedHeritageRecommendations = [
  {
    image: experienceImages.hillCountry,
    number: '01',
    title: 'Nuwara Eliya',
    region: 'Hill Country Legacy',
    copy: 'A cool highland chapter of tea estates, gardens, old hotels, and hill-station atmosphere, best read with context rather than nostalgia.',
  },
  {
    image: experienceImages.hillCountry,
    number: '02',
    title: 'Nine Arches Bridge',
    region: 'Railway Legacy',
    copy: "An elegant piece of railway engineering where landscape, movement, and memory meet in one of Sri Lanka's most cinematic valleys.",
  },
  {
    image: experienceImages.galleFort,
    number: '03',
    title: 'Galle Face Hotel',
    region: 'Colombo Legacy',
    copy: "A seafront institution where hospitality, arrival, public life, and Colombo's layered history can be understood in a single evening.",
  },
]

const responseModes = {
  personalised: {
    label: 'Personalised',
    tabNote: 'Tailored to The Romantic Traveller',
    recommendationsLabel: 'Prepared For You',
    lede:
      'For a romantic traveller such as yourself, the finest beaches are those where the world seems to pause - where privacy replaces performance, and the quality of light at dusk matters far more than the crowd at noon.',
    paragraphs: [
      'I would begin with Tangalle, a stretch of the southern coast that remains largely beyond the resort circuit. Its coves are intimate, its waters unhurried. As the sun descends behind the coconut palms, the beach takes on a quality difficult to find elsewhere on the island - a stillness that feels less discovered than kept.',
      'Further along, the Rekawa lagoon offers something rarer still: a sunset witnessed by very few, reached by a short crossing that feels like stepping quietly beyond the world. If the season allows, nesting sea turtles add a dimension of wonder that no curated excursion could manufacture.',
      'On the east coast, Pasikuda unfolds differently. Calm, shallow waters stretching far out to sea; a horizon unbroken. It is a beach for unhurried mornings and long evenings, and for the particular pleasure of having found somewhere that still belongs to itself.',
    ],
    note:
      'Tailored to The Romantic Traveller - selections prioritise seclusion, atmosphere and private beauty over popular accessibility or beach amenity.',
  },
  general: {
    label: 'General',
    tabNote: '',
    recommendationsLabel: 'Our Recommendations',
    lede:
      "Sri Lanka's coastline offers remarkable variety across its southern, western and eastern shores, each with a distinct character suited to different seasons and preferences.",
    paragraphs: [
      "The southern coast, stretching between Mirissa and Tangalle, is widely regarded as among the island's finest. Mirissa draws visitors for whale watching between November and April, while Tangalle offers a quieter counterpoint with excellent surf at adjacent breaks.",
      "The east coast comes into full season between May and October, when Trincomalee and Pasikuda emerge at their best. Trincomalee's natural harbour is one of Asia's most magnificent, and the beaches at Nilaveli are among the island's most striking in scale and clarity.",
      'On the west coast, Hikkaduwa and Unawatuna remain the most accessible from Colombo, popular for reef snorkelling, reliable surf and a more social atmosphere.',
    ],
    note: 'General recommendations across all traveller types, unfiltered by preference profile.',
  },
  sharedHeritage: {
    label: sharedHeritageWorld.name,
    tabNote: 'Tea, railways, gardens and civic memory',
    recommendationsLabel: 'Heritage Recommendations',
    lede:
      "For travellers drawn to Sri Lanka's relationship with Britain, the strongest journeys avoid nostalgia and look instead at what endures: tea landscapes, railways, education, gardens, architecture and hospitality now fully part of modern Sri Lankan life.",
    paragraphs: [
      'I would begin in the hill country, where tea estates and old highland towns reveal how landscape, labour, climate and commerce reshaped the island. Nuwara Eliya is best approached not as a costume of the past, but as a living town with layered memory.',
      'From there, the railway gives the theme movement. Nine Arches Bridge and the hill country line turn engineering into atmosphere: mist, stone, forest, stations and slow travel held together in one route.',
      'In Colombo, the story becomes civic and social. Fort, the Galle Face Hotel, old public buildings and museum gardens are places where administration, education, architecture and daily city life continue to overlap.',
    ],
    note:
      'Selections prioritise shared cultural landscapes and living context. The route is educational and elegant, never a celebration of empire.',
  },
} as const

type ResponseMode = keyof typeof responseModes

export function ConciergeDesk() {
  const [responseMode, setResponseMode] = useState<ResponseMode>('personalised')
  const recommendationListRef = useRef<HTMLDivElement>(null)
  const response = responseModes[responseMode]
  const recommendations = responseMode === 'sharedHeritage' ? sharedHeritageRecommendations : defaultRecommendations

  const scrollRecommendations = (direction: 'up' | 'down') => {
    const list = recommendationListRef.current

    if (!list) {
      return
    }

    const firstCard = list.firstElementChild
    const cardHeight = firstCard instanceof HTMLElement ? firstCard.offsetHeight : 220

    list.scrollBy({
      top: direction === 'up' ? -(cardHeight + 16) : cardHeight + 16,
      behavior: 'smooth',
    })
  }

  return (
    <main className="concierge-desk" data-node-id="110:13527">
      <header className="concierge-topbar" data-node-id="110:13530">
        <div className="concierge-brand">
          <a href="/">Royale Isles Lanka</a>
          <span aria-hidden="true" />
          <p>Private Concierge</p>
        </div>
        <p className="concierge-greeting">Good afternoon, Eleanor.</p>
      </header>

      <div className="concierge-shell">
        <aside className="concierge-profile" aria-label="Traveller profile">
          <section className="concierge-panel concierge-traveller">
            <p className="concierge-kicker">Traveller Profile</p>
            <div className="concierge-monogram" aria-hidden="true">
              EW
            </div>
            <h1>Eleanor Whitfield</h1>
            <span className="concierge-traveller-tag">The Romantic Traveller</span>
            <p className="concierge-muted">
              Drawn to intimacy and the poetry of place. Prefers atmosphere over arrival,
              private beauty over popular spectacle.
            </p>
          </section>

          <section className="concierge-panel">
            <p className="concierge-kicker">Travelling Mood</p>
            <div className="concierge-mood-card">
              <strong>Romantic</strong>
              <span>From your Discovery journey</span>
            </div>
          </section>

          <section className="concierge-panel concierge-suggestions">
            <p className="concierge-kicker">Suggested Enquiries</p>
            <div className="concierge-question-list">
              {suggestedEnquiries.map((question) => (
                <button type="button" key={question}>
                  <span aria-hidden="true" />
                  {question}
                </button>
              ))}
            </div>
          </section>
        </aside>

        <section className="concierge-response" aria-label="Concierge response">
          <div className="concierge-response-tabs" aria-label="Response type">
            <span>Advisory Mode</span>
            <div role="tablist" aria-label="Response filters">
              {(Object.keys(responseModes) as ResponseMode[]).map((mode) => (
                <button
                  type="button"
                  role="tab"
                  aria-selected={responseMode === mode}
                  className={responseMode === mode ? 'active' : undefined}
                  key={mode}
                  onClick={() => setResponseMode(mode)}
                >
                  {responseModes[mode].label}
                </button>
              ))}
            </div>
            {response.tabNote ? <em>{response.tabNote}</em> : null}
          </div>

          <div className="concierge-response-scroll">
            <header className="concierge-response-header">
              <span aria-hidden="true" />
              <div>
                <p>We are pleased to advise on your enquiry.</p>
                <h2>"What are the best beaches in Sri Lanka?"</h2>
              </div>
            </header>

            <article className="concierge-answer">
              <p className="concierge-answer-lede">{response.lede}</p>
              {response.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <aside>{response.note}</aside>
            </article>
          </div>

          <form className="concierge-compose">
            <label htmlFor="concierge-message">Continue your consultation...</label>
            <input id="concierge-message" type="text" aria-label="Continue your consultation" />
            <button type="button" aria-label="Send message">
              <ArrowIcon />
            </button>
          </form>
        </section>

        <aside className="concierge-recommendations" aria-label={response.recommendationsLabel}>
          <div className="concierge-recommendations-header">
            <p className="concierge-kicker">{response.recommendationsLabel}</p>
            <div
              className="concierge-recommendation-controls"
              role="group"
              aria-label="Recommendation navigation"
            >
              <button
                type="button"
                className="up"
                aria-label="Scroll recommendations up"
                onClick={() => scrollRecommendations('up')}
              >
                <span aria-hidden="true" />
              </button>
              <button
                type="button"
                className="down"
                aria-label="Scroll recommendations down"
                onClick={() => scrollRecommendations('down')}
              >
                <span aria-hidden="true" />
              </button>
            </div>
          </div>
          <div className="concierge-card-list" ref={recommendationListRef}>
            {recommendations.map((recommendation) => (
              <article className="concierge-destination-card" key={recommendation.title}>
                <figure>
                  <img src={recommendation.image} alt="" />
                  <span>{recommendation.number}</span>
                </figure>
                <div>
                  <header>
                    <h3>{recommendation.title}</h3>
                    <ArrowIcon className="concierge-card-arrow" />
                  </header>
                  <p className="concierge-region">{recommendation.region}</p>
                  <p>{recommendation.copy}</p>
                </div>
              </article>
            ))}
          </div>
          <p className="concierge-selection-note">
            Select a destination to read our reasoning for this recommendation.
          </p>
        </aside>
      </div>
    </main>
  )
}
