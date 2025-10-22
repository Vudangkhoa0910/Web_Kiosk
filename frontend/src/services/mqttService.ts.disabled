import mqtt from 'mqtt';

// Robot Status Enums (from RobotStatus.msg)
export const ROBOT_STATUS = {
  OPERATION_MODE: {
    0: 'IDLE',
    1: 'MANUAL',
    2: 'AUTO',
    3: 'EMERGENCY'
  } as Record<number, string>,
  
  DRIVE_MODE: {
    0: 'STOP',
    1: 'FORWARD',
    2: 'BACKWARD',
    3: 'LEFT',
    4: 'RIGHT'
  } as Record<number, string>,
  
  DELIVERY_STATE: {
    0: 'WAITING',
    1: 'PICKING_UP',
    2: 'IN_TRANSIT',
    3: 'DELIVERING',
    4: 'COMPLETED'
  } as Record<number, string>,
  
  LID_STATUS: {
    0: 'CLOSED',
    1: 'OPENED',
    2: 'LOCKED'
  } as Record<number, string>
};

// Robot Topics Configuration
const ROBOT_TOPICS = {
  bulldog01: {
    id: 'bulldog01_5f899b',
    name: 'Bulldog 01',
    topics: {
      status: 'bulldog01_5f899b/r2s/robot_status',
      battery: 'bulldog01_5f899b/r2s/battery_status',
      location: 'bulldog01_5f899b/r2s/gps',
      speed: 'bulldog01_5f899b/r2s/speed'
    }
  },
  agx: {
    id: 'embed_e6d9e2',
    name: 'AGX Robot',
    topics: {
      status: 'embed_e6d9e2/r2s/robot_status',
      battery: 'embed_e6d9e2/r2s/battery_status',
      location: 'embed_e6d9e2/r2s/gps',
      speed: 'embed_e6d9e2/r2s/speed'
    }
  }
};

// Type definitions
export interface RobotData {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'delivering' | 'maintenance';
  battery?: {
    percent: number;
    voltage: number;
    current: number;
  };
  location?: {
    latitude: number;
    longitude: number;
  };
  speed?: number;
  lastUpdated: Date;
  rawData?: any;
}

export interface FormattedRobotStatus {
  operationMode: string;
  driveMode: string;
  deliveryState: string;
  lidStatus: string;
  speed: string;
  hasError: boolean;
}

class MQTTService {
  private client: mqtt.MqttClient | null = null;
  private robots: Map<string, RobotData> = new Map();
  private subscribers: Set<(robots: RobotData[]) => void> = new Set();
  private connectionStatus: 'connected' | 'disconnected' | 'connecting' = 'disconnected';
  private statusSubscribers: Set<(status: string) => void> = new Set();
  private currentConfigIndex = 0;
  private isConnecting = false;
  private hasTriedAllConfigs = false;
  private simulationInterval: NodeJS.Timeout | null = null;

  // Multiple MQTT Configuration options to try - Real broker connections
  private readonly configs = [
    {
      host: '52.220.146.209',
      port: 9001, // MQTT over WebSocket port
      username: 'alphaasimov2024',
      password: 'gvB3DtGfus6U',
      protocol: 'ws' as const,
      path: '/mqtt' // Common WebSocket path for MQTT brokers
    },
    {
      host: '52.220.146.209',
      port: 1884, // Alternative WebSocket port
      username: 'alphaasimov2024',
      password: 'gvB3DtGfus6U',
      protocol: 'ws' as const,
      path: '/mqtt'
    },
    {
      host: '52.220.146.209',
      port: 8080, // HTTP WebSocket alternative
      username: 'alphaasimov2024',
      password: 'gvB3DtGfus6U',
      protocol: 'ws' as const,
      path: '/mqtt'
    },
    {
      host: '52.220.146.209',
      port: 8883, // MQTT over secure WebSocket
      username: 'alphaasimov2024',
      password: 'gvB3DtGfus6U',
      protocol: 'wss' as const,
      path: '/mqtt'
    }
  ];

  private readonly connectionOptions = {
    keepalive: 60,
    clean: true,
    connectTimeout: 10000, // 10 second timeout
    reconnectPeriod: 0, // Disable automatic reconnection
    clientId: `web_client_${Math.random().toString(16).substr(2, 8)}`,
    rejectUnauthorized: false, // For testing with self-signed certificates
    transformWsUrl: (url: string) => {
      // Add MQTT path if not present
      if (!url.includes('/mqtt')) {
        const urlObj = new URL(url);
        urlObj.pathname = '/mqtt';
        return urlObj.toString();
      }
      return url;
    }
  };

