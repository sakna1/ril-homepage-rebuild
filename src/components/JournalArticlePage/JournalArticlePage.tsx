import './JournalArticlePage.css'
import type { CSSProperties, ReactNode } from 'react'
import kelaniTempleDetailImage from '../../assets/images/Kelani temple(1).JPG'
import maduRiverImage from '../../assets/images/Madu River.jpeg'
import naalandaImage from '../../assets/images/Naalanda gedige Matale.jpg'
import naalandaDetailImage from '../../assets/images/Naalanda gedige Matale(1).jpg'
import peradeniyaImage from '../../assets/images/Peradeniya.jpg'
import sripadayaSkyImage from '../../assets/images/sripadaya sky.jpeg'
import { experienceImages } from '../ExperiencesPage/images'

type Note = {
  label: string
  title: string
  body: ReactNode
  footer?: string
  className?: string
}

type Photo = {
  src: string
  alt: string
  caption: string
  meta?: string
  className?: string
}

type ArchiveEntry = {
  entry: string
  region: string
  title: string
  copy: string
  image: string
  alt: string
  rotate: string
}

const articleAssets = {
  hero: experienceImages.sigiriyaMain,
  staircase: sripadayaSkyImage,
  steps: experienceImages.sigiriyaMain,
  frescoes: kelaniTempleDetailImage,
  summit: sripadayaSkyImage,
  gardens: peradeniyaImage,
  langur: experienceImages.sigiriyaMain,
  sunrise: sripadayaSkyImage,
  cave: naalandaDetailImage,
  paw: experienceImages.sigiriyaMain,
  panorama: experienceImages.sigiriyaMain,
  spiral: naalandaImage,
  reflection: maduRiverImage,
  tea: experienceImages.hillCountry,
  galle: experienceImages.galleFort,
  jaffna: naalandaImage,
} as const

const tags = ['The Ancient North', 'Dawn Rituals', 'UNESCO Heritage'] as const
const closingTags = ['The Ancient North', 'UNESCO Heritage', 'Archaeology', 'Dawn Rituals', 'Solitude'] as const

const notes: Note[] = [
  {
    label: 'Note A · 05:28 AM · Base of Rock',
    title: 'The Geometry of the Ascent',
    body: (
      <>
        <p>
          1,200 steps. Some sources say 1,202. I lost count at 847 when a grey langur sat directly in
          my path on the iron spiral staircase and refused to acknowledge me as a species of
          consequence.
        </p>
        <p>
          The gradient shifts three times. First: shallow, almost ceremonial, through the water
          gardens. Second: moderate, through the boulder gardens, past the cave paintings. Third:
          nearly vertical, where the plains of the Cultural Triangle open below like a held breath.
        </p>
      </>
    ),
    footer: 'Elevation gain: 370m · Total steps: approx. 1,200',
    className: 'article-note--wide',
  },
  {
    label: 'Note B · 06:12 AM · Mirror Wall',
    title: 'The Wall That Speaks',
    body: (
      <>
        <p>
          The Mirror Wall was once polished to such a high lustre that the King could see his
          reflection in it as he walked past. Poets of the 8th century wrote on it - graffiti
          rendered sacred by time.
        </p>
        <blockquote>
          "I see my own face in the lime plaster and understand, dimly, the impulse to write one's
          name on beautiful things."
        </blockquote>
      </>
    ),
    footer: 'Personal notation · do not publish',
    className: 'article-note--narrow',
  },
  {
    label: 'Note C · 06:44 AM',
    title: 'Sunrise: 06:31',
    body: <p>The plains turned copper all at once. Not gradually - the light arrived like a decision.</p>,
    className: 'article-note--small',
  },
]

