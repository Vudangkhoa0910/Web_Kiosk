import mqtt from 'mqtt';
import msgpack from 'msgpack-lite';

// Robot Status Enums (from Reference implementation)
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
    4: 'COMPLETED',
    5: 'CANCELLED'
  } as Record<number, string>,
  
  LID_STATUS: {
    0: 'CLOSED',
    1: 'OPENED',
    2: 'LOCKED'
  } as Record<number, string>,

  CRUISE_STATE: {
    0: 'CRUISE_RECEIVED',
    1: 'CRUISE_WAITING',
    2: 'ROUTE_AVAILABLE',
    3: 'CHECK_POINT_COMING',
    4: 'CHECK_POINT_ARRIVED',
    5: 'ROUTE_UNAVAILABLE'
  } as Record<number, string>
};

// Real Robot Configuration for Bulldog04 and Bulldog05
const ROBOT_CONFIGS = {
  bulldog04: {
    id: 'bulldog04_5f899b',
    name: 'Bulldog 04',
    code: 'BD04',
    topics: {
      status: 'bulldog04_5f899b/r2s/robot_status',
      battery: 'bulldog04_5f899b/r2s/battery_status',
      location: 'bulldog04_5f899b/r2s/gps',
      speed: 'bulldog04_5f899b/r2s/speed',
      command: 'bulldog04_5f899b/s2r/command',
      order: 'bulldog04_5f899b/s2r/order'
    },
    capabilities: {
      maxSpeed: 1.5, // m/s
      batteryCapacity: 48, // V
      payloadCapacity: 20, // kg
      operatingRadius: 5000 // meters
    }
  },
  bulldog05: {
    id: 'bulldog05_7a8b2c',
    name: 'Bulldog 05',
    code: 'BD05',
    topics: {
      status: 'bulldog05_7a8b2c/r2s/robot_status',
      battery: 'bulldog05_7a8b2c/r2s/battery_status',
      location: 'bulldog05_7a8b2c/r2s/gps',
      speed: 'bulldog05_7a8b2c/r2s/speed',
      command: 'bulldog05_7a8b2c/s2r/command',
      order: 'bulldog05_7a8b2c/s2r/order'
    },
    capabilities: {
      maxSpeed: 1.5, // m/s
      batteryCapacity: 48, // V
      payloadCapacity: 20, // kg
      operatingRadius: 5000 // meters
    }
  }
};

// Enhanced Robot Data Interface
export interface RobotData {
  id: string;
  name: string;
  code: string;
  status: 'online' | 'offline' | 'delivering' | 'maintenance' | 'charging' | 'error';
  operationState: number;
  driveState: number;
  deliveryState: number;
  cruiseState?: number;
  battery: {
    percent: number;
    voltage: number;
    current: number;
    charging: boolean;
  };
  location: {
    latitude: number;
    longitude: number;
    accuracy?: number;
  };
  speed: number;
  heading?: number;
  lidStatus: number;
  lastUpdated: Date;
  capabilities: {
    maxSpeed: number;
    batteryCapacity: number;
    payloadCapacity: number;
    operatingRadius: number;
  };
  currentOrder?: {
    orderId: string;
    status: number;
    pickupLocation?: { lat: number; lng: number };
    deliveryLocation?: { lat: number; lng: number };
  };
  rawData?: any;
}

// Command Interface for Robot Control
export interface RobotCommand {
  robotId: string;
  commandType: 'delivery' | 'navigation' | 'manual' | 'lid' | 'emergency';
  payload: any;
}

// Order Command Structure (based on Reference)
export interface OrderCommand {
  operation_mode: number;
  server_cmd_state: number;
  store_location: { x: number; y: number };
  customer_location: { x: number; y: number };
  drive_tele_mode?: number;
  tele_cmd_vel?: {
    linear: { x: number; y: number };
    angular: { x: number; y: number; z: number };
  };
  open_lid_cmd?: number;
  emb_map?: string;
}

class EnhancedMQTTService {
  private client: mqtt.MqttClient | null = null;
  private robots: Map<string, RobotData> = new Map();
  private subscribers: Set<(robots: RobotData[]) => void> = new Set();
  private connectionStatus: 'connected' | 'disconnected' | 'connecting' = 'disconnected';
  private statusSubscribers: Set<(status: string) => void> = new Set();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  // Production MQTT Configuration (Based on Reference)
  private readonly config = {
    host: '52.220.146.209',
    port: 1883, // Standard MQTT port
    username: 'alphaasimov2024',
    password: 'gvB3DtGfus6U',
    protocol: 'mqtt' as const,
    keepalive: 60,
    clean: true,
    connectTimeout: 40000,
    clientId: `web_client_${Math.random().toString(16).substr(2, 8)}`,
  };

