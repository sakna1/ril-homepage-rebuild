import { useEffect } from 'react'
import mapboxgl, { type Map } from 'mapbox-gl'

type MapControlsProps = {
  map: Map
}

export function MapControls({ map }: MapControlsProps) {
  useEffect(() => {
    const navigationControl = new mapboxgl.NavigationControl({ showCompass: true, showZoom: true })
    map.addControl(navigationControl, 'top-right')

    return () => {
      map.removeControl(navigationControl)
    }
  }, [map])

  return null
}
