import React, { useState } from 'react';
import { ChevronDown, Globe, Check } from 'lucide-react';
import { useLanguage, type Language } from '../../contexts/LanguageContext';

interface LanguageOption {
  code: Language;
  name: string;
  flag: string;
}

const languageOptions: LanguageOption[] = [
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'en', name: 'English', flag: '🇺🇸' }
];

interface LanguageToggleProps {
  variant?: 'dark' | 'light';
}

const LanguageToggle: React.FC<LanguageToggleProps> = ({ variant = 'dark' }) => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage = languageOptions.find(lang => lang.code === language) || languageOptions[0];

  const handleLanguageChange = (langCode: Language) => {
    setLanguage(langCode);
    setIsOpen(false);
  };

  const buttonStyles = variant === 'dark' 
    ? `
        bg-white/10 hover:bg-white/20 backdrop-blur-sm
        border border-white/20 hover:border-white/30
        text-white/90 hover:text-white
      `
    : `
        bg-accent-50 hover:bg-accent-100
        border border-accent-200 hover:border-accent-300
        text-accent-700 hover:text-accent-900
      `;

  return (
    <div className="relative">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center space-x-2 px-3 py-2 rounded-lg
          transition-all duration-200 group
          ${buttonStyles}
        `}
        aria-label="Select Language"
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium">
          {currentLanguage.flag} {currentLanguage.name}
        </span>
        <ChevronDown 
          className={`
            w-4 h-4 transition-transform duration-200
            ${isOpen ? 'rotate-180' : ''}
          `} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu */}
          <div className="
            absolute top-full right-0 mt-2 z-50
            bg-white rounded-xl shadow-2xl border border-gray-200
            min-w-[200px] overflow-hidden
            animate-in fade-in slide-in-from-top-2 duration-200
          ">
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
              <p className="text-sm font-medium text-gray-700">
                Select Language
              </p>
            </div>

            {/* Language Options */}
            <div className="py-2">
              {languageOptions.map((option) => (
                <button
                  key={option.code}
                  onClick={() => handleLanguageChange(option.code)}
                  className="
                    w-full px-4 py-3 text-left
                    hover:bg-blue-50 transition-colors duration-150
                    flex items-center justify-between
                    group
                  "
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{option.flag}</span>
                    <span className={`
                      text-sm font-medium
                      ${language === option.code ? 'text-blue-600' : 'text-gray-700'}
                      group-hover:text-blue-600
                    `}>
                      {option.name}
                    </span>
                  </div>
                  
                  {language === option.code && (
                    <Check className="w-4 h-4 text-blue-600" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageToggle;
