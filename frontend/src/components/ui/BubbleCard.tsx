import React from 'react';
import { motion } from 'framer-motion';

interface BubbleCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger';
}

const BubbleCard: React.FC<BubbleCardProps> = ({ 
  children, 
  className = "", 
  delay = 0,
  size = 'md',
  color = 'primary'
}) => {
  const sizeClasses = {
    sm: 'p-4',
    md: 'p-6', 
    lg: 'p-8'
  };

  const colorClasses = {
    primary: 'bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 border-blue-200/30',
    secondary: 'bg-gradient-to-br from-gray-500/10 via-slate-500/10 to-zinc-500/10 border-gray-200/30',
    accent: 'bg-gradient-to-br from-pink-500/10 via-rose-500/10 to-red-500/10 border-pink-200/30',
    success: 'bg-gradient-to-br from-green-500/10 via-emerald-500/10 to-teal-500/10 border-green-200/30',
    warning: 'bg-gradient-to-br from-yellow-500/10 via-orange-500/10 to-amber-500/10 border-yellow-200/30',
    danger: 'bg-gradient-to-br from-red-500/10 via-pink-500/10 to-rose-500/10 border-red-200/30',
  };

  return (
    <motion.div
      initial={{ 
        scale: 0.8, 
        opacity: 0,
        y: 50,
        rotateX: -15
      }}
      animate={{ 
        scale: 1, 
        opacity: 1,
        y: 0,
        rotateX: 0
      }}
      whileHover={{ 
        scale: 1.05,
        y: -5,
        rotateX: 5,
        boxShadow: "0 25px 50px rgba(0,0,0,0.1)"
      }}
      whileTap={{ 
        scale: 0.98
      }}
      transition={{ 
        duration: 0.6, 
        delay,
        type: "spring",
        stiffness: 200,
        damping: 20
      }}
      className={`
        relative overflow-hidden rounded-3xl border backdrop-blur-sm
        ${colorClasses[color]}
        ${sizeClasses[size]}
        ${className}
        shadow-lg hover:shadow-2xl transition-all duration-300
        before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300
      `}
      style={{
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Glossy overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-transparent rounded-3xl" />
      
      {/* Floating particles inside bubble */}
      <div className="absolute inset-0 overflow-hidden rounded-3xl">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/40 rounded-full"
            style={{
              left: `${20 + i * 15}%`,
              top: `${20 + i * 10}%`,
            }}
            animate={{
              y: [-10, -20, -10],
              opacity: [0.4, 0.8, 0.4],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          />
        ))}
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

interface BubbleGridProps {
  children: React.ReactNode;
  columns?: number;
  gap?: number;
  className?: string;
}

const BubbleGrid: React.FC<BubbleGridProps> = ({ 
  children, 
  columns = 3, 
  gap = 6,
  className = "" 
}) => {
  return (
    <div 
      className={`grid gap-${gap} ${className}`}
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
      }}
    >
      {children}
    </div>
  );
};

export { BubbleCard, BubbleGrid };