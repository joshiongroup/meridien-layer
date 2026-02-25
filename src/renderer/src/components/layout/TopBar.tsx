import React from 'react'
import { RefreshCw, ChevronDown, Bell, Settings } from 'lucide-react'
import { useAppStore } from '../../store/appStore'
import { TEAMS } from '../../mock/data'
import { cn } from '../../lib/utils'

const VIEW_TITLES: Record<string, { title: string; subtitle: string }> = {
  alignment:    { title: 'Feature Alignment Map',  subtitle: 'Cross-team coverage of product features' },
  duplicates:   { title: 'Duplicate Work Detector',subtitle: 'Overlapping work items across teams'      },
  dependencies: { title: 'Dependency Graph',        subtitle: 'Shared services and components'           },
  capacity:     { title: 'Capacity Heatmap',        subtitle: 'Team load and developer allocation'       },
}

export function TopBar() {
  const { activeView, selectedTeams, toggleTeam, selectedSprintId, setSelectedSprintId } = useAppStore()
  const [refreshing, setRefreshing] = React.useState(false)
  const meta = VIEW_TITLES[activeView] || VIEW_TITLES.alignment

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 1200)
  }

  return (
    <header className="flex items-center gap-4 px-6 py-3 border-b border-white/5 bg-[#0a0a0f] min-h-[60px]">
      {/* Title */}
      <div className="min-w-0 flex-1">
        <h1 className="text-sm font-semibold text-white">{meta.title}</h1>
        <p className="text-xs text-gray-500">{meta.subtitle}</p>
      </div>

      {/* Sprint selector (only on capacity view) */}
      {activeView === 'capacity' && (
        <div className="flex items-center gap-1 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg cursor-pointer hover:bg-white/8 transition-colors">
          <span className="text-xs text-gray-300">
            {selectedSprintId === 42 ? 'Sprint 42 (Active)' : 'Sprint 43 (Upcoming)'}
          </span>
          <ChevronDown size={12} className="text-gray-500 ml-1" />
          <select
            className="absolute opacity-0 inset-0 cursor-pointer"
            value={selectedSprintId}
            onChange={e => setSelectedSprintId(Number(e.target.value))}
          />
        </div>
      )}

      {/* Sprint toggle buttons */}
      {activeView === 'capacity' && (
        <div className="flex items-center bg-white/5 border border-white/10 rounded-lg p-0.5">
          {[{ id: 42, label: 'Sprint 42' }, { id: 43, label: 'Sprint 43' }].map(s => (
            <button
              key={s.id}
              onClick={() => setSelectedSprintId(s.id)}
              className={cn(
                'px-3 py-1 rounded-md text-xs font-medium transition-all',
                selectedSprintId === s.id
                  ? 'bg-brand-600 text-white'
                  : 'text-gray-500 hover:text-gray-300'
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      )}

      {/* Team filters */}
      <div className="flex items-center gap-1.5">
        {TEAMS.map(team => {
          const active = selectedTeams.includes(team.id)
          return (
            <button
              key={team.id}
              onClick={() => toggleTeam(team.id)}
              title={team.name}
              className={cn(
                'px-2.5 py-1 rounded-lg text-xs font-medium border transition-all duration-100',
                active
                  ? 'text-white border-transparent'
                  : 'text-gray-600 border-white/10 hover:text-gray-400'
              )}
              style={active ? { backgroundColor: team.color + '33', borderColor: team.color + '66', color: team.color } : {}}
            >
              {team.name.split(' ')[1]}
            </button>
          )
        })}
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-1">
        <button
          onClick={handleRefresh}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-all"
        >
          <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
        </button>
        <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-all">
          <Bell size={14} />
        </button>
        <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-all">
          <Settings size={14} />
        </button>
      </div>
    </header>
  )
}
