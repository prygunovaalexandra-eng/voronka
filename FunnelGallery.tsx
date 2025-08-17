import React, { useState } from 'react';
import { useFunnelStore } from '../store/funnelStore';
import { Industry } from '../types';
import { useSound } from '../hooks/useSound';

const FunnelGallery: React.FC = () => {
  const { filteredFunnels, filters, funnels } = useFunnelStore();
  const { playCardFlip } = useSound();

  // Map industry codes to display names (matching tabs)
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

  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const toggleRow = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  // Helper function to get container rounded corner classes
  const getContainerRoundedCorners = (): string => {
    const isAllTabActive = filters.selectedCategories.length === 0;
    const isLastTabActive = filters.selectedCategories.includes('Other');
    
    if (isAllTabActive) {
      // On "All voronki" tab - top-right corner only
      return 'rounded-tr-[20px] rounded-b-[20px]';
    } else if (isLastTabActive) {
      // On "Other" tab - top-left corner only
      return 'rounded-tl-[20px] rounded-b-[20px]';
    } else {
      // On other tabs - full top corners
      return 'rounded-t-[20px] rounded-b-[20px]';
    }
  };

  if (filteredFunnels.length === 0) {
    // Check if "All voronki" tab is active (no filters applied)
    const isAllTabActive = filters.selectedCategories.length === 0;
    const isLastTabActive = filters.selectedCategories.includes('Other');
    
    return (
      <div className={`bg-background px-6 py-[200px] min-h-full flex items-center justify-center ${
        isAllTabActive 
          ? 'rounded-tr-[20px] rounded-bl-[20px] rounded-br-[20px]'
          : isLastTabActive
          ? 'rounded-tl-[20px] rounded-bl-[20px] rounded-br-[20px]'
          : 'rounded-t-[20px] rounded-b-[20px]'
      }`}>
        <div className="text-center">
          <h3 className="font-mono text-[20px] font-normal leading-[20px] tracking-[-0.2px] text-text mb-2">Nothing found</h3>
          <p className="font-mono text-[20px] font-normal leading-[20px] tracking-[-0.2px] text-text opacity-60">Try adjusting your search or filter criteria</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-full bg-background ${getContainerRoundedCorners()} container-rounded-animated overflow-hidden`}>
      {filteredFunnels.map((funnel, index) => (
                <div
          key={funnel.id}
          onClick={() => toggleRow(funnel.id)}
          onMouseEnter={() => playCardFlip()}
          className="cursor-pointer transition-all duration-700 ease-in-out h-12 hover:h-[442px] px-6 flex flex-col gap-4 relative min-w-0 group overflow-hidden"
        >
          <div className="flex gap-4">
            {/* Service Name - responsive width: 33.33% on mobile, 18% on tablet and desktop */}
            <div className="mt-[10px] font-mono text-[20px] font-normal leading-[24px] tracking-[-0.2px] text-text whitespace-nowrap overflow-hidden text-ellipsis flex-shrink-0 w-[33.33%] md:w-[18%]">
              {funnel.company}
            </div>

            {/* Description - flexible, fills remaining space, hidden on mobile */}
            <div className="mt-[10px] hidden md:block font-mono text-[20px] font-normal leading-[24px] tracking-[-0.2px] text-text whitespace-nowrap overflow-hidden text-ellipsis flex-1 min-w-0">
              {funnel.description}
            </div>

            {/* Category - 18%, hidden on tablet and mobile */}
            <div className="mt-[10px] hidden lg:block font-mono text-[20px] font-normal leading-[24px] tracking-[-0.2px] text-text whitespace-nowrap overflow-hidden text-ellipsis flex-shrink-0 w-[18%]">
                              {funnel.category || getIndustryDisplayName(funnel.industry)}
            </div>

            {/* MAU - responsive width: 33.33% on mobile, 18% on tablet, 13% on desktop */}
            <div className="mt-[10px] flex-shrink-0 w-[33.33%] md:w-[18%] lg:w-[13%] min-w-0">
              <div className="font-mono text-[20px] font-normal leading-[24px] tracking-[-0.2px] text-text whitespace-nowrap overflow-hidden text-ellipsis w-full">
                {funnel.analytics ? funnel.analytics.visitors : '—'}
              </div>
            </div>

            {/* Growth - responsive width: 33.33% on mobile, 18% on tablet, 15% on desktop */}
            <div className="mt-[10px] flex-shrink-0 w-[33.33%] md:w-[18%] lg:w-[15%] min-w-0">
              <div className="font-mono text-[20px] font-normal leading-[24px] tracking-[-0.2px] whitespace-nowrap overflow-hidden text-ellipsis w-full">
                {funnel.analytics ? (
                  <span className={funnel.analytics.dynamics.startsWith('+') ? 'text-green-600' : funnel.analytics.dynamics.startsWith('-') ? 'text-red-500' : 'text-text'}>
                    {funnel.analytics.dynamics} {funnel.analytics.dynamics.startsWith('+') ? 'growth' : funnel.analytics.dynamics.startsWith('-') ? 'decline' : ''}
                  </span>
                ) : '—'}
              </div>
            </div>
          </div>

          {/* Additional Content for Expanded Row */}
          <div className="w-full">
            <div className="border-t border-minor-exact">
              <div className="flex h-[306px]">
                
                {/* Check if we have any expanded data */}
                {(funnel.valueProposition || funnel.appStoreUrl || funnel.addedToLibrary) ? (
                  <>
                    {/* Resources Section - matches Service Name width */}
                    <div className="flex-shrink-0 w-[33.33%] md:w-[18%] h-full">
                      <h4 className="expanded-content-text text-minor-exact tracking-wide mt-3.5 mb-7">Resources</h4>
                      <div className="flex flex-col justify-between h-full">
                        <div className="space-y-2">
                          {funnel.appStoreUrl && (
                            <a 
                              href={funnel.appStoreUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="block expanded-content-text text-blue-600 hover:text-blue-800 transition-colors"
                            >
                              Voronka link
                            </a>
                          )}

                        </div>
                        {funnel.addedToLibrary && (
                          <div className="expanded-content-text text-text-minor">
                            Added: {new Date(funnel.addedToLibrary).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Show dividers and other sections only if data exists */}
                    {funnel.valueProposition && (
                      <>
                        {/* Vertical Divider 1 */}
                        <div className="w-px h-[376px] bg-minor-exact flex-shrink-0"></div>

                        {/* 16px spacing */}
                        <div className="w-4 flex-shrink-0"></div>
                      </>
                    )}

                    {/* Value Proposition Section - matches Description + Category combined width minus 6% */}
                    {funnel.valueProposition && (
                      <div className="flex-1 lg:flex-initial lg:w-[48%] min-w-0 h-full">
                        <h4 className="expanded-content-text text-minor-exact tracking-wide mt-3.5 mb-[25px]">Value proposition</h4>
                        <div className="flex flex-col justify-between h-full">
                          <p className="expanded-content-text-tall text-text leading-relaxed">
                            {funnel.valueProposition}
                          </p>
                          {funnel.tags && funnel.tags.length > 0 && (
                            <div className="expanded-content-text text-text-minor">
                              {Array.from(new Set(funnel.tags)).slice(0, 3).map(tag => `#${tag}`).join(' ')}
                              {Array.from(new Set(funnel.tags)).length > 3 && ` +${Array.from(new Set(funnel.tags)).length - 3}`}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  /* Single error message for entire container when no data */
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center mt-[60px]">
                      <div className="expanded-content-text text-text font-medium mb-2">Oops, something went wrong</div>
                      <div className="expanded-content-text text-minor-exact">We're updating the data and will be back soon</div>
                    </div>
                  </div>
                )}
                
              </div>
            </div>
          </div>

          {/* Bottom line - hide for last row */}
          {index !== filteredFunnels.length - 1 && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-text"></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FunnelGallery; 