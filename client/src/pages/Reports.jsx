import React, { useState } from 'react';
import api from '../api';

const Reports = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    hazardType: 'Oil Spill',
    severity: 'Standard',
    locationName: '',
    lat: '',
    lng: ''
  });
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMsg('');

    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (image) {
      data.append('image', image);
    }

    try {
      await api.post('/reports', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setSuccessMsg("Report submitted successfully!");
      setFormData({
        title: '',
        description: '',
        hazardType: 'Oil Spill',
        severity: 'Standard',
        locationName: '',
        lat: '',
        lng: ''
      });
      setImage(null);
    } catch (err) {
      alert("Error submitting report");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="bg-surface-container rounded-2xl p-8 border border-outline-variant/30">
        <h2 className="text-2xl font-headline font-bold text-[#00E5FF] mb-6 flex items-center gap-3">
          <span className="material-symbols-outlined">add_circle</span>
          Submit Hazard Report
        </h2>
        
        {successMsg && (
          <div className="bg-primary/20 border border-primary text-primary p-4 rounded-xl mb-6 flex items-center gap-3">
             <span className="material-symbols-outlined">check_circle</span>
             {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Hazard Type</label>
              <select name="hazardType" value={formData.hazardType} onChange={handleInputChange} className="w-full bg-surface-container-high border border-outline-variant/50 rounded-lg px-4 py-3 text-slate-200 focus:outline-none">
                <option>Oil Spill</option>
                <option>Water Pollution</option>
                <option>Marine Alert</option>
                <option>Plastic Debris</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Severity</label>
              <select name="severity" value={formData.severity} onChange={handleInputChange} className="w-full bg-surface-container-high border border-outline-variant/50 rounded-lg px-4 py-3 text-slate-200 focus:outline-none">
                <option>Informational</option>
                <option>Standard</option>
                <option>High</option>
                <option>Critical</option>
              </select>
            </div>
          </div>

          <div>
             <label className="block text-sm font-medium text-slate-400 mb-2">Title</label>
             <input type="text" name="title" value={formData.title} onChange={handleInputChange} required className="w-full bg-surface-container-high border border-outline-variant/50 rounded-lg px-4 py-3 text-slate-200 focus:outline-none" />
          </div>

          <div>
             <label className="block text-sm font-medium text-slate-400 mb-2">Description</label>
             <textarea name="description" value={formData.description} onChange={handleInputChange} required rows="4" className="w-full bg-surface-container-high border border-outline-variant/50 rounded-lg px-4 py-3 text-slate-200 focus:outline-none"></textarea>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-3">
               <label className="block text-sm font-medium text-slate-400 mb-2">Location Name</label>
               <input type="text" name="locationName" value={formData.locationName} onChange={handleInputChange} required className="w-full bg-surface-container-high border border-outline-variant/50 rounded-lg px-4 py-3 text-slate-200 focus:outline-none" />
            </div>
            <div className="col-span-1">
               <label className="block text-sm font-medium text-slate-400 mb-2">Latitude</label>
               <input type="number" step="any" name="lat" value={formData.lat} onChange={handleInputChange} required className="w-full bg-surface-container-high border border-outline-variant/50 rounded-lg px-4 py-3 text-slate-200 focus:outline-none" />
            </div>
            <div className="col-span-1">
               <label className="block text-sm font-medium text-slate-400 mb-2">Longitude</label>
               <input type="number" step="any" name="lng" value={formData.lng} onChange={handleInputChange} required className="w-full bg-surface-container-high border border-outline-variant/50 rounded-lg px-4 py-3 text-slate-200 focus:outline-none" />
            </div>
          </div>

          <div>
             <label className="block text-sm font-medium text-slate-400 mb-2">Upload Evidence (Image)</label>
             <input type="file" onChange={handleFileChange} accept="image/*" className="w-full text-sm text-slate-400 file:mr-4 file:py-3 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-[#00E5FF]/10 file:text-[#00E5FF] hover:file:bg-[#00E5FF]/20 transition-all"/>
          </div>

          <button disabled={isSubmitting} type="submit" className="w-full py-4 rounded-lg abyssal-gradient text-on-primary-container font-headline font-bold tracking-widest uppercase text-sm mt-8 transition-transform active:scale-[0.98] opacity-90 disabled:opacity-50 hover:opacity-100">
            {isSubmitting ? 'Uploading...' : 'Submit Report'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Reports;
