import React, { useState } from 'react';
import api from '../api';

const ReportModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '', description: '', locationName: '', lat: '', lng: ''
  });
  // Dropdowns removed to enforce Smart Classification based strictly on description logic on backend!
  // Wait, the backend rules said "If user does not provide... auto-classify". And "If user provides... compare".
  // So we should still provide dropdowns.
  const [hazardType, setHazardType] = useState('');
  const [severity, setSeverity] = useState('');

  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setImage(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (hazardType) data.append('hazardType', hazardType);
    if (severity) data.append('severity', severity);
    if (image) data.append('image', image);

    try {
      await api.post('/reports', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      onSuccess();
      onClose();
    } catch (err) {
      alert("Error logging protocol");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-[#020B14]/80 flex items-center justify-center p-4">
      <div className="bg-[#0A192F] border border-[#1E2D4A] rounded shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar relative">
        
        {/* Header */}
        <div className="sticky top-0 bg-[#0A192F] border-b border-[#1E2D4A] p-4 md:p-6 flex justify-between items-center z-10">
          <h2 className="text-xl font-headline font-bold text-[#E2E8F0] flex items-center gap-3 uppercase tracking-widest">
            <span className="material-symbols-outlined text-[#00E5FF]">add_location</span>
            Log Hazard Record
          </h2>
          <button onClick={onClose} className="text-[#94A3B8] hover:text-[#FF3333] transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-5">
          {/* Classification Overrides */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#94A3B8] mb-1">Hazard Override (Opt)</label>
              <select value={hazardType} onChange={(e) => setHazardType(e.target.value)} className="w-full bg-[#020B14] border border-[#1E2D4A] rounded px-3 py-2 text-sm text-[#E2E8F0] focus:outline-none focus:border-[#00E5FF]">
                <option value="">Auto-Detect via AI</option>
                <option value="Oil Spill">Oil Spill</option>
                <option value="Water Pollution">Water Pollution</option>
                <option value="Marine Alert">Marine Alert</option>
                <option value="Plastic Debris">Plastic Debris</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#94A3B8] mb-1">Severity Override (Opt)</label>
              <select value={severity} onChange={(e) => setSeverity(e.target.value)} className="w-full bg-[#020B14] border border-[#1E2D4A] rounded px-3 py-2 text-sm text-[#E2E8F0] focus:outline-none focus:border-[#00E5FF]">
                <option value="">Auto-Detect via AI</option>
                <option value="Informational">Informational</option>
                <option value="Low">Low</option>
                <option value="Standard">Standard / Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>

          <div>
             <label className="block text-[10px] font-bold uppercase tracking-widest text-[#94A3B8] mb-1">Title</label>
             <input type="text" name="title" value={formData.title} onChange={handleInputChange} required className="w-full bg-[#020B14] border border-[#1E2D4A] rounded px-3 py-2 text-sm text-[#E2E8F0] focus:outline-none focus:border-[#00E5FF]" />
          </div>

          <div>
             <label className="block text-[10px] font-bold uppercase tracking-widest text-[#94A3B8] mb-1">Log Description (Used for Auto-Classification)</label>
             <textarea name="description" value={formData.description} onChange={handleInputChange} required rows="3" className="w-full bg-[#020B14] border border-[#1E2D4A] rounded px-3 py-2 text-sm text-[#E2E8F0] focus:outline-none focus:border-[#00E5FF] placeholder-[#94A3B8]" placeholder="Example: Massive oil spill detected from pipeline 7..."></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
               <label className="block text-[10px] font-bold uppercase tracking-widest text-[#94A3B8] mb-1">Location Name</label>
               <input type="text" name="locationName" value={formData.locationName} onChange={handleInputChange} required className="w-full bg-[#020B14] border border-[#1E2D4A] rounded px-3 py-2 text-sm text-[#E2E8F0] focus:outline-none focus:border-[#00E5FF]" />
            </div>
            <div className="md:col-span-1">
               <label className="block text-[10px] font-bold uppercase tracking-widest text-[#94A3B8] mb-1">Lat (Y)</label>
               <input type="number" step="any" name="lat" value={formData.lat} onChange={handleInputChange} required className="w-full bg-[#020B14] border border-[#1E2D4A] rounded px-3 py-2 text-sm text-[#E2E8F0] focus:outline-none focus:border-[#00E5FF]" />
            </div>
            <div className="md:col-span-1">
               <label className="block text-[10px] font-bold uppercase tracking-widest text-[#94A3B8] mb-1">Lng (X)</label>
               <input type="number" step="any" name="lng" value={formData.lng} onChange={handleInputChange} required className="w-full bg-[#020B14] border border-[#1E2D4A] rounded px-3 py-2 text-sm text-[#E2E8F0] focus:outline-none focus:border-[#00E5FF]" />
            </div>
          </div>

          <div>
             <label className="block text-[10px] font-bold uppercase tracking-widest text-[#94A3B8] mb-1">Upload Visual Context (Image)</label>
             <div className="border border-dashed border-[#1E2D4A] rounded p-4 bg-[#020B14] hover:border-[#00E5FF]/50 transition-colors">
               <input type="file" onChange={handleFileChange} accept="image/*" className="w-full text-xs text-[#94A3B8] file:mr-4 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-bold file:bg-[#1E2D4A] file:text-[#00E5FF] hover:file:bg-[#2A3F64] transition-all focus:outline-none cursor-pointer" />
             </div>
          </div>

          <div className="pt-4 border-t border-[#1E2D4A] flex justify-end gap-3">
             <button type="button" onClick={onClose} className="px-5 py-2 rounded border border-[#1E2D4A] text-[#94A3B8] text-xs font-bold uppercase hover:bg-[#1E2D4A] transition-colors">Cancel</button>
             <button disabled={isSubmitting} type="submit" className="px-5 py-2 rounded bg-[#00E5FF] text-[#020B14] text-xs font-bold uppercase tracking-wide hover:bg-[#00A3B5] transition-colors flex items-center gap-2">
                {isSubmitting ? 'Transmitting...' : 'Transmit Report'}
                {!isSubmitting && <span className="material-symbols-outlined text-[16px]">send</span>}
             </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default ReportModal;
