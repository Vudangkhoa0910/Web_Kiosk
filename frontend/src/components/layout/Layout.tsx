import React from 'react'
import type { NavigationSection } from '../../types'
import { AnimatedBackground, TopRightControls, BrandLogo } from '../ui'

interface LayoutProps {
  children: React.ReactNode
  currentSection: NavigationSection
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  currentSection
}) => {
  return (
    <div className="min-h-screen overflow-hidden bg-white">
      {/* Animated Background - only for home section */}
      {currentSection === 'home' && <AnimatedBackground />}
      
      {/* Brand Logo - Top Left */}
      <BrandLogo />
      
      {/* Top Right Controls - Language Switcher & Auth Button - Hide on tracking section */}
      {currentSection !== 'tracking' && <TopRightControls />}
      
      {/* Main Content - Full width without sidebar */}
      <main className="min-h-screen relative bg-white">
        {/* HomeSection and TrackingSection get full-bleed (no padding), other sections keep padding */}
        {currentSection === 'home' || currentSection === 'tracking' ? (
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
