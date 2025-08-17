import { create } from 'zustand';
import { Funnel, FilterState, Industry, FunnelType, AppStoreCategory } from '../types';
import { mockFunnels } from '../data/mockData';
import { applyFiltersToFunnels } from '../utils/filters';

interface FunnelStore {
  funnels: Funnel[];
  filteredFunnels: Funnel[];
  filters: FilterState;
  selectedFunnel: Funnel | null;
  
  // Actions
  setSearchTerm: (term: string) => void;
  toggleIndustry: (industry: Industry) => void;
  toggleCategory: (category: AppStoreCategory) => void;
  toggleType: (type: FunnelType) => void;
  setStepsRange: (min?: number, max?: number) => void;
  selectFunnel: (funnel: Funnel | null) => void;
  clearFilters: () => void;
  applyFilters: () => void;
}

export const useFunnelStore = create<FunnelStore>((set, get) => ({
  funnels: mockFunnels,
  filteredFunnels: mockFunnels,
  filters: {
    searchTerm: '',
    selectedIndustries: [],
    selectedCategories: [],
    selectedTypes: [],
  },
  selectedFunnel: null,

  setSearchTerm: (term) => {
    set((state) => ({
      filters: { ...state.filters, searchTerm: term }
    }));
    // Debounce is handled in the component, not here
    get().applyFilters();
  },

  toggleIndustry: (industry) => {
    set((state) => {
      const selectedIndustries = state.filters.selectedIndustries.includes(industry)
        ? state.filters.selectedIndustries.filter(i => i !== industry)
        : [...state.filters.selectedIndustries, industry];
      
      return {
        filters: { ...state.filters, selectedIndustries }
      };
    });
    get().applyFilters();
  },

  toggleCategory: (category) => {
    set((state) => {
      const selectedCategories = state.filters.selectedCategories.includes(category)
        ? state.filters.selectedCategories.filter(c => c !== category)
        : [...state.filters.selectedCategories, category];
      
      return {
        filters: { ...state.filters, selectedCategories }
      };
    });
    get().applyFilters();
  },

  toggleType: (type) => {
    set((state) => {
      const selectedTypes = state.filters.selectedTypes.includes(type)
        ? state.filters.selectedTypes.filter(t => t !== type)
        : [...state.filters.selectedTypes, type];
      
      return {
        filters: { ...state.filters, selectedTypes }
      };
    });
    get().applyFilters();
  },

  setStepsRange: (min, max) => {
    set((state) => ({
      filters: { ...state.filters, minSteps: min, maxSteps: max }
    }));
    get().applyFilters();
  },

  selectFunnel: (funnel) => {
    set({ selectedFunnel: funnel });
  },

  clearFilters: () => {
    set((state) => ({
      filters: {
        ...state.filters,
        selectedIndustries: [],
        selectedCategories: [],
        selectedTypes: [],
        minSteps: undefined,
        maxSteps: undefined,
      }
    }));
    get().applyFilters();
  },

  applyFilters: () => {
    const { funnels, filters } = get();
    const filtered = applyFiltersToFunnels(funnels, filters);
    set({ filteredFunnels: filtered });
  },
})); 