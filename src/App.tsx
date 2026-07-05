import type { ReactNode } from 'react'
import { AboutPage } from './components/AboutPage/AboutPage'
import { ConciergeDesk } from './components/ConciergeDesk/ConciergeDesk'
import { DiscoveryGuide } from './components/DiscoveryGuide/DiscoveryGuide'
import { ExperienceDetailPage } from './components/ExperienceDetailPage/ExperienceDetailPage'
import { ExpectationsPage } from './components/ExperiencesPage/ExperiencesPage'
import { Homepage } from './components/Homepage/Homepage'
import { JournalArticlePage } from './components/JournalArticlePage/JournalArticlePage'
import { JournalLandingPage } from './components/JournalLandingPage/JournalLandingPage'
import { PageLayout } from './components/PageLayout/PageLayout'
import { TravelPreparationPage } from './components/TravelPreparationPage/TravelPreparationPage'
import { MyJourneyPage } from './pages/MyJourneyPage/MyJourneyPage'
import { JourneyProvider } from './journey/JourneyContext'

function AppContent() {
  const rawPath = window.location.pathname.replace(/\/$/, '')
  const path = rawPath === '' ? '/' : rawPath

  const renderPage = (page: ReactNode) => <PageLayout>{page}</PageLayout>

  if (path === '/') {
    return renderPage(<Homepage />)
  }

  if (path === '/concierge') {
    return <ConciergeDesk />
  }

  if (path === '/discover-sri-lanka') {
    return renderPage(<DiscoveryGuide />)
  }

  if (path === '/expectations' || path === '/experiences') {
    return renderPage(<ExpectationsPage />)
  }

  if (path === '/expectations/the-sigiriya-dawn-ascent' || path === '/experiences/the-sigiriya-dawn-ascent') {
    return renderPage(<ExperienceDetailPage />)
  }

  if (path === '/journal') {
    return renderPage(<JournalLandingPage />)
  }

  if (path === '/journal/the-sigiriya-dawn-ascent') {
    return renderPage(<JournalArticlePage />)
  }

  if (path === '/about') {
    return renderPage(<AboutPage />)
  }

  if (path === '/travel-preparation') {
    return renderPage(<TravelPreparationPage />)
  }

  if (path === '/travel-planner') {
    return renderPage(<MyJourneyPage defaultView="explore" />)
  }

  if (path === '/my-journey') {
    return renderPage(<MyJourneyPage />)
  }

  return renderPage(<Homepage />)
}

function App() {
  return (
    <JourneyProvider>
      <AppContent />
    </JourneyProvider>
  )
}

export default App
