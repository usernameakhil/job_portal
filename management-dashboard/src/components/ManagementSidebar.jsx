// management-dashboard/src/components/ManagementSidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom'; // Integrated standard routing hooks

export default function ManagementSidebar({ children }) {
  const location = useLocation(); // Safely tracks the active path within the router provider context
  const path = location.pathname;

  const menu = [
    { name: 'State Overview Dashboard', path: '/dashboard' },
    { name: 'Active Vacancy Matrices', path: '/vacancies' }
  ];

  const triggerLogoutSequence = () => {
    localStorage.clear();
    window.location.href = '/login'; // Hard refresh resets systemic permission schemas cleanly
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row font-sans">
      
      {/* LEFT NAVIGATION PANEL RAIL */}
      <aside className="w-full md:w-68 bg-slate-800 border-b md:border-b-0 md:border-r border-slate-200 flex flex-col justify-between p-6 shrink-0">
        <div className="space-y-8">
          <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 bg-green-700 text-white rounded-xl flex items-center justify-center font-black text-lg shadow-sm">
              AP
            </div>
            <div>
              <h2 className="text-shadow-2xs font-black text-white uppercase tracking-tight leading-none">management portal</h2>
              <p className="text-[9px] font-mono text-emerald-700 font-bold tracking-widest uppercase mt-1">State Management</p>
            </div>
          </div>
          
          <nav className="space-y-1">
            {menu.map((m, idx) => {
              // Validates standard targets and parametric nested sub-routes without failing
              const active = path === m.path || (m.path === '/vacancies' && path.startsWith('/vacancies/'));
              return (
                /* Swapped out <button> for <Link> to fix the missing onNavigate function error completely */
                <Link
                  key={idx} 
                  to={m.path}
                  className={`w-full flex items-center px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                    active 
                      ? 'bg-emerald-600 text-white shadow-md font-black border-l-4 border-emerald-600 pl-3' 
                      : 'text-slate-500 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  {m.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <button 
          onClick={triggerLogoutSequence} 
          className="w-full py-3 bg-slate-50 hover:bg-red-50 hover:text-red-700 border border-slate-200 text-slate-600 font-black text-xs uppercase tracking-widest rounded-xl transition-all"
        >
          Exit Command Console
        </button>
      </aside>

      {/* RIGHT DATA VIEW CONTAINER BLOCK */}
      <main className="flex-grow p-6 sm:p-8 lg:p-10 overflow-y-auto max-w-7xl w-full mx-auto">
        {children}
      </main>

    </div>
  );
}