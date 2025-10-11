import type { ID, Position, Timestamp } from './common'

export type RobotStatus = 'online' | 'offline' | 'working' | 'charging' | 'maintenance' | 'error'
export type OperationalStatus = 'available' | 'busy' | 'maintenance' | 'error'

export interface BaseRobot {
  id: ID
  name: string
  status: RobotStatus
  battery: number
  lastSeen: Timestamp
}

export interface RobotPosition extends Position {
  heading?: number
}

export interface RobotMission {
  id: ID
  status: string
  progress: number
  estimatedCompletion?: number
}

export interface Robot extends BaseRobot {
  position: RobotPosition
  speed: number
  temperature: number
  operational?: OperationalStatus
  capabilities?: string[]
  firmwareVersion?: string
  mission?: RobotMission
}

// Legacy compatibility
export interface LegacyRobot {
  id: ID
  name: string
  status: 'available' | 'delivering' | 'charging' | 'maintenance'
  currentOrder?: string
  location: Position
  batteryLevel: number
  lastUpdated: Timestamp
  destination?: string
  eta?: string
  speed: number
}

// Conversion utilities
export const convertLegacyRobot = (legacy: LegacyRobot): Robot => ({
  id: legacy.id,
  name: legacy.name,
  status: legacy.status === 'available' ? 'online' : 
          legacy.status === 'delivering' ? 'working' :
          legacy.status === 'charging' ? 'charging' :
          legacy.status === 'maintenance' ? 'maintenance' : 'offline',
  position: {
    lat: legacy.location.lat,
    lng: legacy.location.lng
  },
  battery: legacy.batteryLevel,
  speed: legacy.speed,
  temperature: 25, // Default
  lastSeen: legacy.lastUpdated,
  operational: legacy.status === 'available' ? 'available' :
              legacy.status === 'delivering' ? 'busy' :
              legacy.status === 'maintenance' ? 'maintenance' : 'error'
})