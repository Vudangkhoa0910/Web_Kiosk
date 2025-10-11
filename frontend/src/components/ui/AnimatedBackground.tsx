import React from 'react';
import { motion } from 'framer-motion';

const AnimatedBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Modern gradient background with cool blue-gray tones */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-slate-100 via-blue-100 to-indigo-200" />
      
      {/* Secondary gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-50/60 via-slate-50/40 to-indigo-100/50" />
      
      {/* Simplified wave layers with tech-inspired colors */}
      <div className="absolute inset-0">
        {/* Primary wave - Soft blue gradients */}
        <motion.div
          className="absolute inset-0 opacity-40"
          animate={{
            background: [
              'radial-gradient(ellipse 1200px 800px at 30% 40%, rgba(59, 130, 246, 0.15) 0%, rgba(99, 102, 241, 0.1) 40%, transparent 70%)',
              'radial-gradient(ellipse 800px 1200px at 70% 60%, rgba(79, 70, 229, 0.15) 0%, rgba(129, 140, 248, 0.1) 40%, transparent 70%)',
              'radial-gradient(ellipse 1000px 600px at 50% 80%, rgba(99, 102, 241, 0.15) 0%, rgba(59, 130, 246, 0.1) 40%, transparent 70%)',
              'radial-gradient(ellipse 1200px 800px at 30% 40%, rgba(59, 130, 246, 0.15) 0%, rgba(99, 102, 241, 0.1) 40%, transparent 70%)',
            ],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Secondary wave - Tech cyan accents */}
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            background: [
              'radial-gradient(ellipse 1000px 1000px at 60% 30%, rgba(14, 165, 233, 0.12) 0%, rgba(6, 182, 212, 0.08) 50%, transparent 80%)',
              'radial-gradient(ellipse 600px 800px at 40% 70%, rgba(34, 197, 94, 0.12) 0%, rgba(16, 185, 129, 0.08) 50%, transparent 80%)',
              'radial-gradient(ellipse 900px 700px at 80% 50%, rgba(6, 182, 212, 0.12) 0%, rgba(14, 165, 233, 0.08) 50%, transparent 80%)',
              'radial-gradient(ellipse 1000px 1000px at 60% 30%, rgba(14, 165, 233, 0.12) 0%, rgba(6, 182, 212, 0.08) 50%, transparent 80%)',
            ],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Flowing wave effect */}
        <motion.div
          className="absolute inset-0 opacity-25"
          animate={{
            background: [
              'linear-gradient(45deg, rgba(59, 130, 246, 0.08) 0%, transparent 30%, rgba(99, 102, 241, 0.08) 70%, transparent 100%)',
              'linear-gradient(135deg, rgba(79, 70, 229, 0.08) 0%, transparent 30%, rgba(14, 165, 233, 0.08) 70%, transparent 100%)',
              'linear-gradient(225deg, rgba(6, 182, 212, 0.08) 0%, transparent 30%, rgba(34, 197, 94, 0.08) 70%, transparent 100%)',
              'linear-gradient(45deg, rgba(59, 130, 246, 0.08) 0%, transparent 30%, rgba(99, 102, 241, 0.08) 70%, transparent 100%)',
            ],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>
      
      {/* Tech-inspired floating particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-30"
            style={{
              width: `${2 + Math.random() * 3}px`,
              height: `${2 + Math.random() * 3}px`,
              background: `linear-gradient(${Math.random() * 360}deg, #3b82f6, #6366f1, #0ea5e9, #22d3ee)`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              boxShadow: '0 0 4px rgba(59, 130, 246, 0.4)',
            }}
            animate={{
              y: [-20, -100],
              x: [0, Math.random() * 40 - 20],
              opacity: [0, 0.6, 0],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 8 + Math.random() * 8,
              repeat: Infinity,
              delay: Math.random() * 6,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
      
      {/* Clean grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />
    </div>
  );
};

export { AnimatedBackground };