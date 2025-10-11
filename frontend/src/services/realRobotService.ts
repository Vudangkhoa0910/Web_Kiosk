import { io, Socket } from 'socket.io-client';

export interface RealRobotData {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'working' | 'charging' | 'maintenance' | 'error';
  position: {
    lat: number;
    lng: number;
    heading: number;
  };
  battery: number;
  speed: number;
  temperature: number;
  lastSeen: number;
  operational: 'available' | 'busy' | 'maintenance' | 'error';
  capabilities: string[];
  firmwareVersion: string;
  mission?: {
    id: string;
    status: string;
    progress: number;
    estimatedCompletion?: number;
  };
}

export interface RobotCommand {
  type: 'move' | 'stop' | 'return_home' | 'pickup' | 'deliver' | 'emergency_stop';
  payload: {
    target_position?: { lat: number; lng: number };
    speed?: number;
    order_id?: string;
    delivery_location?: { lat: number; lng: number };
    pickup_location?: { lat: number; lng: number };
  };
  priority: 'low' | 'medium' | 'high' | 'emergency';
}

class RealRobotService {
  private socket: Socket | null = null;
  private robots: Map<string, RealRobotData> = new Map();
  private subscribers: Set<(robots: RealRobotData[]) => void> = new Set();
  private connectionStatus: 'connected' | 'disconnected' | 'connecting' = 'disconnected';
  private statusSubscribers: Set<(status: 'connected' | 'disconnected' | 'connecting') => void> = new Set();
  private backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
  
  constructor() {
    this.connect();
  }

  // Connect to backend robot service
  connect(): void {
    if (this.socket && this.socket.connected) {
      console.log('Real robot service already connected');
      return;
    }

    this.connectionStatus = 'connecting';
    this.notifyStatusSubscribers();

    console.log('🤖 Connecting to real robot service...');

    this.socket = io(this.backendUrl, {
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true
    });

    this.setupEventHandlers();
  }

  // Setup Socket.IO event handlers
  private setupEventHandlers(): void {
    if (!this.socket) return;

    // Connection events
    this.socket.on('connect', () => {
      console.log('✅ Connected to real robot service');
      this.connectionStatus = 'connected';
      this.notifyStatusSubscribers();
      
      // Request current robot data
      this.socket?.emit('request_robot_data');
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Disconnected from real robot service');
      this.connectionStatus = 'disconnected';
      this.notifyStatusSubscribers();
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Real robot service connection error:', error);
      this.connectionStatus = 'disconnected';
      this.notifyStatusSubscribers();
    });

    // Robot data events
    this.socket.on('robot_data_snapshot', (data) => {
      console.log('📊 Real robot data snapshot:', data);
      this.processRobotDataSnapshot(data);
    });

    this.socket.on('robot_telemetry_update', (data) => {
      console.log('📡 Real robot telemetry:', data);
      this.processRobotTelemetry(data);
    });

    this.socket.on('robot_status_update', (data) => {
      console.log('📈 Real robot status:', data);
      this.processRobotStatus(data);
    });

    // Command acknowledgments
    this.socket.on('command_sent', (data) => {
      console.log('✅ Robot command sent:', data);
    });

    this.socket.on('command_error', (data) => {
      console.error('❌ Robot command error:', data);
    });

    this.socket.on('bulldog04_command_sent', (data) => {
      console.log('✅ Bulldog04 command sent:', data);
    });

    this.socket.on('bulldog05_command_sent', (data) => {
      console.log('✅ Bulldog05 command sent:', data);
    });

    // MQTT status events
    this.socket.on('robot_mqtt_connected', () => {
      console.log('🔗 Robot MQTT broker connected');
    });

    this.socket.on('robot_mqtt_disconnected', () => {
      console.log('⚠️ Robot MQTT broker disconnected');
    });

    this.socket.on('robot_mqtt_error', (data) => {
      console.error('❌ Robot MQTT error:', data);
    });
  }

