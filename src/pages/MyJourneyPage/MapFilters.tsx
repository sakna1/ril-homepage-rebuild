import { experiences } from '../../data/experiences'
import {
  DISCOVERY_WORLD_FILTERS,
  getRegionFilterLabel,
  REGION_FILTER_IDS,
} from '../../journey/journeyRegionCatalog'
import type { MapFilterCategory, MapFilterState } from './journeyView'

type MapFiltersProps = {
  filter: MapFilterState
  onFilterChange: (filter: MapFilterState) => void
  hasSavedItems: boolean
}

const primaryOptions: { id: MapFilterCategory; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'worlds', label: 'Discovery Worlds' },
  { id: 'regions', label: 'Regions' },
  { id: 'experiences', label: 'Experiences' },
  { id: 'saved', label: 'Saved' },
]

export function MapFilters({ filter, onFilterChange, hasSavedItems }: MapFiltersProps) {
  const secondaryOptions = getSecondaryOptions(filter.category)

  return (
    <div className="map-filters" aria-label="Map discovery filters">
      <div className="map-filters__primary">
        <span className="map-filters__label">Show me:</span>
        <div className="map-filters__chip-row" role="group" aria-label="Primary map filter">
          {primaryOptions.map((option) => (
            <button
              key={option.id}
              className="map-filters__chip"
              type="button"
              aria-pressed={filter.category === option.id}
              onClick={() =>
                onFilterChange({
                  category: option.id,
                  secondaryId: undefined,
                })
              }
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {filter.category !== 'all' && filter.category !== 'saved' && secondaryOptions.length > 0 ? (
        <div className="map-filters__secondary" role="group" aria-label="Secondary map filter">
          {secondaryOptions.map((option) => (
            <button
              key={option.id}
              className="map-filters__chip map-filters__chip--secondary"
              type="button"
              aria-pressed={filter.secondaryId === option.id}
              onClick={() =>
                onFilterChange({
                  category: filter.category,
                  secondaryId: filter.secondaryId === option.id ? undefined : option.id,
                })
              }
            >
              {option.label}
            </button>
          ))}
        </div>
      ) : null}

      {filter.category === 'saved' && !hasSavedItems ? (
        <p className="map-filters__empty">
          Nothing has been saved yet. As you explore, the places and encounters that stay with you will appear here.
        </p>
      ) : null}
    </div>
  )
}

function getSecondaryOptions(category: MapFilterCategory): { id: string; label: string }[] {
  if (category === 'worlds') {
    return DISCOVERY_WORLD_FILTERS.map((world) => ({
      id: world.id,
      label: world.label,
    }))
  }

  if (category === 'regions') {
    return REGION_FILTER_IDS.map((regionId) => ({
      id: regionId,
      label: getRegionFilterLabel(regionId),
    }))
  }

  if (category === 'experiences') {
    return experiences.map((experience) => ({
      id: experience.id,
      label: experience.title,
    }))
  }

  return []
}
