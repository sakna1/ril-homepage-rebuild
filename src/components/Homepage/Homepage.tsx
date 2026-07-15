import { useEffect, useRef, useState } from 'react'
import './Homepage.css'
import { ArrowIcon } from '../ArrowIcon'
import { BrochureRequestForm } from './BrochureRequestForm'
import { experienceImages } from '../ExperiencesPage/images'
import { sharedHeritageWorld } from '../../journey/discoveryWorlds'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import kelaniTempleDetailImage from '../../assets/images/Kelani temple(1).JPG'
import kandyPeraheraImage from '../../assets/images/Kandy Perahera.JPG'
import queenVictoriaStatueImage from '../../assets/images/queen-victoria-statue-colombo.jpg'
import royaleIslesLogoImage from '../../assets/images/logo_bg_remove.png'
import royaleIslesMapImage from '../../assets/images/royale-isles-map-transparent-clean.png'
import sripadayaSkyImage from '../../assets/images/sripadaya sky.jpeg'
import travelTwoImage from '../../assets/images/travel2.jpg'

/*const images = {
  hero: '/figma-homepage/hero.jpg',
  consultation: '/figma-homepage/consultation.jpg',
  teaEstate: '/figma-homepage/tea-estate.jpg',
  artisan: '/figma-homepage/artisan.jpg',
  beachDinner: '/figma-homepage/beach-dinner.jpg',
  junglePavilion: '/figma-homepage/jungle-pavilion.jpg',
  ancientRuins: '/figma-homepage/ancient-ruins.jpg',
  highlandGolden: '/figma-homepage/highland-golden.jpg',
  coastJungle: '/figma-homepage/coast-jungle.jpg',
  travellerOutcrop: '/figma-homepage/traveller-outcrop.jpg',
  journalHours: '/figma-homepage/journal-hours.jpg',
  journalGuide: '/figma-homepage/journal-guide.jpg',
  hiroko: '/figma-homepage/hiroko.jpg',
  guideCover: '/figma-homepage/guide-cover.jpg',
}*/

const localImages = {
  kelaniTempleDetail: kelaniTempleDetailImage,
  kandyPerahera: kandyPeraheraImage,
  queenVictoriaStatue: queenVictoriaStatueImage,
  royaleIslesMap: royaleIslesMapImage,
  sripadayaSky: sripadayaSkyImage,
  travelTwo: travelTwoImage,
} as const

const experiences = [
  {
    image: experienceImages.leopardFeature,
    imageAlt: 'Sri Lankan leopard resting on rock at dusk in the wild',
    region: 'Wildlife & Wilderness',
    identity: 'For the Seeker of Silence',
    access: 'Fieldcraft - Private naturalist - Stillness',
    title: 'Where Silence Becomes the Guide',
    copy:
      'For the traveller who does not want nature performed, wilderness begins with patience: a field naturalist, a protected route, and the discipline to wait until the island reveals itself.',
  },
  {
    image: experienceImages.mirissaBoats,
    imageAlt: 'Fishing boats at Mirissa harbour at sunset',
    region: 'Ocean & Discovery',
    identity: 'For the Unhurried Wanderer',
    access: 'Whale paths - Quiet lagoons - Sailing days',
    title: 'The Deep-Water Hour',
    copy:
      'For travellers drawn to the sea as a living world: whale paths, quiet lagoons, sailing days, and coastlines that reveal themselves with patience.',
  },
  {
    image: experienceImages.heroSigiriya,
    imageAlt: 'Sigiriya rock fortress rising above the Sri Lankan landscape',
    region: 'Heritage & Memory',
    identity: 'For the Heritage Guardian',
    access: 'Scholarship - Protected timing - Living memory',
    title: 'Ancient Places, Entered With Care',
    copy:
      'Some travellers are drawn to what time has left behind. We shape access around light, silence, scholarship, and the dignity of places that should never feel consumed.',
  },
  {
    image: experienceImages.ayurveda,
    imageAlt: 'Ayurvedic treatment pavilion set within a tropical rainforest retreat',
    region: 'Wellness & Restoration',
    identity: 'For the Restorer',
    access: 'Ayurveda - Slow living - Personal renewal',
    title: 'The Ancient Grammar of Healing',
    copy: 'Ayurveda, healing traditions, retreats, slow living, and the quiet work of personal renewal.',
  },
  {
    image: experienceImages.hillCountry,
    imageAlt: 'Nuwara Eliya hill country landscape',
    region: 'Rail & Landscape',
    identity: 'For the Reflective Wanderer',
    access: 'Hill trains - Tea estates - Mountain light',
    title: 'A Private Tea Estate, Locked Before Dawn',
    copy: 'Hill country train journeys, tea estates, mountain routes, and scenery that changes by the hour.',
  },
  {
    image: localImages.kandyPerahera,
    imageAlt: 'Kandy Perahera procession with ceremonial performers in Sri Lanka',
    region: 'Culture & Human Connection',
    identity: 'For the Curious Witness',
    access: 'Private introductions - Family traditions - Human context',
    title: 'The Human Thread Beneath the Journey',
    copy:
      'Private introductions to artisans, dancers, custodians, and families turn a route through Sri Lanka into something more personal: a sequence of welcomes, briefly and respectfully shared.',
  },
  {
    image: localImages.queenVictoriaStatue,
    imageAlt: 'Marble statue of Queen Victoria, a British monument in Sri Lanka',
    region: sharedHeritageWorld.name,
    identity: sharedHeritageWorld.traveller,
    access: 'Civic monuments - Tea country - Colonial memory',
    title: sharedHeritageWorld.homepageTitle,
    copy: sharedHeritageWorld.homepageCopy,
  },
]

