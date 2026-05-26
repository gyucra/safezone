'use client'
import { useEffect, useState } from 'react'
import { Shield, AlertTriangle, CheckCircle, Users, Clock, TrendingUp, MapPin, Activity } from 'lucide-react'
import { getIncidents } from '@/services/incidents'
import { Incident } from '@/types'
import { INCIDENT_ICONS } from '@/lib/map'

const urgencyColors: Record<string, string> = {
  critico: '#dc2626',
  alto: '#ea580c',
  medio: '#ca8a04',
  bajo: '#16a34a',
}

const statusColors: Record<string, string> = {
  activo: '#dc2626',
  en_proceso: '#2563eb',
  resuelto: '#16a34a',
  falso_reporte: '#6b7280',
}

const urgencyLabels: Record<string, string> = {
  critico: 'Crítico', alto: 'Alto', medio: 'Medio', bajo: 'Bajo',
}
const statusLabels: Record<string, string> = {
  activo: 'Activo', en_proceso: 'En proceso', resuelto: 'Resuelto', falso_reporte: 'Falso',
}

// Calcula "hace X tiempo" desde una fecha
function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'hace un momento'
  if (mins < 60) return `hace ${mins} min`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `hace ${hrs}h`
  const days = Math.floor(hrs / 24)
  return `hace ${days}d`
}

// Saca el nombre corto de la zona desde la dirección
function getZone(address?: string): string {
  if (!address) return 'Sin zona'
  const parts = address.split(',')
  return parts[parts.length - 1]?.trim() || parts[0]?.trim() || 'Sin zona'
}

export default function AdminPage() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getIncidents()
      .then(data => setIncidents(data))
      .catch(() => setIncidents([]))
      .finally(() => setLoading(false))
  }, [])

  // Calcular stats reales
  const activos = incidents.filter(i => i.status === 'activo').length
  const resueltos = incidents.filter(i => i.status === 'resuelto').length
  const enProceso = incidents.filter(i => i.status === 'en_proceso').length
  const total = incidents.length

  const stats = [
    { label: 'Incidentes activos', value: String(activos), icon: <AlertTriangle size={20} />, color: '#ef4444', bg: '#450a0a' },
    { label: 'Resueltos', value: String(resueltos), icon: <CheckCircle size={20} />, color: '#22c55e', bg: '#052e16' },
    { label: 'Total reportados', value: String(total), icon: <Users size={20} />, color: '#3b82f6', bg: '#172554' },
    { label: 'En proceso', value: String(enProceso), icon: <Clock size={20} />, color: '#f59e0b', bg: '#451a03' },
  ]

  // Incidentes recientes (los 5 más nuevos)
  const recentIncidents = incidents.slice(0, 5)

  // Zonas: agrupar por zona y contar
  const zoneMap: Record<string, number> = {}
  incidents.forEach(i => {
    const z = getZone(i.location.address)
    zoneMap[z] = (zoneMap[z] || 0) + 1
  })
  const zones = Object.entries(zoneMap)
    .map(([name, count]) => ({ name, incidents: count }))
    .sort((a, b) => b.incidents - a.incidents)
    .slice(0, 5)
  const maxZone = Math.max(1, ...zones.map(z => z.incidents))

  return (
    <div className="p-6 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white">Dashboard Administrativo</h1>
          <p className="text-gray-400 text-sm mt-1">Monitoreo en tiempo real — SafeZone</p>
        </div>
        <div className="flex items-center gap-2 bg-green-950 border border-green-800 rounded-full px-4 py-1.5">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-green-400 text-sm font-medium">Sistema activo</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map(stat => (
          <div key={stat.label} style={{ background: '#111827', border: '1px solid #1f2937' }} className="rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-400 text-sm">{stat.label}</span>
              <div style={{ background: stat.bg, color: stat.color }} className="p-2 rounded-lg">
                {stat.icon}
              </div>
            </div>
            <div style={{ color: stat.color }} className="text-3xl font-black">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Incidentes recientes */}
        <div style={{ background: '#111827', border: '1px solid #1f2937' }} className="md:col-span-2 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-white flex items-center gap-2">
              <Activity size={18} className="text-red-500" />
              Incidentes recientes
            </h2>
            <span className="text-gray-500 text-xs">Últimas 24h</span>
          </div>
          <div className="flex flex-col gap-2">
            {loading ? (
              <p className="text-gray-500 text-sm text-center py-8">Cargando...</p>
            ) : recentIncidents.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-8">No hay incidentes reportados aún</p>
            ) : (
              recentIncidents.map(inc => (
                <div key={inc.id} style={{ background: '#1f2937' }} className="rounded-lg p-3 flex items-center gap-3">
                  <span className="text-xl">{INCIDENT_ICONS[inc.type]}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-white text-sm font-medium truncate">{inc.title}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <MapPin size={10} className="text-gray-500" />
                      <span className="text-gray-400 text-xs truncate">{getZone(inc.location.address)}</span>
                      <span className="text-gray-600 text-xs">·</span>
                      <span className="text-gray-500 text-xs whitespace-nowrap">{timeAgo(inc.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span style={{ background: urgencyColors[inc.urgency] + '20', color: urgencyColors[inc.urgency] }} className="text-xs font-bold px-2 py-0.5 rounded-full">
                      {urgencyLabels[inc.urgency]}
                    </span>
                    <span style={{ background: statusColors[inc.status] + '20', color: statusColors[inc.status] }} className="text-xs px-2 py-0.5 rounded-full">
                      {statusLabels[inc.status]}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Zonas críticas */}
        <div style={{ background: '#111827', border: '1px solid #1f2937' }} className="rounded-xl p-4">
          <h2 className="font-bold text-white flex items-center gap-2 mb-4">
            <TrendingUp size={18} className="text-red-500" />
            Zonas críticas
          </h2>
          <div className="flex flex-col gap-3">
            {zones.length === 0 ? (
              <p className="text-gray-500 text-sm">Sin datos de zonas</p>
            ) : (
              zones.map(zone => (
                <div key={zone.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-300 text-sm truncate">{zone.name}</span>
                    <span className="text-white text-sm font-bold">{zone.incidents}</span>
                  </div>
                  <div style={{ background: '#1f2937', borderRadius: '4px', height: '6px' }}>
                    <div style={{
                      width: `${(zone.incidents / maxZone) * 100}%`,
                      background: '#ef4444',
                      height: '100%',
                      borderRadius: '4px',
                      transition: 'width 1s ease'
                    }} />
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Mini stats */}
          <div style={{ background: '#1f2937', borderRadius: '12px', padding: '12px', marginTop: '16px' }}>
            <div className="flex items-center gap-2 mb-2">
              <Shield size={14} className="text-blue-400" />
              <span className="text-gray-300 text-xs font-medium">Resumen del día</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Reportados', value: String(total) },
                { label: 'Resueltos', value: String(resueltos) },
                { label: 'Activos', value: String(activos) },
                { label: 'En proceso', value: String(enProceso) },
              ].map(item => (
                <div key={item.label} className="text-center">
                  <div className="text-white font-black text-lg">{item.value}</div>
                  <div className="text-gray-500 text-xs">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}