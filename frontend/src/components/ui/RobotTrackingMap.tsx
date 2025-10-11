import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface RobotTrackingMapProps {
  robotLocation: {
    lat: number;
    lng: number;
    batteryLevel: number;
    speed: number;
  };
  destination: {
    lat: number;
    lng: number;
    name: string;
  };
  route?: Array<{ lat: number; lng: number }>;
  className?: string;
  robotImage?: string;
  onRobotMove?: (newLocation: { lat: number; lng: number }) => void;
}

export const RobotTrackingMap: React.FC<RobotTrackingMapProps> = ({
  robotLocation,
  destination,
  route = [],
  className = '',
  robotImage = '/images/Bulldog/4.png'
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const robotMarker = useRef<L.Marker | null>(null);
  const destinationMarker = useRef<L.Marker | null>(null);
  const routeLine = useRef<L.Polyline | null>(null);
  const pathLine = useRef<L.Polyline | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  // Create custom robot icon
  const createRobotIcon = () => {
    return L.icon({
      iconUrl: robotImage,
      iconSize: [40, 40], // size of the icon
      iconAnchor: [20, 20], // point of the icon which will correspond to marker's location
      popupAnchor: [0, -20], // point from which the popup should open relative to the iconAnchor
      shadowUrl: undefined,
      className: 'robot-marker'
    });
  };

  // Create destination icon
  const createDestinationIcon = () => {
    return L.divIcon({
      html: `<div class="destination-marker">
        <div class="destination-pin"></div>
        <div class="destination-pulse"></div>
      </div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
      className: 'custom-destination-marker'
    });
  };

  // Default route for Ocean Park 3 area (realistic path)
  const defaultRoute = [
    { lat: 10.7904, lng: 106.6997 }, // Kitchen/Store location
    { lat: 10.7906, lng: 106.6999 }, // Corridor
    { lat: 10.7908, lng: 106.7001 }, // Elevator area
    { lat: 10.7910, lng: 106.7003 }, // Floor 2 entrance
    { lat: 10.7912, lng: 106.7005 }  // Table 5 location
  ];

  const actualRoute = route.length > 0 ? route : defaultRoute;

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) {
      return;
    }

    const initMap = () => {
      try {
        // Clear any existing content
        mapRef.current!.innerHTML = '';

        // Create map centered on Ocean Park 3
        const map = L.map(mapRef.current!, {
          center: [10.7908, 106.7001], // Ocean Park 3 center
          zoom: 19, // High zoom for indoor tracking
          zoomControl: true,
          attributionControl: false,
          maxZoom: 20,
          minZoom: 17
        });

        mapInstance.current = map;

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 20,
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // Draw the complete route path
        if (actualRoute.length > 1) {
          pathLine.current = L.polyline(actualRoute, {
            color: '#3b82f6',
            weight: 4,
            opacity: 0.7,
            dashArray: '10, 5'
          }).addTo(map);
        }

        // Create robot marker
        const robotIcon = createRobotIcon();
        robotMarker.current = L.marker([robotLocation.lat, robotLocation.lng], {
          icon: robotIcon,
          zIndexOffset: 1000
        }).addTo(map);

        robotMarker.current.bindPopup(`
          <div class="robot-popup">
            <h3>🤖 Alpha Asimov Robot #04</h3>
            <p><strong>Battery:</strong> ${Math.round(robotLocation.batteryLevel)}%</p>
            <p><strong>Speed:</strong> ${robotLocation.speed.toFixed(1)} m/s</p>
            <p><strong>Status:</strong> Đang giao hàng</p>
          </div>
        `);

        // Create destination marker
        const destIcon = createDestinationIcon();
        destinationMarker.current = L.marker([destination.lat, destination.lng], {
          icon: destIcon
        }).addTo(map);

        destinationMarker.current.bindPopup(`
          <div class="destination-popup">
            <h3>📍 Điểm giao hàng</h3>
            <p>${destination.name}</p>
          </div>
        `);

        // Draw current progress line (from start to current position)
        updateProgressLine();

        // Fit map to show both robot and destination
        const group = new L.FeatureGroup([robotMarker.current, destinationMarker.current]);
        map.fitBounds(group.getBounds().pad(0.1));

        setIsMapReady(true);

        console.log('🗺️ Robot tracking map initialized successfully');

      } catch (error) {
        console.error('❌ Failed to initialize robot tracking map:', error);
      }
    };

    initMap();

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // Update progress line based on robot position
  const updateProgressLine = () => {
    if (!mapInstance.current || actualRoute.length === 0) return;

    // Find nearest route point to robot
    let nearestIndex = 0;
    let minDistance = Infinity;

    actualRoute.forEach((point, index) => {
      const distance = Math.sqrt(
        Math.pow(point.lat - robotLocation.lat, 2) + 
        Math.pow(point.lng - robotLocation.lng, 2)
      );
      if (distance < minDistance) {
        minDistance = distance;
        nearestIndex = index;
      }
    });

    // Create progress line from start to current position
    const progressPoints = actualRoute.slice(0, nearestIndex + 1);
    progressPoints.push({ lat: robotLocation.lat, lng: robotLocation.lng });

    if (routeLine.current) {
      mapInstance.current.removeLayer(routeLine.current);
    }

    routeLine.current = L.polyline(progressPoints, {
      color: '#10b981',
      weight: 6,
      opacity: 0.9
    }).addTo(mapInstance.current);
  };

  // Update robot position
  useEffect(() => {
    if (!isMapReady || !robotMarker.current) return;

    // Smooth animation to new position
    robotMarker.current.setLatLng([robotLocation.lat, robotLocation.lng]);
    
    // Update popup content
    robotMarker.current.setPopupContent(`
      <div class="robot-popup">
        <h3>🤖 Alpha Asimov Robot #04</h3>
        <p><strong>Battery:</strong> ${Math.round(robotLocation.batteryLevel)}%</p>
        <p><strong>Speed:</strong> ${robotLocation.speed.toFixed(1)} m/s</p>
        <p><strong>Status:</strong> Đang giao hàng</p>
      </div>
    `);

    // Update progress line
    updateProgressLine();

  }, [robotLocation, isMapReady]);

  return (
    <div className={`relative ${className}`}>
      <div ref={mapRef} className="w-full h-full rounded-xl overflow-hidden" />
      
      {/* Custom CSS for markers */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .robot-marker {
          border-radius: 50%;
          border: 3px solid #10b981;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
          animation: robotPulse 2s infinite;
        }

        @keyframes robotPulse {
          0%, 100% { 
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
            transform: scale(1);
          }
          50% { 
            box-shadow: 0 6px 20px rgba(16, 185, 129, 0.6);
            transform: scale(1.05);
          }
        }

        .destination-marker {
          position: relative;
          width: 30px;
          height: 30px;
        }

        .destination-pin {
          width: 20px;
          height: 20px;
          background: #ef4444;
          border: 3px solid white;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          position: absolute;
          top: 50%;
          left: 50%;
          margin: -10px 0 0 -10px;
          box-shadow: 0 2px 8px rgba(239, 68, 68, 0.4);
        }

        .destination-pulse {
          width: 30px;
          height: 30px;
          border: 2px solid #ef4444;
          border-radius: 50%;
          position: absolute;
          top: 50%;
          left: 50%;
          margin: -15px 0 0 -15px;
          animation: destinationPulse 2s infinite;
          opacity: 0.6;
        }

        @keyframes destinationPulse {
          0% {
            transform: scale(0.8);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.3;
          }
          100% {
            transform: scale(0.8);
            opacity: 0.8;
          }
        }

        .robot-popup, .destination-popup {
          font-family: 'Inter', sans-serif;
          min-width: 200px;
        }

        .robot-popup h3, .destination-popup h3 {
          margin: 0 0 8px 0;
          font-size: 16px;
          font-weight: 600;
        }

        .robot-popup p, .destination-popup p {
          margin: 4px 0;
          font-size: 14px;
        }
        `
      }} />
      
      {/* Loading overlay */}
      {!isMapReady && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Đang tải bản đồ...</p>
          </div>
        </div>
      )}
    </div>
  );
};