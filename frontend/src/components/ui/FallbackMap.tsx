import React, { useEffect, useState } from 'react';

interface FallbackMapProps {
  robotLocation: {
    lat: number;
    lng: number;
  };
  destination: {
    lat: number;
    lng: number;
  };
  className?: string;
}

export const FallbackMap: React.FC<FallbackMapProps> = ({
  robotLocation,
  destination,
  className = ''
}) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className={`w-full h-full ${className}`}>
        <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-xl">
          <div className="text-center p-4">
            <div className="text-4xl mb-2">🗺️</div>
            <p className="text-gray-600 mb-2">Đang tải map...</p>
            <div className="w-8 h-8 border-4 border-gray-300 border-t-green-500 rounded-full animate-spin mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full h-full ${className}`}>
      <div className="w-full h-full bg-gray-50 rounded-xl relative overflow-hidden border border-gray-200">
        {/* Background Grid */}
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#cbd5e1" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Ocean Park 3 Area */}
        <div className="absolute inset-4 border-2 border-blue-300 bg-blue-50/30 rounded-lg">
          <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm rounded px-2 py-1 text-xs font-semibold text-blue-600">
            Ocean Park 3
          </div>
        </div>

        {/* Robot Position */}
        <div 
          className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
          style={{ left: '40%', top: '65%' }}
        >
          <div className="flex flex-col items-center">
            {/* Robot Image */}
            <div className="w-16 h-16 relative">
              <img 
                src="/images/Bulldog/5.png" 
                alt="Robot Alpha Asimov #04"
                className="w-full h-full object-contain rounded-full border-4 border-white shadow-lg bg-white p-1"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling!.textContent = '🤖';
                }}
              />
              <div className="hidden w-16 h-16 bg-green-500 border-4 border-white rounded-full flex items-center justify-center shadow-lg text-2xl animate-pulse">
                🤖
              </div>
            </div>
            <div className="mt-2 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 border border-gray-200 shadow-sm">
              <div className="text-xs font-bold text-gray-900">Robot #04</div>
              <div className="text-xs text-green-600">🔋 85% • Giao hàng</div>
            </div>
          </div>
        </div>

        {/* Destination */}
        <div 
          className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
          style={{ left: '75%', top: '25%' }}
        >
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 bg-red-500 border-3 border-white rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-sm">📍</span>
            </div>
            <div className="mt-2 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 border border-gray-200 shadow-sm">
              <div className="text-xs font-bold text-gray-900">Tầng 2</div>
              <div className="text-xs text-red-600">Bàn số 5</div>
            </div>
          </div>
        </div>

        {/* Route Line */}
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line
            x1="40%"
            y1="65%"
            x2="75%"
            y2="25%"
            stroke="#10b981"
            strokeWidth="3"
            strokeDasharray="8,8"
            className="animate-pulse"
          />
        </svg>

        {/* Status Panel */}
        <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm font-bold text-gray-900">🚚 Đang giao hàng</div>
              <div className="text-xs text-gray-600">Ocean Park 3 • Khoảng cách: ~250m</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-green-600">5 phút</div>
              <div className="text-xs text-gray-600">Thời gian còn lại</div>
            </div>
          </div>
        </div>

        {/* Coordinates Info */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 border border-gray-200 shadow-sm">
          <div className="text-xs text-gray-600">
            <div>🤖 {robotLocation.lat.toFixed(4)}, {robotLocation.lng.toFixed(4)}</div>
            <div>📍 {destination.lat.toFixed(4)}, {destination.lng.toFixed(4)}</div>
          </div>
        </div>

        {/* Real Map Label */}
        <div className="absolute top-4 left-4 bg-green-500/90 backdrop-blur-sm rounded-lg px-3 py-2 border border-green-600 shadow-sm">
          <div className="text-xs font-bold text-white">📡 Live GPS Tracking</div>
        </div>
      </div>
    </div>
  );
};