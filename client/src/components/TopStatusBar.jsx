import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const TopStatusBar = ({ stats }) => {
  const { user } = useContext(AuthContext);
  const now = new Date().toLocaleTimeString();

  return (
    <div className="h-12 w-full bg-[#020B14] border-b border-[#1E2D4A] flex items-center justify-between px-6 shrink-0 z-50 shadow-md">
      {/* Left: Branding & Status */}
      <div className="flex items-center gap-6">
        <h1 className="text-[#00E5FF] font-headline font-bold text-lg uppercase tracking-widest leading-none flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px]">radar</span>
          OceanInsight
        </h1>
        <div className="hidden md:flex items-center gap-2 text-[10px] uppercase font-bold text-[#94A3B8] tracking-widest border-l border-[#1E2D4A] pl-6">
          <span className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse"></span>
          System Online
        </div>
      </div>

      {/* Right: Metrics & Analytics Action */}
      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-5 text-[10px] text-[#94A3B8] font-bold uppercase tracking-widest">
           <div className="flex items-center gap-2">
              <span className="text-[#00E5FF]">Total Signals:</span>
              <span className="text-[#E2E8F0]">{stats?.total || 0}</span>
           </div>
           <div className="w-px h-3 bg-[#1E2D4A]"></div>
           <div className="flex items-center gap-2">
              <span className="text-[#FF3333]">Critical:</span>
              <span className="text-[#E2E8F0]">{stats?.bySeverity?.['Critical'] || 0}</span>
           </div>
           <div className="w-px h-3 bg-[#1E2D4A]"></div>
           <div className="flex items-center gap-2">
              <span>Updated:</span>
              <span className="text-[#E2E8F0]">{now}</span>
           </div>
        </div>

        <Link 
          to="/dashboard/analytics"
          className="bg-[#1E2D4A] hover:bg-[#2A3F64] text-[#E2E8F0] transition-colors h-7 px-3 rounded flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest border border-[#2A3F64]"
        >
          <span className="material-symbols-outlined text-[14px]">query_stats</span>
          <span className="hidden sm:inline">Analytics</span>
        </Link>
        
        {user?.role === 'admin' && (
          <Link 
            to="/admin"
            className="bg-[#FF3333]/20 hover:bg-[#FF3333]/40 text-[#FF3333] transition-colors h-7 px-3 rounded flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest border border-[#FF3333]/50"
          >
            <span className="material-symbols-outlined text-[14px]">admin_panel_settings</span>
            <span className="hidden sm:inline">Moderation Portal</span>
          </Link>
        )}
      </div>
    </div>
  );
};

export default TopStatusBar;
