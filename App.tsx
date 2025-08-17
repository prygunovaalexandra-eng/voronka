import React from 'react';
import { useFunnelStore } from './store/funnelStore';
import SearchBar from './components/SearchBar';
import FilteredTable from './components/FilteredTable';
import FunnelModal from './components/FunnelModal';

function App() {
  const { selectedFunnel, selectFunnel } = useFunnelStore();

  return (
    <div className="min-h-screen bg-background-invert w-full min-w-0">
              {/* Header */}
        <header className="bg-background-invert h-14">
          <div className="px-6 pt-4">
            <h1 className="font-mono text-[40px] font-bold leading-[40px] tracking-[-0.6px] text-text-invert">Voronka</h1>
          </div>
        </header>

              {/* Search */}
        <div className="pt-4 mb-7">
          <SearchBar />
        </div>
      
              {/* Filtered Table - адаптируется по содержимому */}
        <div className="w-full min-w-0">
          <FilteredTable />
        </div>

      {/* Modal */}
      {selectedFunnel && (
        <FunnelModal 
          funnel={selectedFunnel} 
          onClose={() => selectFunnel(null)} 
        />
      )}
    </div>
  );
}

export default App;
