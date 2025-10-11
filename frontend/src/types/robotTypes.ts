// Unified robot data interface that works with both mock and real MQTT data
export interface UnifiedRobotData {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'working' | 'charging' | 'maintenance' | 'error';
  position: {
    lat: number;
    lng: number;
    heading?: number;
  };
  battery: number;
  speed: number;
  temperature: number;
  lastSeen: number;
  
  // Optional properties for backwards compatibility
  location?: string;
  lastUpdated?: number;
  
  // Enhanced properties for real robots
  operational?: 'available' | 'busy' | 'maintenance' | 'error';
  capabilities?: string[];
  firmwareVersion?: string;
  mission?: {
    id: string;
    status: string;
    progress: number;
    estimatedCompletion?: number;
  };
}

// Conversion utilities
export const convertMockToUnified = (mockRobot: any): UnifiedRobotData => ({
  id: mockRobot.id,
  name: mockRobot.name,
  status: mockRobot.status,
  position: {
    lat: mockRobot.position?.lat || 0,
    lng: mockRobot.position?.lng || 0,
    heading: mockRobot.position?.heading || 0,
  },
  battery: mockRobot.battery || 0,
  speed: mockRobot.speed || 0,
  temperature: mockRobot.temperature || 0,
  lastSeen: mockRobot.lastUpdated || Date.now(),
  location: mockRobot.location,
  lastUpdated: mockRobot.lastUpdated,
});

export const convertRealToUnified = (realRobot: any): UnifiedRobotData => ({
  id: realRobot.id,
  name: realRobot.name,
  status: realRobot.status,
  position: realRobot.position,
  battery: realRobot.battery,
  speed: realRobot.speed,
  temperature: realRobot.temperature,
  lastSeen: realRobot.lastSeen,
  operational: realRobot.operational,
  capabilities: realRobot.capabilities,
  firmwareVersion: realRobot.firmwareVersion,
  mission: realRobot.mission,
});