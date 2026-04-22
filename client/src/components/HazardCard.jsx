import React from 'react';
import SeverityBadge from './SeverityBadge';

// Helper to format time relative to now (e.g., "5m ago")
const timeAgo = (dateString) => {
  const date = new Date(dateString);
  const seconds = Math.floor((new Date() - date) / 1000);
  
  if (seconds < 60) return `${seconds}s ago`;
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const HazardCard = ({ report, onClick }) => {
  return (
    <div 
      onClick={() => onClick && onClick(report)}
      className="p-4 rounded border border-[#1E2D4A] bg-[#0A192F] hover:bg-[#112239] hover:border-[#2A3F64] transition-all cursor-pointer flex flex-col gap-2"
    >
      <div className="flex justify-between items-start">
        <h4 className="font-bold text-[#E2E8F0] text-sm leading-tight group-hover:text-[#00E5FF] transition-colors line-clamp-1">{report.title}</h4>
        <SeverityBadge severity={report.severity} />
      </div>
      
      <div className="flex items-center gap-1 text-[#94A3B8] text-[11px] uppercase tracking-wide">
        <span className="material-symbols-outlined text-[14px]">my_location</span>
        <span className="truncate">{report.location.name}</span>
      </div>

      <div className="flex justify-between items-end mt-2">
         <span className="text-xs font-bold text-[#00E5FF] bg-[#00E5FF]/10 px-2 py-1 rounded">
           {report.hazardType}
         </span>
         <span className="text-[10px] text-[#94A3B8]">
           {timeAgo(report.createdAt)}
         </span>
      </div>
    </div>
  );
};

export default HazardCard;
