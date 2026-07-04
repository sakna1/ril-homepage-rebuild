import { useCallback, useEffect, useState } from 'react'
import { ExploreIslandTab } from './ExploreIslandTab'
import { GuidedDiscoveryTab } from './GuidedDiscoveryTab'
import { JourneyTabs } from './JourneyTabs'
import { SavedJourneyTab } from './SavedJourneyTab'
import { readJourneyView, setJourneyView, type JourneyView } from './journeyView'
import './MyJourneyPage.css'

type MyJourneyPageProps = {
  defaultView?: JourneyView
}

export function MyJourneyPage({ defaultView = 'explore' }: MyJourneyPageProps) {
  const [activeView, setActiveView] = useState<JourneyView>(() => readJourneyView(defaultView))

  useEffect(() => {
    if (defaultView !== 'explore' && !window.location.search.includes('view=')) {
      setJourneyView(defaultView)
      setActiveView(defaultView)
    }
  }, [defaultView])

  useEffect(() => {
    const handlePopState = () => setActiveView(readJourneyView(defaultView))
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [defaultView])

  const handleViewChange = useCallback((view: JourneyView) => {
    setActiveView(view)
    setJourneyView(view, { directionId: null })
  }, [])

  return (
    <main className="my-journey-unified-page">
      <section className="my-journey-unified-page__intro">
        <div className="my-journey-unified-page__container">
          <h1>My Journey</h1>
          <p>
            Explore the island, follow what draws you, and begin shaping a journey of your own.
          </p>
        </div>
      </section>

      <div className="my-journey-unified-page__container">
        <JourneyTabs activeView={activeView} onViewChange={handleViewChange} />
      </div>

      <div className="my-journey-unified-page__content">
        {activeView === 'explore' ? <ExploreIslandTab /> : null}
        {activeView === 'guided' ? <GuidedDiscoveryTab /> : null}
        {activeView === 'journey' ? <SavedJourneyTab /> : null}
      </div>
    </main>
  )
}
