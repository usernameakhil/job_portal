// recruiter-portal/src/pages/RecruiterLogin.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Integrated client-side routing
import { recruiterApi } from '../services/recruiterApi';

export default function RecruiterLogin() {
  const navigate = useNavigate(); // Initialized the routing hook
  const [form, setForm] = useState({
    phone: '',
    name: '',
    cin: '',
    industry: 'Technology Frameworks'
  });
  
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1 = Details Registry | 2 = OTP Code Entry
  const [uiState, setUiState] = useState({ processing: false, message: '', isError: false });

  const industrialSectors = [
    'Technology Frameworks', 'Electronics Manufacturing', 'Heavy Heavy Industries', 
    'Logistics & Supply Chain Management', 'Pharmaceuticals & Health Infrastructure', 
    'Financial Capital Services', 'Construction & Infrastructure Engineering'
  ];

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setUiState({ processing: true, message: '', isError: false });

    try {
      await recruiterApi.requestOtp({
        phoneNumber: form.phone,
        companyName: form.name,
        cinNumber: form.cin,
        industryType: form.industry
      });
      setStep(2);
      setUiState({ 
        processing: false, 
        message: 'A verification passkey has been logged to the system terminal.', 
        isError: false 
      });
    } catch (err) {
      setUiState({ 
        processing: false, 
        message: err.message || 'Corporate registry validation failed.', 
        isError: true 
      });
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setUiState({ processing: true, message: '', isError: false });

    try {
      const data = await recruiterApi.verifyOtp(form.phone, otp);
      localStorage.setItem('recruiterToken', data.token);
      
      // Fixed client-side route change preserves single page application context on Vercel
      navigate('/applicant-pool');
    } catch (err) {
      setUiState({ 
        processing: false, 
        message: err.message || 'Verification aborted. Key mismatch.', 
        isError: true 
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
      
      {/* LEFT PORTION: GRAPHICAL VISUAL DATA MODULE */}
      <div className="hidden md:flex md:w-[70%] bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 p-12 lg:p-16 flex-col justify-between relative overflow-hidden text-white border-r border-slate-800">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        
        <div className="space-y-4 z-10 relative">
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight max-w-2xl leading-tight">
            Job Provider Portal
          </h1>
          <p className="text-slate-400 font-medium text-sm lg:text-base max-w-xl leading-relaxed">
            Enterprise verification access gate for approved recruiters. Publish active job mandates, query double-blind competency matrices, and track state-wide candidate deployments safely.
          </p>
        </div>
      </div>

      {/* RIGHT PORTION: REFINED AUTHENTICATION CONTROL CONSOLE */}
      <div className="w-full md:w-[30%] bg-white p-8 sm:p-10 flex flex-col justify-center border-t md:border-t-0 border-slate-200 shadow-2xl">
        <div className="space-y-6 max-w-sm w-full mx-auto">
          
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Recruiter Login</h2>
            <p className="text-xs text-slate-500 font-medium">Authenticate corporate operational privileges via single-use token.</p>
          </div>

          {uiState.message && (
            <div className={`p-3 text-xs font-bold border rounded-xl leading-normal ${
              uiState.isError ? 'bg-red-50 border-red-200 text-red-700' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
            }`}>
              {uiState.message}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-black tracking-wider text-slate-700">Company Registered Name</label>
                <input
                  type="text" required placeholder="Enter corporate title"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
                  value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-black tracking-wider text-slate-700">Corporate Identification Number (CIN)</label>
                <input
                  type="text" required maxLength="21" placeholder="21-Digit Unique Code"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono tracking-wider font-bold text-slate-900 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
                  value={form.cin} onChange={e => setForm({ ...form, cin: e.target.value.toUpperCase() })}
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-black tracking-wider text-slate-700">Industrial Category Sector</label>
                <select
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500"
                  value={form.industry} onChange={e => setForm({ ...form, industry: e.target.value })}
                >
                  {industrialSectors.map((sector, idx) => (
                    <option key={idx} value={sector}>{sector}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-black tracking-wider text-slate-700">Mobile Communications Link</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold text-sm">+91</span>
                  <input
                    type="tel" required maxLength="10" pattern="[0-9]{10}" placeholder="Authorized phone number"
                    className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium tracking-wide text-slate-900 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
                    value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value.replace(/\D/g, '') })}
                  />
                </div>
              </div>

              <button type="submit" disabled={uiState.processing} className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md">
                {uiState.processing ? 'Validating Account...' : 'Register Corporate Entity'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-black tracking-wider text-slate-700">One-Time Security Passkey (OTP)</label>
                <input
                  type="text" required maxLength="6" placeholder="6-Digit Secure Code"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl outline-none text-slate-900 tracking-widest text-center text-xl font-black focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
                  value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                />
                <p className="text-[11px] text-slate-400 text-center mt-2 font-medium">A verification token has been routed to +91 {form.phone}</p>
              </div>

              <button type="submit" disabled={uiState.processing} className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md">
                {uiState.processing ? 'Verifying Credentials...' : 'Authorize Corporate Signatures'}
              </button>
            </form>
          )}

        </div>
      </div>

    </div>
  );
}