import type { Experience } from '../../data/experiences'
import {
  journeySeasons,
  journeyThemes,
  type JourneyConsultationSelection,
  type JourneyRecommendation,
} from '../../data/journeyConsultation'
import type { JourneyRegion, RegionDestination } from '../../data/journeyRegions'
import './JourneyDiscoveryPanel.css'

type JourneyDiscoveryPanelProps = {
  addedExperienceIds?: string[]
  experienceLookup?: Record<string, Experience>
  experiences?: Experience[]
  consultationSelection?: JourneyConsultationSelection
  journeyRecommendation?: JourneyRecommendation
  selectedDestination?: RegionDestination
  selectedExperience?: Experience
  selectedRegion?: JourneyRegion
  onAddExperienceToJourney?: (experience: Experience) => void
  onBackToDestination?: () => void
  onExperienceSelect?: (experience: Experience) => void
  onExploreRegions?: () => void
}

export function JourneyDiscoveryPanel({
  addedExperienceIds = [],
  experienceLookup = {},
  experiences = [],
  consultationSelection,
  journeyRecommendation,
  selectedDestination,
  selectedExperience,
  selectedRegion,
  onAddExperienceToJourney,
  onBackToDestination,
  onExperienceSelect,
  onExploreRegions,
}: JourneyDiscoveryPanelProps) {
  const panelKey =
    selectedExperience?.id ?? selectedDestination?.id ?? selectedRegion?.id ?? 'default-discovery-panel'
  const selectedTheme = journeyThemes.find((theme) => theme.id === consultationSelection?.themeId)
  const selectedSeason = journeySeasons.find((season) => season.id === consultationSelection?.seasonId)

  if (selectedDestination && selectedExperience) {
    const relatedExperiences = selectedExperience.relatedExperiences
      .map((experienceId) => experienceLookup[experienceId])
      .filter((experience): experience is Experience => Boolean(experience))
    const hasBeenAdded = addedExperienceIds.includes(selectedExperience.id)

    return (
      <aside key={`experience-${panelKey}`} className="journey-discovery-panel" aria-live="polite">
        <img
          className="journey-discovery-panel__image journey-discovery-panel__image--hero"
          src={selectedExperience.heroImage}
          alt={`${selectedExperience.title} experience preview`}
        />
        <div className="journey-discovery-panel__body journey-discovery-panel__body--experience">
          <button className="journey-discovery-panel__back-button" type="button" onClick={onBackToDestination}>
            Back to {selectedDestination.title}
          </button>
          <p className="journey-discovery-panel__eyebrow">Experience</p>
          <h2>{selectedExperience.title}</h2>
          <p className="journey-discovery-panel__destination-label">{selectedDestination.title}</p>
          <p className="journey-discovery-panel__lead">{selectedExperience.story}</p>

          <div className="journey-discovery-panel__section">
            <h3>Why This Experience Is Special</h3>
            <p>{selectedExperience.description}</p>
          </div>

          <dl className="journey-discovery-panel__detail-grid">
            <div>
              <dt>Duration</dt>
              <dd>{selectedExperience.duration}</dd>
            </div>
            <div>
              <dt>Best Time</dt>
              <dd>{selectedExperience.bestSeason}</dd>
            </div>
            <div>
              <dt>Luxury Level</dt>
              <dd>{selectedExperience.luxuryLevel}</dd>
            </div>
            <div>
              <dt>Difficulty</dt>
              <dd>{selectedExperience.difficulty}</dd>
            </div>
          </dl>

          <div className="journey-discovery-panel__section">
            <h3>Journey Mood</h3>
            <ul className="journey-discovery-panel__tag-list">
              {selectedExperience.journeyMoods.map((mood) => (
                <li key={mood}>{mood}</li>
              ))}
            </ul>
          </div>

          <div className="journey-discovery-panel__section">
            <h3>Suitable For</h3>
            <ul className="journey-discovery-panel__list">
              {selectedExperience.suitableFor.map((traveller) => (
                <li key={traveller}>{traveller}</li>
              ))}
            </ul>
          </div>

          <div className="journey-discovery-panel__section">
            <h3>Included</h3>
            <ul className="journey-discovery-panel__list">
              {selectedExperience.included.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="journey-discovery-panel__section">
            <h3>Highlights</h3>
            <ul className="journey-discovery-panel__list">
              {selectedExperience.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </div>

          <div className="journey-discovery-panel__section">
            <h3>Gallery Preview</h3>
            <div className="journey-discovery-panel__gallery">
              {selectedExperience.gallery.slice(0, 3).map((image, index) => (
                <img key={`${selectedExperience.id}-gallery-${index}`} src={image} alt="" />
              ))}
            </div>
          </div>

          {relatedExperiences.length ? (
            <div className="journey-discovery-panel__section">
              <h3>Related Experiences</h3>
              <div className="journey-discovery-panel__related-list">
                {relatedExperiences.map((experience) => (
                  <button
                    key={experience.id}
                    className="journey-discovery-panel__related-button"
                    type="button"
                    onClick={() => onExperienceSelect?.(experience)}
                  >
                    {experience.title}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <button
            className="journey-discovery-panel__cta"
            type="button"
            onClick={() => onAddExperienceToJourney?.(selectedExperience)}
          >
            Add To Journey
          </button>
          {hasBeenAdded ? (
            <p className="journey-discovery-panel__confirmation">✓ Added to Your Journey</p>
          ) : null}
        </div>
      </aside>
    )
  }

  if (selectedDestination) {
    return (
      <aside key={`destination-${panelKey}`} className="journey-discovery-panel" aria-live="polite">
        <img
          className="journey-discovery-panel__image"
          src={selectedDestination.heroImage}
          alt={`${selectedDestination.title} journey preview`}
        />
        <div className="journey-discovery-panel__body">
          <p className="journey-discovery-panel__eyebrow">Destination</p>
          <h2>{selectedDestination.title}</h2>
          <p className="journey-discovery-panel__lead">{selectedDestination.description}</p>

          <div className="journey-discovery-panel__section">
            <h3>Destination Story</h3>
            <p>{selectedDestination.travelNotes}</p>
          </div>

          <div className="journey-discovery-panel__section">
            <h3>Travel Mood</h3>
            <ul className="journey-discovery-panel__tag-list">
              {selectedDestination.journeyMood.map((mood) => (
                <li key={mood}>{mood}</li>
              ))}
            </ul>
          </div>

          <div className="journey-discovery-panel__section">
            <h3>Season</h3>
            <p>{selectedDestination.bestTimeToVisit}</p>
          </div>

          <div className="journey-discovery-panel__section journey-discovery-panel__section--experiences">
            <p className="journey-discovery-panel__section-kicker">Curated Experiences</p>
            <h3>Carefully selected moments that define this destination.</h3>
            <div className="journey-discovery-panel__experience-list">
              {experiences.map((experience) => (
                <button
                  key={experience.id}
                  className="journey-discovery-panel__experience-card"
                  type="button"
                  onClick={() => onExperienceSelect?.(experience)}
                >
                  <img src={experience.heroImage} alt="" />
                  <span className="journey-discovery-panel__experience-card-body">
                    <span className="journey-discovery-panel__experience-card-title">{experience.title}</span>
                    <span className="journey-discovery-panel__experience-card-description">
                      {experience.description}
                    </span>
                    <span className="journey-discovery-panel__experience-card-meta">
                      <span>{experience.duration}</span>
                      <span>Luxury: {experience.luxuryLevel}</span>
                    </span>
                    <span className="journey-discovery-panel__mini-tags">
                      {experience.journeyMoods.slice(0, 3).map((mood) => (
                        <span key={mood}>{mood}</span>
                      ))}
                    </span>
                    <span className="journey-discovery-panel__experience-card-link">
                      Discover Experience
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>
    )
  }

  if (selectedRegion) {
    return (
      <aside key={`region-${panelKey}`} className="journey-discovery-panel" aria-live="polite">
        <img
          className="journey-discovery-panel__image"
          src={selectedRegion.heroImage}
          alt={`${selectedRegion.title} region preview`}
        />
        <div className="journey-discovery-panel__body">
          <p className="journey-discovery-panel__eyebrow">Journey Region</p>
          <h2>{selectedRegion.title}</h2>
          <p className="journey-discovery-panel__lead">{selectedRegion.editorialIntroduction}</p>
          <p>{selectedRegion.summary}</p>

          <div className="journey-discovery-panel__section">
            <h3>Best For</h3>
            <ul className="journey-discovery-panel__tag-list">
              {selectedRegion.travellerMoods.map((mood) => (
                <li key={mood}>{mood}</li>
              ))}
            </ul>
          </div>

          <div className="journey-discovery-panel__section">
            <h3>Recommended Season</h3>
            <p>{selectedRegion.recommendedSeason}</p>
          </div>

          <div className="journey-discovery-panel__section">
            <h3>Journey Highlights</h3>
            <ul className="journey-discovery-panel__list">
              {selectedRegion.journeyHighlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </div>

          <div className="journey-discovery-panel__section">
            <h3>Destinations</h3>
            <ul className="journey-discovery-panel__list">
              {selectedRegion.destinations.map((destination) => (
                <li key={destination.id}>{destination.title}</li>
              ))}
            </ul>
          </div>
        </div>
      </aside>
    )
  }

  if (journeyRecommendation && consultationSelection) {
    return (
      <aside key={`recommendation-${panelKey}`} className="journey-discovery-panel" aria-live="polite">
        <div className="journey-discovery-panel__body">
          <p className="journey-discovery-panel__eyebrow">Your First Recommendation</p>
          <h2>{selectedTheme?.title ?? 'A Curated Sri Lanka'}</h2>
          <div className="journey-discovery-panel__consultation-list">
            <div>
              <span>Discover Through</span>
              <strong>{selectedTheme?.title}</strong>
            </div>
            <div>
              <span>Journey Mood</span>
              <strong>{consultationSelection.mood}</strong>
            </div>
            <div>
              <span>Best Time</span>
              <strong>{selectedSeason?.label}</strong>
            </div>
          </div>

          <div className="journey-discovery-panel__section">
            <h3>Why We Chose This</h3>
            <p>{journeyRecommendation.whyWeChoseThis}</p>
          </div>

          <div className="journey-discovery-panel__section">
            <h3>Recommended Journey Regions</h3>
            <ul className="journey-discovery-panel__recommendation-list">
              {journeyRecommendation.regions.map((region) => (
                <li key={region.id}>{region.title}</li>
              ))}
            </ul>
          </div>

          {selectedSeason ? (
            <div className="journey-discovery-panel__section">
              <h3>Seasonal Highlights</h3>
              <ul className="journey-discovery-panel__list">
                {selectedSeason.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="journey-discovery-panel__section">
            <h3>Suggested Experiences</h3>
            <ul className="journey-discovery-panel__tag-list">
              {journeyRecommendation.suggestedExperiences.map((experience) => (
                <li key={experience}>{experience}</li>
              ))}
            </ul>
          </div>
        </div>
      </aside>
    )
  }

  return (
    <aside key={panelKey} className="journey-discovery-panel journey-discovery-panel--default" aria-live="polite">
      <div className="journey-discovery-panel__body">
        <p className="journey-discovery-panel__eyebrow">Begin With Atmosphere</p>
        <h2>Discover Sri Lanka</h2>
        <p className="journey-discovery-panel__lead">Choose a region to begin discovering the island.</p>
        <p>
          Luxury travel is rarely about finding a destination. It begins by discovering the
          atmosphere that feels right for your journey.
        </p>
        <button className="journey-discovery-panel__button" type="button" onClick={onExploreRegions}>
          Explore Regions
        </button>
      </div>
    </aside>
  )
}
