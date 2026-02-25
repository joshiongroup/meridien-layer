import React from 'react'
import { Layers, GitMerge, Zap, BarChart3, LogOut, ChevronLeft, ChevronRight } from 'lucide-react'
import { useAppStore } from '../../store/appStore'
import { cn } from '../../lib/utils'

const NAV_ITEMS = [
  { id: 'alignment',    label: 'Feature Alignment',    icon: Layers,    color: 'text-brand-400'   },
  { id: 'duplicates',   label: 'Duplicate Work',       icon: GitMerge,  color: 'text-cyan-400'    },
  { id: 'dependencies', label: 'Dependency Graph',     icon: Zap,       color: 'text-amber-400'   },
  { id: 'capacity',     label: 'Capacity Heatmap',     icon: BarChart3, color: 'text-emerald-400' },
] as const

export function Sidebar() {
  const { activeView, setActiveView, sidebarCollapsed, setSidebarCollapsed, logout, userName, userEmail } = useAppStore()

  return (
    <aside
      className={cn(
        'flex flex-col bg-[#0f0f1a] border-r border-white/5 transition-all duration-200 relative',
        sidebarCollapsed ? 'w-[60px]' : 'w-[220px]'
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/5 min-h-[64px]">
        <div className="w-7 h-7 min-w-[28px] rounded-lg bg-brand-600 flex items-center justify-center">
          <Layers size={14} className="text-white" />
        </div>
        {!sidebarCollapsed && (
          <span className="text-sm font-semibold text-white tracking-tight truncate">
            Meridien Layer
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {NAV_ITEMS.map(item => {
          const Icon = item.icon
          const active = activeView === item.id
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              title={sidebarCollapsed ? item.label : undefined}
              className={cn(
                'w-full flex items-center gap-3 px-2.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-100',
                active
                  ? 'bg-brand-600/20 text-white'
                  : 'text-gray-500 hover:text-gray-300 hover:bg-white/5',
              )}
            >
              <Icon
                size={16}
                className={cn('min-w-[16px]', active ? item.color : 'text-current')}
              />
              {!sidebarCollapsed && (
                <span className="truncate">{item.label}</span>
              )}
              {!sidebarCollapsed && active && (
                <div className="ml-auto w-1 h-1 rounded-full bg-brand-400" />
              )}
            </button>
          )
        })}
      </nav>

      {/* User + logout */}
      <div className="border-t border-white/5 p-2 space-y-1">
        {!sidebarCollapsed && (
          <div className="flex items-center gap-2 px-2.5 py-2">
            <div className="w-6 h-6 rounded-full bg-brand-600 flex items-center justify-center text-xs font-bold text-white">
              {userName.charAt(0)}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-medium text-white truncate">{userName}</div>
              <div className="text-[10px] text-gray-600 truncate">{userEmail}</div>
            </div>
          </div>
        )}
        <button
          onClick={logout}
          title={sidebarCollapsed ? 'Sign out' : undefined}
          className="w-full flex items-center gap-3 px-2.5 py-2 rounded-xl text-xs text-gray-600 hover:text-gray-300 hover:bg-white/5 transition-all"
        >
          <LogOut size={14} className="min-w-[14px]" />
          {!sidebarCollapsed && 'Sign out'}
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        className="absolute -right-3 top-[72px] w-6 h-6 rounded-full bg-[#1a1a2e] border border-white/10 flex items-center justify-center text-gray-500 hover:text-white transition-colors z-10"
      >
        {sidebarCollapsed
          ? <ChevronRight size={12} />
          : <ChevronLeft size={12} />
        }
      </button>
    </aside>
  )
}
