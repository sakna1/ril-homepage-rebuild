import './OurStoryPage.css'
import royaleIslesLogoImage from '../../assets/images/logo_bg_remove.png'
import { experienceImages } from '../ExperiencesPage/images'

/**
 * PLACEHOLDER COPY — the narrative below is written to the brand's voice but
 * is not the company's own account. Replace each chapter with the real story
 * before this goes live.
 */
const chapters = [
  {
    numeral: 'I',
    title: 'A Line That Never Lifts',
    copy: [
      'Our mark is a turtle drawn without the pen ever leaving the page — one continuous line, green and gold, closing on itself.',
      'It is how we think about a journey. Not a list of stops to be ticked off, but a single unbroken movement: arrival, discovery, rest, return. Every part of it drawn in one go, by one hand.',
    ],
  },
  {
    numeral: 'II',
    title: 'Why The Turtle',
    copy: [
      'Sri Lanka’s southern shore is one of the few places on earth where five species of sea turtle come ashore to nest. They navigate thousands of miles of open ocean and return, without fail, to the beach they were born on.',
      'We take that as our standard: a long way travelled, quietly, and an arrival that feels like coming back to somewhere you already belong.',
    ],
  },
  {
    numeral: 'III',
    title: 'Held Privately',
    copy: [
      'We do not publish a catalogue. Each journey begins as a conversation about who is travelling, what must be protected, and what would make the island feel personally meaningful.',
      'What follows is arranged through relationships built over years — hosts, naturalists, custodians and drivers who know when to speak and when to leave a moment alone.',
    ],
  },
] as const

export function OurStoryPage() {
  return (
    <main className="story-page">
      <section className="story-hero">
        <div className="story-container">
          <img className="story-mark" src={royaleIslesLogoImage} alt="" aria-hidden="true" />
          <p className="story-eyebrow">Our Story</p>
          <h1>
            One line,
            <em>drawn without lifting.</em>
          </h1>
          <p className="story-lede">
            Royale Isles Lanka exists for travellers who would rather understand Sri Lanka than
            simply see it. This is where that began.
          </p>
        </div>
      </section>

      <section className="story-chapters">
        <div className="story-container">
          {chapters.map((chapter) => (
            <article className="story-chapter" key={chapter.numeral}>
              <span className="story-chapter__numeral" aria-hidden="true">
                {chapter.numeral}
              </span>
              <div className="story-chapter__body">
                <h2>{chapter.title}</h2>
                {chapter.copy.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="story-image">
        <div className="story-container">
          <figure>
            <img
              src={experienceImages.sigiriyaSunrise}
              alt="Sunrise over the Cultural Triangle, Sri Lanka"
              loading="lazy"
            />
            <figcaption>
              <span>The Island, Early</span>
              <p>
                The best hours in Sri Lanka belong to people who arranged to be there before anyone
                else. That is most of what we do.
              </p>
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="story-close">
        <div className="story-container">
          <p className="story-eyebrow">A Private Invitation</p>
          <h2>Begin with a conversation.</h2>
          <p>
            Tell us who is travelling and what would make this journey matter. We will respond with
            considered next steps, not a brochure.
          </p>
          <div className="story-actions">
            <a className="story-cta" href="/expectations">
              Explore Sri Lanka Privately
            </a>
            <a className="story-cta story-cta--ghost" href="/contact">
              Speak With Us
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
