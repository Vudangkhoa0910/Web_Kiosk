import React from 'react'
import type { NavigationSection } from '../../types'
import { Sidebar } from './Sidebar'
import { AnimatedBackground } from '../ui'

interface LayoutProps {
  children: React.ReactNode
  currentSection: NavigationSection
  onSectionChange: (section: NavigationSection) => void
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  currentSection, 
  onSectionChange 
}) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false)

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  // Close sidebar on section change (mobile)
  React.useEffect(() => {
    setSidebarOpen(false)
  }, [currentSection])

  return (
  <div className="min-h-screen overflow-hidden bg-slate-200">
      {/* Animated Background - only for home section */}
      {currentSection === 'home' && <AnimatedBackground />}
      
      <Sidebar 
        currentSection={currentSection}
        onSectionChange={onSectionChange}
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
      />
      
      {/* Main Content */}
  <main className="lg:ml-80 min-h-screen relative bg-slate-100">
        {/* HomeSection gets full-bleed (no padding), other sections keep padding */}
        {currentSection === 'home' ? (
          <div className="h-screen overflow-hidden">
            {children}
          </div>
        ) : (
          <div className="p-4 sm:p-6 lg:p-8 h-screen overflow-auto">
            {children}
          </div>
        )}
      </main>
    </div>
  )
}
