import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { createPortal } from 'react-dom';

export interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ 
  id, 
  type, 
  title, 
  message, 
  duration = 5000, 
  onClose 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Trigger enter animation
    setTimeout(() => setIsVisible(true), 50);

    // Auto close
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose(id);
    }, 300);
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getStyles = () => {
    const baseStyles = `
      transform transition-all duration-300 ease-out
      ${isVisible && !isLeaving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      bg-white/95 backdrop-blur-sm border border-gray-200/50 rounded-xl shadow-lg
      p-4 max-w-md w-full pointer-events-auto
    `;

    const borderColors = {
      success: 'border-l-4 border-l-green-500',
      error: 'border-l-4 border-l-red-500',
      warning: 'border-l-4 border-l-yellow-500',
      info: 'border-l-4 border-l-blue-500'
    };

    return `${baseStyles} ${borderColors[type]}`;
  };

  return (
    <div className={getStyles()}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {getIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 mb-1">
            {title}
          </p>
          {message && (
            <p className="text-sm text-gray-600 leading-relaxed">
              {message}
            </p>
          )}
        </div>

        <button
          onClick={handleClose}
          className="flex-shrink-0 ml-2 p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100/50 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

// Toast Container
export const ToastContainer: React.FC<{ toasts: ToastProps[] }> = ({ toasts }) => {
  return createPortal(
    <div className="fixed top-4 right-4 z-50 space-y-3 pointer-events-none">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>,
    document.body
  );
};

export default Toast;
