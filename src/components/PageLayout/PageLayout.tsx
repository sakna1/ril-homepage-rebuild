import type { ReactNode } from 'react'
import { FloatingWhatsAppButton } from '../FloatingWhatsAppButton/FloatingWhatsAppButton'
import { SiteFooter } from '../SiteFooter/SiteFooter'
import { SiteHeader } from '../SiteHeader/SiteHeader'
// Journey chrome hidden along with My Journey — restore this import and the
// <JourneyHelperMessage /> below to bring it back.
// import { JourneyHelperMessage } from '../../journey/JourneyChrome'
import './PageLayout.css'

export function PageLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      <div className="page-layout-content">{children}</div>
      <SiteFooter />
      <FloatingWhatsAppButton />
    </>
  )
}
