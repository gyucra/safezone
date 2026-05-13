import { create } from 'zustand'
import { User, Incident, Alert, Location } from '@/types'

// ================================
// STORE PRINCIPAL DE SAFEZONE
// Maneja el estado global de toda la app
// ================================

interface AppStore {
  // Usuario actual
  user: User | null
  setUser: (user: User | null) => void

  // Ubicación actual del usuario
  userLocation: Location | null
  setUserLocation: (location: Location) => void

  // Incidentes en el mapa
  incidents: Incident[]
  setIncidents: (incidents: Incident[]) => void
  addIncident: (incident: Incident) => void
  updateIncident: (id: string, incident: Partial<Incident>) => void

  // Alertas del usuario
  alerts: Alert[]
  setAlerts: (alerts: Alert[]) => void
  addAlert: (alert: Alert) => void
  markAlertAsRead: (id: string) => void
  unreadAlertsCount: number

  // Filtros del mapa
  activeFilters: string[]
  setActiveFilters: (filters: string[]) => void
  toggleFilter: (filter: string) => void

  // SOS activo
  sosActive: boolean
  setSosActive: (active: boolean) => void

  // Loading global
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

export const useAppStore = create<AppStore>((set, get) => ({
  // Usuario
  user: null,
  setUser: (user) => set({ user }),

  // Ubicación
  userLocation: null,
  setUserLocation: (location) => set({ userLocation: location }),

  // Incidentes
  incidents: [],
  setIncidents: (incidents) => set({ incidents }),
  addIncident: (incident) =>
    set((state) => ({ incidents: [incident, ...state.incidents] })),
  updateIncident: (id, updated) =>
    set((state) => ({
      incidents: state.incidents.map((inc) =>
        inc.id === id ? { ...inc, ...updated } : inc
      ),
    })),

  // Alertas
  alerts: [],
  setAlerts: (alerts) => set({ alerts }),
  addAlert: (alert) =>
    set((state) => ({
      alerts: [alert, ...state.alerts],
      unreadAlertsCount: state.unreadAlertsCount + 1,
    })),
  markAlertAsRead: (id) =>
    set((state) => ({
      alerts: state.alerts.map((a) =>
        a.id === id ? { ...a, read: true } : a
      ),
      unreadAlertsCount: Math.max(0, state.unreadAlertsCount - 1),
    })),
  unreadAlertsCount: 0,

  // Filtros
  activeFilters: [],
  setActiveFilters: (filters) => set({ activeFilters: filters }),
  toggleFilter: (filter) =>
    set((state) => ({
      activeFilters: state.activeFilters.includes(filter)
        ? state.activeFilters.filter((f) => f !== filter)
        : [...state.activeFilters, filter],
    })),

  // SOS
  sosActive: false,
  setSosActive: (active) => set({ sosActive: active }),

  // Loading
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
}))