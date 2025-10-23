import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useKioskStore } from '../stores/kioskStore';
import { useAppStore } from '../hooks/useAppStore';

/**
 * PaymentResult Component
 * Handles MoMo payment callback and redirects to tracking
 */
export default function PaymentResult() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { createOrder, addToCart, clearCart } = useKioskStore();
  const { setActiveSection } = useAppStore();
  const hasProcessed = useRef(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  // CRITICAL: Break out of iframe if loaded inside one
  useEffect(() => {
    if (window.self !== window.top) {
      console.log('🔓 Detected iframe, redirecting parent window...');
      // We're in an iframe, redirect the parent window
      window.top!.location.href = window.location.href;
    }
  }, []);

  useEffect(() => {
    // Prevent double execution in React Strict Mode
    if (hasProcessed.current) {
      console.log('⚠️ Already processed, skipping...');
      return;
    }

    const handlePaymentCallback = async () => {
      hasProcessed.current = true;

      // Get payment result from URL params
      const resultCode = searchParams.get('resultCode');
      const orderId = searchParams.get('orderId');
      const message = searchParams.get('message');
      const transId = searchParams.get('transId');

      console.log('🔵 MoMo Payment Callback:', {
        resultCode,
        orderId,
        message,
        transId
      });

      // Check if payment was successful
      if (resultCode === '0') {
        console.log('✅ Payment successful! Processing...');
        
        try {
          // Get customer info and items from extraData
          const extraDataParam = searchParams.get('extraData');
          let customerInfo = {
            name: 'Customer',
            phone: '0000000000',
            email: '',
            location: 'Kiosk Alpha Asimov',
            notes: 'Order từ Web Kiosk - MoMo Payment'
          };
          let items: any[] = [];

          if (extraDataParam) {
            try {
              const decoded = JSON.parse(atob(extraDataParam));
              console.log('🔍 Decoded extraData:', decoded);
              
              if (decoded.userInfo) {
                customerInfo.name = decoded.userInfo.name || customerInfo.name;
                customerInfo.phone = decoded.userInfo.phone || customerInfo.phone;
                customerInfo.notes = decoded.userInfo.note || customerInfo.notes;
              }

              if (decoded.items && Array.isArray(decoded.items)) {
                items = decoded.items;
                console.log('📦 Items from extraData:', items);
              }
            } catch (e) {
              console.warn('⚠️ Could not decode extraData:', e);
            }
          }

          // Restore items to cart before creating order
          if (items.length > 0) {
            console.log('📝 Restoring items to cart...');
            clearCart(); // Clear any existing items first
            items.forEach(item => {
              addToCart(item, item.quantity || 1);
            });
            console.log('✅ Items restored to cart');
          } else {
            console.warn('⚠️ No items found in extraData');
          }

          // Small delay to ensure store is updated
          await new Promise(resolve => setTimeout(resolve, 100));

          // Try to create order via API, but don't fail if token is expired
          try {
            const newOrderId = await createOrder(customerInfo, 'momo');
            console.log('✅ Order created successfully:', newOrderId);

            // Redirect to tracking page
            setTimeout(() => {
              setActiveSection('tracking');
              navigate('/tracking');
            }, 500);
          } catch (orderError: any) {
            console.warn('⚠️ Could not create backend order (token expired?):', orderError.message);
            
            // For MoMo testing: Show success even if backend order fails
            // This allows testing the payment flow without valid backend token
            console.log('✅ MoMo payment completed successfully!');
            const details = {
              orderId,
              transId,
              amount: searchParams.get('amount'),
              customerInfo,
              items
            };
            console.log('📋 Payment Details:', details);
            
            // Show success screen for 3 seconds then redirect
            setPaymentDetails(details);
            setShowSuccess(true);
            
            setTimeout(() => {
              navigate('/?payment=success');
            }, 3000);
          }

        } catch (error) {
          console.error('❌ Failed to process payment:', error);
          // Redirect to home with error
          navigate('/?error=payment_processing_failed');
        }
      } else {
        // Payment failed or cancelled
        console.log('❌ Payment failed or cancelled:', message);
        // Redirect back to home
        navigate('/?error=payment_failed');
      }
    };

    handlePaymentCallback();
  }, [searchParams, createOrder, navigate, setActiveSection, addToCart, clearCart]);

  // Show success screen if payment succeeded but order creation failed
  if (showSuccess && paymentDetails) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center z-[9999]">
        <div className="text-center max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-2xl">
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            ✅ Thanh toán thành công!
          </h2>
          <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Order ID:</p>
                <p className="font-mono font-semibold text-gray-900">{paymentDetails.orderId}</p>
              </div>
              <div>
                <p className="text-gray-600">Transaction ID:</p>
                <p className="font-mono font-semibold text-gray-900">{paymentDetails.transId}</p>
              </div>
              <div>
                <p className="text-gray-600">Số tiền:</p>
                <p className="font-semibold text-gray-900">{parseInt(paymentDetails.amount).toLocaleString('vi-VN')} ₫</p>
              </div>
              <div>
                <p className="text-gray-600">Khách hàng:</p>
                <p className="font-semibold text-gray-900">{paymentDetails.customerInfo.name}</p>
              </div>
            </div>
            {paymentDetails.items && paymentDetails.items.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-gray-600 mb-2">Món đã đặt:</p>
                {paymentDetails.items.map((item: any, idx: number) => (
                  <p key={idx} className="text-gray-900">• {item.name} x{item.quantity}</p>
                ))}
              </div>
            )}
          </div>
          <p className="text-gray-600 text-sm">
            Đang chuyển về trang chủ...
          </p>
          <p className="text-xs text-gray-400 mt-2">
            (Backend order creation skipped - token expired)
          </p>
        </div>
      </div>
    );
  }

  // Show loading screen while processing
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center z-[9999]">
      <div className="text-center">
        <div className="w-20 h-20 border-4 border-gray-800 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Đang xử lý thanh toán...
        </h2>
        <p className="text-gray-600">
          Vui lòng chờ trong giây lát
        </p>
      </div>
    </div>
  );
}