const experienceThreads = experiences.map((experience) => experience.region)

const philosophyLines = [
  {
    numeral: 'I',
    title: 'Listen',
    copy: "Before destinations, before any recommendation at all, we ask what you're seeking, not with a form, but a conversation. How you like to spend a morning. What kind of silence you're looking for. What you've outgrown in travel, and what you haven't yet found.",
  },
  {
    numeral: 'II',
    title: 'Curate',
    copy: 'From there, we draw on relationships built over years, with estate owners, retired planters, monks, chefs, and guides who have spent decades in one place. Not a catalogue to browse, but a small number of possibilities that were never going to be wrong for you.',
  },
  {
    numeral: 'III',
    title: 'Refine',
    copy: 'Together, we shape these into a journey with its own rhythm, where to linger, where to move on, where to leave room for nothing at all. Every detail considered. Nothing over-designed.',
  },
]

const sriLankaStats = [
  ['Private', 'Hosts, drivers, guides, and residence teams briefed around your preferences.'],
  ['8', 'UNESCO World Heritage Sites, accessed with timing designed around privacy.'],
  ['21', "National parks and reserves, with expert naturalists and quiet safari pacing."],
  ['1,340km', 'Of coastline for villas, yachts, wellness retreats, and family celebrations.'],
]

const journalItems = [
  {
    image: localImages.sripadayaSky,
    imageAlt: 'Mountain horizon at dawn above the Sri Lankan highlands',
    type: 'Field Notes',
    date: 'Timing & Pace',
    title: 'The Art of Protecting Unscheduled Time',
    excerpt: 'Why the most memorable journeys at this level often depend on what we deliberately leave unplanned.',
    path: '/journal/protecting-unscheduled-time',
  },
  {
    image: localImages.kelaniTempleDetail,
    imageAlt: 'Sacred mural detail inside Kelani temple in Sri Lanka',
    type: 'Private Interview',
    date: 'Sacred Access',
    title: 'The Temple Keeper Who Knows When Not to Speak',
    excerpt: 'A conversation on timing, restraint, and giving sacred places the privacy they deserve.',
    path: '/journal/the-temple-keeper',
  },
  {
    image: experienceImages.hillCountry,
    imageAlt: 'Misty Sri Lankan tea estate at golden hour',
    type: 'Seasonal Briefing',
    date: 'Highland Residences',
    title: 'When Tea Country Feels Entirely Yours',
    excerpt: "A curator's note on private residences, cloud forest mornings, and highland routes away from spectacle.",
    path: '/journal/private-tea-country',
  },
]