  // Process robot data snapshot
  private processRobotDataSnapshot(data: any): void {
    try {
      console.log('🔄 Processing robot data snapshot:', data);
      const { telemetry, status } = data;
      
      console.log(`📊 Telemetry entries: ${telemetry?.length || 0}, Status entries: ${status?.length || 0}`);
      
      // Clear existing data
      this.robots.clear();
      
      // Process telemetry data
      if (telemetry && Array.isArray(telemetry)) {
        telemetry.forEach((tel: any, index: number) => {
          console.log(`🔍 Processing telemetry ${index}:`, tel);
          const robot = this.convertTelemetryToRobotData(tel);
          console.log(`✅ Converted telemetry to robot:`, robot);
          this.robots.set(robot.id, robot);
        });
      }

      // Merge status data
      if (status && Array.isArray(status)) {
        status.forEach((stat: any, index: number) => {
          console.log(`🔍 Processing status ${index}:`, stat);
          const existing = this.robots.get(stat.robot_id);
          if (existing && stat.robot_id) {
            const robotUpdate = this.convertStatusToRobotData(stat);
            console.log(`🔄 Merging status into existing robot ${stat.robot_id}:`, robotUpdate);
            this.robots.set(stat.robot_id, {
              ...existing,
              status: robotUpdate.status,
              operational: robotUpdate.operational,
              capabilities: robotUpdate.capabilities,
              firmwareVersion: robotUpdate.firmwareVersion,
              lastSeen: robotUpdate.lastSeen
            });
          } else if (stat.robot_id) {
            const robot = this.convertStatusToRobotData(stat);
            console.log(`➕ Adding new robot from status ${stat.robot_id}:`, robot);
            this.robots.set(stat.robot_id, robot);
          }
        });
      }

      console.log(`💾 Final robots map size: ${this.robots.size}`);
      console.log(`🤖 Robots in map:`, Array.from(this.robots.keys()));
      
      this.notifySubscribers();
      
    } catch (error) {
      console.error('Error processing robot data snapshot:', error);
    }
  }

  // Process telemetry update
  private processRobotTelemetry(data: any): void {
    try {
      const { robotId, data: telemetry } = data;
      console.log(`📡 Processing individual telemetry for ${robotId}:`, telemetry);
      
      if (!robotId) {
        console.warn('⚠️ Telemetry update missing robotId');
        return;
      }
      
      const robotUpdate = this.convertTelemetryToRobotData(telemetry);
      console.log(`✅ Converted telemetry to robot data:`, robotUpdate);
      
      const existing = this.robots.get(robotId);
      if (existing) {
        console.log(`🔄 Updating existing robot ${robotId}`);
        this.robots.set(robotId, { 
          ...existing, 
          status: robotUpdate.status,
          position: robotUpdate.position,
          battery: robotUpdate.battery,
          speed: robotUpdate.speed,
          temperature: robotUpdate.temperature,
          lastSeen: robotUpdate.lastSeen,
          mission: robotUpdate.mission
        });
      } else {
        console.log(`➕ Adding new robot ${robotId} from telemetry`);
        this.robots.set(robotId, robotUpdate);
      }
      
      console.log(`💾 Current robots count: ${this.robots.size}`);
      this.notifySubscribers();
      
    } catch (error) {
      console.error('Error processing robot telemetry:', error);
    }
  }

  // Process status update
  private processRobotStatus(data: any): void {
    try {
      const { robotId, data: status } = data;
      console.log(`📈 Processing individual status for ${robotId}:`, status);
      
      if (!robotId) {
        console.warn('⚠️ Status update missing robotId');
        return;
      }
      
      const robotUpdate = this.convertStatusToRobotData(status);
      console.log(`✅ Converted status to robot data:`, robotUpdate);
      
      const existing = this.robots.get(robotId);
      if (existing) {
        console.log(`🔄 Updating existing robot ${robotId} status`);
        this.robots.set(robotId, { 
          ...existing,
          status: robotUpdate.status,
          operational: robotUpdate.operational,
          capabilities: robotUpdate.capabilities,
          firmwareVersion: robotUpdate.firmwareVersion,
          lastSeen: robotUpdate.lastSeen
        });
      } else {
        console.log(`➕ Adding new robot ${robotId} from status`);
        this.robots.set(robotId, robotUpdate);
      }
      
      console.log(`💾 Current robots count: ${this.robots.size}`);
      this.notifySubscribers();
      
    } catch (error) {
      console.error('Error processing robot status:', error);
    }
  }

  // Convert telemetry to robot data
  private convertTelemetryToRobotData(telemetry: any): RealRobotData {
    const robotId = telemetry.robot_id || 'unknown';
    return {
      id: robotId,
      name: robotId === 'bulldog04_5f899b' ? 'Bulldog 04' : 
            robotId === 'bulldog05_5f899b' ? 'Bulldog 05' : 
            robotId.includes('bulldog04') ? 'Bulldog 04' :
            robotId.includes('bulldog05') ? 'Bulldog 05' :
            robotId,
      status: this.mapRobotStatus(telemetry.status?.state),
      position: telemetry.position || { lat: 0, lng: 0, heading: 0 },
      battery: telemetry.status?.battery_level || 0,
      speed: telemetry.status?.speed || 0,
      temperature: telemetry.status?.temperature || 0,
      lastSeen: telemetry.timestamp || Date.now(),
      operational: 'available',
      capabilities: [],
      firmwareVersion: 'unknown',
      mission: telemetry.mission
    };
  }

