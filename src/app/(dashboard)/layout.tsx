'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Shield, Map, AlertTriangle, Bell, LayoutDashboard } from 'lucide-react'
import SOSButton from '@/components/sos/SOSButton'

const navItems = [
  { href: '/map', icon: <Map size={20} />, label: 'Mapa' },
  { href: '/incidents', icon: <AlertTriangle size={20} />, label: 'Incidentes' },
  { href: '/admin', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

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
            Y
          </div>
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