import React, { useState } from 'react'
import { ArrowLeft, Plus, Minus, ShoppingCart } from 'lucide-react'
import PaymentSection from '../ui/PaymentSection'
import MomoPaymentModal from '../ui/MomoPaymentModal'
import momoPaymentService from '../../services/momoPaymentService'
import '../../styles/tracking.css'

interface ProductItem {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  available?: boolean
}

const PRODUCT_ITEMS: ProductItem[] = [
  {
    id: 'pho-ha-noi',
    name: 'Phở Bò Hà Nội',
    description: 'Bánh phở mềm, nước dùng trong, thịt bò tươi',
    price: 55000,
    image: 'https://images.pexels.com/photos/4253312/pexels-photo-4253312.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    category: 'food',
    available: true
  },
  {
    id: 'banh-mi',
    name: 'Bánh Mì Thịt Nướng', 
    description: 'Bánh giòn, pate, thịt nướng và rau thơm',
    price: 28000,
    image: 'https://images.pexels.com/photos/4917818/pexels-photo-4917818.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    category: 'food',
    available: true
  },
  {
    id: 'bun-cha',
    name: 'Bún Chả Hà Nội',
    description: 'Bún tươi, chả nướng thơm, nước mắm chua ngọt',
    price: 45000,
    image: 'https://images.pexels.com/photos/4253295/pexels-photo-4253295.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    category: 'food',
    available: true
  },
  {
    id: 'ca-phe',
    name: 'Cà Phê Sữa Đá',
    description: 'Cà phê đậm đà, sữa ngọt, đá lạnh',
    price: 20000,
    image: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    category: 'beverage',
    available: true
  },
  {
    id: 'tra-da',
    name: 'Trà Đá Chanh',
    description: 'Trà tươi mát, chanh chua, đá lạnh',
    price: 15000,
    image: 'https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    category: 'beverage',
    available: true
  }
]

interface CartItem extends ProductItem {
  quantity: number
}

type OrderStep = 'menu' | 'cart' | 'payment' | 'success'

