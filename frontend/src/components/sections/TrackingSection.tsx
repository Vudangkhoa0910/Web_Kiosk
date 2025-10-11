import React from 'react'
import { Timer } from 'lucide-react'
import DeliveryMap from '../ui/DeliveryMap'
import '../../styles/tracking.css'

interface TrackingSectionProps {
  onBackToHome?: () => void
}

const TrackingSection: React.FC<TrackingSectionProps> = ({ onBackToHome }) => {
  return (
    <div className="flex h-full flex-col gap-4 bg-gradient-to-br from-slate-50 to-gray-100 px-3 py-4 sm:px-4 sm:py-6 lg:px-6 lg:py-8 text-gray-900">
      {/* Header với gradient và shadow */}
      <header className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/5 to-slate-800/5 rounded-xl blur-xl"></div>
        <div className="relative bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl p-4 sm:p-6 shadow-lg">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-800 to-slate-600 bg-clip-text text-transparent">
            Theo dõi robot giao hàng
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-2">
            Xem lộ trình robot, thời gian dự kiến đến nơi và hướng dẫn nhận hàng an toàn.
          </p>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 lg:grid lg:grid-cols-3 lg:gap-6">
        {/* Sidebar thông tin */}
        <section className="flex flex-col gap-3 lg:gap-4">
          {/* Trạng thái chính */}
          <div className="glass-card rounded-xl p-4 sm:p-6 shadow-lg tracking-card">
            <div className="flex items-center gap-3 mb-3 sm:mb-4">
              <div className="relative">
                <div className="w-3 h-3 bg-green-500 rounded-full pulse-gentle"></div>
                <div className="absolute inset-0 w-3 h-3 bg-green-400 rounded-full animate-ping opacity-30"></div>
              </div>
              <h2 className="text-base sm:text-lg font-semibold gradient-text">Đang giao hàng</h2>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50 rounded-xl p-3 sm:p-4 tracking-card">
              <div className="flex items-center gap-3">
                <Timer className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                <div>
                  <p className="font-bold text-lg sm:text-xl text-green-800">12 phút</p>
                  <p className="text-xs sm:text-sm text-green-600">Thời gian dự kiến</p>
                </div>
              </div>
            </div>
          </div>

          {/* Chi tiết đơn hàng */}
                    {/* Chi tiết đơn hàng */}
          <div className="bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm border border-gray-200/50 rounded-xl p-4 sm:p-6 shadow-lg">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Thông tin giao hàng</h3>
            <div className="space-y-2 sm:space-y-3">
              <div className="p-3 rounded-xl bg-gray-50/80 border border-gray-200/30">
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 text-xs sm:text-sm">Điểm giao hàng</p>
                  <p className="text-xs text-gray-600">Kiosk A1 - Sảnh chính khu thương mại</p>
                </div>
              </div>
            </div>
          </div>

          {/* Nút quay lại */}
          {onBackToHome && (
            <button
              onClick={onBackToHome}
              className="bg-gradient-to-r from-gray-100 to-slate-100 hover:from-gray-200 hover:to-slate-200 border border-gray-300/50 rounded-xl px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm font-semibold text-gray-700 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              ← Quay lại trang chủ
            </button>
          )}
        </section>

        {/* Map section */}
        <section className="flex-1 lg:col-span-2">
          <div className="glass-card rounded-xl shadow-lg overflow-hidden h-full tracking-card flex flex-col">
            <div className="border-b border-gray-200/50 px-4 py-3 sm:px-6 sm:py-4 bg-gradient-to-r from-white/95 to-gray-50/95">
              <div>
                <h2 className="text-base sm:text-lg font-semibold gradient-text">Bản đồ hành trình</h2>
                <p className="text-xs text-gray-600">Theo dõi robot di chuyển trực tiếp trên OpenStreetMap</p>
              </div>
            </div>
            <div className="flex-1 min-h-[300px] h-[400px] sm:h-[500px] lg:h-[600px]">
              <DeliveryMap className="h-full w-full" />
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default TrackingSection
