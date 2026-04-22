import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Line, Pie } from 'react-chartjs-2';
import api from '../api';
import { useNavigate } from 'react-router-dom';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

const AnalyticsModal = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/reports/stats')
      .then(res => {
        setStats(res.data);
        setIsLoading(false);
      })
      .catch(console.error);
  }, []);

  const close = () => navigate('/dashboard');

  const pieData = {
    labels: ['Oil Spill', 'Water Pollution', 'Marine Alert', 'Plastic Debris'],
    datasets: [{
      data: [
        stats?.byType?.['Oil Spill'] || 0,
        stats?.byType?.['Water Pollution'] || 0,
        stats?.byType?.['Marine Alert'] || 0,
        stats?.byType?.['Plastic Debris'] || 0,
      ],
      backgroundColor: ['#FF3333', '#00E5FF', '#FFB800', '#00E676'],
      borderWidth: 0,
    }],
  };

  const lineLabels = stats?.overTime?.map(d => d._id) || [];
  const lineCounts = stats?.overTime?.map(d => d.count) || [];

  const lineData = {
    labels: lineLabels,
    datasets: [
      {
        label: 'Hazard Reports',
        data: lineCounts,
        borderColor: '#00E5FF',
        backgroundColor: 'rgba(0, 229, 255, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#0A192F',
        pointBorderColor: '#00E5FF',
        pointBorderWidth: 2,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { color: 'rgba(30, 45, 74, 0.5)' }, ticks: { color: '#94A3B8' } },
      y: { grid: { color: 'rgba(30, 45, 74, 0.5)' }, ticks: { color: '#94A3B8', stepSize: 1 } }
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-[#020B14]/90 flex items-center justify-center p-4">
      <div className="bg-[#0A192F] border border-[#1E2D4A] rounded shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col relative animate-slide-in">
        
        <div className="p-5 border-b border-[#1E2D4A] flex justify-between items-center">
          <h2 className="text-xl font-headline font-bold text-[#E2E8F0] flex items-center gap-3 uppercase tracking-widest">
            <span className="material-symbols-outlined text-[#00E5FF]">analytics</span>
            Global Analytics Data
          </h2>
          <button onClick={close} className="text-[#94A3B8] hover:text-[#FF3333] transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
          {isLoading ? (
            <div className="col-span-2 text-center text-[#94A3B8] text-sm animate-pulse">Aggregating historical records...</div>
          ) : (
            <>
              {/* Over Time */}
              <div className="bg-[#020B14] border border-[#1E2D4A] p-5 rounded flex flex-col h-80">
                <h3 className="text-sm font-bold text-[#94A3B8] uppercase tracking-widest mb-4">Activity Timeline (14 Days)</h3>
                <div className="flex-1">
                  <Line data={lineData} options={lineOptions} />
                </div>
              </div>
              
              {/* By Type */}
              <div className="bg-[#020B14] border border-[#1E2D4A] p-5 rounded flex flex-col h-80 items-center justify-center relative">
                <h3 className="text-sm font-bold text-[#94A3B8] uppercase tracking-widest mb-4 w-full text-left absolute top-5 left-5">Distribution Map</h3>
                <div className="h-48 w-48 mt-6">
                  <Pie data={pieData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
                </div>
                <div className="w-full flex justify-center gap-4 mt-6 flex-wrap pb-2">
                  <div className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-[#FF3333]"></span><span className="text-xs text-[#94A3B8] uppercase font-bold">Oil</span></div>
                  <div className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-[#00E5FF]"></span><span className="text-xs text-[#94A3B8] uppercase font-bold">Water</span></div>
                  <div className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-[#FFB800]"></span><span className="text-xs text-[#94A3B8] uppercase font-bold">Alert</span></div>
                  <div className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-[#00E676]"></span><span className="text-xs text-[#94A3B8] uppercase font-bold">Debris</span></div>
                </div>
              </div>
            </>
          )}
        </div>
        
      </div>
    </div>
  );
};

export default AnalyticsModal;
