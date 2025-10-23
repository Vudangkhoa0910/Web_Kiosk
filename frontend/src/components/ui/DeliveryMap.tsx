import React, { useRef, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { DEFAULT_STORE, DEFAULT_KIOSK } from '../../services/kioskOrderService'
import { formatOrderId } from '../../utils/formatters'

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface DeliveryMapProps {
  className?: string
  robotPosition?: { lat: number; lng: number } | null
  orderId?: string
}

const DeliveryMap: React.FC<DeliveryMapProps> = ({ className, robotPosition: externalRobotPosition, orderId }) => {
  // Real coordinates from Alpha Asimov system
  const storePosition: [number, number] = [
    DEFAULT_STORE.coordinates.latitude,
    DEFAULT_STORE.coordinates.longitude
  ]
  
  const kioskPosition: [number, number] = [
    DEFAULT_KIOSK.coordinates.latitude,
    DEFAULT_KIOSK.coordinates.longitude
  ]
  
  // Robot position - ONLY use real position from API, no simulation
  const robotPosition: [number, number] | null = externalRobotPosition 
    ? [externalRobotPosition.lat, externalRobotPosition.lng]
    : null
  
  const mapRef = useRef<L.Map | null>(null)
  
  // Calculate center point between store and kiosk for initial map view
  const centerPosition: [number, number] = [
    (storePosition[0] + kioskPosition[0]) / 2,
    (storePosition[1] + kioskPosition[1]) / 2
  ]
  
  // Update map view when robot position changes
  useEffect(() => {
    if (externalRobotPosition && mapRef.current) {
      // Optionally recenter map when robot moves
      // mapRef.current.setView([externalRobotPosition.lat, externalRobotPosition.lng], undefined, { animate: true })
    }
  }, [externalRobotPosition])

    // Create custom robot icon
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

  // Create Store icon (pickup location) - Blue
  const storeIcon = new L.DivIcon({
    html: `
      <div style="background: #3b82f6; border: 3px solid white; border-radius: 50%; width: 24px; height: 24px; box-shadow: 0 2px 8px rgba(59,130,246,0.4); display: flex; align-items: center; justify-content: center;">
        <div style="background: white; width: 8px; height: 8px; border-radius: 50%;"></div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
    className: ''
  })

  // Create Kiosk icon (delivery destination) - Green
  const kioskIcon = new L.DivIcon({
    html: `
      <div style="background: #10b981; border: 3px solid white; border-radius: 50%; width: 24px; height: 24px; box-shadow: 0 2px 8px rgba(16,185,129,0.4); display: flex; align-items: center; justify-content: center;">
        <div style="background: white; width: 8px; height: 8px; border-radius: 50%;"></div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
    className: ''
  })

  // Route line positions
  const routePositions: [number, number][] = [storePosition, kioskPosition]
  
  return (
    <div className={`relative ${className}`}>
      <MapContainer
        center={centerPosition}
        zoom={18}
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
        
        {/* Route line from Store to Kiosk */}
        <Polyline
          positions={routePositions}
          pathOptions={{
            color: '#6b7280',
            weight: 3,
            opacity: 0.6,
            dashArray: '10, 10'
          }}
        />
        
        {/* Store marker (Pickup) - Blue */}
        <Marker position={storePosition} icon={storeIcon}>
          <Popup>
            <div className="p-2">
              <p className="font-semibold text-blue-900 mb-1">📍 {DEFAULT_STORE.name}</p>
              <p className="text-sm text-gray-600">{DEFAULT_STORE.address}</p>
              <p className="text-xs text-gray-500 mt-1">
                📞 {DEFAULT_STORE.phone}
              </p>
              <p className="text-xs text-blue-600 mt-1 font-medium">
                Điểm lấy hàng
              </p>
            </div>
          </Popup>
        </Marker>
        
        {/* Kiosk marker (Destination) - Green */}
        <Marker position={kioskPosition} icon={kioskIcon}>
          <Popup>
            <div className="p-2">
              <p className="font-semibold text-green-900 mb-1">🎯 {DEFAULT_KIOSK.name}</p>
              <p className="text-sm text-gray-600">{DEFAULT_KIOSK.address}</p>
              <p className="text-xs text-green-600 mt-1 font-medium">
                Điểm giao hàng (Kiosk)
              </p>
            </div>
          </Popup>
        </Marker>
        
        {/* Robot marker - Only show when we have REAL position from API */}
        {robotPosition && (
          <Marker position={robotPosition} icon={robotIcon}>
            <Popup>
              <div className="text-center p-2">
                <p className="font-semibold text-gray-900 mb-1">🤖 Robot Giao Hàng</p>
                {orderId && (
                  <p className="text-xs text-gray-500 mb-1">Đơn: {formatOrderId(orderId)}</p>
                )}
                <p className="text-sm text-gray-600">Vị trí thực tế</p>
                <p className="text-xs text-gray-500 mt-1">
                  Lat: {robotPosition[0].toFixed(6)}, Lng: {robotPosition[1].toFixed(6)}
                </p>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
      
      {/* Map overlay with gradient borders */}
      <div className="absolute inset-0 pointer-events-none rounded-2xl bg-gradient-to-t from-black/10 via-transparent to-white/20"></div>
      
      {/* Custom map controls */}
      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-[1000] flex flex-col gap-2 sm:gap-3">
        <button
          onClick={() => mapRef.current?.setView(centerPosition, 18)}
          className="glass-card rounded-lg sm:rounded-xl p-2 sm:p-3 shadow-lg hover:shadow-xl transition-all duration-200 group"
          title="Về vị trí mặc định"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 group-hover:text-gray-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
        
        <button
          onClick={() => mapRef.current?.fitBounds([storePosition, kioskPosition], { padding: [50, 50] })}
          className="glass-card rounded-lg sm:rounded-xl p-2 sm:p-3 shadow-lg hover:shadow-xl transition-all duration-200 group"
          title="Xem toàn bộ tuyến đường"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 group-hover:text-gray-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        </button>
        
        {/* Follow robot button - Only show when robot position is available */}
        {robotPosition && (
          <button
            onClick={() => mapRef.current?.setView(robotPosition, 19)}
            className="glass-card rounded-lg sm:rounded-xl p-2 sm:p-3 shadow-lg hover:shadow-xl transition-all duration-200 group"
            title="Theo dõi robot"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 group-hover:text-gray-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </button>
        )}
      </div>
      
      {/* Route Legend & Status */}
      <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 z-[1000] glass-card rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-3 shadow-lg">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></div>
            <span className="text-xs sm:text-sm font-medium text-gray-900">Cửa hàng</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            <span className="text-xs sm:text-sm font-medium text-gray-900">Kiosk</span>
          </div>
          
          {/* Robot status */}
          {robotPosition ? (
            <div className="flex items-center gap-2">
              <div className="relative w-4 h-4">
                <div className="w-4 h-4 bg-gray-700 rounded-full animate-pulse"></div>
              </div>
              <span className="text-xs sm:text-sm font-medium text-gray-900">Robot (Live)</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 opacity-50">
              <div className="w-3 h-3 bg-gray-400 rounded-full border-2 border-white"></div>
              <span className="text-xs sm:text-sm font-medium text-gray-600">Chờ vị trí robot...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DeliveryMap