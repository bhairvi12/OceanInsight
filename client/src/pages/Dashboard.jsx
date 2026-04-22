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

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentReports, setRecentReports] = useState([]);
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [statsRes, reportsRes] = await Promise.all([
          api.get('/reports/stats'),
          api.get('/reports')
        ]);
        setStats(statsRes.data);
        setRecentReports(reportsRes.data.slice(0, 5));
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  // --- Chart Data Setups ---
  
  // 1. Pie Chart: Reports By Type
  const pieData = {
    labels: ['Oil Spill', 'Water Pollution', 'Marine Alert', 'Plastic Debris'],
    datasets: [
      {
        data: [
          stats?.byType?.['Oil Spill'] || 0,
          stats?.byType?.['Water Pollution'] || 0,
          stats?.byType?.['Marine Alert'] || 0,
          stats?.byType?.['Plastic Debris'] || 0,
        ],
        backgroundColor: [
          '#ff716c', // Error (Red)
          '#81ecff', // Primary (Cyan)
          '#ffdd00', // Yellow
          '#599cf9', // Tertiary (Blue)
        ],
        borderWidth: 0,
        hoverOffset: 4
      },
    ],
  };

  const pieOptions = {
    plugins: {
      legend: { position: 'right', labels: { color: '#e7e7f1', font: { family: 'Manrope' } } }
    },
    maintainAspectRatio: false
  };

  // 2. Line Chart: Reports Over Time
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
        tension: 0.4, // Smooth curves
        pointBackgroundColor: '#171922',
        pointBorderColor: '#00E5FF',
        pointBorderWidth: 2,
        pointRadius: 4,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#23252f',
        titleColor: '#81ecff',
        bodyColor: '#e7e7f1',
        borderColor: 'rgba(0, 229, 255, 0.2)',
        borderWidth: 1
      }
    },
    scales: {
      x: { 
        grid: { color: 'rgba(255, 255, 255, 0.05)' }, 
        ticks: { color: '#aaaab4', font: { family: 'Manrope', size: 10 } } 
      },
      y: { 
        grid: { color: 'rgba(255, 255, 255, 0.05)' }, 
        ticks: { color: '#aaaab4', stepSize: 1, font: { family: 'Manrope', size: 10 } },
        beginAtZero: true
      }
    }
  };


  return (
    <div className="flex flex-row gap-10 h-full">
      <div className="flex-1 space-y-10 pb-10">
        
        {/* Metric Cards Row */}
        <div className="grid grid-cols-4 gap-6">
          <div className="bg-surface-container p-6 rounded-xl hover:bg-surface-container-high transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 rounded-lg bg-surface-variant text-slate-300">
                <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>dataset</span>
              </div>
              <span className="text-[10px] font-bold text-slate-500 font-headline uppercase tracking-widest">Total Reports</span>
            </div>
            <div className="space-y-1">
              <h2 className="text-3xl font-headline font-bold text-[#00E5FF]">{stats?.total || 0}</h2>
              <p className="text-xs text-slate-500 font-medium">All time logged cases</p>
            </div>
          </div>

          <div className="bg-surface-container p-6 rounded-xl hover:bg-surface-container-high transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 rounded-lg bg-error-container/20 text-error">
                <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>warning</span>
              </div>
              <span className="text-[10px] font-bold text-slate-500 font-headline uppercase tracking-widest">Critical</span>
            </div>
            <div className="space-y-1">
              <h2 className="text-3xl font-headline font-bold text-error">{stats?.bySeverity?.['Critical'] || 0}</h2>
              <p className="text-xs text-slate-500 font-medium">Require immediate action</p>
            </div>
          </div>
          
          <div className="col-span-2 bg-surface-container p-6 rounded-xl transform hover:scale-[1.01] transition-transform">
             <div className="flex items-center gap-4 h-full">
                <div className="flex-1">
                   <h3 className="font-headline font-bold text-slate-200">Severity Distribution</h3>
                   <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="flex justify-between items-center bg-surface-variant px-3 py-2 rounded-lg">
                        <span className="text-sm font-bold text-[#ff716c]">High</span>
                        <span className="text-slate-300 font-headline">{stats?.bySeverity?.['High'] || 0}</span>
                      </div>
                      <div className="flex justify-between items-center bg-surface-variant px-3 py-2 rounded-lg">
                        <span className="text-sm font-bold text-[#ffdd00]">Medium</span>
                        <span className="text-slate-300 font-headline">{stats?.bySeverity?.['Medium'] || stats?.bySeverity?.['Standard'] || 0}</span>
                      </div>
                      <div className="flex justify-between items-center bg-surface-variant px-3 py-2 rounded-lg">
                        <span className="text-sm font-bold text-[#4cff4c]">Low</span>
                        <span className="text-slate-300 font-headline">{stats?.bySeverity?.['Low'] || stats?.bySeverity?.['Informational'] || 0}</span>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-3 gap-6 h-80">
          
          {/* Line Chart */}
          <section className="col-span-2 bg-surface-container p-6 rounded-xl flex flex-col relative">
            <div className="flex justify-between items-center mb-4">
               <div>
                 <h3 className="text-lg font-headline font-bold text-slate-100">Hazard Reports Timeline</h3>
                 <p className="text-xs text-slate-500">Activity volume over the last 14 days</p>
               </div>
            </div>
            <div className="flex-1 w-full min-h-0 relative">
               {stats?.overTime?.length > 0 ? (
                 <Line data={lineData} options={lineOptions} />
               ) : (
                 <div className="absolute inset-0 flex items-center justify-center text-slate-600 text-sm">
                   Not enough temporal data yet.
                 </div>
               )}
            </div>
          </section>

          {/* Pie Chart */}
          <section className="col-span-1 bg-surface-container p-6 rounded-xl flex flex-col relative">
            <h3 className="text-lg font-headline font-bold text-slate-100 mb-2">Reports By Type</h3>
            <div className="flex-1 w-full min-h-0 relative flex items-center justify-center">
               <Pie data={pieData} options={pieOptions} />
            </div>
          </section>

        </div>
      </div>

      <aside className="w-96 flex flex-col gap-6 sticky top-0 h-full">
         <section className="bg-surface-container p-6 rounded-xl h-full flex flex-col">
           <h3 className="text-sm font-headline font-bold text-[#00E5FF] uppercase tracking-widest mb-6 flex items-center gap-2">
             <span className="material-symbols-outlined">rss_feed</span>
             Live Feeds
           </h3>
           <div className="space-y-4 overflow-y-auto pr-2 flex-1 relative">
             {recentReports.map(report => (
               <div key={report._id} className="p-4 rounded-xl bg-surface flex flex-col border border-outline-variant/20 hover:border-[#00E5FF]/30 transition-colors group">
                 <div className="flex justify-between items-start mb-2">
                   <h4 className="font-bold text-slate-200 text-sm group-hover:text-[#00E5FF] transition-colors">{report.title}</h4>
                   <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase shadow-sm" style={{
                     backgroundColor: report.severity === 'Critical' ? '#ff2a2a' : 
                                      report.severity === 'High' ? '#ff716c' :
                                      report.severity === 'Standard' || report.severity === 'Medium' ? '#ffdd00' : '#4cff4c',
                     color: report.severity === 'Standard' || report.severity === 'Medium' ? '#000' : '#fff'
                   }}>
                     {report.severity}
                   </span>
                 </div>
                 <p className="text-xs text-slate-400 mb-3">{report.location.name}</p>
                 <div className="flex items-center gap-2 mt-auto">
                    <div className="h-6 w-6 rounded-full bg-surface-variant flex items-center justify-center text-slate-300 text-[10px] font-bold">
                       {report.reportedBy?.name?.charAt(0) || 'U'}
                    </div>
                    <span className="text-[10px] text-slate-500">
                      Reporting Officer • {new Date(report.createdAt).toLocaleDateString()}
                    </span>
                 </div>
               </div>
             ))}
             {recentReports.length === 0 && (
               <div className="text-slate-500 text-xs text-center py-10 border border-dashed border-outline-variant/30 rounded-xl">
                 No reports detected. Sensors clear.
               </div>
             )}
           </div>
        </section>
      </aside>
    </div>
  );
};

export default Dashboard;
