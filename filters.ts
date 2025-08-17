import { Funnel, FilterState, Industry } from '../types';

export const applyFiltersToFunnels = (funnels: Funnel[], filters: FilterState): Funnel[] => {
  return funnels.filter(funnel => {
    // Search term filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      
      // Helper function to get industry display name
      const getIndustryDisplayName = (industry: Industry): string => {
        const industryMap: Record<Industry, string> = {
          'saas': 'Business',
          'fintech': 'Finance',
          'ecommerce': 'Shopping',
          'social': 'Social Networking',
          'media': 'Entertainment',
          'marketplace': 'Marketplace'
        };
        return industryMap[industry] || industry;
      };
      
      const matchesSearch = 
        funnel.title.toLowerCase().includes(searchLower) ||
        funnel.company.toLowerCase().includes(searchLower) ||
        funnel.description.toLowerCase().includes(searchLower) ||
        funnel.industry.toLowerCase().includes(searchLower) ||
        getIndustryDisplayName(funnel.industry).toLowerCase().includes(searchLower) ||
        funnel.tags.some(tag => tag.toLowerCase().includes(searchLower));
      
      if (!matchesSearch) return false;
    }

    // Industry filter
    if (filters.selectedIndustries.length > 0) {
      if (!filters.selectedIndustries.includes(funnel.industry)) return false;
    }

    // Category filter
    if (filters.selectedCategories.length > 0) {
      if (!funnel.category || !filters.selectedCategories.includes(funnel.category)) return false;
    }

    // Type filter
    if (filters.selectedTypes.length > 0) {
      if (!filters.selectedTypes.includes(funnel.type)) return false;
    }

    // Steps range filter
    if (filters.minSteps && funnel.steps.length < filters.minSteps) return false;
    if (filters.maxSteps && funnel.steps.length > filters.maxSteps) return false;

    return true;
  });
}; 