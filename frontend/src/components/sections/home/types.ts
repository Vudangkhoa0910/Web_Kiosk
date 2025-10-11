import type { LucideIcon } from 'lucide-react';

export type ShowcaseHighlight = {
  label: string;
  value: string;
  description?: string;
};

export type ShowcaseContent = {
  badge: string;
  title: string;
  description: string;
  highlights: ShowcaseHighlight[];
};

export type SlideCard = {
  title?: string;
  description?: string;
};

export type WhatWeDoCards = {
  safeAndSmart?: SlideCard;
  streetNavigation?: SlideCard;
  peaceOfMind?: SlideCard;
};

export type OurProductCards = {
  smallOnPurpose?: SlideCard;
  consistentDelivery?: SlideCard;
  ecoFriendly?: SlideCard;
};

export type WhoWeAreCards = {
  topTalents?: SlideCard;
  passionateEngineering?: SlideCard;
  rndFocus?: SlideCard;
};

export type SlideContent<TCards> = {
  title?: string;
  subtitle?: string;
  description?: string;
  cards?: TCards;
};

export type LanguageSchema = {
  home?: {
    slides?: {
      whatWeDo?: SlideContent<WhatWeDoCards>;
      ourProduct?: SlideContent<OurProductCards>;
      whoWeAre?: SlideContent<WhoWeAreCards>;
      whatWeDoHero?: Partial<ShowcaseContent>;
    };
    quickActions?: {
      placeOrder?: string;
      trackDelivery?: string;
      liveOrders?: string;
    };
  };
};

export type SlideFeature = {
  key: string;
  title: string;
  description?: string;
  icon?: LucideIcon;
};

export type SlideStatistic = {
  label: string;
  value: string;
};

export type PresentationSlide = {
  id: string;
  order: number;
  badge?: string;
  title: string;
  subtitle?: string;
  description?: string;
  features: SlideFeature[];
  statistics: SlideStatistic[];
  theme: {
    accent: string;
    gradient: string;
    background: string;
    badge: string;
  };
  image: string;
};

export type PathPoint = {
  progress: number;
  x: number;
  y: number;
};