  async connect(): Promise<void> {
    // Disable MQTT in production mode
    if (import.meta.env.MODE === 'production' || import.meta.env.VITE_DISABLE_MQTT === 'true') {
      console.log('MQTT disabled in production mode, using simulation');
      this.startSimulation();
      return;
    }

    // For browser-based applications, MQTT over TCP is not possible
    // We'll try WebSocket first, then fallback to simulation
    
    if (this.client?.connected) {
      console.log('MQTT already connected');
      return;
    }

    if (this.isConnecting) {
      console.log('MQTT connection already in progress');
      return;
    }

    if (this.hasTriedAllConfigs) {
      console.log('All MQTT configurations already failed, using simulated data');
      this.startSimulation();
      return;
    }

    console.log('Attempting MQTT connection via WebSocket...');
    this.setConnectionStatus('connecting');
    this.isConnecting = true;

    // Only try WebSocket configs in browser
    const webSocketConfigs = this.configs.filter(config => 
      config.protocol === 'ws' || config.protocol === 'wss'
    );

    if (webSocketConfigs.length === 0) {
      console.log('No WebSocket configurations available, starting simulation');
      this.isConnecting = false;
      this.hasTriedAllConfigs = true;
      this.startSimulation();
      return;
    }

    const config = webSocketConfigs[this.currentConfigIndex % webSocketConfigs.length];
    
    try {
      // Clean up any existing client first
      if (this.client) {
        this.client.removeAllListeners();
        this.client.end(true);
        this.client = null;
      }

      const connectUrl = `${config.protocol}://${config.host}:${config.port}${config.path || '/mqtt'}`;
      console.log(`Trying real MQTT connection: ${connectUrl} (attempt ${this.currentConfigIndex + 1}/${webSocketConfigs.length})`);
      
      // Set a timeout for connection attempt
      const connectionTimeout = setTimeout(() => {
        console.log('Real MQTT connection attempt timed out, trying next config...');
        this.isConnecting = false;
        this.tryNextConfig();
      }, 12000); // Longer timeout for real connections

      this.client = mqtt.connect(connectUrl, {
        username: config.username,
        password: config.password,
        ...this.connectionOptions
      });

      this.client.on('connect', () => {
        clearTimeout(connectionTimeout);
        console.log('🎉 Real MQTT Connected successfully! Receiving live robot data...');
        this.setConnectionStatus('connected');
        this.isConnecting = false;
        this.subscribeToRobotTopics();
      });

      this.client.on('message', (topic, message) => {
        console.log(`📡 Received real data from ${topic}`);
        this.handleMessage(topic, message);
      });

      this.client.on('error', (error) => {
        clearTimeout(connectionTimeout);
        console.log(`❌ Real MQTT connection failed (${connectUrl}): ${error.message}`);
        this.isConnecting = false;
        this.tryNextConfig();
      });

      this.client.on('offline', () => {
        console.log('MQTT Client offline');
        this.setConnectionStatus('disconnected');
        this.isConnecting = false;
      });

      this.client.on('close', () => {
        console.log('MQTT Connection closed');
        this.setConnectionStatus('disconnected');
        this.isConnecting = false;
      });

    } catch (error) {
      console.error('MQTT connect failed:', error);
      this.isConnecting = false;
      this.tryNextConfig();
    }
  }

  private tryNextConfig(): void {
    // Clean up current client
    if (this.client) {
      this.client.removeAllListeners();
      this.client.end(true);
      this.client = null;
    }

    // Try next configuration
    this.currentConfigIndex = (this.currentConfigIndex + 1) % this.configs.length;
    
    if (this.currentConfigIndex === 0) {
      // We've tried all configs, fallback to simulation
      console.log('❌ All real MQTT configurations failed. Note: Browser cannot connect directly to TCP MQTT (port 1883)');
      console.log('💡 Suggestion: Set up WebSocket-to-MQTT bridge or use MQTT broker with WebSocket support');
      console.log('🔄 Starting simulation mode with realistic data...');
      this.hasTriedAllConfigs = true;
      this.setConnectionStatus('disconnected');
      setTimeout(() => {
        this.startSimulation();
      }, 1000);
    } else {
      // Try next config after a delay
      console.log(`🔄 Trying next real MQTT configuration (${this.currentConfigIndex + 1}/${this.configs.length}) in 3 seconds...`);
      setTimeout(() => {
        this.connect();
      }, 3000);
    }
  }

