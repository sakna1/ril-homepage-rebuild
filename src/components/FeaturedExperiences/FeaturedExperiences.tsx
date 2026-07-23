import { experienceImages } from '../ExperiencesPage/images'
import './FeaturedExperiences.css'

function ExperienceCta() {
  return (
    <a href="/expectations" className="experience-cta">
      <span className="experience-cta-text">Begin Expectations Around This</span>
      <span className="experience-cta-underline"></span>
    </a>
  )
}

function CategoryLabel({ label }: { label: string }) {
  return (
    <div className="category-label-row">
      <span className="category-dash"></span>
      <span className="category-label">{label}</span>
    </div>
  )
}

export function FeaturedExperiences() {
  return (
    <section className="encounters-section">
      <header className="section-header">
        <div className="header-left">
          <span className="eyebrow-label">Curated Encounters</span>
          <h1 className="section-headline">
            Encounters That
            <br />
            Cannot Be Catalogued
          </h1>
        </div>
        <p className="header-tagline">
          We do not sell destinations. We facilitate encounters — with place, with people, with
          yourself.
        </p>
      </header>

      <div className="experiences-list">
        <div className="experience-row">
          <div className="experience-image-wrap">
            <img
              src={experienceImages.hillCountry}
              alt="Nuwara Eliya hill country landscape, Sri Lanka"
            />
            <span className="experience-number">01</span>
          </div>
          <div className="experience-content">
            <div className="experience-content-inner">
              <CategoryLabel label="The Highlands" />
              <h2 className="experience-title">
                Dawn in the
                <br />
                <em>Tea Country</em>
              </h2>
              <hr className="content-divider" />
              <p className="experience-description">
                Before the valley wakes, a single-estate Pekoe steams on a colonial verandah at a
                private Nuwara Eliya bungalow. The mist below is not backdrop — it is the entire
                point. This is not a tour. It is an invitation into a way of life that has not
                changed in a century.
              </p>
              <ExperienceCta />
            </div>
          </div>
        </div>

        <hr className="experience-divider" />

        <div className="experience-row image-right">
          <div className="experience-content">
            <div className="experience-content-inner">
              <CategoryLabel label="The Ancient Interior" />
              <h2 className="experience-title">
                Where the Rock
                <br />
                <em>Holds Memory</em>
              </h2>
              <hr className="content-divider" />
              <p className="experience-description">
                Sigiriya at first light, before any other visitor arrives. A private guide who has
                studied these frescoes for thirty years. The water gardens, the lion&apos;s paw
                staircase, the summit at dawn. Some monuments demand silence — and the silence
                demands you are ready to receive it.
              </p>
              <ExperienceCta />
            </div>
          </div>
          <div className="experience-image-wrap image-right">
            <img
              src={experienceImages.sigiriyaMain}
              alt="Sigiriya rock fortress rising above the Sri Lankan landscape"
            />
            <span className="experience-number">02</span>
          </div>
        </div>

        <hr className="experience-divider" />

        <div className="experience-row">
          <div className="experience-image-wrap">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/f0c708d2b75f301df7b8ec2dfce515705491979b?width=1067"
              alt="Steam rising from cup of Ceylon tea on antique teak table"
            />
            <span className="experience-number">03</span>
          </div>
          <div className="experience-content">
            <div className="experience-content-inner">
              <CategoryLabel label="The Sensory" />
              <h2 className="experience-title">
                The Cup That
                <br />
                <em>Contains a Season</em>
              </h2>
              <hr className="content-divider" />
              <p className="experience-description">
                A private tasting session with the third-generation owner of a highland estate. Not
                tourism — a conversation between people who care deeply about a leaf, a slope, a
                cloud. You will never think of tea the same way again, which is rather the intention.
              </p>
              <ExperienceCta />
            </div>
          </div>
        </div>
      </div>

      <footer className="section-footer">
        <div className="footer-lines">
          <span className="footer-line"></span>
          <div className="footer-center">
            <a href="/expectations" className="footer-continue-link">
              <span className="footer-link-text">Continue Exploring</span>
              <span className="footer-link-underline"></span>
            </a>
            <span className="chevron-icon">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <g clipPath="url(#clip0_footer)">
                  <path
                    d="M19.6875 10C19.6875 15.3516 15.3516 19.6875 10 19.6875C4.64844 19.6875 0.3125 15.3516 0.3125 10C0.3125 4.64844 4.64844 0.3125 10 0.3125C15.3516 0.3125 19.6875 4.64844 19.6875 10ZM10.6641 14.4492L15.957 9.15625C16.3242 8.78906 16.3242 8.19531 15.957 7.83203L15.293 7.16797C14.9258 6.80078 14.332 6.80078 13.9688 7.16797L10 11.1367L6.03125 7.16797C5.66406 6.80078 5.07031 6.80078 4.70703 7.16797L4.04297 7.83203C3.67578 8.19922 3.67578 8.79297 4.04297 9.15625L9.33594 14.4492C9.70312 14.8164 10.2969 14.8164 10.6641 14.4492Z"
                    fill="black"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_footer">
                    <rect width="20" height="20" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </span>
            <a href="/expectations" className="footer-all-link">
              <span className="footer-link-text">Expectations</span>
              <span className="footer-link-underline"></span>
            </a>
          </div>
          <span className="footer-line"></span>
        </div>
      </footer>
    </section>
  )
}
