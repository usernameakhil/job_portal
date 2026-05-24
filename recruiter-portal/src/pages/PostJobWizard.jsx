import React, { useState } from 'react';
import CorporateSidebar from '../components/CorporateSidebar';
import { recruiterApi } from '../services/recruiterApi';

export default function PostJobWizard() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    skillsRaw: '',
    experienceRequired: 0,
    districtLocation: 'NTR',
    salaryMin: '',
    salaryMax: ''
  });
  const [status, setStatus] = useState({ message: '', isError: false, processing: false });

  const apDistricts = [
    'Alluri Sitharama Raju', 'Anakapalli', 'Anantapur', 'Annamayya', 'Bapatla', 'Chittoor', 
    'Dr. B.R. Ambedkar Konaseema', 'East Godavari', 'Eluru', 'Guntur', 'Kakinada', 'Krishna', 
    'Kurnool', 'Nandyal', 'NTR', 'Palnadu', 'Parvathipuram Manyam', 'Prakasam', 'Srikakulam', 
    'Sri Potti Sriramulu Nellore', 'Sri Sathya Sai', 'Tirupati', 'Visakhapatnam', 'Vizianagaram', 
    'West Godavari', 'YSR Kadapa'
  ];

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    setStatus({ message: 'Registering job description vectors...', isError: false, processing: true });

    const skillsArray = formData.skillsRaw
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const payload = {
      title: formData.title,
      description: formData.description,
      requiredSkills: skillsArray,
      experienceRequired: parseInt(formData.experienceRequired, 10),
      districtLocation: formData.districtLocation,
      salaryRange: {
        min: parseInt(formData.salaryMin, 10),
        max: parseInt(formData.salaryMax, 10)
      }
    };

    try {
      await recruiterApi.createJob(payload);
      setStatus({ message: 'Success: Vacancy published anonymized to system feeds.', isError: false, processing: false });
      setTimeout(() => window.location.href = '/applicant-pool', 1200);
    } catch (err) {
      setStatus({ message: err.message, isError: true, processing: false });
    }
  };

  return (
    <CorporateSidebar>
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="bg-slate-900 p-6 text-white border-b-4 border-emerald-600">
          <h2 className="text-2xl font-black tracking-tight">Publish Vacancy Requirement</h2>
          <p className="text-xs text-slate-400 mt-1">Configure structural position descriptions for systemic match screening.</p>
        </div>

        {status.message && (
          <div className={`m-6 p-4 rounded-xl text-xs font-bold border ${status.isError ? 'bg-red-50 border-red-200 text-red-800' : 'bg-emerald-50 border-emerald-200 text-emerald-800'}`}>
            {status.message}
          </div>
        )}

        <form onSubmit={handlePostSubmit} className="p-6 space-y-6">
          {step === 1 ? (
            <div className="space-y-4">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Step 01 / Core Position Properties</h4>
              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-1 tracking-wider">Job Designation Title</label>
                <input type="text" required placeholder="e.g., Senior Systems Architect, Logistics Executive" className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 font-medium text-slate-900 outline-none" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-1 tracking-wider">Functional Role Description</label>
                <textarea required placeholder="Provide clear task responsibilities and project parameters..." className="w-full border border-slate-300 rounded-xl p-4 text-sm focus:ring-2 focus:ring-emerald-500 h-32 resize-none font-medium text-slate-800 outline-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
              <button type="button" onClick={() => setStep(2)} className="w-full py-3.5 bg-slate-900 text-white font-black text-xs uppercase tracking-widest rounded-xl">Continue to Parameters</button>
            </div>
          ) : (
            <div className="space-y-4">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Step 02 / Matching Constraints & Filters</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 mb-1 tracking-wider">Target Placement District</label>
                  <select className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 bg-white font-medium text-slate-900 outline-none" value={formData.districtLocation} onChange={e => setFormData({...formData, districtLocation: e.target.value})}>
                    {apDistricts.map((d, i) => <option key={i} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 mb-1 tracking-wider">Required Experience Threshold (Years)</label>
                  <input type="number" required min="0" className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 font-medium text-slate-900 outline-none" value={formData.experienceRequired} onChange={e => setFormData({...formData, experienceRequired: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 mb-1 tracking-wider">Minimum Monthly Salary (₹)</label>
                  <input type="number" required placeholder="e.g., 25000" className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 font-medium text-slate-900 outline-none" value={formData.salaryMin} onChange={e => setFormData({...formData, salaryMin: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 mb-1 tracking-wider">Maximum Monthly Salary (₹)</label>
                  <input type="number" required placeholder="e.g., 60000" className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 font-medium text-slate-900 outline-none" value={formData.salaryMax} onChange={e => setFormData({...formData, salaryMax: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-1 tracking-wider">Required Core Skills Matrix (Comma-Separated)</label>
                <textarea required placeholder="React, Python, SQL, Project Coordination" className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 h-20 resize-none font-semibold text-slate-800 outline-none" value={formData.skillsRaw} onChange={e => setFormData({...formData, skillsRaw: e.target.value})} />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setStep(1)} className="flex-1 py-3.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-black text-xs uppercase tracking-widest rounded-xl transition-all">Back</button>
                <button type="submit" disabled={status.processing} className="flex-grow py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md">Publish Job Vector</button>
              </div>
            </div>
          )}
        </form>
      </div>
    </CorporateSidebar>
  );
}