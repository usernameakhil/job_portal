import React from 'react';

export default function DemographicChart({ title, data = {} }) {
  const entries = Object.entries(data);
  const total = entries.reduce((sum, [_, val]) => sum + val, 0);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
      <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">{title}</h3>
      {entries.length === 0 ? (
        <p className="text-xs text-slate-400 py-4 text-center font-medium">No distribution vectors mapped yet.</p>
      ) : (
        <div className="space-y-3">
          {entries.map(([label, count]) => {
            const percentage = total > 0 ? (count / total) * 100 : 0;
            return (
              <div key={label} className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>{label}</span>
                  <span className="text-slate-400 font-mono">{count} ({percentage.toFixed(0)}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${percentage}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}