import './ExperienceDetailPage.css'
import { contactMailtoHref } from '../../contact/contactEmail'
import { experienceImages } from '../ExperiencesPage/images'

const themes = ['Ancient History', 'Dawn Ritual', 'Physical Ascent', 'Living Archive'] as const

const movements = [
  {
    numeral: 'I',
    label: 'Before Dawn',
    title: 'The preparation.',
    copy:
      'You wake at 4:30. A small breakfast is arranged on your terrace - something light, something grounding. Your guide calls at 4:50. The drive through sleeping villages takes twenty minutes. The road is yours alone.',
  },
  {
    numeral: 'II',
    label: 'The Climb',
    title: 'The surrender.',
    copy:
      'There is no shortcut. The 1,200 steps were cut from the rock itself. Halfway, the celebrated frescoes appear in the cliff face - 21 of the original 500 celestial women, still luminous after fifteen centuries of monsoons.',
  },
  {
    numeral: 'III',
    label: 'The Summit',
    title: 'The arrival.',
    copy:
      'At 360 metres, the entire Cultural Triangle spreads beneath you. The ancient tank to the south. Pidurangala to the north. The sun appears slowly at first, then all at once. Your guide says nothing.',
  },
] as const

const metadata = [
  { label: 'Duration', value: '1 Day', note: 'Dawn to mid-morning' },
  { label: 'Location', value: 'Sigiriya', note: 'North Central Province' },
  { label: 'Elevation', value: '349 m', note: 'Above sea level' },
  { label: 'Season', value: 'Year-Round', note: 'Optimal: Jan-Apr' },
  { label: 'Access', value: 'Private Only', note: 'Pre-opening arrangement' },
] as const

const visualRecord = [
  { label: 'The approach', image: experienceImages.sigiriyaDawn, alt: 'Sigiriya rock at dawn' },
  { label: 'The ascent', image: experienceImages.heroSigiriya, alt: 'Dawn ascent near Sigiriya' },
  { label: 'The summit', image: experienceImages.leopardFeature, alt: 'Golden summit light over Sri Lanka' },
  { label: 'The view', image: experienceImages.blueWhaleAerial, alt: 'Dawn mist over Sri Lankan plains' },
] as const

const relatedEncounters = [
  {
    province: 'Uva Province - Sri Lanka',
    title: 'The Ella Dawn Walk',
    copy: 'A solitary walk through tea country as morning light breaks over the Nine Arch Bridge.',
    image: experienceImages.hillCountry,
    alt: 'Rolling Sri Lankan tea plantation terraces at dawn',
  },
  {
    province: 'Sabaragamuwa Province - Sri Lanka',
    title: "Adam's Peak Pilgrimage",
    copy: 'A centuries-old pilgrimage route, completed under a moon that seems made for the occasion.',
    image: experienceImages.perahera,
    alt: "Adam's Peak pilgrimage at sunrise",
  },
  {
    province: 'Southern Province - Sri Lanka',
    title: 'Sinharaja at First Light',
    copy: 'Inside the last remaining lowland rainforest, where silence is the most powerful thing.',
    image: experienceImages.ayurveda,
    alt: 'Rainforest pavilion at first light',
  },
] as const

