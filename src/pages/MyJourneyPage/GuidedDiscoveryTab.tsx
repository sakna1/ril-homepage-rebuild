import { useEffect, useMemo, useState } from 'react'
import { JourneyRegionLayer } from '../../components/Map/JourneyRegionLayer'
import { TravelMap } from '../../components/Map/TravelMap'
import {
  getJourneyRecommendation,
  getRecommendedRegions,
  journeyMoods,
  journeySeasons,
  journeyThemes,
  type JourneyConsultationSelection,
} from '../../data/journeyConsultation'
import { experiencesById } from '../../data/experiences'
import { journeyRegions } from '../../data/journeyRegions'
import { sharedHeritageWorld } from '../../journey/discoveryWorlds'
import {
  createJourneyItemFromDestination,
  createJourneyItemFromExperience,
  createJourneyItemFromMood,
  createJourneyItemFromRegion,
  createJourneyItemFromSeason,
  createJourneyItemFromTheme,
} from '../../journey/journeyItemHelpers'
import { getRegionEditorialName } from '../../journey/journeyRegionCatalog'
import { useJourney } from '../../journey/useJourney'
import type { SuggestedJourneyRhythm } from '../../data/journey/types'
import { journeyRepository } from '../../services/journeyRepository'
import { getTabId, getTabPanelId } from './journeyView'

const guidedThemes = [
  ...journeyThemes,
  {
    id: sharedHeritageWorld.id,
    iconLabel: 'S',
    title: sharedHeritageWorld.name,
    description: sharedHeritageWorld.description,
  },
]

