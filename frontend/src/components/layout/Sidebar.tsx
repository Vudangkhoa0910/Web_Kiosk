import React, { useState } from 'react'
import type { NavigationSection } from '../../types'
import { cn } from '../../utils'
import { useLanguage } from '../../contexts/LanguageContext'
import { useAuth } from '../../contexts/AuthContext'
// import LanguageToggle from '../ui/LanguageToggle'
import { TutorialModal } from '../ui/TutorialModal'
import { 
  Home, 
  MapPin, 
  History,
  Menu,
  X,
  LogOut,
  HelpCircle
} from 'lucide-react'

interface SidebarProps {
  currentSection: NavigationSection
  onSectionChange: (section: NavigationSection) => void
  isOpen: boolean
  onToggle: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentSection, 
  onSectionChange, 
  isOpen, 
  onToggle 
}) => {
  const { t } = useLanguage();
  const { logout } = useAuth();
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);

  const navigationItems = [
    { id: 'home' as NavigationSection, icon: Home, label: 'Home & Order', description: 'Trang chủ và đặt hàng' },
    { id: 'tracking' as NavigationSection, icon: MapPin, label: t.nav.tracking, description: t.nav.trackingDesc },
    { id: 'history' as NavigationSection, icon: History, label: t.nav.history, description: t.nav.historyDesc },
  ];
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <aside className={cn(
        'fixed left-0 top-0 h-full z-50 overflow-y-auto',
        'transform transition-all duration-300 ease-in-out',
        'w-80',
        'bg-slate-50',
        'border-r border-gray-200 shadow-xl',
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}>
        
        {/* Header */}
        <div className="relative flex items-center justify-between p-4 border-b border-gray-200/50">
          <div className="flex items-center space-x-3 w-full">
            <div className="relative">
              <img 
                src="/images/logo.png" 
                alt="Alpha Asimov" 
                className="h-11 w-11 object-contain drop-shadow-sm"
              />
              <div className="absolute inset-0 rounded-lg border border-gray-200" aria-hidden="true" />
            </div>
            <div className="flex-1">
              <h1 className="text-lg font-bold text-gray-900">Alpha Asimov</h1>
              <p className="text-xs text-gray-600 font-medium">Robot Delivery System</p>
            </div>
          </div>
          
          {/* Mobile close button */}
          <button 
            onClick={onToggle}
            className="lg:hidden p-2 rounded-xl hover:bg-gray-100/80 transition-all duration-200 backdrop-blur-sm border border-gray-200/50 absolute right-4"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="relative flex-1 p-4 space-y-3">
          {navigationItems.map((item, index) => {
            const Icon = item.icon
            const isActive = currentSection === item.id
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSectionChange(item.id)
                  // Close mobile sidebar after selection
                  if (window.innerWidth < 1024) onToggle()
                }}
                className={cn(
                  'w-full flex items-center px-4 py-3 rounded-xl transition-all duration-300',
                  'text-left group hover:scale-[1.01] active:scale-[0.99] min-h-[58px]',
                  'transform hover:shadow-md hover:shadow-gray-500/15',
                  isActive 
                    ? 'bg-gray-900 text-white shadow-md scale-[1.01] border border-gray-900/80' 
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 border border-gray-200'
                )}
                style={{
                  animationDelay: `${index * 50}ms`
                }}
              >
                <div className={cn(
                  'w-10 h-10 rounded-lg flex items-center justify-center mr-3 transition-all duration-300',
                  isActive 
                    ? 'bg-gray-800 text-white border border-gray-700' 
                    : 'bg-gray-100 group-hover:bg-gray-200 group-hover:scale-105 border border-gray-200'
                )}>
                  <Icon className={cn(
                    'h-5 w-5 transition-all duration-300',
                    isActive ? 'text-white' : 'text-gray-700 group-hover:text-gray-900'
                  )} />
                </div>
                <div className="flex-1">
                  <div className={cn(
                    'font-semibold text-sm transition-colors duration-300',
                    isActive ? 'text-white' : 'text-gray-800'
                  )}>
                    {item.label}
                  </div>
                  <div className={cn(
                    'text-xs mt-0.5 transition-colors duration-300',
                    isActive ? 'text-gray-200' : 'text-gray-500'
                  )}>
                    {item.description}
                  </div>
                </div>
                
                {/* Active indicator */}
                {isActive && (
                  <div className="w-1 h-6 bg-white rounded-full opacity-90 shadow-lg" />
                )}
              </button>
            )
          })}
        </nav>

        {/* Footer */}
  <div className="relative p-3 border-t border-gray-200 bg-slate-50">
          {/* User Section - Simplified */}
          <div className="mb-3 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 p-3 shadow-md">
            {/* Default User Display */}
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center text-white font-bold text-xs">
                AA
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-800">Alpha Asimov User</p>
                <p className="text-xs text-gray-600">Robot Delivery System</p>
              </div>
            </div>
            
            {/* Only Logout Button */}
            <button
              onClick={() => logout()}
              className="w-full flex items-center justify-center px-3 py-2 text-xs font-medium text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-all duration-200 border border-red-200"
            >
              <LogOut className="h-3 w-3 mr-1" />
              {t.auth.logout}
            </button>
          </div>
          
          {/* Tutorial Button */}
          <div className="mb-3">
            <button
              onClick={() => setIsTutorialOpen(true)}
              className="w-full bg-gray-900 hover:bg-gray-700 text-white rounded-lg transition-all duration-200 font-medium flex items-center justify-center gap-2 py-2 shadow-sm text-xs"
            >
              <HelpCircle className="h-4 w-4" />
              Hướng dẫn sử dụng
            </button>
          </div>
          
          {/* System Status */}
          <div className="mb-3 flex items-center justify-center space-x-2 text-gray-600 text-xs font-medium">
            <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-pulse shadow-sm shadow-gray-500/40"></div>
            <span>{t.common.systemOnline}</span>
          </div>
          
          {/* Company Info */}
          <div className="text-center space-y-2 p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200/30 shadow-sm">
            <p className="text-xs font-bold text-gray-800">Alpha Asimov Robotics</p>
            <div className="w-8 h-px bg-gray-300 mx-auto"></div>
            <p className="text-xs text-gray-600 leading-tight">
              Level 3 Indochina Riverside<br />
              Hai Chau, Da Nang, Vietnam
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile menu button */}
      <button
        onClick={onToggle}
        className="fixed top-4 left-4 z-40 lg:hidden p-3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 hover:bg-white transition-all duration-200 transform hover:scale-105 active:scale-95"
      >
        <Menu className="h-6 w-6 text-gray-700" />
      </button>

      {/* Tutorial Modal */}
      <TutorialModal
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
      />
    </>
  )
}
