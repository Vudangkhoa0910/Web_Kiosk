import React from 'react';
import { motion } from 'framer-motion';

export const BrandLogo: React.FC = () => {
  return (
    <div className="fixed top-0.5 left-4 z-50">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="bg-white/95 backdrop-blur-lg border border-gray-200/70 rounded-2xl px-4 py-2.5 flex items-center gap-3 hover:border-gray-300/70 transition-all duration-300 group">
          {/* Logo */}
          <div className="relative">
            <img 
              src="/images/logo.png" 
              alt="Alpha Asimov Robotics" 
              className="h-8 w-auto object-contain relative z-10 group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          
          {/* Divider */}
          <div className="w-px h-8 bg-gray-200"></div>
          
          {/* Brand Name - Horizontal, Same Style */}
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-black text-gray-900 tracking-tight">
              Alpha Asimov Robotics
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
