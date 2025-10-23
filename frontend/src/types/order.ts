/**
 * Order Types
 * Types cho việc tạo đơn hàng với Alpha Asimov Backend API
 */

// ============================================
// Backend API Types (từ Alpha Asimov)
// ============================================

export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface OrderContactInfo {
  name: string;
  phone: string;
  address: string;
  coordinates: Coordinate;
  note?: string;
}

export interface OrderItem {
  description: string;
}

export interface CreateOrderInput {
  note?: string;
  externalId?: string;
  sender: OrderContactInfo;
  recipients: Array<{
    name: string;
    phone: string;
    address: string;
    coordinates: Coordinate;
    note?: string;
    items: OrderItem[];
  }>;
  clientId?: string;
  availableRobots?: string[];
}

export interface DeliveryDto {
  id: string;
  orderId: string;
  robotId: string;
  status: number;
  mapId: string;
  startTime: string;
  endTime?: string;
}

export interface CreateOrderResult {
  deliveryDtos: DeliveryDto[];
}

export interface OrderDto {
  id: string;
  code: string;
  status: OrderStatus;
  note?: string;
  sender: OrderContactInfo;
  recipient: OrderContactInfo;
  type: OrderType;
  externalId?: string;
  clientId?: string;
  items: OrderItem[];
  creationTime: string;
  cancelCode?: string;
  cancelNote?: string;
  failCode?: string;
  failNote?: string;
  // Real-time tracking
  robotPosition?: {
    lat: number;
    lng: number;
    timestamp?: string;
  };
  robotId?: string;
}

export const OrderStatus = {
  Pending: 10,
  Assigning: 20,
  Cancelled: 30,
  Unconfirmed: 80,
  Accepted: 90,
  InProgress: 100,
  Completed: 110,
  Failed: 120
} as const;

export type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus];

export const OrderType = {
  System: 30,
  Legacy: 60,
  Partner: 70
} as const;

export type OrderType = typeof OrderType[keyof typeof OrderType];

// ============================================
// Kiosk-specific Types
// ============================================

export interface KioskLocation {
  id: string;
  name: string;
  address: string;
  coordinates: Coordinate;
  mapId?: string; // ID của map trong hệ thống backend
}

export interface StoreLocation {
  id: string;
  name: string;
  address: string;
  coordinates: Coordinate;
  phone: string;
  isOpen: boolean;
}

export interface KioskOrderRequest {
  // Thông tin cửa hàng (sender)
  store: StoreLocation;
  
  // Thông tin kiosk (recipient)
  kiosk: KioskLocation;
  
  // Thông tin khách hàng
  customerPhone: string;
  customerName?: string;
  
  // Thông tin đơn hàng
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  
  // Ghi chú
  note?: string;
  
  // Tổng tiền
  totalAmount: number;
  
  // External ID để đồng bộ với MoMo
  externalId?: string;
}

export interface KioskOrderResponse {
  success: boolean;
  orderId?: string;
  orderCode?: string;
  deliveryId?: string;
  estimatedTime?: number; // phút
  robotId?: string;
  error?: string;
  errorType?: 'NO_ROBOT' | 'UNAUTHORIZED' | 'FORBIDDEN' | 'INVALID_LOCATION' | 'UNKNOWN';
  errorCode?: string;
  rawError?: string;
}

// ============================================
// Order Tracking Types
// ============================================

export interface OrderTracking {
  orderId: string;
  orderCode: string;
  status: OrderStatus;
  currentLocation?: Coordinate;
  estimatedArrival?: string;
  robotId?: string;
  deliveryProgress?: number; // 0-100%
}
