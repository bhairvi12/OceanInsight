import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api';
import SeverityBadge from '../components/SeverityBadge';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [filter, setFilter] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    fetchReports();
  }, [filter]);

  useEffect(() => {
    // Initial fetch to purely get pending count for the badge
    if (filter !== 'pending') {
       api.get(`/admin/reports?status=pending`)
         .then(res => setPendingCount(res.data.length))
         .catch(err => console.error(err));
    }
  }, [filter]);

  useEffect(() => {
    const socket = io(SOCKET_URL);
    socket.on('new_pending_report', (report) => {
      if (filter === 'pending') {
        setReports(prev => [report, ...prev]);
      }
      setPendingCount(prev => prev + 1);
    });

    return () => socket.disconnect();
  }, [filter]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/reports?status=${filter}`);
      setReports(res.data);
      if (filter === 'pending') setPendingCount(res.data.length);
    } catch (error) {
      console.error('Failed to load reports', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    try {
      if (action === 'delete') {
        if (!window.confirm("Permanently delete this report? This cannot be undone.")) return;
        await api.delete(`/admin/reports/${id}`);
      } else {
        await api.put(`/admin/reports/${id}/${action}`);
      }
      
      // Instantly remove from view
      setReports(prev => prev.filter(r => r._id !== id));
      if (filter === 'pending') setPendingCount(prev => Math.max(0, prev - 1));
      
    } catch (error) {
      console.error(`Failed to ${action} report`, error);
      alert(`Error: ${error.response?.data?.message || 'Action failed'}`);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans">
      
      {/* Sidebar Navigation */}
      <div className="w-64 bg-white border-r border-slate-300 flex flex-col z-10 shadow-lg">
        <div className="p-6 border-b border-slate-300">
          <div className="flex items-center gap-3 text-black mb-1">
            <span className="material-symbols-outlined text-[28px]">admin_panel_settings</span>
            <h1 className="text-xl font-bold font-headline uppercase tracking-widest leading-none">Moderation</h1>
          </div>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Admin Control Portal</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setFilter('pending')}
            className={`w-full flex items-center justify-between px-4 py-3 border-2 transition-all font-bold text-xs uppercase tracking-wider ${filter === 'pending' ? 'border-amber-500 bg-amber-50 text-amber-900' : 'border-transparent text-slate-600 hover:bg-slate-100'}`}
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">pending_actions</span>
              Pending Queue
            </div>
            {pendingCount > 0 && (
              <span className="bg-amber-500 text-white text-[10px] px-2 py-0.5 rounded-full">{pendingCount}</span>
            )}
          </button>

          <button 
            onClick={() => setFilter('approved')}
            className={`w-full flex items-center gap-2 px-4 py-3 border-2 transition-all font-bold text-xs uppercase tracking-wider ${filter === 'approved' ? 'border-emerald-500 bg-emerald-50 text-emerald-900' : 'border-transparent text-slate-600 hover:bg-slate-100'}`}
          >
             <span className="material-symbols-outlined text-[18px]">verified</span>
             Approved Data
          </button>

          <button 
            onClick={() => setFilter('rejected')}
            className={`w-full flex items-center gap-2 px-4 py-3 border-2 transition-all font-bold text-xs uppercase tracking-wider ${filter === 'rejected' ? 'border-red-500 bg-red-50 text-red-900' : 'border-transparent text-slate-600 hover:bg-slate-100'}`}
          >
             <span className="material-symbols-outlined text-[18px]">block</span>
             Rejected Data
          </button>
        </nav>

        <div className="p-4 border-t border-slate-300">
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-black hover:bg-slate-800 text-white border-2 border-black font-bold uppercase tracking-widest text-xs transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Exit to Map
          </button>
        </div>
      </div>

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-300 flex items-center justify-between px-8 shadow-sm">
           <h2 className="text-lg font-bold uppercase tracking-widest text-slate-800">
             {filter} Reports
           </h2>
           <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">
             {user?.name} [ADMIN]
           </div>
        </header>

        {/* Scrollable List */}
        <main className="flex-1 overflow-y-auto p-8">
          {loading ? (
             <div className="flex justify-center text-slate-400 mt-20">
               <span className="material-symbols-outlined animate-spin text-[40px]">refresh</span>
             </div>
          ) : reports.length === 0 ? (
            <div className="text-center mt-20 p-10 border-2 border-dashed border-slate-300 text-slate-500 font-bold uppercase tracking-widest">
              No contents found in {filter} queue
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {reports.map(report => (
                 <div key={report._id} className="bg-white border-2 border-slate-300 p-6 flex flex-col shadow-md hover:shadow-xl transition-shadow relative group">
                    
                    {report.imageUrl && (
                      <div className="w-full h-48 bg-slate-200 mb-4 border border-slate-300 overflow-hidden relative">
                         <img src={report.imageUrl} alt="Hazard" className="w-full h-full object-cover" />
                      </div>
                    )}
                    
                    <div className="flex justify-between items-start mb-2">
                       <h3 className="font-bold text-lg text-black">{report.title}</h3>
                       <SeverityBadge severity={report.severity} />
                    </div>
                    
                    <p className="text-sm text-slate-600 mb-4 flex-1 line-clamp-3">{report.description}</p>
                    
                    <div className="bg-slate-50 p-3 border border-slate-200 text-xs text-slate-500 space-y-1 mb-6">
                      <div className="flex justify-between">
                        <span className="font-bold">TYPE:</span>
                        <span className="text-black">{report.hazardType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-bold">LOCATION:</span>
                        <span className="text-black truncate max-w-[200px]">{report.location.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-bold">REPORTER:</span>
                        <span className="text-black">{report.reportedBy?.name || 'Unknown'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-bold">TIME:</span>
                        <span className="text-black">{new Date(report.createdAt).toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="flex gap-2 mt-auto">
                       {filter === 'pending' && (
                         <>
                           <button onClick={() => handleAction(report._id, 'approve')} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[10px] uppercase tracking-widest py-3 transition-colors flex justify-center gap-1">
                              <span className="material-symbols-outlined text-[14px]">done</span> Approve
                           </button>
                           <button onClick={() => handleAction(report._id, 'reject')} className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold text-[10px] uppercase tracking-widest py-3 transition-colors flex justify-center gap-1">
                              <span className="material-symbols-outlined text-[14px]">close</span> Reject
                           </button>
                         </>
                       )}
                       <button onClick={() => handleAction(report._id, 'delete')} className="bg-red-500 hover:bg-red-600 text-white font-bold text-[10px] uppercase tracking-widest py-3 px-4 transition-colors flex justify-center gap-1 border-l border-white/20">
                          <span className="material-symbols-outlined text-[14px]">delete</span>
                       </button>
                    </div>
                 </div>
              ))}
            </div>
          )}
        </main>
      </div>
      
    </div>
  );
};

export default AdminDashboard;