const photos: Photo[] = [
  {
    src: articleAssets.gardens,
    alt: 'Sigiriya water gardens at dawn',
    caption: 'Water Gardens · 05:18 AM',
    className: 'article-photo-grid__polaroid article-photo-grid__polaroid--one',
  },
  {
    src: articleAssets.sunrise,
    alt: 'Sigiriya rock fortress at sunrise',
    caption: 'Eastern Face · Sunrise 06:31 AM',
    meta: 'the colour of everything',
    className: 'article-photo-grid__landscape',
  },
  {
    src: articleAssets.langur,
    alt: 'Grey langur sitting on ancient Sigiriya stone ruins',
    caption: 'step 847 · grey langur',
    meta: 'He did not move for 4 minutes',
    className: 'article-photo-grid__polaroid article-photo-grid__polaroid--two',
  },
  {
    src: articleAssets.cave,
    alt: 'Ancient Sigiriya cave painting in ochre tones',
    caption: 'Cave Gallery · 5th Century CE',
    className: 'article-photo-grid__framed article-photo-grid__framed--one',
  },
  {
    src: articleAssets.paw,
    alt: 'Massive carved granite lion paw at Sigiriya',
    caption: "Lion's Paw Platform",
    meta: 'carved granite · fifth century',
    className: 'article-photo-grid__framed article-photo-grid__framed--two',
  },
  {
    src: articleAssets.spiral,
    alt: 'Spiral iron staircase ascending Sigiriya rock fortress',
    caption: 'The Iron Staircase',
    meta: '06:22 AM · final approach',
    className: 'article-photo-grid__portrait',
  },
  {
    src: articleAssets.panorama,
    alt: 'Panoramic jungle plains from the top of Sigiriya rock fortress',
    caption: 'Summit Panorama · 07:08 AM · Looking West',
    meta: 'ten thousand acres of patience',
    className: 'article-photo-grid__wide',
  },
]

const archiveEntries: ArchiveEntry[] = [
  {
    entry: 'Entry #031',
    region: 'Hill Country',
    title: 'Monsoon Reflections',
    copy:
      'The rains arrive before the light does. By the time the first train passes through Demodara, the valley below Ella Rock is already brimming with fog.',
    image: articleAssets.tea,
    alt: 'Misty hill country tea plantation during monsoon rain',
    rotate: '-1deg',
  },
  {
    entry: 'Entry #012',
    region: 'The South',
    title: 'A Whisper in Galle',
    copy:
      'The Fort exhales in the afternoon. The sea wind finds its way through Portuguese-built ramparts and deposits itself in the narrow lanes.',
    image: articleAssets.galle,
    alt: 'Narrow cobblestone alley in Galle Fort',
    rotate: '0deg',
  },
  {
    entry: 'Entry #041',
    region: 'The Ancient North',
    title: 'Letters Returned North',
    copy:
      'Jaffna trades in patience. The palmyrah groves grow slowly; the people who return do so carefully.',
    image: articleAssets.jaffna,
    alt: 'Jaffna fort ruins at sunset',
    rotate: '2deg',
  },
]

function Tape() {
  return <span className="article-tape" aria-hidden="true" />
}

function TagList() {
  return (
    <div className="article-tags">
      <span>Filed Under</span>
      {tags.map((tag) => (
        <a href="/journal" key={tag}>
          {tag}
        </a>
      ))}
    </div>
  )
}

function ClosingTagList() {
  return (
    <div className="article-tags article-tags--closing">
      <span>Filed Under</span>
      {closingTags.map((tag) => (
        <a href="/journal" key={tag}>
          {tag}
        </a>
      ))}
    </div>
  )
}

function Polaroid({ src, alt, caption, meta, className = '' }: Photo) {
  return (
    <figure className={`article-polaroid ${className}`}>
      <div>
        <img src={src} alt={alt} />
      </div>
      <figcaption>{caption}</figcaption>
      {meta ? <small>{meta}</small> : null}
    </figure>
  )
}

function FieldNote({ note }: { note: Note }) {
  return (
    <article className={`article-note ${note.className ?? ''}`}>
      <p className="article-kicker">{note.label}</p>
      <h3>{note.title}</h3>
      <div className="article-note__body">{note.body}</div>
      {note.footer ? (
        <footer>
          <span />
          {note.footer}
        </footer>
      ) : null}
    </article>
  )
}