const travellerStories = [
  {
    image: localImages.travelTwo,
    format: 'Private Film',
    duration: 'II:2026',
    title: 'An anniversary carried by the island',
    quote:
      'We expected a beautiful trip. What we received felt like a private film of our own life, composed in tea country, temples, and candlelit coves.',
    name: 'Isabella & Laurent',
    location: 'Monaco',
    detail: 'Southern coast villas, cinnamon estates, and a dusk sail captured by our discreet host.',
    photoCaption: 'A coastal anniversary, traced between cinnamon estates and candlelit coves.',
    videoCaption: 'A discreet film of the moments between the formal itinerary: arrival, laughter, silence, sea air.',
  },
  {
    image: experienceImages.monks,
    format: 'Photo Journal',
    duration: 'I:LVI',
    title: 'A quiet return to wonder',
    quote: 'The photographs caught what I never would have asked anyone to capture: the pauses.',
    name: 'Hiroko S.',
    location: 'Tokyo',
    detail: 'A contemplative route through Kandy, the highlands, and private artisan studios.',
    photoCaption: 'A contemplative journey through Kandy, tea country, and private artisan rooms.',
    videoCaption: 'A soft visual record of rituals, thresholds, hands at work, and highland mornings.',
  },
  {
    image: experienceImages.mirissaBoats,
    format: 'Hosted Story',
    duration: 'III:XII',
    title: 'A family gathered without agenda',
    quote: 'Every detail disappeared into ease. The films and photographs brought back the feeling.',
    name: 'The Al-Khalid Family',
    location: 'Dubai',
    detail: 'Multi-generational coastal retreat with private dining, wildlife, and ocean rituals.',
    photoCaption: 'A multi-generational coastal gathering shaped around privacy, ease, and shared meals.',
    videoCaption: 'A private family film preserving dinners, wildlife mornings, and unposed time together.',
  },
]

const storyPromises = ['Photos and films handled privately', 'Hosted by discreet local experts', 'Built around your pace, not a schedule']

const heroVideo = '/figma-homepage/hero.mp4'
const heroPoster = '/figma-homepage/hero.jpg'

const brochureHighlights = [
  'Private residences, villas, and estate houses',
  'Discreet wildlife, heritage, and coastal access',
  'Seasonal guidance for private family travel',
  'Family-office level movement, hosting, and privacy',
  'Sample journey rhythms, never fixed itineraries',
  'A private consultation path for serious enquiries',
]

function getExpectationsHref(world: string) {
  return `/expectations?world=${encodeURIComponent(world)}`
}

