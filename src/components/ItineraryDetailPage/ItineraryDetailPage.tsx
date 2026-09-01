import { useEffect, useState } from 'react'
import './ItineraryDetailPage.css'
import { ArrowIcon } from '../ArrowIcon'
import { JourneyInquiryForm } from './JourneyInquiryForm'
import {
  isDivider,
  narrativeForSlug,
  type ItineraryDivider,
  type ItineraryStay,
} from './itineraryNarratives'

/**
 * Carried by every journey, so it is written once here rather than repeated in
 * each narrative. Anything true of all three itineraries belongs in this list.
 */
const alwaysIncluded = [
  {
    title: 'Luxury SUV transport',
    copy: 'A private, air-conditioned luxury SUV for the length of the journey — yours alone, never shared.',
  },
  {
    title: 'A dedicated national licensed guide',
    copy: 'One nationally licensed tour guide with you from arrival to departure, rather than a different voice in every town.',
  },
  {
    title: 'USD 100,000 health insurance',
    copy: 'Health insurance cover of USD 100,000 per traveller, held for the full length of the journey.',
  },
] as const

function StayEntry({ stay }: { stay: ItineraryStay }) {
  return (
    <article className="itin-day">
      <div className="itin-day__marker" aria-hidden="true">
        <span className="itin-day__number">{stay.number}</span>
        <span className="itin-day__rule" />
      </div>

      <div className="itin-day__body">
        {/* The place leads — it is what a reader scans for — with the day or
            night range above it and the passage's own title beneath. */}
        <p className="itin-day__label">{stay.label}</p>
        <h2 className="itin-day__placename">{stay.place}</h2>
        <p className="itin-day__title">{stay.title}</p>
        {stay.copy.map((paragraph) => (
          <p key={paragraph.slice(0, 40)}>{paragraph}</p>
        ))}
        {stay.note ? <p className="itin-day__note">{stay.note}</p> : null}
      </div>

      {stay.image ? (
        <figure className="itin-day__figure">
          <img src={stay.image} alt={stay.imageAlt ?? ''} loading="lazy" />
        </figure>
      ) : null}
    </article>
  )
}

/** Where a route splits, or an option begins. */
function DividerEntry({ divider }: { divider: ItineraryDivider }) {
  return (
    <div className="itin-fork">
      {divider.label ? <p className="itin-fork__label">{divider.label}</p> : null}
      <h2>{divider.title}</h2>
      {divider.copy?.map((paragraph) => (
        <p key={paragraph.slice(0, 40)}>{paragraph}</p>
      ))}
    </div>
  )
}

/** "deep-dive" -> "Deep Dive", for journeys with no narrative written yet. */
function nameFromSlug(slug: string): string {
  return slug
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

/**
 * One journey, read stay by stay. The narrative comes from
 * `itineraryNarratives`; a journey without one yet still gets a page, so a
 * card on the Itineraries index never leads anywhere empty.
 */
export function ItineraryDetailPage({ slug }: { slug: string }) {
  const narrative = narrativeForSlug(slug)
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false)

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [slug])

  if (!narrative) {
    return (
      <main className="itin-detail">
        <section className="itin-detail__missing">
          <p className="itin-detail__eyebrow">Still Being Written</p>
          <h1>This journey is being set down.</h1>
          <p>
            The day-by-day reading for this one is with our writers. Tell us when you are thinking
            of travelling and we will send it to you directly.
          </p>
          <div className="itin-detail__actions">
            <button
              type="button"
              className="itin-detail__cta"
              onClick={() => setIsEnquiryOpen(true)}
            >
              Ask For This Journey
              <ArrowIcon />
            </button>
            <a className="itin-detail__cta itin-detail__cta--ghost" href="/itineraries">
              Back to the Journeys
            </a>
          </div>
        </section>

        {isEnquiryOpen ? (
          <JourneyInquiryForm
            journey={nameFromSlug(slug)}
            onClose={() => setIsEnquiryOpen(false)}
          />
        ) : null}
      </main>
    )
  }

  return (
    <main className="itin-detail">
      <section className="itin-detail__hero">
        <img
          className="itin-detail__hero-image"
          src={narrative.heroImage}
          alt={narrative.heroImageAlt}
        />
        <span className="itin-detail__hero-scrim" aria-hidden="true" />

        <div className="itin-detail__hero-copy">
          <p className="itin-detail__eyebrow">{narrative.eyebrow}</p>
          <h1>{narrative.name}</h1>
          <p className="itin-detail__duration">
            {narrative.nights} · {narrative.duration}
          </p>
          <p className="itin-detail__lede">{narrative.lede}</p>
        </div>
      </section>

      <section className="itin-detail__days" aria-label={`${narrative.name}, stay by stay`}>
        {narrative.entries.map((entry, index) =>
          isDivider(entry) ? (
            <DividerEntry key={`fork-${entry.title}-${index}`} divider={entry} />
          ) : (
            <StayEntry key={`${entry.label}-${entry.place}`} stay={entry} />
          ),
        )}
      </section>

      <section className="itin-included" aria-labelledby="itin-included-head">
        <div className="itin-included__inner">
          <p className="itin-detail__eyebrow">Carried Throughout</p>
          <h2 id="itin-included-head">Included on every day of this journey.</h2>

          <ul className="itin-included__list">
            {alwaysIncluded.map((item) => (
              <li key={item.title} className="itin-included__item">
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="itin-detail__closing">
        <div className="itin-detail__closing-inner">
          {narrative.closing ? (
            <>
              <p className="itin-detail__eyebrow">{narrative.closing.title}</p>
              {narrative.closing.copy.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </>
          ) : (
            <p className="itin-detail__eyebrow">Where you linger is up to you</p>
          )}

          <p className="itin-detail__invite">
            If this is the journey you want, send us an enquiry — tell us your dates and who is
            travelling, and we will shape it around you.
          </p>

          <div className="itin-detail__actions">
            <button
              type="button"
              className="itin-detail__cta"
              onClick={() => setIsEnquiryOpen(true)}
            >
              Enquire About This Journey
              <ArrowIcon />
            </button>
            <a className="itin-detail__cta itin-detail__cta--ghost" href="/itineraries">
              See the Other Journeys
            </a>
          </div>
        </div>
      </section>

      {isEnquiryOpen ? (
        <JourneyInquiryForm
          journey={narrative.name}
          detail={`${narrative.nights} · ${narrative.duration}`}
          onClose={() => setIsEnquiryOpen(false)}
        />
      ) : null}
    </main>
  )
}
