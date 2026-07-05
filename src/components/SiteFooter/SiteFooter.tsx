import './SiteFooter.css'

const footerNav = {
  explore: [
    { href: '/discover-sri-lanka', label: 'Discover Sri Lanka' },
    { href: '/expectations', label: 'Expectations' },
    { href: '/travel-preparation', label: 'Before You Arrive' },
    { href: '/my-journey', label: 'My Journey' },
    { href: '/journal', label: 'Journal' },
    { href: '/about', label: 'About' },
  ] as const,
  connect: [
    { href: '/#begin', label: 'Begin a Conversation' },
    { href: '/discover-sri-lanka', label: 'Discovery Guide' },
    { href: '/contact', label: 'Contact' },
  ] as const,
  legal: [
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/accessibility', label: 'Accessibility' },
  ] as const,
} as const

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-brand">
          <span className="footer-logo">Royale Isles</span>
          <span className="footer-subbrand">Lanka</span>
          <p className="footer-tagline">
            A private discovery companion for those who travel not to see the world, but to understand
            it.
          </p>
          <div className="footer-est">
            <span className="footer-est-rule"></span>
            <span>Est. 2026</span>
          </div>
        </div>

        <div className="footer-column">
          <span className="footer-column-title">Explore</span>
          <ul className="footer-links">
            {footerNav.explore.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="footer-link">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-column">
          <span className="footer-column-title">Connect</span>
          <ul className="footer-links">
            {footerNav.connect.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="footer-link">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-column">
          <span className="footer-column-title">Legal</span>
          <ul className="footer-links">
            {footerNav.legal.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="footer-link">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <span>&copy; 2026 Royale Isles Lanka. All rights reserved.</span>
        <span className="footer-bottom-note">Crafted for those who travel thoughtfully.</span>
      </div>
    </footer>
  )
}