  // Convert status to robot data
  private convertStatusToRobotData(status: any): RealRobotData {
    const robotId = status.robot_id || 'unknown';
    return {
      id: robotId,
      name: robotId === 'bulldog04_5f899b' ? 'Bulldog 04' : 
            robotId === 'bulldog05_5f899b' ? 'Bulldog 05' : 
            robotId.includes('bulldog04') ? 'Bulldog 04' :
            robotId.includes('bulldog05') ? 'Bulldog 05' :
            robotId,
      status: status.online ? 'online' : 'offline',
      position: { lat: 0, lng: 0, heading: 0 },
      battery: 0,
      speed: 0,
      temperature: 0,
      operational: status.operational_status || 'available',
      capabilities: status.capabilities || [],
      firmwareVersion: status.firmware_version || 'unknown',
      lastSeen: status.last_seen || Date.now()
    };
  }

  // Map robot state to status
  private mapRobotStatus(state: string): RealRobotData['status'] {
    switch (state) {
      case 'idle': return 'online';
      case 'moving':
      case 'delivering': return 'working';
      case 'charging': return 'charging';
      case 'maintenance': return 'maintenance';
      case 'error': return 'error';
      default: return 'offline';
    }
  }

  // Send command to specific robot
  async sendRobotCommand(robotId: string, command: RobotCommand): Promise<void> {
    if (!this.socket || this.connectionStatus !== 'connected') {
      throw new Error('Not connected to robot service');
    }

    const fullCommand = {
      id: `cmd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      ...command
    };

    this.socket.emit('send_robot_command', {
      robotId,
      command: fullCommand
    });
  }

  // Send command to Bulldog04
  async sendBulldog04Command(command: RobotCommand): Promise<void> {
    if (!this.socket || this.connectionStatus !== 'connected') {
      throw new Error('Not connected to robot service');
    }

    this.socket.emit('bulldog04_command', command);
  }

  // Send command to Bulldog05
  async sendBulldog05Command(command: RobotCommand): Promise<void> {
    if (!this.socket || this.connectionStatus !== 'connected') {
      throw new Error('Not connected to robot service');
    }

    this.socket.emit('bulldog05_command', command);
  }

  // Emergency stop all robots
  async emergencyStopAll(): Promise<void> {
    if (!this.socket || this.connectionStatus !== 'connected') {
      throw new Error('Not connected to robot service');
    }

    this.socket.emit('emergency_stop_all');
  }

  // Subscribe to robot data updates
  subscribe(callback: (robots: RealRobotData[]) => void): () => void {
    this.subscribers.add(callback);
    
    // Immediately call with current data
    callback(Array.from(this.robots.values()));
    
    return () => {
      this.subscribers.delete(callback);
    };
  }

  // Subscribe to connection status updates
  subscribeToConnectionStatus(callback: (status: 'connected' | 'disconnected' | 'connecting') => void): () => void {
    this.statusSubscribers.add(callback);
    
    // Immediately call with current status
    callback(this.connectionStatus);
    
    return () => {
      this.statusSubscribers.delete(callback);
    };
  }

  // Get current robots
  getRobots(): RealRobotData[] {
    return Array.from(this.robots.values());
  }

  // Get connection status
  getConnectionStatus(): 'connected' | 'disconnected' | 'connecting' {
    return this.connectionStatus;
  }

  // Notify subscribers
  private notifySubscribers(): void {
    const robotsArray = Array.from(this.robots.values());
    console.log(`🔔 Notifying ${this.subscribers.size} subscribers with ${robotsArray.length} robots:`, robotsArray.map(r => ({ id: r.id, name: r.name, status: r.status })));
    this.subscribers.forEach(callback => {
      try {
        callback(robotsArray);
      } catch (error) {
        console.error('Error in subscriber callback:', error);
      }
    });
  }

  // Notify status subscribers
  private notifyStatusSubscribers(): void {
    this.statusSubscribers.forEach(callback => callback(this.connectionStatus));
  }

  // Disconnect
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.connectionStatus = 'disconnected';
    this.robots.clear();
    this.notifyStatusSubscribers();
    this.notifySubscribers();
  }
}

// Export singleton instance
export const realRobotService = new RealRobotService();
export default realRobotService;