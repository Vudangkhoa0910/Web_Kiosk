import React from 'react';

interface SimpleMapComponentProps {
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

export const SimpleMapComponent: React.FC<SimpleMapComponentProps> = ({
  robotLocation,
  destination,
  className = ''
}) => {
  // Calculate distance for visual representation
  const distance = Math.sqrt(
    Math.pow(destination.lat - robotLocation.lat, 2) + 
    Math.pow(destination.lng - robotLocation.lng, 2)
  ) * 111000; // Rough conversion to meters

  return (
    <div className={`w-full h-full ${className}`}>
      <div className="w-full h-full bg-gray-100 rounded-xl relative overflow-hidden border border-gray-200">
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

        {/* Ocean Park 3 Area Label */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 border border-gray-200">
          <div className="text-sm font-semibold text-gray-900">Ocean Park 3</div>
          <div className="text-xs text-gray-600">Khu vực giao hàng</div>
        </div>

        {/* Robot Position */}
        <div 
          className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
          style={{
            left: '35%',
            top: '60%'
          }}
        >
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-green-500 border-4 border-white rounded-full flex items-center justify-center shadow-lg animate-pulse">
              <span className="text-white text-lg">🤖</span>
            </div>
            <div className="mt-2 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 border border-gray-200">
              <div className="text-xs font-semibold text-gray-900">Robot #04</div>
              <div className="text-xs text-green-600">Đang giao hàng</div>
            </div>
          </div>
        </div>

        {/* Destination */}
        <div 
          className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
          style={{
            left: '70%',
            top: '30%'
          }}
        >
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 bg-red-500 border-3 border-white rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-sm">📍</span>
            </div>
            <div className="mt-2 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 border border-gray-200">
              <div className="text-xs font-semibold text-gray-900">Tầng 2</div>
              <div className="text-xs text-red-600">Bàn số 5</div>
            </div>
          </div>
        </div>

        {/* Route Line */}
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line
            x1="35%"
            y1="60%"
            x2="70%"
            y2="30%"
            stroke="#10b981"
            strokeWidth="3"
            strokeDasharray="8,8"
            className="animate-pulse"
          />
        </svg>

        {/* Info Panel */}
        <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 border border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm font-semibold text-gray-900">Thông tin giao hàng</div>
              <div className="text-xs text-gray-600">Khoảng cách: ~{Math.round(distance)}m</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-green-600">5 phút</div>
              <div className="text-xs text-gray-600">Thời gian còn lại</div>
            </div>
          </div>
        </div>

        {/* Coordinates Info */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 border border-gray-200">
          <div className="text-xs text-gray-600">
            <div>Robot: {robotLocation.lat.toFixed(4)}, {robotLocation.lng.toFixed(4)}</div>
            <div>Đích: {destination.lat.toFixed(4)}, {destination.lng.toFixed(4)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};