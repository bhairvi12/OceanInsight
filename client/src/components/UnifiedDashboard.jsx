import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import io from 'socket.io-client';
import api from '../api';

import TopStatusBar from './TopStatusBar';
import Sidebar from './Sidebar';
import ReportModal from './ReportModal';
import LiveNotificationToast from './LiveNotificationToast';
import AnalyticsModal from './AnalyticsModal';

// Fix for default Leaflet markers just in case
delete L.Icon.Default.prototype._getIconUrl;

const createTacticalIcon = (severity) => {
  let colorClass = 'bg-[#E6C28A]'; // Informational
  if (severity === 'Critical') colorClass = 'bg-[#FF3333] pulse-ring';
  else if (severity === 'High') colorClass = 'bg-[#FF7133]';
  else if (severity === 'Medium' || severity === 'Standard') colorClass = 'bg-[#FFB800]';
  else if (severity === 'Low') colorClass = 'bg-[#00E676]';

  return L.divIcon({
    className: 'custom-html-icon bg-transparent border-0',
    html: `<div class="w-3.5 h-3.5 rounded-full ${colorClass} border border-[#020B14] shadow-[0_0_10px_currentColor] transition-transform hover:scale-150 cursor-pointer"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7]
  });
};

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const globalSocket = io(SOCKET_URL);

function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center && center.lat !== null && center.lng !== null) {
      // Use flyTo for smooth dynamic camera panning
      map.flyTo([center.lat, center.lng], zoom || map.getZoom(), {
        animate: true,
        duration: 1.5
      });
    }
  }, [center]);
  return null;
}

const UnifiedDashboard = ({ modal }) => {
  const navigate = useNavigate();

  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState(null);
  const [newAlert, setNewAlert] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Tactical Map States
  const [radius, setRadius] = useState(1000);
  const [isFiltering, setIsFiltering] = useState(false);
  const [center, setCenter] = useState({ lat: 20, lng: 0 }); 
  const [zoomLevel, setZoomLevel] = useState(3);

  const loadData = async (lat = null, lng = null, r = null) => {
    setIsLoading(true);
    try {
      const statsReq = api.get('/reports/stats');
      let reportsUrl = '/reports';
      if (lat !== null && lng !== null && r !== null) {
        reportsUrl = `/reports/nearby?lat=${lat}&lng=${lng}&radius=${r}`;
      }
      const reportsReq = api.get(reportsUrl);
      
      const [statsRes, reportsRes] = await Promise.all([statsReq, reportsReq]);
      setStats(statsRes.data);
      setReports(reportsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    const socket = io(SOCKET_URL);
    
    socket.on('report_approved', (report) => {
      // 1. Prepend to live feed via the state
      setReports(prev => [report, ...prev]);
      
      // 2. Trigger notification Toast
      setNewAlert(report);
      
      // 3. Re-flash the map markers
      loadData();
    });

    return () => socket.disconnect();
  }, []);

  const handleSearchNearby = () => {
    if (navigator.geolocation) {
      setIsFiltering(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setCenter({ lat, lng });
          setZoomLevel(9);
          loadData(lat, lng, radius);
          setIsFiltering(false);
        },
        (error) => {
           console.error("Geo error:", error);
           alert("Could not acquire lock on your geolocation.");
           loadData();
           setIsFiltering(false);
        }
      );
    }
  };

  const handleClearFilters = () => {
    setCenter({ lat: 20, lng: 0 });
    setZoomLevel(3);
    setRadius(1000);
    loadData();
  };

  const flyToHazard = (report) => {
    setCenter({ lat: report.location.coordinates[1], lng: report.location.coordinates[0] });
    setZoomLevel(12);
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#020B14] fixed inset-0">
      
      {/* 1. Thin Top Status Bar */}
      <TopStatusBar stats={stats} />

      {/* 2. Main Dashboard Split */}
      <div className="flex flex-1 min-h-0 relative">
        
        {/* Left Sidebar (25%) */}
        <div className="w-1/4 min-w-[300px] max-w-[400px] h-full z-20 shadow-[5px_0_15px_rgba(0,0,0,0.5)]">
          <Sidebar 
            reports={reports} 
            isLoading={isLoading}
            radius={radius}
            setRadius={setRadius}
            isFiltering={isFiltering}
            onSearchNearby={handleSearchNearby}
            onClearFilters={handleClearFilters}
            onHazardClick={flyToHazard}
          />
        </div>

        {/* Right Map Area (75%) */}
        <div className="flex-1 h-full relative z-10">
          
          <LiveNotificationToast alert={newAlert} onClose={() => setNewAlert(null)} />

          <MapContainer 
            center={[center.lat, center.lng]} 
            zoom={zoomLevel} 
            style={{ height: '100%', width: '100%', background: '#020b14' }} 
            zoomControl={false}
          >
            <ChangeView center={center} zoom={zoomLevel} />
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; CARTO'
            />
            
            {center.lat !== 20 && radius < 1000 && (
              <Circle 
                center={[center.lat, center.lng]} 
                radius={radius * 1000} 
                pathOptions={{ color: '#00E5FF', fillColor: '#00E5FF', fillOpacity: 0.05, weight: 1, dashArray: '4' }}
              />
            )}

            {reports.map((report) => (
              <Marker 
                key={report._id} 
                position={[report.location.coordinates[1], report.location.coordinates[0]]}
                icon={createTacticalIcon(report.severity)}
              >
                <Popup className="tactical-popup min-w-48">
                  <div className="p-0 bg-[#0A192F] text-[#E2E8F0]">
                    <h3 className="font-bold text-[#E2E8F0] text-sm mb-1">{report.title}</h3>
                    <p className="text-[9px] text-[#94A3B8] uppercase tracking-widest mb-2 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">my_location</span>
                      {report.location.name}
                    </p>
                    
                    <div className="flex gap-2 mb-2">
                      <span className="bg-[#1E2D4A] px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider text-[#00E5FF]">
                        {report.hazardType}
                      </span>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                        report.severity === 'Critical' ? 'bg-[#FF3333] text-white' : 
                        report.severity === 'High' ? 'bg-[#FF7133] text-white' : 
                        report.severity === 'Standard' || report.severity === 'Medium' ? 'bg-[#FFB800] text-black' : 
                        'bg-[#00E676] text-black'
                      }`}>
                        {report.severity}
                      </span>
                    </div>
                    
                    <p className="text-[10px] text-[#94A3B8] font-medium leading-relaxed max-h-20 overflow-y-auto custom-scrollbar pr-1">
                      {report.description}
                    </p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
          
          {/* Floating Report Button */}
          <button 
            onClick={() => navigate('/dashboard/report')}
            className="absolute bottom-8 right-8 z-[1000] bg-[#FF3333] hover:bg-[#ff5555] text-white transition-transform transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,51,51,0.5)] px-5 py-3 rounded-full flex items-center gap-2 font-bold uppercase tracking-wider text-xs border border-transparent"
          >
            <span className="material-symbols-outlined text-[18px]">add_alert</span>
            Report Hazard
          </button>

        </div>
      </div>

      {modal === 'report' && (
        <ReportModal onClose={() => navigate('/dashboard')} onSuccess={loadData} />
      )}

      {modal === 'analytics' && (
        <AnalyticsModal />
      )}

    </div>
  );
};

export default UnifiedDashboard;
