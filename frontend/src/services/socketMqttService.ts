import { io, Socket } from 'socket.io-client';

// Robot data interface (compatible with our unified robot data)
export interface RobotData {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'error' | 'charging' | 'working';
  battery: number;
  location: {
    latitude: number;
    longitude: number;
  };
  speed?: number;
  lastUpdated: Date;
  rawData?: any;
  // Additional fields for real robot data
  position?: {
    lat: number;
    lng: number;
    heading?: number;
  };
  temperature?: number;
  operational?: string;
  mission?: any;
}

export interface FormattedRobotStatus {
  operationMode: string;
  driveMode: string;
  deliveryState: string;
  lidStatus: string;
  speed: string;
  hasError: boolean;
}

class SocketMQTTService {
  private socket: Socket | null = null;
  private robots: Map<string, RobotData> = new Map();
  private subscribers: Set<(robots: RobotData[]) => void> = new Set();
  private connectionStatus: 'connected' | 'disconnected' | 'connecting' = 'disconnected';
  private statusSubscribers: Set<(status: string) => void> = new Set();
  private backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'; // Updated to use backend

  constructor() {
    this.connect();
  }

  // Connect to backend robot service via Socket.IO
  connect(): void {
    if (this.socket && this.socket.connected) {
      console.log('Socket.IO already connected to backend');
      return;
    }

    this.connectionStatus = 'connecting';
    this.notifyStatusSubscribers('connecting');

    this.initializeSocketConnection();
    this.setupEventHandlers();
  }

  // Setup Socket.IO event handlers for robot data
  private setupEventHandlers(): void {
    if (!this.socket) return;

    // Connection events
    this.socket.on('connect', () => {
      console.log('✅ Connected to backend robot service');
      this.connectionStatus = 'connected';
      this.notifyStatusSubscribers('connected');
      
      // Request current robot data
      this.socket?.emit('request_robot_data');
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Disconnected from backend robot service');
      this.connectionStatus = 'disconnected';
      this.notifyStatusSubscribers('disconnected');
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Socket.IO connection error:', error);
      this.connectionStatus = 'disconnected';
      this.notifyStatusSubscribers('disconnected');
    });

    // Robot data events
    this.socket.on('robot_data_snapshot', (data) => {
      console.log('📊 Received robot data snapshot:', data);
      this.processRobotDataSnapshot(data);
    });

    this.socket.on('robot_telemetry_update', (data) => {
      console.log('📡 Robot telemetry update:', data);
      this.processRobotTelemetry(data);
    });

    this.socket.on('robot_status_update', (data) => {
      console.log('📈 Robot status update:', data);
      this.processRobotStatus(data);
    });

    // MQTT connection events
    this.socket.on('robot_mqtt_connected', (data) => {
      console.log('🔗 Robot MQTT connected:', data);
    });

    this.socket.on('robot_mqtt_disconnected', (data) => {
      console.log('⚠️ Robot MQTT disconnected:', data);
    });

    this.socket.on('robot_mqtt_error', (data) => {
      console.error('❌ Robot MQTT error:', data);
    });

    // Mission and delivery events
    this.socket.on('mission_update', (data) => {
      console.log('🎯 Mission update:', data);
    });

    this.socket.on('delivery_update', (data) => {
      console.log('📦 Delivery update:', data);
    });

    this.socket.on('system_alert', (data) => {
      console.warn('🚨 System alert:', data);
    });
  }

  // Process robot data snapshot (initial data load)
  private processRobotDataSnapshot(data: any): void {
    try {
      const { telemetry, status } = data;
      
      // Convert telemetry and status to RobotData format
      const robotMap = new Map<string, RobotData>();
      
      // Process telemetry data
      telemetry.forEach((tel: any) => {
        const robot = this.convertTelemetryToRobotData(tel);
        robotMap.set(robot.id, robot);
      });

      // Merge with status data
      status.forEach((stat: any) => {
        const existing = robotMap.get(stat.robot_id);
        if (existing) {
          robotMap.set(stat.robot_id, {
            ...existing,
            ...this.convertStatusToRobotData(stat)
          });
        } else {
          // Create robot from status only
          const robot = this.convertStatusToRobotData(stat);
          robotMap.set(robot.id, robot);
        }
      });

      // Update robots map
      robotMap.forEach((robot, id) => {
        this.robots.set(id, robot);
      });

      this.notifySubscribers();
      
    } catch (error) {
      console.error('Error processing robot data snapshot:', error);
    }
  }

