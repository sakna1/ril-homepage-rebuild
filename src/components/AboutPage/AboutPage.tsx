import { useEffect, useState } from 'react'
import './AboutPage.css'
import { aboutImages } from './images'
import { experienceImages } from '../ExperiencesPage/images'
import breathSeaImage from '../../assets/images/breath-sea.jpg'
import { offices } from '../../data/offices'

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

/** The international office network — shared with the Contact page. */
const branches = offices

/**
 * PLACEHOLDER DATA — replace with the confirmed banking relationships.
 *
 * `initials` renders a typographic lettermark. When the real artwork is
 * supplied, import the file and set `logoSrc` on the entry; the monogram is
 * used only as the fallback, so no markup needs to change.
 */
const bankingPartners: readonly {
  name: string
  relationship: string
  initials: string
  logoSrc?: string
}[] = [
  {
    name: 'Commercial Bank of Ceylon',
    relationship: 'Primary operating and settlement account',
    initials: 'CB',
  },
  {
    name: 'Hatton National Bank',
    relationship: 'Foreign currency and inbound guest remittances',
    initials: 'HNB',
  },
  {
    name: 'Sampath Bank',
    relationship: 'Merchant services and card acquiring',
    initials: 'SB',
  },
  {
    name: 'Bank of Ceylon',
    relationship: 'Government and licensing settlements',
    initials: 'BOC',
  },
]

const digitalStudio = {
  name: 'Eunoia Solutions Pvt Ltd',
  founder: 'Sakna Perera',
  role: 'Founder',
  image: aboutImages.portraitSakna,
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

      {/* Branches */}
      {/* The Contact page links here rather than repeating the addresses. */}
      <section
        className="about-section about-branches"
        id="office-network"
        aria-labelledby="about-branches-head"
      >
        <div className="about-container about-branches-inner">
          <header className="about-branches-header">
            <div className="about-custodians-labels">
              <span className="about-section-numeral">V</span>
              <span className="about-section-sub-label">WHERE WE ARE</span>
            </div>
            <div>
              <h2 id="about-branches-head" className="about-branches-heading">
                Our International
                <br />
                Office <em>Network.</em>
              </h2>
              <p className="about-branches-description">
                Wherever a journey begins, there is someone close enough to speak with properly.
                Our offices in Britain, Canada and Bahrain sit alongside the people who arrange
                everything on the island itself.
              </p>
            </div>
          </header>

          <div className="about-branch-grid">
            {branches.map((branch) => (
              <article key={branch.country} className="about-branch-card">
                <header>
                  <h3>{branch.country}</h3>
                  <span className="about-branch-role">{branch.city}</span>
                </header>
                <address>
                  {branch.address.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                  <span className="about-branch-region">{branch.region}</span>
                </address>
                <dl className="about-branch-meta">
                  <div>
                    <dt>Text</dt>
                    <dd>
                      <a href={`tel:${branch.phone.replace(/\s/g, '')}`}>{branch.phone}</a>
                    </dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Banking partners */}
      <section className="about-section about-banking" aria-labelledby="about-banking-head">
        <div className="about-container about-banking-inner">
          <header className="about-banking-header">
            <p className="about-eyebrow about-eyebrow--green">BANKING &amp; SETTLEMENT</p>
            <h2 id="about-banking-head">The institutions behind the arrangements.</h2>
            <p>
              Payments, deposits, and currency handling are held with established Sri Lankan banks,
              so every settlement is traceable, regulated, and quietly straightforward for guests
              arriving from abroad.
            </p>
          </header>

          <ul className="about-banking-list">
            {bankingPartners.map((bank) => (
              <li key={bank.name} className="about-banking-item">
                <span className="about-banking-logo" aria-hidden="true">
                  {bank.logoSrc ? (
                    <img src={bank.logoSrc} alt="" />
                  ) : (
                    <span className="about-banking-monogram">{bank.initials}</span>
                  )}
                </span>
                <span className="about-banking-copy">
                  <span className="about-banking-name">{bank.name}</span>
                  <span className="about-banking-relationship">{bank.relationship}</span>
                </span>
              </li>
            ))}
          </ul>

          <p className="about-placeholder-note">
            Banking relationships shown are indicative and pending confirmation. Guests never send
            funds before their concierge confirms the account details directly.
          </p>
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
              <div>
                <h3>{digitalStudio.name}</h3>
                <span>
                  {digitalStudio.founder} — {digitalStudio.role}
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
              src={breathSeaImage}
              alt="Calm turquoise sea and sandy shore at golden hour"
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
            If you have read this far, you are looking for a more thoughtful way to enter Sri Lanka.
            That intention is exactly where our work begins.
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
          <a className="about-invitation-button" href="/expectations">
            Explore Sri Lanka Privately
          </a>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="about-section about-footer-cta">
        <img
          className="about-footer-cta-image"
          src={experienceImages.heroSigiriya}
          alt="Sigiriya rock fortress rising above the Sri Lankan forest canopy"
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
