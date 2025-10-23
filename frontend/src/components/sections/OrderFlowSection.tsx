import React, { useMemo, useState, useEffect } from 'react'
import { motion, AnimatePresence, useMotionValue, animate } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Minus,
  Plus,
  User,
  Phone,
  FileText,
  X,
  ShoppingCart
} from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useKioskStore } from '../../stores/kioskStore'
import { useAppStore } from '../../hooks/useAppStore'
import { useLanguage } from '../../contexts/LanguageContext'
import { PathRenderer, JourneyRobot } from './home'
import momoPaymentService from '../../services/momoPaymentService'
import { tokenManager } from '../../services/tokenManager'
import { maskPhoneNumber, decodeBase64UTF8, formatOrderId } from '../../utils/formatters'
import '../../styles/tracking.css'

// Import types and constants from modules
import type { FlowStep, ProductItem, Restaurant, CartItem } from '../../types/orderFlow'
import { RESTAURANTS, PRODUCT_ITEMS } from '../../constants/orderFlow'

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)

const steps: FlowStep[] = ['restaurant', 'menu', 'details', 'payment', 'success']

// Custom hook for continuous robot journey
const useContinuousJourney = () => {
  const robotX = useMotionValue('10%')
  const robotY = useMotionValue('50%')
  const [direction, setDirection] = useState<'forward' | 'reverse'>('forward')

  // Fixed path points for the journey
  const pathPoints = [
    { progress: 0, x: 10, y: 50 },
    { progress: 1, x: 90, y: 50 }
  ]

  useEffect(() => {
    let animationId: any

    const startAnimation = () => {
      // Animation from left to right (forward)
      animationId = animate(robotX, '85%', {
        duration: 8,
        ease: 'linear',
        onComplete: () => {
          setDirection('reverse')
          // Animation from right to left (reverse)
          animationId = animate(robotX, '15%', {
            duration: 8,
            ease: 'linear',
            onComplete: () => {
              setDirection('forward')
              startAnimation() // Restart the cycle
            }
          })
        }
      })
    }

    startAnimation()

    return () => {
      if (animationId) {
        animationId.stop()
      }
    }
  }, [robotX])

  return {
    pathPoints,
    robotX,
    robotY,
    direction
  }
}