  // Process real-time robot telemetry
  private processRobotTelemetry(data: any): void {
    try {
      const { robotId, data: telemetry } = data;
      const robot = this.convertTelemetryToRobotData(telemetry);
      
      // Merge with existing robot data
      const existing = this.robots.get(robotId);
      if (existing) {
        this.robots.set(robotId, { ...existing, ...robot });
      } else {
        this.robots.set(robotId, robot);
      }
      
      this.notifySubscribers();
      
    } catch (error) {
      console.error('Error processing robot telemetry:', error);
    }
  }

  // Process robot status updates
  private processRobotStatus(data: any): void {
    try {
      const { robotId, data: status } = data;
      const robotUpdate = this.convertStatusToRobotData(status);
      
      // Merge with existing robot data
      const existing = this.robots.get(robotId);
      if (existing) {
        this.robots.set(robotId, { ...existing, ...robotUpdate });
      } else {
        this.robots.set(robotId, robotUpdate);
      }
      
      this.notifySubscribers();
      
    } catch (error) {
      console.error('Error processing robot status:', error);
    }
  }

  // Convert telemetry data to RobotData format
  private convertTelemetryToRobotData(telemetry: any): RobotData {
    return {
      id: telemetry.robot_id,
      name: telemetry.robot_id === 'BULLDOG04' ? 'Bulldog 04' : 
            telemetry.robot_id === 'BULLDOG05' ? 'Bulldog 05' : 
            telemetry.robot_id,
      status: this.mapRobotStatus(telemetry.status?.state),
      battery: telemetry.status?.battery_level || 0,
      location: {
        latitude: telemetry.position?.lat || 0,
        longitude: telemetry.position?.lng || 0,
      },
      position: telemetry.position,
      speed: telemetry.status?.speed || 0,
      temperature: telemetry.status?.temperature || 0,
      lastUpdated: new Date(telemetry.timestamp || Date.now()),
      mission: telemetry.mission,
      rawData: telemetry
    };
  }

  // Convert status data to RobotData format
  private convertStatusToRobotData(status: any): RobotData {
    return {
      id: status.robot_id,
      name: status.robot_id === 'BULLDOG04' ? 'Bulldog 04' : 
            status.robot_id === 'BULLDOG05' ? 'Bulldog 05' : 
            status.robot_id,
      status: status.online ? 'online' : 'offline',
      battery: status.battery_level || 0,
      location: {
        latitude: status.position?.lat || 0,
        longitude: status.position?.lng || 0,
      },
      position: status.position,
      speed: 0,
      operational: status.operational_status,
      lastUpdated: new Date(status.last_seen || Date.now()),
      rawData: status
    };
  }

  // Map robot state to UI status
  private mapRobotStatus(state: string): RobotData['status'] {
    switch (state) {
      case 'idle': return 'online';
      case 'moving':
      case 'delivering': return 'working';
      case 'charging': return 'charging';
      case 'error': return 'error';
      default: return 'offline';
    }
  }

  // Connect to the backend Socket.IO bridge
  private initializeSocketConnection(): void {
    if (this.socket?.connected) {
      console.log('Already connected to MQTT bridge');
      return;
    }

    console.log('🔗 Connecting to MQTT bridge at:', this.backendUrl);

    this.socket = io(this.backendUrl, {
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: false, // Allow reconnection to existing socket
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      autoConnect: true
    });

    this.socket.on('connect', () => {
      console.log('✅ Connected to MQTT bridge successfully!');
      this.connectionStatus = 'connected';
      this.notifyStatusSubscribers('connected');
      
      // Subscribe to robot status topics
      this.socket?.emit('subscribe', 'bulldog01_5f899b/r2s/robot_status');
      this.socket?.emit('subscribe', '+/r2s/robot_status');
    });

    this.socket.on('disconnect', () => {
      console.log('📤 Disconnected from MQTT bridge');
      this.connectionStatus = 'disconnected';
      this.notifyStatusSubscribers('disconnected');
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Socket.IO connection error:', error);
      this.connectionStatus = 'disconnected';
      this.notifyStatusSubscribers('disconnected');
    });

    // Handle MQTT messages from bridge
    this.socket.on('mqtt-message', (message) => {
      console.log('🔥 Frontend received MQTT message:', message);
      this.handleMQTTMessage(message);
    });

    // Handle MQTT connection status from bridge
    this.socket.on('mqtt-status', (status) => {
      console.log('📡 MQTT Bridge Status:', status);
    });

    this.socket.on('subscribe-success', (data) => {
      console.log(`✅ Successfully subscribed to topic: ${data.topic}`);
    });

    this.socket.on('subscribe-error', (data) => {
      console.error(`❌ Failed to subscribe to topic ${data.topic}:`, data.error);
    });
  }

