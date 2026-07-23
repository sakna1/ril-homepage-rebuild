import './ContactPage.css'
import { CONTACT_EMAIL, contactMailtoHref } from '../../contact/contactEmail'
import { ArrowIcon } from '../ArrowIcon'
import { experienceImages } from '../ExperiencesPage/images'
import { ContactInquiryPanel } from './ContactInquiryPanel'
import { ContactLocationMap } from './ContactLocationMap'

const images = {
  hero: experienceImages.poolVilla,
} as const

const pathways = [
  {
    number: '01',
    label: 'By private consultation',
    title: 'Request a Bespoke Journey',
    action: 'Begin here',
    href: '/consultation',
  },
  {
    number: '02',
    label: 'Discover the island',
    title: 'Explore Sri Lanka',
    action: 'Discover more',
    href: '/expectations',
  },
  {
    number: '03',
    label: 'A personal note',
    title: 'Send a Message',
    action: 'Write to us',
    href: '#quick-inquiry',
  },
] as const

const contactDetails = [
  { label: 'Private Office', value: 'Colombo · By appointment' },
  { label: 'Concierge Line', value: 'Available upon enquiry' },
  { label: 'Correspondence', value: CONTACT_EMAIL, href: contactMailtoHref },
  { label: 'Consultations', value: 'In person, by video, or in writing' },
] as const

export function ContactPage() {
  return (
    <main className="contact-page" data-node-id="132:2">
      <section className="contact-hero" data-node-id="132:5" aria-labelledby="contact-hero-heading">
        <div className="contact-hero-copy">
          <div className="contact-kicker">
            <span className="contact-gold-rule contact-gold-rule--short" aria-hidden="true" />
            <p>Contact</p>
          </div>

          <div className="contact-hero-body">
            <p className="contact-eyebrow">Private Enquiries</p>
            <h1 id="contact-hero-heading">
              Begin a
              <span>Conversation</span>
            </h1>
            <span className="contact-gold-rule" aria-hidden="true" />
            <p className="contact-lead">
              For principals, private families, and those who travel rarely — and only well. Share what is drawing you
              towards Sri Lanka, and we will respond with considered next steps, not a catalogue.
            </p>
            <a className="contact-text-link" href="#quick-inquiry">
              Enquire About a Journey
              <ArrowIcon />
            </a>
          </div>

          <p className="contact-hero-footnote">Sri Lanka · Private Consultations · By Arrangement</p>
        </div>

        <figure className="contact-hero-media">
          <img src={images.hero} alt="Private villa pool overlooking misty Sri Lankan highlands at dawn" />
          <div className="contact-hero-media-overlay" aria-hidden="true" />
          <span className="contact-frame-mark contact-frame-mark--top-left" aria-hidden="true" />
          <span className="contact-frame-mark contact-frame-mark--bottom-right" aria-hidden="true" />
          <figcaption>Private Residences · Sri Lanka</figcaption>
        </figure>
      </section>

      <section className="contact-pathways" id="pathways" data-node-id="132:34" aria-labelledby="contact-pathways-heading">
        <div className="contact-container">
          <header className="contact-pathways-header">
            <div>
              <p className="contact-eyebrow">Pathways</p>
              <h2 id="contact-pathways-heading">
                How would you like
                <span> to begin?</span>
              </h2>
            </div>
            <p className="contact-pathways-intro">
              Three quiet entry points into a journey shaped around privacy, pace, and personal meaning.
            </p>
          </header>

          <div className="contact-pathways-grid">
            {pathways.map((pathway) => (
              <a className="contact-pathway-card" href={pathway.href} key={pathway.number}>
                <span className="contact-pathway-number" aria-hidden="true">
                  {pathway.number}
                </span>
                <p className="contact-pathway-label">{pathway.label}</p>
                <h3>{pathway.title}</h3>
                <span className="contact-pathway-action">
                  {pathway.action}
                  <ArrowIcon />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section
        className="contact-form-section"
        id="quick-inquiry"
        data-node-id="132:92"
        aria-labelledby="contact-form-heading"
      >
        <div className="contact-container contact-form-layout">
          <div className="contact-form-intro">
            <p className="contact-eyebrow">Quick Inquiry</p>
            <h2 id="contact-form-heading">
              A few words
              <span> to begin</span>
            </h2>
            <span className="contact-gold-rule contact-gold-rule--medium" aria-hidden="true" />
            <p>
              A compact note for when you already know you would like to reach us — held with the same discretion we
              bring to every journey.
            </p>
          </div>
          <ContactInquiryPanel />
        </div>
      </section>

      <section className="contact-details" id="find-us" data-node-id="132:153" aria-labelledby="contact-details-heading">
        <div className="contact-container">
          <p className="contact-eyebrow">Details</p>
          <h2 id="contact-details-heading">Find us</h2>
          <ContactLocationMap />
          <dl className="contact-details-grid">
            {contactDetails.map((detail) => (
              <div key={detail.label}>
                <dt>{detail.label}</dt>
                <dd>
                  {'href' in detail ? (
                    <a className="contact-details-email" href={detail.href}>
                      {detail.value}
                    </a>
                  ) : (
                    detail.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </main>
  )
}
