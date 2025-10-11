import { useEffect, useMemo } from 'react';
import { animate, useMotionValue, useTransform } from 'framer-motion';
import {
  Shield,
  Bot,
  Zap,
  Users,
  MapPin,
  Clock,
  Activity,
  Sparkles,
  Award
} from 'lucide-react';
import type {
  LanguageSchema,
  PathPoint,
  PresentationSlide,
  SlideFeature
} from './types';
import { FALLBACK_SHOWCASE, usePathPoints } from './constants';

const SLIDE_IMAGES = [
  '/images/Bulldog/1.png',
  '/images/Bulldog/2.png',
  '/images/Bulldog/3.png'
];

const createFeatures = (cardsData: any, icons: unknown[]): SlideFeature[] => {
  if (!cardsData?.cards) return [];

  return Object.entries(cardsData.cards)
    .slice(0, 3)
    .map(([key, card], index) => ({
      key,
      title: (card as any)?.title ?? `Tính năng ${index + 1}`,
      description: (card as any)?.description,
      icon: icons[index] as SlideFeature['icon']
    }));
};

const createStatistics = (highlights = FALLBACK_SHOWCASE.highlights) => 
  highlights && highlights.length > 0 
    ? highlights.slice(0, 3).map((highlight) => ({
        label: highlight.label,
        value: highlight.value
      }))
    : [];

export const usePresentationSlides = (
  localeContent: LanguageSchema
): PresentationSlide[] => {
  return useMemo(() => {
    const { whatWeDo, ourProduct, whoWeAre, whatWeDoHero } =
      localeContent.home?.slides ?? {};

    const heroContent = {
      badge: whatWeDoHero?.badge ?? FALLBACK_SHOWCASE.badge,
      title: whatWeDoHero?.title ?? FALLBACK_SHOWCASE.title,
      description: whatWeDoHero?.description ?? FALLBACK_SHOWCASE.description,
      highlights: whatWeDoHero?.highlights ?? FALLBACK_SHOWCASE.highlights
    };

    const slides: PresentationSlide[] = [
      {
        id: 'what-we-do',
        order: 0,
        badge: whatWeDo?.subtitle ?? 'Chúng tôi làm gì',
        title: whatWeDo?.title ?? 'Tự hành an toàn trên mọi tuyến phố',
        subtitle: heroContent.title,
        description:
          whatWeDo?.description ??
          heroContent.description ??
          'Bulldog kết hợp cảm biến, trí tuệ nhân tạo và kinh nghiệm vận hành thực tế để mang lại những chuyến giao hàng trọn vẹn ở mọi khu phố.',
        features: createFeatures(whatWeDo, [Shield, Sparkles, MapPin]),
        statistics: createStatistics(heroContent.highlights),
        theme: {
          accent: 'text-blue-600',
          gradient: 'from-slate-900 via-blue-700 to-slate-800',
          background: 'bg-white/85 backdrop-blur-xl border border-slate-200 shadow-[0_20px_60px_rgba(15,23,42,0.14)]',
          badge: 'bg-blue-600 text-white'
        },
        image: SLIDE_IMAGES[0]
      },
      {
        id: 'our-product',
        order: 1,
        badge: ourProduct?.subtitle ?? 'Sản phẩm của chúng tôi',
        title: ourProduct?.title ?? 'Tinh chỉnh cho vận hành giao nhận thực tế',
        subtitle: heroContent.title,
        description:
          ourProduct?.description ??
          heroContent.description ??
          'Từ khung gầm đến phần mềm, mỗi chi tiết của Bulldog được tối ưu cho tốc độ triển khai, khả năng bảo trì và trải nghiệm khách hàng vượt trội.',
        features: createFeatures(ourProduct, [Bot, Clock, Zap]),
        statistics: createStatistics(heroContent.highlights),
        theme: {
          accent: 'text-emerald-600',
          gradient: 'from-slate-900 via-emerald-600 to-slate-800',
          background: 'bg-white/85 backdrop-blur-xl border border-slate-200 shadow-[0_20px_60px_rgba(15,23,42,0.14)]',
          badge: 'bg-emerald-600 text-white'
        },
        image: SLIDE_IMAGES[1]
      },
      {
        id: 'who-we-are',
        order: 2,
        badge: whoWeAre?.subtitle ?? 'Chúng tôi là ai',
        title: whoWeAre?.title ?? 'Đội ngũ say mê sáng tạo tương lai giao hàng',
        subtitle: heroContent.title,
        description:
          whoWeAre?.description ??
          heroContent.description ??
          'Chúng tôi gồm những kỹ sư, nhà thiết kế và chuyên gia vận hành luôn tìm kiếm cách giúp robot phục vụ con người một cách gần gũi và đáng tin cậy hơn.',
        features: createFeatures(whoWeAre, [Users, Activity, Award]),
        statistics: createStatistics(heroContent.highlights),
        theme: {
          accent: 'text-slate-800',
          gradient: 'from-slate-900 via-slate-700 to-slate-800',
          background: 'bg-white/85 backdrop-blur-xl border border-slate-200 shadow-[0_20px_60px_rgba(15,23,42,0.14)]',
          badge: 'bg-slate-800 text-white'
        },
        image: SLIDE_IMAGES[2]
      }
    ];

    return slides;
  }, [localeContent]);
};

export const useJourneyAnimation = (
  pathPoints: PathPoint[],
  direction: 'forward' | 'reverse',
  durationMs: number,
  animationKey: string | number
) => {
  const progress = useMotionValue(direction === 'forward' ? 0 : 1);

  useEffect(() => {
    if (!pathPoints.length) return;

    const from = direction === 'forward' ? 0 : 1;
    const to = direction === 'forward' ? 1 : 0;
    const durationSeconds = Math.max(durationMs / 1000, 0.1);

    progress.set(from);

    const controls = animate(progress, to, {
      duration: durationSeconds,
      ease: 'linear'
    });

    return () => controls.stop();
  }, [direction, durationMs, animationKey, pathPoints, progress]);

  const pathConfig = useMemo(
    () => ({
      progressValues: pathPoints.map((p) => p.progress),
      xPositions: pathPoints.map((p) => `${p.x}%`),
      yPositions: pathPoints.map((p) => `${p.y}%`)
    }),
    [pathPoints]
  );

  const robotX = useTransform(progress, pathConfig.progressValues, pathConfig.xPositions);
  const robotY = useTransform(progress, pathConfig.progressValues, pathConfig.yPositions);

  return {
    progress,
    robotX,
    robotY
  };
};

export const useJourneyLayout = (
  activeSlide: number,
  slideCount: number,
  durationMs: number
) => {
  const pathPoints = usePathPoints();
  const direction: 'forward' | 'reverse' = activeSlide % 2 === 0 ? 'forward' : 'reverse';
  const animationKey = `${activeSlide}-${slideCount}-${direction}`;

  const { progress, robotX, robotY } = useJourneyAnimation(
    pathPoints,
    direction,
    durationMs,
    animationKey
  );

  return {
    pathPoints,
    robotX,
    robotY,
    direction,
    progress
  };
};