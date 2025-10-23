/**
 * useOrderFlow Hook
 * Quản lý logic order flow (navigation, payment success)
 */

import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import type { FlowStep, CartItem, CustomerInfo } from '../types/orderFlow'
import { useAppStore } from './useAppStore'

interface UseOrderFlowProps {
  step: FlowStep
  orderId: string | null
  selectedItems: CartItem[]
  customer: CustomerInfo
  setSelectedItem: (item: any) => void
  setSelectedRestaurant: (restaurant: any) => void
  setOrderId: (id: string | null) => void
  setStep: (step: FlowStep) => void
  setMomoPaymentUrl: (url: string | null) => void
}

export const useOrderFlow = ({
  step,
  orderId,
  selectedItems,
  customer,
  setSelectedItem,
  setSelectedRestaurant,
  setOrderId,
  setStep,
  setMomoPaymentUrl
}: UseOrderFlowProps) => {
  const navigate = useNavigate()
  const { setActiveSection } = useAppStore()

  // Auto-navigate to tracking after successful payment
  useEffect(() => {
    if (step === 'success' && orderId) {
      console.log('NAVIGATION TRIGGERED - Closing dialog first...')
      
      // Navigate with full order information via state
      const orderInfo = {
        orderId,
        items: selectedItems,
        customer,
        timestamp: new Date().toISOString()
      }

      console.log('Navigating with order info:', orderInfo)
      
      setActiveSection('tracking')
      navigate('/tracking', { 
        state: { 
          newOrder: orderInfo,
          fromPayment: true
        } 
      })
      
      // Reset all states after navigation
      setTimeout(() => {
        setSelectedItem(null)
        setSelectedRestaurant(null)
        setOrderId(null)
        setStep('restaurant')
        setMomoPaymentUrl(null)
      }, 100)
    }
  }, [step, orderId, selectedItems, customer, navigate, setActiveSection, setSelectedItem, setSelectedRestaurant, setOrderId, setStep, setMomoPaymentUrl])

  return {
    // Hook này chủ yếu xử lý side effects
    // Có thể thêm các helper functions nếu cần
  }
}
