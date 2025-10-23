import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { kioskOrderService } from '../services/kioskOrderService'

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  category: string
}

export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  available: boolean
  popular?: boolean
  ingredients?: string[]
  allergens?: string[]
}

export interface Order {
  id: string
  externalId?: string // MoMo/External order ID for display
  status: 'preparing' | 'ready' | 'delivering' | 'delivered' | 'cancelled'
  items: CartItem[]
  total: number
  subtotal: number
  deliveryFee: number
  paymentMethod: 'qr' | 'momo' | 'card'
  customerInfo: {
    name?: string
    phone: string
    email?: string
    location: string
    notes: string
  }
  timestamps: {
    created: Date
    confirmed: Date | null
    preparing: Date | null
    ready: Date | null
    delivering: Date | null
    delivered: Date | null
  }
  estimatedDeliveryTime: number // minutes
  robotPosition?: { lat: number; lng: number; timestamp?: string }
  robotId?: string
}

export interface PaymentSession {
  orderId: string
  method: 'qr' | 'momo' | 'card'
  amount: number
  status: 'pending' | 'processing' | 'completed' | 'failed'
  qrCode?: string
  redirectUrl?: string
  sessionId: string
}

interface KioskStore {
  // Cart State
  cartItems: CartItem[]
  cartItemCount: number
  cartTotal: number
  cartSubtotal: number
  deliveryFee: number

  // Order State
  currentOrder: Order | null
  orderHistory: Order[]
  
  // Payment State
  paymentSession: PaymentSession | null
  
  // UI State
  currentSection: 'home' | 'order' | 'tracking' | 'history'
  isLoading: boolean
  error: string | null

  // Cart Actions
  addToCart: (item: MenuItem, quantity: number) => void
  updateCartItemQuantity: (itemId: string, quantity: number) => void
  removeFromCart: (itemId: string) => void
  clearCart: () => void

  // Order Actions
  createOrder: (customerInfo: Order['customerInfo'], paymentMethod: Order['paymentMethod'], externalId?: string) => Promise<string>
  updateOrderStatus: (orderId: string, status: Order['status']) => void
  completeOrder: (orderId: string) => void
  cancelOrder: (orderId: string) => void
  reorderFromHistory: (order: Order) => void

  // Payment Actions
  initiatePayment: (orderId: string, method: PaymentSession['method']) => Promise<PaymentSession>
  completePayment: (sessionId: string) => Promise<boolean>
  cancelPayment: (sessionId: string) => void

  // Navigation Actions
  setCurrentSection: (section: KioskStore['currentSection']) => void
  
