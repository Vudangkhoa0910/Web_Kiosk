import { useMemo } from 'react';
import type { PathPoint, ShowcaseContent } from './types';

export const ROBOT_IMAGE_FORWARD = '/images/Bulldog/5.png';
export const ROBOT_IMAGE_RETURN = '/images/Bulldog/4.png';

export const FALLBACK_SHOWCASE: ShowcaseContent = {
  badge: 'Đội xe Bulldog',
  title: 'Gặp gỡ đội robot giao hàng Bulldog',
  description:
    'Bulldog được phát triển cho những tuyến giao hàng sôi động, kết hợp điều hướng thông minh, đèn LED sinh động và khoang chứa an toàn để chạm tới từng ô cửa thân thiện.',
  highlights: []
};

export const usePathPoints = (): PathPoint[] => {
  return useMemo<PathPoint[]>(
    () => [
      { progress: 0, x: 10, y: 78 },
      { progress: 0.25, x: 32, y: 78 },
      { progress: 0.5, x: 50, y: 78 },
      { progress: 0.75, x: 68, y: 78 },
      { progress: 1, x: 90, y: 78 }
    ],
    []
  );
};

export const generateSVGPath = (pathPoints: PathPoint[]): string => {
  if (!pathPoints.length) return '';
  if (pathPoints.length === 1) return `M ${pathPoints[0].x} ${pathPoints[0].y}`;
  
  const [first, ...rest] = pathPoints;
  let path = `M ${first.x} ${first.y}`;

  // Sử dụng cubic bezier curves để tạo đường cong mềm mại kiểu S
  for (let i = 0; i < rest.length; i++) {
    const current = rest[i];
    const prev = i === 0 ? first : rest[i - 1];
    const next = i < rest.length - 1 ? rest[i + 1] : null;
    
    if (i === 0) {
      // Điểm đầu tiên - sử dụng quadratic curve mềm
      const controlX = prev.x + (current.x - prev.x) * 0.5;
      const controlY = prev.y + (current.y - prev.y) * 0.3;
      path += ` Q ${controlX} ${controlY} ${current.x} ${current.y}`;
    } else {
      // Sử dụng cubic bezier cho độ mềm mại tối đa
      const prevPrev = i >= 2 ? rest[i - 2] : first;
      
      // Tính control points để tạo S-curve mềm mại
      const tension = 0.4; // Độ mềm
      const dx1 = current.x - prevPrev.x;
      const dy1 = current.y - prevPrev.y;
      
      const cp1x = prev.x + dx1 * tension * 0.3;
      const cp1y = prev.y + dy1 * tension * 0.3;
      
      let cp2x, cp2y;
      if (next) {
        const dx2 = next.x - prev.x;
        const dy2 = next.y - prev.y;
        cp2x = current.x - dx2 * tension * 0.3;
        cp2y = current.y - dy2 * tension * 0.3;
      } else {
        cp2x = current.x - (current.x - prev.x) * 0.3;
        cp2y = current.y - (current.y - prev.y) * 0.3;
      }
      
      path += ` C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${current.x} ${current.y}`;
    }
  }

  return path;
};