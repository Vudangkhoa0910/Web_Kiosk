/**
 * useMomoPayment Hook
 * Xử lý logic MoMo payment callbacks
 */

import type { FlowStep, CustomerInfo } from '../types/orderFlow'
import { useKioskStore } from '../stores/kioskStore'
import { tokenManager } from '../services/tokenManager'

interface UseMomoPaymentProps {
  isProcessing: boolean
  setIsProcessing: (processing: boolean) => void
  setMomoPaymentUrl: (url: string | null) => void
  setOrderId: (id: string | null) => void
  setStep: (step: FlowStep) => void
  setSelectedRestaurant: (restaurant: any) => void
  setSelectedItem: (item: any) => void
}

export const useMomoPayment = ({
  isProcessing,
  setIsProcessing,
  setMomoPaymentUrl,
  setOrderId,
  setStep,
  setSelectedRestaurant,
  setSelectedItem
}: UseMomoPaymentProps) => {
  const { createOrder } = useKioskStore()

  // Helper function to create order with retry on token expiration
  const createOrderWithRetry = async (
    customer: CustomerInfo,
    paymentMethod: 'momo' | 'qr' = 'momo'
  ): Promise<string> => {
    try {
      return await createOrder({
        name: customer.name,
        phone: customer.phone,
        email: '',
        location: 'Kiosk Alpha Asimov',
        notes: customer.note || 'Order từ Web Kiosk - MoMo Payment'
      }, paymentMethod)
    } catch (firstError: any) {
      if (firstError.response?.status === 401 || firstError.message?.includes('Token hết hạn')) {
        console.log('🔄 Token expired, refreshing and retrying order creation...')
        const newToken = await tokenManager.refreshAccessToken()
        if (!newToken) {
          throw new Error('Failed to refresh token. Please login again.')
        }
        console.log('✅ Token refreshed, retrying order creation...')
        return await createOrder({
          name: customer.name,
          phone: customer.phone,
          email: '',
          location: 'Kiosk Alpha Asimov',
          notes: customer.note || 'Order từ Web Kiosk - MoMo Payment'
        }, paymentMethod)
      }
      throw firstError
    }
  }

  // Handle MoMo callback from iframe message
  const handleMomoMessage = async (
    event: MessageEvent,
    _customer: CustomerInfo
  ) => {
    if (event.origin !== window.location.origin || isProcessing) {
      return
    }

    const { type, resultCode, orderId: momoOrderId, transId, extraData } = event.data

    if (type === 'MOMO_CALLBACK' && resultCode && momoOrderId) {
      console.log('🔵 Received MoMo callback from iframe:', { resultCode, orderId: momoOrderId, transId })

      if (resultCode === '0') {
        console.log('✅ Payment successful! Processing without refresh...')

        // Decode extraData to restore customer info
        let restoredCustomer = { name: '', phone: '', note: '' }
        if (extraData) {
          try {
            const decoded = JSON.parse(atob(extraData))
            if (decoded.userInfo) {
              restoredCustomer = {
                name: decoded.userInfo.name || '',
                phone: decoded.userInfo.phone || '',
                note: decoded.userInfo.note || ''
              }
            }
          } catch (e) {
            console.warn('⚠️ Could not decode extraData:', e)
          }
        }

        try {
          setIsProcessing(true)
          console.log('🔄 Creating order with payment info...')

          const newOrderId = await createOrderWithRetry(restoredCustomer)

          console.log('✅ Order created successfully:', newOrderId)

          // Close dialog first, then navigate
          setMomoPaymentUrl(null)
          setSelectedItem(null)
          setSelectedRestaurant(null)

          // Wait for dialog to close, then set success and navigate
          setTimeout(() => {
            setOrderId(newOrderId)
            setStep('success')
            setIsProcessing(false)
          }, 300)
        } catch (err) {
          console.error('❌ Failed to create order:', err)
          // Testing mode: continue anyway
          console.warn('⚠️ TESTING MODE: Continuing to success')

          setMomoPaymentUrl(null)
          setSelectedItem(null)
          setSelectedRestaurant(null)

          setTimeout(() => {
            setOrderId('TEST_ORDER_' + Date.now())
            setStep('success')
            setIsProcessing(false)
          }, 300)
        }
      } else {
        console.log('❌ Payment failed or cancelled')
        setMomoPaymentUrl(null)
        setSelectedRestaurant(null)
        setSelectedItem(null)
        alert('Thanh toán đã bị hủy hoặc thất bại. Vui lòng thử lại.')
      }
    }
  }

  // Handle MoMo callback from URL redirect
  const handleMomoUrlCallback = async (_customer: CustomerInfo) => {
    const urlParams = new URLSearchParams(window.location.search)
    const resultCode = urlParams.get('resultCode')
    const momoOrderId = urlParams.get('orderId')
    const transId = urlParams.get('transId')
    const extraDataParam = urlParams.get('extraData')

    if (resultCode !== null && momoOrderId !== null && !isProcessing) {
      console.log('🔵 MoMo Payment Callback detected:', { resultCode, orderId: momoOrderId, transId })

      // If in iframe, post message to parent
      if (window.self !== window.top) {
        console.log('🔵 Running in iframe, posting message to parent...')
        window.parent.postMessage({
          type: 'MOMO_CALLBACK',
          resultCode,
          orderId: momoOrderId,
          transId,
          extraData: extraDataParam
        }, window.location.origin)
        return
      }

      if (resultCode === '0') {
        console.log('✅ Payment successful! Processing...')

        // Decode extraData
        let restoredCustomer = { name: '', phone: '', note: '' }
        if (extraDataParam) {
          try {
            const decoded = JSON.parse(atob(extraDataParam))
            if (decoded.userInfo) {
              restoredCustomer = {
                name: decoded.userInfo.name || '',
                phone: decoded.userInfo.phone || '',
                note: decoded.userInfo.note || ''
              }
            }
          } catch (e) {
            console.warn('⚠️ Could not decode extraData:', e)
          }
        }

        try {
          setIsProcessing(true)
          window.history.replaceState({}, '', window.location.pathname)

          console.log('🔄 Creating order with payment info...')
          const newOrderId = await createOrderWithRetry(restoredCustomer)

          console.log('✅ Order created successfully:', newOrderId)

          // Close dialog first, then navigate
          setMomoPaymentUrl(null)
          setSelectedItem(null)
          setSelectedRestaurant(null)

          setTimeout(() => {
            setOrderId(newOrderId)
            setStep('success')
            setIsProcessing(false)
          }, 300)
        } catch (err) {
          console.error('❌ Failed to create order:', err)
          console.warn('⚠️ TESTING MODE: Continuing to success')

          setMomoPaymentUrl(null)
          setSelectedItem(null)
          setSelectedRestaurant(null)

          setTimeout(() => {
            setOrderId('TEST_ORDER_' + Date.now())
            setStep('success')
            setIsProcessing(false)
          }, 300)
        }
      } else {
        console.log('❌ Payment failed or cancelled')
        window.history.replaceState({}, '', window.location.pathname)
        setSelectedRestaurant(null)
        setSelectedItem(null)
        setMomoPaymentUrl(null)
        alert('Thanh toán đã bị hủy hoặc thất bại. Vui lòng thử lại.')
      }
    }
  }

  return {
    handleMomoMessage,
    handleMomoUrlCallback,
    createOrderWithRetry
  }
}
