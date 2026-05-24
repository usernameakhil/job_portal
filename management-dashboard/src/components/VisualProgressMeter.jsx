import React from 'react';

export default function VisualProgressMeter({ title, data = {}, colorClass = "bg-slate-900" }) {
  const entries = Object.entries(data).sort((a, b) => b[1] - a[1]); // Order highest values to the top
  const totalCount = entries.reduce((sum, [_, val]) => sum + val, 0);

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-5">
      <div className="border-b border-slate-100 Jacques pb-3">
        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 font-mono">{title}</h3>
      </div>
      
      {entries.length === 0 ? (
        <p className="text-xs text-slate-400 py-8 text-center font-medium">No active registry entries logged.</p>
      ) : (
        <div className="space-y-4">
          {entries.map(([label, count]) => {
            const pct = totalCount > 0 ? (count / totalCount) * 100 : 0;
            return (
              <div key={label} className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>{label}</span>
                  <span className="font-mono text-slate-400">{count.toLocaleString('en-IN')} ({pct.toFixed(0)}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200/40">
                  <div className={`h-full rounded-full transition-all duration-700 ${colorClass}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}