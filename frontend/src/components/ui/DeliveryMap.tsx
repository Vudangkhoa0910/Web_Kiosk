import React, { useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface DeliveryMapProps {
  className?: string
}

const DeliveryMap: React.FC<DeliveryMapProps> = ({ className }) => {
  const robotPosition: [number, number] = [21.0285, 105.8542] // Robot current position (Hanoi coordinates)
  const destinationPosition: [number, number] = [21.0345, 105.8582] // Destination (Kiosk location)
  const mapRef = useRef<L.Map | null>(null)

  // Create custom robot icon đơn giản và đẹp
  const robotIcon = new L.DivIcon({
    html: `
      <div class="robot-marker-simple">
        <img src="/images/Bulldog/5.png" alt="Robot" class="robot-image-responsive" />
        <div class="robot-glow"></div>
      </div>
    `,
    iconSize: [60, 60],
    iconAnchor: [30, 30],
    popupAnchor: [0, -30],
    className: 'robot-marker-container'
  })

  // Create destination icon (Kiosk)
  const destinationIcon = new L.Icon({
    iconUrl: 'data:image/svg+xml;base64=' + btoa(`
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#dc2626"/>
        <circle cx="12" cy="9" r="2.5" fill="white"/>
      </svg>
    `),
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  })

  return (
    <div className={`relative ${className}`}>
      <MapContainer
        center={[21.0315, 105.8562]}
        zoom={14}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
        zoomControl={true}
        scrollWheelZoom={true}
        doubleClickZoom={true}
        touchZoom={true}
        dragging={true}
        className="rounded-xl sm:rounded-2xl"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Robot marker */}
        <Marker position={robotPosition} icon={robotIcon}>
          <Popup>
            <div className="text-center p-2">
              <p className="font-semibold text-gray-900 mb-1">Robot Giao Hàng</p>
              <p className="text-sm text-gray-600">Đang chờ tại kho</p>
              <p className="text-xs text-gray-500 mt-1">ID: RB-001</p>
            </div>
          </Popup>
        </Marker>
        
        {/* Destination marker */}
        <Marker position={destinationPosition} icon={destinationIcon}>
          <Popup>
            <div className="text-center p-2">
              <p className="font-semibold text-gray-900 mb-1">Kiosk A1</p>
              <p className="text-sm text-gray-600">Điểm giao hàng</p>
              <p className="text-xs text-gray-500 mt-1">Sảnh chính khu thương mại</p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
      
      {/* Map overlay with gradient borders */}
      <div className="absolute inset-0 pointer-events-none rounded-2xl bg-gradient-to-t from-black/10 via-transparent to-white/20"></div>
      
      {/* Custom map controls */}
      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-[1000] flex flex-col gap-2 sm:gap-3">
        <button
          onClick={() => mapRef.current?.setView([21.0315, 105.8562], 15)}
          className="glass-card rounded-lg sm:rounded-xl p-2 sm:p-3 shadow-lg hover:shadow-xl transition-all duration-200 group"
          title="Về vị trí mặc định"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 group-hover:text-gray-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
        
        <button
          onClick={() => mapRef.current?.fitBounds([[robotPosition[0], robotPosition[1]], [destinationPosition[0], destinationPosition[1]]], { padding: [30, 30] })}
          className="glass-card rounded-lg sm:rounded-xl p-2 sm:p-3 shadow-lg hover:shadow-xl transition-all duration-200 group"
          title="Xem tất cả điểm"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 group-hover:text-gray-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        </button>
      </div>
      
      {/* Status indicator đơn giản */}
      <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 z-[1000] glass-card rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-3 shadow-lg tracking-card">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-ping opacity-30"></div>
          </div>
          <div>
            <span className="text-xs sm:text-sm font-semibold text-gray-900">Robot đang chờ</span>
            <p className="text-xs text-gray-600 hidden sm:block">Sẵn sàng giao hàng</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeliveryMap