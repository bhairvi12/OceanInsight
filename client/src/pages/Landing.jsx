import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div 
      className="min-h-screen flex flex-col pt-12 items-center justify-center p-4 relative bg-cover bg-center"
      style={{ backgroundImage: "url('/landing-bg.jpg')" }}
    >
      {/* Dark Overlay over the background image */}
      <div className="absolute inset-0 bg-[#020B14]/80 z-0"></div>
      
      <div className="z-10 bg-white border border-slate-300 p-10 md:p-14 shadow-2xl text-center max-w-2xl w-full">
        
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="w-14 h-14 bg-[#00E5FF] flex items-center justify-center text-black border-2 border-black">
            <span className="material-symbols-outlined text-[32px]">radar</span>
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-headline font-bold text-black uppercase tracking-widest leading-none mb-4">
          OceanInsight
        </h1>
        <h2 className="text-sm font-headline font-bold text-slate-600 uppercase tracking-[0.3em] mb-8">
          Global Maritime Tactical Network
        </h2>

        <p className="text-slate-700 mb-10 text-sm leading-relaxed max-w-xl mx-auto font-medium">
          Access the real-time operational dashboard. Track critical maritime incidents, deploy field telemetry, and analyze live global hazard data through a unified cartographic interface.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/register"
            className="px-8 py-3 bg-[#00E5FF] hover:bg-[#00A3B5] text-black font-bold uppercase tracking-widest text-xs border-2 border-black transition-colors flex items-center justify-center gap-2"
          >
            Getting Started
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
          <Link 
            to="/login"
            className="px-8 py-3 bg-white hover:bg-slate-100 text-black border-2 border-black font-bold uppercase tracking-widest text-xs transition-colors flex items-center justify-center"
          >
            Auth Login
          </Link>
        </div>
      </div>
      
      
    </div>
  );
};

export default Landing;
