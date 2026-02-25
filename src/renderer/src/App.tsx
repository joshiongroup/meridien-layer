import React from 'react'
import { useAppStore } from './store/appStore'
import { LoginScreen } from './components/auth/LoginScreen'
import { Sidebar } from './components/layout/Sidebar'
import { TopBar } from './components/layout/TopBar'
import { FeatureAlignmentMap }    from './views/FeatureAlignmentMap'
import { DuplicateWorkDetector }  from './views/DuplicateWorkDetector'
import { SharedDependencyGraph }  from './views/SharedDependencyGraph'
import { CapacityHeatmap }        from './views/CapacityHeatmap'

export default function App() {
  const { isAuthenticated, activeView } = useAppStore()

  if (!isAuthenticated) {
    return <LoginScreen />
  }

  const views: Record<string, React.ReactNode> = {
    alignment:    <FeatureAlignmentMap />,
    duplicates:   <DuplicateWorkDetector />,
    dependencies: <SharedDependencyGraph />,
    capacity:     <CapacityHeatmap />,
  }

  return (
    <div className="flex h-screen bg-[#0a0a0f] text-gray-100 overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-hidden p-4">
          {views[activeView] ?? <FeatureAlignmentMap />}
        </main>
      </div>
    </div>
  )
}
