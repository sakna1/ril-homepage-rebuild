import { useEffect, useRef, useState } from 'react'
import './SiteHeader.css'

const primaryNavLinks = [
  { href: '/discover-sri-lanka', label: 'Discover' },
  { href: '/expectations', label: 'Expectations' },
  { href: '/my-journey', label: 'My Journey' },
  { href: '/contact', label: 'Contact' },
] as const

const menuNavLinks = [
  { href: '/travel-preparation', label: 'Before You Arrive' },
  { href: '/journal', label: 'Journal' },
  { href: '/about', label: 'About' },
] as const

const navAliases: Record<string, string[]> = {
  '/expectations': ['/experiences'],
}

function normalizePath(path: string) {
  const normalizedPath = path.replace(/\/$/, '')
  return normalizedPath === '' ? '/' : normalizedPath
}

export function SiteHeader() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false)
  const moreMenuRef = useRef<HTMLDivElement>(null)
  const currentPath = normalizePath(window.location.pathname)

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileNavOpen(false)
        setIsMoreMenuOpen(false)
      }
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [])

  useEffect(() => {
    if (!isMoreMenuOpen) {
      return
    }

    const closeOnPointerDown = (event: MouseEvent) => {
      if (!moreMenuRef.current?.contains(event.target as Node)) {
        setIsMoreMenuOpen(false)
      }
    }

    window.addEventListener('mousedown', closeOnPointerDown)
    return () => window.removeEventListener('mousedown', closeOnPointerDown)
  }, [isMoreMenuOpen])

  const closeMenus = () => {
    setIsMobileNavOpen(false)
    setIsMoreMenuOpen(false)
  }

  const isActivePath = (href: string) => {
    const paths = [href, ...(navAliases[href] ?? [])]
    return paths.some((path) => currentPath === path || currentPath.startsWith(`${path}/`))
  }

  const isMoreMenuActive = menuNavLinks.some((link) => isActivePath(link.href))
  const isHomeActive = isActivePath('/')

  const renderNavLink = (link: { href: string; label: string }, className?: string) => {
    const isActive = isActivePath(link.href)

    return (
      <a
        key={link.href}
        className={[className, isActive ? 'is-active' : undefined].filter(Boolean).join(' ')}
        href={link.href}
        aria-current={isActive ? 'page' : undefined}
        onClick={closeMenus}
      >
        {link.label}
      </a>
    )
  }

  return (
    <header
      className={[
        'site-header',
        isMobileNavOpen ? 'is-mobile-nav-open' : undefined,
        isMoreMenuOpen ? 'is-more-menu-open' : undefined,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <a className="site-header-brand" href="/" onClick={closeMenus}>
        Royale Isles Lanka
      </a>

      <nav className="site-header-primary-nav" aria-label="Primary navigation">
        {primaryNavLinks.map((link) => renderNavLink(link))}
      </nav>

      <div className="site-header-actions">
        <a
          className={`site-header-home-button${isHomeActive ? ' is-active' : ''}`}
          href="/"
          aria-label="Home"
          aria-current={isHomeActive ? 'page' : undefined}
          onClick={closeMenus}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1h-5v-5.5H10V20H5a1 1 0 0 1-1-1v-8.5Z" />
          </svg>
        </a>

        <div className="site-header-more" ref={moreMenuRef}>
          <button
            className={`site-header-more-button${isMoreMenuActive ? ' is-active' : ''}`}
            type="button"
            aria-label={isMoreMenuOpen ? 'Close menu' : 'Open menu'}
            aria-controls="site-header-more-panel"
            aria-expanded={isMoreMenuOpen}
            onClick={() => {
              setIsMoreMenuOpen((current) => !current)
              setIsMobileNavOpen(false)
            }}
          >
            <span className="site-header-menu-icon" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
            <span className="site-header-more-label">Menu</span>
          </button>

          <div className="site-header-more-panel" id="site-header-more-panel" role="menu" aria-label="More pages">
            <p className="site-header-more-heading">More</p>
            {menuNavLinks.map((link) => renderNavLink(link, 'site-header-more-link'))}
          </div>
        </div>

        <a className="site-header-cta" href="/expectations" onClick={closeMenus}>
          Begin Journey
        </a>

        <button
          className="site-header-mobile-button"
          type="button"
          aria-label={isMobileNavOpen ? 'Close navigation' : 'Open navigation'}
          aria-controls="site-header-mobile-panel"
          aria-expanded={isMobileNavOpen}
          onClick={() => {
            setIsMobileNavOpen((current) => !current)
            setIsMoreMenuOpen(false)
          }}
        >
          <span className="site-header-menu-icon" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <span className="site-header-more-label">Menu</span>
        </button>
      </div>

      <div className="site-header-mobile-panel" id="site-header-mobile-panel">
        <nav className="site-header-mobile-section" aria-label="Primary navigation">
          <p className="site-header-mobile-heading">Explore</p>
          {primaryNavLinks.map((link) => renderNavLink(link, 'site-header-mobile-link'))}
        </nav>

        <nav className="site-header-mobile-section" aria-label="More pages">
          <p className="site-header-mobile-heading">More</p>
          {menuNavLinks.map((link) => renderNavLink(link, 'site-header-mobile-link'))}
        </nav>

        <a className="site-header-cta site-header-cta--mobile" href="/expectations" onClick={closeMenus}>
          Begin Journey
        </a>
      </div>
    </header>
  )
}
