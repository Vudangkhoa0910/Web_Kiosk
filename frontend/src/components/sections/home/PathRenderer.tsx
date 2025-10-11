import React, { useMemo, memo } from 'react';
import type { PathPoint } from './types';

interface PathRendererProps {
  pathPoints: PathPoint[];
}

export const PathRenderer: React.FC<PathRendererProps> = memo(({ pathPoints }) => {
  const { startX, endX, centerY } = useMemo(() => {
    if (!pathPoints.length) {
      return { startX: 10, endX: 90, centerY: 80 };
    }

    const xs = pathPoints.map((point) => point.x);
    const ys = pathPoints.map((point) => point.y);
    const startXValue = Math.min(...xs);
    const endXValue = Math.max(...xs);
    const centerYValue = ys.reduce((sum, value) => sum + value, 0) / ys.length;

    return {
      startX: startXValue,
      endX: endXValue,
      centerY: centerYValue
    };
  }, [pathPoints]);

  const roadWidth = endX - startX;
  const roadX = startX;
  const roadY = centerY;

  return (
    <svg 
      className="absolute inset-0 h-full w-full" 
      viewBox="0 0 100 100" 
      preserveAspectRatio="none"
      style={{ willChange: 'auto' }}
    >
      <line
        x1={roadX}
        y1={roadY}
        x2={roadX + roadWidth}
        y2={roadY}
        stroke="#0f172a"
        strokeWidth={3.5}
        strokeLinecap="round"
        opacity={0.9}
      />
    </svg>
  );
});