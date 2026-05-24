// recruiter-portal/src/pages/CorporateProfile.jsx
import React, { useState, useEffect } from 'react';
import CorporateSidebar from '../components/CorporateSidebar';

export default function CorporateProfile() {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    companyName: '',
    cinNumber: '',
    industryType: 'Technology Frameworks',
    registeredDistrict: 'NTR',
    headquartersCity: ''
  });

  const [ui, setUi] = useState({ loading: true, error: '', message: '' });

  const apDistricts = [
    'Alluri Sitharama Raju', 'Anakapalli', 'Anantapur', 'Annamayya', 'Bapatla', 'Chittoor', 
    'Dr. B.R. Ambedkar Konaseema', 'East Godavari', 'Eluru', 'Guntur', 'Kakinada', 'Krishna', 
    'Kurnool', 'Nandyal', 'NTR', 'Palnadu', 'Parvathipuram Manyam', 'Prakasam', 'Srikakulam', 
    'Sri Potti Sriramulu Nellore', 'Sri Sathya Sai', 'Tirupati', 'Visakhapatnam', 'Vizianagaram', 
    'West Godavari', 'YSR Kadapa'
  ];

  const industrialSectors = [
    'Technology Frameworks', 'Electronics Manufacturing', 'Heavy Industries', 
    'Logistics & Supply Chain Management', 'Pharmaceuticals & Health Infrastructure', 
    'Financial Capital Services', 'Construction & Infrastructure Engineering'
  ];

  // 📡 Synchronize view states directly with backend API endpoints
  const fetchCorporateProfile = async () => {
    try {
      setUi(prev => ({ ...prev, loading: true, error: '' }));
      const response = await fetch('http://localhost:8080/api/v1/recruiter/profile/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('recruiterToken')}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to poll corporate registers.');

      const corp = data.corporate;
      setProfile(corp);

      // Map backend database values cleanly to input form targets
      setFormData({
        companyName: corp.companyName || '',
        cinNumber: corp.cinNumber || '',
        industryType: corp.industryType || 'Technology Frameworks',
        registeredDistrict: corp.registeredDistrict || 'NTR',
        headquartersCity: corp.headquartersCity || ''
      });

      // ⚡ FIRST TIME ONBOARDING INTERCEPT: If profile properties are provisional, force edit layout view
      if (!corp.companyName || corp.companyName === "Provisional Entity" || !corp.headquartersCity) {
        setIsEditing(true);
        setUi(prev => ({ ...prev, message: '🏢 Welcome! Please complete your corporate verification metadata parameters to activate your recruiting dashboard environment.' }));
      }
    } catch (err) {
      setUi(prev => ({ ...prev, error: err.message }));
    } finally {
      setUi(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    fetchCorporateProfile();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUi(prev => ({ ...prev, loading: true, error: '', message: '' }));

    try {
      const response = await fetch('http://localhost:8080/api/v1/recruiter/profile/update', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('recruiterToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to sync corporate changes.');

      setUi(prev => ({ ...prev, message: '✅ Success: Profile ledger data properties synchronized successfully.' }));
      setIsEditing(false);
      await fetchCorporateProfile(); // Refresh cache memory attributes
    } catch (err) {
      setUi(prev => ({ ...prev, error: err.message, loading: false }));
    }
  };

  if (ui.loading && !profile) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-mono text-xs text-slate-400">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="uppercase tracking-widest animate-pulse">Running database pipeline sync...</p>
        </div>
      </div>
    );
  }

  return (
    <CorporateSidebar>
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Top Header Information Card */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 shadow-2xs">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Enterprise Identity Core</h1>
            <p className="text-xs text-slate-500 mt-0.5">Statutory parameters verified and stored inside decentralized state employment registers.</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border rounded-xl w-fit">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] font-mono font-bold text-slate-600 uppercase tracking-wider">Live Database Link</span>
          </div>
        </div>

        {ui.error && <div className="p-4 bg-red-50 text-red-700 font-bold border border-red-200 rounded-xl text-xs shadow-2xs">⚠️ {ui.error}</div>}
        {ui.message && <div className="p-4 bg-blue-50 text-blue-800 font-bold border border-blue-200 rounded-xl text-xs shadow-2xs">{ui.message}</div>}

        {isEditing ? (
          /* 🛠️ MODE A: DYNAMIC PROFILE EDITOR CONFIGURATION CARD */
          <form onSubmit={handleUpdateProfile} className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-fade-in">
            <div className="bg-slate-900 px-6 py-4 border-b border-slate-800 flex justify-between items-center">
              <h3 className="text-xs font-black uppercase tracking-widest text-emerald-400 font-mono">Modifying Repository Coordinates</h3>
              <span className="text-[10px] bg-slate-800 text-slate-400 border border-slate-700 px-2 py-0.5 rounded font-mono">Phone Ref: {profile?.phoneNumber}</span>
            </div>
            
            <div className="p-6 space-y-6 divide-y divide-slate-100">
              <div className="space-y-4">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">01 / MCA Corporate Metadata</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase font-black tracking-wider text-slate-700 mb-1">Company Legal Entity Name</label>
                    <input 
                      type="text" required placeholder="Andhra Tech Enterprise Ltd"
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
                      value={formData.companyName} onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase font-black tracking-wider text-slate-700 mb-1">Corporate Identification Number (CIN)</label>
                    <input 
                      type="text" required maxLength="21" placeholder="21-Digit Government String"
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm font-mono font-bold tracking-wide text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 shadow-inner"
                      value={formData.cinNumber} onChange={e => setFormData({ ...formData, cinNumber: e.target.value.toUpperCase() })}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-6">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">02 / Regional Operations Hub</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs uppercase font-black tracking-wider text-slate-700 mb-1">Industrial Category Sector</label>
                    <select 
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                      value={formData.industryType} onChange={e => setFormData({ ...formData, industryType: e.target.value })}
                    >
                      {industrialSectors.map((s, idx) => <option key={idx} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs uppercase font-black tracking-wider text-slate-700 mb-1">District Jurisdiction Location</label>
                    <select 
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                      value={formData.registeredDistrict} onChange={e => setFormData({ ...formData, registeredDistrict: e.target.value })}
                    >
                      {apDistricts.map((d, idx) => <option key={idx} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs uppercase font-black tracking-wider text-slate-700 mb-1">Headquarters Base City</label>
                    <input 
                      type="text" required placeholder="e.g., Visakhapatnam, Guntur"
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500"
                      value={formData.headquartersCity} onChange={e => setFormData({ ...formData, headquartersCity: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
              {/* Defensive Cancel Switch: Block users from backing out if profile name hasn't been established */}
              {profile?.companyName && profile.companyName !== "Provisional Entity" && (
                <button 
                  type="button" onClick={() => setIsEditing(false)}
                  className="px-5 py-2 text-slate-600 hover:bg-slate-200 rounded-xl font-bold text-xs uppercase tracking-wider transition-all"
                >
                  Cancel & Dismiss
                </button>
              )}
              <button 
                type="submit"
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md"
              >
                Save Profile Parameters
              </button>
            </div>
          </form>
        ) : (
          /* 🏢 MODE B: COMPLIANT SYSTEM PROFILE HUB DASHBOARD VIEW */
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Segment block summary */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 lg:col-span-2 shadow-2xs">
                <div>
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 mb-4">01 / Vetted Corporate Identity</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm font-semibold text-slate-800">
                    <div>
                      <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block mb-0.5">Registered Legal Entity Name</span>
                      <span className="text-base font-bold text-slate-900">{profile.companyName}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block mb-0.5">Corporate Identification Number (CIN)</span>
                      <span className="font-mono text-xs font-bold bg-slate-50 border border-slate-200 px-2 py-0.5 rounded text-slate-700 tracking-wide block w-fit mt-1">{profile.cinNumber}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block mb-0.5">Industrial Sector Classification</span>
                      <span className="text-slate-800">{profile.industryType}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block mb-0.5">Primary Mobile Comms Link</span>
                      <span className="text-slate-800 font-mono">{profile.phoneNumber}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 mb-4">02 / Regional Operations Hub</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm font-semibold text-slate-800">
                    <div>
                      <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block mb-0.5">District Jurisdiction Office</span>
                      <span className="text-slate-900">📍 {profile.registeredDistrict || 'NTR'} District</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block mb-0.5">Headquarters Base Location</span>
                      <span className="text-slate-800">{profile.headquartersCity}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Sidebar Status Block */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 h-fit space-y-4 shadow-2xs">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">03 / State Compliance Vetting</h3>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block">Account Audit Status</span>
                  <span className="inline-block mt-1 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-black rounded-xl">
                    🛡️ Verified Active Account
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-normal font-medium pt-2">
                  This profile has been cross-referenced against business verification nodes and cleared for active candidate screening operations.
                </p>
              </div>
            </div>

            {/* Profile editing activation control footer link section */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-2xs">
              <div className="text-xs text-slate-500 font-medium">Want to alter operational headquarters locations or business names?</div>
              <button 
                onClick={() => setIsEditing(true)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-xs transition-all"
              >
                Modify Profile Parameters
              </button>
            </div>
          </div>
        )}
      </div>
    </CorporateSidebar>
  );
}