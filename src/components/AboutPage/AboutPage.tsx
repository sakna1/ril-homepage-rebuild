import { useEffect, useState } from 'react'
import './AboutPage.css'
import { aboutImages } from './images'
import ahangama from '../../assets/images/Ahangama.jpeg'
import galleBeach from '../../assets/images/Galle beach.jpeg'
import gorakaElla from '../../assets/images/Goraka ella.jpg'
import kithulgala from '../../assets/images/Kithulgala.jpeg'
import sigiriya from '../../assets/images/Sigiriya.JPG'

const localImages = {
  ahangama,
  galleBeach,
  gorakaElla,
  kithulgala,
  sigiriya,
} as const

const stats = [
  { value: 'Private', label: 'Discovery by conversation' },
  { value: 'Vetted', label: 'Access shaped through trust' },
  { value: 'Human', label: 'Journeys held by people' },
] as const

const methodologySteps = [
  {
    title: 'Personal Verification',
    description:
      'Every guide, host, property, and experience is known directly by our team before it is ever proposed to a guest.',
  },
  {
    title: 'Cultural Context',
    description:
      'We prepare travellers for what they are entering, so access is received with intelligence, respect, and emotional readiness.',
  },
  {
    title: 'Quiet Quality Control',
    description:
      'Relationships, routes, timings, and hosts are reviewed continuously. If the standard changes, the recommendation changes.',
  },
] as const

const romanNumerals = ['I', 'II', 'III'] as const

const custodians = [
  {
    name: 'Dr. Suren Raghavan',
    role: 'FOUNDER',
    image: aboutImages.portraitDrRaghavan,
    summary: 'Founder-led discretion for journeys that require judgement before access.',
    bio: 'Dr. Suren Raghavan leads Royale Isles Lanka with a belief that Sri Lanka should be experienced through trust, restraint, and meaningful introductions rather than generic itineraries.',
    focus: 'Founder vision, private access, guest trust, and the long-term relationships that make rare journeys possible.',
    offset: false,
  },
  {
    name: 'Guest Experience Lead',
    role: 'REPRESENTATIVE PROFILE',
    image: aboutImages.portraitAnika,
    summary: 'A discreet guest-care role at the centre of each arrival.',
    bio: 'This role represents the people responsible for arrival, care, and continuity: the calm presence that allows a private journey to feel already held.',
    focus: 'Guest care, journey support, and discreet coordination.',
    offset: true,
  },
  {
    name: 'Private Planning Lead',
    role: 'REPRESENTATIVE PROFILE',
    image: aboutImages.portraitRoshan,
    summary: 'A planning role for journeys that require calm orchestration.',
    bio: 'This role represents the planning specialists who translate preference, privacy, timing, and access into a journey that feels composed rather than assembled.',
    focus: 'Private planning, local coordination, and on-island support.',
    offset: false,
  },
  {
    name: 'Cultural Access Lead',
    role: 'REPRESENTATIVE PROFILE',
    image: aboutImages.portraitMalini,
    summary: 'A cultural role for introductions that require care and context.',
    bio: 'This role represents the cultural specialists and trusted hosts who make access feel respectful, prepared, and alive to the dignity of place.',
    focus: 'Cultural context, trusted introductions, and guest readiness.',
    offset: true,
  },
] as const

const digitalStudio = {
  name: 'Eunoia Solutions Pvt Ltd',
  founders: 'Conella Belleth & Sakna Perera',
  role: 'Founders',
  images: [aboutImages.portraitConella, aboutImages.portraitSakna],
  copy:
    "Eunoia Solutions is an independent digital product studio specialising in research, design, software engineering, and emerging technologies. Every product is shaped through thoughtful strategy, human-centred design, and robust technical implementation to create experiences that feel intuitive, accessible, and effortless.",
  focus:
    'From strategy and design to engineering, AI, security, and deployment, every layer of the experience is considered with equal care.',
} as const

type Custodian = (typeof custodians)[number]

