import { useState, useEffect } from 'react';
import { tokenManager } from '../services/tokenManager';
import { AUTH_CONFIG } from '../config/auth.config';

/**
 * Token Update Page
 * 
 * UI để developer/tester cập nhật token dễ dàng
 * Route: /token-update
 */
export default function TokenUpdatePage() {
  const [accessToken, setAccessToken] = useState('');
  const [refreshToken, setRefreshToken] = useState('');
  const [tokenInfo, setTokenInfo] = useState(tokenManager.getTokenInfo());
  const [timeRemaining, setTimeRemaining] = useState('');
  const [message, setMessage] = useState('');
  const [isExpired, setIsExpired] = useState(false);

  // Update time remaining every second
  useEffect(() => {
    const updateTime = () => {
      const remaining = tokenManager.getFormattedTimeRemaining();
      setTimeRemaining(remaining);
      setIsExpired(tokenManager.isTokenExpired());
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [tokenInfo]);

  const handleLoadCurrent = () => {
    const info = tokenManager.getTokenInfo();
    setAccessToken(info.accessToken);
    setRefreshToken(info.refreshToken);
    setMessage('✅ Đã load token hiện tại');
  };

  const handleLoadFromConfig = () => {
    setAccessToken(AUTH_CONFIG.ACCESS_TOKEN);
    setRefreshToken(AUTH_CONFIG.REFRESH_TOKEN);
    setMessage('✅ Đã load token từ config file');
  };

  const handleSaveTokens = () => {
    if (!accessToken || !refreshToken) {
      setMessage('❌ Vui lòng nhập đầy đủ Access Token và Refresh Token');
      return;
    }

    try {
      // Parse JWT to get expiry time
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      const expiresAt = payload.exp;

      // Save tokens
      tokenManager.setTokens(accessToken, refreshToken, expiresAt);

      // Refresh token info display
      setTokenInfo(tokenManager.getTokenInfo());
      
      setMessage(`✅ Token đã được lưu! Hết hạn lúc: ${new Date(expiresAt * 1000).toLocaleString()}`);
    } catch (error) {
      setMessage('❌ Token không hợp lệ. Vui lòng kiểm tra lại.');
      console.error('Token parse error:', error);
    }
  };

  const handleRefreshToken = async () => {
    setMessage('🔄 Đang refresh token...');
    const newToken = await tokenManager.refreshAccessToken();
    
    if (newToken) {
      const info = tokenManager.getTokenInfo();
      setAccessToken(info.accessToken);
      setRefreshToken(info.refreshToken);
      setTokenInfo(info);
      setMessage('✅ Token đã được refresh thành công!');
    } else {
      setMessage('❌ Không thể refresh token. Refresh token có thể đã hết hạn.');
    }
  };

  const handleClearTokens = () => {
    if (window.confirm('Bạn có chắc muốn xóa tất cả token?')) {
      tokenManager.clearTokens();
      setAccessToken('');
      setRefreshToken('');
      setTokenInfo(tokenManager.getTokenInfo());
      setMessage('✅ Đã xóa tất cả token');
    }
  };

  const handleCopyToken = (token: string, type: string) => {
    navigator.clipboard.writeText(token);
    setMessage(`✅ Đã copy ${type} vào clipboard`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🔐 Token Management
          </h1>
          <p className="text-gray-600">
            Quản lý token cho Alpha Asimov API - Dành cho Developer & Tester
          </p>
        </div>

        {/* Current Token Status */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            📊 Trạng thái Token hiện tại
          </h2>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-700">User:</span>
              <span className="text-gray-900">{tokenInfo.user || 'N/A'}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-700">Role:</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                {tokenInfo.role || 'N/A'}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-700">Hết hạn lúc:</span>
              <span className="text-gray-900">
                {new Date(tokenInfo.expiresAt * 1000).toLocaleString('vi-VN')}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-700">Thời gian còn lại:</span>
              <span className={`font-mono px-3 py-1 rounded ${
                isExpired 
                  ? 'bg-red-100 text-red-800' 
                  : timeRemaining.includes('h')
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {timeRemaining}
              </span>
            </div>

            {isExpired && (
              <div className="bg-red-50 border border-red-200 rounded p-3 mt-2">
                <p className="text-red-800 text-sm">
                  ⚠️ Token đã hết hạn! Vui lòng refresh hoặc nhập token mới.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">⚡ Quick Actions</h2>
          
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleLoadCurrent}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              📥 Load Token hiện tại
            </button>
            
            <button
              onClick={handleLoadFromConfig}
              className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition"
            >
              📄 Load từ Config File
            </button>
            
            <button
              onClick={handleRefreshToken}
              disabled={isExpired && !refreshToken}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              🔄 Refresh Token
            </button>
            
            <button
              onClick={handleClearTokens}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              🗑️ Xóa tất cả Token
            </button>
          </div>
        </div>

        {/* Token Input Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">✏️ Cập nhật Token</h2>
          
          <div className="space-y-4">
            {/* Access Token */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Access Token
              </label>
              <div className="flex gap-2">
                <textarea
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                  placeholder="Paste your access token here..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                  rows={4}
                />
                <button
                  onClick={() => handleCopyToken(accessToken, 'Access Token')}
                  disabled={!accessToken}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition disabled:opacity-50"
                >
                  📋 Copy
                </button>
              </div>
            </div>

            {/* Refresh Token */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Refresh Token
              </label>
              <div className="flex gap-2">
                <textarea
                  value={refreshToken}
                  onChange={(e) => setRefreshToken(e.target.value)}
                  placeholder="Paste your refresh token here..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                  rows={4}
                />
                <button
                  onClick={() => handleCopyToken(refreshToken, 'Refresh Token')}
                  disabled={!refreshToken}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition disabled:opacity-50"
                >
                  📋 Copy
                </button>
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSaveTokens}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              💾 Lưu Token
            </button>
          </div>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`rounded-lg p-4 mb-6 ${
            message.startsWith('✅') 
              ? 'bg-green-50 border border-green-200 text-green-800'
              : message.startsWith('❌')
              ? 'bg-red-50 border border-red-200 text-red-800'
              : 'bg-blue-50 border border-blue-200 text-blue-800'
          }`}>
            {message}
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-3">📖 Hướng dẫn:</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
            <li>Lấy token mới từ Alpha Asimov auth server</li>
            <li>Paste Access Token và Refresh Token vào form trên</li>
            <li>Nhấn "Lưu Token" → Token sẽ được lưu vào localStorage</li>
            <li>Hoặc dùng "Refresh Token" để tự động gia hạn</li>
            <li>Token sẽ tự động được dùng cho tất cả API calls</li>
          </ol>
          
          <div className="mt-4 pt-4 border-t border-blue-200">
            <p className="text-sm text-blue-700">
              <strong>Production:</strong> Sử dụng file <code className="bg-blue-100 px-1 rounded">.env.local</code> 
              {' '}với <code className="bg-blue-100 px-1 rounded">VITE_ACCESS_TOKEN</code> và{' '}
              <code className="bg-blue-100 px-1 rounded">VITE_REFRESH_TOKEN</code>
            </p>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-6 text-center">
          <a
            href="/"
            className="inline-block px-6 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
          >
            ← Quay về trang chủ
          </a>
        </div>
      </div>
    </div>
  );
}
