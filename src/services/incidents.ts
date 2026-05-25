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
// Subir una foto a S3 y devolver su URL pública
export async function uploadPhoto(file: File): Promise<string> {
  // 1. Pedir a la API una URL temporal de subida
  const res = await fetch(`${API_URL}/upload-url`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fileType: file.type }),
  })
  if (!res.ok) throw new Error('Error al obtener URL de subida')
  const { uploadUrl, publicUrl } = await res.json()

  // 2. Subir la foto directo a S3 con esa URL
  const upload = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file,
  })
  if (!upload.ok) throw new Error('Error al subir la foto')

  // 3. Devolver la URL pública para guardarla en el incidente
  return publicUrl
}