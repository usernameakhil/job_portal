import React, { useState } from 'react';

export default function SeekerSidebar({ children }) {
  const currentPath = window.location.pathname;
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navigationItems = [
    { label: 'Smart Job Feed', path: '/dashboard', icon: '' },
    { label: 'Application Tracker', path: '/applied-jobs', icon: '' },
    { label: 'Profile ', path: '/profile', icon: '' },
    { label: 'Jobs', path: '/resume-builder', icon: '' },
  ];

  const triggerSignOut = () => {
    localStorage.removeItem('seekerToken');
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Top Header Bar */}
      <div className="md:hidden bg-slate-900 text-white px-4 py-3 flex justify-between items-center border-b-2 border-emerald-500">
        <div className="flex items-center space-x-2">
          <div className="bg-emerald-500 text-slate-900 font-black text-sm px-2 py-0.5 rounded">AP</div>
          <span className="font-bold text-sm tracking-tight">Employment Exchange</span>
        </div>
        <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="text-xl focus:outline-none">
          {isMobileOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Sidebar Navigation Panel */}
      <aside className={`${isMobileOpen ? 'block' : 'hidden'} md:block w-full md:w-72 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800`}>
        {/* State Branding Section Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-950/40 hidden md:block">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center font-black text-slate-950 text-lg shadow-md shadow-emerald-500/10">
              AP
            </div>
            <div>
              <h2 className="text-sm font-black text-white tracking-wider uppercase leading-none">Youth Gateway</h2>
              <p className="text-[10px] text-slate-500 font-mono mt-1 tracking-widest uppercase">State Core v4.0</p>
            </div>
          </div>
          <div className="mt-4 px-2.5 py-1.5 bg-slate-900/80 border border-emerald-500/20 rounded-lg flex items-center justify-between">
            <span className="text-[11px] text-emerald-400 font-bold tracking-wide">MeeSeva Data Core Validated</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
        </div>

        {/* Dynamic Interactive Route Navigation Block */}
        <nav className="flex-grow p-4 space-y-1.5">
          {navigationItems.map((item, index) => {
            const isCurrent = currentPath === item.path || (item.path === '/dashboard' && currentPath === '/');
            return (
              <a
                key={index}
                href={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold tracking-wide transition-all duration-150 ${
                  isCurrent 
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/10 font-bold' 
                    : 'hover:bg-slate-800/60 hover:text-white text-slate-400'
                }`}
              >
                <span className="text-lg leading-none">{item.icon}</span>
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>

        {/* User Account Context Status Footplate */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/20">
          <button
            onClick={triggerSignOut}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-slate-800 hover:bg-red-950/40 hover:text-red-400 hover:border-red-900/50 border border-slate-700/60 text-slate-300 font-bold text-xs uppercase tracking-widest rounded-xl transition-all duration-150 shadow-inner"
          >
            <span>logout</span>
          </button>
        </div>
      </aside>

      {/* Main App Content Viewport */}
      <main className="flex-grow flex flex-col min-w-0 overflow-y-auto">
        <div className="p-4 sm:p-8 lg:p-10 max-w-7xl w-full mx-auto space-y-8">
          {children}
        </div>
      </main>
    </div>
  );
}