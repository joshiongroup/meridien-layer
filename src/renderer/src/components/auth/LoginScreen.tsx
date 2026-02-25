import React from 'react'
import { useAppStore } from '../../store/appStore'
import { Layers, Users, GitMerge, BarChart3, Zap } from 'lucide-react'

export function LoginScreen() {
  const login = useAppStore(s => s.login)

  return (
    <div className="flex h-screen bg-[#0a0a0f] text-white overflow-hidden">
      {/* Left panel */}
      <div className="flex flex-col justify-between w-[420px] min-w-[420px] bg-[#0f0f1a] border-r border-white/5 p-10">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-3 mb-14">
            <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center">
              <Layers size={18} className="text-white" />
            </div>
            <span className="text-lg font-semibold tracking-tight">Meridien Layer</span>
          </div>

          <h1 className="text-3xl font-bold leading-tight mb-3">
            The scrum of scrums<br />
            <span className="text-brand-400">your Jira doesn't have.</span>
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed mb-10">
            Connect your Jira workspace to get a real-time view across all teams —
            alignment, duplicates, shared dependencies, and capacity.
          </p>

          {/* Feature list */}
          <div className="space-y-4">
            {[
              { icon: <Layers size={15} />,   color: 'text-brand-400',   label: 'Feature Alignment Map',    desc: 'See which teams cover which product features' },
              { icon: <GitMerge size={15} />, color: 'text-cyan-400',    label: 'Duplicate Work Detector',  desc: 'Surface tickets being built twice across teams' },
              { icon: <Zap size={15} />,      color: 'text-amber-400',   label: 'Shared Dependency Graph',  desc: 'Understand shared services and risk clusters' },
              { icon: <BarChart3 size={15} />,color: 'text-emerald-400', label: 'Capacity Heatmap',         desc: 'Spot overloaded teams and available bandwidth' },
            ].map(f => (
              <div key={f.label} className="flex items-start gap-3">
                <div className={`mt-0.5 ${f.color}`}>{f.icon}</div>
                <div>
                  <div className="text-sm font-medium text-white/90">{f.label}</div>
                  <div className="text-xs text-gray-500">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-gray-600">
          Meridien Layer POC · {new Date().getFullYear()}
        </p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-8">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg bg-[#0052CC] flex items-center justify-center">
                <svg viewBox="0 0 32 32" width="16" height="16" fill="white">
                  <path d="M16 3.2C9 3.2 3.2 9 3.2 16 3.2 23 9 28.8 16 28.8 23 28.8 28.8 23 28.8 16 28.8 9 23 3.2 16 3.2zm6.4 11.2l-7.2 7.2c-.4.4-1 .4-1.4 0l-4.2-4.2c-.4-.4-.4-1 0-1.4l1.4-1.4c.4-.4 1-.4 1.4 0l2.1 2.1 5.1-5.1c.4-.4 1-.4 1.4 0l1.4 1.4c.4.4.4 1 0 1.4z"/>
                </svg>
              </div>
              <span className="text-sm font-semibold">Sign in with Jira</span>
            </div>
            <p className="text-xs text-gray-500 mb-6">
              Connects via Atlassian OAuth 2.0 · Read-only access
            </p>

            <button
              onClick={login}
              className="w-full py-3 px-4 bg-brand-600 hover:bg-brand-500 text-white font-medium rounded-xl transition-all duration-150 text-sm active:scale-[0.98]"
            >
              Connect to Jira
            </button>

            <div className="mt-4 flex items-center gap-2">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs text-gray-600">or</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <button
              onClick={login}
              className="mt-4 w-full py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-medium rounded-xl transition-all duration-150 text-sm"
            >
              Load Demo Workspace
            </button>

            <p className="mt-5 text-center text-xs text-gray-600">
              This POC uses simulated data.<br />
              No real Jira credentials are sent.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
