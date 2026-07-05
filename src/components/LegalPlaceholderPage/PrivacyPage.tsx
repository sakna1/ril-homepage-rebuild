import './LegalPlaceholderPage.css'

export function PrivacyPage() {
  return (
    <main className="legal-page">
      <div className="legal-page__container">
        <p className="legal-page__eyebrow">Legal</p>
        <h1>Privacy Policy</h1>
        <p>
          A full privacy policy will be published before Royale Isles Lanka begins collecting live
          enquiries through this website.
        </p>
        <p>
          Until then, any details shared through the consultation form remain in your browser only
          and are not transmitted to our team.
        </p>
        <p>
          <a href="/consultation?from=footer">Return to consultation</a>
        </p>
      </div>
    </main>
  )
}
