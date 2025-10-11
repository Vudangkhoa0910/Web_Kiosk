import React from 'react'
import { CheckCircle, XCircle } from 'lucide-react'
import '../../styles/tracking.css'

interface HistoryOrder {
  id: string
  date: Date
  status: 'delivered' | 'cancelled'
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
  total: number
  deliveryLocation: string
}

const mockOrderHistory: HistoryOrder[] = [
  {
    id: 'ORDER-001234',
    date: new Date(Date.now() - 24 * 60 * 60 * 1000),
    status: 'delivered',
    items: [
      { name: 'Phở Bò Tái', quantity: 1, price: 65000 },
      { name: 'Trà Đá', quantity: 1, price: 10000 }
    ],
    total: 75000,
    deliveryLocation: 'Bàn số 3, Tầng 1'
  },
  {
    id: 'ORDER-001235',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    status: 'delivered',
    items: [
      { name: 'Bún Chả Hà Nội', quantity: 1, price: 55000 },
      { name: 'Chả Cá Thăng Long', quantity: 1, price: 75000 }
    ],
    total: 130000,
    deliveryLocation: 'Bàn số 7, Tầng 2'
  },
  {
    id: 'ORDER-001236',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    status: 'cancelled',
    items: [
      { name: 'Bánh Mì Thịt Nướng', quantity: 2, price: 25000 }
    ],
    total: 50000,
    deliveryLocation: 'Bàn số 12, Tầng 1'
  }
]

const KioskHistorySection: React.FC = () => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diffTime = now.getTime() - date.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return 'Hôm qua'
    if (diffDays <= 7) return `${diffDays} ngày trước`
    return date.toLocaleDateString('vi-VN')
  }

  const StatusIcon = ({ status }: { status: HistoryOrder['status'] }) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-600" />
      default:
        return null
    }
  }

  const getStatusColor = (status: HistoryOrder['status']) => {
    switch (status) {
      case 'delivered':
        return 'bg-gradient-to-r from-green-100/80 to-green-200/80 text-green-800 border-green-200/50'
      case 'cancelled':
        return 'bg-gradient-to-r from-red-100/80 to-red-200/80 text-red-800 border-red-200/50'
      default:
        return 'bg-gradient-to-r from-gray-100/80 to-gray-200/80 text-gray-800 border-gray-200/50'
    }
  }

  return (
    <div className="flex h-full flex-col gap-6 bg-gradient-to-br from-slate-50 to-gray-100 px-6 py-8 text-gray-900">
      {/* Header */}
      <header className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/5 to-slate-800/5 rounded-2xl blur-xl"></div>
        <div className="relative bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-slate-600 bg-clip-text text-transparent">
                Lịch sử đặt hàng
              </h1>
              <p className="text-sm text-gray-600 mt-2">
                Xem lại các đơn hàng đã đặt trước đây
              </p>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50 rounded-xl px-4 py-3">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-800">{mockOrderHistory.length}</p>
                <p className="text-sm text-green-600">Đơn hàng</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {mockOrderHistory.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="glass-card rounded-2xl p-8 text-center tracking-card">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-300/25 to-gray-500/25 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📦</span>
              </div>
              <h2 className="text-lg font-bold text-gray-800 mb-2">Chưa có đơn hàng nào</h2>
              <p className="text-sm text-gray-600 mb-4">Bạn chưa đặt đơn hàng nào trước đây</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {mockOrderHistory.map((order) => (
              <div
                key={order.id}
                className="glass-card rounded-2xl p-4 shadow-lg tracking-card"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <StatusIcon status={order.status} />
                      <h3 className="text-sm font-semibold text-gray-900">
                        Đơn hàng #{order.id.slice(-6)}
                      </h3>
                      <span className={`px-2 py-1 rounded-xl text-xs font-medium border ${getStatusColor(order.status)}`}>
                        {order.status === 'delivered' ? 'Đã giao' : 'Đã hủy'}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 text-xs mb-2">
                      {formatDate(order.date)} - {order.date.toLocaleTimeString('vi-VN')}
                    </p>
                    
                    <p className="text-gray-600 text-xs mb-2">
                      {order.items.length} món • {order.deliveryLocation}
                    </p>
                    
                    <div className="flex flex-wrap gap-1">
                      {order.items.slice(0, 2).map((item, index) => (
                        <span key={index} className="px-2 py-1 rounded-xl bg-gray-50/80 border border-gray-200/30 text-xs text-gray-700">
                          {item.name} x{item.quantity}
                        </span>
                      ))}
                      {order.items.length > 2 && (
                        <span className="px-2 py-1 rounded-xl bg-gray-50/80 border border-gray-200/30 text-xs text-gray-500">
                          +{order.items.length - 2} món
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right ml-4">
                    <p className="text-lg font-bold text-gray-800">
                      {formatCurrency(order.total)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export { KioskHistorySection }