  // Utility Actions
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useKioskStore = create<KioskStore>()(
  persist(
    (set, get) => ({
      // Initial State
      cartItems: [],
      cartItemCount: 0,
      cartTotal: 0,
      cartSubtotal: 0,
      deliveryFee: 0,
      currentOrder: null,
      orderHistory: [],
      paymentSession: null,
  currentSection: 'home',
      isLoading: false,
      error: null,

      // Cart Actions
      addToCart: (item: MenuItem, quantity: number) => {
        set((state) => {
          const existingItem = state.cartItems.find(cartItem => cartItem.id === item.id)
          
          let newCartItems: CartItem[]
          
          if (existingItem) {
            newCartItems = state.cartItems.map(cartItem =>
              cartItem.id === item.id
                ? { ...cartItem, quantity: cartItem.quantity + quantity }
                : cartItem
            )
          } else {
            const newCartItem: CartItem = {
              id: item.id,
              name: item.name,
              price: item.price,
              quantity,
              image: item.image,
              category: item.category
            }
            newCartItems = [...state.cartItems, newCartItem]
          }

          const cartSubtotal = newCartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
          const deliveryFee = cartSubtotal > 200000 ? 0 : 15000 // Free delivery for orders > 200k VND
          const cartTotal = cartSubtotal + deliveryFee
          const cartItemCount = newCartItems.reduce((total, item) => total + item.quantity, 0)

          return {
            cartItems: newCartItems,
            cartSubtotal,
            deliveryFee,
            cartTotal,
            cartItemCount
          }
        })
      },

      updateCartItemQuantity: (itemId: string, quantity: number) => {
        set((state) => {
          let newCartItems: CartItem[]
          
          if (quantity <= 0) {
            newCartItems = state.cartItems.filter(item => item.id !== itemId)
          } else {
            newCartItems = state.cartItems.map(item =>
              item.id === itemId ? { ...item, quantity } : item
            )
          }

          const cartSubtotal = newCartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
          const deliveryFee = cartSubtotal > 200000 ? 0 : 15000
          const cartTotal = cartSubtotal + deliveryFee
          const cartItemCount = newCartItems.reduce((total, item) => total + item.quantity, 0)

          return {
            cartItems: newCartItems,
            cartSubtotal,
            deliveryFee,
            cartTotal,
            cartItemCount
          }
        })
      },

      removeFromCart: (itemId: string) => {
        get().updateCartItemQuantity(itemId, 0)
      },

      clearCart: () => {
        set({
          cartItems: [],
          cartSubtotal: 0,
          deliveryFee: 0,
          cartTotal: 0,
          cartItemCount: 0
        })
      },

      // Order Actions
      createOrder: async (customerInfo: Order['customerInfo'], paymentMethod: Order['paymentMethod'], externalId?: string) => {
        const state = get()
        
        try {
          set({ isLoading: true, error: null })
          
          // Call real API to create order
          const response = await kioskOrderService.createSimpleKioskOrder({
            items: state.cartItems.map(item => ({
              name: item.name,
              quantity: item.quantity,
              price: item.price
            })),
            customerName: customerInfo.name || 'Kiosk Customer',
            customerPhone: customerInfo.phone,
            deliveryFee: state.deliveryFee,
            note: `${customerInfo.notes || ''}\nPayment: ${paymentMethod}`,
            externalId // Truyền externalId để đồng bộ với MoMo
          })
          
          if (!response.success) {
            throw new Error(response.error || 'Failed to create order')
          }
          
          // Map API response to local Order format
          const newOrder: Order = {
            id: response.orderId!,
            externalId: externalId, // Set externalId for display (MoMo orderID)
            status: 'preparing',
            items: [...state.cartItems],
            subtotal: state.cartSubtotal,
            deliveryFee: state.deliveryFee,
            total: state.cartTotal,
            paymentMethod,
            customerInfo,
            timestamps: {
              created: new Date(),
              confirmed: null,
              preparing: null,
              ready: null,
              delivering: null,
              delivered: null
            },
            estimatedDeliveryTime: response.estimatedTime || 15,
            robotId: response.robotId
          }

          set((state) => ({
            currentOrder: newOrder,
            orderHistory: [newOrder, ...state.orderHistory],
            isLoading: false
          }))

          return response.orderId!
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to create order'
          set({ 
            isLoading: false, 
            error: errorMessage 
          })
          throw error
        }
      },

      updateOrderStatus: (orderId: string, status: Order['status']) => {
        set((state) => {
          const updateTimestamps = (order: Order): Order => {
            const timestamps = { ...order.timestamps }
            const now = new Date()
            
            switch (status) {
              case 'preparing':
                timestamps.preparing = now
                break
              case 'ready':
                timestamps.ready = now
                break
              case 'delivering':
                timestamps.delivering = now
                break
              case 'delivered':
                timestamps.delivered = now
                break
            }

            return { ...order, status, timestamps }
          }

          return {
            currentOrder: state.currentOrder?.id === orderId 
              ? updateTimestamps(state.currentOrder)
              : state.currentOrder,
            orderHistory: state.orderHistory.map(order =>
              order.id === orderId ? updateTimestamps(order) : order
            )
          }
        })
      },

      completeOrder: (orderId: string) => {
        get().updateOrderStatus(orderId, 'delivered')
        set({ currentOrder: null })
        get().clearCart()
      },

      cancelOrder: (orderId: string) => {
        get().updateOrderStatus(orderId, 'cancelled')
        set({ currentOrder: null })
      },

      reorderFromHistory: (order: Order) => {
        // Clear current cart and add items from history
        get().clearCart()
        
        order.items.forEach(item => {
          const menuItem: MenuItem = {
            id: item.id,
            name: item.name,
            description: '',
            price: item.price,
            image: item.image,
            category: item.category,
            available: true
          }
          get().addToCart(menuItem, item.quantity)
        })
        
  get().setCurrentSection('order')
      },

      // Payment Actions
      initiatePayment: async (orderId: string, method: PaymentSession['method']) => {
        const state = get()
        const sessionId = `PAY-${Date.now()}`
        
        const paymentSession: PaymentSession = {
          orderId,
          method,
          amount: state.cartTotal,
          status: 'pending',
          sessionId
        }

        // Simulate payment gateway integration
        if (method === 'qr') {
          paymentSession.qrCode = `qr-code-data-for-${orderId}`
        } else if (method === 'momo') {
          paymentSession.redirectUrl = `https://momo.vn/payment/${sessionId}`
        }

        set({ paymentSession })
        return paymentSession
      },

      completePayment: async (sessionId: string) => {
        const state = get()
        
        if (state.paymentSession?.sessionId === sessionId) {
          set((state) => ({
            paymentSession: state.paymentSession 
              ? { ...state.paymentSession, status: 'completed' }
              : null
          }))
          
          // Confirm the order
          if (state.currentOrder) {
            get().updateOrderStatus(state.currentOrder.id, 'preparing')
          }
          
          return true
        }
        
        return false
      },

      cancelPayment: (sessionId: string) => {
        const state = get()
        
        if (state.paymentSession?.sessionId === sessionId) {
          set({ paymentSession: null })
        }
      },

      // Navigation Actions
      setCurrentSection: (section: KioskStore['currentSection']) => {
        set({ currentSection: section })
      },

      // Utility Actions
      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },

      setError: (error: string | null) => {
        set({ error })
      }
    }),
    {
      name: 'kiosk-store',
      // Only persist cart and order history, not UI state
      partialize: (state) => ({
        cartItems: state.cartItems,
        cartItemCount: state.cartItemCount,
        cartTotal: state.cartTotal,
        cartSubtotal: state.cartSubtotal,
        deliveryFee: state.deliveryFee,
        orderHistory: state.orderHistory
      })
    }
  )
)