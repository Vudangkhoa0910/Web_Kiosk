import React, { useState } from 'react';
import { X } from 'lucide-react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [prefillEmail, setPrefillEmail] = useState<string>('');

  if (!isOpen) return null;

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
  };

  const handleRegisterSuccess = (email?: string) => {
    if (email) {
      setPrefillEmail(email);
    }
    setMode('login');
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Improved Backdrop - More balanced */}
      <div 
        className="fixed inset-0 bg-gradient-to-br from-gray-900/25 via-gray-600/20 to-black/30 backdrop-blur-sm transition-opacity"
        onClick={handleBackdropClick}
      />
      
      {/* Modal - Better positioning */}
      <div className="flex min-h-full items-center justify-center p-6 text-center">
        <div className="relative w-full max-w-md transform text-left transition-all">
          {/* Close Button - Properly positioned */}
          <button
            onClick={onClose}
            className="absolute -top-2 -right-2 z-30 p-2 bg-white/95 hover:bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 group border border-gray-200/50"
          >
            <X className="h-4 w-4 text-gray-500 group-hover:text-gray-700 transition-colors" />
          </button>
          
          {/* Content */}
          {mode === 'login' ? (
            <LoginForm onToggleMode={toggleMode} onClose={onClose} prefillEmail={prefillEmail} />
          ) : (
            <RegisterForm onToggleMode={handleRegisterSuccess} onClose={onClose} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
