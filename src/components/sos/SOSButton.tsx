'use client'
import { useState } from 'react'
import { X, Phone, Shield } from 'lucide-react'

export default function SOSButton() {
  const [active, setActive] = useState(false)
  const [countdown, setCountdown] = useState(5)
  const [sent, setSent] = useState(false)

  const handleSOS = () => {
    setActive(true)
    setSent(false)
    setCountdown(5)
    let count = 5
    const interval = setInterval(() => {
      count--
      setCountdown(count)
      if (count === 0) {
        clearInterval(interval)
        setSent(true)
      }
    }, 1000)
  }

  const handleCancel = () => {
    setActive(false)
    setSent(false)
    setCountdown(5)
  }

  if (sent) return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999 }}>
      <div style={{ background: '#dc2626', color: 'white', borderRadius: '16px', padding: '16px', width: '280px', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Shield size={20} />
          <span style={{ fontWeight: 'bold' }}>¡SOS Enviado!</span>
        </div>
        <p style={{ fontSize: '13px', marginBottom: '12px', opacity: 0.9 }}>Tu ubicación fue compartida con tus contactos de emergencia.</p>
        <div style={{ display: 'flex', gap: '8px' }}>
          <a href="tel:911" style={{ flex: 1, background: 'white', color: '#dc2626', borderRadius: '10px', padding: '8px', fontSize: '13px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', textDecoration: 'none' }}>
            <Phone size={14} /> Llamar 911
          </a>
          <button onClick={handleCancel} style={{ flex: 1, background: '#b91c1c', color: 'white', borderRadius: '10px', padding: '8px', fontSize: '13px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )

  if (active) return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999 }}>
      <div style={{ background: '#111827', border: '2px solid #ef4444', color: 'white', borderRadius: '16px', padding: '16px', width: '280px', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontWeight: 'bold', color: '#f87171' }}>Enviando SOS en...</span>
          <button onClick={handleCancel} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>
        <div style={{ fontSize: '64px', fontWeight: '900', color: '#ef4444', textAlign: 'center', padding: '8px 0' }}>{countdown}</div>
        <p style={{ fontSize: '12px', color: '#6b7280', textAlign: 'center', marginBottom: '12px' }}>Se compartirá tu ubicación actual</p>
        <button onClick={handleCancel} style={{ width: '100%', background: '#374151', color: 'white', borderRadius: '10px', padding: '12px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>
          Cancelar
        </button>
      </div>
    </div>
  )

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999 }}>
      {/* Anillo pulsante */}
      <div style={{
        position: 'absolute', inset: '-4px', borderRadius: '50%',
        background: '#ef4444', opacity: 0.3,
        animation: 'ping 1.5s cubic-bezier(0,0,0.2,1) infinite'
      }} />
      <button
        onClick={handleSOS}
        style={{
          position: 'relative', width: '64px', height: '64px',
          background: '#dc2626', color: 'white', borderRadius: '50%',
          border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold',
          boxShadow: '0 0 30px rgba(220,38,38,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'transform 0.2s'
        }}
        onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.1)')}
        onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
      >
        SOS
      </button>
    </div>
  )
}