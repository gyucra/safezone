'use client'
import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { Incident } from '@/types'
import { INCIDENT_COLORS, MAP_CONFIG } from '@/lib/map'

// Componente que mueve el mapa a tu ubicación
function LocationTracker() {
  const map = useMap()

  useEffect(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        map.setView([latitude, longitude], 14) // zoom 14 = más cercano
      },
      () => {
        // Si no da permiso, queda en el centro por defecto (Lima)
        console.log('Ubicación no disponible')
      }
    )
  }, [map])

  return null
}

interface MapViewProps {
  incidents: Incident[]
}

export default function MapView({ incidents }: MapViewProps) {
  return (
    <MapContainer
      center={MAP_CONFIG.defaultCenter}
      zoom={MAP_CONFIG.defaultZoom}
      style={{ width: '100%', height: '100%' }}
      className="z-0"
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; OpenStreetMap contributors'
      />

      {/* Detecta y centra en tu ubicación real */}
      <LocationTracker />

      {incidents.map(incident => (
        <CircleMarker
          key={incident.id}
          center={[incident.location.lat, incident.location.lng]}
          radius={incident.urgency === 'critico' ? 16 : incident.urgency === 'alto' ? 12 : 8}
          fillColor={INCIDENT_COLORS[incident.type]}
          color={INCIDENT_COLORS[incident.type]}
          weight={2}
          opacity={0.9}
          fillOpacity={0.6}
        >
          <Popup>
            <div style={{ fontSize: '13px' }}>
              <strong>{incident.title}</strong>
              <p>{incident.description}</p>
              <p style={{ color: '#666' }}>{incident.location.address}</p>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  )
}