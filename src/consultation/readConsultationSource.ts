const VALID_SOURCES = new Set([
  'my-journey',
  'homepage',
  'brochure',
  'guided-discovery',
  'about',
  'journal',
  'travel-preparation',
  'expectations',
  'footer',
])

export function readConsultationSource(): string | undefined {
  if (typeof window === 'undefined') {
    return undefined
  }

  const from = new URLSearchParams(window.location.search).get('from')
  if (!from || !VALID_SOURCES.has(from)) {
    return undefined
  }

  return from
}
