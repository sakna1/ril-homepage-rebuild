import './ContactPage.css'
import { CONTACT_EMAIL, contactMailtoHref } from '../../contact/contactEmail'
import { experienceImages } from '../ExperiencesPage/images'
import { offices } from '../../data/offices'
import { ContactLocationMap } from './ContactLocationMap'

/*
 * This page is for reaching us and nothing else. The quick-inquiry form that
 * used to sit here was removed — enquiries are raised from the Experiences and
 * Itineraries pages, where the traveller already has a journey in mind. The
 * form components remain on disk (ContactInquiryPanel / QuickInquiryForm) if it
 * ever needs to come back.
 */

const channels = [
  {
    label: 'Correspondence',
    value: CONTACT_EMAIL,
    href: contactMailtoHref,
    note: 'The surest way to reach us. We reply within one working day.',
  },
  {
    label: 'Private Office',
    value: 'Colombo, Sri Lanka',
    note: 'Visits by appointment. Our island team is here year round.',
  },
  {
    label: 'Consultations',
    value: 'In person, by video, or in writing',
    note: 'Whichever suits you — we will work to your hours, not ours.',
  },
] as const

/** "The UK, Canada and Bahrain" — built from the shared list, never hardcoded. */
const countryList = offices
  .map((office) => office.country)
  .reduce((sentence, country, index, all) =>
    index === all.length - 1 ? `${sentence} and ${country}` : `${sentence}, ${country}`,
  )

export function ContactPage() {
  return (
    <main className="contact-page" data-node-id="132:2">
      <section className="contact-hero" data-node-id="132:5" aria-labelledby="contact-hero-heading">
        <div className="contact-container contact-hero-copy">
          <div className="contact-kicker">
            <span className="contact-gold-rule contact-gold-rule--short" aria-hidden="true" />
            <p>Contact</p>
          </div>

          <div className="contact-hero-body">
            <div className="contact-hero-text">
              <span className="contact-hero-badge">Get In Touch</span>
              <h1 id="contact-hero-heading">
                Begin a <span>Conversation</span>
              </h1>
              <p className="contact-lead">
                Write, call, or visit. Whichever you choose, the same small team answers — and the
                reply comes from a person who knows the island, not a queue.
              </p>
              <div className="contact-hero-buttons">
                <a className="contact-hero-btn" href={contactMailtoHref}>
                  Write To Us
                </a>
                <a className="contact-hero-btn contact-hero-btn--ghost" href="#find-us">
                  Find Our Offices
                </a>
              </div>
            </div>

            {/* A small collage rather than one large image — it fills the band
                without pulling the eye off the heading. Loaded eagerly: it is
                above the fold, so deferring it only delays the largest paint. */}
            <div className="contact-hero-collage" aria-hidden="true">
              <img className="contact-hero-collage__a" src={experienceImages.poolVilla} alt="" />
              <img className="contact-hero-collage__b" src={experienceImages.teaEstate} alt="" />
              <img className="contact-hero-collage__c" src={experienceImages.sigiriyaSunrise} alt="" />
            </div>
          </div>
        </div>
      </section>

      <section className="contact-channels" aria-labelledby="contact-channels-heading">
        <div className="contact-container">
          <p className="contact-eyebrow">How To Reach Us</p>
          <h2 id="contact-channels-heading">Three ways, one team.</h2>

          <div className="contact-channel-grid">
            {channels.map((channel) => (
              <article className="contact-channel-card" key={channel.label}>
                <p className="contact-channel-label">{channel.label}</p>
                {'href' in channel ? (
                  <a className="contact-channel-value" href={channel.href}>
                    {channel.value}
                  </a>
                ) : (
                  <p className="contact-channel-value">{channel.value}</p>
                )}
                <p className="contact-channel-note">{channel.note}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="contact-offices" id="find-us" data-node-id="132:153" aria-labelledby="contact-offices-heading">
        <div className="contact-container">
          <p className="contact-eyebrow">Our Offices</p>
          <h2 id="contact-offices-heading">Find us</h2>

          <ContactLocationMap />

          {/* The full international network lives on About — this only points
              at it, with the country names read from the shared list so the
              sentence cannot drift from the real offices. */}
          <p className="contact-network-note">
            We also keep offices in {countryList}.{' '}
            <a href="/about#office-network">See the full office network</a>
          </p>
        </div>
      </section>
    </main>
  )
}
