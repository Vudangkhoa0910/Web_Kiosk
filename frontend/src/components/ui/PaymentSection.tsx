import React, { useState, useEffect } from 'react'
import { QrCode, Smartphone } from 'lucide-react'
import '../../styles/tracking.css'

interface PaymentSectionProps {
  totalAmount: number
  paymentMethod: 'qr' | 'momo'
  setPaymentMethod: (method: 'qr' | 'momo') => void
  onPaymentConfirm: () => void
}

const PaymentSection: React.FC<PaymentSectionProps> = ({
  totalAmount,
  paymentMethod,
  setPaymentMethod,
  onPaymentConfirm
}) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('')

  // Thông tin tài khoản
  const bankInfo = {
    bankCode: 'MB',
    accountNumber: '222234567868',
    accountName: 'VU DANG KHOA',
    amount: totalAmount,
    description: `Thanh toan don hang ${Date.now()}`
  }

  useEffect(() => {
    if (paymentMethod === 'qr') {
      // Tạo QR Code URL với VietQR API
      const qrUrl = `https://img.vietqr.io/image/${bankInfo.bankCode}-${bankInfo.accountNumber}-compact2.png?amount=${bankInfo.amount}&addInfo=${encodeURIComponent(bankInfo.description)}&accountName=${encodeURIComponent(bankInfo.accountName)}`
      setQrCodeUrl(qrUrl)
    }
  }, [paymentMethod, totalAmount])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  return (
    <div className="glass-card rounded-2xl p-6 shadow-lg tracking-card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Chọn phương thức thanh toán</h3>
      
      {/* Payment Method Selection */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <button
          onClick={() => setPaymentMethod('qr')}
          className={`p-4 rounded-xl border-2 transition-all duration-200 ${
            paymentMethod === 'qr'
              ? 'border-green-500 bg-green-50 text-green-700'
              : 'border-gray-200 hover:border-gray-300 text-gray-700'
          }`}
        >
          <QrCode className="w-8 h-8 mx-auto mb-2" />
          <p className="font-medium">QR Code</p>
          <p className="text-sm opacity-75">Chuyển khoản</p>
        </button>
        
        <button
          onClick={() => setPaymentMethod('momo')}
          className={`p-4 rounded-xl border-2 transition-all duration-200 ${
            paymentMethod === 'momo'
              ? 'border-pink-500 bg-pink-50 text-pink-700'
              : 'border-gray-200 hover:border-gray-300 text-gray-700'
          }`}
        >
          <Smartphone className="w-8 h-8 mx-auto mb-2" />
          <p className="font-medium">Ví MoMo</p>
          <p className="text-sm opacity-75">Thanh toán nhanh</p>
        </button>
      </div>

      {/* Payment Details */}
      {paymentMethod === 'qr' && (
        <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-xl p-4 border border-gray-200/50">
          <div className="text-center mb-4">
            <h4 className="font-semibold text-gray-900 mb-2">Quét mã QR để thanh toán</h4>
            <div className="bg-white rounded-lg p-4 inline-block shadow-sm">
              {qrCodeUrl ? (
                <img 
                  src={qrCodeUrl} 
                  alt="QR Code" 
                  className="w-48 h-48 mx-auto"
                  onError={() => setQrCodeUrl('')}
                />
              ) : (
                <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                  <QrCode className="w-16 h-16 text-gray-400" />
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Ngân hàng:</span>
              <span className="font-medium">MB Bank</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Số tài khoản:</span>
              <span className="font-medium">{bankInfo.accountNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Chủ tài khoản:</span>
              <span className="font-medium">{bankInfo.accountName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Số tiền:</span>
              <span className="font-bold text-green-600">{formatCurrency(totalAmount)}</span>
            </div>
            <div className="pt-2 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Nội dung: {bankInfo.description}
              </p>
            </div>
          </div>
        </div>
      )}

      {paymentMethod === 'momo' && (
        <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-4 border border-pink-200/50">
          <div className="text-center">
            <div className="bg-white rounded-lg p-4 inline-block shadow-sm mb-4">
              <div className="w-48 h-48 bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg flex items-center justify-center">
                <Smartphone className="w-16 h-16 text-pink-500" />
              </div>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Thanh toán qua Ví MoMo</h4>
            <p className="text-sm text-gray-600 mb-4">
              Mở ứng dụng MoMo và quét mã QR hoặc nhập số điện thoại để thanh toán
            </p>
            <div className="bg-white rounded-lg p-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Số tiền thanh toán:</span>
                <span className="font-bold text-pink-600">{formatCurrency(totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Button */}
      <button
        onClick={onPaymentConfirm}
        className="w-full mt-6 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg"
      >
        Xác nhận thanh toán {formatCurrency(totalAmount)}
      </button>
    </div>
  )
}

export default PaymentSection