const OrderSection: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<OrderStep>('menu')
  const [cart, setCart] = useState<CartItem[]>([])
  const [paymentMethod, setPaymentMethod] = useState<'qr' | 'momo'>('qr')
  const [showMomoModal, setShowMomoModal] = useState(false)
  const [momoPaymentData, setMomoPaymentData] = useState<any>(null)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const addToCart = (product: ProductItem) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const updateQuantity = (productId: string, change: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === productId) {
          const newQuantity = item.quantity + change
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : item
        }
        return item
      }).filter(item => item.quantity > 0)
    })
  }

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  const handlePaymentConfirm = async () => {
    // If user selected MoMo, call the test server to create a personal payment and show modal
    if (paymentMethod === 'momo') {
      try {
        console.log('🔵 Starting MoMo payment...')
        const amount = getTotalAmount()
        const orderInfo = `Thanh toan don hang - ${new Date().toLocaleString()}`

        console.log('🔵 Calling API with:', { amount, orderInfo, items: cart })
        const resp = await momoPaymentService.createPersonalPayment({ amount, orderInfo, items: cart })
        
        console.log('🔵 API Response:', resp)

        // The test server returns { success: true, data: { momoLink, qrCodeUrl, qrCodeDataURL, orderId } }
        const data = resp?.data

        console.log('🔵 Payment data:', data)

        if (data) {
          // Set payment data and show modal
          const paymentData = {
            orderId: data.orderId,
            amount: amount,
            qrCodeDataURL: data.qrCodeDataURL,
            momoLink: data.momoLink,
            payUrl: data.payUrl || data.qrCodeUrl,
            description: orderInfo
          }
          console.log('🔵 Setting payment data:', paymentData)
          setMomoPaymentData(paymentData)
          setShowMomoModal(true)
          console.log('🔵 Modal should be visible now')
        } else {
          // Fallback: show error or proceed to success
          console.error('❌ No payment data returned')
          alert('Không thể tạo thanh toán MoMo. Vui lòng thử lại.')
        }
      } catch (error) {
        console.error('❌ Momo payment init error:', error)
        const errorMessage = error instanceof Error ? error.message : 'Không thể kết nối đến server thanh toán'
        alert(`Lỗi: ${errorMessage}`)
      }
      return
    }

    // Default QR transfer flow (no external request needed)
    setCurrentStep('success')
    setTimeout(() => {
      setCart([])
      setCurrentStep('menu')
    }, 3000)
  }

  const handleMomoPaymentComplete = () => {
    // Called when payment is completed in modal
    setShowMomoModal(false)
    setCurrentStep('success')
    setTimeout(() => {
      setCart([])
      setCurrentStep('menu')
    }, 3000)
  }

  const handleCloseMomoModal = () => {
    setShowMomoModal(false)
  }

  // TEST FUNCTION - Mở modal trực tiếp để test UI
  const handleTestMomoModal = () => {
    console.log('🧪 TEST: Opening modal directly')
    setMomoPaymentData({
      orderId: 'TEST_ORDER_123',
      amount: getTotalAmount(),
      qrCodeDataURL: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      momoLink: 'momo://app?action=transfer&amount=50000',
      payUrl: 'https://test-payment.momo.vn/gw_payment/123',
      description: 'TEST - Thanh toán đơn hàng'
    })
    setShowMomoModal(true)
    console.log('🧪 TEST: Modal state set to true')
  }

  return (
    <div className="flex h-full flex-col gap-6 bg-gradient-to-br from-slate-50 to-gray-100 px-6 py-8 text-gray-900">
      {/* Header */}
      <header className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/5 to-slate-800/5 rounded-2xl blur-xl"></div>
        <div className="relative bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {currentStep !== 'menu' && (
                <button
                  onClick={() => {
                    if (currentStep === 'cart') setCurrentStep('menu')
                    else if (currentStep === 'payment') setCurrentStep('cart')
                  }}
                  className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-slate-600 bg-clip-text text-transparent">
                  {currentStep === 'menu' && 'Thực đơn'}
                  {currentStep === 'cart' && 'Giỏ hàng'}
                  {currentStep === 'payment' && 'Thanh toán'}
                  {currentStep === 'success' && 'Đặt hàng thành công'}
                </h1>
                <p className="text-sm text-gray-600 mt-2">
                  {currentStep === 'menu' && 'Chọn món ăn yêu thích'}
                  {currentStep === 'cart' && 'Kiểm tra đơn hàng của bạn'}
                  {currentStep === 'payment' && 'Chọn phương thức thanh toán'}
                  {currentStep === 'success' && 'Cảm ơn bạn đã đặt hàng'}
                </p>
              </div>
            </div>
            
            {/* Cart Button */}
            {currentStep === 'menu' && cart.length > 0 && (
              <div className="flex items-center gap-2">
                {/* TEST Button - Remove in production */}
                {process.env.NODE_ENV === 'development' && (
                  <button
                    onClick={handleTestMomoModal}
                    className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                    title="Test MoMo Modal"
                  >
                    🧪 Test MoMo
                  </button>
                )}
                <button
                  onClick={() => setCurrentStep('cart')}
                  className="relative bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    <span>Giỏ hàng</span>
                    <span className="bg-white/20 rounded-full px-2 py-1 text-xs">
                      {getTotalItems()}
                    </span>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Menu Step */}
        {currentStep === 'menu' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PRODUCT_ITEMS.map((product) => (
              <div key={product.id} className="glass-card rounded-2xl overflow-hidden shadow-lg tracking-card">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-32 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-green-600">{formatCurrency(product.price)}</span>
                    <button
                      onClick={() => addToCart(product)}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-lg text-sm font-medium hover:shadow-md transition-all duration-200"
                    >
                      Thêm
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Cart Step */}
        {currentStep === 'cart' && (
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="glass-card rounded-2xl p-4 shadow-lg tracking-card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600">{formatCurrency(item.price)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-semibold min-w-[2rem] text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <span className="font-bold text-green-600 ml-2">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Total */}
            <div className="glass-card rounded-2xl p-4 shadow-lg">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Tổng cộng:</span>
                <span className="text-green-600">{formatCurrency(getTotalAmount())}</span>
              </div>
            </div>
            
            {/* Proceed to Payment */}
            <button
              onClick={() => setCurrentStep('payment')}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Tiến hành thanh toán
            </button>
          </div>
        )}

        {/* Payment Step */}
        {currentStep === 'payment' && (
          <PaymentSection
            totalAmount={getTotalAmount()}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            onPaymentConfirm={handlePaymentConfirm}
          />
        )}

        {/* Success Step */}
        {currentStep === 'success' && (
          <div className="flex items-center justify-center h-full">
            <div className="glass-card rounded-2xl p-8 text-center tracking-card max-w-md">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Đặt hàng thành công!</h2>
              <p className="text-gray-600 mb-4">
                Robot sẽ giao hàng đến bàn của bạn trong vòng 15-20 phút
              </p>
              <div className="text-sm text-gray-500">
                Đang chuyển về trang chủ...
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MoMo Payment Modal */}
      {momoPaymentData && (
        <MomoPaymentModal
          isOpen={showMomoModal}
          onClose={handleCloseMomoModal}
          paymentData={momoPaymentData}
          cartItems={cart}
          onPaymentComplete={handleMomoPaymentComplete}
        />
      )}
    </div>
  )
}

export default OrderSection