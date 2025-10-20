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
import { useNavigate } from 'react-router-dom'
import { useKioskStore } from '../../stores/kioskStore'
import { useAppStore } from '../../hooks/useAppStore'
import { useLanguage } from '../../contexts/LanguageContext'
import { PathRenderer, JourneyRobot } from './home'
import momoPaymentService from '../../services/momoPaymentService'
import '../../styles/tracking.css'

type FlowStep = 'restaurant' | 'menu' | 'details' | 'payment' | 'success'
type PaymentMethod = 'momo'

interface ProductItem {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  available: boolean
  restaurantId: string
}

interface Restaurant {
  id: string
  name: string
  description: string
  image: string
  location: string
  category: string
}

interface CartItem extends ProductItem {
  quantity: number
}

const RESTAURANTS: Restaurant[] = [
  {
    id: 'rest1',
    name: 'Burger House',
    description: 'Chuyên các loại burger ngon và đồ ăn nhanh',
    image: 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    location: 'Tầng 1, Khu A',
    category: 'fastfood'
  },
  {
    id: 'rest2',
    name: 'Cafe & Tea',
    description: 'Đồ uống và món ăn nhẹ phong cách hiện đại',
    image: 'https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    location: 'Tầng 2, Khu B',
    category: 'cafe'
  },
  {
    id: 'rest3',
    name: 'Asian Kitchen',
    description: 'Món ăn châu Á đa dạng và hấp dẫn',
    image: 'https://images.pexels.com/photos/1833349/pexels-photo-1833349.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    location: 'Tầng 1, Khu C',
    category: 'asian'
  }
]

