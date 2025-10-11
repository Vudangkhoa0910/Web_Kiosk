import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Plus, Minus, X } from 'lucide-react'
import { useKioskStore } from '../../stores/kioskStore'

interface FoodItem {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  popular?: boolean
  available?: boolean
  rating?: number
}

const mockFoodData: FoodItem[] = [
  {
    id: '2',
    name: 'Bún Chả Hà Nội',
    description: 'Bún chả đặc sản Hà Nội với chả nướng thơm phức và nước mắm chua ngọt',
    price: 55000,
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&h=200&fit=crop',
    category: 'món-chính',
    popular: true,
    available: true,
    rating: 4.7
  },
  {
    id: '3',
    name: 'Chả Cá Thăng Long',
    description: 'Chả cá nướng với thì là, hành tươi và bánh tráng',
    price: 75000,
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=300&h=200&fit=crop',
    category: 'món-chính',
    available: true,
    rating: 4.6
  },
  {
    id: '4',
    name: 'Bánh Mì Thịt Nướng',
    description: 'Bánh mì giòn với thịt nướng, pate và rau sống',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=300&h=200&fit=crop',
    category: 'món-nhẹ',
    popular: true,
    available: true,
    rating: 4.5
  },
  {
    id: '5',
    name: 'Cà Phê Sữa',
    description: 'Cà phê phin truyền thống với sữa đặc ngọt',
    price: 20000,
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300&h=200&fit=crop',
    category: 'đồ-uống',
    available: true,
    rating: 4.4
  },
  {
    id: '6',
    name: 'Trà Đá',
    description: 'Trà đá mát lạnh, giải khát tuyệt vời',
    price: 10000,
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300&h=200&fit=crop',
    category: 'đồ-uống',
    available: true,
    rating: 4.0
  },
  {
    id: '7',
    name: 'Nước Chanh',
    description: 'Nước chanh tươi mát, vị chua ngọt thanh mát',
    price: 15000,
    image: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=300&h=200&fit=crop',
    category: 'đồ-uống',
    available: true,
    rating: 4.3
  },
  {
    id: '8',
    name: 'Bánh Flan',
    description: 'Bánh flan mềm mịn với lớp caramel thơm ngon',
    price: 18000,
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=300&h=200&fit=crop',
    category: 'tráng-miệng',
    available: false,
    rating: 4.2
  }
]

const categories = [
  { id: 'tất-cả', name: 'Tất cả' },
  { id: 'món-chính', name: 'Món chính' },
  { id: 'món-nhẹ', name: 'Món nhẹ' },
  { id: 'đồ-uống', name: 'Đồ uống' },
  { id: 'tráng-miệng', name: 'Tráng miệng' }
]

