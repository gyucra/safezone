'use client'
import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { INCIDENT_COLORS, INCIDENT_ICONS } from '@/lib/map'
import { Incident, IncidentType, CreateIncidentDto } from '@/types'
import ReportForm from '@/components/incidents/ReportForm'

const MOCK_INCIDENTS: Incident[] = [
  {
    id: '1', type: 'robo', title: 'Robo a mano armada',
    description: 'Robo reportado en esquina', urgency: 'alto',
    status: 'activo', userId: '1', userName: 'Usuario1',
    location: { lat: -12.0464, lng: -77.0428, address: 'Miraflores' },
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    verifiedCount: 3, views: 12
  },
  {
    id: '2', type: 'accidente', title: 'Accidente de tránsito',
    description: 'Choque entre dos vehículos', urgency: 'medio',
    status: 'activo', userId: '2', userName: 'Usuario2',
    location: { lat: -12.0500, lng: -77.0350, address: 'San Isidro' },
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    verifiedCount: 1, views: 8
  },
  {
    id: '3', type: 'emergencia_medica', title: 'Emergencia médica',
    description: 'Persona desmayada', urgency: 'critico',
    status: 'activo', userId: '3', userName: 'Usuario3',
    location: { lat: -12.0550, lng: -77.0480, address: 'Surquillo' },
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    verifiedCount: 5, views: 25
  },
]

const URGENCY_LABELS = {
  bajo: { label: 'Bajo', color: 'bg-green-500' },
  medio: { label: 'Medio', color: 'bg-yellow-500' },
  alto: { label: 'Alto', color: 'bg-orange-500' },
  critico: { label: 'Crítico', color: 'bg-red-500' },
}

const TYPE_LABELS: Record<IncidentType, string> = {
  robo: 'Robo',
  violencia: 'Violencia',
  accidente: 'Accidente',
  desaparicion: 'Desaparición',
  disturbio: 'Disturbio',
  emergencia_medica: 'Emergencia médica',
  otro: 'Otro',
}

export default function MapPage() {
  const [MapComponent, setMapComponent] = useState<React.ComponentType<{incidents: Incident[]}> | null>(null)
  const [selected, setSelected] = useState<Incident | null>(null)
  const [filter, setFilter] = useState<string>('todos')
  const [showForm, setShowForm] = useState(false)
  const [incidents, setIncidents] = useState<Incident[]>(MOCK_INCIDENTS)

  useEffect(() => {
    import('@/components/map/MapView').then(mod => {
      setMapComponent(() => mod.default)
    })
  }, [])

  const filtered = filter === 'todos'
    ? incidents
    : incidents.filter(i => i.type === filter)

  const handleNewIncident = (data: CreateIncidentDto) => {
    // Agregar el nuevo incidente a la lista
    const newIncident: Incident = {
      id: Date.now().toString(),
      ...data,
      status: 'activo',
      userId: 'me',
      userName: 'Tú',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      verifiedCount: 0,
      views: 0,
    }
    setIncidents(prev => [newIncident, ...prev])
    setShowForm(false)
  }

  return (
    <div className="flex h-[calc(100vh-56px)]">

      {/* Sidebar izquierdo */}
      <div className="w-80 bg-gray-900 border-r border-gray-800 flex flex-col">
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-white">Incidentes activos</h2>
            <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {filtered.length}
            </span>
          </div>
          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500"
          >
            <option value="todos">Todos los tipos</option>
            {Object.entries(TYPE_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filtered.map(incident => (
            <div
              key={incident.id}
              onClick={() => setSelected(incident)}
              className={`p-4 border-b border-gray-800 cursor-pointer hover:bg-gray-800 transition-colors ${
                selected?.id === incident.id ? 'bg-gray-800 border-l-2 border-l-red-500' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{INCIDENT_ICONS[incident.type]}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-white text-sm truncate">{incident.title}</span>
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${URGENCY_LABELS[incident.urgency].color}`} />
                  </div>
                  <p className="text-gray-400 text-xs truncate">{incident.location.address}</p>
                  <p className="text-gray-500 text-xs mt-1">hace 5 min · {incident.verifiedCount} verificaciones</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Botón reportar */}
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={() => setShowForm(true)}
            className="w-full bg-red-600 hover:bg-red-700 text-white rounded-xl py-3 font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <Plus size={18} />
            Reportar incidente
          </button>
        </div>
      </div>

      {/* Mapa */}
      <div className="flex-1 relative">
        {MapComponent ? (
          <MapComponent incidents={filtered} />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-900">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-gray-400">Cargando mapa...</p>
            </div>
          </div>
        )}

        {selected && (
          <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-gray-900 border border-gray-700 rounded-xl p-4 shadow-xl">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{INCIDENT_ICONS[selected.type]}</span>
                <div>
                  <h3 className="font-bold text-white text-sm">{selected.title}</h3>
                  <p className="text-gray-400 text-xs">{selected.location.address}</p>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-500 hover:text-white">✕</button>
            </div>
            <p className="text-gray-300 text-sm mb-3">{selected.description}</p>
            <div className="flex gap-2">
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold text-white ${URGENCY_LABELS[selected.urgency].color}`}>
                {URGENCY_LABELS[selected.urgency].label}
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-gray-700 text-gray-300">
                {TYPE_LABELS[selected.type]}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Formulario de reporte */}
      {showForm && (
        <ReportForm
          onClose={() => setShowForm(false)}
          onSuccess={handleNewIncident}
        />
      )}
    </div>
  )
}