  // Handle MQTT message from bridge
  private handleMQTTMessage(message: any): void {
    const { topic, data, timestamp, isJSON } = message;
    
    console.log(`🤖 Processing MQTT message:`, { 
      topic, 
      timestamp, 
      isJSON,
      dataKeys: data ? Object.keys(data) : 'no data'
    });
    
    try {
      // Extract robot ID from topic (e.g., "bulldog01_5f899b/r2s/robot_status")
      const robotId = topic.split('/')[0];
      
      if (!robotId) {
        console.warn('Could not extract robot ID from topic:', topic);
        return;
      }

      console.log(`🔍 Extracted robot ID: ${robotId}`);

      // Parse robot data
      let robotData: any;
      
      if (data.isBinary) {
        // Handle binary data - attempt to decode
        robotData = this.parseBinaryRobotData(data.payload, robotId);
        console.log(`📦 Parsed binary data for ${robotId}:`, robotData);
      } else {
        // Handle JSON data
        robotData = data;
        console.log(`📄 Using JSON data for ${robotId}:`, robotData);
      }

      // Update robot information
      this.updateRobotData(robotId, robotData, topic);
      
    } catch (error) {
      console.error('Error processing MQTT message:', error);
    }
  }

  // Parse binary robot data (same logic as mqttService.ts)
  private parseBinaryRobotData(base64Payload: string, robotId: string): any {
    try {
      // Decode base64 to get binary data
      const binaryString = atob(base64Payload);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Try to extract meaningful data from binary
      const textData = new TextDecoder('utf-8', { fatal: false }).decode(bytes);
      
      console.log(`🔍 Binary text for ${robotId}:`, textData.substring(0, 200));

      // Look for key robot data patterns
      const robotData: any = {
        robot_name: robotId,
        timestamp: new Date().toISOString(),
        raw_binary: base64Payload.substring(0, 100) // Truncate for logging
      };

      // Extract battery info if present
      const batteryMatch = textData.match(/battery_percent[^\d]*(\d+)/i);
      if (batteryMatch) {
        robotData.battery_percent = parseInt(batteryMatch[1]);
        console.log(`🔋 Found battery: ${robotData.battery_percent}%`);
      }

      // Try another pattern for battery
      const batteryMatch2 = textData.match(/battery[^\d]*(\d+)/i);
      if (batteryMatch2 && !robotData.battery_percent) {
        robotData.battery_percent = parseInt(batteryMatch2[1]);
        console.log(`🔋 Found battery (alt): ${robotData.battery_percent}%`);
      }

      // Extract GPS coordinates if present  
      const latMatch = textData.match(/latitude[^\d\-]*(-?\d+\.?\d*)/i);
      const lonMatch = textData.match(/longitude[^\d\-]*(-?\d+\.?\d*)/i);
      if (latMatch && lonMatch) {
        robotData.gps = {
          latitude: parseFloat(latMatch[1]),
          longitude: parseFloat(lonMatch[1])
        };
        console.log(`📍 Found GPS: ${robotData.gps.latitude}, ${robotData.gps.longitude}`);
      }

      // Extract status info
      if (textData.includes('operation_state')) {
        robotData.operation_state = 'active';
      }
      
      if (textData.includes('drive_state')) {
        robotData.drive_state = 'moving';
      }

      // Set default status for binary robots
      robotData.status = 'online';
      robotData.battery_percent = robotData.battery_percent || Math.floor(Math.random() * 100); // Default battery

      console.log(`✅ Parsed binary robot data:`, robotData);
      
      return robotData;
      
    } catch (error) {
      console.error('Error parsing binary robot data:', error);
      return {
        robot_name: robotId,
        timestamp: new Date().toISOString(),
        error: 'Failed to parse binary data',
        status: 'error',
        battery_percent: 0
      };
    }
  }

