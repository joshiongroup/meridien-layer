import React, { useState, useRef, useEffect } from 'react'
import { Zap, Database, Server, Package, HardDrive, GitBranch } from 'lucide-react'
import { DEPENDENCIES, TEAMS, type Dependency, type TeamId } from '../../mock/data'
import { useAppStore } from '../../store/appStore'
import { cn } from '../../lib/utils'

const DEP_ICONS: Record<string, React.ReactNode> = {
  service:  <Server  size={12} />,
  database: <Database size={12} />,
  library:  <Package size={12} />,
  queue:    <GitBranch size={12} />,
  storage:  <HardDrive size={12} />,
}

const RISK_COLORS = {
  high:   { bg: 'bg-red-500/20',    border: 'border-red-500/40',    text: 'text-red-400',    dot: '#ef4444' },
  medium: { bg: 'bg-amber-500/20',  border: 'border-amber-500/40',  text: 'text-amber-400',  dot: '#f59e0b' },
  low:    { bg: 'bg-emerald-500/20',border: 'border-emerald-500/40',text: 'text-emerald-400',dot: '#10b981' },
}

export function SharedDependencyGraph() {
  const { selectedTeams } = useAppStore()
  const [selected, setSelected] = useState<Dependency | null>(null)
  const [hovered, setHovered] = useState<string | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  const visibleDeps = DEPENDENCIES.filter(d =>
    d.teams.filter(t => selectedTeams.includes(t)).length >= 2
  )

  const stats = {
    high:   visibleDeps.filter(d => d.riskLevel === 'high').length,
    medium: visibleDeps.filter(d => d.riskLevel === 'medium').length,
    low:    visibleDeps.filter(d => d.riskLevel === 'low').length,
  }

  // Layout: teams in a ring on the left, dependencies in a column on the right
  // We compute SVG positions for nodes and draw edges
  const svgW = 640
  const svgH = 420

  const visibleTeams = TEAMS.filter(t => selectedTeams.includes(t.id))
  const teamPositions: Record<TeamId, { x: number; y: number }> = {} as any

  const teamRadius = 160
  const cx = 200
  const cy = svgH / 2

  visibleTeams.forEach((team, i) => {
    const angle = (i / visibleTeams.length) * Math.PI * 2 - Math.PI / 2
    teamPositions[team.id] = {
      x: cx + teamRadius * Math.cos(angle),
      y: cy + teamRadius * Math.sin(angle),
    }
  })

  const depY0 = 60
  const depYStep = Math.min(70, (svgH - 80) / visibleDeps.length)
  const depX = 530

  const depPositions: Record<string, { x: number; y: number }> = {}
  visibleDeps.forEach((dep, i) => {
    depPositions[dep.id] = { x: depX, y: depY0 + i * depYStep }
  })

  return (
    <div className="h-full flex flex-col gap-4 overflow-hidden">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 flex-shrink-0">
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
          <div className="text-xs text-red-400 mb-2">High risk deps</div>
          <div className="text-2xl font-bold text-white">{stats.high}</div>
          <div className="text-[11px] text-gray-600">shared by 3+ teams</div>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
          <div className="text-xs text-amber-400 mb-2">Medium risk deps</div>
          <div className="text-2xl font-bold text-white">{stats.medium}</div>
          <div className="text-[11px] text-gray-600">shared by 2 teams</div>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
          <div className="text-xs text-emerald-400 mb-2">Low risk deps</div>
          <div className="text-2xl font-bold text-white">{stats.low}</div>
          <div className="text-[11px] text-gray-600">minimal coordination</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="text-xs text-gray-400 mb-2">Total connections</div>
          <div className="text-2xl font-bold text-white">
            {visibleDeps.reduce((a, d) => a + d.teams.filter(t => selectedTeams.includes(t)).length, 0)}
          </div>
          <div className="text-[11px] text-gray-600">team-dependency edges</div>
        </div>
      </div>

      {/* Graph + Sidebar */}
      <div className="flex-1 flex gap-4 min-h-0">
        {/* SVG Canvas */}
        <div className="flex-1 bg-[#0f0f1a] border border-white/5 rounded-2xl overflow-hidden relative">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${svgW} ${svgH}`}
            width="100%"
            height="100%"
            className="w-full h-full"
          >
            <defs>
              {TEAMS.map(t => (
                <radialGradient key={t.id} id={`grad-${t.id}`} cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor={t.color} stopOpacity="0.3" />
                  <stop offset="100%" stopColor={t.color} stopOpacity="0.05" />
                </radialGradient>
              ))}
            </defs>

            {/* Edges */}
            {visibleDeps.map(dep => {
              const isHighlighted = hovered === dep.id || selected?.id === dep.id
              const riskDot = RISK_COLORS[dep.riskLevel].dot
              return dep.teams
                .filter(t => selectedTeams.includes(t))
                .map(teamId => {
                  const tp = teamPositions[teamId]
                  const dp = depPositions[dep.id]
                  if (!tp || !dp) return null
                  const mx = (tp.x + dp.x) / 2
                  return (
                    <path
                      key={`${dep.id}-${teamId}`}
                      d={`M ${tp.x} ${tp.y} C ${mx} ${tp.y}, ${mx} ${dp.y}, ${dp.x} ${dp.y}`}
                      stroke={isHighlighted ? riskDot : '#ffffff18'}
                      strokeWidth={isHighlighted ? 2 : 1}
                      fill="none"
                      strokeDasharray={isHighlighted ? '' : ''}
                      style={{ transition: 'all 0.15s' }}
                    />
                  )
                })
            })}

            {/* Team nodes */}
            {visibleTeams.map(team => {
              const pos = teamPositions[team.id]
              if (!pos) return null
              return (
                <g key={team.id} transform={`translate(${pos.x}, ${pos.y})`}>
                  <circle r={28} fill={`url(#grad-${team.id})`} />
                  <circle r={28} fill="none" stroke={team.color} strokeWidth={1.5} />
                  <circle r={22} fill={team.color + '15'} />
                  <text
                    textAnchor="middle"
                    y={4}
                    fill={team.color}
                    fontSize={11}
                    fontWeight="700"
                    fontFamily="-apple-system, sans-serif"
                  >
                    {team.name.split(' ')[1].slice(0, 3).toUpperCase()}
                  </text>
                  <text
                    textAnchor="middle"
                    y={44}
                    fill="#9ca3af"
                    fontSize={9}
                    fontFamily="-apple-system, sans-serif"
                  >
                    {team.name}
                  </text>
                </g>
              )
            })}

            {/* Dependency nodes */}
            {visibleDeps.map(dep => {
              const pos = depPositions[dep.id]
              if (!pos) return null
              const riskDot = RISK_COLORS[dep.riskLevel].dot
              const isActive = hovered === dep.id || selected?.id === dep.id
              return (
                <g
                  key={dep.id}
                  transform={`translate(${pos.x}, ${pos.y})`}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHovered(dep.id)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => setSelected(selected?.id === dep.id ? null : dep)}
                >
                  <rect
                    x={-72}
                    y={-14}
                    width={144}
                    height={28}
                    rx={7}
                    fill={isActive ? riskDot + '28' : '#1a1a2e'}
                    stroke={isActive ? riskDot : '#ffffff15'}
                    strokeWidth={1.5}
                    style={{ transition: 'all 0.15s' }}
                  />
                  <circle cx={-58} cy={0} r={4} fill={riskDot} />
                  <text
                    x={-48}
                    y={4}
                    fill={isActive ? '#ffffff' : '#d1d5db'}
                    fontSize={10}
                    fontFamily="-apple-system, sans-serif"
                    fontWeight="500"
                  >
                    {dep.name.length > 20 ? dep.name.slice(0, 19) + '…' : dep.name}
                  </text>
                </g>
              )
            })}
          </svg>

          {/* Legend overlay */}
          <div className="absolute bottom-4 left-4 flex items-center gap-3">
            {(['high', 'medium', 'low'] as const).map(r => (
              <div key={r} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: RISK_COLORS[r].dot }} />
                <span className="text-[10px] text-gray-500 capitalize">{r} risk</span>
              </div>
            ))}
          </div>
        </div>

        {/* Detail sidebar */}
        <div className="w-[260px] flex-shrink-0 bg-[#0f0f1a] border border-white/5 rounded-2xl overflow-y-auto">
          <div className="px-4 py-3 border-b border-white/5">
            <span className="text-xs font-semibold text-gray-300">
              {selected ? 'Dependency detail' : 'Dependencies'}
            </span>
          </div>

          {selected ? (
            <div className="p-4 space-y-4">
              <div>
                <div className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium mb-2', RISK_COLORS[selected.riskLevel].bg, RISK_COLORS[selected.riskLevel].border, RISK_COLORS[selected.riskLevel].text)}>
                  {DEP_ICONS[selected.type]}
                  {selected.type}
                </div>
                <h3 className="text-sm font-semibold text-white">{selected.name}</h3>
                <div className={cn('text-xs capitalize mt-1', RISK_COLORS[selected.riskLevel].text)}>
                  {selected.riskLevel} risk · {selected.issueCount} issues
                </div>
              </div>

              <div>
                <div className="text-xs text-gray-500 mb-2">Shared by teams</div>
                <div className="space-y-2">
                  {selected.teams.filter(t => selectedTeams.includes(t)).map(teamId => {
                    const team = TEAMS.find(t => t.id === teamId)!
                    return (
                      <div key={teamId} className="flex items-center gap-2">
                        <div
                          className="w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-bold text-white"
                          style={{ backgroundColor: team.color }}
                        >
                          {team.name.charAt(5)}
                        </div>
                        <div>
                          <div className="text-xs font-medium text-white">{team.name}</div>
                          <div className="text-[10px] text-gray-600">{team.focus}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {visibleDeps.map(dep => (
                <button
                  key={dep.id}
                  onClick={() => setSelected(dep)}
                  onMouseEnter={() => setHovered(dep.id)}
                  onMouseLeave={() => setHovered(null)}
                  className="w-full text-left px-4 py-3 hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-medium text-white/90">{dep.name}</span>
                    <span className={cn('text-[9px] px-1.5 py-0.5 rounded font-medium capitalize', RISK_COLORS[dep.riskLevel].bg, RISK_COLORS[dep.riskLevel].text)}>
                      {dep.riskLevel}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-600">{dep.teams.filter(t => selectedTeams.includes(t)).length} teams · {dep.issueCount} issues</span>
                    <div className="flex -space-x-1">
                      {dep.teams.filter(t => selectedTeams.includes(t)).map(tid => {
                        const t = TEAMS.find(x => x.id === tid)!
                        return (
                          <div key={tid} className="w-3.5 h-3.5 rounded-full border border-[#0f0f1a]" style={{ backgroundColor: t.color }} />
                        )
                      })}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
