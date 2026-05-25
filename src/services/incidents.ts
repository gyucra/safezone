import { Incident, CreateIncidentDto } from '@/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL!

// Listar todos los incidentes
export async function getIncidents(): Promise<Incident[]> {
  const res = await fetch(API_URL, { method: 'GET' })
  if (!res.ok) throw new Error('Error al cargar incidentes')
  return res.json()
}

// Crear un nuevo incidente
export async function createIncident(
  data: CreateIncidentDto & { userId?: string; userName?: string }
): Promise<Incident> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Error al crear incidente')
  return res.json()
}