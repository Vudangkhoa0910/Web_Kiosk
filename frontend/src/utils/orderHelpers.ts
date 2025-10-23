import { tokenManager } from '../services/tokenManager'
import { decodeBase64UTF8 } from './formatters'
import type { CartItem } from '../types/orderFlow'

export interface CreateOrderParams {
  items: CartItem[]
  customer: { name: string; phone: string; note: string }
  createOrderFn: (customerInfo: any, paymentMethod: string) => Promise<string>
}

export interface OrderResult {
  orderId: string
  error?: string
}

/**
 * Create order with token retry logic
 */
export async function createOrderWithRetry(params: CreateOrderParams): Promise<OrderResult> {
  const { customer, createOrderFn } = params

  try {
    const newOrderId = await createOrderFn(
      {
        name: customer.name,
        phone: customer.phone,
        email: '',
        location: 'Kiosk Alpha Asimov',
        notes: customer.note
      },
      'momo'
    )
    return { orderId: newOrderId }
  } catch (err: any) {
    // Retry with token refresh if 401
    if (err.message?.includes('401') || err.message?.includes('Token')) {
      console.log('Token expired, refreshing...')
      await tokenManager.refreshAccessToken()
      console.log('Token refreshed, retrying...')

      const newOrderId = await createOrderFn(
        {
          name: customer.name,
          phone: customer.phone,
          email: '',
          location: 'Kiosk Alpha Asimov',
          notes: customer.note
        },
        'momo'
      )
      return { orderId: newOrderId }
    }
    throw err
  }
}

/**
 * Decode MoMo extraData
 */
export function decodeMomoExtraData(extraData: string): any {
  try {
    const decoded = decodeBase64UTF8(extraData)
    console.log('Decoded extraData:', decoded)
    const parsed = JSON.parse(decoded)
    
    if (parsed.userInfo) {
      console.log('Restored customer info:', parsed.userInfo)
      return parsed.userInfo
    }
  } catch (e) {
    console.warn('Could not decode extraData:', e)
  }
  return null
}

/**
 * Generate order navigation info
 */
export function generateOrderInfo(orderId: string, items: CartItem[], customer: any, restaurant: any) {
  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  
  return {
    orderId,
    items: items.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
      category: item.category
    })),
    totalAmount,
    customer: {
      name: customer.name,
      phone: customer.phone,
      note: customer.note
    },
    restaurant: {
      name: restaurant.name,
      location: restaurant.location
    },
    timestamp: new Date().toISOString(),
    paymentMethod: 'momo'
  }
}
