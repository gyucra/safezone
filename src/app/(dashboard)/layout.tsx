'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Shield, Map, AlertTriangle, Bell, LayoutDashboard, LogOut } from 'lucide-react'
import SOSButton from '@/components/sos/SOSButton'
import { getUser, logout } from '@/services/auth'

const navItems = [
  { href: '/map', icon: <Map size={20} />, label: 'Mapa' },
  { href: '/incidents', icon: <AlertTriangle size={20} />, label: 'Incidentes' },
  { href: '/admin', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  const [initial, setInitial] = useState('?')

  // Protección de ruta: verifica que haya sesión activa
  useEffect(() => {
    getUser().then(user => {
      if (!user) {
        router.replace('/login')
      } else {
        const label = user.signInDetails?.loginId || user.username || ''
        setInitial(label.charAt(0).toUpperCase() || 'U')
        setChecking(false)
      }
    })
  }, [router])

  const handleLogout = async () => {
    await logout()
    router.replace('/login')
  }

  // Mientras verifica la sesión, muestra una pantalla de carga
  if (checking) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <span className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Navbar */}
      <nav className="border-b border-gray-800 px-6 py-3 flex items-center justify-between fixed top-0 left-0 right-0 z-50 bg-gray-950">
        <Link href="/" className="flex items-center gap-2">
          <Shield size={24} className="text-red-500" />
          <span className="text-lg font-black">Safe<span className="text-red-500">Zone</span></span>
        </Link>

        <div className="flex items-center gap-1">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === item.href
                  ? 'bg-red-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-sm font-bold">
            {initial}
          </div>
          <button
            onClick={handleLogout}
            title="Cerrar sesión"
            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
          >
            <LogOut size={20} />
          </button>
        </div>
      </nav>

      {/* Contenido */}
      <div className="flex-1 pt-14">
        {children}
      </div>
      <SOSButton />
    </div>
  )
}