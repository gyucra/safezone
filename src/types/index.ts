// ================================
// TIPOS PRINCIPALES DE SAFEZONE
// ================================

// Tipos de incidentes disponibles
export type IncidentType =
  | 'robo'
  | 'violencia'
  | 'accidente'
  | 'desaparicion'
  | 'disturbio'
  | 'emergencia_medica'
  | 'otro'

// Nivel de urgencia
export type UrgencyLevel = 'bajo' | 'medio' | 'alto' | 'critico'

// Estado del incidente
export type IncidentStatus = 'activo' | 'resuelto' | 'falso_reporte' | 'en_proceso'

// Rol del usuario
export type UserRole = 'ciudadano' | 'admin' | 'autoridad'

// ================================
// INTERFACES
// ================================

export interface Location {
  lat: number
  lng: number
  address?: string
  city?: string
  country?: string
}

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  reputation: number
  createdAt: string
  location?: Location
}

export interface Incident {
  id: string
  type: IncidentType
  title: string
  description: string
  location: Location
  urgency: UrgencyLevel
  status: IncidentStatus
  userId: string
  userName: string
  imageUrl?: string
  videoUrl?: string
  createdAt: string
  updatedAt: string
  verifiedCount: number
  views: number
}

export interface Alert {
  id: string
  incidentId: string
  message: string
  distance: number
  createdAt: string
  read: boolean
}

export interface SOSEvent {
  id: string
  userId: string
  userName: string
  location: Location
  createdAt: string
  status: 'activo' | 'resuelto'
  contacts: string[]
}

export interface DashboardStats {
  totalIncidents: number
  activeIncidents: number
  resolvedToday: number
  criticalZones: number
  activeUsers: number
  avgResponseTime: number
}

// ================================
// TIPOS PARA API
// ================================

export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}

export interface CreateIncidentDto {
  type: IncidentType
  title: string
  description: string
  location: Location
  urgency: UrgencyLevel
  imageUrl?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}