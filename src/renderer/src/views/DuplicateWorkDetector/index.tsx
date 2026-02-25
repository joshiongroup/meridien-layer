import React, { useState } from 'react'
import { GitMerge, AlertTriangle, CheckCircle, X, ChevronRight, Tag, Layers } from 'lucide-react'
import { DUPLICATES, TEAMS, type DuplicateCandidate } from '../../mock/data'
import { useAppStore } from '../../store/appStore'
import { cn, scoreColor, scoreBg } from '../../lib/utils'

export function DuplicateWorkDetector() {
  const { selectedTeams } = useAppStore()
  const [selected, setSelected] = useState<DuplicateCandidate | null>(DUPLICATES[0])
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())

  const visible = DUPLICATES.filter(d =>
    selectedTeams.includes(d.issueA.teamId) &&
    selectedTeams.includes(d.issueB.teamId) &&
    !dismissed.has(d.id)
  )

  const criticalCount = visible.filter(d => d.score >= 0.85).length
  const highCount     = visible.filter(d => d.score >= 0.75 && d.score < 0.85).length
  const medCount      = visible.filter(d => d.score < 0.75).length

  return (
    <div className="h-full flex flex-col gap-4 overflow-hidden">
      {/* Summary */}
      <div className="grid grid-cols-4 gap-3 flex-shrink-0">
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
          <div className="text-xs text-red-400 mb-2">Critical overlap</div>
          <div className="text-2xl font-bold text-white">{criticalCount}</div>
          <div className="text-[11px] text-gray-600">≥ 85% similarity</div>
        </div>
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4">
          <div className="text-xs text-orange-400 mb-2">High similarity</div>
          <div className="text-2xl font-bold text-white">{highCount}</div>
          <div className="text-[11px] text-gray-600">75–84% similarity</div>
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
          <div className="text-xs text-yellow-400 mb-2">Possible overlap</div>
          <div className="text-2xl font-bold text-white">{medCount}</div>
          <div className="text-[11px] text-gray-600">60–74% similarity</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="text-xs text-gray-400 mb-2">Dismissed</div>
          <div className="text-2xl font-bold text-white">{dismissed.size}</div>
          <div className="text-[11px] text-gray-600">reviewed & cleared</div>
        </div>
      </div>

      {/* Main panel */}
      <div className="flex-1 flex gap-4 min-h-0">
        {/* List */}
        <div className="w-[320px] flex-shrink-0 bg-[#0f0f1a] border border-white/5 rounded-2xl overflow-y-auto">
          <div className="px-4 py-3 border-b border-white/5">
            <span className="text-xs font-semibold text-gray-300">Detected overlaps</span>
            <span className="ml-2 text-xs text-gray-600">ranked by similarity</span>
          </div>

          {visible.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-gray-600">
              <CheckCircle size={24} className="mb-2 text-emerald-500/50" />
              <span className="text-sm">No overlaps detected</span>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {visible.map(d => (
                <button
                  key={d.id}
                  onClick={() => setSelected(d)}
                  className={cn(
                    'w-full text-left px-4 py-3 hover:bg-white/5 transition-colors',
                    selected?.id === d.id ? 'bg-white/5' : ''
                  )}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <TeamDot teamId={d.issueA.teamId} />
                      <ChevronRight size={10} className="text-gray-600" />
                      <TeamDot teamId={d.issueB.teamId} />
                    </div>
                    <span className={cn('text-xs font-bold tabular-nums', scoreColor(d.score))}>
                      {Math.round(d.score * 100)}%
                    </span>
                  </div>
                  <div className="text-xs text-white/80 leading-tight line-clamp-1 mb-0.5">
                    {d.issueA.summary}
                  </div>
                  <div className="text-xs text-gray-600 line-clamp-1">
                    {d.issueB.summary}
                  </div>
                  <div className="flex gap-1 mt-1.5">
                    {d.reasons.map(r => (
                      <ReasonBadge key={r} reason={r} />
                    ))}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Detail panel */}
        {selected ? (
          <div className="flex-1 bg-[#0f0f1a] border border-white/5 rounded-2xl flex flex-col overflow-hidden">
            {/* Header */}
            <div className={cn('flex items-center justify-between px-5 py-4 border-b border-white/5', scoreBg(selected.score))}>
              <div className="flex items-center gap-3">
                <GitMerge size={16} className={scoreColor(selected.score)} />
                <div>
                  <span className="text-sm font-semibold text-white">
                    Potential duplicate — {Math.round(selected.score * 100)}% similarity
                  </span>
                  <div className="flex gap-1.5 mt-1">
                    {selected.reasons.map(r => <ReasonBadge key={r} reason={r} />)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setDismissed(prev => new Set([...prev, selected.id]))
                    setSelected(visible.find(d => d.id !== selected.id) || null)
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded-lg text-xs font-medium transition-colors"
                >
                  <CheckCircle size={12} /> Mark reviewed
                </button>
              </div>
            </div>

            {/* Side-by-side */}
            <div className="flex-1 grid grid-cols-2 divide-x divide-white/5 overflow-auto">
              <IssuePanel issue={selected.issueA} />
              <IssuePanel issue={selected.issueB} />
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-600">
            <div className="text-center">
              <CheckCircle size={32} className="mx-auto mb-3 text-emerald-500/30" />
              <p className="text-sm">All overlaps reviewed</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function TeamDot({ teamId }: { teamId: string }) {
  const team = TEAMS.find(t => t.id === teamId)
  if (!team) return null
  return (
    <div
      className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white"
      style={{ backgroundColor: team.color }}
      title={team.name}
    >
      {team.name.charAt(5)}
    </div>
  )
}

function ReasonBadge({ reason }: { reason: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    title:      { label: 'Title',      cls: 'bg-red-500/15 text-red-400'     },
    labels:     { label: 'Labels',     cls: 'bg-purple-500/15 text-purple-400'},
    components: { label: 'Component',  cls: 'bg-blue-500/15 text-blue-400'   },
    epic:       { label: 'Same Epic',  cls: 'bg-amber-500/15 text-amber-400' },
  }
  const { label, cls } = map[reason] || { label: reason, cls: 'bg-gray-500/15 text-gray-400' }
  return (
    <span className={cn('text-[9px] px-1.5 py-0.5 rounded font-medium', cls)}>{label}</span>
  )
}

function IssuePanel({ issue }: { issue: DuplicateCandidate['issueA'] }) {
  const team = TEAMS.find(t => t.id === issue.teamId)!
  return (
    <div className="p-5 space-y-4">
      {/* Team + key */}
      <div className="flex items-center gap-2">
        <div
          className="px-2 py-0.5 rounded-md text-xs font-semibold"
          style={{ backgroundColor: team.color + '22', color: team.color }}
        >
          {team.name}
        </div>
        <span className="text-xs font-mono text-gray-500">{issue.key}</span>
        <span className="ml-auto text-xs text-gray-600 bg-white/5 px-2 py-0.5 rounded">{issue.type}</span>
      </div>

      {/* Summary */}
      <div>
        <div className="text-xs text-gray-500 mb-1">Summary</div>
        <p className="text-sm text-white leading-relaxed">{issue.summary}</p>
      </div>

      {/* Assignee */}
      <div>
        <div className="text-xs text-gray-500 mb-1">Assignee</div>
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
            style={{ backgroundColor: team.color }}
          >
            {issue.assignee.charAt(0)}
          </div>
          <span className="text-sm text-white">{issue.assignee}</span>
        </div>
      </div>

      {/* Type */}
      <div>
        <div className="text-xs text-gray-500 mb-1">Issue type</div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-blue-500/80" />
          <span className="text-sm text-gray-300">{issue.type}</span>
        </div>
      </div>
    </div>
  )
}
