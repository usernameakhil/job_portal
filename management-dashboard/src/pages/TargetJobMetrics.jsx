// management-dashboard/src/pages/TargetJobMetrics.jsx
import React, { useEffect, useState } from 'react';
import ManagementSidebar from '../components/ManagementSidebar';
import VisualProgressMeter from '../components/VisualProgressMeter';

export default function TargetJobMetrics({ onNavigate }) {
  const pathSegments = window.location.pathname.split('/');
  const jobId = pathSegments[pathSegments.length - 1];

  const [charts, setCharts] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // Hits the direct corporate analytics engine cross-read endpoint bypass channel
    fetch(`https://job-portal-backend-68x8.onrender.com/api/v1/management/vacancies/${jobId}/demographics`)
      .then(res => res.json())
      .then(res => {
        if (!res.success) throw new Error(res.error || 'Failed to query demographic matrices.');
        setCharts(res.distributions);
      })
      .catch(err => setError(err.message));
  }, [jobId]);

  if (error) {
    return (
      <ManagementSidebar onNavigate={onNavigate}>
        <div className="p-4 bg-red-950/40 border border-red-900 text-red-400 font-bold text-xs rounded-xl">⚠️ Audit Failure: {error}</div>
      </ManagementSidebar>
    );
  }

  if (!charts) return <div className="p-10 text-center font-mono text-xs text-amber-500 animate-pulse">Running live demographic sorting pipelines...</div>;

  return (
    <ManagementSidebar onNavigate={onNavigate}>
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <button onClick={() => onNavigate('/vacancies')} className="px-3 py-1.5 border border-slate-700 bg-slate-800 rounded-xl text-xs font-black text-white hover:bg-slate-700 transition-all">← Back</button>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Applicant Micro-Analysis Summary</h1>
            <p className="text-xs text-slate-400">Live demographic indicators for Vacancy Reference Handle: <span className="font-mono text-amber-500 font-bold">{jobId}</span></p>
          </div>
        </div>

        {/* 3-Column Progress Gauge Stack Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <VisualProgressMeter title="Regional Catchment (Districts)" icon="📍" data={charts.districts} colorClass="bg-emerald-500" />
          <VisualProgressMeter title="Social Pool Balancing (Castes)" icon="⚖️" data={charts.castes} colorClass="bg-blue-500" />
          <VisualProgressMeter title="Academic Credentials (Degrees)" icon="🎓" data={charts.qualifications} colorClass="bg-purple-500" />
        </div>
      </div>
    </ManagementSidebar>
  );
}