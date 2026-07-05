export type JourneyView = 'explore' | 'guided' | 'journey'

export function getTabPanelId(view: JourneyView) {
  return `my-journey-panel-${view}`
}

export function getTabId(view: JourneyView) {
  return `my-journey-tab-${view}`
}

export function readJourneyView(defaultView: JourneyView = 'explore'): JourneyView {
  const params = new URLSearchParams(window.location.search)
  const view = params.get('view')
  if (view === 'explore' || view === 'guided' || view === 'journey') {
    return view
  }
  return defaultView
}

export function readFocusedDirectionId(): string | undefined {
  const params = new URLSearchParams(window.location.search)
  const direction = params.get('direction')
  return direction ?? undefined
}

export function setJourneyView(view: JourneyView, options?: { directionId?: string | null }) {
  const url = new URL(window.location.href)
  url.searchParams.set('view', view)
  if (options?.directionId) {
    url.searchParams.set('direction', options.directionId)
  } else if (options?.directionId === null || view !== 'journey') {
    url.searchParams.delete('direction')
  }
  window.history.replaceState({}, '', url.toString())
}

export function setFocusedDirectionId(directionId: string | undefined) {
  const url = new URL(window.location.href)
  if (directionId) {
    url.searchParams.set('view', 'journey')
    url.searchParams.set('direction', directionId)
  } else {
    url.searchParams.delete('direction')
  }
  window.history.pushState({}, '', url.toString())
}

export type MapFilterCategory = 'all' | 'worlds' | 'regions' | 'experiences' | 'saved'

export type MapFilterState = {
  category: MapFilterCategory
  secondaryId?: string
}
