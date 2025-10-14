import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LogIn, UserPlus, LogOut, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';

interface FloatingAuthButtonProps {
  className?: string;
}

const FloatingAuthButton: React.FC<FloatingAuthButtonProps> = ({ className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  if (isAuthenticated && user) {
    // Compact logout button - icon only circle
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={className}
      >
        <button
          onClick={logout}
          title="Đăng xuất"
          className="w-10 h-10 bg-white/95 backdrop-blur-lg border border-red-200/70 rounded-full shadow-lg hover:shadow-xl hover:border-red-300 hover:bg-red-50 transition-all duration-300 flex items-center justify-center group"
        >
          <LogOut className="w-4 h-4 text-red-600 group-hover:scale-110 transition-transform duration-200" />
        </button>
      </motion.div>
    );
  }

  // Compact non-logged-in view with expandable menu
  return (
    <div className={`relative ${className}`}>
      {isExpanded && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => setIsExpanded(false)}
          />
          
          {/* Compact Auth Options */}
          <div className="absolute top-full right-0 mt-2 space-y-2 z-50">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                to="/login"
                className="flex items-center gap-2 bg-white/95 backdrop-blur-lg hover:bg-gray-50 px-4 py-2 rounded-full shadow-lg border border-gray-200/70 hover:border-gray-300 transition-all duration-200 min-w-[140px]"
                onClick={() => setIsExpanded(false)}
              >
                <LogIn className="w-4 h-4 text-gray-700" />
                <span className="text-sm font-bold text-gray-700">Đăng nhập</span>
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.05 }}
            >
              <Link
                to="/register"
                className="flex items-center gap-2 bg-white/95 backdrop-blur-lg hover:bg-gray-50 px-4 py-2 rounded-full shadow-lg border border-gray-200/70 hover:border-gray-300 transition-all duration-200 min-w-[140px]"
                onClick={() => setIsExpanded(false)}
              >
                <UserPlus className="w-4 h-4 text-gray-700" />
                <span className="text-sm font-bold text-gray-700">Đăng ký</span>
              </Link>
            </motion.div>
          </div>
        </>
      )}

      {/* Compact Toggle Button */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-lg transition-all duration-300 ${
            isExpanded 
              ? 'bg-gray-100/95 backdrop-blur-lg text-gray-700 hover:bg-gray-200 border border-gray-300' 
              : 'bg-white/95 backdrop-blur-lg hover:bg-gray-50 text-gray-700 border border-gray-200/70 hover:border-gray-300'
          }`}
        >
          {isExpanded ? (
            <>
              <X className="w-4 h-4" />
              <span className="text-sm font-bold">Đóng</span>
            </>
          ) : (
            <>
              <LogIn className="w-4 h-4" />
              <span className="text-sm font-bold">Đăng nhập</span>
            </>
          )}
        </button>
      </motion.div>
    </div>
  );
};

export default FloatingAuthButton;