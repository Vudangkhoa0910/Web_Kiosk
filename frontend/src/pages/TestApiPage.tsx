/**
 * Test API Component
 * Trang để test API Alpha Asimov Backend
 */

import { useState } from 'react';
import testApi from '../services/test-api';

export default function TestApiPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTest = async (testType: string) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      let data;
      
      switch (testType) {
        case 'token':
          data = testApi.testTokenInfo();
          break;
          
        case 'orders':
          data = await testApi.testGetOrders();
          break;
          
        case 'live-orders':
          data = await testApi.testGetLiveOrders();
          break;
          
        case 'all':
          await testApi.runAllTests();
          data = { message: 'Xem kết quả trong Console (F12)' };
          break;
          
        default:
          data = null;
      }
      
      setResult(data);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🧪 Test Alpha Asimov Backend API
          </h1>
          <p className="text-gray-600 mb-6">
            Kiểm tra kết nối và lấy dữ liệu từ API
          </p>

          {/* Test Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => handleTest('token')}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              🔑 Kiểm tra Token
            </button>

            <button
              onClick={() => handleTest('orders')}
              disabled={loading}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              📋 Lấy danh sách Orders
            </button>

            <button
              onClick={() => handleTest('live-orders')}
              disabled={loading}
              className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              🚀 Lấy Live Orders
            </button>

            <button
              onClick={() => handleTest('all')}
              disabled={loading}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              🎯 Chạy tất cả Tests
            </button>
          </div>

          {/* Loading */}
          {loading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <p className="mt-4 text-gray-600">Đang gọi API...</p>
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <span className="text-red-500 text-xl mr-3">❌</span>
                <div>
                  <h3 className="text-red-800 font-semibold mb-1">Lỗi!</h3>
                  <p className="text-red-700">{error}</p>
                  <div className="mt-3 text-sm text-red-600">
                    <p className="font-semibold">Các nguyên nhân có thể:</p>
                    <ul className="list-disc ml-5 mt-1">
                      <li>Token đã hết hạn → Lấy token mới từ portal</li>
                      <li>Không có quyền truy cập → Liên hệ admin cấp permission</li>
                      <li>CORS chưa được config → Liên hệ admin thêm domain</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Success Result */}
          {result && !loading && !error && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start">
                <span className="text-green-500 text-xl mr-3">✅</span>
                <div className="flex-1">
                  <h3 className="text-green-800 font-semibold mb-3">Thành công!</h3>
                  
                  {/* Token Info */}
                  {result.unique_name && (
                    <div className="space-y-2">
                      <p><strong>Username:</strong> {result.unique_name}</p>
                      <p><strong>Email:</strong> {result.email}</p>
                      <p><strong>Role:</strong> {result.role}</p>
                      <p><strong>Expires At:</strong> {new Date(result.exp * 1000).toLocaleString('vi-VN')}</p>
                    </div>
                  )}

                  {/* Orders List */}
                  {result.items && Array.isArray(result.items) && (
                    <div>
                      <p className="mb-3"><strong>Tổng số:</strong> {result.totalCount}</p>
                      <div className="space-y-3">
                        {result.items.slice(0, 5).map((item: any, idx: number) => {
                          const order = item.order || item;
                          return (
                            <div key={idx} className="bg-white p-3 rounded border border-gray-200">
                              <p className="font-semibold text-gray-800">
                                Order #{idx + 1}: {order.code || order.id}
                              </p>
                              <p className="text-sm text-gray-600">
                                Status: {order.status} | Type: {order.type}
                              </p>
                              {order.sender && (
                                <p className="text-sm text-gray-600">
                                  From: {order.sender.name} - {order.sender.phone}
                                </p>
                              )}
                              {order.recipient && (
                                <p className="text-sm text-gray-600">
                                  To: {order.recipient.name} - {order.recipient.phone}
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Generic message */}
                  {result.message && (
                    <p className="text-green-700">{result.message}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-blue-800 font-semibold mb-2">💡 Hướng dẫn:</h3>
            <ul className="text-blue-700 text-sm space-y-1 list-disc ml-5">
              <li>Nhấn các nút trên để test API</li>
              <li>Mở Console (F12) để xem log chi tiết</li>
              <li>Nếu token hết hạn, lấy token mới từ portal: <code className="bg-blue-100 px-1">https://portal.alphaasimov.com</code></li>
              <li>Token được lưu trong file: <code className="bg-blue-100 px-1">src/services/test-api.ts</code></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
