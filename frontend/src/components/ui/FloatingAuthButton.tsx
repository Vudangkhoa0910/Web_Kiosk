import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LogIn, UserPlus, User, LogOut, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const FloatingAuthButton: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  if (isAuthenticated && user) {
    // Hiển thị thông tin user khi đã đăng nhập
    return (
      <div className="fixed bottom-6 right-6 z-50">
        {isExpanded && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/20 backdrop-blur-sm"
              onClick={() => setIsExpanded(false)}
            />
            
            {/* User Info */}
            <div className="relative mb-4">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 min-w-[200px]">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setIsExpanded(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Đăng xuất
                </button>
              </div>
            </div>
          </>
        )}

        {/* Main Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`w-14 h-14 rounded-full shadow-lg transition-all duration-200 flex items-center justify-center ${
            isExpanded 
              ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' 
              : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
          }`}
        >
          {isExpanded ? (
            <X className="w-5 h-5" />
          ) : (
            <User className="w-5 h-5" />
          )}
        </button>
      </div>
    );
  }

  // Hiển thị options đăng nhập/đăng ký khi chưa đăng nhập
  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isExpanded && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsExpanded(false)}
          />
          
          {/* Auth Options */}
          <div className="relative mb-4 space-y-2">
            <Link
              to="/login"
              className="flex items-center gap-3 bg-white hover:bg-gray-50 px-4 py-3 rounded-xl shadow-lg border border-gray-200 transition-all duration-200 min-w-[180px]"
              onClick={() => setIsExpanded(false)}
            >
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <LogIn className="w-4 h-4 text-gray-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">Đăng nhập</span>
            </Link>
            
            <Link
              to="/register"
              className="flex items-center gap-3 bg-white hover:bg-gray-50 px-4 py-3 rounded-xl shadow-lg border border-gray-200 transition-all duration-200 min-w-[180px]"
              onClick={() => setIsExpanded(false)}
            >
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <UserPlus className="w-4 h-4 text-gray-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">Đăng ký</span>
            </Link>
          </div>
        </>
      )}

      {/* Main Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-14 h-14 rounded-full shadow-lg transition-all duration-200 flex items-center justify-center ${
          isExpanded 
            ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' 
            : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
        }`}
      >
        {isExpanded ? (
          <X className="w-5 h-5" />
        ) : (
          <User className="w-5 h-5" />
        )}
      </button>
    </div>
  );
};

export default FloatingAuthButton;