export function AboutPage() {
  const [selectedCustodian, setSelectedCustodian] = useState<Custodian | null>(null)

  useEffect(() => {
    if (!selectedCustodian) {
      return undefined
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedCustodian(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedCustodian])

  return (
    <main className="about-page">
      {/* Hero */}
      <section className="about-section about-hero">
        <div className="about-container about-hero-inner">
          <div className="about-hero-content">
            <p className="about-eyebrow about-eyebrow--gold">ABOUT ROYALE ISLES LANKA</p>
            <h1 className="about-hero-heading">
              The island,
              <br />
              <em>quietly opened</em>
              <br />
              for those who know what access means.
            </h1>
            <p className="about-hero-body">
              Royale Isles Lanka is shaped around travellers who want Sri Lanka opened through
              relationship, discretion, and deep local knowledge. No instant bookings. No generic
              itineraries. Only considered introductions to places, people, and moments that cannot be
              found on a public menu.
            </p>
            <div className="about-stats">
              {stats.map((stat) => (
                <div key={stat.label} className="about-stat">
                  <span className="about-stat-value">{stat.value}</span>
                  <span className="about-stat-label">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
          <figure className="about-hero-image-wrap">
            <img
              className="about-hero-image"
              src={localImages.kithulgala}
              alt="Forest river landscape in Kithulgala, Sri Lanka"
            />
            <figcaption>
              <span>Private Access</span>
              <span>Hill Country — Sri Lanka</span>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Why We Exist */}
      <section className="about-section about-why-exist">
        <div className="about-container about-why-exist-inner">
          <div className="about-why-exist-left">
            <p className="about-eyebrow about-eyebrow--green">WHY WE EXIST</p>
            <h2 className="about-why-exist-heading">
              The rarest journeys are not
              <br />
              found in public.
            </h2>
            <p className="about-why-exist-note">
              We exist for travellers who understand that true access is earned quietly, over time.
            </p>
          </div>
          <div className="about-why-exist-right">
            <p>
              We started Royale Isles Lanka because too much luxury travel had become visible,
              bookable, and strangely impersonal. Sri Lanka was being reduced to landmarks, hotel
              categories, and lists of things to consume.
            </p>
            <p>
              Our work begins elsewhere: in private relationships, cultural fluency, and the patience
              to understand what should be opened, what should remain untouched, and who should be
              entrusted with your time.
            </p>
            <blockquote>
              <p>We are not here to sell a holiday. We are here to create journeys you will remember for the rest of your life.</p>
            </blockquote>
          </div>
        </div>
      </section>

      {/* Proof of Access */}
      <section className="about-section about-dual-images">
        <div className="about-container about-dual-images-inner">
          <div className="about-access-copy">
            <p className="about-eyebrow about-eyebrow--gold">HOW ACCESS IS EARNED</p>
            <h2>
              Not every door should open.
              <br />
              The right ones open slowly.
            </h2>
            <p>
              The experiences we arrange are not inventory. They are invitations extended through
              trust: a custodian willing to receive you before the crowds, an artisan who shares a
              practice without performance, a guide who knows when silence is the greater luxury.
            </p>
            <dl>
              <div>
                <dt>I</dt>
                <dd>Personally known hosts</dd>
              </div>
              <div>
                <dt>II</dt>
                <dd>Context before access</dd>
              </div>
              <div>
                <dt>III</dt>
                <dd>Discretion over display</dd>
              </div>
            </dl>
          </div>

          <div className="about-access-visuals" aria-label="Examples of curated access">
            <figure className="about-dual-image-card about-dual-image-card--primary">
              <img
                className="about-dual-image"
                src={localImages.sigiriya}
                alt="Sigiriya rock fortress surrounded by Sri Lankan landscape"
              />
              <figcaption>
                <span>Before the Gates Open</span>
                <span>Heritage access, by arrangement</span>
              </figcaption>
            </figure>
            <figure className="about-dual-image-card about-dual-image-card--secondary">
              <img
                className="about-dual-image"
                src={aboutImages.craftsman}
                alt="Artisan craftsman working with traditional tools"
              />
              <figcaption>
                <span>Private Studio</span>
                <span>Craft without performance</span>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="about-section about-what-we-do">
        <div className="about-container about-what-we-do-inner">
          <div className="about-what-we-do-intro">
            <p className="about-eyebrow about-eyebrow--gold">WHAT WE DO</p>
            <h2 className="about-what-we-do-heading">
              We design the conditions for travel that feels privately held.
            </h2>
            <p>
              Our role is not to process a booking. It is to understand the traveller, protect the
              integrity of the experience, and shape the right introduction at the right moment.
            </p>
          </div>
          <div className="about-what-we-do-columns">
            <div>
              <span>I</span>
              <h3 className="about-column-title">Private Discovery</h3>
              <p>
                We begin with appetite, pace, privacy, and intent, then select only what deserves a
                place in the journey.
              </p>
            </div>
            <div>
              <span>II</span>
              <h3 className="about-column-title">Curated Introductions</h3>
              <p>
                We connect guests to people and places through relationships, not listings, so every
                encounter carries context and permission.
              </p>
            </div>
            <div>
              <span>III</span>
              <h3 className="about-column-title">Quiet Orchestration</h3>
              <p>
                We handle the invisible work: timing, transitions, access, etiquette, and the small
                decisions that make a journey feel effortless.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How We're Different */}
      <section className="about-section about-different">
        <div className="about-container about-different-inner">
          <div className="about-different-labels">
            <span className="about-section-numeral">III</span>
            <p className="about-eyebrow about-eyebrow--green">HOW WE&apos;RE DIFFERENT</p>
          </div>
          <div className="about-different-content">
            <blockquote className="about-pull-quote">
              &ldquo;Most platforms want you to book fast. We want you to choose wisely.&rdquo;
            </blockquote>
            <p className="about-different-body">
              We are not optimised for clicks, urgency, or conversion. We are built for discernment:
              fewer options, stronger context, and human judgement that understands when the most
              luxurious answer is restraint.
            </p>
            <div className="about-difference-points">
              <p>Human curation over algorithmic ranking</p>
              <p>Context before commitment</p>
              <p>Depth over availability</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stillness image */}
      <section className="about-section about-full-image">
        <div className="about-container">
          <figure className="about-full-image-frame">
            <img
              className="about-full-image-img"
              src={localImages.gorakaElla}
              alt="Rainforest waterfall landscape in Sri Lanka"
            />
            <figcaption>
              <span>Restoration Is Not An Add-On</span>
              <p>
                The best journeys understand when to move, when to pause, and when to let the island
                do nothing more than return you to yourself.
              </p>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Methodology */}
      <section className="about-section about-methodology">
        <div className="about-container about-methodology-inner">
          <div className="about-methodology-left">
            <p className="about-eyebrow about-eyebrow--green">OUR METHODOLOGY</p>
            <h2 className="about-methodology-heading">
              The standard is invisible.
              <br />
              The difference is not.
            </h2>
            <p className="about-methodology-note">
              We curate slowly, because the right journey depends on what we choose not to include.
            </p>
          </div>
          <div className="about-methodology-steps">
            {methodologySteps.map((step, index) => (
              <div key={step.title} className="about-methodology-step">
                <span>{romanNumerals[index]}</span>
                <h3 className="about-step-title">{step.title}</h3>
                <p className="about-step-description">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Custodians */}
      <section className="about-section about-custodians">
        <div className="about-container about-custodians-inner">
          <header className="about-custodians-header">
            <div className="about-custodians-labels">
              <span className="about-section-numeral">IV</span>
              <span className="about-section-sub-label">PRIVATE CIRCLE</span>
            </div>
            <div className="about-custodians-intro">
              <h2 className="about-custodians-heading">
                The People Trusted
                <br />
                With The <em>Details.</em>
              </h2>
              <p className="about-custodians-description">
                VVIP travel depends on more than beautiful places. It depends on people who understand
                privacy, timing, cultural nuance, and the invisible decisions that keep a journey calm.
              </p>
            </div>
          </header>

          <div className="about-custodians-grid">
            {custodians.map((person, index) => (
              <article
                key={`${person.name}-${index}`}
                className={`about-custodian-card${person.offset ? ' about-custodian-card--offset' : ''}`}
              >
                <button
                  className="about-custodian-photo-wrap"
                  type="button"
                  onClick={() => setSelectedCustodian(person)}
                  aria-label={`Read more about ${person.name}`}
                >
                  <img
                    className="about-custodian-photo"
                    src={person.image}
                    alt={person.name}
                  />
                  <span className="about-custodian-photo-cta">View profile</span>
                </button>
                <div className="about-custodian-info">
                  <h3 className="about-custodian-name">{person.name}</h3>
                  <span className="about-custodian-role">{person.role}</span>
                  <p>{person.summary}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-section about-digital-experience">
        <div className="about-container about-digital-experience-inner">
          <div>
            <p className="about-eyebrow about-eyebrow--green">DIGITAL EXPERIENCE</p>
            <h2>Crafted with intention. Built with care.</h2>
          </div>
          <div className="about-digital-credit-grid">
            <article className="about-digital-credit about-digital-credit--studio">
              <div className="about-digital-credit-images" aria-hidden="true">
                {digitalStudio.images.map((image, index) => (
                  <img key={image} src={image} alt="" className={index === 1 ? 'is-secondary' : undefined} />
                ))}
              </div>
              <div>
                <h3>{digitalStudio.name}</h3>
                <span>
                  {digitalStudio.founders} — {digitalStudio.role}
                </span>
                <p>{digitalStudio.copy}</p>
                <small>{digitalStudio.focus}</small>
              </div>
            </article>
          </div>
        </div>
      </section>

      {selectedCustodian ? (
        <div
          className="about-custodian-modal"
          role="presentation"
          onClick={() => setSelectedCustodian(null)}
        >
          <section
            className="about-custodian-modal-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="about-custodian-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="about-custodian-modal-close"
              type="button"
              onClick={() => setSelectedCustodian(null)}
              aria-label="Close profile"
            >
              Close
            </button>
            <div className="about-custodian-modal-media">
              <img src={selectedCustodian.image} alt={selectedCustodian.name} />
            </div>
            <div className="about-custodian-modal-copy">
              <span className="about-custodian-modal-role">{selectedCustodian.role}</span>
              <h2 id="about-custodian-modal-title">{selectedCustodian.name}</h2>
              <p>{selectedCustodian.bio}</p>
              <div>
                <span>Focus</span>
                <p>{selectedCustodian.focus}</p>
              </div>
            </div>
          </section>
        </div>
      ) : null}

      {/* The Breath */}
      <section className="about-section about-breath">
        <div className="about-container about-breath-inner">
          <div className="about-breath-image-wrap">
            <img
              className="about-breath-image"
              src={localImages.ahangama}
              alt="Ocean shoreline at Ahangama in Sri Lanka"
            />
            <div className="about-breath-overlay">
              <p className="about-breath-label">THE BREATH</p>
              <h2 className="about-breath-heading">
                The ocean exhales.
                <br />
                Finally so do you
              </h2>
            </div>
          </div>
        </div>
      </section>

      {/* Expected */}
      <section className="about-section about-expected">
        <div className="about-container about-expected-inner">
          <p className="about-eyebrow about-eyebrow--green about-eyebrow--center">A QUIET RECOGNITION</p>
          <h2 className="about-expected-heading">You already know whether this is for you.</h2>
          <p className="about-expected-body">
            If you have read this far, you are not looking for a faster way to book Sri Lanka. You
            are looking for a more thoughtful way to enter it. That distinction is exactly where our
            work begins.
          </p>
        </div>
      </section>

      {/* Private Invitation */}
      <section className="about-section about-invitation">
        <div className="about-container about-invitation-inner">
          <p className="about-invitation-label">A PRIVATE INVITATION</p>
          <h2 className="about-invitation-heading">
            Begin with a conversation.
            <br />
            <em>Everything else follows.</em>
          </h2>
          <p className="about-invitation-body">
            We accept a limited number of enquiries each season so each journey can be shaped with
            care, discretion, and the right custodians around it.
          </p>
          <a className="about-invitation-button" href="/consultation?from=about">ENTER THE ISLES</a>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="about-section about-footer-cta">
        <img
          className="about-footer-cta-image"
          src={localImages.galleBeach}
          alt="Galle beach at sunset in Sri Lanka"
        />
        <div className="about-footer-cta-overlay">
          <p>Royale Isles Lanka</p>
          <h2 className="about-footer-cta-heading">Sri Lanka, held privately.</h2>
          <p className="about-footer-cta-body">
            For travellers who value silence, access, cultural intelligence, and the rare comfort of
            being understood before anything is arranged.
          </p>
        </div>
      </section>
    </main>
  )
}
