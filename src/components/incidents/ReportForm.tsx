'use client'
import { useState, useEffect } from 'react'
import { MapPin, Camera, AlertTriangle, X, Check, Loader } from 'lucide-react'
import { CreateIncidentDto, IncidentType, UrgencyLevel, Location } from '@/types'
import { INCIDENT_ICONS } from '@/lib/map'
import { createIncident, uploadPhoto } from '@/services/incidents'
import { useAppStore } from '@/store/useAppStore'

interface ReportFormProps {
  onClose: () => void
  onSuccess: (incident: CreateIncidentDto) => void
}

const INCIDENT_TYPES: { value: IncidentType; label: string }[] = [
  { value: 'robo', label: 'Robo' },
  { value: 'violencia', label: 'Violencia' },
  { value: 'accidente', label: 'Accidente' },
  { value: 'desaparicion', label: 'Desaparición' },
  { value: 'disturbio', label: 'Disturbio' },
  { value: 'emergencia_medica', label: 'Emergencia médica' },
  { value: 'otro', label: 'Otro' },
]

const URGENCY_LEVELS: { value: UrgencyLevel; label: string; color: string }[] = [
  { value: 'bajo', label: 'Bajo', color: '#16a34a' },
  { value: 'medio', label: 'Medio', color: '#ca8a04' },
  { value: 'alto', label: 'Alto', color: '#ea580c' },
  { value: 'critico', label: 'Crítico', color: '#dc2626' },
]

