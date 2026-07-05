import { useMemo } from 'react'
import { buildConsultationJourneySummary } from '../../consultation/buildConsultationSummary'
import { readConsultationSource } from '../../consultation/readConsultationSource'
import { useJourney } from '../../journey/useJourney'
import { ConsultationForm } from './ConsultationForm'
import { JourneySummaryPanel } from './JourneySummaryPanel'
import './ConsultationPage.css'

export function ConsultationPage() {
  const { items } = useJourney()
  const source = readConsultationSource()
  const journeySummary = useMemo(() => buildConsultationJourneySummary(items), [items])
  const seasonPrefill = journeySummary.season

  return (
    <main className="consultation-page">
      <div className="consultation-page__container">
        <header className="consultation-page__hero">
          <p className="consultation-page__eyebrow">Private Consultation</p>
          <h1>Request a Private Consultation</h1>
          <p className="consultation-page__lede">
            A considered conversation, shaped around how you would like to experience Sri Lanka.
          </p>
        </header>

        {journeySummary.hasMeaningfulContext ? (
          <JourneySummaryPanel summary={journeySummary} items={items} />
        ) : null}

        <ConsultationForm
          source={source}
          journeyItems={items}
          journeySummary={journeySummary}
          seasonPrefill={seasonPrefill}
        />
      </div>
    </main>
  )
}
