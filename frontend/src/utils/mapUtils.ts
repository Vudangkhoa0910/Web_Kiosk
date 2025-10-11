// Map utilities for routing and optimization
export interface Location {
  lat: number;
  lng: number;
}

export interface RoutePoint extends Location {
  type?: 'pickup' | 'delivery' | 'waypoint';
  address?: string;
  name?: string;
}

/**
 * Calculate center point between two GPS coordinates
 */
export const calculateCenterGPS = (lat1: number, lng1: number, lat2: number, lng2: number): [number, number] => {
  const latitude = (lat1 + lat2) / 2;
  const longitude = (lng1 + lng2) / 2;
  return [latitude, longitude];
};

/**
 * Calculate distance between two GPS points using Haversine formula
 * Returns distance in meters
 */
export const calculateDistance = (point1: Location, point2: Location): number => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (point1.lat * Math.PI) / 180;
  const φ2 = (point2.lat * Math.PI) / 180;
  const Δφ = ((point2.lat - point1.lat) * Math.PI) / 180;
  const Δλ = ((point2.lng - point1.lng) * Math.PI) / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

/**
 * Find optimal robot for delivery based on distance and availability
 */
export const findOptimalRobot = (robots: any[], destination: Location): any | null => {
  const availableRobots = robots.filter(robot => 
    robot.status === 'available' && robot.batteryLevel > 20
  );

  if (availableRobots.length === 0) return null;

  return availableRobots.reduce((optimal, robot) => {
    const distance = calculateDistance(robot.location, destination);
    const optimalDistance = calculateDistance(optimal.location, destination);
    
    // Factor in battery level and distance
    const robotScore = distance - (robot.batteryLevel * 10); // Bonus for higher battery
    const optimalScore = optimalDistance - (optimal.batteryLevel * 10);
    
    return robotScore < optimalScore ? robot : optimal;
  });
};

/**
 * Generate route waypoints between pickup and delivery points
 */
export const generateRouteWaypoints = (pickup: Location, delivery: Location): RoutePoint[] => {
  const waypoints: RoutePoint[] = [
    { ...pickup, type: 'pickup' },
    { ...delivery, type: 'delivery' }
  ];

  // Add intermediate waypoints for longer distances
  const distance = calculateDistance(pickup, delivery);
  if (distance > 1000) { // More than 1km
    const midpoint = calculateCenterGPS(pickup.lat, pickup.lng, delivery.lat, delivery.lng);
    waypoints.splice(1, 0, {
      lat: midpoint[0],
      lng: midpoint[1],
      type: 'waypoint'
    });
  }

  return waypoints;
};

/**
 * Estimate delivery time based on distance and robot speed
 */
export const estimateDeliveryTime = (distance: number, robotSpeed: number = 1.5): number => {
  // Speed in m/s, return time in minutes
  const timeInSeconds = distance / robotSpeed;
  return Math.ceil(timeInSeconds / 60);
};

/**
 * Format GPS coordinates for display
 */
export const formatCoordinates = (lat: number, lng: number): string => {
  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
};

/**
 * Check if a point is within delivery radius
 */
export const isWithinDeliveryRadius = (center: Location, point: Location, radius: number = 2000): boolean => {
  const distance = calculateDistance(center, point);
  return distance <= radius;
};

/**
 * Get map bounds for multiple points
 */
export const getMapBounds = (points: Location[]): [[number, number], [number, number]] => {
  if (points.length === 0) {
    return [[21.0131, 105.7234], [21.0131, 105.7234]]; // Default to Ocean Park 2
  }

  const lats = points.map(p => p.lat);
  const lngs = points.map(p => p.lng);
  
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  // Add padding
  const latPadding = (maxLat - minLat) * 0.1;
  const lngPadding = (maxLng - minLng) * 0.1;

  return [
    [minLat - latPadding, minLng - lngPadding],
    [maxLat + latPadding, maxLng + lngPadding]
  ];
};

/**
 * Ocean Park 2 specific map settings
 */
export const MAP_SETTINGS = {
  DEFAULT_CENTER: [21.0131, 105.7234] as [number, number], // Ocean Park 2 center
  DEFAULT_ZOOM: 16.5,
  MIN_ZOOM: 14,
  MAX_ZOOM: 19,
  TILE_URL: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
  ATTRIBUTION: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
  MAP_OPTIONS: {
    zoomSnap: 0.5,
    zoomControl: false,
    attributionControl: false,
    scrollWheelZoom: true,
    doubleClickZoom: true,
    dragging: true
  }
};

/**
 * Get robot status color
 */
export const getRobotStatusColor = (status: string): string => {
  const colors = {
    available: '#10b981',
    delivering: '#3b82f6', 
    charging: '#f59e0b',
    maintenance: '#ef4444',
    offline: '#6b7280'
  };
  return colors[status as keyof typeof colors] || colors.offline;
};