import React, { useState, useEffect } from 'react';
import { useFunnelStore } from '../store/funnelStore';
import { useDebounce } from '../hooks/useDebounce';
import { SEARCH_DEBOUNCE_MS } from '../constants';

const SearchBar: React.FC = () => {
  const { setSearchTerm } = useFunnelStore();
  const [searchValue, setSearchValue] = useState('');
  const debouncedSearchTerm = useDebounce(searchValue, SEARCH_DEBOUNCE_MS);

  useEffect(() => {
    setSearchTerm(debouncedSearchTerm);
  }, [debouncedSearchTerm, setSearchTerm]);

    return (
    <div className="bg-background-invert text-text-invert h-12 relative group w-full min-w-0">
      <div className="px-6 h-full flex items-center relative min-w-0">
        <input
          type="text"
          placeholder="Search by name, category or theme"
          className="w-full bg-transparent border-none py-0 text-text-invert placeholder-text-invert-minor focus:outline-none font-mono text-[20px] font-normal leading-[20px] tracking-[-0.2px] custom-caret capitalize pr-14"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        {searchValue && (
          <button
            onClick={() => setSearchValue('')}
            className="absolute right-6 top-3 w-6 h-6"
            aria-label="Clear search"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.5841 12.0002L4 5.41598L5.41594 4L12 10.5842L18.5841 4L20 5.41598L13.4159 12.0002L19.9996 18.584L18.5836 20L12 13.4162L5.41639 20L4.00045 18.584L10.5841 12.0002Z" fill="#E0DEDA"/>
            </svg>
          </button>
        )}
      </div>
      {/* Bottom line */}
      <div className={`absolute bottom-0 left-6 right-6 h-0.5 transition-colors duration-200 ${
        searchValue || searchValue.length > 0 
          ? 'bg-text-invert' 
          : 'bg-text-invert-minor group-focus-within:bg-text-invert'
      }`}></div>
    </div>
  );
};

export default SearchBar; 