const PRODUCT_ITEMS: ProductItem[] = [
  // Đồ ăn
  {
    id: 'pho-ha-noi',
    name: 'Phở Bò Hà Nội',
    description: 'Bánh phở mềm, nước dùng trong, thịt bò tươi',
    price: 55000,
    image: 'https://images.pexels.com/photos/4253312/pexels-photo-4253312.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    category: 'food',
    available: true,
    restaurantId: 'rest3'
  },
  {
    id: 'banh-mi',
    name: 'Bánh Mì Thịt Nướng',
    description: 'Bánh giòn, pate, thịt nướng và rau thơm',
    price: 28000,
    image: 'https://images.pexels.com/photos/4917818/pexels-photo-4917818.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    category: 'food',
    available: true,
    restaurantId: 'rest1'
  },
  {
    id: 'bun-cha',
    name: 'Bún Chả Hà Nội',    
    description: 'Chả nướng than hoa, nước mắm chua ngọt',
    price: 52000,
    image: 'https://images.pexels.com/photos/4253302/pexels-photo-4253302.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    category: 'food',
    available: true,
    restaurantId: 'rest3'
  },
  // Đồ uống
  {
    id: 'ca-phe-sua',
    name: 'Cà Phê Sữa Đá',
    description: 'Cà phê phin truyền thống với sữa đặc',
    price: 22000,
    image: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    category: 'drink',
    available: true,
    restaurantId: 'rest2'
  },
  {
    id: 'tra-sua',
    name: 'Trà Sữa Trân Châu',
    description: 'Trà sữa thơm ngon với trân châu đen dai giòn',
    price: 35000,
    image: 'https://images.pexels.com/photos/1893556/pexels-photo-1893556.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    category: 'drink',
    available: true,
    restaurantId: 'rest2'
  },
  {
    id: 'nuoc-suoi',
    name: 'Nước Suối Lavie',
    description: 'Nước suối tinh khiết chai 500ml',
    price: 8000,
    image: 'https://images.pexels.com/photos/327090/pexels-photo-327090.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    category: 'drink',
    available: true,
    restaurantId: 'rest2'
  },
  // Đồ ăn vặt
  {
    id: 'snack-lay',
    name: 'Snack Khoai Tây Lay\'s',
    description: 'Bánh snack khoai tây vị tự nhiên gói 56g',
    price: 15000,
    image: 'https://images.pexels.com/photos/1893556/pexels-photo-1893556.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    category: 'snack',
    available: true,
    restaurantId: 'rest2'
  },
  {
    id: 'banh-quy',
    name: 'Bánh Quy Oreo',
    description: 'Bánh quy chocolate kem vani gói 133g',
    price: 25000,
    image: 'https://images.pexels.com/photos/230325/pexels-photo-230325.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    category: 'snack',
    available: true,
    restaurantId: 'rest2'
  },
  // Tráng miệng
  {
    id: 'banh-flan',
    name: 'Bánh Flan Caramel',
    description: 'Mềm mịn, thơm béo lớp caramel',
    price: 20000,
    image: 'https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    category: 'dessert',
    available: true,
    restaurantId: 'rest2'
  }
]



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
  const { t } = useLanguage()
  const [category, setCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)
  const [selectedItems, setSelectedItems] = useState<CartItem[]>([])
  const [selectedItem, setSelectedItem] = useState<ProductItem | null>(null)
  const [step, setStep] = useState<FlowStep>('restaurant')
  const [customer, setCustomer] = useState({ name: '', phone: '', note: '' })
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('momo')
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [momoPaymentUrl, setMomoPaymentUrl] = useState<string | null>(null)

  const { addToCart, clearCart, createOrder, initiatePayment, currentOrder } = useKioskStore()
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

  // Auto-redirect to tracking after successful payment
  useEffect(() => {
    if (step === 'success' && orderId) {
      const timer = setTimeout(() => {
        setActiveSection('tracking')
        navigate('/tracking')
      }, 2000) // Wait 2 seconds before redirecting

      return () => clearTimeout(timer)
    }
  }, [step, orderId, navigate, setActiveSection]);

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
    setPaymentMethod('momo')
    setOrderId(null)
    setError(null)
    setMomoPaymentUrl(null)
    setIsProcessing(false)
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

  // Auto-initialize MoMo payment when entering payment step
  useEffect(() => {
    if (step === 'payment' && !momoPaymentUrl && !isProcessing && selectedItems.length > 0) {
      const initMomoPayment = async () => {
        try {
          console.log('🔵 Auto-starting MoMo payment...')
          setIsProcessing(true)
          const amount = getTotalAmount()
          const orderInfo = `Thanh toan ${selectedRestaurant?.name || 'don hang'} - ${new Date().toLocaleString()}`

          console.log('🔵 Calling MoMo API with:', { amount, orderInfo, items: selectedItems })
          
          // Use merchant payment to get official MoMo payUrl
          const resp = await momoPaymentService.createMerchantPayment({ 
            amount, 
            orderInfo, 
            items: selectedItems,
            userInfo: {
              name: customer.name,
              phone: customer.phone,
              note: customer.note
            }
          })
          
          console.log('🔵 MoMo API Response:', resp)

          const data = resp?.data

          if (data && data.payUrl) {
            // Set payUrl to embed in iframe
            console.log('🔵 Embedding MoMo gateway in iframe:', data.payUrl)
            setMomoPaymentUrl(data.payUrl)
            setIsProcessing(false)
          } else {
            console.error('❌ No payUrl returned from MoMo API')
            console.error('Response data:', data)
            setIsProcessing(false)
            setError('Không thể tạo thanh toán MoMo. Vui lòng thử lại.')
          }
        } catch (error) {
          console.error('❌ MoMo payment init error:', error)
          const errorMessage = error instanceof Error ? error.message : 'Không thể kết nối đến server thanh toán'
          setIsProcessing(false)
          setError(errorMessage)
        }
      }

      initMomoPayment()
    }
  }, [step, momoPaymentUrl, isProcessing, selectedItems, selectedRestaurant, customer])

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
                    <span className="font-semibold text-gray-900">#{currentOrder.id.slice(-8)}</span>
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
                momoPaymentUrl ? 'max-w-6xl max-h-[92vh]' : 'max-w-md max-h-[80vh]'
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
                momoPaymentUrl ? 'p-3 max-h-[calc(92vh-90px)]' : 'p-5 max-h-[calc(80vh-90px)]'
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
                  <div className="space-y-2">
                    <div className="rounded-xl bg-gray-50 p-2.5 border border-gray-200">
                      <h4 className="font-semibold text-gray-800 text-sm mb-1.5">Chi tiết đơn hàng</h4>
                      {selectedItems.map((item) => (
                        <div key={item.id} className="flex justify-between text-xs mb-1">
                          <span>{item.name} x{item.quantity}</span>
                          <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Phí giao hàng:</span>
                        <span>Miễn phí</span>
                      </div>
                      <div className="flex justify-between text-sm font-bold pt-1.5 border-t border-gray-300">
                        <span>Tổng cộng:</span>
                        <span className="text-gray-900">{formatCurrency(getTotalAmount())}</span>
                      </div>
                    </div>

                    {/* MoMo Payment Iframe - Full view without scroll */}
                    {momoPaymentUrl && (
                      <div className="space-y-1.5">
                        {/* Embedded MoMo iframe - Full size with gray theme */}
                        <div className="relative rounded-lg overflow-hidden border-2 border-gray-300 bg-white shadow-md">
                          <div className="bg-gradient-to-r from-gray-700 to-gray-900 px-2.5 py-1 flex items-center justify-between">
                            <span className="text-white text-xs font-medium">Kết nối bảo mật</span>
                            <button
                              onClick={() => {
                                setMomoPaymentUrl(null)
                                setIsProcessing(false)
                              }}
                              className="text-white hover:text-gray-200 font-bold text-lg leading-none transition-all duration-200"
                              title="Đóng"
                            >
                              ×
                            </button>
                          </div>
                          
                          <div className="bg-gray-50 p-0.5">
                            <iframe
                              src={momoPaymentUrl}
                              className="w-full h-[600px] border-0 bg-white"
                              title="MoMo Payment Gateway"
                              sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
                              allow="payment"
                            />
                          </div>
                        </div>

                        {/* Quick instructions - Compact with gray theme */}
                        <div className="bg-gray-100 rounded-lg p-1.5 border border-gray-300">
                          <p className="font-semibold text-xs text-gray-900 mb-0.5">Hướng dẫn:</p>
                          <div className="text-xs text-gray-700 leading-tight">
                            <p>1. Mở app MoMo/Ngân hàng → 2. Quét QR → 3. Xác nhận thanh toán</p>
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

                    {/* Back button only */}
                    <div className="flex justify-start pt-1">
                      <button
                        onClick={() => {
                          setStep('details')
                          setMomoPaymentUrl(null)
                          setIsProcessing(false)
                        }}
                        disabled={isProcessing}
                        className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Quay lại
                      </button>
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
    </div>
  )
}

export default OrderFlowSection