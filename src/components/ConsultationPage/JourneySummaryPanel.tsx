import { useEffect, useMemo, useState } from 'react'
import { ILLUSTRATIVE_DISCLAIMER } from '../../data/journey/mockJourneyTypes'
import type { SuggestedRhythmResult } from '../../data/journey/types'
import type { JourneyItem } from '../../journey/JourneyContext'
import {
  adaptSavedItemsToRepositoryInput,
  journeyRepository,
} from '../../services/journeyRepository'
import type { ConsultationJourneySummaryDisplay } from '../../consultation/buildConsultationSummary'
import './JourneySummaryPanel.css'

type JourneySummaryPanelProps = {
  summary: ConsultationJourneySummaryDisplay
  items: JourneyItem[]
}

export function JourneySummaryPanel({ summary, items }: JourneySummaryPanelProps) {
  const [rhythm, setRhythm] = useState<SuggestedRhythmResult | undefined>()
  const repositoryInput = useMemo(() => adaptSavedItemsToRepositoryInput(items), [items])

  useEffect(() => {
    let cancelled = false

    async function loadRhythm() {
      if (items.length === 0) {
        setRhythm(undefined)
        return
      }

      const rhythmResult = await journeyRepository.getSuggestedRhythm(
        repositoryInput.savedItemIds,
        items,
      )
      const hasValidRhythm = Boolean(rhythmResult && rhythmResult.sequence.length >= 2)

      if (!cancelled) {
        setRhythm(hasValidRhythm ? rhythmResult : undefined)
      }
    }

    void loadRhythm()

    return () => {
      cancelled = true
    }
  }, [items, repositoryInput.savedItemIds])

  if (!summary.hasMeaningfulContext) {
    return null
  }

  return (
    <section className="journey-summary-panel" aria-labelledby="journey-summary-heading">
      <div className="journey-summary-panel__header">
        <p className="journey-summary-panel__eyebrow">Your journey summary</p>
        <h2 id="journey-summary-heading">What you have saved so far</h2>
        {summary.glanceLine ? <p className="journey-summary-panel__intro">{summary.glanceLine}</p> : null}
      </div>

      {summary.directions.length > 0 ? (
        <div className="journey-summary-panel__section">
          <h3>Your Directions</h3>
          <ul className="journey-summary-panel__direction-list">
            {summary.directions.map((direction) => (
              <li key={direction.title}>
                <strong>{direction.title}</strong>
                {direction.savedLabels.length > 0 ? (
                  <span>{direction.savedLabels.join(' · ')}</span>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {summary.regions.length > 0 ? (
        <div className="journey-summary-panel__section">
          <h3>Regions</h3>
          <ul className="journey-summary-panel__chip-list">
            {summary.regions.map((region) => (
              <li key={region}>{region}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {summary.destinations.length > 0 ? (
        <div className="journey-summary-panel__section">
          <h3>Destinations</h3>
          <ul className="journey-summary-panel__chip-list">
            {summary.destinations.map((destination) => (
              <li key={destination}>{destination}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {summary.experiences.length > 0 ? (
        <div className="journey-summary-panel__section">
          <h3>Experiences</h3>
          <ul className="journey-summary-panel__chip-list">
            {summary.experiences.map((experience) => (
              <li key={experience}>{experience}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {summary.mood || summary.season ? (
        <div className="journey-summary-panel__section journey-summary-panel__section--inline">
          {summary.mood ? (
            <div>
              <h3>Travel rhythm</h3>
              <p>{summary.mood}</p>
            </div>
          ) : null}
          {summary.season ? (
            <div>
              <h3>Preferred season</h3>
              <p>{summary.season}</p>
            </div>
          ) : null}
        </div>
      ) : null}

      {rhythm ? (
        <div className="journey-summary-panel__section journey-summary-panel__section--rhythm">
          <h3>A possible rhythm</h3>
          <p className="journey-summary-panel__rhythm-label">Illustrative only</p>
          <p className="journey-summary-panel__rhythm-sequence">{rhythm.sequence.join(' → ')}</p>
          <p className="journey-summary-panel__rhythm-note">{ILLUSTRATIVE_DISCLAIMER}</p>
        </div>
      ) : null}

      <p className="journey-summary-panel__refine">
        <a href="/my-journey">Refine your journey</a>
      </p>
    </section>
  )
}
