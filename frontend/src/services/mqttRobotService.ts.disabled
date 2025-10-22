import mqtt, { MqttClient } from 'mqtt';
import msgpack from 'msgpack-lite';
import { EventEmitter } from 'events';

// Robot command types based on Reference implementation
export interface RobotCommand {
  id: string;
  type: 'move' | 'stop' | 'return_home' | 'pickup' | 'deliver' | 'emergency_stop';
  payload: {
    target_position?: { lat: number; lng: number };
    speed?: number;
    order_id?: string;
    delivery_location?: { lat: number; lng: number };
    pickup_location?: { lat: number; lng: number };
  };
  timestamp: number;
  priority: 'low' | 'medium' | 'high' | 'emergency';
}

export interface RobotTelemetry {
  robot_id: string;
  timestamp: number;
  position: {
    lat: number;
    lng: number;
    altitude: number;
    heading: number;
  };
  status: {
    state: 'idle' | 'moving' | 'delivering' | 'charging' | 'maintenance' | 'error';
    battery_level: number;
    speed: number;
    load_weight: number;
    temperature: number;
  };
  mission?: {
    id: string;
    status: 'pending' | 'active' | 'completed' | 'failed';
    progress: number;
    estimated_completion: number;
  };
  sensors: {
    lidar_status: boolean;
    camera_status: boolean;
    gps_accuracy: number;
    obstacles_detected: boolean;
  };
}

export interface RobotStatus {
  robot_id: string;
  online: boolean;
  last_seen: number;
  operational_status: 'available' | 'busy' | 'maintenance' | 'error';
  capabilities: string[];
  firmware_version: string;
}

