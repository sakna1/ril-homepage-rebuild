import { useEffect, useMemo, useState } from 'react'
import { useTravellerAuth } from '../../traveller/useTravellerAuth'
import type {
  TravellerItinerary,
  TravellerItineraryStop,
  TravellerProfile,
} from '../../traveller/travellerAuthApi'
import './TravellerDashboardPage.css'

type Tab = 'overview' | 'journeys' | 'contact'

const CONCIERGE = {
  email: 'royaleisleslanka@gmail.com',
  phoneLabel: '+94 71 168 0902',
  whatsapp: '94711680902',
}

const PROFILE_FIELDS: { key: keyof TravellerProfile; label: string; type?: string }[] = [
  { key: 'fullName', label: 'Full Name & Title' },
  { key: 'email', label: 'Email', type: 'email' },
  { key: 'phone', label: 'Phone' },
  { key: 'nationality', label: 'Nationality' },
  { key: 'passportNumber', label: 'Passport Number' },
  { key: 'passportExpiry', label: 'Passport Expiry', type: 'date' },
  { key: 'travelStyle', label: 'Travel Style' },
  { key: 'dietaryPreferences', label: 'Dietary Preferences' },
  { key: 'emergencyContactName', label: 'Emergency Contact' },
  { key: 'emergencyContactPhone', label: 'Emergency Phone' },
]

function firstName(fullName: string): string {
  const cleaned = (fullName ?? '').trim()
  if (!cleaned) return 'traveller'
  const withoutTitle = cleaned.replace(/^(mr|mrs|ms|dr|lord|lady|sir)\.?\s+/i, '')
  return withoutTitle.split(/\s+/)[0] || cleaned
}

