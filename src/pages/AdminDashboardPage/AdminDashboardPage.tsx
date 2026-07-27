import { useCallback, useEffect, useState } from 'react'
import { useAdminAuth } from '../../admin/useAdminAuth'
import {
  createPackage,
  createPlace,
  createTheme,
  deletePackage,
  deletePlace,
  deleteTheme,
  fetchReports,
  listPackages,
  listPlaces,
  listThemes,
  travellersCsvUrl,
  updatePackage,
  updatePlace,
  updateTheme,
  type Package,
  type Place,
  type ReportsOverview,
  type Theme,
} from '../../admin/adminApi'
import './AdminDashboardPage.css'

type Tab = 'reports' | 'packages' | 'themes' | 'places'

const lines = (value: string) =>
  value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

export function AdminDashboardPage() {
  const { isAuthenticated, admin, logout } = useAdminAuth()
  const [tab, setTab] = useState<Tab>('reports')

  useEffect(() => {
    if (!isAuthenticated) window.location.href = '/login/admin'
  }, [isAuthenticated])

  if (!isAuthenticated) return null

  return (
    <main className="adm">
      <header className="adm-top">
        <div>
          <p className="adm-eyebrow">Private Office</p>
          <h1>Admin Console</h1>
        </div>
        <div className="adm-top__right">
          {admin ? <span className="adm-who">{admin.email}</span> : null}
          <button type="button" className="adm-signout" onClick={logout}>
            Sign out
          </button>
        </div>
      </header>

      <nav className="adm-tabs" aria-label="Admin sections">
        {(['reports', 'packages', 'themes', 'places'] as Tab[]).map((key) => (
          <button
            key={key}
            type="button"
            className={`adm-tab${tab === key ? ' is-active' : ''}`}
            onClick={() => setTab(key)}
          >
            {key === 'reports' ? 'Reports' : key === 'packages' ? 'Packages' : key === 'themes' ? 'Themes' : 'Places'}
          </button>
        ))}
      </nav>

      <div className="adm-body">
        {tab === 'reports' ? <ReportsPanel /> : null}
        {tab === 'packages' ? <PackagesPanel /> : null}
        {tab === 'themes' ? <ThemesPanel /> : null}
        {tab === 'places' ? <PlacesPanel /> : null}
      </div>
    </main>
  )
}

/* ---------------- Reports ---------------- */

