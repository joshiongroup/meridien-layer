import { create } from 'zustand'
import { TEAMS, type TeamId } from '../mock/data'

type View = 'alignment' | 'duplicates' | 'dependencies' | 'capacity'

interface AppState {
  // Auth (mock)
  isAuthenticated: boolean
  userName: string
  userEmail: string

  // Navigation
  activeView: View

  // Filters
  selectedTeams: TeamId[]
  selectedSprintId: number

  // UI
  sidebarCollapsed: boolean

  // Actions
  login: () => void
  logout: () => void
  setActiveView: (view: View) => void
  toggleTeam: (teamId: TeamId) => void
  setSelectedTeams: (teams: TeamId[]) => void
  setSelectedSprintId: (id: number) => void
  setSidebarCollapsed: (val: boolean) => void
}

export const useAppStore = create<AppState>((set) => ({
  isAuthenticated: false,
  userName: 'Alex Rivera',
  userEmail: 'alex.rivera@acme.io',

  activeView: 'alignment',

  selectedTeams: TEAMS.map(t => t.id),
  selectedSprintId: 42,

  sidebarCollapsed: false,

  login:   () => set({ isAuthenticated: true }),
  logout:  () => set({ isAuthenticated: false }),

  setActiveView: (view) => set({ activeView: view }),

  toggleTeam: (teamId) =>
    set(state => ({
      selectedTeams: state.selectedTeams.includes(teamId)
        ? state.selectedTeams.filter(id => id !== teamId)
        : [...state.selectedTeams, teamId],
    })),

  setSelectedTeams: (teams) => set({ selectedTeams: teams }),
  setSelectedSprintId: (id) => set({ selectedSprintId: id }),
  setSidebarCollapsed: (val) => set({ sidebarCollapsed: val }),
}))
