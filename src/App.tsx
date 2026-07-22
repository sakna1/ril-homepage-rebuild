import type { ReactNode } from 'react'
import { AboutPage } from './components/AboutPage/AboutPage'
import { CheckoutPage } from './pages/CheckoutPage/CheckoutPage'
import { ContactPage } from './components/ContactPage/ContactPage'
import { ConciergeDesk } from './components/ConciergeDesk/ConciergeDesk'
import { DiscoveryGuide } from './components/DiscoveryGuide/DiscoveryGuide'
import { ExperienceDetailPage } from './components/ExperienceDetailPage/ExperienceDetailPage'
import { ExpectationsPage } from './components/ExperiencesPage/ExperiencesPage'
import { Homepage } from './components/Homepage/Homepage'
import { ItinerariesPage } from './components/ItinerariesPage/ItinerariesPage'
import { JournalArticlePage } from './components/JournalArticlePage/JournalArticlePage'
import { JournalLandingPage } from './components/JournalLandingPage/JournalLandingPage'
import { AdminLoginPage } from './components/LoginPage/AdminLoginPage'
import { LoginChooserPage } from './components/LoginPage/LoginChooserPage'
import { TravellerLoginPage } from './components/LoginPage/TravellerLoginPage'
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

  if (path === '/itineraries' || path === '/packages') {
    return renderPage(<ItinerariesPage />)
  }

  if (path === '/journal') {
    return renderPage(<JournalLandingPage />)
  }

  if (path === '/journal/the-sigiriya-dawn-ascent') {
    return renderPage(<JournalArticlePage />)
  }

  if (path === '/login') {
    return renderPage(<LoginChooserPage />)
  }

  if (path === '/login/traveller') {
    return renderPage(<TravellerLoginPage />)
  }

  if (path === '/login/admin') {
    return renderPage(<AdminLoginPage />)
  }

  if (path === '/about') {
    return renderPage(<AboutPage />)
  }

  if (path === '/contact') {
    return renderPage(<ContactPage />)
  }

  if (path === '/travel-preparation') {
    return renderPage(<TravelPreparationPage />)
  }

  if (path === '/travel-planner' || path === '/my-journey') {
    return renderPage(<MyJourneyPage />)
  }

  if (path === '/checkout') {
    return renderPage(<CheckoutPage />)
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
