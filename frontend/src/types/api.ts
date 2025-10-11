/**
 * API Types - Định nghĩa interfaces cho tất cả API calls
 */

// ============================================
// AUTH & USER TYPES
// ============================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

export interface AuthResponse {
  status: string;
  data: {
    user: User;
    token: string;
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'admin' | 'user' | 'guest';
  createdAt: string;
  updatedAt: string;
}

// ============================================
// PRODUCT/MENU TYPES
// ============================================

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'drinks' | 'food' | 'snacks' | 'desserts';
  available: boolean;
  popular?: boolean;
  rating?: number;
  preparationTime?: number; // minutes
  calories?: number;
  ingredients?: string[];
  allergens?: string[];
}

export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  itemCount: number;
}

export interface GetMenuItemsRequest {
  category?: string;
  available?: boolean;
  popular?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface GetMenuItemsResponse {
  status: string;
  data: {
    items: MenuItem[];
    total: number;
    categories: MenuCategory[];
  };
}

// ============================================
// ORDER TYPES
// ============================================

export interface OrderItem {
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
  notes?: string;
}

export interface CustomerInfo {
  name?: string;
  phone: string;
  email?: string;
  deliveryLocation: string;
  notes?: string;
}

export interface CreateOrderRequest {
  items: OrderItem[];
  customerInfo: CustomerInfo;
  paymentMethod: 'qr' | 'momo' | 'card' | 'cash';
  deliveryLocation: {
    lat: number;
    lng: number;
    address: string;
    building?: string;
    floor?: string;
    room?: string;
  };
  deliveryTime?: string; // ISO timestamp for scheduled delivery
  specialInstructions?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  customerInfo: CustomerInfo;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivering' | 'delivered' | 'cancelled';
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  subtotal: number;
  deliveryFee: number;
  total: number;
  deliveryLocation: {
    lat: number;
    lng: number;
    address: string;
    building?: string;
    floor?: string;
    room?: string;
  };
  assignedRobotId?: string;
  estimatedDeliveryTime?: string;
  actualDeliveryTime?: string;
  timestamps: {
    created: string;
    confirmed?: string;
    preparing?: string;
    ready?: string;
    delivering?: string;
    delivered?: string;
    cancelled?: string;
  };
  rating?: number;
  feedback?: string;
  cancelReason?: string;
}

export interface CreateOrderResponse {
  status: string;
  data: {
    order: Order;
  };
}

export interface GetOrdersRequest {
  status?: Order['status'][];
  customerId?: string;
  robotId?: string;
  fromDate?: string;
  toDate?: string;
  limit?: number;
  offset?: number;
}

export interface GetOrdersResponse {
  status: string;
  data: {
    orders: Order[];
    total: number;
  };
}

export interface UpdateOrderStatusRequest {
  status: Order['status'];
  notes?: string;
}

export interface CancelOrderRequest {
  reason: string;
}

// ============================================
// ROBOT TYPES
// ============================================

export interface RobotLocation {
  latitude: number;
  longitude: number;
  altitude?: number;
  heading?: number; // 0-360 degrees
  accuracy?: number; // meters
}

export interface Robot {
  id: string;
  name: string;
  model: string;
  status: 'online' | 'offline' | 'working' | 'charging' | 'maintenance' | 'error';
  location: RobotLocation;
  battery: number; // 0-100
  speed: number; // m/s
  temperature?: number;
  operational: 'available' | 'busy' | 'maintenance' | 'error';
  capabilities: string[];
  currentOrderId?: string;
  currentTask?: {
    type: 'idle' | 'pickup' | 'delivery' | 'charging' | 'returning';
    orderId?: string;
    startTime: string;
    estimatedCompletion?: string;
  };
  lastSeen: string;
  firmwareVersion?: string;
  totalDeliveries?: number;
  totalDistance?: number; // meters
}

export interface GetRobotsResponse {
  status: string;
  data: {
    robots: Robot[];
    stats: {
      total: number;
      online: number;
      working: number;
      available: number;
    };
  };
  timestamp: string;
}

export interface RobotCommand {
  robotId: string;
  command: 'start' | 'stop' | 'pause' | 'resume' | 'return' | 'charge' | 'emergency_stop';
  params?: Record<string, any>;
}

export interface SendRobotCommandRequest {
  command: RobotCommand['command'];
  params?: Record<string, any>;
}

export interface SendRobotCommandResponse {
  status: string;
  message: string;
  command: string;
  timestamp: string;
}

// ============================================
// TRACKING TYPES
// ============================================

export interface DeliveryTracking {
  orderId: string;
  robotId: string;
  robotName: string;
  robotLocation: RobotLocation;
  destination: {
    lat: number;
    lng: number;
    address: string;
  };
  status: Order['status'];
  route?: Array<{
    lat: number;
    lng: number;
    timestamp?: string;
  }>;
  distance: {
    total: number; // meters
    remaining: number; // meters
    traveled: number; // meters
  };
  estimatedTimeArrival: number; // minutes
  progress: number; // 0-100
  events: Array<{
    type: 'order_created' | 'robot_assigned' | 'pickup_complete' | 'in_transit' | 'arrived' | 'delivered';
    timestamp: string;
    location?: RobotLocation;
    notes?: string;
  }>;
}

export interface GetTrackingResponse {
  status: string;
  data: {
    tracking: DeliveryTracking;
  };
}

// ============================================
// PAYMENT TYPES
// ============================================

export interface PaymentSession {
  id: string;
  orderId: string;
  method: 'qr' | 'momo' | 'card' | 'cash';
  amount: number;
  currency: 'VND';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  qrCode?: string; // Base64 or URL
  momoDeepLink?: string;
  paymentUrl?: string;
  expiresAt: string;
  createdAt: string;
}

export interface CreatePaymentRequest {
  orderId: string;
  method: PaymentSession['method'];
  amount: number;
  returnUrl?: string;
}

export interface CreatePaymentResponse {
  status: string;
  data: {
    payment: PaymentSession;
  };
}

// ============================================
// STATS & ANALYTICS TYPES
// ============================================

export interface DashboardStats {
  orders: {
    today: number;
    thisWeek: number;
    thisMonth: number;
    active: number;
  };
  revenue: {
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
  robots: {
    total: number;
    online: number;
    delivering: number;
    available: number;
  };
  customers: {
    total: number;
    active: number;
    new: number;
  };
}

export interface GetStatsResponse {
  status: string;
  data: DashboardStats;
}

// ============================================
// NOTIFICATION TYPES
// ============================================

export interface Notification {
  id: string;
  type: 'order' | 'robot' | 'system' | 'payment';
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'error' | 'success';
  read: boolean;
  createdAt: string;
  data?: Record<string, any>;
}

export interface GetNotificationsResponse {
  status: string;
  data: {
    notifications: Notification[];
    unreadCount: number;
  };
}

// ============================================
// WEBSOCKET EVENT TYPES
// ============================================

export interface SocketEvent<T = any> {
  type: string;
  data: T;
  timestamp: string;
}

export interface RobotUpdateEvent {
  robotId: string;
  location?: RobotLocation;
  battery?: number;
  status?: Robot['status'];
  speed?: number;
}

export interface OrderUpdateEvent {
  orderId: string;
  status: Order['status'];
  robotId?: string;
  location?: RobotLocation;
  estimatedTime?: number;
}

// ============================================
// ERROR TYPES
// ============================================

export interface APIError {
  status: 'error';
  message: string;
  code?: string;
  details?: any;
  timestamp: string;
}

// ============================================
// GENERIC RESPONSE TYPE
// ============================================

export interface APIResponse<T = any> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
  error?: string;
  timestamp?: string;
}

// ============================================
// REQUEST CONFIG
// ============================================

export interface RequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, any>;
  timeout?: number;
  signal?: AbortSignal;
}
