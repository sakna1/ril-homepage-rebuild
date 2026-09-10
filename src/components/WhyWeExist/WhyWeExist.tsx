import portraitDrRaghavan from '../../assets/about/portrait-drRaghavan.jpeg'
import './WhyWeExist.css'

const processSteps = [
  {
    index: '01',
    numeral: 'I',
    title: 'LISTEN',
    description:
      'Before destinations, before any recommendation at all, we ask what you’re seeking, not with a form, but a conversation. How you like to spend a morning. What kind of silence you’re looking for. What you’ve outgrown in travel, and what you haven’t yet found.',
  },
  {
    index: '02',
    numeral: 'II',
    title: 'CURATE',
    description:
      'From there, we draw on relationships built over years, with estate owners, retired planters, monks, chefs, and guides who have spent decades in one place. Not a catalogue to browse, but a small number of possibilities that were never going to be wrong for you.',
  },
  {
    index: '03',
    numeral: 'III',
    title: 'REFINE',
    description:
      'Together, we shape these into a journey with its own rhythm, where to linger, where to move on, where to leave room for nothing at all. Every detail considered. Nothing over-designed.',
  },
] as const

export function WhyWeExist() {
  return (
    <section className="why-we-exist">
      <header className="philosophy-header">
        <div className="philosophy-header-left">
          <span className="philosophy-eyebrow">The Philosophy</span>
          <h2 className="philosophy-headline">Why We Exist</h2>
        </div>
        <p className="philosophy-tagline">
          The most meaningful journeys rarely begin with a destination.
          <br />
          They begin with a conversation.
        </p>
      </header>

      <div className="process-list">
        <span className="process-watermark" aria-hidden="true">
          R
        </span>

        {processSteps.map((step) => (
          <article key={step.index} className="process-item">
            <span className="process-index">{step.index}</span>
            <div className="process-marker">
              <span className="process-numeral">{step.numeral}</span>
              <span className="process-line"></span>
            </div>
            <div className="process-content">
              <h3 className="process-title">{step.title}</h3>
              <p className="process-description">{step.description}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="discovery-block">
        <h3 className="discovery-heading">And then, you discover.</h3>
        <p className="discovery-body">
          What you experience in Sri Lanka won&apos;t feel like an itinerary that was executed. It
          will feel like a sequence of moments that, looking back, seem like they were always going
          to happen, because, in a way, they were.
        </p>
      </div>

      <footer className="founder-testimonial">
        <div className="founder-info">
          <img
            className="founder-avatar"
            src={portraitDrRaghavan}
            alt="Dr Raghavan"
          />
          <div className="founder-details">
            <span className="founder-name">Dr Raghavan</span>
            <span className="founder-role">Founder - Royale Isles Lanka</span>
          </div>
        </div>
        <blockquote className="founder-quote">
          &ldquo;The island is small enough to feel intimate, yet vast enough that after twenty
          years, it still surprises me.&rdquo;
        </blockquote>
      </footer>
    </section>
  )
}
