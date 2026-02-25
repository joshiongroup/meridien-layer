import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function scoreColor(score: number): string {
  if (score >= 0.85) return 'text-red-400'
  if (score >= 0.75) return 'text-orange-400'
  return 'text-yellow-400'
}

export function scoreBg(score: number): string {
  if (score >= 0.85) return 'bg-red-500/20 border-red-500/40'
  if (score >= 0.75) return 'bg-orange-500/20 border-orange-500/40'
  return 'bg-yellow-500/20 border-yellow-500/40'
}

export function loadColor(ptsPerDev: number): string {
  if (ptsPerDev >= 12) return '#ef4444'
  if (ptsPerDev >= 10) return '#f97316'
  if (ptsPerDev >= 7)  return '#22c55e'
  if (ptsPerDev >= 4)  return '#3b82f6'
  return '#6b7280'
}

export function loadLabel(ptsPerDev: number): string {
  if (ptsPerDev >= 12) return 'Critical'
  if (ptsPerDev >= 10) return 'Overloaded'
  if (ptsPerDev >= 7)  return 'Optimal'
  if (ptsPerDev >= 4)  return 'Light'
  return 'Available'
}

export function priorityColor(priority: string): string {
  switch (priority) {
    case 'critical': return 'text-red-400 bg-red-500/15 border-red-500/30'
    case 'high':     return 'text-orange-400 bg-orange-500/15 border-orange-500/30'
    case 'medium':   return 'text-yellow-400 bg-yellow-500/15 border-yellow-500/30'
    default:         return 'text-gray-400 bg-gray-500/15 border-gray-500/30'
  }
}

export function statusColor(status: string): string {
  switch (status) {
    case 'on-track':   return 'bg-emerald-500/20 text-emerald-300'
    case 'at-risk':    return 'bg-yellow-500/20 text-yellow-300'
    case 'behind':     return 'bg-red-500/20 text-red-300'
    case 'not-started':return 'bg-gray-500/20 text-gray-400'
    default:           return 'bg-gray-500/20 text-gray-400'
  }
}
