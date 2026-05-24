// recruiter-portal/src/pages/PostedJobsRegistry.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Added for context routing matching
import CorporateSidebar from '../components/CorporateSidebar';
import { recruiterApi } from '../services/recruiterApi';

export default function PostedJobsRegistry() {
  const navigate = useNavigate(); // Initialized the clean navigation hook
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    recruiterApi.getPostedJobs()
      .then(res => setJobs(res.jobs))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <CorporateSidebar>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Vacancy Management Console</h1>
          <p className="text-sm text-slate-500 mt-1">Track active job postings and access candidate pool metrics for specific vacancies.</p>
        </div>

        {error && <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl">{error}</div>}

        {loading ? (
          <div className="py-20 text-center font-mono text-xs text-slate-400 animate-pulse">Loading active job registers...</div>
        ) : jobs.length === 0 ? (
          <div className="bg-white border rounded-2xl p-12 text-center text-slate-400 max-w-md mx-auto">
            <p className="font-bold text-sm">No vacancy requirements published yet.</p>
            <button onClick={() => navigate('/post-job')} className="mt-4 px-4 py-2 bg-emerald-600 text-white font-bold text-xs uppercase rounded-xl">Post First Job</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobs.map((job) => (
              <div key={job._id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition-all">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">{job.title}</h3>
                    <span className="bg-blue-50 border border-blue-100 text-blue-700 text-[11px] font-black px-2.5 py-0.5 rounded-lg">
                      Location: {job.districtLocation}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{job.description}</p>
                  
                  <div className="flex gap-4 text-xs font-semibold text-slate-600 pt-1">
                    <div>Experience: <span className="text-slate-900 font-bold">{job.experienceRequired}+ Yrs</span></div>
                    <div>Salary: <span className="text-slate-900 font-bold">INR {(job.salaryRange?.min/1000).toFixed(0)}k - INR {(job.salaryRange?.max/1000).toFixed(0)}k/mo</span></div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-center">
                    <span className="text-xs text-slate-400 block font-bold uppercase tracking-wider text-[9px]">Applicants</span>
                    <span className="text-lg font-black text-emerald-600">{job.applicantCount || 0}</span>
                  </div>
                  <button 
                    onClick={() => navigate(`/jobs/${job._id}/analytics`)}
                    className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-xs"
                  >
                    View Applicants and Analytics 
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </CorporateSidebar>
  );
}