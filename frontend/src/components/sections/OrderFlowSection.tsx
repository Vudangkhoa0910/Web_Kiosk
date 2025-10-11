import React, { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Minus,
  Plus,
  QrCode,
  Smartphone,
  User,
  Phone,
  FileText,
  X,
  ShoppingCart
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useKioskStore } from '../../stores/kioskStore'
import { useAppStore } from '../../hooks/useAppStore'
import { generateVietQR, BANK_INFO } from '../../utils/vietqr'
import '../../styles/tracking.css'
import '../../styles/tracking.css'

type FlowStep = 'restaurant' | 'menu' | 'details' | 'payment' | 'success'
type PaymentMethod = 'qr' | 'momo'

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

const RESTAURANT_CATEGORIES = [
  { id: 'all', label: 'Tất cả' },
  { id: 'fastfood', label: 'Đồ ăn nhanh' },
  { id: 'cafe', label: 'Cafe & Đồ uống' },
  { id: 'asian', label: 'Món Á' }
]

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)

const steps: FlowStep[] = ['restaurant', 'menu', 'details', 'payment', 'success']
const stepLabels = ['Chọn quán', 'Chọn món', 'Thông tin giao hàng', 'Thanh toán', 'Hoàn tất đơn hàng']

const OrderFlowSection: React.FC = () => {
  const navigate = useNavigate()
  const [category, setCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)
  const [selectedItems, setSelectedItems] = useState<CartItem[]>([])
  const [selectedItem, setSelectedItem] = useState<ProductItem | null>(null)
  const [step, setStep] = useState<FlowStep>('restaurant')
  const [customer, setCustomer] = useState({ name: '', phone: '', note: '' })
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('qr')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isWaitingPaymentConfirm, setIsWaitingPaymentConfirm] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const { addToCart, clearCart, createOrder, initiatePayment } = useKioskStore()
  const { setActiveSection } = useAppStore()

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
    setPaymentMethod('qr')
    setOrderId(null)
    setError(null)
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

  const processOrder = async () => {
    setIsProcessing(true)
    setError(null)
    try {
      clearCart()
      
      // Add all selected items to cart
      selectedItems.forEach(item => {
        addToCart(
          {
            id: item.id,
            name: item.name,
            description: item.description,
            price: item.price,
            image: item.image,
            category: item.category,
            available: true
          },
          item.quantity
        )
      })

      const createdOrderId = await createOrder(
        {
          phone: customer.phone,
          location: customer.name || 'Điểm nhận kiosk',
          notes: customer.note
        },
        paymentMethod
      )

      await initiatePayment(createdOrderId, paymentMethod)
      setOrderId(createdOrderId)
      setIsWaitingPaymentConfirm(false)
      setStep('success')
    } catch (err) {
      console.error(err)
      setError('Không thể tạo đơn hàng, vui lòng thử lại.')
      setIsWaitingPaymentConfirm(false)
    } finally {
      setIsProcessing(false)
    }
  }

  const canContinueDetails = Boolean(customer.name.trim() && customer.phone.trim())

  const handlePlaceOrder = async () => {
    if (selectedItems.length === 0) return
    
    // Start payment processing for both QR and MoMo
    if (paymentMethod === 'qr') {
      // For QR, show waiting state immediately
      setIsWaitingPaymentConfirm(true)
      
      // Simulate waiting for admin confirmation (in reality would be WebSocket or polling)
      setTimeout(async () => {
        await processOrder()
      }, 5000) // Simulate 5 seconds waiting for admin confirmation
      return
    }
    
    if (paymentMethod === 'momo') {
      // For MoMo, simulate app redirect and processing
      setIsProcessing(true)
      setError(null)
      
      // Simulate MoMo app processing time
      setTimeout(async () => {
        await processOrder()
      }, 3000) // Simulate 3 seconds for MoMo processing
      return
    }
    
    setIsProcessing(true)
    setError(null)
    try {
      clearCart()
      
      // Add all selected items to cart
      selectedItems.forEach(item => {
        addToCart(
          {
            id: item.id,
            name: item.name,
            description: item.description,
            price: item.price,
            image: item.image,
            category: item.category,
            available: true
          },
          item.quantity
        )
      })

      const createdOrderId = await createOrder(
        {
          phone: customer.phone,
          location: customer.name || 'Điểm nhận kiosk',
          notes: customer.note
        },
        paymentMethod
      )

      await initiatePayment(createdOrderId, paymentMethod)
      setOrderId(createdOrderId)
      setStep('success')
    } catch (err) {
      console.error(err)
      setError('Không thể tạo đơn hàng, vui lòng thử lại.')
    } finally {
      setIsProcessing(false)
    }
  }



  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Compact Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold flex items-center gap-2 text-gray-900">
                <ShoppingCart className="w-6 h-6 text-gray-700" />
                Đặt đơn hàng
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
      <div className="px-6 py-6">
        <div className="mx-auto max-w-6xl">

          {/* Header */}
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Chọn quán ăn</h2>
            <p className="text-gray-600">Chọn quán ăn bạn muốn đặt món để bắt đầu.</p>
          </div>

          {/* Search and Category Filters */}
          <div className="mb-6 space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm quán ăn..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {RESTAURANT_CATEGORIES.map((cat) => (
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy quán nào</h3>
              <p className="text-gray-500">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc.</p>
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
                className="bg-white rounded-2xl border border-gray-200 text-left transition-all duration-300 hover:shadow-lg hover:-translate-y-2 hover:border-gray-300"
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
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-white rounded-3xl max-w-md w-full max-h-[80vh] overflow-hidden shadow-2xl border border-gray-100"
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
                      {selectedItem ? selectedItem.name : selectedRestaurant?.name || 'Chọn món ăn'}
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
              <div className="p-5 overflow-y-auto max-h-[calc(80vh-90px)]">

                {error && (
                  <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                {/* Step Content */}
                {step === 'restaurant' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Chọn quán ăn</h3>
                      <p className="text-sm text-gray-600">Chọn quán ăn bạn muốn đặt món.</p>
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
                        Chọn món từ {selectedRestaurant.name}
                      </h3>
                      <p className="text-sm text-gray-600">Chọn các món ăn bạn muốn đặt.</p>
                    </div>

                    {/* Selected Items Cart */}
                    {selectedItems.length > 0 && (
                      <div className="rounded-2xl bg-gray-50 p-4 border border-gray-100">
                        <h4 className="font-semibold text-gray-800 mb-3">Giỏ hàng của bạn</h4>
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
                          <span>Tổng cộng:</span>
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
                        Quay lại
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
                        Tiếp theo ({selectedItems.length} món)
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
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Phương thức thanh toán</h3>
                      <p className="text-sm text-gray-600">Chọn phương thức thanh toán bạn muốn sử dụng.</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setPaymentMethod('qr')}
                        className={`flex flex-col items-center gap-3 rounded-2xl border-2 p-6 transition-all duration-200 ${
                          paymentMethod === 'qr'
                            ? 'border-gray-600 bg-gray-50 text-gray-800 shadow-md'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:shadow-sm'
                        }`}
                      >
                        <QrCode className="h-8 w-8" />
                        <div className="text-center">
                          <p className="font-semibold">QR Code</p>
                          <p className="text-xs mt-1 opacity-70">Quét mã thanh toán</p>
                        </div>
                      </button>
                      
                      <button
                        onClick={() => setPaymentMethod('momo')}
                        className={`flex flex-col items-center gap-3 rounded-2xl border-2 p-6 transition-all duration-200 ${
                          paymentMethod === 'momo'
                            ? 'border-gray-600 bg-gray-50 text-gray-800 shadow-md'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:shadow-sm'
                        }`}
                      >
                        <Smartphone className="h-8 w-8" />
                        <div className="text-center">
                          <p className="font-semibold">Ví MoMo</p>
                          <p className="text-xs mt-1 opacity-70">Thanh toán qua ví điện tử</p>
                        </div>
                      </button>
                    </div>

                    <div className="rounded-2xl bg-gray-50 p-4 space-y-2 border border-gray-100">
                      <h4 className="font-semibold text-gray-800 mb-2">Chi tiết đơn hàng</h4>
                      {selectedItems.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span>{item.name} x{item.quantity}</span>
                          <span>{formatCurrency(item.price * item.quantity)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between text-sm">
                        <span>Phí giao hàng:</span>
                        <span className="text-gray-600">Miễn phí</span>
                      </div>
                      <hr className="my-2" />
                      <div className="flex justify-between text-lg font-bold">
                        <span>Tổng cộng:</span>
                        <span className="text-gray-800">{formatCurrency(getTotalAmount())}</span>
                      </div>
                    </div>

                    {/* QR Code UI */}
                    {paymentMethod === 'qr' && !isWaitingPaymentConfirm && (
                      <div className="flex flex-col items-center space-y-4">
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                          <img
                            src={generateVietQR(
                              BANK_INFO.accountNo,
                              BANK_INFO.accountName,
                              getTotalAmount(),
                              `Thanh toan don hang ${selectedRestaurant?.name || ''}`,
                              BANK_INFO.bankCode
                            )}
                            alt="QR Code thanh toán"
                            className="w-64 h-64 object-contain"
                          />
                        </div>
                        
                        {/* Bank Info */}
                        <div className="bg-gray-50 rounded-2xl p-4 w-full border border-gray-100">
                          <h4 className="font-semibold text-gray-800 mb-2">Thông tin chuyển khoản</h4>
                          <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex justify-between">
                              <span>Ngân hàng:</span>
                              <span className="font-medium">MB Bank</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Số tài khoản:</span>
                              <span className="font-medium">{BANK_INFO.accountNo}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Chủ tài khoản:</span>
                              <span className="font-medium">{BANK_INFO.accountName}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Số tiền:</span>
                              <span className="font-medium text-gray-800">
                                {formatCurrency(getTotalAmount())}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* MoMo UI */}
                    {paymentMethod === 'momo' && !isProcessing && (
                      <div className="flex flex-col items-center space-y-4">
                        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center">
                          <div className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Smartphone className="w-12 h-12 text-pink-600" />
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">Thanh toán MoMo</h3>
                          <p className="text-gray-600 mb-6">
                            Số tiền: <span className="font-bold text-pink-600">{formatCurrency(getTotalAmount())}</span>
                          </p>
                          <p className="text-sm text-gray-500 mb-4">
                            Bấm "Mở ứng dụng MoMo" để tiếp tục thanh toán
                          </p>
                          <div className="bg-pink-50 rounded-xl p-4 text-sm text-pink-700">
                            <p>• Mở ứng dụng MoMo trên điện thoại</p>
                            <p>• Xác nhận thông tin thanh toán</p>
                            <p>• Hoàn tất giao dịch</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Loading states */}
                    {(isWaitingPaymentConfirm || isProcessing) && (
                      <div className="flex flex-col items-center space-y-6 py-8">
                        <div className="relative">
                          {/* Robot spinning animation */}
                          <div className="robot-container">
                            <img
                              src="/images/Bulldog/2.png"
                              alt="Robot đang xử lý"
                              className="w-24 h-24 object-contain robot-spin"
                            />
                            <div className="loading-dots">
                              <div className="loading-dot"></div>
                              <div className="loading-dot"></div>
                              <div className="loading-dot"></div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {isWaitingPaymentConfirm ? 'Đang chờ xác nhận thanh toán' : 'Đang xử lý thanh toán'}
                          </h3>
                          <p className="text-gray-600">
                            {isWaitingPaymentConfirm 
                              ? 'Vui lòng chờ admin xác nhận đã nhận được tiền...' 
                              : 'Đang xử lý giao dịch MoMo của bạn...'}
                          </p>
                        </div>
                        
                        {/* Progress info */}
                        <div className="bg-white rounded-xl p-4 border border-gray-200 w-full max-w-sm">
                          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                            <span>Quán:</span>
                            <span className="font-medium">{selectedRestaurant?.name}</span>
                          </div>
                          <div className="text-sm text-gray-600 mb-2">
                            <span>Món đã chọn:</span>
                            <div className="mt-1 space-y-1">
                              {selectedItems.map((item) => (
                                <div key={item.id} className="flex justify-between">
                                  <span>{item.name} x{item.quantity}</span>
                                  <span>{formatCurrency(item.price * item.quantity)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-sm text-gray-600 pt-2 border-t border-gray-200">
                            <span>Tổng tiền:</span>
                            <span className="font-semibold text-gray-800">
                              {formatCurrency(getTotalAmount())}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between gap-3">
                      <button
                        onClick={() => setStep('details')}
                        className="rounded-2xl border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 flex items-center gap-2"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Quay lại
                      </button>
                      <button
                        onClick={handlePlaceOrder}
                        disabled={isProcessing}
                        className={`rounded-2xl px-6 py-2.5 text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                          isProcessing 
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                            : 'bg-gray-800 text-white hover:bg-gray-900 shadow-md hover:shadow-lg'
                        }`}
                      >
                        {isProcessing ? 'Đang xử lý...' : 'Đặt hàng ngay'}
                        {!isProcessing && <CheckCircle2 className="h-4 w-4" />}
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
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">Đặt hàng thành công!</h3>
                      <p className="text-gray-600 mb-4">
                        Robot sẽ nhận đơn và di chuyển tới kiosk. Bạn có thể theo dõi hành trình ngay bây giờ.
                      </p>
                      {orderId && (
                        <div className="bg-gray-50 rounded-2xl p-4 mb-4 border border-gray-100">
                          <p className="text-sm text-gray-600">Mã đơn hàng</p>
                          <p className="text-xl font-bold text-gray-900">{orderId}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-3">
                      <button
                        onClick={() => {
                          resetFlow()
                          setActiveSection('tracking')
                          navigate('/tracking')
                        }}
                        className="rounded-2xl bg-gray-800 px-6 py-3 text-sm font-medium text-white hover:bg-gray-900 transition-all duration-200 shadow-md hover:shadow-lg"
                      >
                        Theo dõi đơn hàng
                      </button>
                      <button
                        onClick={resetFlow}
                        className="rounded-2xl border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                      >
                        Đặt thêm sản phẩm khác
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default OrderFlowSection