import React from 'react';

export default function MaskedApplicantCard({ applicant, onAction }) {
  const m = applicant.candidateMetrics;
  
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-4 hover:shadow-md transition-all flex flex-col justify-between">
      <div className="space-y-3">
        <div className="flex justify-between items-start gap-2">
          <div>
            <h4 className="font-mono font-bold text-slate-800 text-sm tracking-tight">{applicant.maskedCandidateToken}</h4>
            <span className="inline-block mt-1 text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-md">
              Category: {m.casteCategory}
            </span>
          </div>
          <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 font-black text-xs px-2.5 py-1 rounded-full shadow-2xs whitespace-nowrap">
            {applicant.matchScore}% Skill Fit
          </span>
        </div>

        <div className="text-xs font-medium text-slate-600 space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
          <div>📍 Region: <span className="font-bold text-slate-800">{m.district} District</span></div>
          <div>🎓 Education: <span className="font-bold text-slate-800">{m.qualification?.degree} in {m.qualification?.specialization}</span></div>
          <div className="truncate">🏫 Campus: <span className="font-semibold text-slate-700">{m.qualification?.institution}</span></div>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Verified Core Competencies</span>
          <div className="flex flex-wrap gap-1">
            {m.skills?.map((skill, index) => (
              <span key={index} className="bg-white border border-slate-200 text-slate-700 text-[11px] font-medium px-2 py-0.5 rounded font-mono">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 flex gap-2">
        <button 
          onClick={() => onAction(applicant.transactionId, 'Anonymously-Approved')}
          className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-all text-center"
        >
          Approve Pass
        </button>
        <button 
          onClick={() => onAction(applicant.transactionId, 'Rejected')}
          className="px-3 py-2 border border-slate-200 text-slate-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200 rounded-lg transition-all text-xs font-bold"
        >
          Drop
        </button>
      </div>
    </div>
  );
}