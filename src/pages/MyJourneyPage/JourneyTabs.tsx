import { useCallback, useId, type KeyboardEvent } from 'react'
import { getTabId, getTabPanelId, type JourneyView } from './journeyView'

type JourneyTabsProps = {
  activeView: JourneyView
  onViewChange: (view: JourneyView) => void
}

const tabs: { id: JourneyView; label: string }[] = [
  { id: 'explore', label: 'Explore the Island' },
  { id: 'guided', label: 'Guided Discovery' },
  { id: 'journey', label: 'My Journey' },
]

export function JourneyTabs({ activeView, onViewChange }: JourneyTabsProps) {
  const tablistId = useId()

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
      if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') {
        return
      }

      event.preventDefault()
      const direction = event.key === 'ArrowRight' ? 1 : -1
      const nextIndex = (index + direction + tabs.length) % tabs.length
      onViewChange(tabs[nextIndex].id)
    },
    [onViewChange],
  )

  return (
    <div className="my-journey-tabs" role="tablist" aria-label="My Journey sections" id={tablistId}>
      {tabs.map((tab, index) => {
        const isActive = activeView === tab.id
        const panelId = getTabPanelId(tab.id)

        return (
          <button
            key={tab.id}
            className="my-journey-tabs__tab"
            type="button"
            role="tab"
            id={getTabId(tab.id)}
            aria-selected={isActive}
            aria-controls={panelId}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onViewChange(tab.id)}
            onKeyDown={(event) => handleKeyDown(event, index)}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
