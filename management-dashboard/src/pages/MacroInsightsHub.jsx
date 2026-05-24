// job-seeker-portal/src/pages/MacroInsightsHub.jsx
import React, { useEffect, useState } from 'react';
import ManagementSidebar from '../components/ManagementSidebar';
import VisualProgressMeter from '../components/VisualProgressMeter';

export default function MacroInsightsHub({ onNavigate }) {
  const [dashboardData, setDashboardData] = useState({
    summary: {},
    funnelStages: {},
    regionalDistribution: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const pullRealtimeMetrics = async () => {
    try {
      const requestOptions = {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('managementToken')}` 
        }
      };

      // Execute concurrent data stream reads to eliminate rendering lag
      const [macroRes, regionalRes] = await Promise.all([
        fetch('https://job-portal-backend-68x8.onrender.com/api/v1/management/state-funnels/macro', requestOptions),
        fetch('https://job-portal-backend-68x8.onrender.com/api/v1/management/state-funnels/prakasam-mandals', requestOptions)
      ]);

      if (!macroRes.ok || !regionalRes.ok) {
        throw new Error('Failed to resolve centralized data pipelines.');
      }

      const macroJson = await macroRes.json();
      const regionalJson = await regionalRes.json();

      // Hydrate local states using aligned backend data keys
      setDashboardData({
        summary: macroJson.summary || {},
        funnelStages: macroJson.funnelStages || {},
        regionalDistribution: regionalJson.regionalDistribution || []
      });
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    pullRealtimeMetrics();
    const threadInterval = setInterval(pullRealtimeMetrics, 15000);
    return () => clearInterval(threadInterval);
  }, []);

  if (error) {
    return (
      <ManagementSidebar onNavigate={onNavigate}>
        <div className="p-4 bg-red-50 text-red-700 font-bold border border-red-200 rounded-xl text-xs">
          Error Connecting to Core System Node: {error}
        </div>
      </ManagementSidebar>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-mono text-xs text-slate-400">
        <div className="text-center space-y-2">
          <div className="w-6 h-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="uppercase tracking-widest animate-pulse">Running Production Database Pipelines...</p>
        </div>
      </div>
    );
  }

  // Safely translate arrays into a key-value structure expected by VisualProgressMeter
  const formattedMandalChartData = dashboardData.regionalDistribution.reduce((accumulator, item) => {
    if (item.mandal) {
      accumulator[item.mandal] = item.totalRegisteredTrainees || 0;
    }
    return accumulator;
  }, {});

  return (
    <ManagementSidebar onNavigate={onNavigate}>
      <div className="space-y-8 animate-fade-in font-sans">
        
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Prakasam District Command Hub</h1>
          <p className="text-xs text-slate-500 mt-1">Real-time macro performance indicators compiled directly from regional Mandal deployment databases.</p>
        </div>

        {/* Dynamic Metric Indicator Row Panels */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { title: 'Total Registered Trainees', count: dashboardData.summary.totalRegisteredSeekers, label: 'Mandal Profiles Mapped' },
            { title: 'MeeSeva Verified Accounts', count: dashboardData.summary.verifiedMeeSevaCandidates, label: 'Identity Matrix Cleared' },
            { title: 'Vetted Corporate Partners', count: dashboardData.summary.activeHiringEntities, label: 'Approved Industries Listed' },
            { title: 'System Applications Processed', count: dashboardData.funnelStages.totalSubmissions || 0, label: 'Active Pipeline Transactions' }
          ].map((m, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between shadow-xs">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">{m.title}</span>
              <span className="text-3xl font-black text-slate-900 font-mono my-1.5 block">
                {m.count !== undefined ? m.count.toLocaleString('en-IN') : 0}
              </span>
              <span className="text-xs text-emerald-700 font-bold font-mono uppercase text-[10px]">{m.label}</span>
            </div>
          ))}
        </div>

        {/* Visual Analytics Row Splits */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <VisualProgressMeter 
            title="Spatial Candidate Density (By Mandal Allocation)" 
            data={formattedMandalChartData} 
            colorClass="bg-emerald-600" 
          />
          <VisualProgressMeter 
            title="System Application Lifecycle Conversion Metrics" 
            data={dashboardData.funnelStages.breakdown || {}} 
            colorClass="bg-blue-600" 
          />
        </div>

      </div>
    </ManagementSidebar>
  );
}