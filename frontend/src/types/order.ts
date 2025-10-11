import type { ID, Timestamp } from './common'

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivering' | 'delivered' | 'cancelled'
export type PaymentMethod = 'qr' | 'momo' | 'card'

export interface OrderItem {
  id: ID
  name: string
  price: number
  quantity: number
  image: string
  category: string
}

export interface CustomerInfo {
  phone: string
  location: string
  notes: string
}

export interface OrderTimestamps {
  created: Timestamp
  confirmed: Timestamp | null
  preparing: Timestamp | null
  ready: Timestamp | null
  delivering: Timestamp | null
  delivered: Timestamp | null
}

export interface Order {
  id: ID
  status: OrderStatus
  items: OrderItem[]
  total: number
  subtotal: number
  deliveryFee: number
  paymentMethod: PaymentMethod
  customerInfo: CustomerInfo
  timestamps: OrderTimestamps
  estimatedDeliveryTime: number // minutes
  robotId?: ID
}

export interface PaymentSession {
  orderId: ID
  method: PaymentMethod
  amount: number
  status: 'pending' | 'processing' | 'completed' | 'failed'
  qrCode?: string
  redirectUrl?: string
  sessionId: ID
}