export const KioskMenuSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('tất-cả')
  const [searchQuery, setSearchQuery] = useState('')
  const [showCheckout, setShowCheckout] = useState(false)
  const [customerInfo, setCustomerInfo] = useState({
    phone: '',
    location: '',
    notes: ''
  })
  
  const { 
    addToCart, 
    updateCartItemQuantity, 
    clearCart, 
    cartItems, 
    cartTotal, 
    cartItemCount,
    cartSubtotal,
    deliveryFee 
  } = useKioskStore()

  const filteredItems = mockFoodData.filter(item => {
    const matchesCategory = selectedCategory === 'tất-cả' || item.category === selectedCategory
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesCategory && matchesSearch && item.available
  })

  const handleAddToCart = (item: FoodItem, quantity: number = 1) => {
    const menuItem = {
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      image: item.image,
      category: item.category,
      available: item.available || true
    }
    addToCart(menuItem, quantity)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  return (
    <>
      {/* Background đơn sắc */}
      <div className="fixed inset-0 bg-gray-50">
        <div className="absolute inset-0 bg-gray-100/35" />
        <div className="absolute inset-0 bg-gray-50/25" />
        <div className="absolute inset-0 bg-gray-100/18" />
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_25%_25%,rgba(100,100,100,0.18)_1.5px,transparent_1.5px),radial-gradient(circle_at_75%_75%,rgba(180,180,180,0.18)_1px,transparent_1px)] bg-[length:42px_42px,28px_28px]" />
        <div className="absolute inset-0 opacity-[0.01] bg-[linear-gradient(90deg,rgba(100,100,100,0.12)_1px,transparent_1px),linear-gradient(rgba(100,100,100,0.12)_1px,transparent_1px)] bg-[length:26px_26px]" />
      </div>

      <div className="relative z-10 min-h-screen">
        {/* Header compact */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200"
        >
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex items-center gap-4"
              >
                <div className="w-12 h-12 bg-white/90 backdrop-blur-xl rounded-xl border border-gray-200 flex items-center justify-center shadow-lg">
                  <img 
                    src="/images/Bulldog/2.png" 
                    alt="Robot assistant" 
                    className="w-8 h-8 object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
                <h1 className="text-xl font-bold text-gray-900">
                  Menu đặt hàng
                </h1>
              </motion.div>

              {/* Simple Checkout Button */}
              <div className="flex gap-2">
                {cartItemCount > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowCheckout(true)}
                    className="bg-gray-900 text-white px-4 py-2 rounded-2xl font-semibold text-sm shadow-lg border border-gray-700 backdrop-blur-sm"
                  >
                    Đặt hàng ({formatCurrency(cartTotal)})
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content - optimized for single screen */}
        <div className="pt-16 pb-4 px-4 h-screen overflow-hidden">
          <motion.div 
            className="max-w-7xl mx-auto h-full flex flex-col"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {/* Search Panel compact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mb-3"
            >
              <div className="rounded-2xl border border-gray-200 bg-white shadow-lg backdrop-blur-3xl p-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm món ăn..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 rounded-xl border border-gray-200 bg-white backdrop-blur-xl text-sm focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 shadow-lg"
                  />
                </div>
              </div>
            </motion.div>

            {/* Categories compact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="mb-3"
            >
              <div className="flex flex-wrap gap-2 justify-center">
                {categories.map(category => (
                  <motion.button
                    key={category.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-3 py-1 rounded-xl font-semibold text-sm transition-all duration-300 border ${
                      selectedCategory === category.id
                        ? 'border-transparent bg-gray-900 text-white shadow-lg'
                        : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50 shadow-lg backdrop-blur-xl'
                    }`}
                  >
                    {category.name}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Food Items Grid - fill remaining space */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="flex-1 overflow-y-auto"
            >
              <AnimatePresence mode="popLayout">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 pb-4">
                  {filteredItems.map(item => {
                    return (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        whileHover={{ y: -2 }}
                        className={`rounded-2xl border border-gray-200 bg-white shadow-lg backdrop-blur-3xl overflow-hidden transition-all duration-300 ${
                          !item.available ? 'opacity-50' : ''
                        }`}
                      >
                        {/* Image compact */}
                        <div className="relative h-24 bg-gray-100">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = '/images/default-food.jpg'
                            }}
                          />
                          
                          {/* Popular Badge compact */}
                          {item.popular && (
                            <div className="absolute top-1 left-1 bg-gray-900/80 text-white px-2 py-1 rounded-xl text-xs font-semibold backdrop-blur-sm border border-gray-700">
                              Hot
                            </div>
                          )}
                        </div>

                        {/* Content compact */}
                        <div className="p-3">
                          <h3 className="text-sm font-bold text-gray-800 line-clamp-1 mb-1">
                            {item.name}
                          </h3>
                          
                          <p className="text-gray-600 text-xs mb-2 line-clamp-1">
                            {item.description}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-gray-900">
                              {formatCurrency(item.price)}
                            </span>
                            
                            {item.available && (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleAddToCart(item)}
                                className="bg-gray-900 text-white px-2 py-1 rounded-xl font-semibold transition-all duration-300 flex items-center gap-1 shadow-lg border border-gray-700 backdrop-blur-sm text-xs"
                              >
                                <Plus className="w-3 h-3" />
                                Thêm
                              </motion.button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </AnimatePresence>

              {/* No Results compact */}
              {filteredItems.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-8"
                >
                  <div className="rounded-2xl border border-gray-200 bg-white shadow-lg backdrop-blur-3xl p-8">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                      Không tìm thấy món ăn
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Thử thay đổi từ khóa tìm kiếm hoặc danh mục
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Checkout Modal - Linear Flow */}
      <AnimatePresence>
        {showCheckout && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setShowCheckout(false)}
            />
            
            {/* Checkout Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white/95 backdrop-blur-xl border border-gray-200 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Xác nhận đặt hàng</h2>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowCheckout(false)}
                      className="p-2 rounded-full hover:bg-gray-100"
                    >
                      <X className="w-5 h-5" />
                    </motion.button>
                  </div>

                  {/* Order Summary */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Đơn hàng của bạn</h3>
                    <div className="space-y-2 mb-4">
                      {cartItems.map(item => (
                        <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                          <div className="flex items-center gap-3">
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="w-12 h-12 rounded-xl object-cover"
                            />
                            <div>
                              <h4 className="font-medium text-gray-900 text-sm">{item.name}</h4>
                              <p className="text-gray-600 text-xs">{formatCurrency(item.price)} x {item.quantity}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                              className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center"
                            >
                              <Minus className="w-3 h-3" />
                            </motion.button>
                            <span className="w-6 text-center font-semibold text-sm">{item.quantity}</span>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                              className="w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center"
                            >
                              <Plus className="w-3 h-3" />
                            </motion.button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Total */}
                    <div className="rounded-xl border border-gray-200 bg-white shadow-lg backdrop-blur-3xl p-4">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Tạm tính:</span>
                          <span>{formatCurrency(cartSubtotal)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Phí giao hàng:</span>
                          <span>{deliveryFee === 0 ? 'Miễn phí' : formatCurrency(deliveryFee)}</span>
                        </div>
                        <div className="border-t border-gray-200 pt-2">
                          <div className="flex justify-between font-bold text-lg">
                            <span>Tổng cộng:</span>
                            <span className="text-gray-900">{formatCurrency(cartTotal)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Thông tin giao hàng</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Số điện thoại *
                        </label>
                        <input
                          type="tel"
                          value={customerInfo.phone}
                          onChange={(e) => setCustomerInfo(prev => ({...prev, phone: e.target.value}))}
                          placeholder="Nhập số điện thoại"
                          className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white backdrop-blur-xl text-sm focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 shadow-lg"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Địa chỉ giao hàng *
                        </label>
                        <input
                          type="text"
                          value={customerInfo.location}
                          onChange={(e) => setCustomerInfo(prev => ({...prev, location: e.target.value}))}
                          placeholder="Ví dụ: Bàn số 5, Tầng 2"
                          className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white backdrop-blur-xl text-sm focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 shadow-lg"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Ghi chú thêm (tùy chọn)
                        </label>
                        <textarea
                          value={customerInfo.notes}
                          onChange={(e) => setCustomerInfo(prev => ({...prev, notes: e.target.value}))}
                          placeholder="Yêu cầu đặc biệt, không cay, ít đường..."
                          rows={3}
                          className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white backdrop-blur-xl text-sm focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 shadow-lg resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        // Implement order placement logic
                        if (!customerInfo.phone || !customerInfo.location) {
                          alert('Vui lòng nhập số điện thoại và địa chỉ giao hàng')
                          return
                        }
                        console.log('Order placed:', { cartItems, customerInfo, total: cartTotal })
                        clearCart()
                        setShowCheckout(false)
                        setCustomerInfo({ phone: '', location: '', notes: '' })
                        alert('Đặt hàng thành công! Chúng tôi sẽ liên hệ bạn sớm nhất.')
                      }}
                      disabled={!customerInfo.phone || !customerInfo.location}
                      className="w-full bg-gray-900 text-white py-3 rounded-2xl font-semibold text-sm shadow-lg border border-gray-700 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Xác nhận đặt hàng • {formatCurrency(cartTotal)}
                    </motion.button>
                    
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowCheckout(false)}
                        className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-2xl font-semibold hover:bg-gray-50 text-sm"
                      >
                        Tiếp tục chọn món
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          clearCart()
                          setShowCheckout(false)
                        }}
                        className="flex-1 border border-red-300 text-red-600 py-2 rounded-2xl font-semibold hover:bg-red-50 text-sm"
                      >
                        Xóa đơn hàng
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}