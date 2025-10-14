import React, { useState } from 'react'
import { Timer, CheckCircle2, Package, TruckIcon, MapPin, ShoppingBag, Smartphone, MessageSquare } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DeliveryMap from '../ui/DeliveryMap'
import { useKioskStore } from '../../stores/kioskStore'
import '../../styles/tracking.css'

// Delivery stages for timeline
type DeliveryStage = 
  | 'preparing'      // Đang chuẩn bị đơn hàng
  | 'robot_assigned' // Robot nhận đơn
  | 'picking_up'     // Đang lấy hàng
  | 'at_pickup'      // Đến điểm lấy hàng
  | 'picked_up'      // Đã lấy hàng
  | 'delivering'     // Đang giao hàng
  | 'at_delivery'    // Đến điểm giao hàng
  | 'delivered'      // Đã giao hàng

interface DeliveryStageItemProps {
  icon: React.ReactNode
  title: string
  description: string
  isCompleted: boolean
  isActive: boolean
}

const DeliveryStageItem: React.FC<DeliveryStageItemProps> = ({
  icon,
  title,
  description,
  isCompleted,
  isActive
}) => {
  return (
    <div className="flex gap-3">
      {/* Icon & Line */}
      <div className="flex flex-col items-center">
        {/* Icon Circle */}
        <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
          isCompleted 
            ? 'bg-gray-800 text-white' 
            : isActive 
            ? 'bg-gray-700 text-white ring-2 ring-gray-300' 
            : 'bg-gray-200 text-gray-500'
        }`}>
          {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : icon}
        </div>
        
        {/* Connecting Line */}
        <div className={`w-0.5 flex-1 min-h-[16px] transition-all duration-300 ${
          isCompleted ? 'bg-gray-800' : 'bg-gray-300'
        }`} />
      </div>

      {/* Content */}
      <div className="flex-1 pb-3">
        <h4 className={`text-sm font-semibold leading-tight transition-colors duration-300 ${
          isActive || isCompleted ? 'text-gray-900' : 'text-gray-500'
        }`}>
          {title}
        </h4>
        <p className={`text-sm mt-1 leading-tight transition-colors duration-300 ${
          isActive || isCompleted ? 'text-gray-600' : 'text-gray-400'
        }`}>
          {description}
        </p>
        
        {/* Active indicator */}
        {isActive && (
          <div className="flex items-center gap-2 mt-1.5">
            <div className="w-2 h-2 bg-gray-700 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700">Đang xử lý</span>
          </div>
        )}
      </div>
    </div>
  )
}

interface TrackingSectionProps {
  onBackToHome?: () => void
}

const TrackingSection: React.FC<TrackingSectionProps> = () => {
  const navigate = useNavigate()
  const { currentOrder, completeOrder } = useKioskStore()
  const [isCompleting, setIsCompleting] = useState(false)
  
  // Simulate delivery stage - auto progress for demo
  const [currentStage, setCurrentStage] = useState<DeliveryStage>('preparing')

  // Auto progress through stages for demo (3-5 seconds per stage)
  React.useEffect(() => {
    const stages: DeliveryStage[] = [
      'preparing',
      'robot_assigned',
      'picking_up',
      'at_pickup',
      'picked_up',
      'delivering',
      'at_delivery'
    ]
    
    const currentIndex = stages.indexOf(currentStage)
    
    // Don't auto-progress if at delivery or delivered
    if (currentStage === 'at_delivery' || currentStage === 'delivered') {
      return
    }
    
    // Progress to next stage after random 3-5 seconds
    const delay = Math.random() * 2000 + 3000 // 3000-5000ms
    const timer = setTimeout(() => {
      if (currentIndex < stages.length - 1) {
        setCurrentStage(stages[currentIndex + 1])
      }
    }, delay)
    
    return () => clearTimeout(timer)
  }, [currentStage])

  const handleCompleteOrder = () => {
    if (!currentOrder) return
    
    setIsCompleting(true)
    
    // Simulate completion - mark as delivered but stay on page
    setTimeout(() => {
      completeOrder(currentOrder.id)
      setCurrentStage('delivered')
      setIsCompleting(false)
    }, 1000)
  }

  // Check if order is in deliverable state (robot has arrived)
  const canComplete = currentStage === 'at_delivery'
  const isDelivered = currentStage === 'delivered'
  const [countdown, setCountdown] = React.useState(3)

  // Auto redirect to home after order is delivered (after 3 seconds with countdown)
  React.useEffect(() => {
    if (isDelivered) {
      // Countdown timer
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      
      // Redirect timer
      const redirectTimer = setTimeout(() => {
        navigate('/')
      }, 3000)
      
      return () => {
        clearInterval(countdownInterval)
        clearTimeout(redirectTimer)
      }
    } else {
      // Reset countdown when not delivered
      setCountdown(3)
    }
  }, [isDelivered, navigate])

  // Get stage display info
  const getStageInfo = (stage: DeliveryStage) => {
    const stageMap: Record<DeliveryStage, { title: string; color: string }> = {
      preparing: { title: 'Đang chuẩn bị', color: 'gray' },
      robot_assigned: { title: 'Robot đã nhận đơn', color: 'gray' },
      picking_up: { title: 'Đang lấy hàng', color: 'gray' },
      at_pickup: { title: 'Đến điểm lấy hàng', color: 'gray' },
      picked_up: { title: 'Đã lấy hàng', color: 'gray' },
      delivering: { title: 'Đang giao hàng', color: 'gray' },
      at_delivery: { title: 'Đến điểm giao hàng', color: 'gray' },
      delivered: { title: 'Hoàn thành', color: 'gray' },
    }
    return stageMap[stage]
  }

  const currentStageInfo = getStageInfo(currentStage)
  const [showBackDialog, setShowBackDialog] = React.useState(false)

  // Prevent body scroll when dialog is open
  React.useEffect(() => {
    if (showBackDialog) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [showBackDialog])

  const handleBackToHome = () => {
    if (currentStage === 'delivered') {
      // Order completed, go back directly
      navigate('/')
    } else {
      // Order not completed, show warning dialog
      setShowBackDialog(true)
    }
  }

  return (
    <>
      {/* CSS for dialog animation */}
      <style>{`
        @keyframes fadeInZoom {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
      
      <div className="h-screen flex flex-col bg-white text-gray-900 overflow-hidden">
      {/* Compact Header */}
      <header className="flex-shrink-0 bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Back Button */}
            <button
              onClick={handleBackToHome}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200 text-gray-700 hover:text-gray-900"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="font-medium">Trang chủ</span>
            </button>
            
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-gray-900 truncate">
                Theo dõi robot giao hàng
              </h1>
              <p className="text-sm text-gray-600 truncate mt-1">
                Xem lộ trình robot và thông tin đơn hàng
              </p>
            </div>
          </div>
          
          {/* Order ID Badge */}
          {currentOrder && (
            <div className="ml-4 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap">
              #{currentOrder.id.slice(-6)}
            </div>
          )}
        </div>
      </header>

      {/* Warning Dialog - Highest z-index to stay on top */}
      {showBackDialog && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
          onClick={(e) => {
            // Close dialog when clicking backdrop
            if (e.target === e.currentTarget) {
              setShowBackDialog(false)
            }
          }}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative z-[10000]"
            style={{ animation: 'fadeInZoom 0.2s ease-out' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Đơn hàng đang giao</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Bạn đang có đơn hàng chưa hoàn thành. Vui lòng đợi robot giao hàng và xác nhận đã nhận hàng trước khi đặt đơn mới.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowBackDialog(false)}
                    className="flex-1 px-4 py-2.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200 shadow-lg"
                  >
                    Tiếp tục theo dõi
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SMS Notification - Show prominently when robot arrives */}
      {currentStage === 'at_delivery' && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[9999] p-4"
          style={{ animation: 'fadeIn 0.3s ease-out' }}
        >
          <div 
            className="bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-3xl shadow-2xl max-w-lg w-full p-8 relative z-[10000] border-4 border-white/10"
            style={{ animation: 'bounceIn 0.5s ease-out' }}
          >
            {/* Animated Smartphone Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl animate-pulse"></div>
                <div className="relative w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl">
                  <Smartphone className="w-12 h-12 text-gray-900 animate-bounce" />
                </div>
                {/* Notification Badge */}
                <div className="absolute -top-1 -right-1 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg animate-ping">
                  <span className="text-white text-xs font-bold">1</span>
                </div>
              </div>
            </div>

            {/* Main Message */}
            <div className="text-center mb-6">
              <h2 className="text-3xl font-black text-white mb-3 tracking-tight">
                Robot đã đến!
              </h2>
              <p className="text-xl font-semibold text-gray-100 mb-4">
                Kiểm tra tin nhắn SMS
              </p>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border-2 border-white/20">
                <p className="text-base text-gray-100 font-medium leading-relaxed">
                  Link mở cốp robot đã được gửi đến số điện thoại của bạn
                </p>
              </div>
            </div>

            {/* Phone Number Display */}
            {currentOrder && (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6 border border-white/20">
                <div className="flex items-center justify-center gap-3">
                  <MessageSquare className="w-5 h-5 text-gray-200" />
                  <span className="text-lg font-bold text-white tracking-wider">
                    {currentOrder.customerInfo.phone}
                  </span>
                </div>
              </div>
            )}

            {/* Action Button */}
            <button
              onClick={handleCompleteOrder}
              disabled={isCompleting}
              className="w-full py-4 bg-white text-gray-900 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCompleting ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-3 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                  Đang xử lý...
                </span>
              ) : (
                'Đã nhận hàng - Hoàn thành'
              )}
            </button>

            {/* Helper Text */}
            <p className="text-center text-gray-300 text-sm mt-4">
              Nhấn nút trên sau khi đã mở cốp và nhận món ăn
            </p>
          </div>
        </div>
      )}

      {/* Main Content - Two Column Layout 30/70 - No scroll */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[30%_70%] gap-4 p-4 overflow-hidden">
        
        {/* LEFT COLUMN - Timeline & Order Details */}
        <section className="flex flex-col gap-4 overflow-y-auto items-center">
          
          {/* Delivery Timeline - Compact Version */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex-shrink-0 w-full max-w-md">
            <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide text-center">Lộ trình giao hàng</h3>
            
            <div className="space-y-2.5">
              {/* Stage 1: Đang chuẩn bị */}
              <DeliveryStageItem
                icon={<Package className="w-4 h-4" />}
                title="Đang chuẩn bị đơn hàng"
                description="Nhà hàng chuẩn bị món"
                isCompleted={['robot_assigned', 'picking_up', 'at_pickup', 'picked_up', 'delivering', 'at_delivery', 'delivered'].includes(currentStage)}
                isActive={currentStage === 'preparing'}
              />

              {/* Stage 2: Robot nhận đơn */}
              <DeliveryStageItem
                icon={<TruckIcon className="w-4 h-4" />}
                title="Robot nhận đơn"
                description="Robot đã được phân công"
                isCompleted={['picking_up', 'at_pickup', 'picked_up', 'delivering', 'at_delivery', 'delivered'].includes(currentStage)}
                isActive={currentStage === 'robot_assigned'}
              />

              {/* Stage 3: Đang lấy hàng */}
              <DeliveryStageItem
                icon={<MapPin className="w-4 h-4" />}
                title="Đang di chuyển lấy hàng"
                description="Robot đến nhà hàng"
                isCompleted={['at_pickup', 'picked_up', 'delivering', 'at_delivery', 'delivered'].includes(currentStage)}
                isActive={currentStage === 'picking_up'}
              />

              {/* Stage 4: Đến điểm lấy hàng */}
              <DeliveryStageItem
                icon={<ShoppingBag className="w-4 h-4" />}
                title="Đến điểm lấy hàng"
                description="Robot đã đến nhà hàng"
                isCompleted={['picked_up', 'delivering', 'at_delivery', 'delivered'].includes(currentStage)}
                isActive={currentStage === 'at_pickup'}
              />

              {/* Stage 5: Đã lấy hàng */}
              <DeliveryStageItem
                icon={<CheckCircle2 className="w-4 h-4" />}
                title="Đã lấy hàng"
                description="Món ăn trong robot"
                isCompleted={['delivering', 'at_delivery', 'delivered'].includes(currentStage)}
                isActive={currentStage === 'picked_up'}
              />

              {/* Stage 6: Đang giao hàng */}
              <DeliveryStageItem
                icon={<TruckIcon className="w-4 h-4" />}
                title="Đang giao hàng"
                description="Robot đang giao đến bạn"
                isCompleted={['at_delivery', 'delivered'].includes(currentStage)}
                isActive={currentStage === 'delivering'}
              />

              {/* Stage 7: Đến điểm giao hàng */}
              <DeliveryStageItem
                icon={<MapPin className="w-4 h-4" />}
                title="Đến điểm giao hàng"
                description="Robot đã đến nơi"
                isCompleted={currentStage === 'delivered'}
                isActive={currentStage === 'at_delivery'}
              />

              {/* Stage 8: Đã giao hàng */}
              <DeliveryStageItem
                icon={<CheckCircle2 className="w-4 h-4" />}
                title="Hoàn thành"
                description="Giao hàng thành công"
                isCompleted={false}
                isActive={currentStage === 'delivered'}
              />
            </div>
          </div>

          {/* Order Details Card */}
          {currentOrder && (
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-4 shadow-lg flex-shrink-0 w-full max-w-md">
              <div className="flex items-center gap-2.5 mb-3 pb-2.5 border-b border-gray-700">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                  <Smartphone className="w-4.5 h-4.5 text-gray-900" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-white truncate">Thông tin đơn hàng</h3>
                  {currentStage === 'at_delivery' && (
                    <p className="text-xs text-gray-300 truncate">Link mở cốp đã gửi qua SMS</p>
                  )}
                </div>
              </div>
              
              <div className="space-y-2.5">
                {/* Customer Info */}
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2.5 border border-gray-700">
                  <h4 className="text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wide">Khách hàng</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">Tên:</span>
                      <span className="text-xs font-semibold text-white">{currentOrder.customerInfo.location}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">SĐT:</span>
                      <span className="text-xs font-semibold text-white">{currentOrder.customerInfo.phone}</span>
                    </div>
                    {currentOrder.customerInfo.notes && (
                      <div className="pt-1.5 mt-1.5 border-t border-gray-700">
                        <span className="text-xs text-gray-400">Ghi chú: </span>
                        <span className="text-xs text-gray-200">{currentOrder.customerInfo.notes}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Items */}
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2.5 border border-gray-700">
                  <h4 className="text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wide">Món ăn</h4>
                  <div className="space-y-1.5">
                    {currentOrder.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-white truncate">{item.name}</p>
                          <p className="text-xs text-gray-400">x{item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-semibold text-white whitespace-nowrap">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Summary */}
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2.5 border border-gray-700">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">Tạm tính:</span>
                      <span className="text-xs text-gray-200">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentOrder.subtotal)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">Phí ship:</span>
                      <span className="text-xs text-gray-200">
                        {currentOrder.deliveryFee === 0 
                          ? 'Miễn phí' 
                          : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentOrder.deliveryFee)
                        }
                      </span>
                    </div>
                    <div className="pt-1.5 mt-1.5 border-t border-gray-700 flex justify-between items-center">
                      <span className="text-sm font-bold text-white">Tổng:</span>
                      <span className="text-base font-bold text-white">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentOrder.total)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* SMS Note */}
                {currentStage === 'at_delivery' && (
                  <div className="bg-white/5 rounded-lg p-2.5 border border-gray-700">
                    <div className="flex items-start gap-2">
                      <MessageSquare className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-gray-300 leading-relaxed">
                        Kiểm tra SMS để nhận link mở cốp robot
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </section>

        {/* RIGHT COLUMN - Map & Actions */}
        <section className="space-y-3 flex flex-col">
          
          {/* Map Section */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden flex-1 flex flex-col">
            <div className="border-b border-gray-200 px-4 py-2.5 bg-gradient-to-r from-white to-gray-50 flex-shrink-0">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Bản đồ hành trình</h2>
              <p className="text-sm text-gray-600 mt-0.5">Theo dõi robot realtime</p>
            </div>
            <div className="flex-1 min-h-0">
              <DeliveryMap className="h-full w-full" />
            </div>
          </div>

          {/* Delivery Location */}
          <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-lg flex-shrink-0">
            <h3 className="text-xs font-bold text-gray-900 mb-1.5 uppercase tracking-wide">Điểm giao hàng</h3>
            <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-200">
              <p className="font-semibold text-gray-900 text-sm">Kiosk A1</p>
              <p className="text-xs text-gray-600 mt-0.5">Sảnh chính khu thương mại</p>
            </div>
          </div>

          {/* Action Button */}
          {isDelivered ? (
            // Order completed - show success message and auto redirect
            <div className="space-y-3 flex-shrink-0">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-600 rounded-xl p-4 text-center">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <p className="text-base font-bold text-green-900 mb-1">Giao hàng thành công!</p>
                <p className="text-sm text-green-700 mb-2">Cảm ơn bạn đã sử dụng dịch vụ</p>
                <div className="flex items-center justify-center gap-2 text-green-800">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-xs font-medium">
                    Tự động quay về trang chủ sau {countdown} giây...
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate('/')}
                className="w-full rounded-xl px-6 py-4 text-base font-bold transition-all duration-200 shadow-lg flex items-center justify-center gap-2 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Quay về ngay
              </button>
            </div>
          ) : canComplete ? (
            // Robot arrived - show complete button
            <div className="space-y-3 flex-shrink-0">
              {/* Arrival Notice */}
              <div className="bg-gradient-to-r from-gray-50 to-slate-50 border-2 border-gray-800 rounded-xl p-4 text-center">
                <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <p className="text-base font-bold text-gray-900 mb-1">Robot đã đến!</p>
                <p className="text-sm text-gray-600">Nhận hàng và xác nhận hoàn tất</p>
              </div>

              {/* Complete Button */}
              <button
                onClick={handleCompleteOrder}
                disabled={isCompleting}
                className={`w-full rounded-xl px-6 py-4 text-base font-bold transition-all duration-200 shadow-lg flex items-center justify-center gap-2 ${
                  isCompleting
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]'
                }`}
              >
                {isCompleting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Đang xác nhận...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Đã nhận hàng - Hoàn thành
                  </>
                )}
              </button>
            </div>
          ) : (
            // Waiting state
            <div className="bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-300 rounded-xl px-4 py-4 text-center flex-shrink-0">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
                <Timer className="w-5 h-5 text-gray-600" />
              </div>
              <p className="text-sm text-gray-800 font-semibold mb-1">
                {currentStageInfo.title}
              </p>
              <p className="text-sm text-gray-600">Vui lòng chờ...</p>
            </div>
          )}
        </section>
      </div>
    </div>
    </>
  )
}

export default TrackingSection