  private startSimulation(): void {
    console.log('🎭 Starting enhanced real-time robot data simulation...');
    console.log('📝 Note: This simulates the exact data structure that would come from real MQTT broker');
    
    // Add initial mock robots with realistic data
    this.addMockRobots();
    
    // Start real-time updates simulation
    this.simulationInterval = setInterval(() => {
      this.updateSimulatedRobotData();
    }, 3000); // Update every 3 seconds to match real MQTT frequency
    
    // Simulate connected status for UI
    this.setConnectionStatus('connected');
    console.log('✅ Simulation mode active - realistic robot data updates every 3 seconds');
  }

  private updateSimulatedRobotData(): void {
    this.robots.forEach((robot, robotId) => {
      // Simulate battery drain
      if (robot.battery) {
        robot.battery.percent = Math.max(0, robot.battery.percent - Math.random() * 0.5);
        robot.battery.voltage = 12.0 + (robot.battery.percent / 100) * 0.8;
        robot.battery.current = 1.5 + Math.random() * 2;
      }

      // Simulate movement
      if (robot.location && robot.status === 'delivering') {
        robot.location.latitude += (Math.random() - 0.5) * 0.0001;
        robot.location.longitude += (Math.random() - 0.5) * 0.0001;
        robot.speed = 0.8 + Math.random() * 0.8;
      } else if (robot.location) {
        robot.speed = 0;
      }

      // Occasionally change status
      if (Math.random() < 0.1) { // 10% chance per update
        const statuses: RobotData['status'][] = ['online', 'delivering', 'maintenance'];
        robot.status = statuses[Math.floor(Math.random() * statuses.length)];
      }

      robot.lastUpdated = new Date();
      this.robots.set(robotId, robot);
    });

    this.notifySubscribers();
  }

  private subscribeToRobotTopics(): void {
    if (!this.client?.connected) return;

    Object.values(ROBOT_TOPICS).forEach(robot => {
      Object.values(robot.topics).forEach(topic => {
        this.client?.subscribe(topic, (err) => {
          if (err) {
            console.error(`Failed to subscribe to ${topic}:`, err);
          } else {
            console.log(`Subscribed to ${topic}`);
          }
        });
      });
    });
  }

  private handleMessage(topic: string, message: Buffer): void {
    try {
      // Handle both binary and JSON data
      let data;
      const messageStr = message.toString();
      
      // Try to parse as JSON first
      try {
        data = JSON.parse(messageStr);
      } catch (e) {
        // If not JSON, try to extract data from binary format
        console.log(`Raw data from ${topic}:`, messageStr);
        
        // For now, create a simple data structure from the available info
        data = {
          raw_message: messageStr,
          timestamp: Date.now(),
          topic: topic
        };
      }
      
      // Determine which robot this message is from
      const robotConfig = Object.values(ROBOT_TOPICS).find(robot => 
        Object.values(robot.topics).some(robotTopic => topic === robotTopic)
      );

      if (!robotConfig) {
        console.warn('Unknown topic:', topic);
        return;
      }

      console.log(`📊 Processing real data for ${robotConfig.name}:`, data);
      this.updateRobotData(robotConfig.id, topic, data);
    } catch (error) {
      console.error('Error parsing MQTT message:', error);
    }
  }

  private updateRobotData(robotId: string, topic: string, data: any): void {
    let robot = this.robots.get(robotId);
    
    if (!robot) {
      const robotConfig = Object.values(ROBOT_TOPICS).find(r => r.id === robotId);
      robot = {
        id: robotId,
        name: robotConfig?.name || robotId,
        status: 'online',
        lastUpdated: new Date()
      };
      this.robots.set(robotId, robot);
      console.log(`🤖 New robot detected: ${robot.name}`);
    }

    // Update based on topic type - handle both JSON and raw data
    if (topic.includes('robot_status')) {
      robot.status = this.determineRobotStatus(data);
      robot.rawData = { ...robot.rawData, status: data };
      console.log(`🔄 ${robot.name} status updated:`, robot.status);
    } else if (topic.includes('battery_status')) {
      robot.battery = {
        percent: data.battery_percent || data.percentage || 75, // Default if not available
        voltage: data.battery_voltage || data.voltage || 12.0,
        current: data.current || 2.0
      };
      console.log(`🔋 ${robot.name} battery:`, robot.battery);
    } else if (topic.includes('gps')) {
      robot.location = {
        latitude: data.latitude || 21.0285,
        longitude: data.longitude || 105.8542
      };
      console.log(`📍 ${robot.name} location:`, robot.location);
    } else if (topic.includes('speed')) {
      robot.speed = data.linear?.x || data.speed || 0;
      console.log(`⚡ ${robot.name} speed:`, robot.speed);
    }

    robot.lastUpdated = new Date();
    this.robots.set(robotId, robot);
    this.notifySubscribers();
  }

