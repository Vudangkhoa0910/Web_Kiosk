import React from 'react';
import { LanguageSwitcher } from './LanguageSwitcher';
import FloatingAuthButton from './FloatingAuthButton';

export const TopRightControls: React.FC = () => {
  return (
    <div className="fixed top-2.5 right-4 z-50 flex items-center gap-3">
      {/* Language Switcher */}
      <LanguageSwitcher />
      
      {/* Auth Button - Outermost */}
      <FloatingAuthButton />
    </div>
  );
};
