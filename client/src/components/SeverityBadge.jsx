import React from 'react';

const severityMap = {
  Critical: { bg: 'bg-[#FF3333]', text: 'text-white' },
  High: { bg: 'bg-[#FF7133]', text: 'text-white' },
  Medium: { bg: 'bg-[#FFB800]', text: 'text-black' },
  Standard: { bg: 'bg-[#FFB800]', text: 'text-black' }, // Fallback alias
  Low: { bg: 'bg-[#00E676]', text: 'text-black' },
  Informational: { bg: 'bg-[#E6C28A]', text: 'text-black' },
};

const SeverityBadge = ({ severity }) => {
  const styles = severityMap[severity] || severityMap['Informational'];

  return (
    <span className={`px-2 py-[2px] rounded text-[10px] font-bold uppercase tracking-wider ${styles.bg} ${styles.text}`}>
      {severity}
    </span>
  );
};

export default SeverityBadge;
