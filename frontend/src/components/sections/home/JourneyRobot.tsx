import React, { memo } from 'react';
import { motion, type MotionValue } from 'framer-motion';
import { ROBOT_IMAGE_FORWARD, ROBOT_IMAGE_RETURN } from './constants';

interface JourneyRobotProps {
  robotX: MotionValue<string>;
  robotY: MotionValue<string>;
  direction: 'forward' | 'reverse';
  journeyFrame: 0 | 1;
}

export const JourneyRobot: React.FC<JourneyRobotProps> = memo(({
  robotX,
  robotY,
  direction,
  journeyFrame
}) => {
  return (
    <motion.div
      className="absolute z-30 w-20 sm:w-24 lg:w-28 xl:w-32"
      style={{ 
        left: robotX, 
        top: robotY,
        transform: 'translate(-50%, -92%)',
        willChange: 'transform'
      }}
    >
      <motion.div
        animate={{ 
          y: journeyFrame === 0 ? -2 : 2,
        }}
        transition={{ 
          duration: 0.5, 
          ease: [0.4, 0.0, 0.2, 1], // Custom smooth easing
          type: "spring",
          stiffness: 300,
          damping: 30
        }}
        className="relative"
      >
        {/* Robot shadow */}
        <motion.div
          className="absolute inset-0 bg-black/20 rounded-full blur-md"
          style={{
            transform: 'translateY(72%) scale(0.85)',
          }}
          animate={{
            opacity: journeyFrame === 0 ? 0.25 : 0.35,
            scaleX: journeyFrame === 0 ? 0.9 : 1.1,
          }}
          transition={{
            duration: 0.5,
            ease: [0.4, 0.0, 0.2, 1],
            type: "spring",
            stiffness: 200,
            damping: 25
          }}
        />
        
        {/* Robot image */}
        <img
          src={direction === 'reverse' ? ROBOT_IMAGE_RETURN : ROBOT_IMAGE_FORWARD}
          alt="Bulldog Robot"
          className="relative z-10 w-full h-auto drop-shadow-lg"
          style={{
            imageRendering: 'auto',
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
          }}
          loading="eager"
        />
      </motion.div>
    </motion.div>
  );
});