function ReportsPanel() {
  const [data, setData] = useState<ReportsOverview | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchReports()
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : 'Could not load reports.'))
  }, [])

  if (error) return <p className="adm-error">{error}</p>
  if (!data) return <p className="adm-muted">Loading reports…</p>

  const stats = [
    ['Travellers', data.travellers],
    ['Itineraries', data.itineraries],
    ['Themes', data.themes],
    ['Places', data.places],
    ['Packages', data.packages],
    ['Google sign-ins', data.googleTravellers],
    ['Email sign-ins', data.emailTravellers],
  ] as const

  return (
    <section className="adm-section">
      <div className="adm-section__head">
        <h2>Overview</h2>
        <a className="adm-btn" href={travellersCsvUrl()} download>
          Export travellers CSV
        </a>
      </div>

      <div className="adm-stat-grid">
        {stats.map(([label, value]) => (
          <div key={label} className="adm-stat">
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>

      <div className="adm-report-cols">
        <div>
          <h3>Recent travellers</h3>
          {data.recentTravellers.length === 0 ? (
            <p className="adm-muted">None yet.</p>
          ) : (
            <ul className="adm-list">
              {data.recentTravellers.map((t) => (
                <li key={t.email}>
                  <span>{t.fullName || t.email}</span>
                  <em>{t.provider}</em>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <h3>Places per theme</h3>
          <ul className="adm-list">
            {data.placesPerTheme.map((row) => (
              <li key={row.theme}>
                <span>{row.theme}</span>
                <em>{row.places}</em>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

/* ---------------- shared crud helpers ---------------- */

function useCrud<T extends { id: number }>(load: () => Promise<T[]>) {
  const [items, setItems] = useState<T[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(() => {
    setLoading(true)
    load()
      .then((data) => {
        setItems(data)
        setError('')
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Could not load.'))
      .finally(() => setLoading(false))
  }, [load])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { items, error, loading, refresh, setError }
}

/* ---------------- Packages ---------------- */

const emptyPackage: Omit<Package, 'id'> = {
  name: '',
  numeral: '',
  duration: '',
  character: '',
  route: [],
  inclusions: [],
  pace: '',
  bestFor: '',
  reach: '',
  imageUrl: null,
  priceFrom: null,
  sortOrder: 0,
}

function PackagesPanel() {
  const { items, error, loading, refresh, setError } = useCrud<Package>(listPackages)
  const [draft, setDraft] = useState<Omit<Package, 'id'> | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)

  function startAdd() {
    setDraft({ ...emptyPackage })
    setEditingId(null)
  }
  function startEdit(pkg: Package) {
    const { id, ...rest } = pkg
    void id
    setDraft(rest)
    setEditingId(pkg.id)
  }

  async function save() {
    if (!draft) return
    setSaving(true)
    setError('')
    try {
      if (editingId) await updatePackage(editingId, draft)
      else await createPackage(draft)
      setDraft(null)
      setEditingId(null)
      refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save.')
    } finally {
      setSaving(false)
    }
  }

  async function remove(id: number) {
    if (!window.confirm('Delete this package?')) return
    await deletePackage(id)
    refresh()
  }

  return (
    <section className="adm-section">
      <div className="adm-section__head">
        <h2>Packages</h2>
        <button type="button" className="adm-btn" onClick={startAdd}>
          + Add package
        </button>
      </div>
      {error ? <p className="adm-error">{error}</p> : null}

      {draft ? (
        <div className="adm-form">
          <div className="adm-form-grid">
            <label>Name<input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></label>
            <label>Numeral<input value={draft.numeral} onChange={(e) => setDraft({ ...draft, numeral: e.target.value })} /></label>
            <label>Duration<input value={draft.duration} onChange={(e) => setDraft({ ...draft, duration: e.target.value })} /></label>
            <label>Pace<input value={draft.pace} onChange={(e) => setDraft({ ...draft, pace: e.target.value })} /></label>
            <label>Best for<input value={draft.bestFor} onChange={(e) => setDraft({ ...draft, bestFor: e.target.value })} /></label>
            <label>Reach<input value={draft.reach} onChange={(e) => setDraft({ ...draft, reach: e.target.value })} /></label>
            <label>Price from (USD, blank = hidden)<input value={draft.priceFrom ?? ''} onChange={(e) => setDraft({ ...draft, priceFrom: e.target.value ? Number(e.target.value) : null })} /></label>
            <label>Sort order<input value={draft.sortOrder} onChange={(e) => setDraft({ ...draft, sortOrder: Number(e.target.value) || 0 })} /></label>
          </div>
          <label className="adm-full">Character<textarea rows={2} value={draft.character} onChange={(e) => setDraft({ ...draft, character: e.target.value })} /></label>
          <label className="adm-full">Route (one stop per line)<textarea rows={4} value={draft.route.join('\n')} onChange={(e) => setDraft({ ...draft, route: lines(e.target.value) })} /></label>
          <label className="adm-full">Inclusions (one per line)<textarea rows={4} value={draft.inclusions.join('\n')} onChange={(e) => setDraft({ ...draft, inclusions: lines(e.target.value) })} /></label>
          <div className="adm-form-actions">
            <button type="button" className="adm-btn" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
            <button type="button" className="adm-btn adm-btn--ghost" onClick={() => setDraft(null)}>Cancel</button>
          </div>
        </div>
      ) : null}

      {loading ? <p className="adm-muted">Loading…</p> : (
        <ul className="adm-cards">
          {items.map((pkg) => (
            <li key={pkg.id} className="adm-card">
              <div>
                <p className="adm-card__title">{pkg.numeral ? `${pkg.numeral}. ` : ''}{pkg.name}</p>
                <p className="adm-card__meta">{pkg.duration} · {pkg.route.length} stops · {pkg.inclusions.length} inclusions</p>
              </div>
              <div className="adm-card__actions">
                <button type="button" onClick={() => startEdit(pkg)}>Edit</button>
                <button type="button" className="adm-danger" onClick={() => remove(pkg.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

/* ---------------- Themes ---------------- */

const emptyTheme: Omit<Theme, 'id' | 'places'> = {
  title: '',
  description: '',
  traveller: '',
  encounter: '',
  imageUrl: null,
  sortOrder: 0,
}

function ThemesPanel() {
  const { items, error, loading, refresh, setError } = useCrud<Theme>(listThemes)
  const [draft, setDraft] = useState<Omit<Theme, 'id' | 'places'> | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)

  function startEdit(theme: Theme) {
    setDraft({
      title: theme.title,
      description: theme.description,
      traveller: theme.traveller,
      encounter: theme.encounter,
      imageUrl: theme.imageUrl,
      sortOrder: theme.sortOrder,
    })
    setEditingId(theme.id)
  }

  async function save() {
    if (!draft) return
    setSaving(true)
    setError('')
    try {
      if (editingId) await updateTheme(editingId, draft)
      else await createTheme(draft)
      setDraft(null)
      setEditingId(null)
      refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save.')
    } finally {
      setSaving(false)
    }
  }

  async function remove(id: number) {
    if (!window.confirm('Delete this theme and its places?')) return
    await deleteTheme(id)
    refresh()
  }

  return (
    <section className="adm-section">
      <div className="adm-section__head">
        <h2>Themes</h2>
        <button type="button" className="adm-btn" onClick={() => { setDraft({ ...emptyTheme }); setEditingId(null) }}>+ Add theme</button>
      </div>
      {error ? <p className="adm-error">{error}</p> : null}

      {draft ? (
        <div className="adm-form">
          <div className="adm-form-grid">
            <label>Title<input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></label>
            <label>Traveller line<input value={draft.traveller} onChange={(e) => setDraft({ ...draft, traveller: e.target.value })} /></label>
            <label>Encounter<input value={draft.encounter} onChange={(e) => setDraft({ ...draft, encounter: e.target.value })} /></label>
            <label>Sort order<input value={draft.sortOrder} onChange={(e) => setDraft({ ...draft, sortOrder: Number(e.target.value) || 0 })} /></label>
          </div>
          <label className="adm-full">Description<textarea rows={3} value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} /></label>
          <div className="adm-form-actions">
            <button type="button" className="adm-btn" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
            <button type="button" className="adm-btn adm-btn--ghost" onClick={() => setDraft(null)}>Cancel</button>
          </div>
        </div>
      ) : null}

      {loading ? <p className="adm-muted">Loading…</p> : (
        <ul className="adm-cards">
          {items.map((theme) => (
            <li key={theme.id} className="adm-card">
              <div>
                <p className="adm-card__title">{theme.title}</p>
                <p className="adm-card__meta">{theme.traveller} · {(theme.places ?? []).length} places</p>
              </div>
              <div className="adm-card__actions">
                <button type="button" onClick={() => startEdit(theme)}>Edit</button>
                <button type="button" className="adm-danger" onClick={() => remove(theme.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

/* ---------------- Places ---------------- */

function PlacesPanel() {
  const { items, error, loading, refresh, setError } = useCrud<Place>(listPlaces)
  const [themes, setThemes] = useState<Theme[]>([])
  const [draft, setDraft] = useState<Omit<Place, 'id'> | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    listThemes().then(setThemes).catch(() => setThemes([]))
  }, [])

  const themeName = (id: number) => themes.find((t) => t.id === id)?.title ?? `Theme ${id}`

  function startAdd() {
    setDraft({
      themeId: themes[0]?.id ?? 0,
      name: '',
      region: '',
      description: '',
      longitude: null,
      latitude: null,
      bestTime: '',
      activities: [],
      sortOrder: 0,
    })
    setEditingId(null)
  }
  function startEdit(place: Place) {
    const { id, ...rest } = place
    void id
    setDraft(rest)
    setEditingId(place.id)
  }

  async function save() {
    if (!draft) return
    if (!draft.themeId) {
      setError('Please choose a theme for this place.')
      return
    }
    setSaving(true)
    setError('')
    try {
      if (editingId) await updatePlace(editingId, draft)
      else await createPlace(draft)
      setDraft(null)
      setEditingId(null)
      refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save.')
    } finally {
      setSaving(false)
    }
  }

  async function remove(id: number) {
    if (!window.confirm('Delete this place?')) return
    await deletePlace(id)
    refresh()
  }

  return (
    <section className="adm-section">
      <div className="adm-section__head">
        <h2>Places</h2>
        <button type="button" className="adm-btn" onClick={startAdd} disabled={themes.length === 0}>
          + Add place
        </button>
      </div>
      {themes.length === 0 ? <p className="adm-muted">Add a theme first — places belong to a theme.</p> : null}
      {error ? <p className="adm-error">{error}</p> : null}

      {draft ? (
        <div className="adm-form">
          <div className="adm-form-grid">
            <label>Theme
              <select value={draft.themeId} onChange={(e) => setDraft({ ...draft, themeId: Number(e.target.value) })}>
                {themes.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}
              </select>
            </label>
            <label>Name<input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></label>
            <label>Region<input value={draft.region} onChange={(e) => setDraft({ ...draft, region: e.target.value })} /></label>
            <label>Best time<input value={draft.bestTime} onChange={(e) => setDraft({ ...draft, bestTime: e.target.value })} /></label>
            <label>Longitude<input value={draft.longitude ?? ''} onChange={(e) => setDraft({ ...draft, longitude: e.target.value ? Number(e.target.value) : null })} /></label>
            <label>Latitude<input value={draft.latitude ?? ''} onChange={(e) => setDraft({ ...draft, latitude: e.target.value ? Number(e.target.value) : null })} /></label>
            <label>Sort order<input value={draft.sortOrder} onChange={(e) => setDraft({ ...draft, sortOrder: Number(e.target.value) || 0 })} /></label>
          </div>
          <label className="adm-full">Description<textarea rows={2} value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} /></label>
          <label className="adm-full">Things to do (one per line)<textarea rows={3} value={draft.activities.join('\n')} onChange={(e) => setDraft({ ...draft, activities: lines(e.target.value) })} /></label>
          <div className="adm-form-actions">
            <button type="button" className="adm-btn" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
            <button type="button" className="adm-btn adm-btn--ghost" onClick={() => setDraft(null)}>Cancel</button>
          </div>
        </div>
      ) : null}

      {loading ? <p className="adm-muted">Loading…</p> : (
        <ul className="adm-cards">
          {items.map((place) => (
            <li key={place.id} className="adm-card">
              <div>
                <p className="adm-card__title">{place.name}</p>
                <p className="adm-card__meta">{themeName(place.themeId)} · {place.region || 'no region'} · {place.activities.length} things to do</p>
              </div>
              <div className="adm-card__actions">
                <button type="button" onClick={() => startEdit(place)}>Edit</button>
                <button type="button" className="adm-danger" onClick={() => remove(place.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
