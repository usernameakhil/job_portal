// job-seeker-portal/src/pages/AppliedJobsRegistry.jsx
import React, { useEffect, useState } from 'react';
import SeekerSidebar from '../components/SeekerSidebar';

export default function AppliedJobsRegistry({ onNavigate }) {
  const [applications, setApplications] = useState([]);
  const [ui, setUi] = useState({ loading: true, error: '' });

  // 📡 Dynamic Network Synchronization Hook
  const fetchApplicationHistory = async () => {
    try {
      setUi(prev => ({ ...prev, loading: true, error: '' }));
      
      const response = await fetch('http://localhost:8080/api/v1/seeker/jobs/applied-history', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('seekerToken')}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to sync application records.');

      // Assumes backend populates and returns { success: true, history: [...] }
      setApplications(data.history || []);
    } catch (err) {
      setUi(prev => ({ ...prev, error: err.message }));
    } finally {
      setUi(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    fetchApplicationHistory();
  }, []);

  const getStatusStyle = (state) => {
    switch (state) {
      case 'Anonymously-Approved': 
        return 'bg-emerald-50 border-emerald-200 text-emerald-700';
      case 'Under-Review': 
        return 'bg-amber-50 border-amber-200 text-amber-700';
      case 'Rejected': 
        return 'bg-red-50 border-red-200 text-red-700';
      case 'Applied':
      default: 
        return 'bg-slate-100 border-slate-200 text-slate-700';
    }
  };

  return (
    <SeekerSidebar onNavigate={onNavigate}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Application Tracker Registry</h1>
          <p className="text-sm text-slate-500 mt-1">Monitor the live review and verification lifecycle status of your anonymized profiles.</p>
        </div>

        {ui.error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl shadow-2xs">
            ⚠️ {ui.error}
          </div>
        )}

        {ui.loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400 animate-pulse">Compiling application transactions...</p>
          </div>
        ) : applications.length === 0 ? (
          /* Empty Pipeline View Frame */
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400 max-w-md mx-auto shadow-2xs">
            <p className="font-bold text-sm">You haven't submitted anonymous applications to any vacancy yet.</p>
            <button 
              onClick={() => onNavigate('/dashboard')} 
              className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md"
            >
              Explore Smart Job Feed
            </button>
          </div>
        ) : (
          /* Live Reactive Ledger Data Matrix Table */
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 text-xs uppercase font-bold tracking-wider">
                    <th className="p-4 sm:p-5">Job Vector Parameters</th>
                    <th className="p-4 sm:p-5">Employer Code Mask</th>
                    <th className="p-4 sm:p-5">Submission Date</th>
                    <th className="p-4 sm:p-5">Alignment Rating</th>
                    <th className="p-4 sm:p-5">Lifecycle Routing State</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
                  {applications.map((app) => (
                    <tr key={app._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 sm:p-5">
                        <div className="font-bold text-slate-900">{app.jobTitle}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">📍 Location: {app.districtLocation}</div>
                      </td>
                      <td className="p-4 sm:p-5 font-mono text-xs font-bold text-slate-600 bg-slate-50/50">
                        {app.corporateIdentityMasked || 'AP-CORPORATE-HIDDEN'}
                      </td>
                      <td className="p-4 sm:p-5 text-slate-500 font-semibold">
                        {app.createdAt ? new Date(app.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                      </td>
                      <td className="p-4 sm:p-5">
                        <span className="text-emerald-600 font-black font-mono bg-emerald-50/60 px-2 py-0.5 border border-emerald-100 rounded text-xs">
                          {app.matchScore}% Match
                        </span>
                      </td>
                      <td className="p-4 sm:p-5">
                        <span className={`px-2.5 py-1 text-xs font-black border rounded-lg shadow-2xs whitespace-nowrap tracking-wide uppercase ${getStatusStyle(app.applicationStatus)}`}>
                          {app.applicationStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </SeekerSidebar>
  );
}