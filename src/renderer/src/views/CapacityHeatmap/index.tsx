import React, { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { BarChart3, User, AlertTriangle, TrendingDown } from 'lucide-react'
import { SPRINTS, TEAMS, getTeamLoad, type TeamId } from '../../mock/data'
import { useAppStore } from '../../store/appStore'
import { cn, loadColor, loadLabel } from '../../lib/utils'

const CAPACITY_THRESHOLD = 8

export function CapacityHeatmap() {
  const { selectedTeams, selectedSprintId } = useAppStore()
  const [drillTeam, setDrillTeam] = useState<TeamId | null>(null)

  const sprint = SPRINTS.find(s => s.sprintId === selectedSprintId)!
  const visibleTeams = TEAMS.filter(t => selectedTeams.includes(t.id))

  const teamData = visibleTeams.map(team => {
    const td = sprint.teams.find(t => t.teamId === team.id)!
    const ptsPerDev = parseFloat((td.totalPoints / td.memberCount).toFixed(1))
    return { team, td, ptsPerDev }
  })

  const overloaded  = teamData.filter(d => d.ptsPerDev > CAPACITY_THRESHOLD)
  const available   = teamData.filter(d => d.ptsPerDev < 5)
  const totalPoints = teamData.reduce((a, d) => a + d.td.totalPoints, 0)

  const drillData = drillTeam
    ? sprint.teams.find(t => t.teamId === drillTeam)
    : null
  const drillTeamInfo = TEAMS.find(t => t.id === drillTeam)

  return (
    <div className="h-full flex flex-col gap-4 overflow-hidden">
      {/* Summary */}
      <div className="grid grid-cols-4 gap-3 flex-shrink-0">
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
          <div className="flex items-center gap-1.5 mb-2">
            <AlertTriangle size={13} className="text-red-400" />
            <span className="text-xs text-red-400">Overloaded teams</span>
          </div>
          <div className="text-2xl font-bold text-white">{overloaded.length}</div>
          <div className="text-[11px] text-gray-600">&gt;{CAPACITY_THRESHOLD} pts/dev threshold</div>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <div className="flex items-center gap-1.5 mb-2">
            <TrendingDown size={13} className="text-blue-400" />
            <span className="text-xs text-blue-400">Teams with slack</span>
          </div>
          <div className="text-2xl font-bold text-white">{available.length}</div>
          <div className="text-[11px] text-gray-600">&lt;5 pts/dev available</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="text-xs text-gray-400 mb-2">Total sprint points</div>
          <div className="text-2xl font-bold text-white">{totalPoints}</div>
          <div className="text-[11px] text-gray-600">across {visibleTeams.length} teams</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="text-xs text-gray-400 mb-2">Sprint status</div>
          <div className="text-2xl font-bold text-white capitalize">{sprint.state}</div>
          <div className="text-[11px] text-gray-600">{sprint.startDate} → {sprint.endDate}</div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex gap-4 min-h-0">
        {/* Team heatmap cards */}
        <div className="flex-1 flex flex-col gap-3 overflow-y-auto">
          {teamData.map(({ team, td, ptsPerDev }) => {
            const color = loadColor(ptsPerDev)
            const label = loadLabel(ptsPerDev)
            const pct = Math.min(100, (td.completedPoints / td.totalPoints) * 100) || 0
            const isActive = drillTeam === team.id

            return (
              <div
                key={team.id}
                onClick={() => setDrillTeam(drillTeam === team.id ? null : team.id)}
                className={cn(
                  'bg-[#0f0f1a] border rounded-2xl p-4 cursor-pointer transition-all hover:border-white/15',
                  isActive ? 'border-white/20' : 'border-white/5'
                )}
              >
                <div className="flex items-center gap-3 mb-3">
                  {/* Team identity */}
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold text-white"
                    style={{ backgroundColor: team.color + '33', border: `1px solid ${team.color}66` }}
                  >
                    <span style={{ color: team.color }}>{team.name.charAt(5)}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white">{team.name}</span>
                      <span className="text-xs text-gray-600">{team.focus}</span>
                    </div>
                    <div className="text-xs text-gray-600">{team.lead} · {td.memberCount} devs</div>
                  </div>

                  {/* Load badge */}
                  <div
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl border"
                    style={{
                      backgroundColor: color + '18',
                      borderColor: color + '40',
                    }}
                  >
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                    <span className="text-xs font-semibold" style={{ color }}>{label}</span>
                    <span className="text-xs font-mono text-gray-400">{ptsPerDev} pt/dev</span>
                  </div>

                  {/* Stats */}
                  <div className="text-right">
                    <div className="text-sm font-bold text-white">{td.totalPoints}<span className="text-xs text-gray-600 font-normal"> pts</span></div>
                    {sprint.state === 'active' && (
                      <div className="text-[11px] text-gray-600">{td.completedPoints} done</div>
                    )}
                  </div>
                </div>

                {/* Progress bar */}
                {sprint.state === 'active' && (
                  <div>
                    <div className="flex justify-between text-[10px] text-gray-600 mb-1">
                      <span>Sprint progress</span>
                      <span>{Math.round(pct)}%</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${pct}%`, backgroundColor: color }}
                      />
                    </div>
                  </div>
                )}

                {/* Member dots row */}
                <div className="flex items-center gap-1.5 mt-3">
                  {td.members.map(m => (
                    <div
                      key={m.name}
                      title={`${m.name}: ${m.assignedPoints}pts`}
                      className={cn(
                        'w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white border-2',
                        m.status === 'overloaded' ? 'border-red-500'    :
                        m.status === 'optimal'    ? 'border-emerald-500' :
                                                    'border-blue-500/50'
                      )}
                      style={{ backgroundColor: team.color + '33' }}
                    >
                      {m.avatar}
                    </div>
                  ))}
                  <span className="ml-2 text-[10px] text-gray-600">
                    {td.members.filter(m => m.status === 'overloaded').length > 0 &&
                      `${td.members.filter(m => m.status === 'overloaded').length} overloaded`}
                    {td.members.filter(m => m.status === 'available').length > 0 &&
                      ` · ${td.members.filter(m => m.status === 'available').length} available`}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Drill-down panel */}
        {drillData && drillTeamInfo ? (
          <div className="w-[300px] flex-shrink-0 bg-[#0f0f1a] border border-white/5 rounded-2xl flex flex-col overflow-hidden">
            <div
              className="px-5 py-4 border-b border-white/5"
              style={{ borderLeftColor: drillTeamInfo.color, borderLeftWidth: 3 }}
            >
              <div className="text-sm font-semibold text-white">{drillTeamInfo.name}</div>
              <div className="text-xs text-gray-500">Per-developer allocation</div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {/* Bar chart */}
              <div className="h-48 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={drillData.members.map(m => ({
                      name: m.name.split(' ')[0],
                      pts: m.assignedPoints,
                      status: m.status,
                    }))}
                    margin={{ top: 4, right: 4, bottom: 24, left: 4 }}
                  >
                    <XAxis
                      dataKey="name"
                      tick={{ fill: '#6b7280', fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: '#6b7280', fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                      width={24}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1a1a2e',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 8,
                        fontSize: 11,
                        color: '#fff',
                      }}
                      cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    />
                    {/* Threshold line */}
                    <Bar dataKey="pts" radius={[4, 4, 0, 0]}>
                      {drillData.members.map((m, i) => (
                        <Cell key={i} fill={loadColor(m.assignedPoints)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Member rows */}
              <div className="space-y-2">
                {drillData.members.map(m => {
                  const c = loadColor(m.assignedPoints)
                  return (
                    <div key={m.name} className="flex items-center gap-2.5">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0"
                        style={{ backgroundColor: drillTeamInfo.color + '44' }}
                      >
                        {m.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-white/80 truncate">{m.name}</span>
                          <span className="text-xs font-mono font-bold" style={{ color: c }}>{m.assignedPoints}pt</span>
                        </div>
                        <div className="h-1 bg-white/5 rounded-full mt-1 overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${Math.min(100, (m.assignedPoints / 20) * 100)}%`,
                              backgroundColor: c,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Threshold note */}
              <div className="mt-4 p-3 bg-white/3 border border-white/8 rounded-xl">
                <div className="text-[10px] text-gray-500">
                  Capacity threshold: <span className="text-white font-semibold">{CAPACITY_THRESHOLD} pts/dev</span>
                </div>
                <div className="text-[10px] text-gray-600 mt-0.5">
                  🔴 &gt;12  🟠 10–12  🟢 7–10  🔵 4–7  ⚫ &lt;4
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-[300px] flex-shrink-0 bg-[#0f0f1a] border border-white/5 rounded-2xl flex items-center justify-center">
            <div className="text-center text-gray-600">
              <BarChart3 size={28} className="mx-auto mb-2 opacity-30" />
              <p className="text-xs">Click a team to<br />see member allocation</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
