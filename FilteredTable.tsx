import React from 'react';
import FilterPanel from './FilterPanel';
import FunnelGallery from './FunnelGallery';

const FilteredTable: React.FC = () => {
  return (
    <div className="px-6 pb-6 flex flex-col min-w-0">
      <div className="rounded-lg flex flex-col min-w-0">
        {/* Tabs Header */}
        <div>
          <FilterPanel />
        </div>
        
        {/* Table Content - адаптируется по содержимому */}
        <div className="min-w-0">
          <FunnelGallery />
        </div>
      </div>
    </div>
  );
};

export default FilteredTable; 