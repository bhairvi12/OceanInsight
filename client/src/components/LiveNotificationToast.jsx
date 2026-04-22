import React, { useEffect } from 'react';

const LiveNotificationToast = ({ alert, onClose }) => {
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(onClose, 8000);
      return () => clearTimeout(timer);
    }
  }, [alert, onClose]);

  if (!alert) return null;

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[2000] bg-[#0A192F] border border-[#FF3333] text-[#E2E8F0] px-4 py-3 rounded shadow-[0_0_20px_rgba(255,51,51,0.2)] flex items-center gap-3 animate-[slideDown_0.3s_ease-out]">
      <div className="flex items-center justify-center w-8 h-8 rounded bg-[#FF3333]/10 text-[#FF3333] shrink-0 border border-[#FF3333]/30 pulse-ring">
         <span className="material-symbols-outlined text-[18px]">warning</span>
      </div>
      <div>
        <p className="text-[10px] text-[#FF3333] font-bold uppercase tracking-widest mb-0.5">Critical Subspace Ping</p>
        <p className="text-sm font-bold truncate max-w-sm">{alert.title}</p>
      </div>
    </div>
  );
};

// Add standard tailwind arbitrary animation if slideDown isn't available
export default LiveNotificationToast;
