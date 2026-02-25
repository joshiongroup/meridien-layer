import React, { useState } from 'react'
import { AlertTriangle, CheckCircle2, Users, Flame, Info } from 'lucide-react'
import { TEAMS, FEATURES, getAlignmentEntry, type TeamId } from '../../mock/data'
import { useAppStore } from '../../store/appStore'
import { cn, priorityColor, statusColor } from '../../lib/utils'

export function FeatureAlignmentMap() {
  const { selectedTeams } = useAppStore()
  const [hoveredCell, setHoveredCell] = useState<{ teamId: TeamId; featureId: string } | null>(null)
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null)

  const visibleTeams = TEAMS.filter(t => selectedTeams.includes(t.id))

  // Stats
  const totalCells = visibleTeams.length * FEATURES.length
  const filledCells = FEATURES.reduce((acc, feat) =>
    acc + visibleTeams.filter(t => getAlignmentEntry(t.id, feat.id)).length, 0)
  const gapCount = totalCells - filledCells
  const multiTeamFeatures = FEATURES.filter(f =>
    visibleTeams.filter(t => getAlignmentEntry(t.id, f.id)).length > 1)

  return (
    <div className="h-full flex flex-col gap-4 overflow-hidden">
      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-3 flex-shrink-0">
        <SummaryCard
          icon={<CheckCircle2 size={15} className="text-emerald-400" />}
          label="Features in flight"
          value={`${filledCells}`}
          sub={`of ${totalCells} team-feature slots`}
          color="emerald"
        />
        <SummaryCard
          icon={<AlertTriangle size={15} className="text-amber-400" />}
          label="Coverage gaps"
          value={`${gapCount}`}
          sub="teams with no tickets on feature"
          color="amber"
        />
        <SummaryCard
          icon={<Users size={15} className="text-brand-400" />}
          label="Multi-team features"
          value={`${multiTeamFeatures.length}`}
          sub={`of ${FEATURES.length} features have 2+ teams`}
          color="brand"
        />
        <SummaryCard
          icon={<Flame size={15} className="text-red-400" />}
          label="At risk / Behind"
          value={`${FEATURES.reduce((acc, f) => acc + visibleTeams.filter(t => {
            const e = getAlignmentEntry(t.id, f.id)
            return e && (e.status === 'at-risk' || e.status === 'behind')
          }).length, 0)}`}
          sub="team-feature entries off track"
          color="red"
        />
      </div>

      {/* Matrix */}
      <div className="flex-1 bg-[#0f0f1a] border border-white/5 rounded-2xl overflow-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {/* Corner */}
              <th className="sticky top-0 left-0 z-20 bg-[#0f0f1a] border-b border-r border-white/5 px-4 py-3 text-left min-w-[160px]">
                <span className="text-xs text-gray-500 font-medium">Team ↓  &nbsp; Feature →</span>
              </th>
              {FEATURES.map(f => (
                <th
                  key={f.id}
                  className={cn(
                    'sticky top-0 z-10 bg-[#0f0f1a] border-b border-r border-white/5 px-3 py-3 cursor-pointer transition-colors min-w-[140px]',
                    selectedFeature === f.id ? 'bg-brand-600/10' : 'hover:bg-white/3'
                  )}
                  onClick={() => setSelectedFeature(selectedFeature === f.id ? null : f.id)}
                >
                  <div className="text-left">
                    <div className="text-xs font-semibold text-white/90 leading-tight mb-1 whitespace-nowrap overflow-hidden text-ellipsis max-w-[130px]">{f.name}</div>
                    <div className="flex items-center gap-1.5">
                      <span className={cn('text-[10px] px-1.5 py-0.5 rounded-md border font-medium capitalize', priorityColor(f.priority))}>
                        {f.priority}
                      </span>
                      <span className="text-[10px] text-gray-600">{f.quarter}</span>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleTeams.map((team, ti) => (
              <tr key={team.id} className={ti % 2 === 0 ? 'bg-[#0f0f1a]' : 'bg-white/[0.015]'}>
                {/* Team label */}
                <td className="sticky left-0 z-10 border-r border-white/5 px-4 py-3 bg-inherit">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: team.color }}
                    />
                    <div>
                      <div className="text-xs font-semibold text-white whitespace-nowrap">{team.name}</div>
                      <div className="text-[10px] text-gray-600">{team.focus}</div>
                    </div>
                  </div>
                </td>

                {/* Feature cells */}
                {FEATURES.map(f => {
                  const entry = getAlignmentEntry(team.id, f.id)
                  const isHovered = hoveredCell?.teamId === team.id && hoveredCell?.featureId === f.id
                  const isSelectedCol = selectedFeature === f.id

                  if (!entry) {
                    return (
                      <td
                        key={f.id}
                        className={cn(
                          'border-r border-b border-white/5 px-3 py-3 text-center transition-colors',
                          isSelectedCol ? 'bg-amber-500/5' : ''
                        )}
                        onMouseEnter={() => setHoveredCell({ teamId: team.id, featureId: f.id })}
                        onMouseLeave={() => setHoveredCell(null)}
                      >
                        <div className="flex items-center justify-center h-full">
                          <span className="text-[10px] text-gray-700 italic">—  gap</span>
                        </div>
                      </td>
                    )
                  }

                  return (
                    <td
                      key={f.id}
                      className={cn(
                        'border-r border-b border-white/5 px-3 py-2.5 cursor-default transition-all',
                        isSelectedCol ? 'bg-brand-600/5' : '',
                        isHovered ? 'bg-white/5' : ''
                      )}
                      onMouseEnter={() => setHoveredCell({ teamId: team.id, featureId: f.id })}
                      onMouseLeave={() => setHoveredCell(null)}
                    >
                      <div
                        className="rounded-lg px-2 py-1.5 border"
                        style={{
                          backgroundColor: team.color + '18',
                          borderColor: team.color + '40',
                        }}
                      >
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className={cn('text-[10px] px-1.5 py-0.5 rounded-md font-medium capitalize', statusColor(entry.status))}>
                            {entry.status.replace('-', ' ')}
                          </span>
                          <span className="text-[10px] text-gray-400 font-mono">{entry.storyPoints}pt</span>
                        </div>
                        <div className="text-[10px] text-gray-500">{entry.issueCount} issues</div>
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 flex-shrink-0 px-1">
        <span className="text-xs text-gray-600">Legend:</span>
        {[
          { label: 'On track',    cls: 'bg-emerald-500/20 text-emerald-300' },
          { label: 'At risk',     cls: 'bg-yellow-500/20 text-yellow-300'   },
          { label: 'Behind',      cls: 'bg-red-500/20 text-red-300'         },
          { label: 'Gap',         cls: 'bg-transparent text-gray-700 italic' },
        ].map(l => (
          <div key={l.label} className="flex items-center gap-1.5">
            <span className={cn('text-[10px] px-2 py-0.5 rounded-md', l.cls)}>{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function SummaryCard({ icon, label, value, sub, color }: {
  icon: React.ReactNode
  label: string
  value: string
  sub: string
  color: string
}) {
  const colors: Record<string, string> = {
    emerald: 'border-emerald-500/20 bg-emerald-500/5',
    amber:   'border-amber-500/20 bg-amber-500/5',
    brand:   'border-brand-500/20 bg-brand-500/5',
    red:     'border-red-500/20 bg-red-500/5',
  }
  return (
    <div className={cn('rounded-xl border p-4', colors[color])}>
      <div className="flex items-center gap-2 mb-2">{icon}<span className="text-xs text-gray-400">{label}</span></div>
      <div className="text-2xl font-bold text-white mb-0.5">{value}</div>
      <div className="text-[11px] text-gray-600">{sub}</div>
    </div>
  )
}
