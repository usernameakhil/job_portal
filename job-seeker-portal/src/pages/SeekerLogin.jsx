// job-seeker-portal/src/pages/SeekerLogin.jsx
import React, { useState } from 'react';

export default function SeekerLogin() {
  const [step, setStep] = useState(1); // 1 = Phone Entry, 2 = OTP Code Entry
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [uiState, setUiState] = useState({ processing: false, error: '', message: '' });

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setUiState({ processing: true, error: '', message: '' });
    
    try {
      const response = await fetch('https://job-portal-backend-68x8.onrender.com/api/v1/seeker/auth/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: phone })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to dispatch passkey.');
      
      setStep(2);
      setUiState({ processing: false, error: '', message: 'A security passkey verification string has been initialized.' });
    } catch (err) {
      setUiState({ processing: false, error: err.message, message: '' });
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setUiState({ processing: true, error: '', message: '' });

    try {
      const response = await fetch('https://job-portal-backend-68x8.onrender.com/api/v1/seeker/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: phone, submittedOtp: otp })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Verification code mismatch.');

      // Persist active JWT security token indices
      localStorage.setItem('seekerToken', data.token);

      // ⚡ REACTIVE ROUTING INTERCEPT GATE
      // If the profile is complete, redirect to the dashboard; if not, force the configuration form layout
      if (data.isProfileComplete) {
        window.location.href = '/dashboard';
      } else {
        window.location.href = '/profile';
      }
    } catch (err) {
      setUiState({ processing: false, error: err.message, message: '' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
      
      {/* LEFT COLUMN: 70% GRAPHICAL GOVERNMENT VISUAL CONTENT PANEL */}
      <div className="hidden md:flex md:w-[70%] bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 p-12 lg:p-16 flex-col justify-between relative overflow-hidden text-white border-r border-slate-800">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        
        <div className="space-y-3 z-10 relative">
          
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight max-w-3xl leading-tight">
            Job seeker Portal
          </h1>
          <p className="text-slate-400 font-medium text-sm lg:text-base max-w-xl">
             Government of Andhra Pradesh. Decentralized, double-blind employment matching registers for citizen advancement.
          </p>
        </div>

      
      </div>

      {/* RIGHT COLUMN: 30% CRISP CLEAN LIGHT MODE AUTHORIZATION FORM */}
      <div className="w-full md:w-[30%] bg-white p-8 sm:p-10 flex flex-col justify-center border-t md:border-t-0 border-slate-200">
        <div className="space-y-6 max-w-sm w-full mx-auto">
          
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Login Here</h2>
            <p className="text-xs text-slate-500 font-medium">Verify your registered Mobile Number via one-time secure passkey.</p>
          </div>

          {uiState.error && <div className="p-3 bg-red-50 border border-red-200 text-red-700 font-bold text-xs rounded-xl">{uiState.error}</div>}
          {uiState.message && <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs rounded-xl">{uiState.message}</div>}

          {step === 1 ? (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-black tracking-wider text-slate-700">Mobile Number</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold text-sm">+91</span>
                  <input
                    type="tel" required maxLength="10" pattern="[0-9]{10}" placeholder="10-Digit Mobile Number"
                    className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl outline-none text-sm font-medium tracking-wide text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
                    value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                  />
                </div>
              </div>
              <button type="submit" disabled={uiState.processing} className="w-full py-3 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-sm">
                {uiState.processing ? 'Verifying Node...' : 'Request Security Code'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-black tracking-wider text-slate-700">Verification OTP</label>
                <input
                  type="text" required maxLength="6" placeholder="6-Digit Passkey"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl outline-none text-base font-black tracking-widest text-center text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
                  value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                />
                <p className="text-[10px] text-slate-400 font-medium text-center mt-1">Passkey transmitted to +91 {phone}</p>
              </div>
              <button type="submit" disabled={uiState.processing} className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-sm">
                {uiState.processing ? 'Validating Session...' : 'Authorize Signature'}
              </button>
              <button type="button" onClick={() => setStep(1)} className="w-full text-center text-xs font-bold text-slate-500 hover:text-slate-800 transition-all pt-1">
                Modify Phone Parameters
              </button>
            </form>
          )}

        </div>
      </div>

    </div>
  );
}