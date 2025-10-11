import React, { memo } from 'react';
import { motion } from 'framer-motion';

interface StreetLampProps {
  position: { x: number; y: number };
  isActive?: boolean;
  side: 'left' | 'right';
  lampIndex: number;
}

export const StreetLamp: React.FC<StreetLampProps> = memo(({ 
  position, 
  isActive = false, 
  side,
  lampIndex 
}) => {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)',
        zIndex: 10,
        willChange: 'opacity, transform'
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
      }}
      transition={{ 
        duration: 0.3, 
        delay: lampIndex * 0.05,
        ease: 'easeOut' 
      }}
    >
      {/* Street Lamp Post */}
      <div className="relative">
        {/* Lamp Post Base */}
        <div 
          className={`w-1 bg-gradient-to-t from-gray-600 via-gray-500 to-gray-400 rounded-full shadow-md transition-all duration-200 h-12`}
          style={{
            marginLeft: side === 'left' ? '6px' : '-6px'
          }}
        />
        
        {/* Lamp Head */}
        <motion.div
          className={`absolute -top-1 w-3 h-2 rounded-full shadow-md transition-all duration-200 ${
            isActive 
              ? 'bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-500' 
              : 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500'
          }`}
          style={{
            left: side === 'left' ? '5px' : '-11px'
          }}
          animate={isActive ? {
            boxShadow: [
              '0 0 10px rgba(251, 191, 36, 0.4)',
              '0 0 15px rgba(251, 191, 36, 0.6)',
              '0 0 10px rgba(251, 191, 36, 0.4)'
            ]
          } : {}}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />

        {/* Light Glow Effect */}
        {isActive && (
          <motion.div
            className="absolute -top-2 w-6 h-6 rounded-full"
            style={{
              left: side === 'left' ? '-1px' : '-17px',
              background: 'radial-gradient(circle, rgba(251, 191, 36, 0.2) 0%, rgba(251, 191, 36, 0.1) 50%, transparent 70%)',
            }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.4, 0.6, 0.4]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        )}

        {/* Connection Point Indicator */}
        <div
          className={`absolute top-6 w-1.5 h-1.5 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 shadow-sm transition-all duration-200 ${
            isActive ? 'shadow-blue-400/50 scale-110' : ''
          }`}
          style={{
            left: side === 'left' ? '5.5px' : '-7.5px'
          }}
        />

        {/* Road Connection Line */}
        <div
          className={`absolute top-6 w-3 h-0.5 bg-gradient-to-r from-blue-400 to-transparent opacity-40 ${
            side === 'left' ? 'left-7' : 'right-7'
          }`}
        />
      </div>
    </motion.div>
  );
});