const OrderFlowSection: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useLanguage()
  const [category, setCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)
  const [selectedItems, setSelectedItems] = useState<CartItem[]>([])
  const [selectedItem, setSelectedItem] = useState<ProductItem | null>(null)
  const [step, setStep] = useState<FlowStep>('restaurant')
  const [customer, setCustomer] = useState({ name: '', phone: '', note: '' })
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [momoPaymentUrl, setMomoPaymentUrl] = useState<string | null>(null)
  const [userCancelledPayment, setUserCancelledPayment] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)

  const { currentOrder, createOrder, isLoading, cartItems: zustandCartItems } = useKioskStore()
  const { setActiveSection } = useAppStore()

  // Check if there's an active order
  const hasActiveOrder = currentOrder && 
    currentOrder.status !== 'delivered' && 
    currentOrder.status !== 'cancelled'
  
  // Robot journey animation state
  const [journeyFrame, setJourneyFrame] = useState<0 | 1>(0)
  
  // Robot journey animation for continuous movement
  useEffect(() => {
    const frameTimer = setInterval(
      () => setJourneyFrame((prev) => (prev === 0 ? 1 : 0)),
      900
    );

    return () => clearInterval(frameTimer);
  }, []);

  // Listen for MoMo callback messages from iframe (to avoid page refresh)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Verify origin for security
      if (event.origin !== window.location.origin) {
        return;
      }

      const { type, resultCode, orderId: momoOrderId, transId, extraData } = event.data;

      if (type === 'MOMO_CALLBACK' && resultCode && momoOrderId && !isProcessing) {
        console.log('🔵 Received MoMo callback from iframe:', { resultCode, orderId: momoOrderId, transId });

        if (resultCode === '0') {
          // Payment successful - process without page reload
          console.log('✅ Payment successful! Processing without refresh...');

          // ⚡ IMMEDIATELY close dialog to prevent MoMo redirect
          console.log('⚡ Closing dialog immediately to prevent redirect...');
          setMomoPaymentUrl(null);
          setSelectedItem(null);
          setSelectedRestaurant(null);

          // Decode extraData with UTF-8 support
          let restoredCustomer = { name: '', phone: '', note: '' };
          if (extraData) {
            try {
              const decodedString = decodeBase64UTF8(extraData);
              const decoded = JSON.parse(decodedString);
              console.log('🔍 Decoded extraData:', decoded);
              if (decoded.userInfo) {
                restoredCustomer = {
                  name: decoded.userInfo.name || '',
                  phone: decoded.userInfo.phone || '',
                  note: decoded.userInfo.note || ''
                };
                console.log('✅ Restored customer info:', restoredCustomer);
              }
            } catch (e) {
              console.warn('⚠️ Could not decode extraData:', e);
            }
          }

          // Process payment
          const processPaymentFromIframe = async () => {
            try {
              setIsProcessing(true);
              console.log('Creating order with synced orderId:', momoOrderId);

              let newOrderId: string;
              
              try {
                newOrderId = await createOrder({
                  name: restoredCustomer.name,
                  phone: restoredCustomer.phone,
                  email: '',
                  location: 'Kiosk Alpha Asimov',
                  notes: restoredCustomer.note || 'Order từ Web Kiosk - MoMo Payment'
                }, 'momo', momoOrderId); // Truyền momoOrderId để đồng bộ
              } catch (firstError: any) {
                if (firstError.response?.status === 401 || firstError.message?.includes('Token hết hạn')) {
                  console.log('Token expired, refreshing...');
                  const newToken = await tokenManager.refreshAccessToken();
                  if (!newToken) {
                    throw new Error('Failed to refresh token. Please login again.');
                  }
                  console.log('Token refreshed, retrying...');
                  newOrderId = await createOrder({
                    name: restoredCustomer.name,
                    phone: restoredCustomer.phone,
                    email: '',
                    location: 'Kiosk Alpha Asimov',
                    notes: restoredCustomer.note || 'Order từ Web Kiosk - MoMo Payment'
                  }, 'momo', momoOrderId); // Truyền momoOrderId để đồng bộ
                } else {
                  throw firstError;
                }
              }

              console.log('Order created successfully:', newOrderId);
              console.log('📦 Using MoMo OrderID for tracking:', momoOrderId);
              
              // Store order info for navigation AFTER dialog closes
              // Use momoOrderId as the primary order ID for consistency
              const orderInfo = {
                orderId: momoOrderId, // Use MoMo orderID instead of API returned ID
                items: selectedItems,
                customer: restoredCustomer,
                restaurant: selectedRestaurant,
                totalAmount: selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
                timestamp: new Date().toISOString(),
                paymentMethod: 'momo'
              };
              
              console.log('📦 Order Information:', orderInfo);
              
              // Dialog already closed at the beginning (line ~141)
              // Show navigating overlay and wait before navigating
              setIsNavigating(true);
              
              setTimeout(() => {
                console.log('🚀 Navigating to tracking...');
                setActiveSection('tracking');
                navigate('/tracking', { 
                  state: { 
                    newOrder: orderInfo,
                    fromPayment: true,
                    showSuccessMessage: true
                  } 
                });
                
                // Reset states after navigation
                setSelectedItems([]);
                setOrderId(null);
                setStep('restaurant');
                setCustomer({ name: '', phone: '', note: '' });
                setIsProcessing(false);
                setIsNavigating(false);
              }, 350); // Wait for dialog close animation
              
            } catch (err) {
              console.error('❌ Failed to create order after retry:', err);
              console.warn('⚠️ TESTING MODE: Order creation failed, but continuing to success for testing purposes');
              
              // Testing mode: use momoOrderId for consistency
              const testOrderInfo = {
                orderId: momoOrderId, // Use MoMo orderID for consistency
                items: selectedItems,
                customer: restoredCustomer,
                restaurant: selectedRestaurant,
                totalAmount: selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
                timestamp: new Date().toISOString(),
                paymentMethod: 'momo'
              };
              
              // Dialog already closed, show navigating overlay and wait
              setIsNavigating(true);
              
              setTimeout(() => {
                setActiveSection('tracking');
                navigate('/tracking', { 
                  state: { 
                    newOrder: testOrderInfo,
                    fromPayment: true,
                    showSuccessMessage: true
                  } 
                });
                
                // Reset states
                setSelectedItems([]);
                setOrderId(null);
                setStep('restaurant');
                setCustomer({ name: '', phone: '', note: '' });
                setIsProcessing(false);
                setIsNavigating(false);
              }, 350);
            }
          };

          processPaymentFromIframe();
        } else {
          // Payment failed - Close dialog and return to payment step
          console.log('Payment failed or cancelled')
          setMomoPaymentUrl(null)
          setIsProcessing(false)
          setError('Thanh toán chưa hoàn tất. Vui lòng thử lại hoặc chọn phương thức thanh toán khác.')
          // Mark that user cancelled to prevent auto-restart
          setUserCancelledPayment(true)
          // Reset to payment step to allow retry
          // KEEP orderId to reuse for retry
          setStep('payment')
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [isProcessing, createOrder, navigate, setActiveSection]);

  // Detect MoMo callback from URL params (after redirect)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const resultCode = urlParams.get('resultCode');
    const momoOrderId = urlParams.get('orderId');
    const transId = urlParams.get('transId');
    const extraDataParam = urlParams.get('extraData');

    // Check if this is a MoMo callback AND we haven't processed it yet
    if (resultCode !== null && momoOrderId !== null && !isProcessing) {
      console.log('🔵 MoMo Payment Callback detected:', {
        resultCode,
        orderId: momoOrderId,
        transId,
      });

      // If we're in an iframe, post message to parent instead of full page redirect
      if (window.self !== window.top) {
        console.log('🔵 Running in iframe, posting message to parent...');
        window.parent.postMessage({
          type: 'MOMO_CALLBACK',
          resultCode,
          orderId: momoOrderId,
          transId,
          extraData: extraDataParam
        }, window.location.origin);
        return; // Stop processing here, let parent window handle it
      }

      if (resultCode === '0') {
        // Payment successful
        console.log('✅ Payment successful! Processing...');
        
        // Decode extraData with UTF-8 support to get customer info
        let restoredCustomer = { name: '', phone: '', note: '' };
        
        if (extraDataParam) {
          try {
            const decodedString = decodeBase64UTF8(extraDataParam);
            const decoded = JSON.parse(decodedString);
            console.log('🔍 Decoded extraData:', decoded);
            
            if (decoded.userInfo) {
              console.log('✅ Restoring customer info:', decoded.userInfo);
              restoredCustomer = {
                name: decoded.userInfo.name || '',
                phone: decoded.userInfo.phone || '',
                note: decoded.userInfo.note || ''
              };
            }
          } catch (e) {
            console.warn('⚠️ Could not decode extraData:', e);
          }
        }

        // Create order immediately with retry on token expiration
        const processPayment = async () => {
          try {
            setIsProcessing(true);
            
            // Clear URL params FIRST to prevent re-triggering this useEffect
            window.history.replaceState({}, '', window.location.pathname);
            
            console.log('Creating order with synced orderId:', momoOrderId);
            let newOrderId: string;
            
            try {
              // Try to create order with synced orderId
              newOrderId = await createOrder({
                name: restoredCustomer.name,
                phone: restoredCustomer.phone,
                email: '',
                location: 'Kiosk Alpha Asimov',
                notes: restoredCustomer.note || 'Order từ Web Kiosk - MoMo Payment'
              }, 'momo', momoOrderId); // Truyền momoOrderId để đồng bộ
              
            } catch (firstError: any) {
              // If error is 401 (token expired), refresh and retry ONCE
              if (firstError.response?.status === 401 || firstError.message?.includes('Token hết hạn')) {
                console.log('Token expired, refreshing...');
                
                // Refresh token
                const newToken = await tokenManager.refreshAccessToken();
                
                if (!newToken) {
                  throw new Error('Failed to refresh token. Please login again.');
                }
                
                console.log('Token refreshed, retrying...');
                
                // Retry order creation with new token
                newOrderId = await createOrder({
                  name: restoredCustomer.name,
                  phone: restoredCustomer.phone,
                  email: '',
                  location: 'Kiosk Alpha Asimov',
                  notes: restoredCustomer.note || 'Order từ Web Kiosk - MoMo Payment'
                }, 'momo', momoOrderId); // Truyền momoOrderId để đồng bộ
              } else {
                // Re-throw non-token errors
                throw firstError;
              }
            }

            console.log('Order created successfully:', newOrderId);
            console.log('📦 Using MoMo OrderID for tracking:', momoOrderId);
            
            // Close dialog first, then navigate
            setMomoPaymentUrl(null);
            setSelectedItem(null);
            setSelectedRestaurant(null);
            
            // Wait for dialog to close, then set success and navigate
            // Use momoOrderId for consistency across all systems
            setTimeout(() => {
              setOrderId(momoOrderId); // Use MoMo orderID instead of API returned ID
              setStep('success');
              setIsProcessing(false);
            }, 300); // Wait for dialog close animation
            
          } catch (err) {
            console.error('❌ Failed to create order after retry:', err);
            
            // ⚠️ TESTING MODE: Show success even if order creation fails
            console.warn('⚠️ TESTING MODE: Order creation failed, but continuing to success for testing purposes');
            
            // Close dialog first, then navigate (testing mode)
            setMomoPaymentUrl(null);
            setSelectedItem(null);
            setSelectedRestaurant(null);
            
            // Wait for dialog to close, then set success and navigate
            // Use momoOrderId for consistency
            setTimeout(() => {
              setOrderId(momoOrderId); // Use MoMo orderID for consistency
              setStep('success');
              setIsProcessing(false);
            }, 300); // Wait for dialog close animation
            
            // The existing useEffect will handle auto-redirect after 2 seconds
          }
        };

        processPayment();
      } else {
        // Payment failed or cancelled - Return to order flow
        console.log('Payment failed or cancelled')
        
        // Clear URL params first
        window.history.replaceState({}, '', window.location.pathname)
        
        // Close MoMo dialog and reset to payment step for retry
        setMomoPaymentUrl(null)
        setIsProcessing(false)
        setError('Thanh toán chưa hoàn tất. Vui lòng thử lại hoặc chọn phương thức thanh toán khác.')
        // Mark that user cancelled to prevent auto-restart
        setUserCancelledPayment(true)
        // KEEP orderId to reuse for retry
        setStep('payment')
      }
    }
  }, [location.search, isProcessing, createOrder, navigate, setActiveSection]);

  // Continuous robot journey layout (back-and-forth movement)
  const { pathPoints, robotX, robotY, direction } = useContinuousJourney();

  // Create step labels from translations
  const stepLabels = [
    t.orderFlow.steps.selectRestaurant,
    t.orderFlow.steps.selectItems,
    t.orderFlow.steps.deliveryInfo,
    t.orderFlow.steps.payment,
    t.orderFlow.steps.complete,
  ];

  // Create categories from translations
  const restaurantCategories = [
    { id: 'all', label: t.orderFlow.restaurant.categories.all },
    { id: 'fastfood', label: t.orderFlow.restaurant.categories.fastfood },
    { id: 'cafe', label: t.orderFlow.restaurant.categories.cafe },
    { id: 'asian', label: t.orderFlow.restaurant.categories.asian },
  ];

  const filteredRestaurants = useMemo(() => {
    const keyword = search.toLowerCase().trim()
    return RESTAURANTS.filter((restaurant) => {
      const matchesCategory = category === 'all' || restaurant.category === category
      if (!keyword) return matchesCategory
      return (restaurant.name + restaurant.description).toLowerCase().includes(keyword)
    })
  }, [category, search])

  const filteredItems = useMemo(() => {
    const keyword = search.toLowerCase().trim()
    return PRODUCT_ITEMS.filter((item) => {
      if (!item.available) return false
      
      // Filter by selected restaurant
      if (selectedRestaurant && item.restaurantId !== selectedRestaurant.id) return false
      
      const matchesCategory = category === 'all' || item.category === category
      if (!keyword) return matchesCategory
      return (item.name + item.description).toLowerCase().includes(keyword)
    })
  }, [category, search, selectedRestaurant])

  // Function to initialize order flow with selected item
  // const openFlow = (item: ProductItem) => {
  //   setSelectedItem(item)
  //   setStep('restaurant')
  //   setCustomer({ name: '', phone: '', note: '' })
  //   setPaymentMethod('qr')
  //   setOrderId(null)
  //   setError(null)
  // }

  const resetFlow = () => {
    setSelectedRestaurant(null)
    setSelectedItems([])
    setSelectedItem(null)
    setStep('restaurant')
    setCustomer({ name: '', phone: '', note: '' })
    setOrderId(null)
    setError(null)
    setMomoPaymentUrl(null)
    setIsProcessing(false)
    setUserCancelledPayment(false)
  }

  const addItemToCart = (item: ProductItem) => {
    const existingItemIndex = selectedItems.findIndex(cartItem => cartItem.id === item.id)
    if (existingItemIndex >= 0) {
      const updatedItems = [...selectedItems]
      updatedItems[existingItemIndex].quantity += 1
      setSelectedItems(updatedItems)
    } else {
      setSelectedItems([...selectedItems, { ...item, quantity: 1 }])
    }
  }

  const removeItemFromCart = (itemId: string) => {
    setSelectedItems(selectedItems.filter(item => item.id !== itemId))
  }

  const updateItemQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItemFromCart(itemId)
      return
    }
    setSelectedItems(selectedItems.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    ))
  }

  const getTotalAmount = () => {
    return selectedItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const canContinueDetails = Boolean(customer.name.trim() && customer.phone.trim())

  // Check sessionStorage for payment cancellation flag (survives navigation)
  useEffect(() => {
    const wasCancelled = sessionStorage.getItem('payment_cancelled');
    if (wasCancelled === 'true') {
      console.log('� Found payment_cancelled flag in sessionStorage');
      
      // Restore from sessionStorage
      const savedItems = sessionStorage.getItem('cancelled_order_items');
      const savedCustomer = sessionStorage.getItem('cancelled_order_customer');
      
      if (savedItems) {
        try {
          const items = JSON.parse(savedItems);
          setSelectedItems(items);
          console.log('✅ Restored items from sessionStorage:', items.length);
        } catch (e) {
          console.error('Failed to parse saved items:', e);
        }
      }
      
      if (savedCustomer) {
        try {
          const customerData = JSON.parse(savedCustomer);
          setCustomer(customerData);
          console.log('✅ Restored customer info from sessionStorage');
        } catch (e) {
          console.error('Failed to parse saved customer:', e);
        }
      }
      
      // Set UI state
      setUserCancelledPayment(true);
      setStep('payment');
      
      // Clean up sessionStorage
      sessionStorage.removeItem('payment_cancelled');
      console.log('✅ Cleared sessionStorage flags');
    }
  }, []); // Run once on mount

  // Handle payment error/cancel from URL params (after MoMo redirect)
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const errorType = urlParams.get('error');
    
    if (errorType === 'payment_failed') {
      console.log('🔴 Detected payment failure/cancellation from URL');
      
      // ✅ SAVE TO SESSION STORAGE (survives navigation)
      sessionStorage.setItem('payment_cancelled', 'true');
      
      // Save cart items
      if (zustandCartItems && zustandCartItems.length > 0) {
        sessionStorage.setItem('cancelled_order_items', JSON.stringify(zustandCartItems));
        console.log('💾 Saved', zustandCartItems.length, 'items to sessionStorage');
      }
      
      // Save customer info
      if (customer.name || customer.phone) {
        sessionStorage.setItem('cancelled_order_customer', JSON.stringify(customer));
        console.log('💾 Saved customer info to sessionStorage');
      }
      
      // Clear URL param
      window.history.replaceState({}, '', window.location.pathname);
      
      // Reload to trigger restoration from sessionStorage
      console.log('🔄 Reloading to restore state from sessionStorage...');
      window.location.reload();
    }
  }, [location.search]);

  // Auto-initialize MoMo payment when entering payment step
  useEffect(() => {
    // Don't auto-start if user just cancelled payment
    if (step === 'payment' && !momoPaymentUrl && !isProcessing && selectedItems.length > 0 && !userCancelledPayment) {
      const initMomoPayment = async () => {
        try {
          console.log('Auto-starting MoMo payment')
          setIsProcessing(true)
          
          // Tạo orderID trước để đồng bộ giữa Web và MoMo
          // Nếu đã có orderId (từ lần retry trước), dùng lại; nếu chưa có thì tạo mới
          const syncedOrderId = orderId || `AA${Date.now()}`
          if (!orderId) {
            setOrderId(syncedOrderId)
          }
          
          const amount = getTotalAmount()
          const orderInfo = `Thanh toan ${selectedRestaurant?.name || 'don hang'} - ${new Date().toLocaleString()}`

          console.log('Calling MoMo API with synced orderId:', syncedOrderId)
          
          // Gửi orderId đã tạo cho MoMo
          const resp = await momoPaymentService.createMerchantPayment({ 
            amount, 
            orderInfo, 
            items: selectedItems,
            orderId: syncedOrderId, // Gửi orderId đã tạo
            userInfo: {
              name: customer.name,
              phone: customer.phone,
              note: customer.note
            }
          })
          
          console.log('MoMo API Response:', resp)

          const data = resp?.data

          if (data && data.payUrl) {
            console.log('Embedding MoMo gateway in iframe')
            setMomoPaymentUrl(data.payUrl)
            setIsProcessing(false)
          } else {
            console.error('No payUrl returned from MoMo API')
            console.error('Response data:', data)
            setIsProcessing(false)
            setError('Không thể tạo thanh toán MoMo. Vui lòng thử lại.')
          }
        } catch (error) {
          console.error('MoMo payment init error:', error)
          const errorMessage = error instanceof Error ? error.message : 'Không thể kết nối đến server thanh toán'
          setIsProcessing(false)
          setError(errorMessage)
        }
      }

      initMomoPayment()
    }
  }, [step, momoPaymentUrl, isProcessing, selectedItems, selectedRestaurant, customer, userCancelledPayment, orderId])

  // If there's an active order, show blocking message
  if (hasActiveOrder) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full">
          {/* Warning Card */}
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-8 py-6">
              <div className="flex items-center justify-center gap-3">
                <ShoppingCart className="w-8 h-8 text-white" />
                <h1 className="text-2xl font-bold text-white">Đơn hàng đang hoạt động</h1>
              </div>
            </div>

            {/* Content */}
            <div className="px-8 py-8 space-y-6">
              {/* Icon and Message */}
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                  <FileText className="w-10 h-10 text-gray-700" />
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-xl font-bold text-gray-900">
                    Bạn đang có đơn hàng đang được thực hiện
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    Vui lòng hoàn tất đơn hàng hiện tại trước khi đặt đơn hàng mới. 
                    Hệ thống chỉ hỗ trợ xử lý một đơn hàng tại một thời điểm.
                  </p>
                </div>
              </div>

              {/* Order Info */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Thông tin đơn hàng
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mã đơn hàng:</span>
                    <span className="font-semibold text-gray-900">{formatOrderId(currentOrder.id)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Trạng thái:</span>
                    <span className="font-semibold text-gray-900 capitalize">
                      {currentOrder.status === 'preparing' && 'Đang chuẩn bị'}
                      {currentOrder.status === 'ready' && 'Đã sẵn sàng'}
                      {currentOrder.status === 'delivering' && 'Đang giao hàng'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tổng tiền:</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(currentOrder.total)}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => {
                  // Navigate directly to tracking page (no dialog involved)
                  setActiveSection('tracking')
                  navigate('/tracking')
                }}
                className="w-full bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white rounded-xl px-6 py-4 font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <span>Theo dõi đơn hàng</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              {/* Info Note */}
              <div className="text-center text-xs text-gray-500 pt-2">
                Sau khi nhận được hàng và xác nhận hoàn tất đơn hàng, bạn có thể đặt đơn mới
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900 pb-24 sm:pb-28 lg:pb-32">
      {/* Compact Header */}
      <header className="bg-gradient-to-r from-white via-gray-50/50 to-white border-b border-gray-200/60 backdrop-blur-sm px-6 py-4 shadow-sm">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold flex items-center gap-2 text-gray-900">
                <ShoppingCart className="w-6 h-6 text-gray-700" />
                {t.orderFlow.title}
              </h1>
            </div>
            
            {/* Compact Progress Steps */}
            <div className="flex items-center gap-4">
              {steps.map((stepName, index) => {
                const currentIndex = selectedRestaurant ? steps.indexOf(step) : 0
                const isActive = currentIndex === index
                const isCompleted = currentIndex > index
                
                return (
                  <div key={stepName} className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                      isCompleted ? 'bg-gray-900 text-white shadow-lg' :
                      isActive ? 'bg-gray-700 text-white shadow-md' :
                      'bg-gray-200 text-gray-500'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <span className={`text-xs font-medium ${
                      isActive || isCompleted ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {stepLabels[index]}
                    </span>
                    {index < steps.length - 1 && (
                      <div className={`w-8 h-0.5 ml-2 rounded-full transition-all duration-300 ${
                        currentIndex > index ? 'bg-gray-900' : 'bg-gray-300'
                      }`} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </header>
  
      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="mx-auto max-w-7xl">

          {/* Header */}
          <div className="mb-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 bg-clip-text text-transparent mb-4">{t.orderFlow.restaurant.title}</h2>
            <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">{t.orderFlow.restaurant.subtitle}</p>
          </div>

          {/* Search and Category Filters */}
          <div className="mb-6 space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder={t.orderFlow.restaurant.searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {restaurantCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    category === cat.id
                      ? 'bg-gray-900 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Restaurants Grid */}
          {filteredRestaurants.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">{t.orderFlow.restaurant.noResultsTitle}</h3>
              <p className="text-gray-500">{t.orderFlow.restaurant.noResultsDesc}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filteredRestaurants.map((restaurant) => (
              <button
                key={restaurant.id}
                onClick={() => {
                  setSelectedRestaurant(restaurant)
                  setStep('menu')
                }}
                className="bg-white rounded-2xl border border-gray-200/80 text-left transition-all duration-300 hover:shadow-xl hover:-translate-y-3 hover:border-gray-300/90 hover:bg-gradient-to-br hover:from-white hover:to-gray-50/30 group"
              >
                <div className="h-48 w-full overflow-hidden rounded-t-2xl bg-gray-50">
                  <img src={restaurant.image} alt={restaurant.name} className="h-full w-full object-cover transition-transform duration-300 hover:scale-105" />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{restaurant.name}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{restaurant.description}</p>
                  <div className="flex items-center text-xs text-gray-500">
                    <span>{restaurant.location}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
          )}
        </div>
      </div>

      {/* Order Flow Modal */}
      <AnimatePresence>
        {(selectedItem || selectedRestaurant) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[55]"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={`bg-white rounded-3xl w-full shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 ${
                momoPaymentUrl ? 'max-w-[70vw] max-h-[95vh]' : 'max-w-md max-h-[80vh]'
              }`}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden bg-gray-100 shadow-sm">
                    <img 
                      src={selectedItem ? selectedItem.image : selectedRestaurant?.image || '/images/default-restaurant.jpg'} 
                      alt={selectedItem ? selectedItem.name : selectedRestaurant?.name || 'Restaurant'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900">
                      {selectedItem ? selectedItem.name : selectedRestaurant?.name || t.orderFlow.menu.selectItems}
                    </h2>
                    <p className="text-sm font-bold text-gray-900">
                      {selectedItem ? formatCurrency(selectedItem.price) : selectedRestaurant?.location || ''}
                    </p>
                  </div>
                </div>
                <button
                  onClick={resetFlow}
                  className="rounded-2xl p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Modal Content */}
              <div className={`overflow-y-auto ${
                momoPaymentUrl ? 'p-4 max-h-[calc(98vh-80px)]' : 'p-5 max-h-[calc(80vh-90px)]'
              }`}>

                {error && (
                  <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                {/* Step Content */}
                {step === 'restaurant' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{t.orderFlow.restaurant.selectRestaurant}</h3>
                      <p className="text-sm text-gray-600">{t.orderFlow.restaurant.selectRestaurantDesc}</p>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      {RESTAURANTS.map((restaurant) => (
                        <button
                          key={restaurant.id}
                          onClick={() => {
                            setSelectedRestaurant(restaurant)
                            setStep('menu')
                          }}
                          className="flex items-center gap-4 rounded-2xl border-2 border-gray-200 bg-white p-4 text-left transition-all duration-200 hover:border-gray-300 hover:shadow-md"
                        >
                          <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                            <img
                              src={restaurant.image}
                              alt={restaurant.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-gray-900 mb-1">
                              {restaurant.name}
                            </h4>
                            <p className="text-sm text-gray-600 mb-2">
                              {restaurant.description}
                            </p>
                            <div className="flex items-center text-xs text-gray-500">
                              <span>{restaurant.location}</span>
                            </div>
                          </div>
                          <ArrowRight className="h-5 w-5 text-gray-400" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 'menu' && selectedRestaurant && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        {t.orderFlow.menu.title} {selectedRestaurant.name}
                      </h3>
                      <p className="text-sm text-gray-600">Chọn các món ăn bạn muốn đặt.</p>
                    </div>

                    {/* Selected Items Cart */}
                    {selectedItems.length > 0 && (
                      <div className="rounded-2xl bg-gray-50 p-4 border border-gray-100">
                        <h4 className="font-semibold text-gray-800 mb-3">{t.orderFlow.menu.cart}</h4>
                        <div className="space-y-2 mb-4">
                          {selectedItems.map((item) => (
                            <div key={item.id} className="flex items-center justify-between bg-white p-3 rounded-xl">
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">{item.name}</p>
                                <p className="text-sm text-gray-600">{formatCurrency(item.price)}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                                  className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                                >
                                  <Minus className="h-4 w-4" />
                                </button>
                                <span className="w-8 text-center font-medium">{item.quantity}</span>
                                <button
                                  onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                                  className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                                >
                                  <Plus className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center justify-between text-lg font-bold pt-2 border-t border-gray-200">
                          <span>{t.orderFlow.menu.total}:</span>
                          <span className="text-gray-900">{formatCurrency(getTotalAmount())}</span>
                        </div>
                      </div>
                    )}

                    {/* Available Menu Items */}
                    <div className="grid grid-cols-1 gap-3">
                      {filteredItems.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <p>Không có món ăn nào từ quán này.</p>
                          <p className="text-sm mt-1">Restaurant ID: {selectedRestaurant?.id}</p>
                        </div>
                      )}
                      {filteredItems.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4">
                          <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">{item.name}</h4>
                            <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                            <p className="font-bold text-gray-900">{formatCurrency(item.price)}</p>
                          </div>
                          <button
                            onClick={() => addItemToCart(item)}
                            className="rounded-xl bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-900 transition-all duration-200"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between gap-3">
                      <button
                        onClick={() => setStep('restaurant')}
                        className="rounded-2xl border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 flex items-center gap-2"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        {t.orderFlow.buttons.back}
                      </button>
                      <button
                        onClick={() => setStep('details')}
                        disabled={selectedItems.length === 0}
                        className={`rounded-2xl px-6 py-2.5 text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                          selectedItems.length === 0
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-gray-800 text-white hover:bg-gray-900 shadow-md hover:shadow-lg'
                        }`}
                      >
                        {t.orderFlow.buttons.next} ({selectedItems.length} món)
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}

                {step === 'details' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Thông tin giao hàng</h3>
                      <p className="text-sm text-gray-600">Nhập thông tin liên hệ để chúng tôi giao hàng chính xác.</p>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 focus-within:border-gray-400 focus-within:ring-2 focus-within:ring-gray-100 transition-all duration-200">
                        <User className="h-5 w-5 text-gray-500" />
                        <input
                          className="flex-1 bg-transparent outline-none placeholder-gray-500"
                          placeholder="Tên khách hàng *"
                          value={customer.name}
                          onChange={(event) => setCustomer({ ...customer, name: event.target.value })}
                        />
                      </div>
                      <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 focus-within:border-gray-400 focus-within:ring-2 focus-within:ring-gray-100 transition-all duration-200">
                        <Phone className="h-5 w-5 text-gray-500" />
                        <input
                          className="flex-1 bg-transparent outline-none placeholder-gray-500"
                          placeholder="Số điện thoại *"
                          value={customer.phone}
                          onChange={(event) => setCustomer({ ...customer, phone: event.target.value })}
                        />
                      </div>
                      <div>
                        <div className="flex items-start gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 focus-within:border-gray-400 focus-within:ring-2 focus-within:ring-gray-100 transition-all duration-200">
                          <FileText className="h-5 w-5 text-gray-500 mt-0.5" />
                          <textarea
                            className="flex-1 bg-transparent outline-none placeholder-gray-500 resize-none"
                            placeholder="Ghi chú thêm (không bắt buộc)"
                            rows={3}
                            value={customer.note}
                            onChange={(event) => setCustomer({ ...customer, note: event.target.value })}
                          />
                        </div>
                        
                        {/* Smart Quick Note Suggestions - Based on cart items */}
                        <div className="mt-3 space-y-2">
                          <p className="text-xs text-gray-600 font-semibold">Gợi ý nhanh:</p>
                          <div className="flex flex-wrap gap-2">
                            {(() => {
                              // Determine categories in cart
                              const hasFood = selectedItems.some(item => item.category === 'food')
                              const hasDrink = selectedItems.some(item => item.category === 'drink')
                              const hasSnack = selectedItems.some(item => item.category === 'snack')
                              const hasDessert = selectedItems.some(item => item.category === 'dessert')
                              
                              // Build smart suggestions array
                              const suggestions: string[] = []
                              
                              // Common suggestions for all orders
                              suggestions.push('Thêm 1 bộ đồ ăn', 'Thêm 2 bộ đồ ăn')
                              
                              // Food-specific suggestions
                              if (hasFood) {
                                suggestions.push('Ít cay', 'Không cay', 'Thêm cay')
                                suggestions.push('Không hành', 'Không rau mùi')
                                suggestions.push('Thêm ớt riêng')
                              }
                              
                              // Drink-specific suggestions
                              if (hasDrink) {
                                suggestions.push('Ít đá', 'Không đá', 'Nhiều đá')
                                suggestions.push('Ít đường', 'Không đường', 'Thêm đường')
                              }
                              
                              // Dessert-specific suggestions
                              if (hasDessert && !hasDrink) {
                                // Only show ice/sugar options if no drinks in cart
                                suggestions.push('Ít đá', 'Nhiều đá')
                                suggestions.push('Ít đường', 'Không đường')
                              }
                              
                              // Snack-specific suggestions
                              if (hasSnack) {
                                suggestions.push('Không tương ớt', 'Thêm tương ớt')
                              }
                              
                              // Extra utensils
                              suggestions.push('Thêm đũa', 'Thêm thìa', 'Thêm khăn giấy')
                              
                              // Remove duplicates while preserving order
                              const uniqueSuggestions = Array.from(new Set(suggestions))
                              
                              return uniqueSuggestions.map((suggestion) => (
                                <button
                                  key={suggestion}
                                  type="button"
                                  onClick={() => {
                                    const currentNote = customer.note.trim()
                                    const newNote = currentNote 
                                      ? `${currentNote}, ${suggestion}` 
                                      : suggestion
                                    setCustomer({ ...customer, note: newNote })
                                  }}
                                  className="px-3 py-1.5 text-xs font-medium bg-white border border-gray-300 rounded-lg hover:bg-gray-800 hover:text-white hover:border-gray-800 transition-all duration-200 whitespace-nowrap shadow-sm"
                                >
                                  {suggestion}
                                </button>
                              ))
                            })()}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between gap-3">
                      <button
                        onClick={() => setStep('menu')}
                        className="rounded-2xl border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 flex items-center gap-2"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Quay lại
                      </button>
                      <button
                        disabled={!canContinueDetails}
                        onClick={() => setStep('payment')}
                        className={`rounded-2xl px-6 py-2.5 text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                          canContinueDetails 
                            ? 'bg-gray-800 text-white hover:bg-gray-900 shadow-md hover:shadow-lg' 
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        Tiếp theo
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}

                {step === 'payment' && (
                  <div>
                    {/* Show retry button if user cancelled payment */}
                    {userCancelledPayment && !momoPaymentUrl && (() => {
                      console.log('🎨 Rendering retry dialog:', {
                        userCancelledPayment,
                        momoPaymentUrl,
                        step,
                        selectedItemsCount: selectedItems.length
                      });
                      return true;
                    })() && (
                      <div className="mb-6">
                        <div className="rounded-2xl bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-orange-300 p-6 shadow-lg">
                          {/* Icon and Message */}
                          <div className="text-center mb-5">
                            <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                              <svg className="w-8 h-8 text-orange-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                              </svg>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                              ⚠️ Thanh toán chưa hoàn tất
                            </h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                              Bạn đã huỷ thanh toán. Vui lòng chọn một trong các tùy chọn bên dưới.
                            </p>
                          </div>

                          {/* Action Buttons */}
                          <div className="grid grid-cols-2 gap-3">
                            <button
                              onClick={() => {
                                setUserCancelledPayment(false)
                                setError(null)
                                // This will trigger the useEffect to auto-start MoMo
                              }}
                              className="group relative rounded-xl bg-gradient-to-r from-gray-800 to-gray-900 text-white px-6 py-4 font-semibold hover:from-gray-900 hover:to-black transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                              <span>Thử lại thanh toán</span>
                            </button>
                            <button
                              onClick={() => {
                                setStep('details')
                                setUserCancelledPayment(false)
                                setError(null)
                              }}
                              className="group relative rounded-xl bg-white border-2 border-gray-300 text-gray-700 px-6 py-4 font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                              </svg>
                              <span>Quay lại chỉnh sửa</span>
                            </button>
                          </div>

                          {/* Help Text */}
                          <div className="mt-4 text-center">
                            <p className="text-xs text-gray-500">
                              Hoặc bấm "Quay lại" ở dưới để thay đổi đơn hàng
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 20/80 Layout: Order Info (20%) | MoMo QR (80%) */}
                    {momoPaymentUrl ? (
                      <div className="flex gap-3 h-[calc(98vh-100px)]">
                        {/* Left Sidebar: Order Details - 20% */}
                        <div className="w-[20%] flex-shrink-0">
                          <div className="rounded-xl bg-white p-3 border border-gray-200 h-full overflow-y-auto shadow-sm">
                            
                            {/* Order Summary Header */}
                            <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg px-3 py-2.5 mb-3 shadow-md">
                              <div className="flex items-center justify-between">
                                <h4 className="font-bold text-white text-sm">Đơn hàng</h4>
                                <span className="text-sm font-bold text-white bg-white/20 px-2 py-0.5 rounded">
                                  {formatCurrency(getTotalAmount())}
                                </span>
                              </div>
                            </div>
                            
                            {/* Order Items */}
                            <div className="mb-3 bg-gray-50 rounded-lg p-2.5 border border-gray-200">
                              <div className="space-y-2">
                                {selectedItems.map((item) => (
                                  <div key={item.id} className="pb-2 border-b border-gray-200 last:border-0 last:pb-0">
                                    <div className="flex justify-between items-start mb-1">
                                      <span className="font-semibold text-gray-900 text-xs leading-tight flex-1 pr-2">
                                        {item.name}
                                      </span>
                                      <span className="text-xs text-gray-600 bg-white px-1.5 py-0.5 rounded font-medium border border-gray-300">
                                        x{item.quantity}
                                      </span>
                                    </div>
                                    <div className="text-xs font-bold text-gray-900">
                                      {formatCurrency(item.price * item.quantity)}
                                    </div>
                                  </div>
                                ))}
                                
                                {/* Delivery Fee */}
                                <div className="pt-2 border-t-2 border-gray-300">
                                  <div className="flex justify-between text-xs">
                                    <span className="text-gray-600 font-medium">Phí ship:</span>
                                    <span className="text-gray-900 font-bold">Miễn phí</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Customer Info */}
                            <div className="mb-3 bg-gray-50 rounded-lg p-2.5 border border-gray-200">
                              <h4 className="font-bold text-gray-900 text-xs mb-2.5 pb-1.5 border-b border-gray-300">
                                Thông tin khách hàng
                              </h4>
                              <div className="space-y-2">
                                <div>
                                  <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wide mb-0.5">Tên</p>
                                  <p className="text-xs font-semibold text-gray-900 bg-white px-2 py-1 rounded border border-gray-200">
                                    {customer.name}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wide mb-0.5">Số điện thoại</p>
                                  <p className="text-xs font-semibold text-gray-900 bg-white px-2 py-1 rounded border border-gray-200">
                                    {maskPhoneNumber(customer.phone)}
                                  </p>
                                </div>
                                {customer.note && (
                                  <div>
                                    <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wide mb-0.5">Ghi chú</p>
                                    <p className="text-xs text-gray-700 bg-white px-2 py-1.5 rounded border border-gray-300 leading-relaxed">
                                      {customer.note}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Payment Instructions */}
                            <div className="bg-gray-800 rounded-lg p-2.5 border border-gray-700 shadow-sm">
                              <div className="flex items-start gap-2 mb-1.5">
                                <svg className="w-4 h-4 text-white mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h4 className="font-bold text-white text-xs">Hướng dẫn thanh toán</h4>
                              </div>
                              <p className="text-xs text-gray-200 leading-relaxed ml-6">
                                Mở ứng dụng <strong className="text-white">MoMo</strong> hoặc <strong className="text-white">ngân hàng</strong> để quét mã QR
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Right Content: MoMo QR - 80% */}
                        <div className="flex-1 min-w-0">
                          <div className="relative rounded-xl overflow-hidden border-2 border-gray-300 bg-white shadow-lg h-full flex flex-col">
                            
                            <div className="bg-gray-50 p-1 flex-1 min-h-0">
                              <iframe
                                src={momoPaymentUrl}
                                className="w-full h-full border-0 bg-white rounded"
                                title="MoMo Payment Gateway"
                                sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-top-navigation allow-top-navigation-by-user-activation"
                                allow="payment; camera; microphone"
                                referrerPolicy="no-referrer-when-downgrade"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Before MoMo loads - Show compact order details */
                      <div className="rounded-lg bg-gray-50 p-2 border border-gray-200">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-gray-800 text-xs">Chi tiết đơn hàng</h4>
                          <span className="text-xs font-bold text-gray-900">{formatCurrency(getTotalAmount())}</span>
                        </div>
                        <div className="space-y-0.5">
                          {selectedItems.map((item) => (
                            <div key={item.id} className="flex justify-between text-xs text-gray-600">
                              <span className="truncate mr-2">{item.name} x{item.quantity}</span>
                              <span className="whitespace-nowrap">{formatCurrency(item.price * item.quantity)}</span>
                            </div>
                          ))}
                          <div className="flex justify-between text-xs text-gray-500 pt-0.5">
                            <span>Phí ship:</span>
                            <span>Miễn phí</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Loading states */}
                    {isProcessing && (
                      <div className="flex flex-col items-center space-y-3 py-4">
                        <div className="relative">
                          {/* Robot spinning animation */}
                          <div className="robot-container">
                            <img
                              src="/images/Bulldog/2.png"
                              alt="Robot đang xử lý"
                              className="w-16 h-16 object-contain robot-spin"
                            />
                            <div className="loading-dots">
                              <div className="loading-dot"></div>
                              <div className="loading-dot"></div>
                              <div className="loading-dot"></div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <h3 className="text-base font-bold text-gray-900 mb-1">
                            Đang kết nối MoMo...
                          </h3>
                          <p className="text-xs text-gray-600">
                            Vui lòng chờ trong giây lát
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Back button only - Complete Payment button removed (real MoMo flow) */}
                    <div className="flex justify-between gap-3 pt-1">
                      <button
                        onClick={() => {
                          setStep('details')
                          setMomoPaymentUrl(null)
                          setIsProcessing(false)
                          setUserCancelledPayment(false)
                          setError(null)
                        }}
                        disabled={isProcessing || isLoading}
                        className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Quay lại
                      </button>
                      
                      {/* TEST BUTTON - COMMENTED OUT - Payment now handled by real MoMo flow */}
                      {/* 
                      <button
                        onClick={async () => {
                          try {
                            setIsProcessing(true)
                            console.log('🚀 Creating order with Alpha Asimov API...')
                            
                            const newOrderId = await createOrder({
                              name: customer.name,
                              phone: customer.phone,
                              email: '',
                              location: 'Kiosk Alpha Asimov',
                              notes: customer.note || 'Order từ Web Kiosk'
                            }, 'momo')

                            console.log('✅ Order created:', newOrderId)
                            setOrderId(newOrderId)
                            setStep('success')
                            setIsProcessing(false)
                          } catch (err) {
                            console.error('❌ Failed to create order:', err)
                            setError(err instanceof Error ? err.message : 'Không thể tạo đơn hàng')
                            setIsProcessing(false)
                          }
                        }}
                        disabled={isProcessing || isLoading || !momoPaymentUrl}
                        className={`rounded-xl px-6 py-2 text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                          momoPaymentUrl && !isProcessing && !isLoading
                            ? 'bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {isProcessing || isLoading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Đang tạo đơn...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="h-4 w-4" />
                            Hoàn tất thanh toán
                          </>
                        )}
                      </button>
                      */}
                    </div>
                  </div>
                )}

                {step === 'success' && (
                  <div className="space-y-6 text-center">
                    <div className="flex justify-center">
                      <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center shadow-lg">
                        <CheckCircle2 className="w-10 h-10 text-gray-800" />
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">{t.orderFlow.success.title}</h3>
                      <p className="text-gray-600 mb-4">
                        Đang chuyển đến theo dõi đơn hàng...
                      </p>
                      {orderId && (
                        <div className="bg-gray-50 rounded-2xl p-4 mb-4 border border-gray-100">
                          <p className="text-sm text-gray-600">{t.orderFlow.success.orderId}</p>
                          <p className="text-xl font-bold text-gray-900">{orderId}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Robot Journey Footer */}
      <footer className={`fixed bottom-0 left-0 right-0 px-4 pb-4 sm:px-6 sm:pb-6 flex items-end justify-center transition-all duration-300 ${
        (selectedItem || selectedRestaurant) ? 'z-10 opacity-30' : 'z-50 opacity-100'
      }`}>
        <div className="w-full max-w-2xl lg:max-w-3xl xl:max-w-4xl">
          <div className="relative h-[4.5rem] sm:h-[5rem] lg:h-[5.5rem] rounded-[1rem] lg:rounded-[1.2rem] border border-gray-200/60 bg-gradient-to-r from-white/85 via-gray-50/90 to-white/85 shadow-[0_16px_40px_rgba(0,0,0,0.08)] backdrop-blur-xl">
            {/* Enhanced background with subtle gradient */}
            <div className="absolute inset-0 rounded-[1.2rem] bg-gradient-to-br from-gray-50/20 via-transparent to-gray-100/20"></div>
            
            {/* Path renderer with better contrast */}
            <div className="absolute inset-0">
              <PathRenderer pathPoints={pathPoints} />
            </div>

            {/* Robot with enhanced animation */}
            <JourneyRobot
              robotX={robotX}
              robotY={robotY}
              direction={direction}
              journeyFrame={journeyFrame}
            />
            
            {/* Corner decorative elements for visual balance */}
            <div className="absolute top-2 left-3 w-2 h-2 bg-gray-300/40 rounded-full"></div>
            <div className="absolute top-2 right-3 w-2 h-2 bg-gray-300/40 rounded-full"></div>
          </div>
        </div>
      </footer>

      {/* Navigating Overlay - Show while transitioning to tracking */}
      <AnimatePresence>
        {isNavigating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[100]"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl p-8 shadow-2xl max-w-md mx-4"
            >
              {/* Robot Icon */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <img
                    src="/images/Bulldog/2.png"
                    alt="Robot đang xử lý"
                    className="w-20 h-20 object-contain animate-bounce"
                  />
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-800 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-800 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-gray-800 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Đang chuyển sang theo dõi đơn hàng
                </h3>
                <p className="text-gray-600">
                  Robot đang chuẩn bị giao hàng cho bạn...
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default OrderFlowSection