import './OurStoryPage.css'
import royaleIslesLogoImage from '../../assets/images/logo_bg_remove.png'
import { experienceImages } from '../ExperiencesPage/images'

/**
 * Chapters I–III are the company's own account of the emblem, supplied by the
 * client. Chapter IV is still placeholder copy written to the brand's voice —
 * replace it before this goes live.
 */
const chapters = [
  {
    numeral: 'I',
    title: 'The Marine Turtle — Our Emblem',
    copy: [
      'Sri Lanka is the sanctuary for 5 of the 6 most admired marine turtles. The sea turtle is among the most attuned of all creatures to the rhythms of sun and moon. She seeks out only the calmest, most silent shores by night, laying hundreds of eggs in complete stillness. And after journeys spanning thousands of kilometers across open ocean, she returns unfailingly to the shore of her birth — guided not by sight, but by an ancient sense of the earth’s own vibration.',
      'Across civilizations, the turtle has long symbolized the universe itself — bearing the world on her back in Hindu cosmology, and holding comparable meaning in the mythology of ancient Greece.',
    ],
  },
  {
    numeral: 'II',
    title: 'A Single Continuous Line',
    copy: [
      'Our emblem draws on this lineage. A single continuous line forms a turtle opening into a human figure, arms outstretched in welcome — completing itself in five connected forms within an ellipse, representing the Pancha Sheela, the five precepts binding us to the wider order of things.',
      'This is the philosophy on which Royale Isles Lanka is built.',
    ],
  },
  {
    numeral: 'III',
    title: 'A Share Returned to the Shore',
    copy: [
      'For this reason, we share part of our profits with the Rakawa Turtle Conservation Project (TCP) in Sri Lanka. In 2006, the Department of Wildlife Conservation — together with TCP, the Coast Conservation Department, and the International Union for Conservation of Nature — declared Rakawa Beach a protected wildlife sanctuary.',
      'When you travel with Royale Isles, you become part of this quiet stewardship. A portion of every journey you take with us returns to the shores that make it possible — supporting the same fragile rhythms of sun, moon, and tide that have guided these creatures home for millions of years.',
      'Your holiday, then, is more than a journey through Sri Lanka. It is a small, deliberate act of care for one of the world’s most sensitive ecosystems — and an invitation to leave the island a little better than you found it.',
    ],
    partner: {
      label: 'Turtle Watch Rekawa',
      note: 'The project we work with, in their own words',
      href: 'https://www.turtlewatchrekawa.org/',
    },
  },
  {
    numeral: 'IV',
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
                {'partner' in chapter && chapter.partner ? (
                  <a
                    className="story-partner"
                    href={chapter.partner.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span className="story-partner__note">{chapter.partner.note}</span>
                    <span className="story-partner__label">
                      {chapter.partner.label}
                      <span aria-hidden="true">↗</span>
                    </span>
                  </a>
                ) : null}
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
