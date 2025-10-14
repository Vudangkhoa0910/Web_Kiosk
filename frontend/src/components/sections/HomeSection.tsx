 import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedBackground } from '../ui';
import FloatingAuthButton from '../ui/FloatingAuthButton';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  PathRenderer,
  JourneyRobot,
  usePresentationSlides,
  useJourneyLayout,
  type LanguageSchema,
  type PresentationSlide,
  type SlideFeature,
  type SlideStatistic
} from './home';

const SLIDE_AUTOPLAY_INTERVAL = 8000;

const HomeSection: React.FC = () => {
  const { t } = useLanguage();
  const localeContent = t as LanguageSchema;

  const slides = usePresentationSlides(localeContent);
  const [activeSlide, setActiveSlide] = useState(0);
  const [journeyFrame, setJourneyFrame] = useState<0 | 1>(0);

  const safeSlideIndex = useMemo(
    () => (slides.length ? Math.min(activeSlide, slides.length - 1) : 0),
    [activeSlide, slides.length]
  );
  const currentSlide = slides[safeSlideIndex];

  useEffect(() => {
    const frameTimer = setInterval(
      () => setJourneyFrame((prev) => (prev === 0 ? 1 : 0)),
      900
    );

    return () => clearInterval(frameTimer);
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;

    const autoplay = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, SLIDE_AUTOPLAY_INTERVAL);

    return () => clearInterval(autoplay);
  }, [slides.length]);

  const handleSelectSlide = useCallback((index: number) => {
    setActiveSlide(index);
  }, []);

  const { pathPoints, robotX, robotY, direction } = useJourneyLayout(
    safeSlideIndex,
    slides.length,
    SLIDE_AUTOPLAY_INTERVAL
  );

  const featuresToRender = currentSlide?.features.slice(0, 3) ?? [];
  const statsToRender = currentSlide?.statistics.slice(0, 3) ?? [];

  return (
    <>
      <div className="fixed inset-0 bg-gradient-to-br from-white via-gray-50 to-silver-100">
        <div className="absolute inset-0 bg-gradient-to-tr from-gray-200/35 via-gray-100/25 to-white/20" />
        <div className="absolute inset-0 bg-gradient-to-bl from-white/25 via-gray-50/20 to-silver-100/25" />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200/18 via-transparent to-white/22" />
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_25%_25%,rgba(100,100,100,0.18)_1.5px,transparent_1.5px),radial-gradient(circle_at_75%_75%,rgba(180,180,180,0.18)_1px,transparent_1px)] bg-[length:42px_42px,28px_28px]" />
        <div className="absolute inset-0 opacity-[0.01] bg-[linear-gradient(90deg,rgba(100,100,100,0.12)_1px,transparent_1px),linear-gradient(rgba(100,100,100,0.12)_1px,transparent_1px)] bg-[length:26px_26px]" />
      </div>

      <AnimatedBackground />

  <section className="relative z-10 flex h-screen flex-col overflow-hidden">
        <header className="mx-auto w-full max-w-6xl px-4 pt-3 pb-2 text-center">
          <h1 className="text-[1.6rem] font-black uppercase tracking-[0.35em] text-slate-900 sm:text-[2rem] lg:text-[2.4rem]">
            ALPHAASIMOV
          </h1>
        </header>

        <main className="relative mx-auto flex w-full max-w-[95rem] flex-1 flex-col justify-center px-3 py-2 sm:px-4 sm:py-3">
          <div className="relative flex-1 overflow-hidden rounded-[1.8rem] border border-white/45 bg-white/86 shadow-[0_20px_45px_rgba(15,23,42,0.15)] backdrop-blur-3xl">
            <AnimatePresence mode="wait" initial={false}>
              {currentSlide && (
                <motion.div
                  key={currentSlide.id}
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -28 }}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                  className="grid h-full items-center gap-3 px-4 py-3 sm:px-6 sm:py-4 md:grid-cols-[1.2fr_1fr] lg:grid-cols-[1.3fr_1fr] lg:gap-6 xl:gap-8"
                >
                  <div className="flex flex-col justify-center gap-4 py-1">
                    {currentSlide.badge && (
                      <span
                        className={`inline-flex w-fit items-center gap-2 rounded-full px-4 py-1.5 text-[0.78rem] font-semibold uppercase tracking-[0.3em] text-white ${currentSlide.theme.badge}`}
                      >
                        <div className="h-1.5 w-1.5 animate-ping rounded-full bg-white" />
                        {currentSlide.badge}
                      </span>
                    )}
                    <div className="space-y-3 text-left">
                      <h2
                        className={`text-[1.5rem] font-black leading-tight sm:text-[1.8rem] md:text-[2rem] lg:text-[2.2rem] ${currentSlide.theme.accent}`}
                      >
                        {currentSlide.title}
                      </h2>
                      {currentSlide.description && (
                        <p className="text-[0.85rem] leading-relaxed text-slate-600 sm:text-[0.92rem] lg:text-[0.98rem]">
                          {currentSlide.description}
                        </p>
                      )}
                    </div>

                    {featuresToRender.length > 0 && (
                      <div className="mt-3 grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                        {featuresToRender.map((feature: SlideFeature) => (
                          <div
                            key={feature.key}
                            className="rounded-2xl border border-white/55 bg-white/82 px-4 py-3 shadow-[0_12px_24px_rgba(15,23,42,0.1)] backdrop-blur-xl"
                          >
                            <div className="flex items-center gap-2 mb-1.5">
                              {feature.icon && (
                                <feature.icon className="h-[20px] w-[20px] text-slate-500" />
                              )}
                              <p className="text-[0.95rem] font-bold text-slate-800 sm:text-[1rem]">
                                {feature.title}
                              </p>
                            </div>
                            {feature.description && (
                              <p className="text-[0.8rem] leading-relaxed text-slate-600 sm:text-[0.85rem]">
                                {feature.description}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {statsToRender.length > 0 && (
                      <div className="grid gap-2.5 grid-cols-1 sm:grid-cols-3">
                        {statsToRender.map((stat: SlideStatistic) => (
                          <div
                            key={stat.label}
                            className="rounded-2xl border border-white/60 bg-white/82 px-3 py-2.5 text-center shadow-[0_12px_24px_rgba(15,23,42,0.1)] backdrop-blur-xl"
                          >
                            <p className="text-[0.7rem] uppercase tracking-[0.18em] text-slate-500">
                              {stat.label}
                            </p>
                            <p className="text-[0.95rem] font-bold text-slate-900">{stat.value}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="relative flex h-full items-center justify-center px-3 py-2 sm:px-5 sm:py-3 lg:px-8">
                    <motion.div
                      key={`${currentSlide.id}-image`}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.45, ease: 'easeOut' }}
                      className="relative w-full max-w-[16rem] sm:max-w-[20rem] md:max-w-[22rem] lg:max-w-[24rem] xl:max-w-[26rem]"
                    >
                      <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-white/80 via-white/35 to-white/10 blur-2xl" />
                      <div className="relative overflow-hidden rounded-[2.2rem] border border-white/55 bg-white/92 shadow-[0_20px_45px_rgba(15,23,42,0.22)] backdrop-blur-3xl">
                        <div className="relative aspect-[4/5] w-full">
                          <img
                            src={currentSlide.image}
                            alt={currentSlide.title}
                            className="absolute inset-0 h-full w-full object-contain"
                            loading="eager"
                          />
                        </div>
                      </div>
                      <div className="absolute -bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
                        <div className="rounded-full bg-white/85 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-slate-600 shadow-[0_6px_18px_rgba(15,23,42,0.15)]">
                          Trang {safeSlideIndex + 1} / {slides.length}
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {slides.length > 1 && (
              <div className="flex items-center justify-center gap-2 border-t border-white/50 bg-white/78 px-4 py-2.5 backdrop-blur-xl">
                {slides.map((slide: PresentationSlide, index: number) => {
                  const isActive = index === safeSlideIndex;
                  return (
                    <button
                      key={slide.id}
                      type="button"
                      onClick={() => handleSelectSlide(index)}
                      className={`relative flex h-8 w-8 items-center justify-center rounded-full border text-[0.75rem] font-semibold transition-all duration-200 ${
                        isActive
                          ? 'border-transparent bg-gradient-to-br from-gray-900 via-gray-500 to-gray-800 text-white shadow-[0_8px_16px_rgba(100,100,100,0.18)]'
                          : 'border-white/60 bg-white/70 text-gray-500 hover:border-white/80 hover:text-gray-700'
                      }`}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </main>

        <footer className="relative px-3 pb-3 sm:px-4 sm:pb-4">
          <div className="mx-auto w-full max-w-3xl">
            <div className="relative h-[4.5rem] sm:h-[5rem] rounded-[1rem] border border-white/50 bg-white/72 shadow-[0_12px_28px_rgba(15,23,42,0.12)] backdrop-blur-2xl">
              <div className="absolute inset-0">
                <PathRenderer pathPoints={pathPoints} />
              </div>

              <JourneyRobot
                robotX={robotX}
                robotY={robotY}
                direction={direction}
                journeyFrame={journeyFrame}
              />
            </div>
          </div>
        </footer>
      </section>

      {/* Floating Auth Button */}
      <FloatingAuthButton />
    </>
  );
};

export default HomeSection;
