import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SafeZone — Seguridad Ciudadana',
  description: 'Plataforma inteligente de seguridad ciudadana',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-gray-950 text-white`}>
        {children}
      </body>
    </html>
  )
}