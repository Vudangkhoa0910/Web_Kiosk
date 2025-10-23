/**
 * Order Flow Types
 * Types cho UI order flow trong kiosk
 */

export type FlowStep = 'restaurant' | 'menu' | 'details' | 'payment' | 'success'

export interface ProductItem {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  available: boolean
  restaurantId: string
}

export interface Restaurant {
  id: string
  name: string
  description: string
  image: string
  location: string
  category: string
}

export interface CartItem extends ProductItem {
  quantity: number
}

export interface CustomerInfo {
  name: string
  phone: string
  note: string
}

export interface OrderFlowState {
  step: FlowStep
  selectedRestaurant: Restaurant | null
  selectedItems: CartItem[]
  customer: CustomerInfo
  orderId: string | null
  isProcessing: boolean
  error: string | null
  momoPaymentUrl: string | null
}
