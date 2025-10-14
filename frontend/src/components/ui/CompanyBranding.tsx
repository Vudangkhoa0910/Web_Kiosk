import React from 'react'

export const CompanyBranding: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
      <div className="text-center max-w-4xl mx-auto px-6">
        {/* Company Logo */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <img
              src="/images/logo.png"
              alt="Alpha Asimov Logo"
              className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 object-contain drop-shadow-2xl"
              onError={(e) => {
                // Fallback to assets logo if public logo fails
                ;(e.target as HTMLImageElement).src = "/src/assets/logo_aa.png"
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-transparent to-purple-600/20 rounded-full blur-xl -z-10"></div>
          </div>
        </div>

        {/* Company Name */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold">
            <span className="bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 bg-clip-text text-transparent">
              Alpha Asimov
            </span>
          </h1>
          
          {/* Tagline */}
          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 font-light max-w-2xl mx-auto">
            Robot Delivery System
          </p>
          
          {/* Decorative elements */}
          <div className="flex items-center justify-center gap-2 mt-6">
            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-gray-400 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-gray-400 rounded-full"></div>
          </div>
        </div>

        {/* Status indicator */}
        <div className="mt-12 inline-flex items-center gap-3 px-6 py-3 bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-full shadow-lg">
          <div className="relative">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <div className="absolute inset-0 w-3 h-3 bg-green-400 rounded-full animate-ping opacity-30"></div>
          </div>
          <span className="text-sm font-medium text-gray-700">Hệ thống sẵn sàng</span>
        </div>
      </div>
    </div>
  )
}