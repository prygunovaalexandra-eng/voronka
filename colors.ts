import { Industry, FunnelType } from '../types';

export const industryColors: Record<Industry, string> = {
  ecommerce: 'bg-blue-100 text-blue-800',
  saas: 'bg-green-100 text-green-800',
  fintech: 'bg-purple-100 text-purple-800',
  social: 'bg-pink-100 text-pink-800',
  marketplace: 'bg-orange-100 text-orange-800',
  media: 'bg-red-100 text-red-800',
};

export const typeColors: Record<FunnelType, string> = {
  onboarding: 'bg-indigo-100 text-indigo-800',
  checkout: 'bg-emerald-100 text-emerald-800',
  signup: 'bg-cyan-100 text-cyan-800',
  login: 'bg-teal-100 text-teal-800',
  subscription: 'bg-amber-100 text-amber-800',
  booking: 'bg-rose-100 text-rose-800',
};

export const getIndustryColor = (industry: Industry): string => {
  return industryColors[industry] || 'bg-gray-100 text-gray-800';
};

export const getTypeColor = (type: FunnelType): string => {
  return typeColors[type] || 'bg-gray-100 text-gray-800';
}; 