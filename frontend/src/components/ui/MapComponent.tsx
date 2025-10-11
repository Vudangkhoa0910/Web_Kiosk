import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapComponentProps {
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

export const MapComponent: React.FC<MapComponentProps> = ({
  robotLocation,
  destination,
  className = ''
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const robotMarker = useRef<L.CircleMarker | null>(null);
  const destinationMarker = useRef<L.CircleMarker | null>(null);
  const routeLine = useRef<L.Polyline | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const initAttempted = useRef(false);

  useEffect(() => {
    // Prevent double initialization
    if (initAttempted.current || !mapRef.current || mapInstance.current) {
      return;
    }

    initAttempted.current = true;

    const initMap = () => {
      try {
        console.log('🗺️ Starting map initialization...');
        console.log('Map container:', mapRef.current);

        if (!mapRef.current) {
          throw new Error('Map container not found');
        }

        // Clear any existing content
        mapRef.current.innerHTML = '';

        console.log('🗺️ Creating Leaflet map...');

        // Create map
        const map = L.map(mapRef.current, {
          center: [10.7906, 106.6999],
          zoom: 17,
          zoomControl: true,
          attributionControl: false
        });

        mapInstance.current = map;

        console.log('🗺️ Map instance created, adding tiles...');

        // Add tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19
        }).addTo(map);

        console.log('🗺️ Tiles added, creating markers...');

        // Robot marker - green circle
        const robot = L.circleMarker([robotLocation.lat, robotLocation.lng], {
          radius: 8,
          fillColor: '#10b981',
          color: '#ffffff',
          weight: 3,
          opacity: 1,
          fillOpacity: 0.9
        }).addTo(map);

        robot.bindPopup('🤖 Robot #04<br>Đang giao hàng');
        robotMarker.current = robot;

        // Destination marker - red circle
        const dest = L.circleMarker([destination.lat, destination.lng], {
          radius: 6,
          fillColor: '#ef4444',
          color: '#ffffff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.9
        }).addTo(map);

        dest.bindPopup('📍 Tầng 2, Bàn 5');
        destinationMarker.current = dest;

        // Route line
        const route = L.polyline([
          [robotLocation.lat, robotLocation.lng],
          [destination.lat, destination.lng]
        ], {
          color: '#10b981',
          weight: 3,
          opacity: 0.7,
          dashArray: '5, 10'
        }).addTo(map);

        routeLine.current = route;

        console.log('🗺️ ✅ Map initialization complete!');
        setIsMapReady(true);

      } catch (error) {
        console.error('🗺️ ❌ Map initialization error:', error);
        setMapError(error instanceof Error ? error.message : 'Unknown error');
      }
    };

    // Run immediately
    setTimeout(initMap, 50);

    return () => {
      if (mapInstance.current) {
        try {
          mapInstance.current.remove();
          mapInstance.current = null;
        } catch (e) {
          console.error('Cleanup error:', e);
        }
      }
    };
  }, [robotLocation.lat, robotLocation.lng, destination.lat, destination.lng]);

  // Update positions when robot moves
  useEffect(() => {
    if (isMapReady && robotMarker.current && routeLine.current) {
      try {
        robotMarker.current.setLatLng([robotLocation.lat, robotLocation.lng]);
        routeLine.current.setLatLngs([
          [robotLocation.lat, robotLocation.lng],
          [destination.lat, destination.lng]
        ]);
        console.log('📍 Robot position updated');
      } catch (error) {
        console.error('Update error:', error);
      }
    }
  }, [robotLocation.lat, robotLocation.lng, destination.lat, destination.lng, isMapReady]);

  if (mapError) {
    console.log('🗺️ Showing error state:', mapError);
    return (
      <div className={`w-full h-full ${className}`}>
        <div className="w-full h-full flex items-center justify-center bg-red-50 rounded-xl border border-red-200">
          <div className="text-center p-4">
            <div className="text-3xl mb-2">❌</div>
            <p className="text-red-600 font-semibold">{mapError}</p>
            <p className="text-xs text-gray-500 mt-2">
              Robot: {robotLocation.lat.toFixed(4)}, {robotLocation.lng.toFixed(4)}
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-3 px-4 py-2 bg-red-500 text-white rounded-lg text-sm"
            >
              Tải lại trang
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!isMapReady) {
    console.log('🗺️ Showing loading state...');
    return (
      <div className={`w-full h-full ${className}`}>
        <div className="w-full h-full flex items-center justify-center bg-blue-50 rounded-xl border border-blue-200">
          <div className="text-center p-4">
            <div className="text-3xl mb-3">🗺️</div>
            <p className="text-blue-600 font-semibold mb-2">Đang tải OpenStreetMap...</p>
            <div className="w-8 h-8 border-3 border-blue-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-xs text-gray-500">Ocean Park 3</p>
            <p className="text-xs text-gray-500">
              {robotLocation.lat.toFixed(4)}, {robotLocation.lng.toFixed(4)}
            </p>
          </div>
        </div>
      </div>
    );
  }

  console.log('🗺️ ✅ Rendering map container');
  return (
    <div className={`w-full h-full ${className}`}>
      <div 
        ref={mapRef} 
        className="w-full h-full rounded-xl bg-gray-100"
        style={{ minHeight: '400px', position: 'relative' }}
      />
    </div>
  );
};