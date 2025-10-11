import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useToast } from '../../contexts/ToastContext';

interface LoginFormProps {
  onToggleMode: () => void;
  onClose?: () => void;
  prefillEmail?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ onToggleMode, onClose, prefillEmail = '' }) => {
  const { login, isLoading, error, clearError } = useAuth();
  const { t } = useLanguage();
  const { showError, showSuccess } = useToast();
  
  const [formData, setFormData] = useState({
    email: prefillEmail,
    password: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear errors when user starts typing
    if (error) clearError();
    if (localError) setLocalError(null);
  };

  const validateForm = (): boolean => {
    if (!formData.email) {
      setLocalError('Email is required');
      return false;
    }
    
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setLocalError('Please enter a valid email address');
      return false;
    }
    
    if (!formData.password) {
      setLocalError('Password is required');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      await login(formData.email, formData.password);
      showSuccess('Welcome back!', 'You have successfully logged in.');
      onClose?.();
    } catch (error) {
      // Error is handled by AuthContext and will show in the form
      // Also show toast for better UX
      showError('Login Failed', 'Please check your credentials and try again.');
      console.error('Login failed:', error);
    }
  };

  const displayError = error || localError;

  return (
    <div className="w-full max-w-md mx-auto bg-white/95 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-200/30 overflow-hidden">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-gray-100 via-white to-gray-50 px-8 py-6 text-center border-b border-gray-200/30">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/5 to-transparent"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 bg-white/95 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg border border-gray-200/30 p-2">
                <img 
                  src="/images/logo.png" 
                  alt="AlphaAsimov Logo" 
                  className="h-full w-full object-contain"
                  onError={(e) => {
                    // Fallback to text logo if image fails
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = '<span class="text-gray-900 text-lg font-bold tracking-tight">AA</span>';
                      parent.className = 'h-12 w-12 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 rounded-xl flex items-center justify-center shadow-lg';
                    }
                  }}
                />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">AlphaAsimov</h1>
            </div>
          </div>
          <div className="h-0.5 w-20 bg-gradient-to-r from-gray-900 via-gray-600 to-gray-400 rounded-full mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            {t.auth.welcome_back}
          </h2>
          <p className="text-gray-600 text-sm">
            {t.auth.login_subtitle}
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="px-8 py-6 bg-gradient-to-b from-gray-50/30 to-white">
        {displayError && (
          <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-red-50/50 border border-red-200/50 rounded-2xl backdrop-blur-sm">
            <div className="flex items-center">
              <div className="h-2 w-2 bg-red-500 rounded-full mr-3"></div>
              <p className="text-red-700 text-sm font-medium">{displayError}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-semibold text-gray-800">
              {t.auth.email}
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-gray-600 transition-colors" />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 bg-white/80 border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all duration-200 backdrop-blur-sm placeholder-gray-400/70 text-gray-800"
                placeholder={t.auth.email_placeholder}
                disabled={isLoading}
                autoComplete="email"
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"></div>
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-semibold text-gray-800">
              {t.auth.password}
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-gray-600 transition-colors" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-12 pr-14 py-3 bg-white/80 border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all duration-200 backdrop-blur-sm placeholder-gray-400/70 text-gray-800"
                placeholder={t.auth.password_placeholder}
                disabled={isLoading}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"></div>
            </div>
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <a href="#" className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors relative group">
              {t.auth.forgot_password}
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-900 group-hover:w-full transition-all duration-200"></div>
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="relative w-full bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white py-3 px-6 rounded-2xl font-semibold hover:from-black hover:via-gray-900 hover:to-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10 flex items-center justify-center">
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white mr-3"></div>
                  <span className="font-medium">{t.auth.login}...</span>
                </>
              ) : (
                <span className="font-semibold tracking-wide">{t.auth.login}</span>
              )}
            </div>
          </button>
        </form>

        {/* Switch to Register */}
        <div className="mt-6 text-center">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200/50"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white/80 text-gray-500 font-medium">or</span>
            </div>
          </div>
          <p className="mt-4 text-gray-600">
            {t.auth.no_account}{' '}
            <button
              onClick={onToggleMode}
              className="text-gray-900 hover:text-black font-semibold transition-colors relative group"
              disabled={isLoading}
            >
              {t.auth.register_now}
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-gray-900 to-black group-hover:w-full transition-all duration-200"></div>
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
