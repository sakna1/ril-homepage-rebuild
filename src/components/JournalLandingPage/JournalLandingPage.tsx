import './JournalLandingPage.css'
import type { CSSProperties } from 'react'
import bopathEllaImage from '../../assets/images/Bopath Ella.jpeg'
import galleFaceBeachImage from '../../assets/images/Galle face beach.jpeg'
import kandyPeraheraImage from '../../assets/images/Kandy Perahera.JPG'
import kelaniTempleDetailImage from '../../assets/images/Kelani temple(1).JPG'
import maduRiverImage from '../../assets/images/Madu River.jpeg'
import naalandaImage from '../../assets/images/Naalanda gedige Matale.jpg'
import naalandaDetailImage from '../../assets/images/Naalanda gedige Matale(1).jpg'
import sripadayaSkyImage from '../../assets/images/sripadaya sky.jpeg'
import theruFestivalImage from '../../assets/images/theru festival.jpg'
import { experienceImages } from '../ExperiencesPage/images'
import { ArrowIcon } from '../ArrowIcon'

type Texture = {
  label: string
  image?: string
  alt?: string
  wide?: boolean
  rotate?: string
  quote?: string
  cite?: string
}

type ArchiveRegion = {
  title: string
  places: string
  description: string
  marker: string
}

type Vignette = {
  entry: string
  title: string
  copy: string
  image?: string
  alt?: string
  meta: string
  rotate: string
  watermark?: string
}

const journalAssets = {
  coast: experienceImages.mirissaBoats,
  teaMist: experienceImages.hillCountry,
  galleFort: experienceImages.galleFort,
  monk: experienceImages.monks,
  spices: experienceImages.spices,
  cinnamon: naalandaDetailImage,
  silk: kandyPeraheraImage,
  glass: maduRiverImage,
  boatPaint: experienceImages.mirissaBoats,
  lotus: kelaniTempleDetailImage,
  monsoonStone: sripadayaSkyImage,
  cardamom: bopathEllaImage,
  galleAlley: experienceImages.galleFort,
  lighthouse: galleFaceBeachImage,
  nilaveli: experienceImages.mirissaBoats,
  dancer: theruFestivalImage,
  jaffnaFort: naalandaImage,
  hillRain: sripadayaSkyImage,
  teaCup: experienceImages.hillCountry,
  sigiriyaPanorama: experienceImages.sigiriyaMain,
} as const

const textures: Texture[] = [
  { label: 'Ceylon Cinnamon', image: journalAssets.cinnamon, alt: 'Macro texture of crushed cinnamon bark', wide: true },
  { label: 'Silk Weave · Kandy', image: journalAssets.silk, alt: 'Indigo and gold woven silk sarong fabric', rotate: '-1deg' },
  { label: 'King Coconut · 2pm', image: journalAssets.glass, alt: 'Condensation on cold glass with tropical blur', wide: true },
  {
    label: 'From a letter',
    quote: 'Every surface tells a story if you press your fingers against it long enough.',
    cite: '— From a letter, never sent',
  },
  { label: 'Oruwa · Negombo', image: journalAssets.boatPaint, alt: 'Fishing boats at Mirissa harbour at sunset', rotate: '1.5deg' },
  { label: 'Temple Lotus · Dawn', image: journalAssets.lotus, alt: 'Sacred mural detail inside Kelani temple', wide: true },
  { label: 'Monsoon · Aug', image: journalAssets.monsoonStone, alt: 'Highland horizon in mist above the Sri Lankan hills', rotate: '-2deg' },
  { label: 'Spice Garden · Matale', image: journalAssets.cardamom, alt: 'Ground cardamom and star anise on stone mortar', wide: true },
]

const archiveRegions: ArchiveRegion[] = [
  {
    title: 'The South',
    places: 'Galle · Tangalle · Mirissa · Weligama',
    description: 'Fortified coasts, market mornings, and the particular amber of afternoon light on Portuguese stone.',
    marker: 'S',
  },
  {
    title: 'The Hill Country',
    places: 'Kandy · Ella · Nuwara Eliya · Haputale',
    description: 'Mist-wrapped tea estates, colonial bungalows, and the slow patience of mountain time.',
    marker: 'H',
  },
  {
    title: 'The Coast',
    places: 'Trinco · Arugam Bay · Kalpitiya · Negombo',
    description: 'Surf fishermen, outrigger at dawn, and water colours that refuse to be named.',
    marker: 'C',
  },
  {
    title: 'The Ancient North',
    places: 'Jaffna · Anuradhapura · Polonnaruwa',
    description: 'Ruins absorbed by jungle, palmyrah horizons, and the particular weight of very old stone.',
    marker: 'N',
  },
]

