// management-dashboard/src/pages/VacancyAnalysisMatrix.jsx
import React, { useEffect, useState } from 'react';
import ManagementSidebar from '../components/ManagementSidebar';

export default function VacancyAnalysisMatrix({ onNavigate }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Hits the open management cross-tenant data compiler endpoint
    fetch('https://job-portal-backend-68x8.onrender.com/api/v1/management/all-vacancies')
      .then(res => res.json())
      .then(res => setJobs(res.jobs || []))
      .catch(err => console.error('Error compiling vacancy registry array:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <ManagementSidebar onNavigate={onNavigate}>
      <div className="space-y-6 font-sans">
        
        {/* TOP HEADER CONTROLS CARD */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Active State Vacancy Ledgers</h1>
          <p className="text-xs text-slate-500 mt-1">Select a position vector to audit real-time applicant demographic allocations.</p>
        </div>

        {/* LOADING STATE INDICATOR */}
        {loading ? (
          <div className="p-12 text-center text-xs font-mono font-bold text-slate-400 bg-white border border-slate-200 rounded-3xl animate-pulse tracking-widest uppercase">
            Assembling system records...
          </div>
        ) : jobs.length === 0 ? (
          /* EMPTY FALLBACK SCREEN MODULE */
          <div className="p-12 text-center text-slate-500 font-bold text-sm bg-white border border-slate-200 border-dashed rounded-3xl">
            No open vacancies have been published across any corporation tenant.
          </div>
        ) : (
          /* LIVE DATA LEDGER GRID GRID */
          <div className="grid grid-cols-1 gap-4">
            {jobs.map(j => (
              <div 
                key={j._id} 
                className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:border-emerald-600/30 transition-all duration-200 shadow-xs hover:shadow-md"
              >
                <div className="space-y-1.5">
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">{j.title}</h3>
                  <p className="text-xs text-slate-500 font-mono">
                    Company Reference ID: {j.corporateId?.companyName || 'AP-CORPORATE-HIDDEN'}
                  </p>
                  <div className="pt-1">
                    <span className="inline-flex items-center px-2.5 py-0.5 bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-700">
                      Deployment Region: {j.districtLocation} District
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  {/* COUNTER BOX MODULE */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-center min-w-[110px]">
                    <span className="text-[9px] uppercase font-black text-slate-400 tracking-wider block">Applicants</span>
                    <span className="text-lg font-mono font-black text-emerald-700">{j.applicantCount || 0}</span>
                  </div>
                  
                  {/* AUDIT TRIGGER CONTROL BUTTON */}
                  <button 
                    onClick={() => onNavigate(`/vacancies/${j._id}`)} 
                    className="px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-xs"
                  >
                    Audit Demographics →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ManagementSidebar>
  );
}