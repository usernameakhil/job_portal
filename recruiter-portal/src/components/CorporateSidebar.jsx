import React, { useState } from 'react';

export default function CorporateSidebar({ children }) {
  const currentPath = window.location.pathname;
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navItems = [
    { label: 'Screening Pool', path: '/applicant-pool', icon: '' },
    { label: 'Post New Vacancy', path: '/post-job', icon: '' },
    { label: 'Corporate Profile', path: '/profile', icon: '' },
  ];

  const triggerSignOut = () => {
    localStorage.removeItem('recruiterToken');
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Header Node */}
      <div className="md:hidden bg-slate-900 text-white px-4 py-3 flex justify-between items-center border-b-2 border-emerald-500">
        <div className="flex items-center space-x-2">
          <div className="bg-emerald-500 text-slate-900 font-black text-sm px-2 py-0.5 rounded">AP</div>
          <span className="font-bold text-sm tracking-tight">Recruiter Portal</span>
        </div>
        <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="text-xl focus:outline-none">
          {isMobileOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Main Corporate Sidebar Rail */}
      <aside className={`${isMobileOpen ? 'block' : 'hidden'} md:block w-full md:w-72 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800`}>
        <div className="p-6 border-b border-slate-800 bg-slate-950/40 hidden md:block">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center font-black text-slate-950 text-lg shadow-md">
              AP
            </div>
            <div>
              <h2 className="text-sm font-black text-white tracking-wider uppercase leading-none">Enterprise Exchange</h2>
              <p className="text-[10px] text-slate-500 font-mono mt-1 tracking-widest uppercase">Recruiter Module</p>
            </div>
          </div>
          
        </div>

        <nav className="flex-grow p-4 space-y-1.5">
          {navItems.map((item, idx) => {
            const isActive = currentPath === item.path;
            return (
              <a
                key={idx} href={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold tracking-wide transition-all duration-150 ${
                  isActive 
                    ? 'bg-emerald-600 text-white shadow-lg font-bold' 
                    : 'hover:bg-slate-800/60 hover:text-white text-slate-400'
                }`}
              >
                <span className="text-lg leading-none">{item.icon}</span>
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800 bg-slate-950/20">
          <button
            onClick={triggerSignOut}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-slate-800 hover:bg-red-950/40 hover:text-red-400 border border-slate-700/60 text-slate-300 font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-inner"
          >
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-grow flex flex-col min-w-0 overflow-y-auto">
        <div className="p-4 sm:p-8 lg:p-10 max-w-7xl w-full mx-auto space-y-8">
          {children}
        </div>
      </main>
    </div>
  );
}