export function ExperienceDetailPage() {
  return (
    <main className="experience-detail-page">
      <section className="detail-hero">
        <img
          className="detail-hero-image"
          src={experienceImages.heroSigiriya}
          alt="Aerial view of Sigiriya rock formation rising from jungle at dawn"
        />
        <div className="detail-hero-overlay" />
        <header className="detail-hero-top">
          <p>
            <span />
            A curated encounter
          </p>
          <p>Central Province - Sri Lanka</p>
        </header>
        <p className="detail-hero-number">No. 07</p>
        <div className="detail-hero-bottom">
          <div>
            <h1>The Sigiriya Dawn Ascent</h1>
            <p>
              <span />
              An Encounter With Ancient Sri Lanka
            </p>
          </div>
          <a className="detail-scroll-cue" href="#story" aria-label="Read the experience story">
            <span />
            Read
          </a>
        </div>
      </section>

      <section className="detail-intro" id="story">
        <div className="detail-container detail-intro-grid">
          <aside className="detail-intro-aside">
            <p className="detail-eyebrow">An Encounter With</p>
            <span className="detail-rule" />
            <ul>
              {themes.map((theme) => (
                <li key={theme}>{theme}</li>
              ))}
            </ul>
            <div className="detail-discovered">
              <span>Discovered</span>
              <strong>April, 2024</strong>
            </div>
          </aside>

          <div className="detail-intro-copy">
            <p className="detail-lede">
              There are mornings in Sri Lanka when the world has not yet decided to be itself. When
              mist still hangs at the treeline and the ancient rock of Sigiriya rises through cloud,
              it demands something of you - a quality of attention you may have forgotten you
              possessed.
            </p>
            <p>
              The fortress was built in the fifth century by King Kashyapa, who chose altitude as
              architecture - who believed that to rule from height was to rule adjacent to heaven.
              He carved water gardens into the surrounding plain, commissioned celestial women
              painted onto sheer rock walls, and placed a lion's paw throne at the summit, facing
              the rising sun.
            </p>
            <p>
              To ascend at dawn - before the tour groups arrive, before the heat makes everything
              effortful - is not a tourist activity. It is a recalibration. The encounter asks you
              to slow down, to look at things that have outlasted fifteen centuries of looking.
              This is precisely why we selected it.
            </p>
          </div>
        </div>
      </section>

      <section className="detail-summit-quote">
        <img
          src={experienceImages.sigiriyaDawn}
          alt="Panoramic sunrise view from the top of Sigiriya rock fortress"
        />
        <div className="detail-summit-gradient" />
        <div className="detail-summit-caption">
          <h2>
            The view that belonged
            <br />
            to a king.
          </h2>
          <p>The Summit - 4:47am Ascent</p>
        </div>
        <blockquote>
          <span aria-hidden="true">"</span>
          <p>
            To stand at the summit at first light is to understand, briefly, why kings believed
            themselves gods.
          </p>
          <cite>Alexandra Fernandes - Lead Encounter Curator</cite>
        </blockquote>
      </section>

      <section className="detail-movements">
        <div className="detail-container">
          <p className="detail-eyebrow">Three Movements</p>
          <div className="detail-movement-grid">
            {movements.map((movement) => (
              <article key={movement.numeral} className="detail-movement">
                <span>{movement.numeral}</span>
                <p>{movement.label}</p>
                <h2>{movement.title}</h2>
                <p>{movement.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="detail-feature">
        <div className="detail-container detail-feature-grid">
          <figure className="detail-feature-image">
            <img
              src={experienceImages.heroSigiriya}
              alt="Sigiriya rock fortress rising through morning clouds"
            />
            <figcaption>Sigiriya - 5th Century - UNESCO World Heritage Site</figcaption>
          </figure>

          <article className="detail-feature-copy">
            <p className="detail-eyebrow">Ancient Kingdom | Pre-Dawn Ascent | Cultural Triangle</p>
            <h2>One thousand two hundred steps, climbed in the dark before dawn.</h2>
            <p>
              The ascent begins at 5:15am, when the site opens exclusively to our guests. A private
              guide - one of three we have worked with for over a decade - meets you at the eastern
              gate with a small torch. You will not need it. Your eyes will find their way.
            </p>
            <p>
              Halfway up, at the famous Mirror Wall, you stop. The 6th-century inscriptions catch
              the early light - the oldest known Sinhalese poetry, scratched by people who climbed
              as you are climbing, who felt the same need to say: I was here, I felt this.
            </p>
            <p>At the summit, your guide will step back. This moment is yours.</p>
          </article>

          <dl className="detail-metadata">
            {metadata.map((item) => (
              <div key={item.label}>
                <dt>{item.label}</dt>
                <dd>{item.value}</dd>
                <dd>{item.note}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="detail-triptych">
        <div className="detail-container detail-triptych-grid">
          <img
            className="detail-triptych-large"
            src={experienceImages.sigiriyaDawn}
            alt="Sigiriya fortress illuminated by golden light"
          />
          <div>
            <img src={experienceImages.blueWhaleAerial} alt="Aerial view of dense jungle canopy" />
            <img src={experienceImages.hillCountry} alt="Nuwara Eliya hill country landscape at dawn" />
          </div>
        </div>
      </section>

      <section className="detail-reflection">
        <div className="detail-reflection-inner">
          <p className="detail-eyebrow">A Curator's Reflection</p>
          <span className="detail-rule" />
          <blockquote>
            "I have climbed Sigiriya eleven times. I have watched it change people - not
            dramatically, not with grand epiphanies, but quietly. They descend somehow lighter."
          </blockquote>
          <p>
            This is why the encounter is never arranged to feel accomplished. We arrange it to be
            felt. The route, the timing, the guide who knows when to speak and when to disappear
            entirely - these details took three years to calibrate. What you receive is the result
            of that patience.
          </p>
          <span className="detail-rule" />
          <cite>
            Alexandra Fernandes
            <small>Lead Encounter Curator, Royale Isles Lanka</small>
          </cite>
        </div>
      </section>

      <section className="detail-visual-record">
        <div className="detail-container">
          <p className="detail-eyebrow">A Visual Record</p>
          <div className="detail-record-grid">
            {visualRecord.map((item) => (
              <figure key={item.label}>
                <img src={item.image} alt={item.alt} />
                <figcaption>{item.label}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="detail-related">
        <div className="detail-container">
          <header>
            <div>
              <p className="detail-eyebrow">Continue Your Journey</p>
              <h2>Related Encounters</h2>
            </div>
            <a href="/expectations">View Expectations <span /></a>
          </header>
          <div className="detail-related-grid">
            {relatedEncounters.map((encounter) => (
              <article key={encounter.title}>
                <img src={encounter.image} alt={encounter.alt} />
                <p>{encounter.province}</p>
                <h3>{encounter.title}</h3>
                <p>{encounter.copy}</p>
                <a href="/expectations">Explore <span /></a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="detail-final-cta" id="enquire">
        <div className="detail-final-cta-inner">
          <div className="detail-final-cta-mark" aria-hidden="true">
            ✦
          </div>
          <p>Private Encounter Briefing</p>
          <h2>
            Begin with the access
            <br />
            <em>this ascent requires.</em>
          </h2>
          <p>
            A Royale Isles Lanka curator will review timing, privacy, physical readiness, guide
            availability, and the quiet conditions required for Sigiriya to feel properly held.
            Nothing is confirmed until the access is worthy of the moment.
          </p>
          <a href={contactMailtoHref}>Speak With a Curator</a>
          <small>Private response within 48 hours. Access is reviewed before confirmation.</small>
        </div>
      </section>
    </main>
  )
}
