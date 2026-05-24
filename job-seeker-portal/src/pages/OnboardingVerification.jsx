import React, { useState, useEffect } from 'react';
import SeekerSidebar from '../components/SeekerSidebar';
import { seekerApi } from '../services/seekerApi';

export default function OnboardingVerification({ onNavigate, mode = "onboard" }) {
  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    nativePlace: '',
    district: 'NTR',
    casteCategory: 'OC',
    subCaste: '',
    degree: '',
    specialization: '',
    institution: '',
    passingYear: '2026',
    skillsRaw: '',
    aadhaarRaw: ''
  });

  const [uiState, setUiState] = useState({ loading: mode === "edit", message: '', isError: false });

  const apDistricts = [
    'Alluri Sitharama Raju', 'Anakapalli', 'Anantapur', 'Annamayya', 'Bapatla', 'Chittoor', 
    'Dr. B.R. Ambedkar Konaseema', 'East Godavari', 'Eluru', 'Guntur', 'Kakinada', 'Krishna', 
    'Kurnool', 'Nandyal', 'NTR', 'Palnadu', 'Parvathipuram Manyam', 'Prakasam', 'Srikakulam', 
    'Sri Potti Sriramulu Nellore', 'Sri Sathya Sai', 'Tirupati', 'Visakhapatnam', 'Vizianagaram', 
    'West Godavari', 'YSR Kadapa'
  ];

  // If in Edit Mode, pull active profile data points reactively directly from MongoDB Atlas clusters
  useEffect(() => {
    if (mode === "edit") {
      seekerApi.getProfile()
        .then(res => {
          if (res.profile) {
            const p = res.profile;
            setFormData({
              fullName: p.fullName || '',
              dob: p.dob ? p.dob.split('T')[0] : '',
              nativePlace: p.nativePlace || '',
              district: p.district || 'NTR',
              casteCategory: p.casteCategory || 'OC',
              subCaste: p.subCaste || '',
              degree: p.qualification?.degree || '',
              specialization: p.qualification?.specialization || '',
              institution: p.qualification?.institution || '',
              passingYear: p.qualification?.passingYear || '2026',
              skillsRaw: p.skills ? p.skills.join(', ') : '',
              aadhaarRaw: '' // Keep secure entry variables clean on loading transitions
            });
          }
        })
        .catch(err => setUiState({ loading: false, message: err.message, isError: true }))
        .finally(() => setUiState(prev => ({ ...prev, loading: false })));
    }
  }, [mode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUiState({ loading: true, message: 'Committing profile state parameters to cluster ledger...', isError: false });

    const cleanSkillsArray = formData.skillsRaw
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const submissionPayload = {
      fullName: formData.fullName,
      dob: formData.dob,
      nativePlace: formData.nativePlace,
      district: formData.district,
      casteCategory: formData.casteCategory,
      subCaste: formData.subCaste,
      qualification: {
        degree: formData.degree,
        specialization: formData.specialization,
        institution: formData.institution,
        passingYear: parseInt(formData.passingYear, 10)
      },
      skills: cleanSkillsArray,
      ...(formData.aadhaarRaw ? { srcIdentifierRaw: formData.aadhaarRaw } : {})
    };

    try {
      await seekerApi.syncProfileData(submissionPayload);
      setUiState({ loading: false, message: 'Profile states synchronized successfully.', isError: false });
      setTimeout(() => onNavigate('/profile'), 1000);
    } catch (err) {
      setUiState({ loading: false, message: err.message, isError: true });
    }
  };

  if (uiState.loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center font-mono text-emerald-400 p-4">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xs uppercase tracking-widest animate-pulse">Synchronizing remote data states...</p>
        </div>
      </div>
    );
  }

  const formView = (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
      <div className="bg-slate-900 p-6 text-white border-b-4 border-emerald-600 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black tracking-tight">{mode === "edit" ? "Modify Profile Settings" : "Statutory Verification Onboarding"}</h2>
          <p className="text-xs text-slate-400 mt-1">Fields sync directly into government talent databases via protected connections.</p>
        </div>
        <span className="bg-slate-800 text-slate-400 border border-slate-700 px-3 py-1 text-[11px] rounded-lg font-mono font-bold">
          Tenant Workspace: Seeker
        </span>
      </div>

      {uiState.message && (
        <div className={`m-6 p-4 rounded-xl text-xs font-bold border ${
          uiState.isError ? 'bg-red-50 border-red-200 text-red-800' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
        }`}>
          {uiState.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-6 space-y-6 divide-y divide-slate-100">
        {/* Step 1: Legal Identity Metrics */}
        <div className="space-y-4">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">01 / Demographics Identity</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black uppercase text-slate-700 mb-1 tracking-wider">Full Legal Name</label>
              <input type="text" required className="w-full border border-slate-300 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-900" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-black uppercase text-slate-700 mb-1 tracking-wider">Date of Birth</label>
              <input type="date" required className="w-full border border-slate-300 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-900 bg-white" value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} />
            </div>
            {mode === "onboard" && (
              <div className="md:col-span-2">
                <label className="block text-xs font-black uppercase text-slate-700 mb-1 tracking-wider">Aadhaar Identification Token</label>
                <input 
                  type="text" required maxLength="12" pattern="[0-9]{12}" placeholder="Enter 12-digit numeric identity array" 
                  className="w-full border border-slate-300 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500 font-mono tracking-widest text-slate-900" 
                  value={formData.aadhaarRaw} onChange={e => setFormData({...formData, aadhaarRaw: e.target.value.replace(/\D/g, '')})} 
                />
                <p className="text-[10px] text-slate-400 mt-1 font-medium">Strings are explicitly masked automatically at the gateway endpoint to protect user privacy.</p>
              </div>
            )}
          </div>
        </div>

        {/* Step 2: Regional Placement Framework */}
        <div className="space-y-4 pt-6">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">02 / Regional Parameter Sync</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black uppercase text-slate-700 mb-1 tracking-wider">Native City / Town / Village</label>
              <input type="text" required className="w-full border border-slate-300 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-900" value={formData.nativePlace} onChange={e => setFormData({...formData, nativePlace: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-black uppercase text-slate-700 mb-1 tracking-wider">District Location Jurisdiction</label>
              <select className="w-full border border-slate-300 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500 bg-white font-medium text-slate-900" value={formData.district} onChange={e => setFormData({...formData, district: e.target.value})}>
                {apDistricts.map((d, idx) => <option key={idx} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Step 3: Reservation Allocation Matrix */}
        <div className="space-y-4 pt-6">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">03 / Caste Matrix Mapping</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black uppercase text-slate-700 mb-1 tracking-wider">Statutory Caste Category</label>
              <select className="w-full border border-slate-300 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500 bg-white font-medium text-slate-900" value={formData.casteCategory} onChange={e => setFormData({...formData, casteCategory: e.target.value})}>
                <option value="OC">OC (General Pool)</option>
                <option value="BC-A">BC-A</option>
                <option value="BC-B">BC-B</option>
                <option value="BC-C">BC-C</option>
                <option value="BC-D">BC-D</option>
                <option value="BC-E">BC-E</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-black uppercase text-slate-700 mb-1 tracking-wider">Sub-Caste Core String</label>
              <input type="text" placeholder="e.g., Kapu, Reddy, Madiga, etc." className="w-full border border-slate-300 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-900" value={formData.subCaste} onChange={e => setFormData({...formData, subCaste: e.target.value})} />
            </div>
          </div>
        </div>

        {/* Step 4: Academics & Qualifications */}
        <div className="space-y-4 pt-6">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">04 / Academic Records</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black uppercase text-slate-700 mb-1 tracking-wider">Highest Degree Attained</label>
              <input type="text" placeholder="B.Tech, MCA, Diploma" required className="w-full border border-slate-300 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-900" value={formData.degree} onChange={e => setFormData({...formData, degree: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-black uppercase text-slate-700 mb-1 tracking-wider">Specialization Discipline</label>
              <input type="text" placeholder="Computer Science, ECE" required className="w-full border border-slate-300 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-900" value={formData.specialization} onChange={e => setFormData({...formData, specialization: e.target.value})} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-black uppercase text-slate-700 mb-1 tracking-wider">Institution / Campus Name</label>
              <input type="text" required className="w-full border border-slate-300 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-900" value={formData.institution} onChange={e => setFormData({...formData, institution: e.target.value})} />
            </div>
          </div>
        </div>

        {/* Step 5: Skills Allocation Framework */}
        <div className="space-y-4 pt-6">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">05 / Matching Optimization Skills</h4>
          <div>
            <label className="block text-xs font-black uppercase text-slate-700 mb-1 tracking-wider">Professional Skill Core Nodes (Comma Separated)</label>
            <textarea required placeholder="React, Node.js, AWS, SQL Server, Excel" className="w-full border border-slate-300 rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-emerald-500 h-24 resize-none leading-relaxed font-semibold text-slate-800" value={formData.skillsRaw} onChange={e => setFormData({...formData, skillsRaw: e.target.value})} />
          </div>
        </div>

        <div className="pt-6">
          <button type="submit" className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-md shadow-emerald-600/10 transition-all">
            Commit Ledger Modifications
          </button>
        </div>
      </form>
    </div>
  );

  // If in edit mode, wrap output fields inside layout shells cleanly
  return mode === "edit" ? <SeekerSidebar onNavigate={onNavigate}>{formView}</SeekerSidebar> : <div className="p-4 sm:p-8 bg-slate-900 min-h-screen flex items-center justify-center">{formView}</div>;
}