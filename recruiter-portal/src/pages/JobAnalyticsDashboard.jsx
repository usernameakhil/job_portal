// recruiter-portal/src/pages/JobAnalyticsDashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // Replaced window location splits with native hooks
import CorporateSidebar from '../components/CorporateSidebar';
import DemographicChart from '../components/DemographicChart';
import MaskedApplicantCard from '../components/MaskedApplicantCard';
import { recruiterApi } from '../services/recruiterApi';

export default function JobAnalyticsDashboard() {
  const navigate = useNavigate();
  const { jobId } = useParams(); // Automatically matches the :jobId variable from recruiter-portal/src/main.jsx route parameters

  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadPipelineMetrics = async () => {
    try {
      const data = await recruiterApi.getJobAnalytics(jobId);
      setAnalyticsData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (jobId) {
      loadPipelineMetrics();
    }
  }, [jobId]);

  const handleActionChange = async (txId, nextStatus) => {
    try {
      await recruiterApi.updateStatus(txId, nextStatus);
      alert(`Lifecycle updated successfully to: ${nextStatus}`);
      loadPipelineMetrics();
    } catch (e) {
      alert(`Pipeline error: ${e.message}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-mono text-xs text-slate-400">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="uppercase tracking-widest animate-pulse">Running demographic cluster metrics...</p>
        </div>
      </div>
    );
  }

  return (
    <CorporateSidebar>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/posted-jobs')} className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50"><- Back</button>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Hiring Performance Analytics</h1>
            <p className="text-xs text-slate-500">Real-time aggregate distributions for Vacancy Vector Ref: <span className="font-mono bg-slate-100 px-1 rounded">{jobId}</span></p>
          </div>
        </div>

        {error && <div className="p-4 bg-red-50 text-red-700 font-bold border border-red-200 rounded-xl text-xs">{error}</div>}

        {/* Dynamic Analytics Aggregation Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DemographicChart title="Regional District Metrics" data={analyticsData?.distributions?.districts} />
          <DemographicChart title="Caste Category Metrics" data={analyticsData?.distributions?.castes} />
          <DemographicChart title="Qualification Metrics" data={analyticsData?.distributions?.qualifications} />
        </div>

        {/* Applicant Profile Output Matrix */}
        <div className="space-y-4">
          <h3 className="text-base font-black text-slate-900 tracking-tight border-b border-slate-200 pb-2">Targeted Position Applicants Pool</h3>
          {analyticsData?.applicants?.length === 0 ? (
            <div className="bg-white border rounded-2xl p-8 text-center text-slate-400 font-medium text-sm">No applications have hit this vacancy ledger point yet.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {analyticsData?.applicants?.map((item) => (
                <MaskedApplicantCard key={item.transactionId} applicant={item} onAction={handleActionChange} />
              ))}
            </div>
          )}
        </div>
      </div>
    </CorporateSidebar>
  );
}