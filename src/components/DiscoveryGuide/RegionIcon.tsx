export type RegionIconId = 'city' | 'coast' | 'wild' | 'wave' | 'mountain' | 'temple' | 'compass'

const paths: Record<RegionIconId, string> = {
  city: 'M4 21V9l5-3 5 3v3l5-3v12h-6v-5h-3v5H4Zm3-2h2v-3H7v3Zm7 0h2v-3h-2v3ZM9 12h2v-2H9v2Zm0-4h2V6H9v2Z',
  coast: 'M3 17c1.4-1.2 2.8-1.2 4.2 0 1.4 1.2 2.8 1.2 4.2 0 1.4-1.2 2.8-1.2 4.2 0 1.4 1.2 2.8 1.2 4.2 0M12 3v9M8 8l4 4 4-4',
  wild: 'M6.5 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm11 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3ZM9 6a1.4 1.4 0 1 1 0-2.8A1.4 1.4 0 0 1 9 6Zm6 0a1.4 1.4 0 1 1 0-2.8A1.4 1.4 0 0 1 15 6Zm-3 15c-3 0-5-1.8-5-4.4 0-2 1.6-3.2 2.4-4.4.6-.9.8-1.7 2.6-1.7s2 .8 2.6 1.7c.8 1.2 2.4 2.4 2.4 4.4 0 2.6-2 4.4-5 4.4Z',
  wave: 'M2 15c1.6-1.4 3.2-1.4 4.8 0 1.6 1.4 3.2 1.4 4.8 0 1.6-1.4 3.2-1.4 4.8 0 1.6 1.4 3.2 1.4 4.8 0M2 19c1.6-1.4 3.2-1.4 4.8 0 1.6 1.4 3.2 1.4 4.8 0 1.6-1.4 3.2-1.4 4.8 0 1.6 1.4 3.2 1.4 4.8 0M6 11c2-4 4-6 6-6s2 2 2 3-1 2-2 2-1.5-.6-1.5-1.4',
  mountain: 'M3 19 9 8l3.5 6L15 9l6 10H3Zm9-13.5a1.6 1.6 0 1 1 0-3.2 1.6 1.6 0 0 1 0 3.2Z',
  temple: 'M12 2 5 6v2h14V6l-7-4Zm-6 9h2v8H6v-8Zm4 0h2v8h-2v-8Zm4 0h2v8h-2v-8ZM4 20h16v2H4v-2Z',
  compass: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm3.2 6.8-1.6 4.8-4.8 1.6 1.6-4.8 4.8-1.6Z',
}

export function RegionIcon({ id, className }: { id: RegionIconId; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <path d={paths[id]} stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
