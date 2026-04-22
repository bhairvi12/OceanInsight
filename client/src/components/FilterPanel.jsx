import React from 'react';

const FilterPanel = ({ radius, setRadius, isFiltering, onSearchNearby, onClearFilters }) => {
  return (
    <div className="absolute top-4 right-4 z-[1000] bg-[#0A192F]/95 backdrop-blur-md p-4 rounded border border-[#1E2D4A] shadow-lg w-72">
      <h3 className="font-headline font-bold text-[#E2E8F0] mb-3 flex items-center gap-2 text-sm uppercase tracking-widest border-b border-[#1E2D4A] pb-2">
        <span className="material-symbols-outlined text-[#00E5FF] text-[18px]">explore</span>
        Spatial Vector Filter
      </h3>
      
      <div className="space-y-4 pt-1">
        <div>
          <div className="flex justify-between text-[10px] text-[#94A3B8] mb-1 font-bold uppercase tracking-widest">
            <span>Radius Limit</span>
            <span className="text-[#00E5FF]">{radius} km</span>
          </div>
          <input 
            type="range" 
            min="1" 
            max="2000" 
            value={radius} 
            onChange={(e) => setRadius(e.target.value)}
            className="w-full accent-[#00E5FF] cursor-pointer h-1.5 bg-[#1E2D4A] rounded-lg appearance-none"
          />
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={onSearchNearby}
            disabled={isFiltering}
            className="flex-1 py-1.5 bg-[#00E5FF] text-[#020B14] text-[10px] font-bold rounded uppercase tracking-wider hover:bg-[#00A3B5] transition-colors disabled:opacity-50"
          >
            {isFiltering ? 'Scanning...' : 'Ping Near Me'}
          </button>
          <button 
            onClick={onClearFilters}
            className="px-2.5 py-1.5 bg-[#1E2D4A] text-[#94A3B8] text-[10px] font-bold rounded uppercase tracking-wider hover:bg-[#2A3F64] hover:text-[#E2E8F0] transition-colors"
            title="Reset Filters"
          >
            <span className="material-symbols-outlined text-[16px] leading-none">refresh</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
