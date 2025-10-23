/**
 * Test Order Page
 * Trang test tính năng tạo đơn hàng với Alpha Asimov API
 * 
 * Real Coordinates:
 * - Kiosk (Recipient): 20.959499, 105.746919
 * - Store (Sender): 20.959821, 105.746376
 */

import { useState } from 'react'
import { useKioskStore } from '../stores/kioskStore'
import { STORES, KIOSKS, DEFAULT_KIOSK, DEFAULT_STORE, kioskOrderService } from '../services/kioskOrderService'

export default function TestOrderPage() {
  const {
    cartItems,
    cartTotal,
    cartSubtotal,
    deliveryFee,
    addToCart,
    clearCart,
    createOrder,
    currentOrder,
    isLoading,
    error
  } = useKioskStore()

  const [customerInfo, setCustomerInfo] = useState({
    name: 'Test Customer',
    phone: '0901234567',
    email: 'test@example.com',
    location: 'Kiosk Tầng 1',
    notes: 'Test order from Web Kiosk'
  })

  const [robotStatus, setRobotStatus] = useState<{
    checking: boolean;
    available: boolean | null;
    message: string;
    robotCount?: number;
  }>({
    checking: false,
    available: null,
    message: ''
  })

  // Check robot availability
  const handleCheckRobot = async () => {
    setRobotStatus({ checking: true, available: null, message: 'Đang kiểm tra...' })
    
    const result = await kioskOrderService.checkRobotAvailability({
      fromCoordinates: DEFAULT_STORE.coordinates,
      toCoordinates: DEFAULT_KIOSK.coordinates
    })
    
    setRobotStatus({
      checking: false,
      available: result.available,
      message: result.message,
      robotCount: result.robotCount
    })
  }

  // Mock menu items for testing
  const mockMenuItems = [
    {
      id: '1',
      name: 'Burger Bò',
      description: 'Burger bò nướng + khoai tây chiên',
      price: 89000,
      image: '/images/food/burger.jpg',
      category: 'main',
      available: true
    },
    {
      id: '2',
      name: 'Combo Gà Rán',
      description: '3 miếng gà giòn + coca',
      price: 75000,
      image: '/images/food/chicken.jpg',
      category: 'main',
      available: true
    },
    {
      id: '3',
      name: 'Phở Bò',
      description: 'Phở bò tái nạm truyền thống',
      price: 65000,
      image: '/images/food/pho.jpg',
      category: 'main',
      available: true
    }
  ]

  const handleAddToCart = (item: typeof mockMenuItems[0]) => {
    addToCart(item, 1)
  }

  const handleCreateOrder = async () => {
    try {
      const orderId = await createOrder(customerInfo, 'qr')
      console.log('✅ Order created:', orderId)
      alert(`Order created successfully!\nOrder ID: ${orderId}`)
    } catch (err) {
      console.error('❌ Error creating order:', err)
      alert(`Failed to create order: ${err}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Test Order API Integration</h1>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-blue-900 font-semibold mb-2">🚀 Real Coordinates in Use:</p>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="font-bold text-green-700">📍 Kiosk (Recipient):</p>
                <p className="font-mono text-gray-700">20.959499, 105.746919</p>
              </div>
              <div>
                <p className="font-bold text-blue-700">📍 Store (Sender):</p>
                <p className="font-mono text-gray-700">20.959821, 105.746376</p>
              </div>
            </div>
          </div>

          {/* Robot Status Check */}
          <div className="bg-white border border-gray-300 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-gray-900">🤖 Robot Availability Check</h2>
              <button
                onClick={handleCheckRobot}
                disabled={robotStatus.checking}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  robotStatus.checking
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {robotStatus.checking ? 'Đang kiểm tra...' : 'Kiểm tra Robot'}
              </button>
            </div>
            
            {robotStatus.message && (
              <div className={`p-3 rounded-lg border ${
                robotStatus.available === true
                  ? 'bg-green-50 border-green-300'
                  : robotStatus.available === false
                  ? 'bg-red-50 border-red-300'
                  : 'bg-yellow-50 border-yellow-300'
              }`}>
                <div className="flex items-start gap-2">
                  <span className="text-lg">
                    {robotStatus.available === true ? '✅' : robotStatus.available === false ? '❌' : '⚠️'}
                  </span>
                  <div>
                    <p className={`font-semibold ${
                      robotStatus.available === true
                        ? 'text-green-800'
                        : robotStatus.available === false
                        ? 'text-red-800'
                        : 'text-yellow-800'
                    }`}>
                      {robotStatus.message}
                    </p>
                    {robotStatus.robotCount !== undefined && (
                      <p className="text-sm text-gray-600 mt-1">
                        Số robot khả dụng: <strong>{robotStatus.robotCount}</strong>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Error Display - Enhanced with Error Type */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <div className="flex items-start gap-2">
              <span className="text-xl">❌</span>
              <div className="flex-1">
                <strong className="font-bold block mb-1">Error:</strong>
                <p className="text-sm">{error}</p>
                
                {/* Error Type Hints */}
                {error.includes('robot') && (
                  <div className="mt-2 p-2 bg-red-50 rounded border border-red-300">
                    <p className="text-xs font-semibold">💡 Gợi ý:</p>
                    <ul className="text-xs mt-1 space-y-1">
                      <li>• Kiểm tra xem có robot online trong hệ thống</li>
                      <li>• Verify tọa độ có nằm trong map không</li>
                      <li>• Liên hệ admin để được hỗ trợ</li>
                    </ul>
                  </div>
                )}
                
                {error.includes('Token') && (
                  <div className="mt-2 p-2 bg-red-50 rounded border border-red-300">
                    <p className="text-xs font-semibold">💡 Gợi ý:</p>
                    <ul className="text-xs mt-1 space-y-1">
                      <li>• Token đã hết hạn (~2 hours)</li>
                      <li>• Update token mới trong localStorage</li>
                      <li>• Hoặc login lại để lấy token</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Current Order Display */}
        {currentOrder && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            <strong className="font-bold">Order Created! </strong>
            <div className="mt-2">
              <p>Order ID: {currentOrder.id}</p>
              <p>Robot ID: {currentOrder.robotId || 'N/A'}</p>
              <p>Estimated Time: {currentOrder.estimatedDeliveryTime} minutes</p>
              <p>Status: {currentOrder.status}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-8">
          {/* Left: Menu Items */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">Menu Items</h2>
            <div className="space-y-4">
              {mockMenuItems.map((item) => (
                <div key={item.id} className="border rounded p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold">{item.name}</h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                    <p className="text-lg font-bold text-blue-600 mt-2">
                      {item.price.toLocaleString('vi-VN')} ₫
                    </p>
                  </div>
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Cart & Order Form */}
          <div className="space-y-6">
            {/* Cart */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Cart</h2>
                <button
                  onClick={clearCart}
                  className="text-red-500 hover:text-red-700"
                >
                  Clear Cart
                </button>
              </div>
              
              {cartItems.length === 0 ? (
                <p className="text-gray-500">Cart is empty</p>
              ) : (
                <>
                  <div className="space-y-2 mb-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex justify-between">
                        <span>{item.name} x{item.quantity}</span>
                        <span>{(item.price * item.quantity).toLocaleString('vi-VN')} ₫</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>{cartSubtotal.toLocaleString('vi-VN')} ₫</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Fee:</span>
                      <span>{deliveryFee.toLocaleString('vi-VN')} ₫</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span>{cartTotal.toLocaleString('vi-VN')} ₫</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Customer Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-4">Customer Info</h2>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Name"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                />
                <textarea
                  placeholder="Notes"
                  value={customerInfo.notes}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, notes: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                  rows={3}
                />
              </div>
            </div>

            {/* Locations Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-4">📍 Delivery Locations (Real Coordinates)</h2>
              
              {/* Kiosk - Recipient */}
              <div className="mb-4">
                <h3 className="font-bold text-lg text-green-700 mb-2">🎯 Kiosk (Điểm Nhận Hàng)</h3>
                <div className="space-y-2">
                  {KIOSKS.map((kiosk) => (
                    <div key={kiosk.id} className="border-2 border-green-300 bg-green-50 rounded-lg p-3">
                      <p className="font-bold text-green-900">{kiosk.name}</p>
                      <p className="text-sm text-gray-700">{kiosk.address}</p>
                      <p className="text-sm font-mono text-green-700 mt-1">
                        📍 Lat: {kiosk.coordinates.latitude}, Lng: {kiosk.coordinates.longitude}
                      </p>
                      {kiosk.id === DEFAULT_KIOSK.id && (
                        <span className="text-xs px-2 py-1 rounded bg-green-600 text-white mt-2 inline-block">
                          ⭐ Default Kiosk
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Store - Sender */}
              <div>
                <h3 className="font-bold text-lg text-blue-700 mb-2">🏪 Stores (Điểm Lấy Hàng - Nơi Đặt Đồ)</h3>
                <div className="space-y-2">
                  {STORES.map((store) => (
                    <div key={store.id} className="border-2 border-blue-300 bg-blue-50 rounded-lg p-3">
                      <p className="font-bold text-blue-900">{store.name}</p>
                      <p className="text-sm text-gray-700">{store.address}</p>
                      <p className="text-sm font-mono text-blue-700 mt-1">
                        📍 Lat: {store.coordinates.latitude}, Lng: {store.coordinates.longitude}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">📞 {store.phone}</p>
                      <div className="flex gap-2 mt-2">
                        <span className={`text-xs px-2 py-1 rounded ${store.isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {store.isOpen ? '✅ Open' : '❌ Closed'}
                        </span>
                        {store.id === DEFAULT_STORE.id && (
                          <span className="text-xs px-2 py-1 rounded bg-blue-600 text-white">
                            ⭐ Default Store
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Distance Info */}
              <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>📏 Route:</strong> Store → Kiosk
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Robot sẽ lấy hàng từ Store và giao đến Kiosk
                </p>
              </div>
            </div>

            {/* Create Order Button */}
            <button
              onClick={handleCreateOrder}
              disabled={cartItems.length === 0 || isLoading}
              className={`w-full py-4 rounded-lg font-bold text-white transition ${
                cartItems.length === 0 || isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-500 hover:bg-green-600'
              }`}
            >
              {isLoading ? 'Creating Order...' : 'Create Order (Test API)'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
