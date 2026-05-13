import { Shield, AlertTriangle, CheckCircle, Users, Clock, TrendingUp, MapPin, Activity } from 'lucide-react'

const stats = [
  { label: 'Incidentes activos', value: '24', icon: <AlertTriangle size={20} />, color: '#ef4444', bg: '#450a0a' },
  { label: 'Resueltos hoy', value: '18', icon: <CheckCircle size={20} />, color: '#22c55e', bg: '#052e16' },
  { label: 'Usuarios activos', value: '3,240', icon: <Users size={20} />, color: '#3b82f6', bg: '#172554' },
  { label: 'Tiempo respuesta', value: '4.2 min', icon: <Clock size={20} />, color: '#f59e0b', bg: '#451a03' },
]

const recentIncidents = [
  { id: 1, type: '🔪', title: 'Robo a mano armada', zone: 'Miraflores', urgency: 'Alto', status: 'Activo', time: 'hace 5 min' },
  { id: 2, type: '🚗', title: 'Accidente de tránsito', zone: 'San Isidro', urgency: 'Medio', status: 'En proceso', time: 'hace 12 min' },
  { id: 3, type: '🚑', title: 'Emergencia médica', zone: 'Surquillo', urgency: 'Crítico', status: 'Activo', time: 'hace 18 min' },
  { id: 4, type: '⚠️', title: 'Disturbio en vía pública', zone: 'Barranco', urgency: 'Bajo', status: 'Resuelto', time: 'hace 1h' },
  { id: 5, type: '👤', title: 'Persona desaparecida', zone: 'La Molina', urgency: 'Alto', status: 'En proceso', time: 'hace 2h' },
]

const zones = [
  { name: 'Miraflores', incidents: 8, trend: '+2', color: '#ef4444' },
  { name: 'San Isidro', incidents: 5, trend: '-1', color: '#f97316' },
  { name: 'Surquillo', incidents: 4, trend: '+1', color: '#f97316' },
  { name: 'Barranco', incidents: 3, trend: '0', color: '#eab308' },
  { name: 'La Molina', incidents: 2, trend: '-1', color: '#22c55e' },
]

const urgencyColors: Record<string, string> = {
  'Crítico': '#dc2626',
  'Alto': '#ea580c',
  'Medio': '#ca8a04',
  'Bajo': '#16a34a',
}

const statusColors: Record<string, string> = {
  'Activo': '#dc2626',
  'En proceso': '#2563eb',
  'Resuelto': '#16a34a',
}

export default function AdminPage() {
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
            {recentIncidents.map(inc => (
              <div key={inc.id} style={{ background: '#1f2937' }} className="rounded-lg p-3 flex items-center gap-3">
                <span className="text-xl">{inc.type}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-white text-sm font-medium truncate">{inc.title}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <MapPin size={10} className="text-gray-500" />
                    <span className="text-gray-400 text-xs">{inc.zone}</span>
                    <span className="text-gray-600 text-xs">·</span>
                    <span className="text-gray-500 text-xs">{inc.time}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span style={{ background: urgencyColors[inc.urgency] + '20', color: urgencyColors[inc.urgency] }} className="text-xs font-bold px-2 py-0.5 rounded-full">
                    {inc.urgency}
                  </span>
                  <span style={{ background: statusColors[inc.status] + '20', color: statusColors[inc.status] }} className="text-xs px-2 py-0.5 rounded-full">
                    {inc.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Zonas críticas */}
        <div style={{ background: '#111827', border: '1px solid #1f2937' }} className="rounded-xl p-4">
          <h2 className="font-bold text-white flex items-center gap-2 mb-4">
            <TrendingUp size={18} className="text-red-500" />
            Zonas críticas
          </h2>
          <div className="flex flex-col gap-3">
            {zones.map((zone, i) => (
              <div key={zone.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-gray-300 text-sm">{zone.name}</span>
                  <div className="flex items-center gap-2">
                    <span style={{ color: zone.trend.startsWith('+') ? '#ef4444' : zone.trend === '0' ? '#6b7280' : '#22c55e' }} className="text-xs font-bold">
                      {zone.trend}
                    </span>
                    <span className="text-white text-sm font-bold">{zone.incidents}</span>
                  </div>
                </div>
                <div style={{ background: '#1f2937', borderRadius: '4px', height: '6px' }}>
                  <div style={{
                    width: `${(zone.incidents / 8) * 100}%`,
                    background: zone.color,
                    height: '100%',
                    borderRadius: '4px',
                    transition: 'width 1s ease'
                  }} />
                </div>
              </div>
            ))}
          </div>

          {/* Mini stats */}
          <div style={{ background: '#1f2937', borderRadius: '12px', padding: '12px', marginTop: '16px' }}>
            <div className="flex items-center gap-2 mb-2">
              <Shield size={14} className="text-blue-400" />
              <span className="text-gray-300 text-xs font-medium">Resumen del día</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Reportados', value: '42' },
                { label: 'Resueltos', value: '18' },
                { label: 'Falsos', value: '3' },
                { label: 'SOS activos', value: '1' },
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