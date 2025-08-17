import React, { useState, useRef, useEffect } from 'react';
import { useFunnelStore } from '../store/funnelStore';
import { AppStoreCategory } from '../types';

const FilterPanel: React.FC = () => {
  const { filters, toggleIndustry, clearFilters, toggleCategory } = useFunnelStore();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ width: 0, left: 0 });
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const categories: { value: AppStoreCategory | null; label: string }[] = [
    { value: null, label: 'All voronki' },
    { value: 'Fitness', label: 'Fitness' },
    { value: 'Nutrition & Diet', label: 'Nutrition & Diet' },
    { value: 'Mental Health', label: 'Mental Health' },
    { value: 'Self-Improvement', label: 'Self-Improvement' },
    { value: 'Astrology & Spirituality', label: 'Astrology & Spirituality' },
    { value: 'Health', label: 'Health' },
    { value: 'Language Learning', label: 'Language Learning' },
    { value: 'Relations & Dating', label: 'Relations & Dating' },
    { value: 'Location & Utilities', label: 'Location & Utilities' },
    { value: 'Parenting', label: 'Parenting' },
    { value: 'Beauty & Style', label: 'Beauty & Style' },
    { value: 'AI & Technology', label: 'AI & Technology' },
    { value: 'Hobbies & Lifestyle', label: 'Hobbies & Lifestyle' },
    { value: 'E-commerce', label: 'E-commerce' },
    { value: 'Income & Finance', label: 'Income & Finance' },
    { value: 'Education', label: 'Education' },
    { value: 'Religion', label: 'Religion' },
    { value: 'IQ & Brain Games', label: 'IQ & Brain Games' },
    { value: 'Entertainment', label: 'Entertainment' },
    { value: 'Other', label: 'Other' },
  ];

  const handleCategoryClick = (category: AppStoreCategory | null) => {
    if (category === null) {
      clearFilters();
    } else {
      // Clear all filters first, then select this one
      clearFilters();
      toggleCategory(category);
    }
  };

  const isActive = (category: AppStoreCategory | null) => {
    if (category === null) {
      return filters.selectedCategories.length === 0;
    }
    return filters.selectedCategories.includes(category);
  };

  // Update indicator position
  const updateIndicatorPosition = () => {
    const activeIndex = categories.findIndex(cat => isActive(cat.value));
    if (activeIndex !== -1 && tabRefs.current[activeIndex] && scrollContainerRef.current) {
      const activeTab = tabRefs.current[activeIndex];
      const container = scrollContainerRef.current;
      
      try {
        // Use offsetLeft for more stable positioning during resize
        const left = activeTab.offsetLeft;
        const width = activeTab.offsetWidth;
        
        setIndicatorStyle({ width, left });
      } catch (error) {
        // Fallback to getBoundingClientRect if offset properties fail
        const tabRect = activeTab.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        
        const left = tabRect.left - containerRect.left + container.scrollLeft;
        const width = tabRect.width;
        
        setIndicatorStyle({ width, left });
      }
    }
  };

  // Scroll active tab into view
  const scrollToActiveTab = () => {
    const activeIndex = categories.findIndex(cat => isActive(cat.value));
    if (activeIndex !== -1 && tabRefs.current[activeIndex] && scrollContainerRef.current) {
      const activeTab = tabRefs.current[activeIndex];
      const container = scrollContainerRef.current;
      
      // Calculate if tab is visible
      const tabRect = activeTab.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      
      if (tabRect.left < containerRect.left || tabRect.right > containerRect.right) {
        activeTab.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'nearest',
          inline: 'center'
        });
      }
    }
  };

  // Update indicator when active tab changes
  useEffect(() => {
    const activeIndex = categories.findIndex(cat => isActive(cat.value));
    if (activeIndex !== -1) {
      // Update position when active tab changes
      updateIndicatorPosition();
      // Additional update after a short delay for layout changes
      const timer = setTimeout(updateIndicatorPosition, 50);
      return () => clearTimeout(timer);
    }
  }, [filters.selectedCategories, categories]);

  // Update indicator and scroll when filters change
  useEffect(() => {
    scrollToActiveTab();
    // Single update with delay for Safari stability
    const timer = setTimeout(updateIndicatorPosition, 100);
    return () => clearTimeout(timer);
  }, [filters.selectedCategories]);

  // Update indicator on mount and resize
  useEffect(() => {
    updateIndicatorPosition();
    
    let resizeTimeout: number;
    const handleResize = () => {
      // For Safari, use fewer immediate updates to prevent jitter
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        updateIndicatorPosition();
        // Single follow-up update after layout stabilizes
        setTimeout(updateIndicatorPosition, 50);
      }, 150);
    };
    
    const handleScroll = () => {
      updateIndicatorPosition();
    };
    
    window.addEventListener('resize', handleResize);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.addEventListener('scroll', handleScroll);
    }
    
    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', handleResize);
      if (scrollContainerRef.current) {
        scrollContainerRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  return (
    <div className="bg-background-invert">
      <div ref={scrollContainerRef} className="overflow-x-auto scrollbar-hide relative">
        <div className="flex space-x-2 min-w-max">
          {categories.map((category, index) => {
            const active = isActive(category.value);
            const hovered = hoveredIndex === index;
            const clicked = clickedIndex === index;
            
            return (
              <button
                key={category.label}
                ref={(el) => tabRefs.current[index] = el}
                onClick={() => handleCategoryClick(category.value)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => { setHoveredIndex(null); setClickedIndex(null); }}
                onMouseDown={() => setClickedIndex(index)}
                onMouseUp={() => setClickedIndex(null)}
                className={`tab-fixed flex items-center justify-center focus:outline-none select-none flex-shrink-0 ${
                  active ? 'tab-active rounded-t-[20px]' : ''
                } ${
                  clicked && active ? 'tab-state-active-click' :
                  clicked && !active ? 'tab-state-inactive-click' :
                  hovered && active ? 'tab-state-active-hover' : 
                  hovered && !active ? 'tab-state-inactive-hover' :
                  active ? 'tab-state-active' : 'tab-state-inactive'
                }`}
              >
                {category.label}
              </button>
            );
          })}
        </div>
        
        {/* Sliding background */}
        <div
          className="sliding-background"
          style={{
            width: `${indicatorStyle.width}px`,
            transform: `translateX(${indicatorStyle.left}px)`,
            left: 0,
          }}
        />
      </div>
    </div>
  );
};

export default FilterPanel; 