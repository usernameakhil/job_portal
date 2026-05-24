import React from 'react';

export default function AnonymousJobCard({ job, onApply }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between h-full">
      <div className="p-6">
        <div className="flex justify-between items-start gap-4 mb-3">
          <div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">{job.title}</h3>
            {/* Double-Blind Mask Layer: Company identification parameters are fully scrambled */}
            <span className="inline-block mt-1 text-xs font-mono bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded font-bold">
              🛡️ {job.corporateIdentityMasked}
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 text-xs font-black rounded-full shadow-sm whitespace-nowrap">
              {job.matchScore}% Skill Fit
            </span>
          </div>
        </div>

        <p className="text-sm text-slate-600 mb-4 line-clamp-3 leading-relaxed">{job.description}</p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {job.requiredSkills.map((skill, index) => (
            <span 
              key={index} 
              className="bg-slate-50 border border-slate-200 px-2 py-0.5 text-xs text-slate-700 rounded font-semibold shadow-2xs"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center gap-2">
        <div className="text-xs text-slate-500 space-y-0.5 font-medium">
          <div>📍 Region: <span className="font-bold text-slate-700">{job.districtLocation} Dist.</span></div>
          <div>💰 Remuneration: <span className="font-bold text-slate-700">₹{(job.salaryRange.min/1000).toFixed(0)}k - ₹{(job.salaryRange.max/1000).toFixed(0)}k / mo</span></div>
        </div>
        <button
          onClick={() => onApply(job._id)}
          className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded-lg transition-all shadow-xs uppercase tracking-wider"
        >
          Apply Blind
        </button>
      </div>
    </div>
  );
}