function ArchiveCard({ entry }: { entry: ArchiveEntry }) {
  return (
    <a
      className="article-archive-card"
      href="/journal"
      style={{ '--rotate': entry.rotate } as CSSProperties}
    >
      <img src={entry.image} alt={entry.alt} />
      <div>
        <p>
          <span>{entry.entry}</span>
          {entry.region}
        </p>
        <h3>{entry.title}</h3>
        <p>{entry.copy}</p>
      </div>
    </a>
  )
}

export function JournalArticlePage() {
  return (
    <main className="journal-article-page">
      <nav className="article-breadcrumb" aria-label="Breadcrumb">
        <a href="/journal">Royale Isles Private Journal</a>
        <span>·</span>
        <strong>Entry #055</strong>
      </nav>

      <section className="article-hero" aria-labelledby="article-title">
        <div className="article-container article-hero__inner">
          <header className="article-hero__meta">
            <div>
              <span>Entry No. 055</span>
              <p>Private Cultural Intelligence · Vol. IV</p>
            </div>
            <aside>
              <strong>Lion Rock · Central Province</strong>
              <p>Sigiriya · Private dawn access · 05:14 AM</p>
            </aside>
          </header>

          <div className="article-title-layout">
            <div className="article-title-block">
              <p>For travellers who prefer the first hour</p>
              <h1 id="article-title">
                The Sigiriya
                <br />
                <em>Dawn Ascent</em>
              </h1>
              <div>
                <span />
                <p>
                  Ancient granite, pre-dawn access, and a cultural ascent shaped around privacy,
                  scholarship, and the quiet discipline of arriving before spectacle.
                </p>
              </div>
            </div>

            <aside className="article-weather-card">
              <p>Access Brief</p>
              <strong>24°C</strong>
              <span>Private guide · Heritage scholar</span>
              <span>Pre-public arrival · Summit at first light</span>
              <time>05:14 AM</time>
              <small>14 February 2024 · Gate cleared</small>
            </aside>
          </div>

          <div className="article-hero-photo">
            <figure className="article-tipped-photo">
              <div>
                <img src={articleAssets.hero} alt="Sigiriya rock fortress at dramatic dawn" />
              </div>
              <figcaption>
                <span>
                  Sigiriya · Lion Rock · 370m
                  <small>Eastern Face · 05:22 AM · February 2024</small>
                </span>
                <em>first light on the rock</em>
              </figcaption>
              <Tape />
              <Tape />
            </figure>

            <Polaroid
              src={articleAssets.staircase}
              alt="Steep stone staircase ascending Sigiriya rock fortress"
              caption="The Lion's Paw Staircase"
              meta="05:41 AM · Still Dark Below"
              className="article-hero-photo__side"
            />

            <p className="article-handwritten article-hero-photo__note">370 metres of waiting</p>
            <div className="article-postmark" aria-label="14 February 2024, Sigiriya">
              <strong>14</strong>
              <span>Feb 2024</span>
              <small>Sigiriya</small>
            </div>
          </div>
        </div>
      </section>

      <section className="article-prose-section">
        <div className="article-container article-prose-grid">
          <aside className="article-marginalia">
            <span>Central Province · Sri Lanka</span>
          </aside>

          <article className="article-prose">
            <p className="article-kicker">Observation I · The Approach</p>
            <p className="article-dropcap">
              For four centuries, travellers have found their way to this monolith in the dark. You
              arrive before the ticket office opens. The jungle is still deciding whether it is night
              or morning. The air smells of damp stone and something floral I could not name -
              frangipani, perhaps, or a species that only blooms at this hour, specifically for people
              attempting unreasonable things.
            </p>
            <p>
              The guards wave you through with the mild authority of people who have done this ten
              thousand times. Your boots find the first steps by memory - each one worn into a gentle
              concave by centuries of sandal and heel and bare sole. You count without meaning to.
            </p>
            <blockquote>
              "The rock does not announce itself. It simply arrives in your peripheral vision, so
              large it registers first as weather."
              <cite>Field Entry #055 · Sigiriya · 2024</cite>
            </blockquote>
            <p>
              By step eighty, your thighs are politely informing you of their presence. By step one
              hundred and forty, the jungle canopy has thinned enough that you can see the silhouette
              of Lion Rock against a sky that has shifted from black to a particular shade of midnight
              blue that <em>has no satisfactory English translation</em> - it is the colour of the
              last moment before everything changes.
            </p>
            <TagList />
          </article>

          <aside className="article-artifacts">
            <Polaroid
              src={articleAssets.steps}
              alt="Close-up of ancient stone steps at Sigiriya at dawn"
              caption="step 118 of 1,200"
            />
            <div className="article-side-note">
              <p>Keeper's Note</p>
              <blockquote>
                "The best access here is not speed. It is timing, silence, and knowing when to stop
                explaining."
              </blockquote>
              <span>Amara Weerasinghe · Heritage Curation</span>
            </div>
            <div className="article-sketch-card">
              <span>Sketch: Lion's Paw Platform</span>
              <small>Not yet rendered - pencil, B2</small>
            </div>
          </aside>
        </div>
      </section>

      <section className="article-field-notes">
        <div className="article-container">
          <header className="article-section-header">
            <span>Field Notes</span>
            <i />
            <p>Recorded during ascent · 05:14 - 07:03 AM</p>
          </header>
          <div className="article-note-scatter">
            {notes.map((note) => (
              <FieldNote key={note.label} note={note} />
            ))}
            <Polaroid
              src={articleAssets.frescoes}
              alt="Ancient frescoes of Sigiriya maidens"
              caption="the Sigiriya Damsels"
              meta="5th cent. CE · still vivid"
              className="article-note-photo"
            />
          </div>

          <article className="article-wide-note">
            <div>
              <p className="article-kicker">Note D · 07:03 AM · The Summit Platform · Final Observation</p>
              <h3>On Standing Where a King Stood</h3>
              <p>
                The summit platform is smaller than every photograph suggests, and more complete than
                any description prepares you for. You are standing on the roof of a palace that
                Kashyapa I built in the sky because he believed his father's ghost could not climb
                this high. The throne room walls are gone. The audience hall is jungle. But the view -
                the ten-thousand-acre forest unspooling in every direction, the glint of ancient
                reservoirs, the blue distance of Adam's Peak - this has not changed.
              </p>
            </div>
            <div className="article-sketch-card article-sketch-card--large">
              <span>Elevation Sketch · Summit Platform</span>
              <small>370m · Jan sketchbook p.44</small>
              <small>Pencil + watercolour wash</small>
            </div>
          </article>
        </div>
      </section>

      <section className="article-summit">
        <div className="article-container article-summit__grid">
          <article className="article-prose article-prose--summit">
            <p className="article-kicker">Observation II · The Summit · 07:03 AM</p>
            <h2>
              The King's
              <br />
              <em>unfinished sentence</em>
            </h2>
            <div className="article-two-column-copy">
              <div>
                <p>
                  Kashyapa held court here for eleven years. His throne faced east - towards the rising
                  sun, away from the brother who would eventually reclaim the crown. The archaeologists
                  have reassembled the outline of his throne room in white paint on the rock surface:
                  a ghost floor plan for a ghost life.
                </p>
                <p>
                  I sat where the research suggests his throne might have stood and ate a digestive
                  biscuit from my rucksack. <mark>History is best absorbed at breakfast.</mark>
                </p>
              </div>
              <div>
                <p>
                  From this elevation, Sri Lanka performs a different version of itself. The road
                  below is a pale thread. The tank - the artificial lake Kashyapa built to mirror the
                  rock in still water - is a perfect rectangle of reflected sky.
                </p>
                <blockquote>
                  "He built it in the sky because he believed his father's ghost could not climb this
                  high."
                </blockquote>
              </div>
            </div>
          </article>

          <figure className="article-summit-photo">
            <div>
              <img src={articleAssets.summit} alt="Aerial panoramic view from the top of Sigiriya" />
            </div>
            <figcaption>
              <span>Summit · 370m · 07:03 AM</span>
              <small>Looking east towards Polonnaruwa</small>
            </figcaption>
            <Tape />
          </figure>
        </div>
      </section>

      <section className="article-photo-archive">
        <div className="article-container">
          <header className="article-section-header article-section-header--photos">
            <span>Collected Photographs</span>
            <i />
            <p>8 of 24 selected · 14 February 2024</p>
          </header>
          <div className="article-photo-grid">
            {photos.map((photo) => (
              <Polaroid key={photo.caption} {...photo} />
            ))}
            <article className="article-collector-note">
              <p>Collector's Note</p>
              <blockquote>"All photographs taken on a single roll of 35mm Kodak Portra 400. No digital."</blockquote>
              <span>Film developed: Colombo · March 2024</span>
            </article>
          </div>
        </div>
      </section>

      <section className="article-closing">
        <div className="article-container article-closing__grid">
          <article>
            <p className="article-kicker">Closing Meditation · The Descent · 08:15 AM</p>
            <h2>
              Going Down
              <br />
              <em>is always slower</em>
            </h2>
            <p>
              You descend differently than you ascended. The body understands what the mind only
              suspected: that the going up is ambition, but the coming down is memory. You look back
              at the summit with every seventh step. By the time you reach the water gardens, the rock
              has already become a story you will tell imperfectly for the rest of your life.
            </p>
            <p>
              The ticket office is open now. Tourists in clean clothes are arriving in tuk-tuks with
              water bottles and phone cases. I do not begrudge them their clean shoes. I was them,
              once, before I got here before the light.
            </p>
            <blockquote className="article-final-quote">
              "The King climbed this rock to be closer to God. I climbed it to understand why. The
              answer, I suspect, is the same for both of us: not to get anywhere - only to have stood
              somewhere, briefly, that most people never will."
              <cite>Journal Entry #055 · 14 February 2024 · 08:15 AM · Base of Sigiriya</cite>
            </blockquote>
            <dl className="article-entry-metadata">
              <div>
                <dt>370</dt>
                <dd>Metres Ascended</dd>
              </div>
              <div>
                <dt>~1,200</dt>
                <dd>Steps Climbed</dd>
              </div>
              <div>
                <dt>2h 41m</dt>
                <dd>Duration on Rock</dd>
              </div>
              <div>
                <dt>477</dt>
                <dd>AD · Year Built</dd>
              </div>
            </dl>
          </article>
          <aside className="article-closing-artifacts">
            <Polaroid
              src={articleAssets.reflection}
              alt="Sigiriya rock reflected in an ancient reservoir"
              caption="The Sigiriya Wewa Tank"
              meta="08:24 AM · The rock and its reflection"
            />
            <div className="article-exit-note">
              <p>Exit Note · Written at the Gate</p>
              <blockquote>
                "Bought a small clay lion from a stall. The boy who sold it called the rock
                'Sinhagiri.' Stone of the Lion. He said it correctly and I did not."
              </blockquote>
              <span />
            </div>
            <ClosingTagList />
          </aside>
        </div>
      </section>

      <section className="article-archive">
        <div className="article-container">
          <header className="article-section-header">
            <span>Continue in the Archive</span>
            <i />
            <p>Loose-leaf · unordered by design</p>
          </header>
          <div className="article-archive-grid">
            {archiveEntries.map((entry) => (
              <ArchiveCard key={entry.title} entry={entry} />
            ))}
          </div>
          <a className="article-return-link" href="/journal">
            Return to Archive
          </a>
        </div>
      </section>

      <a className="article-bookmark" href="#article-title" aria-label="Back to article top">
        Navigate
      </a>
      <a className="article-return-tab" href="/journal" aria-label="Return to archive">
        Return to Archive
      </a>
    </main>
  )
}