export function GuidedDiscoveryTab() {
  const { includeItem, isIncluded } = useJourney()
  const [selectedThemeIds, setSelectedThemeIds] = useState<string[]>([])
  const [selectedMood, setSelectedMood] = useState<string | undefined>()
  const [selectedSeasonId, setSelectedSeasonId] = useState<string | undefined>()
  const [showResult, setShowResult] = useState(false)
  const [journeyRhythms, setJourneyRhythms] = useState<SuggestedJourneyRhythm[]>([])

  useEffect(() => {
    void journeyRepository.getJourneyRhythms().then(setJourneyRhythms)
  }, [])

  const consultationSelection: JourneyConsultationSelection = useMemo(
    () => ({
      themeId: selectedThemeIds[0],
      themeIds: selectedThemeIds,
      mood: selectedMood,
      seasonId: selectedSeasonId,
    }),
    [selectedMood, selectedSeasonId, selectedThemeIds],
  )

  const isComplete = selectedThemeIds.length > 0 && Boolean(selectedMood) && Boolean(selectedSeasonId)

  const recommendedRegions = useMemo(
    () => (isComplete ? getRecommendedRegions(journeyRegions, consultationSelection).slice(0, 4) : []),
    [consultationSelection, isComplete],
  )

  const journeyRecommendation = useMemo(
    () => (isComplete ? getJourneyRecommendation(journeyRegions, consultationSelection) : undefined),
    [consultationSelection, isComplete],
  )

  const recommendedRegionIds = recommendedRegions.map((region) => region.id)
  const selectedSeason = journeySeasons.find((season) => season.id === selectedSeasonId)

  function toggleTheme(themeId: string) {
    setShowResult(false)
    setSelectedThemeIds((current) =>
      current.includes(themeId) ? current.filter((id) => id !== themeId) : [...current, themeId],
    )
  }

  function handleAddDirectionsToJourney() {
    selectedThemeIds.forEach((themeId) => {
      const theme = guidedThemes.find((entry) => entry.id === themeId)
      if (theme) {
        includeItem(createJourneyItemFromTheme(theme))
      }
    })
  }

  function handleRevealReading() {
    if (!isComplete) {
      return
    }
    setShowResult(true)
    if (selectedMood) {
      includeItem(createJourneyItemFromMood(selectedMood))
    }
    if (selectedSeason && selectedSeasonId) {
      includeItem(
        createJourneyItemFromSeason(selectedSeasonId, selectedSeason.label, selectedSeason.description),
      )
    }
  }

  function handleAddRhythmToJourney(rhythm: SuggestedJourneyRhythm) {
    rhythm.destinationIds.forEach((destinationId) => {
      const region = journeyRegions.find((entry) =>
        entry.destinations.some((destination) => destination.id === destinationId),
      )
      const destination = region?.destinations.find((entry) => entry.id === destinationId)
      if (destination && region) {
        includeItem(createJourneyItemFromDestination(destination, region))
      }
    })
  }

  const rhythmSummary = recommendedRegions.length
    ? recommendedRegions.map((region) => getRegionEditorialName(region.id)).join(' → ')
    : ''

  const matchingRhythm = useMemo(() => {
    if (!showResult || recommendedRegions.length === 0) {
      return undefined
    }
    const regionDestinationIds = recommendedRegions.flatMap((region) =>
      region.destinations.map((destination) => destination.id),
    )
    return journeyRhythms.find((rhythm) =>
      rhythm.destinationIds.some((id) => regionDestinationIds.includes(id)),
    )
  }, [journeyRhythms, recommendedRegions, showResult])

  return (
    <section
      className="my-journey-tab-panel guided-discovery-tab"
      role="tabpanel"
      id={getTabPanelId('guided')}
      aria-labelledby={getTabId('guided')}
    >
      {!showResult ? (
        <div className="guided-discovery-tab__steps">
          <div className="guided-discovery-tab__step">
            <h2>What are you drawn toward?</h2>
            <p>Select one or more Discovery Worlds that feel relevant.</p>
            <div className="guided-discovery-tab__theme-grid">
              {guidedThemes.map((theme) => (
                <button
                  key={theme.id}
                  className="guided-discovery-tab__theme-card"
                  type="button"
                  aria-pressed={selectedThemeIds.includes(theme.id)}
                  onClick={() => toggleTheme(theme.id)}
                >
                  <span className="guided-discovery-tab__theme-icon" aria-hidden="true">
                    {theme.iconLabel}
                  </span>
                  <span className="guided-discovery-tab__theme-title">{theme.title}</span>
                  <span className="guided-discovery-tab__theme-description">{theme.description}</span>
                </button>
              ))}
            </div>
            {selectedThemeIds.length > 0 ? (
              <button
                className="guided-discovery-tab__quiet-action"
                type="button"
                onClick={handleAddDirectionsToJourney}
              >
                Add these directions to My Journey
              </button>
            ) : null}
          </div>

          {selectedThemeIds.length > 0 ? (
            <div className="guided-discovery-tab__step">
              <h2>How would you like the journey to feel?</h2>
              <div className="guided-discovery-tab__pill-list" role="list">
                {journeyMoods.map((mood) => (
                  <button
                    key={mood}
                    className="guided-discovery-tab__pill"
                    type="button"
                    aria-pressed={selectedMood === mood}
                    onClick={() => {
                      setShowResult(false)
                      setSelectedMood(mood)
                    }}
                  >
                    {mood}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {selectedMood ? (
            <div className="guided-discovery-tab__step">
              <h2>When are you considering travelling?</h2>
              <div className="guided-discovery-tab__season-grid">
                {journeySeasons.map((season) => (
                  <button
                    key={season.id}
                    className="guided-discovery-tab__season-card"
                    type="button"
                    aria-pressed={selectedSeasonId === season.id}
                    onClick={() => {
                      setShowResult(false)
                      setSelectedSeasonId(season.id)
                    }}
                  >
                    <span>{season.label}</span>
                    <small>{season.description}</small>
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {isComplete ? (
            <button className="guided-discovery-tab__primary" type="button" onClick={handleRevealReading}>
              Reveal a first reading
            </button>
          ) : null}
        </div>
      ) : (
        <div className="guided-discovery-tab__result">
          <button
            className="guided-discovery-tab__back"
            type="button"
            onClick={() => setShowResult(false)}
          >
            Adjust preferences
          </button>

          <h2>A First Reading of Your Journey</h2>
          <p className="guided-discovery-tab__result-note">
            A possible rhythm — ready to be refined privately.
          </p>

          {rhythmSummary ? <p className="guided-discovery-tab__rhythm">{rhythmSummary}</p> : null}

          {journeyRecommendation ? (
            <p className="guided-discovery-tab__summary">{journeyRecommendation.whyWeChoseThis}</p>
          ) : null}

          <p className="guided-discovery-tab__result-note">
            A considered beginning, ready to be refined privately.
          </p>

          {matchingRhythm ? (
            <div className="guided-discovery-tab__rhythm-suggestion">
              <h3>{matchingRhythm.title}</h3>
              <p>{matchingRhythm.summary}</p>
              <button type="button" onClick={() => handleAddRhythmToJourney(matchingRhythm)}>
                Add this rhythm to My Journey
              </button>
            </div>
          ) : null}

          <div className="guided-discovery-tab__result-map">
            <TravelMap>
              {(map) => (
                <JourneyRegionLayer
                  map={map}
                  recommendedRegionIds={recommendedRegionIds}
                  regions={journeyRegions}
                  onRegionSelect={() => {
                    /* read-only map */
                  }}
                />
              )}
            </TravelMap>
          </div>

          <div className="guided-discovery-tab__result-actions">
            <h3>Consider adding</h3>
            <ul className="guided-discovery-tab__result-list">
              {recommendedRegions.map((region) => {
                const item = createJourneyItemFromRegion(region)
                const saved = isIncluded(item.id)
                return (
                  <li key={region.id}>
                    <span>{getRegionEditorialName(region.id)}</span>
                    {saved ? (
                      <span className="guided-discovery-tab__saved-label">Added to My Journey</span>
                    ) : (
                      <button type="button" onClick={() => includeItem(item)}>
                        Add to My Journey
                      </button>
                    )}
                  </li>
                )
              })}
            </ul>

            {journeyRecommendation?.suggestedExperiences.slice(0, 3).map((experienceTitle) => {
              const experience = Object.values(experiencesById).find((entry) => entry.title === experienceTitle)
              if (!experience) {
                return null
              }
              const item = createJourneyItemFromExperience(experience)
              const saved = isIncluded(item.id)
              return (
                <div key={experience.id} className="guided-discovery-tab__experience-action">
                  <span>{experience.title}</span>
                  {saved ? (
                    <span className="guided-discovery-tab__saved-label">Added to My Journey</span>
                  ) : (
                    <button type="button" onClick={() => includeItem(item)}>
                      Add to My Journey
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </section>
  )
}