// MQTT Configuration for production Bulldog robots
const MQTT_CONFIG = {
  broker: {
    host: import.meta.env.VITE_MQTT_HOST || 'mqtt.alphaasimov.com',
    port: parseInt(import.meta.env.VITE_MQTT_PORT || '8883'),
    protocol: 'wss',
    username: import.meta.env.VITE_MQTT_USERNAME || 'aa_frontend_client',
    password: import.meta.env.VITE_MQTT_PASSWORD || 'secure_password_2024',
    clientId: `aa_web_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    keepalive: 60,
    clean: true,
    reconnectPeriod: 5000,
    connectTimeout: 30000,
  },
  topics: {
    // Command topics (publish)
    robot_commands: 'aa/robots/{robot_id}/commands',
    fleet_commands: 'aa/fleet/commands',
    
    // Telemetry topics (subscribe)
    robot_telemetry: 'aa/robots/{robot_id}/telemetry',
    robot_status: 'aa/robots/{robot_id}/status',
    fleet_status: 'aa/fleet/status',
    
    // Mission topics
    mission_updates: 'aa/missions/{mission_id}/updates',
    delivery_status: 'aa/deliveries/{order_id}/status',
    
    // System topics
    system_alerts: 'aa/system/alerts',
    diagnostics: 'aa/system/diagnostics'
  },
  robots: {
    bulldog04: 'BULLDOG04',
    bulldog05: 'BULLDOG05'
  }
};

class MQTTRobotService extends EventEmitter {
  private client: MqttClient | null = null;
  private connected: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private telemetryCache: Map<string, RobotTelemetry> = new Map();
  private statusCache: Map<string, RobotStatus> = new Map();

  constructor() {
    super();
    this.setMaxListeners(50); // Allow many components to listen
  }

  /**
   * Initialize MQTT connection and subscribe to robot topics
   */
  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        console.log('🔗 Connecting to MQTT broker...', {
          host: MQTT_CONFIG.broker.host,
          port: MQTT_CONFIG.broker.port,
          clientId: MQTT_CONFIG.broker.clientId
        });

        const brokerUrl = `${MQTT_CONFIG.broker.protocol}://${MQTT_CONFIG.broker.host}:${MQTT_CONFIG.broker.port}`;
        this.client = mqtt.connect(brokerUrl, {
          username: MQTT_CONFIG.broker.username,
          password: MQTT_CONFIG.broker.password,
          clientId: MQTT_CONFIG.broker.clientId,
          keepalive: MQTT_CONFIG.broker.keepalive,
          clean: MQTT_CONFIG.broker.clean,
          reconnectPeriod: MQTT_CONFIG.broker.reconnectPeriod,
          connectTimeout: MQTT_CONFIG.broker.connectTimeout
        });

        this.client.on('connect', () => {
          console.log('✅ MQTT connected successfully');
          this.connected = true;
          this.reconnectAttempts = 0;
          this.subscribeToRobotTopics();
          this.emit('connected');
          resolve();
        });

        this.client.on('message', this.handleMessage.bind(this));
        this.client.on('error', this.handleError.bind(this));
        this.client.on('close', this.handleDisconnect.bind(this));
        this.client.on('reconnect', this.handleReconnect.bind(this));

        // Connection timeout
        setTimeout(() => {
          if (!this.connected) {
            reject(new Error('MQTT connection timeout'));
          }
        }, MQTT_CONFIG.broker.connectTimeout);

      } catch (error) {
        console.error('❌ MQTT connection failed:', error);
        reject(error);
      }
    });
  }

  /**
   * Subscribe to all robot-related topics
   */
  private subscribeToRobotTopics(): void {
    if (!this.client) return;

    const subscriptions = [
      // Subscribe to both Bulldog robots
      MQTT_CONFIG.topics.robot_telemetry.replace('{robot_id}', MQTT_CONFIG.robots.bulldog04),
      MQTT_CONFIG.topics.robot_telemetry.replace('{robot_id}', MQTT_CONFIG.robots.bulldog05),
      MQTT_CONFIG.topics.robot_status.replace('{robot_id}', MQTT_CONFIG.robots.bulldog04),
      MQTT_CONFIG.topics.robot_status.replace('{robot_id}', MQTT_CONFIG.robots.bulldog05),
      
      // Fleet-wide topics
      MQTT_CONFIG.topics.fleet_status,
      MQTT_CONFIG.topics.system_alerts,
      
      // Mission and delivery topics (wildcard)
      'aa/missions/+/updates',
      'aa/deliveries/+/status'
    ];

    subscriptions.forEach(topic => {
      this.client!.subscribe(topic, { qos: 1 }, (err) => {
        if (err) {
          console.error(`❌ Failed to subscribe to ${topic}:`, err);
        } else {
          console.log(`📡 Subscribed to ${topic}`);
        }
      });
    });
  }

  /**
   * Handle incoming MQTT messages
   */
  private handleMessage(topic: string, message: Buffer): void {
    try {
      // Try to decode as MessagePack first, fallback to JSON
      let data: any;
      try {
        data = msgpack.decode(message);
      } catch {
        data = JSON.parse(message.toString());
      }

      console.log(`📨 MQTT message received:`, { topic, data });

      // Route message based on topic pattern
      if (topic.includes('/telemetry')) {
        this.handleTelemetryUpdate(data as RobotTelemetry);
      } else if (topic.includes('/status')) {
        this.handleStatusUpdate(data as RobotStatus);
      } else if (topic.includes('/missions/')) {
        this.handleMissionUpdate(topic, data);
      } else if (topic.includes('/deliveries/')) {
        this.handleDeliveryUpdate(topic, data);
      } else if (topic.includes('/alerts')) {
        this.handleSystemAlert(data);
      }

    } catch (error) {
      console.error('❌ Failed to parse MQTT message:', error, {
        topic,
        message: message.toString()
      });
    }
  }

  /**
   * Handle robot telemetry updates
   */
  private handleTelemetryUpdate(telemetry: RobotTelemetry): void {
    this.telemetryCache.set(telemetry.robot_id, telemetry);
    this.emit('telemetry_update', telemetry);
    this.emit(`telemetry_${telemetry.robot_id}`, telemetry);
  }

  /**
   * Handle robot status updates
   */
  private handleStatusUpdate(status: RobotStatus): void {
    this.statusCache.set(status.robot_id, status);
    this.emit('status_update', status);
    this.emit(`status_${status.robot_id}`, status);
  }

  /**
   * Handle mission updates
   */
  private handleMissionUpdate(topic: string, data: any): void {
    const missionId = topic.split('/')[2];
    this.emit('mission_update', { missionId, ...data });
  }

  /**
   * Handle delivery updates
   */
  private handleDeliveryUpdate(topic: string, data: any): void {
    const orderId = topic.split('/')[2];
    this.emit('delivery_update', { orderId, ...data });
  }

  /**
   * Handle system alerts
   */
  private handleSystemAlert(alert: any): void {
    console.warn('🚨 System Alert:', alert);
    this.emit('system_alert', alert);
  }

  /**
   * Send command to specific robot
   */
  async sendRobotCommand(robotId: string, command: RobotCommand): Promise<void> {
    if (!this.client || !this.connected) {
      throw new Error('MQTT not connected');
    }

    const topic = MQTT_CONFIG.topics.robot_commands.replace('{robot_id}', robotId);
    const message = msgpack.encode(command);

    return new Promise((resolve, reject) => {
      this.client!.publish(topic, message, { qos: 1 }, (err) => {
        if (err) {
          console.error(`❌ Failed to send command to ${robotId}:`, err);
          reject(err);
        } else {
          console.log(`📤 Command sent to ${robotId}:`, command);
          resolve();
        }
      });
    });
  }

  /**
   * Send command to Bulldog04
   */
  async sendBulldog04Command(command: Omit<RobotCommand, 'id' | 'timestamp'>): Promise<void> {
    const fullCommand: RobotCommand = {
      id: `cmd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      ...command
    };
    return this.sendRobotCommand(MQTT_CONFIG.robots.bulldog04, fullCommand);
  }

  /**
   * Send command to Bulldog05
   */
  async sendBulldog05Command(command: Omit<RobotCommand, 'id' | 'timestamp'>): Promise<void> {
    const fullCommand: RobotCommand = {
      id: `cmd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      ...command
    };
    return this.sendRobotCommand(MQTT_CONFIG.robots.bulldog05, fullCommand);
  }

  /**
   * Emergency stop all robots
   */
  async emergencyStopAll(): Promise<void> {
    const emergencyCommand = {
      type: 'emergency_stop' as const,
      payload: {},
      priority: 'emergency' as const
    };

    await Promise.all([
      this.sendBulldog04Command(emergencyCommand),
      this.sendBulldog05Command(emergencyCommand)
    ]);
  }

  /**
   * Get latest telemetry for a robot
   */
  getRobotTelemetry(robotId: string): RobotTelemetry | null {
    return this.telemetryCache.get(robotId) || null;
  }

  /**
   * Get latest status for a robot
   */
  getRobotStatus(robotId: string): RobotStatus | null {
    return this.statusCache.get(robotId) || null;
  }

  /**
   * Get all available robots
   */
  getAllRobots(): { telemetry: RobotTelemetry[]; status: RobotStatus[] } {
    return {
      telemetry: Array.from(this.telemetryCache.values()),
      status: Array.from(this.statusCache.values())
    };
  }

  /**
   * Handle connection errors
   */
  private handleError(error: Error): void {
    console.error('❌ MQTT error:', error);
    this.emit('error', error);
  }

  /**
   * Handle disconnection
   */
  private handleDisconnect(): void {
    console.warn('⚠️ MQTT disconnected');
    this.connected = false;
    this.emit('disconnected');
  }

  /**
   * Handle reconnection attempts
   */
  private handleReconnect(): void {
    this.reconnectAttempts++;
    console.log(`🔄 MQTT reconnecting... (attempt ${this.reconnectAttempts})`);
    
    if (this.reconnectAttempts > this.maxReconnectAttempts) {
      console.error('❌ Max reconnection attempts reached');
      this.disconnect();
    }
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.connected && this.client?.connected === true;
  }

  /**
   * Disconnect from MQTT broker
   */
  disconnect(): void {
    if (this.client) {
      this.client.end(true);
      this.client = null;
    }
    this.connected = false;
    this.telemetryCache.clear();
    this.statusCache.clear();
    console.log('🔌 MQTT disconnected');
  }
}

// Export singleton instance
export const mqttRobotService = new MQTTRobotService();
export default mqttRobotService;