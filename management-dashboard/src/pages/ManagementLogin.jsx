// management-dashboard/src/pages/ManagementLogin.jsx
import React, { useState } from 'react';

export default function ManagementLogin() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (form.username === 'admin' && form.password === 'adminpass') {
      localStorage.setItem('adminAuthenticated', 'true');
      window.location.href = '/dashboard';
    } else {
      setError('Access Denied: Invalid Administrative Signature Credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
      
      {/* LEFT PORTION: 70% INFORMATION DISPLAY LAYER */}
      <div className="hidden md:flex md:w-[70%] bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 p-12 lg:p-16 flex-col justify-between relative overflow-hidden text-white border-r border-slate-800">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        
        <div className="space-y-4 z-10 relative">
          
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight max-w-2xl leading-tight">
           Management Portal
          </h1>
          <p className="text-slate-400 font-medium text-sm lg:text-base max-w-xl">
            Unified macro-analytics console aggregating cross-tenant regional employment data metrics, placement drives tracking, and statutory compliance indicators for Andhra Pradesh.
          </p>
        </div>

        
      </div>

      {/* RIGHT PORTION: 30% REFINED AUTHENTICATION CONTROL CONSOLE */}
      <div className="w-full md:w-[30%] bg-white p-8 sm:p-10 flex flex-col justify-center border-t md:border-t-0 border-slate-200 shadow-2xl">
        <div className="space-y-6 max-w-sm w-full mx-auto">
          
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Authority Login</h2>
            <p className="text-xs text-slate-500 font-medium">Input your administrative User Id to verify access authority.</p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 font-bold text-xs rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-[10px] uppercase font-black tracking-wider text-slate-700">Administrative User ID</label>
              <input 
                type="text" required placeholder="Enter ID"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
                value={form.username} onChange={e => setForm({...form, username: e.target.value})} 
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] uppercase font-black tracking-wider text-slate-700">Security Authentication Key</label>
              <input 
                type="password" required placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
                value={form.password} onChange={e => setForm({...form, password: e.target.value})} 
              />
            </div>

            <button type="submit" className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md">
              Get Access
            </button>
          </form>

        </div>
      </div>

    </div>
  );
}