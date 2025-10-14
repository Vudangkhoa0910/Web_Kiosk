import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';

interface LanguageSwitcherProps {
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className = '' }) => {
  const { language, setLanguage } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`relative ${className}`}
    >
      {/* Language Toggle */}
      <div className="bg-white/95 backdrop-blur-lg border border-gray-200/70 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center overflow-hidden">
          {/* Globe Icon */}
          <div className="pl-3 pr-2 py-2">
            <Globe className="w-4 h-4 text-gray-600" />
          </div>
          
          {/* Divider */}
          <div className="w-px h-6 bg-gray-200"></div>
          
          {/* VI Button */}
          <button
            onClick={() => setLanguage('vi')}
            className={`relative px-3.5 py-2 text-sm font-bold transition-all duration-300 ${
              language === 'vi'
                ? 'text-white'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            {language === 'vi' && (
              <motion.div
                layoutId="languageBackground"
                className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-900 rounded-full"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">VI</span>
          </button>
          
          {/* Divider */}
          <div className="w-px h-6 bg-gray-200"></div>
          
          {/* EN Button */}
          <button
            onClick={() => setLanguage('en')}
            className={`relative px-3.5 py-2 text-sm font-bold transition-all duration-300 ${
              language === 'en'
                ? 'text-white'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            {language === 'en' && (
              <motion.div
                layoutId="languageBackground"
                className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-900 rounded-full"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">EN</span>
          </button>
        </div>
    </motion.div>
  );
};
