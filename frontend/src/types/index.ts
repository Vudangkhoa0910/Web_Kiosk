export interface Robot {
  id: string
  name: string
  status: 'available' | 'delivering' | 'charging' | 'maintenance'
  currentOrder?: string
  location: {
    lat: number
    lng: number
  }
  batteryLevel: number
  lastUpdated: Date
  destination?: string
  eta?: string
  speed: number
}

export interface Store {
  id: string
  name: string
  category: string
  image: string
  rating: number
  distance: string
  isOpen: boolean
  estimatedDelivery: string
  tags: string[]
}

export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  available: boolean
}

export interface Order {
  id: string
  status: 'pending' | 'in_progress' | 'delivered' | 'cancelled'
  store: Store
  customerName: string
  customerPhone: string
  deliveryAddress: string
  items: OrderItem[]
  totalAmount: number
  createdAt: Date
  estimatedDelivery: Date
  deliveredAt?: Date
  robotId?: string
  trackingSteps: TrackingStep[]
}

export interface OrderItem {
  name: string
  quantity: number
  price: number
}

export interface TrackingStep {
  status: string
  time: Date | null
  completed: boolean
}

export interface DeliveryZone {
  id: string
  name: string
  position: {
    lat: number
    lng: number
  }
  description?: string
}

export interface RobotStatus {
  robotId: string
  status: string
  position: {
    latitude: number
    longitude: number
    altitude?: number
  }
  battery: number
  task?: string
  confirmation?: number
}

export interface MQTTMessage {
  robot_id: string
  sub_topic: string
  data: {
    payload: any
    timestamp: number
  }
}

export type NavigationSection = 'home' | 'order' | 'tracking' | 'history'
