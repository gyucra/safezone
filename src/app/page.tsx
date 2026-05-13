import Link from 'next/link'
import { Shield, MapPin, Bell, AlertTriangle } from 'lucide-react'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-950 flex flex-col">

      {/* Navbar */}
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="text-red-500" size={28} />
          <span className="text-xl font-black text-white">Safe<span className="text-red-500">Zone</span></span>
        </div>
        <div className="flex gap-3">
          <Link href="/login" className="px-4 py-2 text-gray-300 hover:text-white transition-colors">
            Iniciar sesión
          </Link>
          <Link href="/register" className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors">
            Registrarse
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 bg-red-950 border border-red-800 rounded-full px-4 py-1.5 mb-6">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span className="text-red-400 text-sm font-medium">Sistema activo en tiempo real</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
          Tu ciudad más<br />
          <span className="text-red-500">segura</span>
        </h1>

        <p className="text-gray-400 text-xl max-w-2xl mb-10">
          Reporta incidentes, visualiza zonas peligrosas y recibe alertas en tiempo real. 
          Juntos construimos comunidades más seguras.
        </p>

        <div className="flex gap-4 flex-wrap justify-center">
          <Link href="/register" className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-lg transition-colors flex items-center gap-2">
            <Shield size={20} />
            Empezar ahora
          </Link>
          <Link href="/map" className="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-bold text-lg transition-colors flex items-center gap-2">
            <MapPin size={20} />
            Ver el mapa
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 w-full max-w-3xl">
          {[
            { icon: <MapPin size={24} />, value: '1,240', label: 'Incidentes reportados' },
            { icon: <Bell size={24} />, value: '8,900', label: 'Alertas enviadas' },
            { icon: <Shield size={24} />, value: '3,200', label: 'Usuarios activos' },
            { icon: <AlertTriangle size={24} />, value: '94%', label: 'Tasa de resolución' },
          ].map((stat) => (
            <div key={stat.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
              <div className="text-red-500 flex justify-center mb-2">{stat.icon}</div>
              <div className="text-2xl font-black text-white">{stat.value}</div>
              <div className="text-gray-500 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

    </main>
  )
}