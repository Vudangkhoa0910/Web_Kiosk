import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useToast } from '../../contexts/ToastContext';
import { AuthService } from '../../services/api';

interface RegisterFormProps {
  onToggleMode: (email?: string) => void;
  onClose?: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onToggleMode }) => {
  const { t } = useLanguage();
  const { showSuccess, showError } = useToast();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError('All fields are required');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      // Call actual registration API
      await AuthService.register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password
      });
      
      // Show success toast
      showSuccess(
        'Account Created Successfully!', 
        `Welcome ${formData.firstName}! You can now sign in with your credentials.`
      );
      
      // Switch to login mode after successful registration with email prefilled
      setTimeout(() => {
        onToggleMode(formData.email);
      }, 1500);
      
    } catch (err: any) {
      const errorMessage = err.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      showError('Registration Failed', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

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
            {t.auth.register}
          </h2>
          <p className="text-gray-600 text-sm">
            {t.auth.register_subtitle}
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="px-8 py-6 bg-gradient-to-b from-gray-50/30 to-white">
        {error && (
          <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-red-50/50 border border-red-200/50 rounded-2xl backdrop-blur-sm">
            <div className="flex items-center">
              <div className="h-2 w-2 bg-red-500 rounded-full mr-3"></div>
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="firstName" className="block text-sm font-semibold text-gray-800">
                First Name
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-gray-400 group-focus-within:text-gray-600 transition-colors" />
                </div>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3.5 bg-white/90 border border-gray-200/60 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all duration-200 backdrop-blur-sm"
                  placeholder="John"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="lastName" className="block text-sm font-semibold text-gray-800">
                Last Name
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-gray-400 group-focus-within:text-gray-600 transition-colors" />
                </div>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3.5 bg-white/90 border border-gray-200/60 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all duration-200 backdrop-blur-sm"
                  placeholder="Doe"
                  required
                />
              </div>
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-semibold text-gray-800">
              {t.auth.email}
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-gray-400 group-focus-within:text-gray-600 transition-colors" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3.5 bg-white/90 border border-gray-200/60 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all duration-200 backdrop-blur-sm"
                placeholder={t.auth.email_placeholder}
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-semibold text-gray-800">
              {t.auth.password}
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-gray-400 group-focus-within:text-gray-600 transition-colors" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-11 pr-12 py-3.5 bg-white/90 border border-gray-200/60 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all duration-200 backdrop-blur-sm"
                placeholder={t.auth.password_placeholder}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-800">
              Confirm Password
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-gray-400 group-focus-within:text-gray-600 transition-colors" />
              </div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full pl-11 pr-12 py-3.5 bg-white/90 border border-gray-200/60 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all duration-200 backdrop-blur-sm"
                placeholder="Confirm your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 hover:from-gray-800 hover:via-gray-700 hover:to-gray-600 text-white font-semibold py-3.5 px-6 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm"
          >
            {isLoading ? 'Creating Account...' : t.auth.register}
          </button>

          {/* Toggle Mode */}
          <div className="text-center pt-4 border-t border-gray-200/30">
            <p className="text-sm text-gray-600 mb-2">or</p>
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => onToggleMode()}
                className="text-gray-900 hover:text-gray-700 font-semibold transition-colors"
              >
                {t.auth.login}
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;