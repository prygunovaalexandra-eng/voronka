export type Industry = 'ecommerce' | 'saas' | 'fintech' | 'social' | 'marketplace' | 'media';

export type AppStoreCategory = 
  | 'Fitness'
  | 'Nutrition & Diet'
  | 'Mental Health'
  | 'Self-Improvement'
  | 'Astrology & Spirituality'
  | 'Health'
  | 'Language Learning'
  | 'Relations & Dating'
  | 'Location & Utilities'
  | 'Parenting'
  | 'Beauty & Style'
  | 'AI & Technology'
  | 'Hobbies & Lifestyle'
  | 'E-commerce'
  | 'Income & Finance'
  | 'Education'
  | 'Religion'
  | 'IQ & Brain Games'
  | 'Entertainment'
  | 'Other';

export type FunnelType = 'onboarding' | 'checkout' | 'signup' | 'login' | 'subscription' | 'booking';

export interface FunnelStep {
  id: string;
  title: string;
  screenshot: string;
  description?: string;
}

export interface Funnel {
  id: string;
  title: string;
  company: string;
  description: string;
  industry: Industry;
  category?: AppStoreCategory; // App Store category
  type: FunnelType;
  tags: string[];
  steps: FunnelStep[];
  thumbnail: string;
  createdAt: string;
  // New expanded content fields
  analytics?: {
    visitors: string;
    dynamics: string;
    conversion?: string;
  };
  appStoreUrl?: string;
  metaAdsUrl?: string;
  addedToLibrary?: string;
  valueProposition?: string;
  // stepsCount вычисляется автоматически из steps.length
}

export interface FilterState {
  searchTerm: string;
  selectedIndustries: Industry[];
  selectedCategories: AppStoreCategory[];
  selectedTypes: FunnelType[];
  minSteps?: number;
  maxSteps?: number;
} 