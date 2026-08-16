import { useEffect, type ReactNode } from 'react'
import { FloatingWhatsAppButton } from '../FloatingWhatsAppButton/FloatingWhatsAppButton'
import { SiteFooter } from '../SiteFooter/SiteFooter'
import { SiteHeader } from '../SiteHeader/SiteHeader'
// Journey chrome hidden along with My Journey — restore this import and the
// <JourneyHelperMessage /> below to bring it back.
// import { JourneyHelperMessage } from '../../journey/JourneyChrome'
import './PageLayout.css'

/**
 * Cross-page links carrying a fragment (`/about#office-network`) land on a
 * document the browser has already given up scrolling: the target only exists
 * once React has rendered. This re-runs the jump after mount, once the layout
 * has settled. `scroll-margin-top` on the target keeps it clear of the fixed
 * header — see `[id]` in PageLayout.css.
 */
function useHashScroll() {
  useEffect(() => {
    const { hash } = window.location
    if (!hash || hash === '#') return

    let frame = 0
    const jump = () => {
      let target: Element | null = null
      try {
        target = document.querySelector(hash)
      } catch {
        // A fragment that is not a valid selector — nothing to scroll to.
        return
      }
      if (target) target.scrollIntoView({ block: 'start' })
    }

    // Two frames: the first lets React paint, the second lets fonts and the
    // grid settle so the measured offset is the final one.
    frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(jump)
    })

    return () => cancelAnimationFrame(frame)
  }, [])
}

export function PageLayout({ children }: { children: ReactNode }) {
  useHashScroll()

  return (
    <>
      <SiteHeader />
      <div className="page-layout-content">{children}</div>
      <SiteFooter />
      <FloatingWhatsAppButton />
    </>
  )
}
