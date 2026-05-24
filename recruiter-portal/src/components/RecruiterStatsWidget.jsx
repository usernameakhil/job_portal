import React from 'react';

export default function RecruiterStatsWidget({ metrics }) {
  const statCards = [
    { title: 'Active Postings', count: metrics?.activePostings || 0, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100', icon: '📝' },
    { title: 'Total Matched Applicants', count: metrics?.totalPool || 0, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100', icon: '🧬' },
    { title: 'Interviews Approved', count: metrics?.approvedCount || 0, color: 'text-purple-600', bg: 'bg-purple-50 border-purple-100', icon: '🤝' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
      {statCards.map((card, idx) => (
        <div key={idx} className={`p-5 rounded-2xl border ${card.bg} flex items-center justify-between shadow-xs hover:shadow-md transition-shadow`}>
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">{card.title}</span>
            <span className={`text-3xl font-black tracking-tight ${card.color}`}>{card.count}</span>
          </div>
          <span className="text-2xl opacity-80">{card.icon}</span>
        </div>
      ))}
    </div>
  );
}