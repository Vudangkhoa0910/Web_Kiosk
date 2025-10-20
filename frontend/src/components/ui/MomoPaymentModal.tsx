import React, { useEffect, useState } from 'react'
import { X, Smartphone, QrCode, CheckCircle, Clock } from 'lucide-react'

interface MomoPaymentModalProps {
  isOpen: boolean
  onClose: () => void
  paymentData: {
    orderId: string
    amount: number
    qrCodeDataURL?: string
    momoLink?: string
    payUrl?: string
    description?: string
  }
  cartItems?: Array<{ name: string; quantity: number; price: number }>
  onPaymentComplete?: () => void
}

const MomoPaymentModal: React.FC<MomoPaymentModalProps> = ({
  isOpen,
  onClose,
  paymentData,
  cartItems = [],
  onPaymentComplete
}) => {
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'completed' | 'failed'>('pending')
  const [showIframe, setShowIframe] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setPaymentStatus('pending')
      setShowIframe(false)
    }
  }, [isOpen])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const handleOpenMomoApp = () => {
    if (paymentData.momoLink) {
      // Try to open MoMo app deeplink
      window.location.href = paymentData.momoLink
    }
  }

  const handlePaymentComplete = () => {
    setPaymentStatus('completed')
    setTimeout(() => {
      onPaymentComplete?.()
      onClose()
    }, 2000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 rounded-t-3xl p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {paymentData.description || 'Burger House'}
              </h2>
              <p className="text-sm text-gray-500">Tầng 1, Khu A</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Payment Status */}
          {paymentStatus === 'completed' ? (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-green-900 mb-2">
                Thanh toán thành công!
              </h3>
              <p className="text-sm text-green-700">
                Đơn hàng của bạn đang được chuẩn bị
              </p>
            </div>
          ) : (
            <>
              {/* Payment Method Selection */}
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-3">
                  Phương thức thanh toán
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Chọn phương thức thanh toán bạn muốn sử dụng
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setShowIframe(false)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      !showIframe
                        ? 'border-pink-500 bg-pink-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <QrCode className="w-8 h-8 mx-auto mb-2 text-pink-600" />
                    <p className="text-sm font-medium text-gray-900">QR Code</p>
                    <p className="text-xs text-gray-500 mt-1">Quét mã thanh toán</p>
                  </button>

                  <button
                    onClick={() => setShowIframe(true)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      showIframe
                        ? 'border-pink-500 bg-pink-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Smartphone className="w-8 h-8 mx-auto mb-2 text-pink-600" />
                    <p className="text-sm font-medium text-gray-900">Ví MoMo</p>
                    <p className="text-xs text-gray-500 mt-1">Thanh toán qua Ví điện tử</p>
                  </button>
                </div>
              </div>

              {/* Order Details */}
              <div className="bg-gray-50 rounded-2xl p-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">
                  Chi tiết đơn hàng
                </h4>
                <div className="space-y-2">
                  {cartItems.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.name} x{item.quantity}
                      </span>
                      <span className="font-medium text-gray-900">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-gray-200">
                    <span className="text-xs text-gray-500">Phí giao hàng:</span>
                    <span className="text-xs text-gray-600 float-right">Miễn phí</span>
                  </div>
                </div>
              </div>

              {/* Total Amount */}
              <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-4 border border-pink-200">
                <div className="flex justify-between items-center">
                  <span className="text-base font-semibold text-gray-900">Tổng cộng:</span>
                  <span className="text-2xl font-bold text-pink-600">
                    {formatCurrency(paymentData.amount)}
                  </span>
                </div>
              </div>

              {/* Payment Display */}
              {!showIframe ? (
                /* QR Code Display */
                <div className="bg-white rounded-2xl p-6 border border-gray-200 text-center">
                  <div className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-2xl p-6 mb-4">
                    {paymentData.qrCodeDataURL ? (
                      <img
                        src={paymentData.qrCodeDataURL}
                        alt="MoMo QR Code"
                        className="w-64 h-64 mx-auto rounded-xl bg-white p-4"
                      />
                    ) : (
                      <div className="w-64 h-64 mx-auto bg-white rounded-xl flex items-center justify-center">
                        <QrCode className="w-24 h-24 text-gray-300" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-center gap-2 text-pink-600">
                      <Clock className="w-5 h-5" />
                      <span className="text-sm font-medium">
                        Thanh toán MoMo
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Số tiền: <span className="font-bold text-pink-600">{formatCurrency(paymentData.amount)}</span>
                    </p>
                    <div className="space-y-2 text-xs text-left bg-pink-50 rounded-xl p-4">
                      <p className="font-semibold text-pink-900">Bấm "Mở ứng dụng MoMo" để tiếp tục thanh toán</p>
                      <ul className="space-y-1 text-pink-700 list-disc list-inside">
                        <li>Mở ứng dụng MoMo trên điện thoại</li>
                        <li>Xác nhận thông tin thanh toán</li>
                        <li>Hoàn tất giao dịch</li>
                      </ul>
                    </div>
                  </div>

                  {paymentData.momoLink && (
                    <button
                      onClick={handleOpenMomoApp}
                      className="w-full mt-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg flex items-center justify-center gap-2"
                    >
                      <Smartphone className="w-5 h-5" />
                      Mở ứng dụng MoMo
                    </button>
                  )}
                </div>
              ) : (
                /* Iframe Display */
                <div className="bg-white rounded-2xl overflow-hidden border border-gray-200">
                  {paymentData.payUrl || paymentData.momoLink ? (
                    <iframe
                      src={paymentData.payUrl || paymentData.momoLink}
                      className="w-full h-[500px]"
                      title="MoMo Payment"
                      sandbox="allow-scripts allow-same-origin allow-forms allow-top-navigation"
                    />
                  ) : (
                    <div className="h-[500px] flex items-center justify-center text-gray-500">
                      <div className="text-center">
                        <Smartphone className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <p>Không có URL thanh toán</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Test Button - Remove in production */}
              {process.env.NODE_ENV === 'development' && (
                <button
                  onClick={handlePaymentComplete}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors"
                >
                  [TEST] Giả lập thanh toán thành công
                </button>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 rounded-b-3xl p-4">
          <p className="text-xs text-center text-gray-500">
            Mã đơn hàng: <span className="font-mono">{paymentData.orderId}</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default MomoPaymentModal
