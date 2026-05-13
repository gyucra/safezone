'use client'
import { useState } from 'react'
import { Plus, Search, Filter, MapPin, Clock, CheckCircle, AlertTriangle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { INCIDENT_ICONS } from '@/lib/map'
import { Incident, IncidentType } from '@/types'

const MOCK_INCIDENTS: Incident[] = [
  {
    id: '1', type: 'robo', title: 'Robo a mano armada',
    description: 'Dos sujetos en moto arrebataron celular a transeúnte en esquina de Av. Larco.',
    urgency: 'alto', status: 'activo', userId: '1', userName: 'Carlos M.',
    location: { lat: -12.0464, lng: -77.0428, address: 'Av. Larco, Miraflores' },
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    verifiedCount: 3, views: 12
  },
  {
    id: '2', type: 'accidente', title: 'Accidente de tránsito',
    description: 'Choque entre taxi y camioneta. Hay heridos leves. Tráfico congestionado.',
    urgency: 'medio', status: 'en_proceso', userId: '2', userName: 'Ana P.',
    location: { lat: -12.0500, lng: -77.0350, address: 'Av. Javier Prado, San Isidro' },
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    verifiedCount: 1, views: 8
  },
  {
    id: '3', type: 'emergencia_medica', title: 'Emergencia médica',
    description: 'Persona mayor desmayada en la vía pública. Necesita atención urgente.',
    urgency: 'critico', status: 'activo', userId: '3', userName: 'Luis R.',
    location: { lat: -12.0550, lng: -77.0480, address: 'Jr. Domingo Elías, Surquillo' },
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    verifiedCount: 5, views: 25
  },
  {
    id: '4', type: 'disturbio', title: 'Disturbio en vía pública',
    description: 'Grupo de personas en altercado verbal frente a local nocturno.',
    urgency: 'bajo', status: 'resuelto', userId: '4', userName: 'María G.',
    location: { lat: -12.1500, lng: -77.0200, address: 'Av. Grau, Barranco' },
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    verifiedCount: 2, views: 6
  },
  {
    id: '5', type: 'desaparicion', title: 'Persona desaparecida',
    description: 'Menor de 15 años no regresa a casa desde las 6pm. Última vez visto en el parque.',
    urgency: 'alto', status: 'en_proceso', userId: '5', userName: 'Roberto F.',
    location: { lat: -12.0800, lng: -76.9500, address: 'Parque central, La Molina' },
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    verifiedCount: 4, views: 45
  },
]

const urgencyConfig = {
  bajo: { label: 'Bajo', color: '#16a34a', bg: '#052e16' },
  medio: { label: 'Medio', color: '#ca8a04', bg: '#451a03' },
  alto: { label: 'Alto', color: '#ea580c', bg: '#431407' },
  critico: { label: 'Crítico', color: '#dc2626', bg: '#450a0a' },
}

const statusConfig = {
  activo: { label: 'Activo', color: '#dc2626', icon: <AlertTriangle size={12} /> },
  en_proceso: { label: 'En proceso', color: '#2563eb', icon: <Clock size={12} /> },
  resuelto: { label: 'Resuelto', color: '#16a34a', icon: <CheckCircle size={12} /> },
  falso_reporte: { label: 'Falso reporte', color: '#6b7280', icon: null },
}

export default function IncidentsPage() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('todos')
  const [filterUrgency, setFilterUrgency] = useState('todos')
  const [selected, setSelected] = useState<Incident | null>(null)

  const filtered = MOCK_INCIDENTS.filter(inc => {
    const matchSearch = inc.title.toLowerCase().includes(search.toLowerCase()) ||
      inc.location.address?.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'todos' || inc.status === filterStatus
    const matchUrgency = filterUrgency === 'todos' || inc.urgency === filterUrgency
    return matchSearch && matchStatus && matchUrgency
  })

  return (
    <div className="flex h-[calc(100vh-56px)]">

      {/* Lista */}
      <div className="w-full md:w-96 bg-gray-900 border-r border-gray-800 flex flex-col">

        {/* Header */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-white">Incidentes</h2>
            <button
              onClick={() => router.push('/map')}
              className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
            >
              <Plus size={14} /> Reportar
            </button>
          </div>

          {/* Búsqueda */}
          <div className="relative mb-2">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar incidentes..."
              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Filtros */}
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none"
            >
              <option value="todos">Todos</option>
              <option value="activo">Activo</option>
              <option value="en_proceso">En proceso</option>
              <option value="resuelto">Resuelto</option>
            </select>
            <select
              value={filterUrgency}
              onChange={e => setFilterUrgency(e.target.value)}
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none"
            >
              <option value="todos">Urgencia</option>
              <option value="critico">Crítico</option>
              <option value="alto">Alto</option>
              <option value="medio">Medio</option>
              <option value="bajo">Bajo</option>
            </select>
          </div>
        </div>

        {/* Lista */}
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Filter size={32} className="mx-auto mb-2 opacity-50" />
              <p>No se encontraron incidentes</p>
            </div>
          ) : (
            filtered.map(inc => (
              <div
                key={inc.id}
                onClick={() => setSelected(inc)}
                className={`p-4 border-b border-gray-800 cursor-pointer hover:bg-gray-800 transition-colors ${
                  selected?.id === inc.id ? 'bg-gray-800 border-l-2 border-l-red-500' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{INCIDENT_ICONS[inc.type]}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm truncate">{inc.title}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <MapPin size={10} className="text-gray-500" />
                      <p className="text-gray-400 text-xs truncate">{inc.location.address}</p>
                    </div>
                    <div className="flex gap-2 mt-1.5">
                      <span style={{ background: urgencyConfig[inc.urgency].bg, color: urgencyConfig[inc.urgency].color }} className="text-xs font-bold px-2 py-0.5 rounded-full">
                        {urgencyConfig[inc.urgency].label}
                      </span>
                      <span style={{ color: statusConfig[inc.status].color }} className="text-xs flex items-center gap-1">
                        {statusConfig[inc.status].icon}
                        {statusConfig[inc.status].label}
                      </span>
                    </div>
                  </div>
                  <span className="text-gray-600 text-xs whitespace-nowrap">{inc.verifiedCount} ✓</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Detalle */}
      <div className="flex-1 hidden md:flex items-center justify-center bg-gray-950">
        {selected ? (
          <div className="max-w-lg w-full mx-8">
            <div style={{ background: '#111827', border: '1px solid #1f2937' }} className="rounded-2xl p-6">
              <div className="flex items-start gap-4 mb-4">
                <span className="text-4xl">{INCIDENT_ICONS[selected.type]}</span>
                <div>
                  <h2 className="text-xl font-black text-white">{selected.title}</h2>
                  <div className="flex items-center gap-1 mt-1">
                    <MapPin size={12} className="text-gray-500" />
                    <span className="text-gray-400 text-sm">{selected.location.address}</span>
                  </div>
                </div>
              </div>

              <p className="text-gray-300 mb-4 leading-relaxed">{selected.description}</p>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div style={{ background: '#1f2937' }} className="rounded-lg p-3">
                  <p className="text-gray-500 text-xs mb-1">Urgencia</p>
                  <span style={{ color: urgencyConfig[selected.urgency].color }} className="font-bold">
                    {urgencyConfig[selected.urgency].label}
                  </span>
                </div>
                <div style={{ background: '#1f2937' }} className="rounded-lg p-3">
                  <p className="text-gray-500 text-xs mb-1">Estado</p>
                  <span style={{ color: statusConfig[selected.status].color }} className="font-bold">
                    {statusConfig[selected.status].label}
                  </span>
                </div>
                <div style={{ background: '#1f2937' }} className="rounded-lg p-3">
                  <p className="text-gray-500 text-xs mb-1">Reportado por</p>
                  <span className="text-white font-bold text-sm">{selected.userName}</span>
                </div>
                <div style={{ background: '#1f2937' }} className="rounded-lg p-3">
                  <p className="text-gray-500 text-xs mb-1">Verificaciones</p>
                  <span className="text-white font-bold">{selected.verifiedCount} usuarios</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => router.push('/map')}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl py-2.5 font-bold text-sm transition-colors"
                >
                  Ver en mapa
                </button>
                <button
                  onClick={() => setSelected(s => s ? { ...s, status: 'resuelto' } : null)}
                  style={{ background: '#1f2937' }}
                  className="flex-1 hover:bg-gray-700 text-white rounded-xl py-2.5 font-bold text-sm transition-colors"
                >
                  Marcar resuelto
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-600">
            <AlertTriangle size={48} className="mx-auto mb-3 opacity-30" />
            <p>Selecciona un incidente para ver detalles</p>
          </div>
        )}
      </div>
    </div>
  )
}