function getArchiveRegionId(title: string) {
  return `journal-region-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
}

const vignettes: Vignette[] = [
  {
    entry: 'Entry #008 · Trincomalee',
    title: 'The Colour Before a Name',
    copy:
      'The water at Nilaveli had no adequate English description. Turquoise feels commercial. Aquamarine too mineral. The fishermen simply call it the sea.',
    image: journalAssets.nilaveli,
    alt: 'Fishing boats at Mirissa harbour at sunset',
    meta: 'The Coast · March 2024',
    rotate: '-1deg',
  },
  {
    entry: 'Entry #019 · Kandy',
    title: 'The Drum Before the Dance',
    copy:
      'You hear Kandyan drums from two streets away. Then one street. Then the vibration is inside you, making decisions for your heartbeat. The dance begins before the dancer enters.',
    image: journalAssets.dancer,
    alt: 'Kandyan dancer in traditional costume',
    meta: 'Hill Country · Festival Season',
    rotate: '2deg',
    watermark: 'Ceylon',
  },
  {
    entry: 'Entry #041 · Jaffna',
    title: 'Letters Returned North',
    copy:
      'Jaffna trades in patience. The palmyrah groves grow slowly; the people who return do so carefully. Even the fort crumbles with a kind of dignity, brick by deliberate brick.',
    image: journalAssets.jaffnaFort,
    alt: 'Jaffna fort ruins at sunset',
    meta: 'The Ancient North · November 2024',
    rotate: '-2deg',
  },
]

function SectionRuleHeader({
  title,
  meta,
  className = '',
}: {
  title: string
  meta: string
  className?: string
}) {
  return (
    <header className={`journal-rule-header ${className}`}>
      <h2>{title}</h2>
      <span />
      <p>{meta}</p>
    </header>
  )
}

function Tape() {
  return <span className="journal-tape" aria-hidden="true" />
}

function PhotoFrame({
  src,
  alt,
  className = '',
  caption,
  dashed = false,
}: {
  src: string
  alt: string
  className?: string
  caption?: string
  dashed?: boolean
}) {
  return (
    <figure className={`journal-photo ${dashed ? 'journal-photo--dashed' : ''} ${className}`}>
      <div>
        <img src={src} alt={alt} />
      </div>
      {caption ? <figcaption>{caption}</figcaption> : null}
      <Tape />
    </figure>
  )
}

function StoryTags({ tags }: { tags: string[] }) {
  return (
    <div className="journal-story-tags">
      <span>Filed Under</span>
      <div>
        {tags.map((tag) => (
          <a href="/journal" key={tag}>
            {tag}
          </a>
        ))}
      </div>
    </div>
  )
}

function ReadLink() {
  return (
    <a className="journal-read-link" href="/journal/the-sigiriya-dawn-ascent">
      Read Full Entry <ArrowIcon />
    </a>
  )
}

function StoryCard({
  number,
  region,
  weather,
  date,
  title,
  accent,
  lede,
  body,
  tags,
  tinted = false,
}: {
  number: string
  region: string
  weather: string
  date: string
  title: string
  accent?: string
  lede: string
  body: string
  tags: string[]
  tinted?: boolean
}) {
  return (
    <article className={`journal-story-card ${tinted ? 'journal-story-card--tinted' : ''}`}>
      <header>
        <p>{number} · {region}</p>
        <span />
        <p>{weather}</p>
      </header>
      <p className="journal-story-date">{date}</p>
      <h3>
        {title}
        {accent ? (
          <>
            <br />
            <em>{accent}</em>
          </>
        ) : null}
      </h3>
      <div className="journal-story-lede">
        <span />
        <p>{lede}</p>
      </div>
      <p className="journal-story-body">{body}</p>
      <footer>
        <StoryTags tags={tags} />
        <ReadLink />
      </footer>
    </article>
  )
}

function VignetteCard({ vignette }: { vignette: Vignette }) {
  return (
    <article className="journal-vignette" style={{ '--rotate': vignette.rotate } as CSSProperties}>
      {vignette.watermark ? <span className="journal-vignette-watermark">{vignette.watermark}</span> : null}
      <p className="journal-vignette-entry">{vignette.entry}</p>
      {vignette.image ? <img src={vignette.image} alt={vignette.alt} /> : null}
      <h3>{vignette.title}</h3>
      <p>{vignette.copy}</p>
      <small>{vignette.meta}</small>
    </article>
  )
}

function ArchiveCard({ region }: { region: ArchiveRegion }) {
  return (
    <article className="journal-archive-card" id={getArchiveRegionId(region.title)}>
      <span className="journal-archive-marker">{region.marker}</span>
      <h3>{region.title}</h3>
      <p className="journal-archive-places">{region.places}</p>
      <p>{region.description}</p>
    </article>
  )
}

export function JournalLandingPage() {
  return (
    <main className="journal-landing-page">
      <section className="journal-hero" aria-labelledby="journal-title">
        <div className="journal-hero-texture" />
        <p className="journal-watermark" aria-hidden="true">Lanka</p>
        <div className="journal-container journal-hero-inner">
          <div className="journal-title-block">
            <p>Royale Isles Private Journal · Volume IV</p>
            <h1 id="journal-title">
              A Private Atlas
              <br />
              <em>of Sri Lanka</em>
            </h1>
            <div>
              <span />
              <p>
                Cultural intelligence, private addresses, and carefully observed moments for guests
                who expect Sri Lanka to be interpreted with discretion, taste, and rare access.
              </p>
            </div>
            <ul className="journal-hero-signals" aria-label="Journal standards">
              <li>Curator-led</li>
              <li>Privately vetted</li>
              <li>Access-minded</li>
            </ul>
            <div className="journal-hero-actions" aria-label="Journal actions">
              <a href="#journal-archive">Explore the Archive</a>
              <a href="/concierge">Ask the Concierge</a>
            </div>
          </div>

          <div className="journal-scattered-layout">
            <PhotoFrame
              className="journal-hero-coast"
              src={journalAssets.coast}
              alt="Fishing boats at Mirissa harbour at sunset"
              caption="Southern Coast · Sri Lanka"
              dashed
            />
            <PhotoFrame
              className="journal-hero-galle"
              src={journalAssets.galleFort}
              alt="Ancient Galle Fort walls at dusk"
              caption="Galle Fort · Overcast"
            />
            <PhotoFrame
              className="journal-hero-tea"
              src={journalAssets.teaMist}
              alt="Nuwara Eliya hill country landscape"
              caption="Ella · Hill Country · 6°C"
            />
            <PhotoFrame
              className="journal-hero-spices"
              src={journalAssets.spices}
              alt="Close-up of Sri Lankan spices"
            />
            <PhotoFrame
              className="journal-hero-monk"
              src={journalAssets.monk}
              alt="Buddhist monks walking through morning mist toward an ancient temple"
              dashed
            />

            <aside className="journal-pinned-note">
              <p>Editor&apos;s Note</p>
              <blockquote>
                "The island rewards travellers who arrive with patience, privacy, and the right
                introductions."
              </blockquote>
              <cite>— Arjun Fernando · Editor-at-large</cite>
            </aside>

            <aside className="journal-weather-note">
              <p>Current Intelligence</p>
              <strong>Galle · Kandy · Jaffna</strong>
              <span>Private access notes across 4 regions</span>
            </aside>

            <span className="journal-handwritten journal-handwritten--hero">for exceptional arrivals</span>
          </div>
        </div>
      </section>

      <section className="journal-texture-rail" aria-label="Sensory archive">
        <div className="journal-rail-heading">
          <p>Sensory Index · Privately Observed</p>
          <span />
          <p>Details Before Itinerary</p>
        </div>
        <div className="journal-rail-carousel">
          <div className="journal-rail-track">
            {[0, 1].map((setIndex) => (
              <div className="journal-rail-set" key={setIndex} aria-hidden={setIndex === 1}>
                {textures.map((texture) =>
                  texture.image ? (
                    <figure
                      className={`journal-texture-item ${texture.wide ? 'journal-texture-item--wide' : ''}`}
                      key={`${setIndex}-${texture.label}`}
                    >
                      <img src={texture.image} alt={setIndex === 0 ? texture.alt : ''} />
                      <figcaption>{texture.label}</figcaption>
                    </figure>
                  ) : (
                    <blockquote className="journal-texture-quote" key={`${setIndex}-${texture.label}`}>
                      <p>"{texture.quote}"</p>
                      <cite>{texture.cite}</cite>
                    </blockquote>
                  ),
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="journal-flow-intro" aria-labelledby="journal-flow-title">
        <div className="journal-container journal-flow-intro-grid">
          <p>Private Editorial Standard</p>
          <h2 id="journal-flow-title">
            Written for travellers who value cultural fluency as much as flawless logistics.
          </h2>
          <p>
            The Journal is our quieter layer of expertise: the table worth reserving before it is
            known, the temple hour without crowds, the villa host who remembers how you take tea, and
            the seasonal nuance that turns a good itinerary into an exceptional one.
          </p>
        </div>
      </section>

      <section className="journal-stories">
        <div className="journal-container">
          <SectionRuleHeader title="Private Dispatches" meta="Two long-form entries · Read before you travel" />

          <article className="journal-story-entry journal-story-entry--galle">
            <p className="journal-side-note">Galle · 6.053° N</p>
            <StoryCard
              number="Entry #012"
              region="Galle Province"
              weather="Overcast · 24°C"
              date="27 January 2024 · 14:22 hrs"
              title="A Whisper"
              accent="in Galle"
              lede="The Fort exhales in the afternoon. Not metaphorically — the sea wind finds its way through the Portuguese-built ramparts, through the Dutch-era archways, and deposits itself in the narrow lanes like a patient ghost."
              body="A woman was selling brooms outside a pale mint house that bore a brass plaque still reading 1874. Her daughter sat on the step reading what appeared to be a Tamil-translated Agatha Christie. Nobody found this unusual. That, perhaps, is the whole story."
              tags={['The South', 'Colonial Heritage', 'Slow Travel']}
            />
            <div className="journal-image-cluster journal-image-cluster--galle">
              <PhotoFrame src={journalAssets.galleAlley} alt="Narrow cobblestone alley in Galle Fort" caption="Church Street · Galle Fort" />
              <PhotoFrame src={journalAssets.lighthouse} alt="Dutch colonial lighthouse at Galle Fort" dashed />
              <span className="journal-handwritten">the colour of old coral</span>
            </div>
          </article>

          <article className="journal-story-entry journal-story-entry--monsoon">
            <div className="journal-image-cluster journal-image-cluster--monsoon">
              <PhotoFrame src={journalAssets.hillRain} alt="Highland horizon in mist above the Sri Lankan hills" caption="Ella Rock · 1,041m" />
              <PhotoFrame src={journalAssets.teaCup} alt="Misty Sri Lankan tea estate at golden hour" />
            </div>
            <StoryCard
              number="Entry #031"
              region="Hill Country"
              weather="Mist · 14°C"
              date="14 August 2024 · 07:05 hrs · Ella"
              title="Monsoon"
              accent="Reflections"
              lede="The rains arrive before the light does. By the time the first train passes through Demodara, the valley below Ella Rock is already brimming with fog the colour of unrinsed milk."
              body="There is a particular quality to monsoon silence. It is not quiet. The rain speaks in layers: roof-tin percussion, gutter trickle, the sustained bass of heavy drops on banana leaf. It is the only music that makes the hills feel owned by no one — and briefly, everyone."
              tags={['Hill Country', 'Monsoon Season', 'Solitude']}
              tinted
            />
          </article>

          <div className="journal-vignettes">
            {vignettes.map((vignette) => (
              <VignetteCard key={vignette.title} vignette={vignette} />
            ))}
          </div>
        </div>
      </section>

      <section className="journal-panorama">
        <img src={journalAssets.sigiriyaPanorama} alt="Sigiriya rock fortress rising above the Sri Lankan landscape" />
        <div>
          <p>Featured Passage · Sigiriya · Feb 2024</p>
          <blockquote>
            "The King climbed this
            <br />
            rock to be closer to God.
            <br />
            I climbed it to understand why."
          </blockquote>
          <cite>— Journal Entry #055 · Lion Rock · 370m Ascent</cite>
        </div>
      </section>

      <section className="journal-region-guide" aria-labelledby="journal-region-guide-title">
        <div className="journal-container">
          <div className="journal-region-guide-card">
            <div>
              <p>Regional Intelligence</p>
              <h2 id="journal-region-guide-title">Choose the chapter that matches your private journey.</h2>
            </div>
            <nav aria-label="Journal regions">
              {archiveRegions.map((region) => (
                <a href={`#${getArchiveRegionId(region.title)}`} key={region.title}>
                  <span>{region.title}</span>
                  <small>{region.places}</small>
                </a>
              ))}
            </nav>
          </div>
        </div>
      </section>

      <section className="journal-archive" id="journal-archive">
        <div className="journal-container">
          <SectionRuleHeader title="The Private Archive" meta="55 entries · 4 volumes · Ongoing" />
          <div className="journal-archive-grid">
            {archiveRegions.map((region) => (
              <ArchiveCard key={region.title} region={region} />
            ))}
          </div>
        </div>
      </section>

      <section className="journal-dispatch">
        <div className="journal-dispatch-inner">
          <div className="journal-dispatch-mark" aria-hidden="true">
            ✦
          </div>
          <p>Members&apos; Monthly Dispatch</p>
          <h2>
            Receive Sri Lanka
            <br />
            <em>before it becomes obvious.</em>
          </h2>
          <p>
            One discreet letter each month: a new private address, a cultural note from our team, and
            a single seasonal recommendation worth planning around.
          </p>
          <form className="journal-newsletter" action="#" onSubmit={(event) => event.preventDefault()}>
            <input type="email" aria-label="Email address for the monthly dispatch" placeholder="Your email address" />
            <button type="submit">Request The Dispatch</button>
          </form>
          <small>Private correspondence. No campaigns. Unsubscribe with one click.</small>
        </div>
      </section>
    </main>
  )
}
