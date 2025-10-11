import React, { useEffect, useState } from 'react';
import { Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { RoutePoint } from '../../utils/mapUtils';
import { calculateDistance } from '../../utils/mapUtils';

interface EnhancedMapRoutingProps {
  waypoints: RoutePoint[];
  showRoute?: boolean;
  routeColor?: string;
  onRouteCalculated?: (distance: number, duration: number) => void;
  useOSRM?: boolean; // Use Open Source Routing Machine
}

// OSRM API for real routing (free alternative to commercial services)
const OSRM_BASE_URL = 'https://router.project-osrm.org/route/v1/driving';

export const EnhancedMapRouting: React.FC<EnhancedMapRoutingProps> = ({
  waypoints,
  showRoute = true,
  routeColor = '#3b82f6',
  onRouteCalculated,
  useOSRM = false
}) => {
  const map = useMap();
  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (waypoints.length >= 2) {
      if (useOSRM) {
        calculateOSRMRoute();
      } else {
        calculateSimpleRoute();
      }
    }
  }, [waypoints, useOSRM]);

  // Calculate route using OSRM (real routing service)
  const calculateOSRMRoute = async () => {
    if (waypoints.length < 2) return;

    setIsLoading(true);
    try {
      // Build coordinates string for OSRM API
      const coordinates = waypoints
        .map(point => `${point.lng},${point.lat}`)
        .join(';');

      const url = `${OSRM_BASE_URL}/${coordinates}?overview=full&geometries=geojson`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const coordinates = route.geometry.coordinates.map(
          (coord: [number, number]) => [coord[1], coord[0]] as [number, number]
        );

        setRouteCoordinates(coordinates);

        if (onRouteCalculated) {
          const distance = route.distance; // meters
          const duration = Math.ceil(route.duration / 60); // convert to minutes
          onRouteCalculated(distance, duration);
        }

        // Fit map to show the entire route
        if (coordinates.length > 0) {
          const bounds = L.latLngBounds(coordinates);
          map.fitBounds(bounds, { padding: [20, 20] });
        }
      }
    } catch (error) {
      console.error('OSRM routing failed, falling back to simple routing:', error);
      calculateSimpleRoute();
    } finally {
      setIsLoading(false);
    }
  };

  // Simple straight-line route calculation (fallback)
  const calculateSimpleRoute = async () => {
    if (waypoints.length < 2) return;

    try {
      const coordinates: [number, number][] = [];
      let totalDistance = 0;

      for (let i = 0; i < waypoints.length; i++) {
        const point = waypoints[i];
        coordinates.push([point.lat, point.lng]);

        if (i > 0) {
          const prevPoint = waypoints[i - 1];
          totalDistance += calculateDistance(prevPoint, point);
        }
      }

      // Add intermediate points for smoother visualization
      const smoothedCoordinates = addIntermediatePoints(coordinates);
      
      setRouteCoordinates(smoothedCoordinates);

      // Estimate duration (assuming 1.5 m/s average speed for robots)
      const estimatedDuration = Math.ceil(totalDistance / 1.5 / 60); // minutes

      if (onRouteCalculated) {
        onRouteCalculated(totalDistance, estimatedDuration);
      }

      // Fit map to show the entire route
      if (smoothedCoordinates.length > 0) {
        const bounds = L.latLngBounds(smoothedCoordinates);
        map.fitBounds(bounds, { padding: [20, 20] });
      }
    } catch (error) {
      console.error('Route calculation failed:', error);
    }
  };

  // Add intermediate points for smoother route visualization
  const addIntermediatePoints = (coordinates: [number, number][]): [number, number][] => {
    const smoothed: [number, number][] = [];

    for (let i = 0; i < coordinates.length - 1; i++) {
      const start = coordinates[i];
      const end = coordinates[i + 1];
      
      smoothed.push(start);

      // Add intermediate points for longer segments
      const distance = calculateDistance(
        { lat: start[0], lng: start[1] },
        { lat: end[0], lng: end[1] }
      );

      if (distance > 300) { // Add intermediate points for segments > 300m
        const steps = Math.floor(distance / 150); // Point every ~150m
        for (let step = 1; step < steps; step++) {
          const ratio = step / steps;
          const lat = start[0] + (end[0] - start[0]) * ratio;
          const lng = start[1] + (end[1] - start[1]) * ratio;
          smoothed.push([lat, lng]);
        }
      }
    }

    // Add the final point
    if (coordinates.length > 0) {
      smoothed.push(coordinates[coordinates.length - 1]);
    }

    return smoothed;
  };

  if (!showRoute || routeCoordinates.length < 2) {
    return null;
  }

  return (
    <>
      {/* Main route line */}
      <Polyline
        positions={routeCoordinates}
        pathOptions={{
          color: routeColor,
          weight: 4,
          opacity: 0.8,
          dashArray: isLoading ? "10, 10" : undefined,
          className: isLoading ? 'animate-pulse' : ''
        }}
      />
      
      {/* Route direction indicators (arrows) */}
      {routeCoordinates.length > 10 && (
        <Polyline
          positions={routeCoordinates.filter((_, index) => index % 10 === 0)}
          pathOptions={{
            color: routeColor,
            weight: 2,
            opacity: 0.6,
            dashArray: "5, 15"
          }}
        />
      )}
    </>
  );
};

export default EnhancedMapRouting;