function formatDate(value: string | null): string {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

function isPast(itinerary: TravellerItinerary): boolean {
  if (!itinerary.endDate) return false
  const end = new Date(itinerary.endDate)
  if (Number.isNaN(end.getTime())) return false
  return end.getTime() < new Date().setHours(0, 0, 0, 0)
}

function uid(): string {
  const globalCrypto = typeof crypto !== 'undefined' ? crypto : undefined
  if (globalCrypto?.randomUUID) return globalCrypto.randomUUID()
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function TravellerDashboardPage() {
  const { isAuthenticated, traveller, isLoading, error, logout, reload } = useTravellerAuth()
  const [tab, setTab] = useState<Tab>('overview')

  useEffect(() => {
    if (!isAuthenticated) window.location.href = '/login/traveller'
  }, [isAuthenticated])

  if (!isAuthenticated) return null

  if (!traveller) {
    return (
      <main className="tvd">
        <div className="tvd-loading">
          {error ? (
            <>
              <p className="tvd-loading__error">{error}</p>
              <div className="tvd-loading__actions">
                <button type="button" className="tvd-btn" onClick={reload}>
                  Try again
                </button>
                <button type="button" className="tvd-btn tvd-btn--ghost" onClick={logout}>
                  Sign out
                </button>
              </div>
            </>
          ) : (
            <p className="tvd-loading__text">{isLoading ? 'Preparing your portal…' : 'Loading…'}</p>
          )}
        </div>
      </main>
    )
  }

  return (
    <main className="tvd">
      <header className="tvd-hero">
        <div className="tvd-hero__inner">
          <div>
            <p className="tvd-eyebrow">Traveller Portal</p>
            <h1>
              Welcome back, <em>{firstName(traveller.fullName)}.</em>
            </h1>
            <p className="tvd-hero__lead">
              Your personal details, journeys, and concierge — held privately in one place.
            </p>
          </div>
          <button type="button" className="tvd-signout" onClick={logout}>
            Sign out
          </button>
        </div>
      </header>

      <nav className="tvd-tabs" aria-label="Portal sections">
        {(
          [
            ['overview', 'Personal Details'],
            ['journeys', 'My Journeys'],
            ['contact', 'Contact'],
          ] as [Tab, string][]
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            className={`tvd-tab${tab === key ? ' is-active' : ''}`}
            onClick={() => setTab(key)}
          >
            {label}
          </button>
        ))}
      </nav>

      <div className="tvd-tabbody">
        {tab === 'overview' ? <OverviewTab /> : null}
        {tab === 'journeys' ? <JourneysTab /> : null}
        {tab === 'contact' ? <ContactTab name={traveller.fullName} /> : null}
      </div>
    </main>
  )
}

/* ---------------- Overview (personal details) ---------------- */

function OverviewTab() {
  const { traveller, saveProfile } = useTravellerAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState<TravellerProfile | null>(null)
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  if (!traveller) return null

  function startEditing() {
    setDraft({ ...(traveller as TravellerProfile) })
    setError('')
    setIsEditing(true)
  }

  async function handleSave() {
    if (!draft) return
    setIsSaving(true)
    setError('')
    try {
      await saveProfile(draft)
      setIsEditing(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save your details.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <section className="tvd-section" aria-labelledby="tvd-profile-head">
      <div className="tvd-section__head">
        <h2 id="tvd-profile-head">Personal Details</h2>
        {!isEditing ? (
          <button type="button" className="tvd-textlink" onClick={startEditing}>
            Edit
          </button>
        ) : null}
      </div>

      {!isEditing ? (
        <dl className="tvd-detail-list tvd-detail-list--wide">
          {PROFILE_FIELDS.map((field) => {
            const raw = traveller[field.key]
            const value =
              field.type === 'date'
                ? formatDate((raw as string | null) ?? null)
                : (raw as string) || '—'
            return (
              <div key={field.key}>
                <dt>{field.label}</dt>
                <dd>{value}</dd>
              </div>
            )
          })}
        </dl>
      ) : (
        <form
          className="tvd-edit tvd-edit--grid"
          onSubmit={(event) => {
            event.preventDefault()
            void handleSave()
          }}
        >
          {error ? (
            <p className="tvd-form-error" role="alert">
              {error}
            </p>
          ) : null}

          {PROFILE_FIELDS.map((field) => (
            <label key={field.key} className="tvd-edit__field">
              <span>{field.label}</span>
              <input
                type={field.type ?? 'text'}
                value={(draft?.[field.key] as string | null) ?? ''}
                onChange={(event) =>
                  setDraft((current) =>
                    current ? { ...current, [field.key]: event.target.value } : current,
                  )
                }
              />
            </label>
          ))}

          <div className="tvd-edit__actions">
            <button type="submit" className="tvd-btn" disabled={isSaving}>
              {isSaving ? 'Saving…' : 'Save changes'}
            </button>
            <button
              type="button"
              className="tvd-btn tvd-btn--ghost"
              onClick={() => {
                setIsEditing(false)
                setError('')
              }}
              disabled={isSaving}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </section>
  )
}

/* ---------------- Journeys (selected + history + edit) ---------------- */

function JourneysTab() {
  const { itineraries, saveItineraries } = useTravellerAuth()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const { upcoming, history } = useMemo(() => {
    const up: TravellerItinerary[] = []
    const past: TravellerItinerary[] = []
    itineraries.forEach((itinerary) => (isPast(itinerary) ? past : up).push(itinerary))
    return { upcoming: up, history: past }
  }, [itineraries])

  async function commit(next: TravellerItinerary[]) {
    setIsSaving(true)
    setError('')
    try {
      await saveItineraries(next)
      setEditingId(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save your journeys.')
    } finally {
      setIsSaving(false)
    }
  }

  function handleSaveOne(updated: TravellerItinerary) {
    const exists = itineraries.some((itinerary) => itinerary.id === updated.id)
    const next = exists
      ? itineraries.map((itinerary) => (itinerary.id === updated.id ? updated : itinerary))
      : [...itineraries, updated]
    void commit(next)
  }

  function handleDelete(id: string) {
    if (!window.confirm('Remove this journey?')) return
    void commit(itineraries.filter((itinerary) => itinerary.id !== id))
  }

  function handleAdd() {
    const draft: TravellerItinerary = {
      id: uid(),
      title: '',
      destination: '',
      startDate: '',
      endDate: '',
      coverImage: null,
      stops: [],
    }
    setEditingId(draft.id)
    // Add to the list immediately in edit mode so the editor renders under Upcoming.
    void saveItineraries([...itineraries, draft]).catch(() => setEditingId(null))
  }

  const editing = itineraries.find((itinerary) => itinerary.id === editingId) ?? null

  return (
    <section className="tvd-section" aria-labelledby="tvd-journeys-head">
      <div className="tvd-section__head">
        <h2 id="tvd-journeys-head">My Journeys</h2>
        <button type="button" className="tvd-btn" onClick={handleAdd} disabled={isSaving}>
          + Add a journey
        </button>
      </div>

      {error ? (
        <p className="tvd-form-error" role="alert">
          {error}
        </p>
      ) : null}

      {editing ? (
        <ItineraryEditor
          key={editing.id}
          itinerary={editing}
          isSaving={isSaving}
          onSave={handleSaveOne}
          onCancel={() => setEditingId(null)}
        />
      ) : null}

      {itineraries.length === 0 ? (
        <div className="tvd-empty">
          <p>No journeys saved yet.</p>
          <a className="tvd-btn" href="/expectations">
            Begin shaping a journey
          </a>
        </div>
      ) : null}

      {upcoming.length > 0 ? (
        <>
          <h3 className="tvd-subhead">Selected &amp; Upcoming</h3>
          <div className="tvd-journeys">
            {upcoming.map((itinerary) => (
              <JourneyCard
                key={itinerary.id}
                itinerary={itinerary}
                onEdit={() => setEditingId(itinerary.id)}
                onDelete={() => handleDelete(itinerary.id)}
              />
            ))}
          </div>
        </>
      ) : null}

      {history.length > 0 ? (
        <>
          <h3 className="tvd-subhead">Journey History</h3>
          <div className="tvd-journeys">
            {history.map((itinerary) => (
              <JourneyCard
                key={itinerary.id}
                itinerary={itinerary}
                isHistory
                onEdit={() => setEditingId(itinerary.id)}
                onDelete={() => handleDelete(itinerary.id)}
              />
            ))}
          </div>
        </>
      ) : null}
    </section>
  )
}

function JourneyCard({
  itinerary,
  isHistory,
  onEdit,
  onDelete,
}: {
  itinerary: TravellerItinerary
  isHistory?: boolean
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <article className={`tvd-journey${isHistory ? ' is-history' : ''}`}>
      {itinerary.coverImage ? (
        <figure className="tvd-journey__media">
          <img src={itinerary.coverImage} alt={itinerary.title} loading="lazy" />
        </figure>
      ) : null}
      <div className="tvd-journey__body">
        <div className="tvd-journey__topline">
          <p className="tvd-journey__dest">{itinerary.destination || 'Destination pending'}</p>
          {isHistory ? <span className="tvd-tag">Past</span> : null}
        </div>
        <h4>{itinerary.title || 'Untitled journey'}</h4>
        <p className="tvd-journey__dates">
          {formatDate(itinerary.startDate)} — {formatDate(itinerary.endDate)}
        </p>

        {itinerary.stops.length > 0 ? (
          <ol className="tvd-stops">
            {itinerary.stops.map((stop) => (
              <li key={stop.id}>
                <span className="tvd-stops__time">{stop.time || '—'}</span>
                <div>
                  <p className="tvd-stops__activity">{stop.activity}</p>
                  {stop.location ? <p className="tvd-stops__location">{stop.location}</p> : null}
                  {stop.notes ? <p className="tvd-stops__notes">{stop.notes}</p> : null}
                </div>
              </li>
            ))}
          </ol>
        ) : null}

        <div className="tvd-journey__actions">
          <button type="button" className="tvd-textlink" onClick={onEdit}>
            Edit
          </button>
          <button type="button" className="tvd-textlink tvd-textlink--danger" onClick={onDelete}>
            Remove
          </button>
        </div>
      </div>
    </article>
  )
}

function ItineraryEditor({
  itinerary,
  isSaving,
  onSave,
  onCancel,
}: {
  itinerary: TravellerItinerary
  isSaving: boolean
  onSave: (itinerary: TravellerItinerary) => void
  onCancel: () => void
}) {
  const [draft, setDraft] = useState<TravellerItinerary>(() => ({
    ...itinerary,
    stops: itinerary.stops.map((stop) => ({ ...stop })),
  }))

  function updateStop(id: string, patch: Partial<TravellerItineraryStop>) {
    setDraft((current) => ({
      ...current,
      stops: current.stops.map((stop) => (stop.id === id ? { ...stop, ...patch } : stop)),
    }))
  }

  function addStop() {
    setDraft((current) => ({
      ...current,
      stops: [...current.stops, { id: uid(), time: '', activity: '', location: '', notes: null }],
    }))
  }

  function removeStop(id: string) {
    setDraft((current) => ({ ...current, stops: current.stops.filter((stop) => stop.id !== id) }))
  }

  return (
    <form
      className="tvd-itinerary-editor"
      onSubmit={(event) => {
        event.preventDefault()
        onSave(draft)
      }}
    >
      <h3 className="tvd-subhead">Edit journey</h3>
      <div className="tvd-edit--grid">
        <label className="tvd-edit__field">
          <span>Title</span>
          <input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
        </label>
        <label className="tvd-edit__field">
          <span>Destination</span>
          <input value={draft.destination} onChange={(e) => setDraft({ ...draft, destination: e.target.value })} />
        </label>
        <label className="tvd-edit__field">
          <span>Start date</span>
          <input type="date" value={draft.startDate} onChange={(e) => setDraft({ ...draft, startDate: e.target.value })} />
        </label>
        <label className="tvd-edit__field">
          <span>End date</span>
          <input type="date" value={draft.endDate} onChange={(e) => setDraft({ ...draft, endDate: e.target.value })} />
        </label>
      </div>

      <div className="tvd-stops-editor">
        <div className="tvd-stops-editor__head">
          <span>Stops</span>
          <button type="button" className="tvd-textlink" onClick={addStop}>
            + Add stop
          </button>
        </div>
        {draft.stops.length === 0 ? <p className="tvd-muted">No stops yet.</p> : null}
        {draft.stops.map((stop) => (
          <div key={stop.id} className="tvd-stop-row">
            <input
              className="tvd-stop-time"
              placeholder="09:00"
              value={stop.time}
              onChange={(e) => updateStop(stop.id, { time: e.target.value })}
            />
            <div className="tvd-stop-fields">
              <input
                placeholder="Activity"
                value={stop.activity}
                onChange={(e) => updateStop(stop.id, { activity: e.target.value })}
              />
              <input
                placeholder="Location"
                value={stop.location}
                onChange={(e) => updateStop(stop.id, { location: e.target.value })}
              />
              <input
                placeholder="Notes (optional)"
                value={stop.notes ?? ''}
                onChange={(e) => updateStop(stop.id, { notes: e.target.value || null })}
              />
            </div>
            <button
              type="button"
              className="tvd-stop-remove"
              aria-label="Remove stop"
              onClick={() => removeStop(stop.id)}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <div className="tvd-edit__actions">
        <button type="submit" className="tvd-btn" disabled={isSaving}>
          {isSaving ? 'Saving…' : 'Save journey'}
        </button>
        <button type="button" className="tvd-btn tvd-btn--ghost" onClick={onCancel} disabled={isSaving}>
          Cancel
        </button>
      </div>
    </form>
  )
}

/* ---------------- Contact ---------------- */

function ContactTab({ name }: { name: string }) {
  const mailto = `mailto:${CONCIERGE.email}?subject=${encodeURIComponent('Traveller enquiry')}&body=${encodeURIComponent(`Hello Royale Isles Lanka,\n\n(${name})\n`)}`
  const whatsapp = `https://wa.me/${CONCIERGE.whatsapp}?text=${encodeURIComponent('Hello Royale Isles Lanka, I would like to speak with my concierge.')}`

  return (
    <section className="tvd-section" aria-labelledby="tvd-contact-head">
      <div className="tvd-section__head">
        <h2 id="tvd-contact-head">Contact Your Concierge</h2>
      </div>

      <p className="tvd-contact-lead">
        Your private office is on hand for anything at all — changes to a journey, timing, special
        requests, or simply a question. Reach us whichever way suits you.
      </p>

      <div className="tvd-contact-grid">
        <a className="tvd-contact-card" href={mailto}>
          <span className="tvd-contact-card__label">Email</span>
          <strong>{CONCIERGE.email}</strong>
          <span className="tvd-contact-card__action">Write to us →</span>
        </a>
        <a className="tvd-contact-card" href={whatsapp} target="_blank" rel="noreferrer">
          <span className="tvd-contact-card__label">WhatsApp</span>
          <strong>{CONCIERGE.phoneLabel}</strong>
          <span className="tvd-contact-card__action">Message on WhatsApp →</span>
        </a>
        <a className="tvd-contact-card" href={`tel:+${CONCIERGE.whatsapp}`}>
          <span className="tvd-contact-card__label">Telephone</span>
          <strong>{CONCIERGE.phoneLabel}</strong>
          <span className="tvd-contact-card__action">Call the office →</span>
        </a>
      </div>

      <p className="tvd-contact-note">
        Prefer the full enquiry form? Visit our <a href="/contact">contact page</a>.
      </p>
    </section>
  )
}
