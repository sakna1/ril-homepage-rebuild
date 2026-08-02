import type { ReactNode } from 'react'
import { AboutPage } from './components/AboutPage/AboutPage'
import { CheckoutPage } from './pages/CheckoutPage/CheckoutPage'
import { ContactPage } from './components/ContactPage/ContactPage'
// Discover temporarily hidden — restore this import with the route below.
// import { DiscoveryGuide } from './components/DiscoveryGuide/DiscoveryGuide'
import { ExperienceDetailPage } from './components/ExperienceDetailPage/ExperienceDetailPage'
import { ExpectationsPage } from './components/ExperiencesPage/ExperiencesPage'
import { Homepage } from './components/Homepage/Homepage'
import { ItinerariesPage } from './components/ItinerariesPage/ItinerariesPage'
import { JournalArticlePage } from './components/JournalArticlePage/JournalArticlePage'
import { JournalLandingPage } from './components/JournalLandingPage/JournalLandingPage'
import { AdminLoginPage } from './components/LoginPage/AdminLoginPage'
import { LoginChooserPage } from './components/LoginPage/LoginChooserPage'
import { TravellerLoginPage } from './components/LoginPage/TravellerLoginPage'
import { ResetPasswordPage } from './components/LoginPage/ResetPasswordPage'
import { PageLayout } from './components/PageLayout/PageLayout'
import { TravelPreparationPage } from './components/TravelPreparationPage/TravelPreparationPage'
import { MyJourneyPage } from './pages/MyJourneyPage/MyJourneyPage'
import { TravellerDashboardPage } from './pages/TravellerDashboardPage/TravellerDashboardPage'
import { AdminDashboardPage } from './pages/AdminDashboardPage/AdminDashboardPage'
import { JourneyProvider } from './journey/JourneyContext'
import { TravellerAuthProvider } from './traveller/TravellerAuthContext'
import { AdminAuthProvider } from './admin/AdminAuthContext'

function AppContent() {
  const rawPath = window.location.pathname.replace(/\/$/, '')
  const path = rawPath === '' ? '/' : rawPath

  const renderPage = (page: ReactNode) => <PageLayout>{page}</PageLayout>

  if (path === '/') {
    return renderPage(<Homepage />)
  }

  // The concierge is now an in-page popup (see ConciergeChat), so the old
  // standalone desk route redirects home.
  if (path === '/concierge') {
    if (typeof window !== 'undefined' && window.location.pathname !== '/') {
      window.location.replace('/')
    }
    return renderPage(<Homepage />)
  }

  // Discover temporarily hidden. Redirect any lingering links to the homepage.
  // To bring it back, restore the DiscoveryGuide render below.
  if (path === '/discover-sri-lanka') {
    if (typeof window !== 'undefined' && window.location.pathname !== '/') {
      window.location.replace('/')
      return null
    }
    return renderPage(<Homepage />)
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

  if (path === '/reset-password') {
    return renderPage(<ResetPasswordPage />)
  }

  if (path === '/traveller' || path === '/traveller-portal') {
    return renderPage(<TravellerDashboardPage />)
  }

  if (path === '/admin') {
    return renderPage(<AdminDashboardPage />)
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
    <AdminAuthProvider>
      <TravellerAuthProvider>
        <JourneyProvider>
          <AppContent />
        </JourneyProvider>
      </TravellerAuthProvider>
    </AdminAuthProvider>
  )
}

export default App
