import React, { useEffect, useState } from 'react';
import CorporateSidebar from '../components/CorporateSidebar';
import RecruiterStatsWidget from '../components/RecruiterStatsWidget';
import MaskedApplicantCard from '../components/MaskedApplicantCard';
import { recruiterApi } from '../services/recruiterApi';

export default function BlindTalentPool() {
  const [pool, setPool] = useState([]);
  const [metrics, setMetrics] = useState({ activePostings: 0, totalPool: 0, approvedCount: 0 });
  const [ui, setUi] = useState({ loading: true, error: '' });
  const [districtFilter, setDistrictFilter] = useState('All');

  const synchronizePoolData = async () => {
    try {
      const res = await recruiterApi.getBlindPool();
      setPool(res.pool);
      
      // Compute high-level totals directly from live record vectors
      const uniqueJobIds = new Set(res.pool.map(c => c.jobId));
      const approvedCount = res.pool.filter(c => c.applicationStatus === 'Anonymously-Approved').length;
      
      setMetrics({
        activePostings: uniqueJobIds.size,
        totalPool: res.pool.length,
        approvedCount: approvedCount
      });
    } catch (err) {
      setUi(prev => ({ ...prev, error: err.message }));
    } finally {
      setUi(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    synchronizePoolData();
  }, []);

  const executePipelineAction = async (transactionId, newStatus) => {
    try {
      // Production integration call points to transactional update route
      await fetch(`https://job-portal-backend-68x8.onrender.com/api/v1/recruiter/applications/${transactionId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('recruiterToken')}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      alert(`Candidate status updated cleanly to: ${newStatus}`);
      synchronizePoolData();
    } catch (e) {
      alert('Failed to modify tracking status across decentralized matrix.');
    }
  };

  return (
    <CorporateSidebar>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200">
          
          <select 
            className="p-3 border border-slate-300 rounded-xl bg-white shadow-2xs text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500"
            value={districtFilter} onChange={e => setDistrictFilter(e.target.value)}
          >
            <option value="All">All Regions (Andhra Pradesh)</option>
            <option value="NTR">NTR District</option>
            <option value="Guntur">Guntur</option>
            <option value="Visakhapatnam">Visakhapatnam</option>
          </select>
        </div>

        <RecruiterStatsWidget metrics={metrics} />

        {ui.error && <div className="p-4 bg-red-50 text-red-700 font-bold border border-red-200 rounded-xl text-xs">⚠️ {ui.error}</div>}

        {ui.loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-400 font-mono font-bold uppercase tracking-widest animate-pulse">Parsing anonymized alignment vectors...</p>
          </div>
        ) : pool.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400 max-w-md mx-auto shadow-xs">
            <p className="font-bold text-sm">No applicant records currently match your active vacancy listings.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pool
              .filter(c => districtFilter === 'All' || c.candidateMetrics.district === districtFilter)
              .map(applicant => (
                <MaskedApplicantCard 
                  key={applicant.transactionId}
                  applicant={applicant}
                  onAction={executePipelineAction}
                />
              ))}
          </div>
        )}
      </div>
    </CorporateSidebar>
  );
}