  constructor() {
    this.initializeRobots();
  }

  private initializeRobots(): void {
    // Initialize robot data for Bulldog04 and Bulldog05
    Object.values(ROBOT_CONFIGS).forEach(config => {
      this.robots.set(config.id, {
        id: config.id,
        name: config.name,
        code: config.code,
        status: 'offline',
        operationState: 0,
        driveState: 0,
        deliveryState: 0,
        battery: {
          percent: 0,
          voltage: 0,
          current: 0,
          charging: false
        },
        location: {
          latitude: 16.047079, // Da Nang coordinates
          longitude: 108.206230,
          accuracy: 5
        },
        speed: 0,
        heading: 0,
        lidStatus: 0,
        lastUpdated: new Date(),
        capabilities: config.capabilities
      });
    });
  }

  // Connect to MQTT Broker
  async connect(): Promise<void> {
    if (this.client && this.client.connected) {
      console.log('MQTT already connected');
      return;
    }

    this.connectionStatus = 'connecting';
    this.notifyStatusSubscribers('connecting');

    try {
      console.log('🔗 Connecting to MQTT broker...');
      
      this.client = mqtt.connect(`mqtt://${this.config.host}:${this.config.port}`, this.config);

      this.client.on('connect', () => {
        console.log('✅ Connected to MQTT broker successfully!');
        this.connectionStatus = 'connected';
        this.reconnectAttempts = 0;
        this.notifyStatusSubscribers('connected');
        this.subscribeToRobotTopics();
      });

      this.client.on('error', (error) => {
        console.error('❌ MQTT connection error:', error);
        this.connectionStatus = 'disconnected';
        this.notifyStatusSubscribers('disconnected');
        this.handleReconnect();
      });

      this.client.on('close', () => {
        console.log('📤 MQTT connection closed');
        this.connectionStatus = 'disconnected';
        this.notifyStatusSubscribers('disconnected');
        this.handleReconnect();
      });

      this.client.on('message', (topic, message) => {
        this.handleMessage(topic, message);
      });

    } catch (error) {
      console.error('Failed to connect to MQTT:', error);
      this.connectionStatus = 'disconnected';
      this.notifyStatusSubscribers('disconnected');
      this.handleReconnect();
    }
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`🔄 Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${this.reconnectDelay}ms...`);
      
      setTimeout(() => {
        this.connect();
      }, this.reconnectDelay);
      
