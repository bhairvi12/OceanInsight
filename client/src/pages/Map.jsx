import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import io from 'socket.io-client';
import api from '../api';

// Create custom icons based on severity
const createCustomIcon = (severity) => {
  let colorClass = 'bg-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.6)]'; // Default Informational
  
  if (severity === 'Critical') colorClass = 'bg-[#ff2a2a] shadow-[0_0_20px_rgba(255,42,42,0.8)] border border-white';
  else if (severity === 'High') colorClass = 'bg-[#ff716c] shadow-[0_0_15px_rgba(255,113,108,0.6)]';
  else if (severity === 'Medium' || severity === 'Standard') colorClass = 'bg-[#ffdd00] shadow-[0_0_15px_rgba(255,221,0,0.6)]';
  else if (severity === 'Low') colorClass = 'bg-[#4cff4c] shadow-[0_0_15px_rgba(76,255,76,0.6)]';

  return L.divIcon({
    className: 'custom-html-icon',
    html: `<div class="w-4 h-4 rounded-full ${colorClass}"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });
};

const socket = io('http://localhost:5000');

// Component to dynamically pan the map
function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center && center.lat !== null && center.lng !== null) {
      map.setView([center.lat, center.lng], map.getZoom());
    }
  }, [center]);
  return null;
}

const MapView = () => {
  const [reports, setReports] = useState([]);
  const [newAlert, setNewAlert] = useState(null);
  
  // Filtering states
  const [radius, setRadius] = useState(1000); // Max distance in km (default very large)
  const [isFiltering, setIsFiltering] = useState(false);
  const [center, setCenter] = useState({ lat: 20, lng: 0 }); // Default center

  const mapRef = useRef(null);

  useEffect(() => {
    fetchReports();

    socket.on('report_approved', (report) => {
      // Small optimization: If filtering by location, technically we should check if the new report is within radius. 
      // For simplicity in UI real-time view, we just prepend it.
      setReports((prev) => [report, ...prev]);
      setNewAlert(report);
      setTimeout(() => setNewAlert(null), 5000);
    });

    return () => socket.off('report_approved');
  }, []);

  const fetchReports = async (lat = null, lng = null, r = null) => {
    try {
      let url = '/reports';
      if (lat !== null && lng !== null && r !== null) {
        url = `/reports/nearby?lat=${lat}&lng=${lng}&radius=${r}`;
      }
      const res = await api.get(url);
      setReports(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearchNearby = () => {
    // Get current center of the map instead of user geolocation to allow exploring oceans freely
    // Since we don't have direct access to map instance here cleanly without useMap context,
    // we use a trick: standard navigation or just prompt. 
    // Actually we can get user geolocation for "nearby me":
    if (navigator.geolocation) {
      setIsFiltering(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setCenter({ lat, lng });
          fetchReports(lat, lng, radius);
          setIsFiltering(false);
        },
        (error) => {
           console.error("Geolocation omitted:", error);
           alert("Could not get your location. Displaying all reports instead.");
           fetchReports();
           setIsFiltering(false);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const handleClearFilters = () => {
    setCenter({ lat: 20, lng: 0 });
    setRadius(1000);
    fetchReports();
  }

  return (
    <div className="relative h-full w-full rounded-2xl overflow-hidden border border-outline-variant/30">
      
      {/* Floating Controls */}
      <div className="absolute top-6 right-6 z-[1000] bg-surface-container/90 backdrop-blur-md p-4 rounded-2xl border border-outline-variant/20 shadow-2xl w-72">
        <h3 className="font-headline font-bold text-slate-200 mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-[#00E5FF]">explore</span>
          Spatial Filter
        </h3>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs text-slate-400 mb-2">
              <span>Radius Filter</span>
              <span className="font-bold text-[#00E5FF]">{radius} km</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="2000" 
              value={radius} 
              onChange={(e) => setRadius(e.target.value)}
              className="w-full accent-[#00E5FF]"
            />
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={handleSearchNearby}
              disabled={isFiltering}
              className="flex-1 py-2 bg-[#00E5FF]/10 text-[#00E5FF] text-xs font-bold rounded-lg hover:bg-[#00E5FF]/20 transition border border-[#00E5FF]/30 disabled:opacity-50"
            >
              {isFiltering ? 'Locating...' : 'Search Near Me'}
            </button>
            <button 
              onClick={handleClearFilters}
              className="px-3 py-2 bg-surface-variant text-slate-300 text-xs font-bold rounded-lg hover:bg-outline-variant/50 transition border border-outline-variant/20"
              title="Reset Filters"
            >
              <span className="material-symbols-outlined text-[16px]">refresh</span>
            </button>
          </div>
        </div>
      </div>

      {newAlert && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-surface-container-high border border-[#00E5FF]/50 text-[#00E5FF] px-6 py-3 rounded-full shadow-[0_0_20px_rgba(0,229,255,0.2)] animate-pulse flex items-center gap-2">
          <span className="material-symbols-outlined text-error">campaign</span>
          <strong>New Alert!</strong> {newAlert.title}
        </div>
      )}

      {/* Modern dark map style via CartoDB */}
      <MapContainer 
        center={[center.lat, center.lng]} 
        zoom={3} 
        style={{ height: '100%', width: '100%' }} 
        className="z-10"
        ref={mapRef}
      >
        <ChangeView center={center} />
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        
        {/* If filtering near user, show a semi-transparent radius circle */}
        {center.lat !== 20 && radius < 1000 && (
          <Circle 
            center={[center.lat, center.lng]} 
            radius={radius * 1000} 
            pathOptions={{ color: '#00E5FF', fillColor: '#00E5FF', fillOpacity: 0.1, weight: 1 }}
          />
        )}

        {reports.map((report) => (
          <Marker 
            key={report._id} 
            position={[report.location.coordinates[1], report.location.coordinates[0]]}
            icon={createCustomIcon(report.severity)}
          >
            <Popup className="custom-popup min-w-48">
              <div className="p-1">
                <h3 className="font-bold text-slate-800 text-base mb-1">{report.title}</h3>
                <p className="text-[10px] text-slate-500 mb-2 uppercase tracking-tight">{report.location.name}</p>
                
                <div className="flex gap-2 mb-3">
                  <span className="bg-slate-800 px-2 py-1 rounded text-[10px] font-bold text-white shadow-sm">
                    {report.hazardType}
                  </span>
                  <span className={`px-2 py-1 rounded text-[10px] font-bold shadow-sm ${
                    report.severity === 'Critical' ? 'bg-red-500 text-white' : 
                    report.severity === 'High' ? 'bg-orange-500 text-white' : 
                    report.severity === 'Standard' || report.severity === 'Medium' ? 'bg-yellow-400 text-slate-900' : 
                    'bg-green-500 text-white'
                  }`}>
                    {report.severity}
                  </span>
                </div>
                
                <p className="text-xs text-slate-600 font-medium leading-relaxed max-h-24 overflow-y-auto pr-1">
                  {report.description}
                </p>
                
                {report.imageUrl && (
                  <img src={report.imageUrl} alt="Hazard" className="w-full h-28 object-cover mt-3 rounded-lg shadow-sm border border-slate-200" />
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;