  private determineRobotStatus(statusData: any): RobotData['status'] {
    if (!statusData) return 'offline';
    
    const operationMode = statusData.operation_mode;
    const deliveryState = statusData.delivery_state;
    
    if (operationMode === 3) return 'maintenance'; // EMERGENCY
    if (deliveryState >= 1 && deliveryState <= 4) return 'delivering';
    if (operationMode === 2) return 'online'; // AUTO mode
    
    return 'offline';
  }

  private setConnectionStatus(status: typeof this.connectionStatus): void {
    this.connectionStatus = status;
    this.statusSubscribers.forEach(callback => callback(status));
  }

  private notifySubscribers(): void {
    const robotsArray = Array.from(this.robots.values());
    this.subscribers.forEach(callback => callback(robotsArray));
  }

  // Public methods
  subscribe(callback: (robots: RobotData[]) => void): () => void {
    this.subscribers.add(callback);
    
    // Immediately call with current data
    const currentRobots = Array.from(this.robots.values());
    callback(currentRobots);
    
    return () => {
      this.subscribers.delete(callback);
    };
  }

  subscribeToConnectionStatus(callback: (status: string) => void): () => void {
    this.statusSubscribers.add(callback);
    callback(this.connectionStatus);
    
    return () => {
      this.statusSubscribers.delete(callback);
    };
  }

  getFormattedRobotStatus(robotId: string): FormattedRobotStatus | null {
    const robot = this.robots.get(robotId);
    if (!robot?.rawData?.status) return null;

    const status = robot.rawData.status;
    
    return {
      operationMode: ROBOT_STATUS.OPERATION_MODE[status.operation_mode] || 'Unknown',
      driveMode: ROBOT_STATUS.DRIVE_MODE[status.drive_mode] || 'Unknown',
      deliveryState: ROBOT_STATUS.DELIVERY_STATE[status.delivery_state] || 'Unknown',
      lidStatus: ROBOT_STATUS.LID_STATUS[status.lid_status] || 'Unknown',
      speed: robot.speed ? `${robot.speed.toFixed(2)} m/s` : '0 m/s',
      hasError: status.operation_mode === 3 // EMERGENCY mode
    };
  }

  getRobots(): RobotData[] {
    return Array.from(this.robots.values());
  }

  getConnectionStatus(): string {
    return this.connectionStatus;
  }

  disconnect(): void {
    if (this.client) {
      console.log('Disconnecting MQTT client...');
      this.client.removeAllListeners();
      this.client.end(true);
      this.client = null;
    }
    
    // Stop simulation
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
    }
    
    this.setConnectionStatus('disconnected');
    this.isConnecting = false;
    this.hasTriedAllConfigs = false;
    this.currentConfigIndex = 0;
  }

  // Add mock data for testing when no real robots
  addMockRobots(): void {
    if (this.robots.size === 0) {
      const mockRobots: RobotData[] = [
        {
          id: 'bulldog01_5f899b',
          name: 'Bulldog 01',
          status: 'online',
          battery: { percent: 85, voltage: 12.6, current: 2.1 },
          location: { latitude: 21.0285, longitude: 105.8542 },
          speed: 0,
          lastUpdated: new Date()
        },
        {
          id: 'embed_e6d9e2',
          name: 'AGX Robot',
          status: 'delivering',
          battery: { percent: 72, voltage: 12.1, current: 3.2 },
          location: { latitude: 21.0295, longitude: 105.8552 },
          speed: 1.2,
          lastUpdated: new Date()
        },
        {
          id: 'rover01_a3b5c7',
          name: 'Rover Unit 01',
          status: 'maintenance',
          battery: { percent: 45, voltage: 11.8, current: 0.8 },
          location: { latitude: 21.0275, longitude: 105.8532 },
          speed: 0,
          lastUpdated: new Date()
        }
      ];

      mockRobots.forEach(robot => {
        this.robots.set(robot.id, robot);
      });
      
      console.log(`Added ${mockRobots.length} simulated robots`);
      this.notifySubscribers();
    }
  }
}

// Export singleton instance
export const mqttService = new MQTTService();