      this.reconnectDelay *= 2; // Exponential backoff
    } else {
      console.log('🚫 Max reconnection attempts reached. Falling back to simulation mode.');
      this.startSimulationMode();
    }
  }

  private subscribeToRobotTopics(): void {
    if (!this.client) return;

    // Subscribe to all robot status topics
    const topics = [
      '+/r2s/robot_status',
      '+/r2s/battery_status',
      '+/r2s/gps',
      '+/r2s/speed',
      'bulldog04_5f899b/r2s/robot_status',
      'bulldog05_7a8b2c/r2s/robot_status',
      'keepalive'
    ];

    topics.forEach(topic => {
      this.client?.subscribe(topic, { qos: 0 }, (error) => {
        if (error) {
          console.error(`Failed to subscribe to ${topic}:`, error);
        } else {
          console.log(`✅ Subscribed to topic: ${topic}`);
        }
      });
    });
  }

  private handleMessage(topic: string, message: Buffer): void {
    try {
      // Parse topic to extract robot name and message type
      const topicParts = topic.split('/');
      if (topicParts.length < 3) return;

      const robotName = topicParts[0];
      const direction = topicParts[1]; // r2s (robot to server)
      const messageType = topicParts[2];

      if (direction !== 'r2s') return;

      // Unpack MessagePack data
      let data;
      try {
        data = msgpack.decode(message);
      } catch (packError) {
        // Try parsing as JSON if MessagePack fails
        try {
          data = JSON.parse(message.toString());
        } catch (jsonError) {
          console.warn(`Failed to parse message from ${topic}:`, packError, jsonError);
          return;
        }
      }

      console.log(`📥 Received ${messageType} from ${robotName}:`, data);

      this.updateRobotData(robotName, messageType, data);

    } catch (error) {
      console.error('Error handling MQTT message:', error);
    }
  }

  private updateRobotData(robotName: string, messageType: string, data: any): void {
    // Find robot configuration
    const robotConfig = Object.values(ROBOT_CONFIGS).find(config => 
      config.id === robotName || config.name.toLowerCase().includes(robotName.toLowerCase())
    );

    if (!robotConfig) {
      console.warn(`Unknown robot: ${robotName}`);
      return;
    }

    const robot = this.robots.get(robotConfig.id);
    if (!robot) return;

    // Update robot data based on message type
    switch (messageType) {
      case 'robot_status':
        this.updateRobotStatus(robot, data);
        break;
      case 'battery_status':
        this.updateBatteryStatus(robot, data);
        break;
      case 'gps':
        this.updateLocationData(robot, data);
        break;
      case 'speed':
        this.updateSpeedData(robot, data);
        break;
    }

    robot.lastUpdated = new Date();
    robot.rawData = { ...robot.rawData, [messageType]: data };
    
    this.robots.set(robotConfig.id, robot);
    this.notifySubscribers();
  }

  private updateRobotStatus(robot: RobotData, data: any): void {
    if (data.status !== undefined) {
      robot.status = data.status === 1 ? 'online' : 'offline';
    }
    
    if (data.operation_state !== undefined) {
      robot.operationState = data.operation_state;
    }
    
    if (data.drive_state !== undefined) {
      robot.driveState = data.drive_state;
    }
    
    if (data.delivery_state !== undefined) {
      robot.deliveryState = data.delivery_state;
      
      // Update status based on delivery state
      if (robot.deliveryState > 0 && robot.deliveryState < 4) {
        robot.status = 'delivering';
      }
    }
    
    if (data.cruise_state !== undefined) {
      robot.cruiseState = data.cruise_state;
    }
    
    if (data.lid_status !== undefined) {
      robot.lidStatus = data.lid_status;
    }
  }

  private updateBatteryStatus(robot: RobotData, data: any): void {
    if (data.battery_percent !== undefined) {
      robot.battery.percent = data.battery_percent;
    }
    
    if (data.voltage !== undefined) {
      robot.battery.voltage = data.voltage;
    }
    
    if (data.current !== undefined) {
      robot.battery.current = data.current;
    }
    
    if (data.charging !== undefined) {
      robot.battery.charging = data.charging;
      
      if (data.charging) {
        robot.status = 'charging';
      }
    }
  }

  private updateLocationData(robot: RobotData, data: any): void {
    if (data.latitude && data.longitude) {
      robot.location.latitude = data.latitude;
      robot.location.longitude = data.longitude;
    }
    
    if (data.accuracy !== undefined) {
      robot.location.accuracy = data.accuracy;
    }
  }

  private updateSpeedData(robot: RobotData, data: any): void {
    if (data.speed !== undefined) {
      robot.speed = data.speed;
    }
    
    if (data.heading !== undefined) {
      robot.heading = data.heading;
    }
  }

  // Send command to robot
  async sendCommand(command: RobotCommand): Promise<boolean> {
    if (!this.client || !this.client.connected) {
      console.error('MQTT not connected');
      return false;
    }

    const robotConfig = Object.values(ROBOT_CONFIGS).find(config => 
      config.id === command.robotId
    );

    if (!robotConfig) {
      console.error(`Robot not found: ${command.robotId}`);
      return false;
    }

    let topic: string;
    let payload: Buffer;

    try {
      switch (command.commandType) {
        case 'delivery':
          topic = robotConfig.topics.order;
          payload = msgpack.encode(command.payload as OrderCommand);
          break;
        
        case 'lid':
          topic = robotConfig.topics.command;
          payload = msgpack.encode({
            open_lid_cmd: command.payload.open ? 1 : 0
          });
          break;
        
        case 'emergency':
          topic = robotConfig.topics.command;
          payload = msgpack.encode({
            operation_mode: 3, // Emergency mode
            server_cmd_state: 0
          });
          break;
        
        default:
          topic = robotConfig.topics.command;
          payload = msgpack.encode(command.payload);
      }

      this.client.publish(topic, payload, { qos: 1 }, (error) => {
        if (error) {
          console.error(`Failed to send command to ${command.robotId}:`, error);
        } else {
          console.log(`✅ Command sent to ${command.robotId}:`, command);
        }
      });

      return true;
    } catch (error) {
      console.error('Error sending command:', error);
      return false;
    }
  }

  // Start order delivery
  async startDelivery(robotId: string, pickupLocation: { lat: number; lng: number }, deliveryLocation: { lat: number; lng: number }): Promise<boolean> {
    const orderCommand: OrderCommand = {
      operation_mode: 1,
      server_cmd_state: 2,
      store_location: { x: pickupLocation.lat, y: pickupLocation.lng },
      customer_location: { x: deliveryLocation.lat, y: deliveryLocation.lng },
      drive_tele_mode: 0,
      open_lid_cmd: 0
    };

    return this.sendCommand({
      robotId,
      commandType: 'delivery',
      payload: orderCommand
    });
  }

  // Emergency stop
  async emergencyStop(robotId: string): Promise<boolean> {
    return this.sendCommand({
      robotId,
      commandType: 'emergency',
      payload: {}
    });
  }

  // Control robot lid
  async controlLid(robotId: string, open: boolean): Promise<boolean> {
    return this.sendCommand({
      robotId,
      commandType: 'lid',
      payload: { open }
    });
  }

  // Simulation mode fallback
  private startSimulationMode(): void {
    console.log('🔧 Starting simulation mode for robot data...');
    
    // Initialize with realistic data for Bulldog04 and Bulldog05
    const bulldog04 = this.robots.get('bulldog04_5f899b');
    const bulldog05 = this.robots.get('bulldog05_7a8b2c');

    if (bulldog04) {
      bulldog04.status = 'online';
      bulldog04.battery.percent = 85;
      bulldog04.battery.voltage = 47.2;
      bulldog04.location = { latitude: 16.047079, longitude: 108.206230, accuracy: 3 };
    }

    if (bulldog05) {
      bulldog05.status = 'charging';
      bulldog05.battery.percent = 45;
      bulldog05.battery.voltage = 46.8;
      bulldog05.battery.charging = true;
      bulldog05.location = { latitude: 16.068079, longitude: 108.226230, accuracy: 2 };
    }

    // Update simulation data every 5 seconds
    setInterval(() => {
      this.updateSimulationData();
    }, 5000);

    this.notifySubscribers();
  }

  private updateSimulationData(): void {
    this.robots.forEach((robot) => {
      // Update battery
      if (robot.battery.charging) {
        robot.battery.percent = Math.min(100, robot.battery.percent + 1);
        if (robot.battery.percent >= 100) {
          robot.battery.charging = false;
          robot.status = 'online';
        }
      } else if (robot.status === 'delivering') {
        robot.battery.percent = Math.max(10, robot.battery.percent - 0.2);
      }

      // Simulate movement for delivering robots
      if (robot.status === 'delivering') {
        robot.location.latitude += (Math.random() - 0.5) * 0.0001;
        robot.location.longitude += (Math.random() - 0.5) * 0.0001;
        robot.speed = 0.8 + Math.random() * 0.7; // 0.8-1.5 m/s
      } else {
        robot.speed = 0;
      }

      robot.lastUpdated = new Date();
    });

    this.notifySubscribers();
  }

  // Subscription management
  subscribe(callback: (robots: RobotData[]) => void): () => void {
    this.subscribers.add(callback);
    callback(Array.from(this.robots.values()));
    
    return () => {
      this.subscribers.delete(callback);
    };
  }

  subscribeToStatus(callback: (status: string) => void): () => void {
    this.statusSubscribers.add(callback);
    callback(this.connectionStatus);
    
    return () => {
      this.statusSubscribers.delete(callback);
    };
  }

  private notifySubscribers(): void {
    const robotsArray = Array.from(this.robots.values());
    this.subscribers.forEach(callback => callback(robotsArray));
  }

  private notifyStatusSubscribers(status: string): void {
    this.statusSubscribers.forEach(callback => callback(status));
  }

  // Get specific robot data
  getRobotById(robotId: string): RobotData | undefined {
    return this.robots.get(robotId);
  }

  // Get all robots
  getAllRobots(): RobotData[] {
    return Array.from(this.robots.values());
  }

  // Connection status
  getConnectionStatus(): string {
    return this.connectionStatus;
  }

  // Disconnect
  disconnect(): void {
    if (this.client) {
      this.client.end();
      this.client = null;
    }
    this.connectionStatus = 'disconnected';
    this.notifyStatusSubscribers('disconnected');
  }
}

// Export singleton instance
export const enhancedMQTTService = new EnhancedMQTTService();
export default enhancedMQTTService;