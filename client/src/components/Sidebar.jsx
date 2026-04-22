import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import HazardCard from './HazardCard';

const Sidebar = ({ reports, isLoading, onHazardClick, radius, setRadius, isFiltering, onSearchNearby, onClearFilters }) => {
  const { logout, user } = useContext(AuthContext);

  return (
    <aside className="h-full flex flex-col bg-[#0A192F] border-r border-[#1E2D4A] overflow-hidden">
      
      {/* 1. Filters Section */}
      <div className="p-5 border-b border-[#1E2D4A] bg-[#020B14]">
        <h3 className="text-[10px] font-bold text-[#E2E8F0] uppercase tracking-widest flex items-center gap-2 mb-3">
          <span className="material-symbols-outlined text-[#00E5FF] text-[16px]">tune</span>
          Spatial Filters
        </h3>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-[#94A3B8] mb-1.5">
              <span>Radius Setting</span>
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
              className="flex-1 py-2 bg-[#1E2D4A] hover:bg-[#2A3F64] text-[#E2E8F0] text-[10px] font-bold rounded uppercase tracking-wider transition-colors disabled:opacity-50 border border-[#2A3F64]"
            >
              {isFiltering ? 'Scanning...' : 'Apply Filters'}
            </button>
            <button 
              onClick={onClearFilters}
              className="px-3 py-2 bg-[#020B14] hover:bg-[#1E2D4A] text-[#FF3333] border border-[#1E2D4A] text-[10px] font-bold rounded uppercase tracking-wider transition-colors"
              title="Reset Filters"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* 2. Live Feed Section */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="p-4 bg-[#0A192F] border-b border-[#1E2D4A] border-dashed flex justify-between items-center shrink-0">
          <h3 className="text-[10px] font-bold text-[#E2E8F0] uppercase tracking-widest flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00E5FF] text-[16px]">list_alt</span>
            Active Alerts
          </h3>
          <span className="text-[9px] text-[#94A3B8] font-bold uppercase tracking-widest bg-[#1E2D4A] px-2 py-0.5 rounded">
            {reports.length} Found
          </span>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-3">
          {isLoading ? (
            // Skeleton Loading State
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-4 rounded border border-[#1E2D4A] bg-[#020B14] flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div className="w-1/2 h-4 skeleton-box"></div>
                  <div className="w-12 h-4 skeleton-box"></div>
                </div>
                <div className="w-1/3 h-3 skeleton-box mt-1"></div>
                <div className="flex justify-between items-end mt-2">
                  <div className="w-20 h-5 skeleton-box"></div>
                  <div className="w-10 h-3 skeleton-box"></div>
                </div>
              </div>
            ))
          ) : reports.length === 0 ? (
            <div className="text-center py-10 text-[#94A3B8] text-xs font-bold uppercase tracking-widest">
              Awaiting System Input...
            </div>
          ) : (
            reports.map((rep, idx) => (
              // Add stagger delay for initial render via inline style logic or standard anim class
              <div key={rep._id} className="animate-slide-in" style={{ animationDelay: `${idx * 0.05}s` }}>
                <HazardCard report={rep} onClick={onHazardClick} />
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* 3. Footer Bar */}
      <div className="p-3 bg-[#020B14] border-t border-[#1E2D4A] shrink-0">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#1E2D4A] flex items-center justify-center text-[#E2E8F0] text-[10px] font-bold uppercase">
                {user?.name?.charAt(0) || 'U'}
            </div>
            <p className="text-[10px] text-[#94A3B8] font-bold truncate">Op. {user?.name}</p>
          </div>
          <button onClick={logout} className="text-[#94A3B8] hover:text-[#FF3333] transition-colors" title="Disconnect">
            <span className="material-symbols-outlined text-[16px]">exit_to_app</span>
          </button>
        </div>
        <p className="text-[8px] text-[#94A3B8]/60 uppercase tracking-widest text-center leading-tight">
          OceanInsight © 2026<br/>
          Connected
        </p>
      </div>

    </aside>
  );
};

export default Sidebar;
