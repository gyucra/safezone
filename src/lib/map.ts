// Configuración central del mapa con Leaflet (100% gratis)
export const MAP_CONFIG = {
  defaultCenter: [-12.0464, -77.0428] as [number, number], // Lima, Perú
  defaultZoom: 13,
  tileLayer: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution: '© OpenStreetMap contributors'
}

// Colores por tipo de incidente
export const INCIDENT_COLORS = {
  robo: '#ef4444',
  violencia: '#dc2626',
  accidente: '#f97316',
  desaparicion: '#a855f7',
  disturbio: '#eab308',
  emergencia_medica: '#3b82f6',
  otro: '#6b7280',
}

// Colores por urgencia
export const URGENCY_COLORS = {
  bajo: '#22c55e',
  medio: '#eab308',
  alto: '#f97316',
  critico: '#ef4444',
}

// íconos por tipo
export const INCIDENT_ICONS = {
  robo: '🔪',
  violencia: '⚠️',
  accidente: '🚗',
  desaparicion: '👤',
  disturbio: '🚨',
  emergencia_medica: '🚑',
  otro: '❗',
}