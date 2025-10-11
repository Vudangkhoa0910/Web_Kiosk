import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { useLanguage } from '../../contexts/LanguageContext';
import type { Language } from '../../contexts/LanguageContext';

const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'en', label: 'English', flag: '🇺🇸' },
  ];

  return (
    <div className="flex gap-1 bg-accent-50 rounded-lg p-1">
      {languages.map((lang) => (
        <motion.div
          key={lang.code}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant={language === lang.code ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setLanguage(lang.code)}
            className={`
              gap-2 text-xs font-medium transition-all duration-200
              ${language === lang.code 
                ? 'bg-primary-600 text-white shadow-sm' 
                : 'text-accent-600 hover:text-accent-900 hover:bg-accent-100'
              }
            `}
          >
            <span className="text-sm">{lang.flag}</span>
            <span className="hidden sm:inline">{lang.label}</span>
            <span className="sm:hidden">{lang.code.toUpperCase()}</span>
          </Button>
        </motion.div>
      ))}
    </div>
  );
};

export default LanguageSelector;
