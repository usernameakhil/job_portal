// job-seeker-portal/src/pages/ProfileManagement.jsx
import React, { useState, useEffect } from 'react';
import SeekerSidebar from '../components/SeekerSidebar';

export default function ProfileManagement({ onNavigate }) {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    nativePlace: '',
    district: 'Prakasam', // Hardlocked to Prakasam
    mandal: 'Ongole',    // Default Mandal choice
    casteCategory: 'OC',
    subCaste: '',
    degree: '',
    specialization: '',
    institution: '',
    passingYear: '2026'
  });

  const [uiState, setUiState] = useState({ loading: true, message: '', error: '' });

  // Official list of Mandals within the Prakasam District
  const prakasamMandals = [
    'Ardhaveedu', 'Ballikurava', 'Bestavaripeta', 'Chandra Sekhara Puram', 'Chimakurthi', 
    'Cumbum', 'Darsi', 'Donakonda', 'Giddalur', 'Hanumanthuni Padu', 'Inkollu', 
    'Janakavarampanguluru', 'Kambham', 'Kanigiri', 'Karamchedu', 'Kondapi', 'Korisapadu', 
    'Kotha Patnam', 'Kurichedu', 'Lingasamudram', 'Maddipadu', 'Markapur', 'Marripudi', 
    'Mundlamuru', 'Naguluppala Padu', 'Ongole', 'Pamur', 'Parchur', 'Podili', 
    'Ponnaluru', 'Pullalacheruvu', 'Racherla', 'Santhanuthala Padu', 'Singarayakonda', 
    'Tarlupadu', 'Tallur', 'Tangutur', 'Tripuranthakam', 'Veligandla', 'Yerragondapalem'
  ].sort(); // Sorts alphabetically for easier user scanning

  const fetchProfileData = async () => {
    try {
      setUiState(prev => ({ ...prev, loading: true, error: '' }));
      const response = await fetch('https://job-portal-backend-68x8.onrender.com/api/v1/seeker/profile/me', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('seekerToken')}` }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to parse database matrices.');

      const sk = data.seeker || data.profile;
      setProfile(sk);

      if (sk && sk.fullName && sk.casteCategory) {
        setFormData({
          fullName: sk.fullName || '',
          nativePlace: sk.nativePlace || '',
          district: 'Prakasam', // Safely enforce Prakasam identity locally
          mandal: sk.mandal || 'Ongole',
          casteCategory: sk.casteCategory || 'OC',
          subCaste: sk.subCaste || '',
          degree: sk.qualification?.degree || '',
          specialization: sk.qualification?.specialization || '',
          institution: sk.qualification?.institution || '',
          passingYear: String(sk.qualification?.passingYear || '2026')
        });
        setIsEditing(false);
      } else {
        setIsEditing(true);
        setUiState(prev => ({ ...prev, message: 'Complete your statutory profile fields to initialize your job-matching feed.' }));
      }
    } catch (err) {
      setUiState(prev => ({ ...prev, error: err.message }));
    } finally {
      setUiState(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setUiState(prev => ({ ...prev, error: '', message: '', loading: true }));

    try {
      const response = await fetch('https://job-portal-backend-68x8.onrender.com/api/v1/seeker/profile/update', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('seekerToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          nativePlace: formData.nativePlace,
          district: 'Prakasam', // Enforced persistence variable
          mandal: formData.mandal,
          casteCategory: formData.casteCategory,
          subCaste: formData.subCaste,
          qualification: {
            degree: formData.degree,
            specialization: formData.specialization,
            institution: formData.institution,
            passingYear: Number(formData.passingYear)
          }
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Database persistence error.');

      const updatedSeeker = data.seeker || data.profile;
      setProfile(updatedSeeker);
      
      setUiState({ loading: false, message: 'Profile variables synchronized successfully.', error: '' });
      setIsEditing(false);
    } catch (err) {
      setUiState(prev => ({ ...prev, error: err.message, loading: false }));
    }
  };

  if (uiState.loading && !profile) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-mono text-xs text-slate-400">
        <p className="animate-pulse">Loading secure profile data properties...</p>
      </div>
    );
  }

  return (
    <SeekerSidebar onNavigate={onNavigate}>
      <div className="space-y-6 max-w-4xl mx-auto">
        
        {/* HEADER BRAND BLOCK */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Verified Candidate Profile Hub</h1>
          <p className="text-xs text-slate-500 mt-0.5">Prakasam District Job Seeker Registration Desk.</p>
        </div>

        {/* ALERTS FEEDBACK BLOCKS */}
        {uiState.error && <div className="p-4 bg-red-50 text-red-700 font-bold border border-red-200 rounded-xl text-xs">{uiState.error}</div>}
        {uiState.message && <div className="p-4 bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 rounded-xl text-xs">{uiState.message}</div>}

        {isEditing ? (
          /* 📋 EDIT ENTRY FORM */
          <form onSubmit={handleFormSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
            <div className="p-6 space-y-6 divide-y divide-slate-100">
              
              <div className="space-y-4">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest font-mono">01 / Demographics & Localization</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase font-black tracking-wider text-slate-700 mb-1">Full Legal Name</label>
                    <input type="text" required className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 outline-none focus:bg-white" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-black tracking-wider text-slate-700 mb-1">Native City / Town / Village</label>
                    <input type="text" required className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 outline-none focus:bg-white" value={formData.nativePlace} onChange={e => setFormData({...formData, nativePlace: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-black tracking-wider text-slate-700 mb-1">Prakasam Mandal Location</label>
                    <select className="w-full px-4 py-2 bg-white border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:border-slate-500 outline-none" value={formData.mandal} onChange={e => setFormData({...formData, mandal: e.target.value})}>
                      {prakasamMandals.map((m, i) => <option key={i} value={m}>{m}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-6">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest font-mono">02 / Caste Reservation Context</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase font-black tracking-wider text-slate-700 mb-1">Affirmative Category Pool</label>
                    <select className="w-full px-4 py-2 bg-white border border-slate-300 rounded-xl text-sm font-semibold text-slate-900" value={formData.casteCategory} onChange={e => setFormData({...formData, casteCategory: e.target.value})}>
                      <option value="OC">OC</option>
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
                    <label className="block text-[10px] uppercase font-black tracking-wider text-slate-700 mb-1">Sub-Caste Classification String</label>
                    <input type="text" placeholder="e.g., Kapu, Reddi, Yadava, Mala, Madiga" className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 outline-none focus:bg-white" value={formData.subCaste} onChange={e => setFormData({...formData, subCaste: e.target.value})} />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-6">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest font-mono">03 / Educational Matrix Ledger</h3>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase font-black tracking-wider text-slate-700 mb-1">Degree Type</label>
                    <input type="text" required placeholder="B.Tech, MCA, BSc, Diploma" className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 outline-none focus:bg-white" value={formData.degree} onChange={e => setFormData({...formData, degree: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-black tracking-wider text-slate-700 mb-1">Specialization</label>
                    <input type="text" required placeholder="CSE, ECE, Mechanical" className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 outline-none focus:bg-white" value={formData.specialization} onChange={e => setFormData({...formData, specialization: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-black tracking-wider text-slate-700 mb-1">Institution Campus</label>
                    <input type="text" required placeholder="e.g., JNTU" className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 outline-none focus:bg-white" value={formData.institution} onChange={e => setFormData({...formData, institution: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-black tracking-wider text-slate-700 mb-1">Passing Year</label>
                    <input type="text" required placeholder="2026" className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 outline-none focus:bg-white" value={formData.passingYear} onChange={e => setFormData({...formData, passingYear: e.target.value})} />
                  </div>
                </div>
              </div>

            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
              {profile && profile.fullName && (
                <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold uppercase hover:bg-slate-100 transition-all">
                  Cancel
                </button>
              )}
              <button 
                type="submit" 
                disabled={uiState.loading}
                className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-sm"
              >
                {uiState.loading ? 'Saving Data...' : 'Commit & Register Profile'}
              </button>
            </div>
          </form>
        ) : (
          /* 💎 DISPLAY DISPLAY INTERFACE (COMPLETED SECTIONS) */
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Card 1: Identity Profile Card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 lg:col-span-2 shadow-xs">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">01 / Structural Identity Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-semibold text-slate-800">
                  <div><span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block mb-0.5">Legal Identity Name</span>{profile?.fullName}</div>
                  <div><span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block mb-0.5">Identity Mask Token</span><span className="font-mono text-xs font-bold bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded text-slate-600">{profile?.aadhaarUIDMasked || 'XXXX-XXXX-[Redacted]'}</span></div>
                  <div><span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block mb-0.5">Communications Identifier</span>{profile?.phoneNumber}</div>
                  <div><span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block mb-0.5">Regional City/Town/Village</span>{profile?.nativePlace}</div>
                  <div className="sm:col-span-2"><span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block mb-0.5">District & Mandal Jurisdiction</span>Prakasam District — {profile?.mandal || 'Ongole'} Mandal</div>
                </div>
              </div>

              {/* Card 2: Caste Reservation Profile Card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">02 / Caste Reservation Context</h3>
                <div className="space-y-4 text-sm font-semibold text-slate-800">
                  <div><span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block mb-0.5">Affirmative Category Tier</span><span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded text-xs font-black">{profile?.casteCategory}</span></div>
                  <div><span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block mb-0.5">Sub-Caste Group Node</span>{profile?.subCaste || 'General Stream'}</div>
                </div>
              </div>

              {/* Card 3: Academic Credentials Profile Card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 lg:col-span-3 shadow-xs">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">03 / Educational Ledger Sync</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm font-semibold text-slate-800">
                  <div><span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block mb-0.5">Attained Degree Stream</span>{profile?.qualification?.degree} ({profile?.qualification?.specialization})</div>
                  <div><span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block mb-0.5">Educational Campus Center</span>{profile?.qualification?.institution}</div>
                  <div><span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block mb-0.5">Passing Evaluation Year</span>{profile?.qualification?.passingYear}</div>
                </div>
              </div>

            </div>

            {/* EDIT CONTROL TRIGGER */}
            <div className="flex justify-end pt-2">
              <button 
                onClick={() => setIsEditing(true)}
                className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md shadow-slate-950/10"
              >
                Edit Profile
              </button>
            </div>
          </div>
        )}
      </div>
    </SeekerSidebar>
  );
}