export function Homepage() {
  const pageRef = useRef<HTMLElement>(null)
  const heroVideoRef = useRef<HTMLVideoElement>(null)
  const [activeStoryIndex, setActiveStoryIndex] = useState(0)
  const [isHeroMuted, setIsHeroMuted] = useState(false)
  const [activeExperienceIndex, setActiveExperienceIndex] = useState(0)
  const activeStory = travellerStories[activeStoryIndex]
  const activeExperience = experiences[activeExperienceIndex]

  useScrollReveal(pageRef)

  useEffect(() => {
    const rotationId = setInterval(() => {
      setActiveExperienceIndex((current) => (current + 1) % experiences.length)
    }, 7000)

    return () => clearInterval(rotationId)
  }, [activeExperienceIndex])

  const showNextExperience = () => {
    setActiveExperienceIndex((current) => (current + 1) % experiences.length)
  }

  useEffect(() => {
    const video = heroVideoRef.current
    if (!video) return

    video.volume = 1
    video.setAttribute('playsinline', '')
    video.setAttribute('webkit-playsinline', '')

    let hasStartedPlaying = false

    const attemptPlay = async () => {
      // Guard against loadeddata/canplay firing again after playback has
      // already started — re-issuing play() on a playing video can cause
      // an audible restart/overlap ("double sound").
      if (hasStartedPlaying) return

      video.muted = false

      try {
        await video.play()
        hasStartedPlaying = true
        setIsHeroMuted(false)
        return
      } catch {
        video.muted = true
        setIsHeroMuted(true)

        try {
          await video.play()
          hasStartedPlaying = true
        } catch {
          // Autoplay can still be blocked on some devices.
        }
      }
    }

    const handleLoadedData = () => {
      void attemptPlay()
    }

    const handleCanPlay = () => {
      void attemptPlay()
    }

    void attemptPlay()
    video.addEventListener('loadeddata', handleLoadedData)
    video.addEventListener('canplay', handleCanPlay)

    const handleVisibilityChange = () => {
      if (!document.hidden && video.paused) {
        void video.play().catch(() => {})
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData)
      video.removeEventListener('canplay', handleCanPlay)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  const toggleHeroSound = () => {
    const video = heroVideoRef.current
    if (!video) return

    if (video.muted) {
      video.muted = false
      video.volume = 1
      setIsHeroMuted(false)
      void video.play().catch(() => {})
    } else {
      video.muted = true
      setIsHeroMuted(true)
    }
  }

  const showPreviousStory = () => {
    setActiveStoryIndex((currentIndex) => (currentIndex === 0 ? travellerStories.length - 1 : currentIndex - 1))
  }

  const showNextStory = () => {
    setActiveStoryIndex((currentIndex) => (currentIndex + 1) % travellerStories.length)
  }

  return (
    <main className="figma-homepage" ref={pageRef} data-node-id="101:12274">
      <section className="figma-hero" data-node-id="101:12275">
        <video
          ref={heroVideoRef}
          className="figma-hero-video"
          src={heroVideo}
          poster={heroPoster}
          autoPlay
          muted={isHeroMuted}
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
        />
        <button
          type="button"
          className="figma-hero-sound"
          onClick={toggleHeroSound}
          aria-label={isHeroMuted ? 'Unmute video' : 'Mute video'}
        >
          <span aria-hidden="true" data-state={isHeroMuted ? 'muted' : 'unmuted'} />
          <small>{isHeroMuted ? 'Unmute sound' : 'Mute sound'}</small>
        </button>
        <div className="figma-hero-overlay" />
        <div className="figma-hero-content">
          <h1>
            Sri Lanka,
            <span>held privately.</span>
          </h1>
          <div className="figma-hero-actions">
            <a href="#begin">Begin a Private Conversation</a>
          </div>
        </div>
         {/*<p className="figma-hero-caption">Bespoke journeys for private families, principals, and those who travel rarely, and only well.</p>*/}
      </section>

      <section className="figma-experiences" id="experiences" data-node-id="103:12794">
        <div className="figma-container">
          <header className="figma-section-header figma-experiences-header reveal">
            <div>
              <p className="figma-overline">Inspiration Before Curation</p>
              <h2>
                Ways Into The{' '}
                <span className="figma-experiences-brand">
                  <img
                    className="figma-experiences-mark"
                    src={royaleIslesLogoImage}
                    alt=""
                    aria-hidden="true"
                  />
                  Royale Isles
                </span>
              </h2>
              <p>
                These Discovery Worlds are not decisions. They are editorial lenses for understanding
                Sri Lanka before any journey is saved, scored, or shaped around you.
              </p>
            </div>
            <aside className="figma-experience-brief">
              <span>First Curation Step</span>
              <p>
                When one world feels like yours, continue to Expectations. That is where your
                preferences begin shaping My Journey.
              </p>
              <a href="/expectations">Continue To Expectations</a>
            </aside>
          </header>

          <div className="figma-theme-thread" aria-label="Discovery worlds" role="tablist">
            {experienceThreads.map((thread, index) => (
              <button
                type="button"
                key={thread}
                className={index === activeExperienceIndex ? 'is-active' : undefined}
                onClick={() => setActiveExperienceIndex(index)}
                role="tab"
                aria-selected={index === activeExperienceIndex}
              >
                {thread}
              </button>
            ))}
          </div>

          <div className="figma-experience-list reveal" aria-live="polite">
            <article className="figma-experience">
              <figure className="figma-experience-media">
                <img src={activeExperience.image} alt={activeExperience.imageAlt} />
                <figcaption>
                  <small>{activeExperience.access}</small>
                </figcaption>
              </figure>
              <div className="figma-experience-copy">
                <p className="figma-card-label">{activeExperience.region}</p>
                <small>{activeExperience.identity}</small>
                <h3>{activeExperience.title}</h3>
                <p>{activeExperience.copy}</p>
                <div className="figma-experience-actions">
                  <a className="figma-button-secondary" href={getExpectationsHref(activeExperience.region)}>
                    Continue To Expectations
                  </a>
                  <button type="button" className="figma-experience-next" onClick={showNextExperience}>
                    Next World
                    <ArrowIcon />
                  </button>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="figma-philosophy" data-node-id="103:12834">
        <div className="figma-container">
          <header className="figma-philosophy-header reveal">
            <div>
              <p className="figma-overline">The Philosophy</p>
              <h2>The Standard Behind The Journey</h2>
            </div>
            <aside>
              <span>House Principles</span>
              <p>
                Before a route is designed, before access is requested, before any host is approached,
                we decide whether the journey can be held with enough care.
              </p>
            </aside>
          </header>
          <div className="figma-philosophy-lines reveal">
            {philosophyLines.map((line) => (
              <article key={line.title}>
                <span className="figma-roman">{line.numeral}</span>
                <div>
                  <h3>{line.title}</h3>
                  <p>{line.copy}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="figma-discover-statement reveal">
            <strong>And then, the journey disappears into ease.</strong>
            <p>
              What you experience in Sri Lanka should not feel managed. It should feel inevitable:
              the right host at the right door, the right room prepared before arrival, the right
              silence protected, the right celebration unfolding without strain.
            </p>
          </div>
          <footer className="figma-founder reveal">
            <div>
              <span>Robert Knox</span>
              <small>An Historical Relation of the Island Ceylon, 1681</small>
            </div>
            <p>
              “The Land is full of Hills, but exceedingly well watered, there being many pure and
              clear Rivers running through them.” Four centuries later, that same green quiet still
              waits — entered privately, and without hurry.
            </p>
          </footer>
        </div>
      </section>

      <section className="figma-island-stats" id="destinations" data-node-id="103:12887">
        <figure className="figma-island-stats-media reveal">
          <img
            className="figma-island-stats-map"
            src={localImages.royaleIslesMap}
            alt="Illustrated map of Sri Lanka for Royale Isles Lanka"
          />
          <figcaption>
            <span>Royale Isles Map</span>
            <small>Regions, coastlines, highlands, and cultural routes arranged as one private island journey.</small>
          </figcaption>
        </figure>
        <div className="figma-island-stats-copy reveal">
          <div className="figma-island-stats-heading">
            <p className="figma-overline">Why Sri Lanka</p>
            <h2>
              A small island with <em>private worlds</em> within it.
            </h2>
            <p>
              At this level of travel, scale matters. Sri Lanka is compact enough to move through with ease,
              yet layered enough to hold wilderness, sacred cities, coastal privacy, wellness, and
              family celebration in one carefully protected journey.
            </p>
          </div>
          <dl>
            {sriLankaStats.map(([value, label]) => (
              <div key={value}>
                <dt>{value}</dt>
                <dd>{label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="figma-journal" id="journal" data-node-id="103:12936">
        <div className="figma-container">
          <header className="figma-section-header figma-journal-header reveal">
            <div>
              <p className="figma-kicker-line">The Private Journal</p>
              <h2>
                Intelligence for journeys that must feel <em>effortless.</em>
              </h2>
              <p>
                Essays, field letters, and curator briefings for travellers who value privacy,
                discretion, and access that is meaningful precisely because it is never obvious.
              </p>
            </div>
            <aside className="figma-journal-brief">
              <span>For principals and private families</span>
              <p>
                Notes on timing, hosting, residences, wellness, family movement, and the quiet
                details that separate a good trip from a fully held journey.
              </p>
              <a href="/journal">
                Enter The Journal <ArrowIcon />
              </a>
            </aside>
          </header>
          <div className="figma-journal-grid reveal">
            <article className="figma-feature-story">
              <div className="figma-feature-story-copy">
                <p>
                  Private Field Letter <span>Protected Access</span>
                </p>
                <h3>&quot;The best moment was the one nobody else knew had been arranged.&quot;</h3>
                <span>
                  A guest reflects on private access, protected time, and the quiet intelligence of a
                  journey that never announced itself as luxury.
                </span>
                <ul className="figma-feature-story-points" aria-label="Featured journal themes">
                  <li>Protected dawn access</li>
                  <li>Discreet family-office pacing</li>
                  <li>Resident scholar accompaniment</li>
                </ul>
                <a href="/journal/the-sigiriya-dawn-ascent">
                  Read The Field Letter <ArrowIcon />
                </a>
              </div>
              <figure className="figma-feature-story-stamp">
                <img src={experienceImages.sigiriyaMain} alt="Sigiriya rock fortress rising above the Sri Lankan landscape" />
                <figcaption>
                  <span>Private Access</span>
                  <small>Sigiriya before the first public ascent</small>
                </figcaption>
              </figure>
            </article>
            <div className="figma-journal-list">
              {journalItems.map((item) => (
                <article key={item.title}>
                  <figure className="figma-journal-thumb">
                    <img src={item.image} alt={item.imageAlt} />
                  </figure>
                  <div>
                    <p>
                      {item.type} <span>{item.date}</span>
                    </p>
                    <h4>{item.title}</h4>
                    <span>{item.excerpt}</span>
                    <a href={item.path}>
                      Read note <ArrowIcon />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="figma-testimonials" data-node-id="103:13017">
        <div className="figma-container figma-testimonials-inner">
          <header className="figma-testimonials-heading reveal">
            <p className="figma-centered-kicker">Traveller Stories</p>
            <h2>Traveller stories, held in photographs and private film.</h2>
            <p>
              For select journeys, memory is part of the craft. A discreet visual host can travel
              alongside the guest, preserving the unposed details: the first tea estate sunrise, the
              private table by the sea, the silence after a leopard crosses the track.
            </p>
          </header>

          <article className="figma-testimonial-carousel reveal" aria-live="polite">
            <figure className="figma-testimonial-photo">
              <img src={activeStory.image} alt="" />
              <figcaption>
                <span>Photo Story</span>
                <p>{activeStory.photoCaption}</p>
              </figcaption>
            </figure>

            <div className="figma-testimonial-copy">
              <p className="figma-story-location">{activeStory.location}</p>
              <h3>{activeStory.title}</h3>
              <blockquote>&ldquo;{activeStory.quote}&rdquo;</blockquote>
              <footer>
                <strong>{activeStory.name}</strong>
                <span>{activeStory.detail}</span>
              </footer>
              <div className="figma-story-carousel-controls" aria-label="Browse traveller stories">
                <button type="button" onClick={showPreviousStory} aria-label="Show previous traveller story">
                  ‹
                </button>
                <div>
                  {travellerStories.map((story, index) => (
                    <button
                      type="button"
                      key={story.name}
                      className={index === activeStoryIndex ? 'is-active' : undefined}
                      onClick={() => setActiveStoryIndex(index)}
                      aria-label={`Show ${story.name} traveller story`}
                      aria-current={index === activeStoryIndex ? 'true' : undefined}
                    />
                  ))}
                </div>
                <button type="button" onClick={showNextStory} aria-label="Show next traveller story">
                  ›
                </button>
              </div>
            </div>

            <aside className="figma-testimonial-video">
              <div className="figma-testimonial-video-media">
                <img src={activeStory.image} alt="" />
                <button type="button" aria-label={`Watch ${activeStory.name} private film`}>
                  <span aria-hidden="true" />
                  <small>Watch private film · {activeStory.duration}</small>
                </button>
              </div>
              <div>
                <p>{activeStory.format}</p>
                <h4>Video companion</h4>
                <span>{activeStory.videoCaption}</span>
              </div>
            </aside>
          </article>

          <div className="figma-story-promises reveal" aria-label="Traveller story inclusions">
            {storyPromises.map((promise) => (
              <span key={promise}>{promise}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="figma-invitation" id="begin" data-node-id="103:12992">
        <div className="figma-invitation-inner reveal">
          <div className="figma-invitation-mark" aria-hidden="true">
            ✦
          </div>
          <p className="figma-overline">A Personal Invitation</p>
          <h2>Begin With a Private Conversation</h2>
          <p>
            Tell us who is travelling, what must be protected, what should feel effortless, and what
            would make Sri Lanka feel personally meaningful. We will respond with considered next
            steps, not a catalogue.
          </p>
          <a className="figma-invitation-cta" href="/discover-sri-lanka">
            Begin With Discovery
          </a>
          <small>Explore the island privately, with no obligation.</small>
          <p className="figma-invitation-aside">
            Planning your arrival?{' '}
            <a href="/travel-preparation#assurance">See what we arrange before you land</a>
          </p>
        </div>
      </section>

      <section className="figma-brochure" data-node-id="103:13062">
        <div className="figma-container figma-brochure-grid">
          <div className="figma-brochure-copy reveal">
            <p className="figma-copper-overline">Private Sri Lanka Briefing</p>
            <h2>Request the Private Brochure</h2>
            <span className="figma-copper-rule" />
            <p>
              A considered introduction for private families, principals, and thoughtful travellers
              exploring Sri Lanka at the highest level: quiet residences, trusted hosts, protected
              timing, and private moments arranged with discretion rather than display.
            </p>
            <div className="figma-brochure-panel">
              <span>Inside the briefing</span>
              <ol className="figma-brochure-list">
                {brochureHighlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            </div>
            <p className="figma-brochure-note">
              Sent privately, without an automated itinerary or mailing-list noise: a polished first
              briefing for travellers who expect careful judgement before any recommendation is made.
            </p>
            <BrochureRequestForm />
          </div>
          <aside className="figma-brochure-card reveal" aria-label="Private brochure preview">
            <figure className="figma-brochure-preview" aria-hidden="true">
              <span className="figma-brochure-sheet">
                <small>Private Briefing</small>
                <strong>Sri Lanka</strong>
                <i />
              </span>
              <span className="figma-brochure-leaf">
                <i />
                <i />
                <i />
              </span>
            </figure>
            <div>
              <p>Royale Isles Lanka</p>
              <h3>Sri Lanka, held privately for the thoughtful traveller.</h3>
              <span>
                A confidential prelude to the conversation: residences, access, family movement,
                wellness, wildlife, and the moments best kept away from the obvious path.
              </span>
            </div>
          </aside>
        </div>
      </section>

      {/*
      <section className="figma-guide" data-node-id="103:13062">
        <div className="figma-container figma-guide-grid">
          <figure>
            <img src={images.guideCover} alt="Travel guide cover and journal objects" />
          </figure>
          <div className="figma-copy-stack">
            <p className="figma-copper-overline">If you&apos;re not ready yet</p>
            <h2>Wander a Little Longer</h2>
            <span className="figma-copper-rule" />
            <p>
              Before every journey comes a period of curiosity, looking things up late at night,
              returning to the same photographs, wondering what it might be like. This is for that
              part. A small collection of places, stories, and things worth knowing, gathered in one
              place, with nothing to decide yet.
            </p>
            <ol className="figma-guide-list">
              {guideItems.map((item, index) => (
                <li key={item}>
                  <span>{['i', 'ii', 'iii', 'iv', 'v', 'vi'][index]}</span>
                  {item}
                </li>
              ))}
            </ol>
            <p>
              Before every journey comes a period of curiosity, looking things up late at night,
              returning to the same photographs, wondering what it might be like.
            </p>
            <p className="figma-guide-note">
              Complimentary. Private. Yours.
              <br />
              Open it here, whenever you have a little time. Or, if you&apos;d rather come back to
              it, we can send it to you instead.
            </p>
            <form className="figma-guide-form">
              <input type="email" aria-label="Your email address" placeholder="Your email address" />
              <button type="submit">Receive Guide</button>
            </form>
          </div>
        </div>
      </section>
      */}
    </main>
  )
}