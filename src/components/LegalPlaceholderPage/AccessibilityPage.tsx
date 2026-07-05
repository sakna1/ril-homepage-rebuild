import './LegalPlaceholderPage.css'

export function AccessibilityPage() {
  return (
    <main className="legal-page">
      <div className="legal-page__container">
        <p className="legal-page__eyebrow">Legal</p>
        <h1>Accessibility</h1>
        <p>
          Royale Isles Lanka is committed to making this site accessible to thoughtful travellers
          using a range of devices and assistive technologies.
        </p>
        <p>
          A fuller accessibility statement will be published ahead of the live consultation service.
          If you encounter a barrier while exploring the site, please reach out through the
          consultation page when it is connected.
        </p>
        <p>
          <a href="/consultation?from=footer">Return to consultation</a>
        </p>
      </div>
    </main>
  )
}
