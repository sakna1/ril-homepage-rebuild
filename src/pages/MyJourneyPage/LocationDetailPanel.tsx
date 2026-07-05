import type { Experience } from '../../data/experiences'
import type { JourneyRegion, RegionDestination } from '../../data/journeyRegions'
import { getContextualRecommendations } from '../../journey/contextualRecommendations'
import { useJourney } from '../../journey/useJourney'
import {
  createJourneyItemFromDestination,
  createJourneyItemFromExperience,
  createJourneyItemFromRegion,
} from '../../journey/journeyItemHelpers'
import { getRegionEditorialName } from '../../journey/journeyRegionCatalog'
import { ContextualRecommendations, JourneySaveAction } from './ContextualRecommendations'
import '../../components/JourneyDiscoveryPanel/JourneyDiscoveryPanel.css'

type LocationDetailPanelProps = {
  experiences?: Experience[]
  selectedDestination?: RegionDestination
  selectedExperience?: Experience
  selectedRegion?: JourneyRegion
  onBackToDestination?: () => void
  onDestinationSelect?: (destination: RegionDestination) => void
  onExperienceSelect?: (experience: Experience) => void
  onExploreRegions?: () => void
  onClose?: () => void
}

export function LocationDetailPanel({
  experiences = [],
  selectedDestination,
  selectedExperience,
  selectedRegion,
  onBackToDestination,
  onDestinationSelect,
  onExperienceSelect,
  onExploreRegions,
  onClose,
}: LocationDetailPanelProps) {
  const { items } = useJourney()
  const panelKey =
    selectedExperience?.id ?? selectedDestination?.id ?? selectedRegion?.id ?? 'default-discovery-panel'

  if (selectedDestination && selectedExperience) {
    const experienceItem = createJourneyItemFromExperience(
      selectedExperience,
      selectedDestination,
      selectedRegion,
    )
    const recommendationGroup = getContextualRecommendations('experience', items, {
      experience: selectedExperience,
      destination: selectedDestination,
      region: selectedRegion,
    })

    return (
      <aside key={`experience-${panelKey}`} className="journey-discovery-panel location-detail-panel" aria-live="polite">
        {onClose ? (
          <button className="location-detail-panel__close" type="button" onClick={onClose} aria-label="Close panel">
            Close
          </button>
        ) : null}
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

          <JourneySaveAction item={experienceItem} label={selectedExperience.title} />

          {recommendationGroup ? (
            <ContextualRecommendations
              primaryHeading={recommendationGroup.primaryHeading}
              secondaryHeading={recommendationGroup.secondaryHeading}
              recommendations={recommendationGroup.recommendations}
            />
          ) : null}
        </div>
      </aside>
    )
  }

  if (selectedDestination && selectedRegion) {
    const destinationItem = createJourneyItemFromDestination(selectedDestination, selectedRegion)
    const recommendationGroup = getContextualRecommendations('destination', items, {
      destination: selectedDestination,
      region: selectedRegion,
    })

    return (
      <aside key={`destination-${panelKey}`} className="journey-discovery-panel location-detail-panel" aria-live="polite">
        {onClose ? (
          <button className="location-detail-panel__close" type="button" onClick={onClose} aria-label="Close panel">
            Close
          </button>
        ) : null}
        <img
          className="journey-discovery-panel__image"
          src={selectedDestination.heroImage}
          alt={`${selectedDestination.title} journey preview`}
        />
        <div className="journey-discovery-panel__body">
          <p className="journey-discovery-panel__eyebrow">Destination</p>
          <h2>{selectedDestination.title}</h2>
          <p className="journey-discovery-panel__lead">{selectedDestination.description}</p>
          <p className="location-detail-panel__region">
            {getRegionEditorialName(selectedRegion.id)}
          </p>

          <JourneySaveAction item={destinationItem} label={selectedDestination.title} />

          <div className="journey-discovery-panel__section">
            <h3>Destination Story</h3>
            <p>{selectedDestination.travelNotes}</p>
          </div>

          <div className="journey-discovery-panel__section journey-discovery-panel__section--experiences">
            <p className="journey-discovery-panel__section-kicker">Ways to experience this place</p>
            <h3>A few directions to explore here.</h3>
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
                  </span>
                </button>
              ))}
            </div>
          </div>

          {recommendationGroup ? (
            <ContextualRecommendations
              primaryHeading={recommendationGroup.primaryHeading}
              secondaryHeading={recommendationGroup.secondaryHeading}
              recommendations={recommendationGroup.recommendations}
            />
          ) : null}
        </div>
      </aside>
    )
  }

  if (selectedRegion) {
    const regionItem = createJourneyItemFromRegion(selectedRegion)
    const recommendationGroup = getContextualRecommendations('region', items, {
      region: selectedRegion,
    })

    return (
      <aside key={`region-${panelKey}`} className="journey-discovery-panel location-detail-panel" aria-live="polite">
        {onClose ? (
          <button className="location-detail-panel__close" type="button" onClick={onClose} aria-label="Close panel">
            Close
          </button>
        ) : null}
        <img
          className="journey-discovery-panel__image"
          src={selectedRegion.heroImage}
          alt={`${selectedRegion.title} region preview`}
        />
        <div className="journey-discovery-panel__body">
          <p className="journey-discovery-panel__eyebrow">Journey Region</p>
          <h2>{getRegionEditorialName(selectedRegion.id)}</h2>
          <p className="journey-discovery-panel__lead">{selectedRegion.editorialIntroduction}</p>
          <p>{selectedRegion.summary}</p>

          <JourneySaveAction item={regionItem} label={getRegionEditorialName(selectedRegion.id)} />

          <div className="journey-discovery-panel__section">
            <h3>Destinations</h3>
            <ul className="journey-discovery-panel__list journey-discovery-panel__list--actions">
              {selectedRegion.destinations.map((destination) => (
                <li key={destination.id}>
                  <button
                    type="button"
                    className="journey-discovery-panel__destination-link"
                    onClick={() => onDestinationSelect?.(destination)}
                  >
                    {destination.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {recommendationGroup ? (
            <ContextualRecommendations
              primaryHeading={recommendationGroup.primaryHeading}
              secondaryHeading={recommendationGroup.secondaryHeading}
              recommendations={recommendationGroup.recommendations}
            />
          ) : null}
        </div>
      </aside>
    )
  }

  return (
    <aside key={panelKey} className="journey-discovery-panel journey-discovery-panel--default location-detail-panel" aria-live="polite">
      <div className="journey-discovery-panel__body">
        <p className="journey-discovery-panel__eyebrow">Begin With Atmosphere</p>
        <h2>Discover Sri Lanka</h2>
        <p className="journey-discovery-panel__lead">Choose a region to begin discovering the island.</p>
        <p>
          Luxury travel is rarely about finding a destination. It begins by discovering the atmosphere that feels
          right for your journey.
        </p>
        <button className="journey-discovery-panel__button" type="button" onClick={onExploreRegions}>
          Explore Regions
        </button>
      </div>
    </aside>
  )
}
