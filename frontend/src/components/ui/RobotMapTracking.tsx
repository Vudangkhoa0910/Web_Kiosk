import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, Circle } from 'react-leaflet';
import { Icon, LatLng, DivIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion, AnimatePresence } from 'framer-motion';
import { Battery, Zap, Navigation, Clock, MapPin, AlertCircle } from 'lucide-react';

// Fix for default marker icons in Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = new Icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

interface RobotLocation {
  lat: number;
  lng: number;
  heading?: number; // Robot's heading direction in degrees (0-360)
}

interface RobotData {
  id: string;
  name: string;
  location: RobotLocation;
  batteryLevel: number;
  speed: number; // m/s
  status: 'idle' | 'moving' | 'delivering' | 'charging' | 'error';
  currentOrderId?: string;
  estimatedTimeArrival?: number; // minutes
  distanceToDestination?: number; // meters
}

interface Destination {
  lat: number;
  lng: number;
  name: string;
  address?: string;
}

interface RobotMapTrackingProps {
  robot: RobotData;
  destination: Destination;
  route?: LatLng[]; // Optional route path
  showRoute?: boolean;
  showDeliveryRadius?: boolean;
  onRobotClick?: (robot: RobotData) => void;
  className?: string;
  height?: string;
}

// Custom Robot Marker Component
const RobotMarker: React.FC<{
  robot: RobotData;
  onClick?: () => void;
}> = ({ robot, onClick }) => {
  const robotIcon = new DivIcon({
    html: `
      <div style="position: relative; width: 50px; height: 50px; transform: rotate(${robot.location.heading || 0}deg);">
        <img 
          src="/images/Bulldog/5.png" 
          alt="${robot.name}"
          style="
            width: 50px; 
            height: 50px; 
            object-fit: contain;
            filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));
            animation: robotPulse 2s ease-in-out infinite;
          "
        />
        ${robot.status === 'moving' ? `
          <div style="
            position: absolute;
            bottom: -5px;
            left: 50%;
            transform: translateX(-50%);
            width: 8px;
            height: 8px;
            background: #10b981;
            border-radius: 50%;
            animation: statusBlink 1s ease-in-out infinite;
          "></div>
        ` : ''}
      </div>
      <style>
        @keyframes robotPulse {
          0%, 100% { transform: scale(1) rotate(${robot.location.heading || 0}deg); }
          50% { transform: scale(1.05) rotate(${robot.location.heading || 0}deg); }
        }
        @keyframes statusBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      </style>
    `,
    iconSize: [50, 50],
    iconAnchor: [25, 25],
    className: 'robot-marker',
  });

  return (
    <Marker 
      position={[robot.location.lat, robot.location.lng]} 
      icon={robotIcon}
      eventHandlers={{
        click: onClick,
      }}
    >
      <Popup>
        <div className="p-2 min-w-[200px]">
          <h3 className="font-bold text-lg mb-2">{robot.name}</h3>
          <div className="space-y-1 text-sm">
            <div className="flex items-center gap-2">
              <Battery className={`w-4 h-4 ${robot.batteryLevel > 20 ? 'text-green-500' : 'text-red-500'}`} />
              <span>Pin: {robot.batteryLevel}%</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-500" />
              <span>Tốc độ: {robot.speed.toFixed(1)} m/s</span>
            </div>
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-purple-500" />
              <span>Trạng thái: {getStatusText(robot.status)}</span>
            </div>
            {robot.estimatedTimeArrival && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-500" />
                <span>ETA: {robot.estimatedTimeArrival} phút</span>
              </div>
            )}
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

// Destination Marker Component
const DestinationMarker: React.FC<{ destination: Destination }> = ({ destination }) => {
  const destinationIcon = new DivIcon({
    html: `
      <div style="
        position: relative; 
        width: 40px; 
        height: 40px;
        background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
        animation: destinationBounce 2s ease-in-out infinite;
      ">
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(45deg);
          font-size: 18px;
        ">📍</div>
      </div>
      <style>
        @keyframes destinationBounce {
          0%, 100% { transform: rotate(-45deg) translateY(0); }
          50% { transform: rotate(-45deg) translateY(-5px); }
        }
      </style>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    className: 'destination-marker',
  });

  return (
    <Marker position={[destination.lat, destination.lng]} icon={destinationIcon}>
      <Popup>
        <div className="p-2">
          <h3 className="font-bold mb-1">{destination.name}</h3>
          {destination.address && (
            <p className="text-sm text-gray-600">{destination.address}</p>
          )}
        </div>
      </Popup>
    </Marker>
  );
};

// Map Controller to handle auto-centering
const MapController: React.FC<{
  robot: RobotData;
  destination: Destination;
  autoCenter?: boolean;
}> = ({ robot, destination, autoCenter = true }) => {
  const map = useMap();

  useEffect(() => {
    if (autoCenter) {
      // Calculate bounds to fit both robot and destination
      const bounds = [
        [robot.location.lat, robot.location.lng],
        [destination.lat, destination.lng],
      ];
      map.fitBounds(bounds as any, { padding: [50, 50], maxZoom: 17 });
    }
  }, [robot.location.lat, robot.location.lng, destination.lat, destination.lng, autoCenter, map]);

  return null;
};

// Helper function to get status text in Vietnamese
const getStatusText = (status: RobotData['status']): string => {
  const statusMap = {
    idle: 'Đang chờ',
    moving: 'Đang di chuyển',
    delivering: 'Đang giao hàng',
    charging: 'Đang sạc pin',
    error: 'Lỗi hệ thống',
  };
  return statusMap[status] || status;
};

// Helper function to get status color
const getStatusColor = (status: RobotData['status']): string => {
  const colorMap = {
    idle: 'text-gray-500',
    moving: 'text-blue-500',
    delivering: 'text-green-500',
    charging: 'text-yellow-500',
    error: 'text-red-500',
  };
  return colorMap[status] || 'text-gray-500';
};

// Helper function to calculate ETA based on distance and speed
const calculateETA = (distanceMeters: number, speedMs: number): number => {
  if (speedMs === 0) return 0;
  const timeSeconds = distanceMeters / speedMs;
  return Math.ceil(timeSeconds / 60); // Convert to minutes
};

// Main Component
export const RobotMapTracking: React.FC<RobotMapTrackingProps> = ({
  robot,
  destination,
  route,
  showRoute = true,
  showDeliveryRadius = true,
  onRobotClick,
  className = '',
  height = '600px',
}) => {
  const [mapCenter] = useState<[number, number]>([
    (robot.location.lat + destination.lat) / 2,
    (robot.location.lng + destination.lng) / 2,
  ]);

  // Calculate distance if not provided
  const distance = robot.distanceToDestination || calculateDistance(
    robot.location.lat,
    robot.location.lng,
    destination.lat,
    destination.lng
  );

  // Calculate ETA if not provided
  const eta = robot.estimatedTimeArrival || calculateETA(distance, robot.speed);

  return (
    <div className={`relative ${className}`}>
      {/* Robot Info Panel */}
      <div className="absolute top-4 left-4 z-[1000] bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-4 max-w-xs">
        <div className="flex items-start gap-3 mb-3">
          <img 
            src="/images/Bulldog/5.png" 
            alt={robot.name}
            className="w-16 h-16 object-contain"
          />
          <div className="flex-1">
            <h3 className="font-bold text-lg text-gray-900">{robot.name}</h3>
            <p className={`text-sm font-medium ${getStatusColor(robot.status)}`}>
              {getStatusText(robot.status)}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          {/* Battery */}
          <div className="flex items-center gap-2">
            <Battery className={`w-4 h-4 ${robot.batteryLevel > 20 ? 'text-green-500' : 'text-red-500'}`} />
            <div className="flex-1">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-gray-600">Pin</span>
                <span className="font-semibold">{robot.batteryLevel}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${
                    robot.batteryLevel > 50 ? 'bg-green-500' : 
                    robot.batteryLevel > 20 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${robot.batteryLevel}%` }}
                />
              </div>
            </div>
          </div>

          {/* Speed */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-600">
              <Zap className="w-4 h-4 text-blue-500" />
              <span className="text-sm">Tốc độ</span>
            </div>
            <span className="text-sm font-semibold">{robot.speed.toFixed(1)} m/s</span>
          </div>

          {/* Distance */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-4 h-4 text-purple-500" />
              <span className="text-sm">Khoảng cách</span>
            </div>
            <span className="text-sm font-semibold">
              {distance > 1000 ? `${(distance / 1000).toFixed(1)} km` : `${distance.toFixed(0)} m`}
            </span>
          </div>

          {/* ETA */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-4 h-4 text-orange-500" />
              <span className="text-sm">Thời gian dự kiến</span>
            </div>
            <span className="text-sm font-semibold text-orange-600">~{eta} phút</span>
          </div>
        </div>

        {/* Low Battery Warning */}
        {robot.batteryLevel < 20 && (
          <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-red-700">Pin yếu! Robot có thể cần sạc pin.</p>
          </div>
        )}
      </div>

      {/* Destination Info Panel */}
      <div className="absolute top-4 right-4 z-[1000] bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-4 max-w-xs">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center text-2xl">
            📍
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg text-gray-900">{destination.name}</h3>
            {destination.address && (
              <p className="text-sm text-gray-600 mt-1">{destination.address}</p>
            )}
          </div>
        </div>
      </div>

      {/* Map Container */}
      <MapContainer
        center={mapCenter}
        zoom={15}
        style={{ height, width: '100%' }}
        className="rounded-2xl shadow-lg"
        zoomControl={true}
      >
        {/* OpenStreetMap Tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Robot Marker */}
        <RobotMarker robot={robot} onClick={() => onRobotClick?.(robot)} />

        {/* Destination Marker */}
        <DestinationMarker destination={destination} />

        {/* Route Polyline */}
        {showRoute && route && route.length > 0 && (
          <Polyline
            positions={route}
            pathOptions={{
              color: '#3b82f6',
              weight: 4,
              opacity: 0.7,
              dashArray: '10, 10',
            }}
          />
        )}

        {/* Delivery Radius Circle */}
        {showDeliveryRadius && (
          <Circle
            center={[destination.lat, destination.lng]}
            radius={50} // 50 meters radius
            pathOptions={{
              color: '#10b981',
              fillColor: '#10b981',
              fillOpacity: 0.1,
              weight: 2,
              dashArray: '5, 5',
            }}
          />
        )}

        {/* Auto-center controller */}
        <MapController robot={robot} destination={destination} autoCenter={true} />
      </MapContainer>
    </div>
  );
};

// Helper function to calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

export default RobotMapTracking;
