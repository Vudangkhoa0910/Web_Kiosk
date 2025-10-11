import React, { useEffect, useState } from 'react';
import { Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { RoutePoint } from '../../utils/mapUtils';
import { calculateDistance } from '../../utils/mapUtils';

interface MapRoutingProps {
  waypoints: RoutePoint[];
  showRoute?: boolean;
  routeColor?: string;
  onRouteCalculated?: (distance: number, duration: number) => void;
}

export const MapRouting: React.FC<MapRoutingProps> = ({
  waypoints,
  showRoute = true,
  routeColor = '#3b82f6',
  onRouteCalculated
}) => {
  const map = useMap();
  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>([]);

  useEffect(() => {
    if (waypoints.length >= 2) {
      calculateRoute();
    }
  }, [waypoints]);

  const calculateRoute = async () => {
    try {
      // For demo purposes, we'll create a simple route between waypoints
      // In production, you would use a routing service like OSRM, GraphHopper, or Mapbox
      const coordinates: [number, number][] = [];
      let totalDist = 0;

      for (let i = 0; i < waypoints.length; i++) {
        const point = waypoints[i];
        coordinates.push([point.lat, point.lng]);

        if (i > 0) {
          const prevPoint = waypoints[i - 1];
          totalDist += calculateDistance(prevPoint, point);
        }
      }

      // Add some intermediate points for smoother route visualization
      const smoothedCoordinates = await addIntermediatePoints(coordinates);
      
      setRouteCoordinates(smoothedCoordinates);

      // Estimate duration (assuming 1.5 m/s average speed)
      const estimatedDuration = Math.ceil(totalDist / 1.5 / 60); // minutes

      if (onRouteCalculated) {
        onRouteCalculated(totalDist, estimatedDuration);
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
  const addIntermediatePoints = async (coordinates: [number, number][]): Promise<[number, number][]> => {
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

      if (distance > 500) { // Add intermediate points for segments > 500m
        const steps = Math.floor(distance / 300); // Point every ~300m
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
    <Polyline
      positions={routeCoordinates}
      color={routeColor}
      weight={4}
      opacity={0.8}
      dashArray="5, 10"
      pathOptions={{
        color: routeColor,
        weight: 4,
        opacity: 0.8,
        className: 'route-polyline'
      }}
    />
  );
};

export default MapRouting;