export default function ReportForm({ onClose, onSuccess }: ReportFormProps) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [locating, setLocating] = useState(false)
  const [success, setSuccess] = useState(false)
  const addIncident = useAppStore(s => s.addIncident)
  const user = useAppStore(s => s.user)
  const [photo, setPhoto] = useState<File | null>(null)

  const [form, setForm] = useState<CreateIncidentDto>({
    type: 'robo',
    title: '',
    description: '',
    urgency: 'medio',
    location: { lat: 0, lng: 0, address: '' },
  })

  // Obtener ubicación GPS automáticamente al abrir
  useEffect(() => {
    getLocation()
  }, [])

  const getLocation = () => {
    setLocating(true)
    if (!navigator.geolocation) {
      setLocating(false)
      return
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords
        // Reverse geocoding con OpenStreetMap (gratis)
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          )
          const data = await res.json()
          const address = data.display_name?.split(',').slice(0, 3).join(',') || 'Ubicación detectada'
          setForm(f => ({
            ...f,
            location: { lat: latitude, lng: longitude, address }
          }))
        } catch {
          setForm(f => ({
            ...f,
            location: { lat: latitude, lng: longitude, address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}` }
          }))
        }
        setLocating(false)
      },
      () => setLocating(false),
      { timeout: 10000 }
    )
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      // Si hay foto, súbela primero a S3
      let imageUrl = ''
      if (photo) {
        imageUrl = await uploadPhoto(photo)
      }
      const nuevo = await createIncident({
        ...form,
        imageUrl,
        userId: user?.id || 'anonimo',
        userName: user?.name || 'Ciudadano',
      })
      addIncident(nuevo)          // lo agrega al store para que aparezca al instante
      setLoading(false)
      setSuccess(true)
      setTimeout(() => {
        onSuccess(form)
        onClose()
      }, 2000)
    } catch (err) {
      setLoading(false)
      alert('Error al enviar el reporte. Intenta de nuevo.')
    }
  }

  if (success) return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
    }}>
      <div style={{
        background: '#052e16', border: '2px solid #16a34a',
        borderRadius: '20px', padding: '40px', textAlign: 'center', maxWidth: '320px'
      }}>
        <div style={{
          width: '64px', height: '64px', background: '#16a34a',
          borderRadius: '50%', display: 'flex', alignItems: 'center',
          justifyContent: 'center', margin: '0 auto 16px'
        }}>
          <Check size={32} color="white" />
        </div>
        <h3 style={{ color: 'white', fontWeight: '900', fontSize: '20px', marginBottom: '8px' }}>
          ¡Reporte enviado!
        </h3>
        <p style={{ color: '#86efac', fontSize: '14px' }}>
          Tu incidente fue reportado. Las autoridades y usuarios cercanos serán notificados.
        </p>
      </div>
    </div>
  )

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999, padding: '16px'
    }}>
      <div style={{
        background: '#111827', border: '1px solid #1f2937',
        borderRadius: '20px', width: '100%', maxWidth: '480px',
        maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column'
      }}>

        {/* Header */}
        <div style={{
          padding: '20px 24px 16px',
          borderBottom: '1px solid #1f2937',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <div>
            <h2 style={{ color: 'white', fontWeight: '900', fontSize: '18px' }}>
              Reportar incidente
            </h2>
            <p style={{ color: '#6b7280', fontSize: '13px', marginTop: '2px' }}>
              Paso {step} de 2
            </p>
          </div>
          <button onClick={onClose} style={{
            background: '#1f2937', border: 'none', color: '#9ca3af',
            borderRadius: '50%', width: '36px', height: '36px',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <X size={18} />
          </button>
        </div>

        {/* Progress bar */}
        <div style={{ height: '3px', background: '#1f2937' }}>
          <div style={{
            width: step === 1 ? '50%' : '100%',
            height: '100%', background: '#dc2626',
            transition: 'width 0.3s ease'
          }} />
        </div>

        {/* Contenido */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>

          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

              {/* Tipo de incidente */}
              <div>
                <label style={{ color: '#d1d5db', fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '10px' }}>
                  Tipo de incidente
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                  {INCIDENT_TYPES.map(type => (
                    <button
                      key={type.value}
                      onClick={() => setForm(f => ({ ...f, type: type.value }))}
                      style={{
                        background: form.type === type.value ? '#450a0a' : '#1f2937',
                        border: `2px solid ${form.type === type.value ? '#dc2626' : '#374151'}`,
                        borderRadius: '10px', padding: '10px 12px',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                        transition: 'all 0.2s'
                      }}
                    >
                      <span>{INCIDENT_ICONS[type.value]}</span>
                      <span style={{
                        color: form.type === type.value ? '#fca5a5' : '#d1d5db',
                        fontSize: '13px', fontWeight: '500'
                      }}>
                        {type.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Urgencia */}
              <div>
                <label style={{ color: '#d1d5db', fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '10px' }}>
                  Nivel de urgencia
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {URGENCY_LEVELS.map(u => (
                    <button
                      key={u.value}
                      onClick={() => setForm(f => ({ ...f, urgency: u.value }))}
                      style={{
                        flex: 1, padding: '8px 4px',
                        background: form.urgency === u.value ? u.color + '30' : '#1f2937',
                        border: `2px solid ${form.urgency === u.value ? u.color : '#374151'}`,
                        borderRadius: '10px', cursor: 'pointer',
                        color: form.urgency === u.value ? u.color : '#9ca3af',
                        fontSize: '12px', fontWeight: '700', transition: 'all 0.2s'
                      }}
                    >
                      {u.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ubicación GPS */}
              <div>
                <label style={{ color: '#d1d5db', fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '10px' }}>
                  Ubicación
                </label>
                <div style={{
                  background: '#1f2937', border: '1px solid #374151',
                  borderRadius: '10px', padding: '12px',
                  display: 'flex', alignItems: 'center', gap: '10px'
                }}>
                  {locating ? (
                    <Loader size={16} color="#dc2626" style={{ animation: 'spin 1s linear infinite', flexShrink: 0 }} />
                  ) : (
                    <MapPin size={16} color={form.location.lat ? '#22c55e' : '#6b7280'} style={{ flexShrink: 0 }} />
                  )}
                  <span style={{
                    color: form.location.lat ? '#d1d5db' : '#6b7280',
                    fontSize: '13px', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                  }}>
                    {locating ? 'Obteniendo ubicación...' : form.location.address || 'No se pudo obtener ubicación'}
                  </span>
                  <button
                    onClick={getLocation}
                    style={{
                      background: '#374151', border: 'none', color: '#9ca3af',
                      borderRadius: '6px', padding: '4px 8px', cursor: 'pointer', fontSize: '11px'
                    }}
                  >
                    Actualizar
                  </button>
                </div>
              </div>

            </div>
          )}

          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

              {/* Título */}
              <div>
                <label style={{ color: '#d1d5db', fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
                  Título del incidente
                </label>
                <input
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="Ej: Robo en esquina de Av. Larco"
                  style={{
                    width: '100%', background: '#1f2937', border: '1px solid #374151',
                    borderRadius: '10px', padding: '10px 14px', color: 'white',
                    fontSize: '14px', outline: 'none', boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Descripción */}
              <div>
                <label style={{ color: '#d1d5db', fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
                  Descripción
                </label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Describe lo que está pasando con el mayor detalle posible..."
                  rows={4}
                  style={{
                    width: '100%', background: '#1f2937', border: '1px solid #374151',
                    borderRadius: '10px', padding: '10px 14px', color: 'white',
                    fontSize: '14px', outline: 'none', resize: 'none',
                    boxSizing: 'border-box', fontFamily: 'inherit'
                  }}
                />
              </div>

              {/* Foto */}
              <div>
                <label style={{ color: '#d1d5db', fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
                  Foto/Video <span style={{ color: '#6b7280', fontWeight: 'normal' }}>(opcional)</span>
                </label>
                <label style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  justifyContent: 'center', gap: '8px', padding: '24px',
                  background: '#1f2937', border: '2px dashed #374151',
                  borderRadius: '10px', cursor: 'pointer'
                }}>
                  <Camera size={24} color={photo ? '#22c55e' : '#6b7280'} />
                  <span style={{ color: photo ? '#86efac' : '#6b7280', fontSize: '13px' }}>
                    {photo ? photo.name : 'Toca para adjuntar evidencia'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={e => setPhoto(e.target.files?.[0] || null)}
                  />
                </label>
              </div>

              {/* Resumen */}
              <div style={{
                background: '#1f2937', borderRadius: '10px', padding: '12px',
                display: 'flex', alignItems: 'center', gap: '10px'
              }}>
                <span style={{ fontSize: '24px' }}>{INCIDENT_ICONS[form.type]}</span>
                <div>
                  <p style={{ color: '#9ca3af', fontSize: '11px' }}>Resumen</p>
                  <p style={{ color: 'white', fontSize: '13px', fontWeight: '600' }}>
                    {INCIDENT_TYPES.find(t => t.value === form.type)?.label} · Urgencia {URGENCY_LEVELS.find(u => u.value === form.urgency)?.label}
                  </p>
                  <p style={{ color: '#6b7280', fontSize: '11px', marginTop: '2px' }}>
                    📍 {form.location.address || 'Sin ubicación'}
                  </p>
                </div>
              </div>

            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid #1f2937',
          display: 'flex', gap: '12px'
        }}>
          {step === 2 && (
            <button
              onClick={() => setStep(1)}
              style={{
                flex: 1, background: '#1f2937', border: 'none',
                color: 'white', borderRadius: '12px', padding: '12px',
                fontWeight: 'bold', cursor: 'pointer', fontSize: '14px'
              }}
            >
              Atrás
            </button>
          )}
          <button
            onClick={() => step === 1 ? setStep(2) : handleSubmit()}
            disabled={loading || (step === 2 && (!form.title || !form.description))}
            style={{
              flex: 2, background: loading ? '#7f1d1d' : '#dc2626',
              border: 'none', color: 'white', borderRadius: '12px', padding: '12px',
              fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '14px', display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: '8px', opacity: (step === 2 && (!form.title || !form.description)) ? 0.5 : 1
            }}
          >
            {loading && <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} />}
            {loading ? 'Enviando...' : step === 1 ? 'Siguiente →' : '🚨 Enviar reporte'}
          </button>
        </div>
      </div>
    </div>
  )
}