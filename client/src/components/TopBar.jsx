import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const TopBar = ({ title }) => {
  const { user } = useContext(AuthContext);

  return (
    <header className="fixed top-0 right-0 left-72 h-20 bg-[#171922]/60 backdrop-blur-[24px] z-40 flex justify-between items-center px-10 shadow-[0_40px_40px_-15px_rgba(0,229,255,0.06)]">
      <div className="flex items-center gap-4">
        <div className="flex gap-6">
          <span className="text-[#00E5FF] font-bold font-headline text-sm tracking-widest uppercase">
            {title || 'OceanInsight'}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 px-4 py-2 bg-surface-container-low rounded-full border border-outline-variant/10">
          <span className="material-symbols-outlined text-slate-400 text-lg">search</span>
          <input className="bg-transparent border-none outline-none focus:ring-0 text-sm w-48 text-on-surface" placeholder="Search..." type="text"/>
        </div>
        <div className="flex gap-3">
          <button className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-[#00E5FF] transition-colors relative">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>
          </button>
        </div>
        <div className="w-10 h-10 rounded-full border-2 border-[#00E5FF]/30 bg-surface-container flex items-center justify-center text-slate-300 font-bold uppercase">
          {user?.name?.charAt(0) || 'U'}
        </div>
      </div>
    </header>
  );
};

export default TopBar;