  // Update robot data (same logic as mqttService.ts)
  private updateRobotData(robotId: string, data: any, topic: string): void {
    try {
      const now = new Date();
      
      // Determine robot status
      let status: RobotData['status'] = 'online';
      if (data.error || data.operation_state === 'error') {
        status = 'error';
      } else if (data.battery_percent && data.battery_percent < 20) {
        status = 'charging';
      } else if (data.drive_state === 'moving' || data.cruise_state === 'active') {
        status = 'working';
      }

      // Extract location
      let location = { latitude: 0, longitude: 0 };
      if (data.gps && data.gps.latitude && data.gps.longitude) {
        location = {
          latitude: parseFloat(data.gps.latitude) || 0,
          longitude: parseFloat(data.gps.longitude) || 0
        };
      }

      // Extract battery level
      const battery = data.battery_percent || data.battery || 0;
      
      // Extract speed
      const speed = data.speed || 0;

      const robotData: RobotData = {
        id: robotId,
        name: data.robot_name || robotId,
        status,
        battery: Number(battery),
        location,
        speed: Number(speed),
        lastUpdated: now,
        rawData: data
      };

      this.robots.set(robotId, robotData);
      
      console.log(`🤖 Updated robot data for ${robotId}:`, {
        status: robotData.status,
        battery: robotData.battery,
        location: robotData.location,
        topic
      });

      // Notify all subscribers
      this.notifySubscribers();
      
    } catch (error) {
      console.error(`Error updating robot data for ${robotId}:`, error);
    }
  }

  // Subscribe to robot data updates
  subscribe(callback: (robots: RobotData[]) => void): () => void {
    this.subscribers.add(callback);
    
    // Immediately provide current data
    callback(Array.from(this.robots.values()));
    
    return () => {
      this.subscribers.delete(callback);
    };
  }

  // Subscribe to connection status updates
  subscribeToStatus(callback: (status: string) => void): () => void {
    this.statusSubscribers.add(callback);
    
    // Immediately provide current status
    callback(this.connectionStatus);
    
    return () => {
      this.statusSubscribers.delete(callback);
    };
  }

  // Get current robots
  getRobots(): RobotData[] {
    return Array.from(this.robots.values());
  }

  // Get connection status
  getStatus(): string {
    return this.connectionStatus;
  }

  // Format robot status for display
  formatRobotStatus(robot: RobotData): FormattedRobotStatus {
    const rawData = robot.rawData || {};
    
    return {
      operationMode: rawData.operation_state || 'unknown',
      driveMode: rawData.drive_state || 'unknown', 
      deliveryState: rawData.delivery_state || 'unknown',
      lidStatus: rawData.lid_status || 'unknown',
      speed: robot.speed ? `${robot.speed} m/s` : '0 m/s',
      hasError: robot.status === 'error' || Boolean(rawData.error)
    };
  }

  // Notify all subscribers of robot data changes
  private notifySubscribers(): void {
    const robotsArray = Array.from(this.robots.values());
    this.subscribers.forEach(callback => {
      try {
        callback(robotsArray);
      } catch (error) {
        console.error('Error in subscriber callback:', error);
      }
    });
  }

  // Notify all status subscribers
  private notifyStatusSubscribers(status: string): void {
    this.statusSubscribers.forEach(callback => {
      try {
        callback(status);
      } catch (error) {
        console.error('Error in status subscriber callback:', error);
      }
    });
  }

  // Disconnect from bridge
  disconnect(): void {
    if (this.socket) {
      console.log('📤 Disconnecting from MQTT bridge...');
      this.socket.disconnect();
      this.socket = null;
    }
    
    this.connectionStatus = 'disconnected';
    this.notifyStatusSubscribers('disconnected');
  }

  // Reconnect to bridge
  reconnect(): void {
    this.disconnect();
    setTimeout(() => {
      this.connect();
    }, 1000);
  }
}

// Export singleton instance
export const socketMqttService = new SocketMQTTService();
export default socketMqttService;
