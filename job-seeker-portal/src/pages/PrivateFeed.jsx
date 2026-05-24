// job-seeker-portal/src/pages/PrivateFeed.jsx
import React, { useEffect, useState } from 'react';
import SeekerSidebar from '../components/SeekerSidebar';
import StatsWidget from '../components/StatsWidget';
import AnonymousJobCard from '../components/AnonymousJobCard';

export default function PrivateFeed({ onNavigate }) {
  const [jobFeed, setJobFeed] = useState([]);
  const [profile, setProfile] = useState(null);
  const [networkError, setNetworkError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Aggregated analytics values for tracking system metrics
  const [metrics, setMetrics] = useState({ matches: 0, applied: 0, shortlisted: 0 });

  const pullPortalDataFeed = async () => {
    try {
      setIsLoading(true);
      setNetworkError('');
      const authToken = localStorage.getItem('seekerToken');

      // 📡 Request Stage 1: Pull active trainee profile information
      const profileResponse = await fetch('https://job-portal-backend-68x8.onrender.com/api/v1/seeker/profile/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });
      const profileData = await profileResponse.json();
      if (!profileResponse.ok) throw new Error(profileData.error || 'Failed to sync seeker profile.');

      const trainee = profileData.seeker || profileData.profile;
      setProfile(trainee);

      // Defensively evaluate system setup completeness based on schema requirements
      const isConfigured = trainee && trainee.fullName && trainee.district && trainee.casteCategory;

      if (isConfigured) {
        // 📡 Request Stage 2: Pull real-time anonymized vector match listings
        const feedResponse = await fetch('https://job-portal-backend-68x8.onrender.com/api/v1/seeker/jobs/anonymous-feed', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        });
        const feedData = await feedResponse.json();
        if (!feedResponse.ok) throw new Error(feedData.error || 'Failed to pull matching listings.');

        setJobFeed(feedData.feed || []);
        
        // Populate system metrics dynamically from live metadata lengths
        setMetrics({
          matches: (feedData.feed || []).length,
          applied: trainee.appliedCount || 0,
          shortlisted: trainee.shortlistedCount || 0
        });
      }
    } catch (err) {
      setNetworkError(err.message || 'Error connecting to data channels.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    pullPortalDataFeed();
  }, []);

  const handleApplyTransaction = async (jobId) => {
    try {
      const response = await fetch('https://job-portal-backend-68x8.onrender.com/api/v1/seeker/applications/apply', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('seekerToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ jobId })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Application processing failed.');

      alert('Application securely saved to double-blind ledger.');
      await pullPortalDataFeed(); // Dynamic refresh to re-calculate vectors
    } catch (err) {
      alert(`Transaction Rejected: ${err.message}`);
    }
  };

  // Evaluate structural definition parameters dynamically
  const isProfileComplete = profile && profile.fullName && profile.district && profile.casteCategory;

  return (
    <SeekerSidebar onNavigate={onNavigate}>
      <div className="space-y-6 font-sans">
        
        {/* TOP TITLE HEADER BOX */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Smart Matching Matrix Feed</h1>
          <p className="text-sm text-slate-500 mt-1">Double-blind algorithmic job feed filtering listings based on your verified skill profile.</p>
        </div>

        {networkError && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-xs font-bold rounded-xl shadow-xs">
            Notice: {networkError}
          </div>
        )}

        {isLoading ? (
          /* LOADING PROGRESS ANIMATION MODULE */
          <div className="py-24 text-center space-y-3 bg-white border border-slate-200 rounded-3xl">
            <div className="w-10 h-10 border-4 border-emerald-700 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest animate-pulse">Running skill vector matching calculations...</p>
          </div>
        ) : !isProfileComplete ? (
          /* 🛡️ HARD LOCK ONBOARDING SECURITY GATEWAY VIEW */
          <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-5 shadow-sm mt-8">
            <div className="w-12 h-12 bg-amber-50 text-amber-700 border border-amber-200 rounded-full flex items-center justify-center mx-auto text-xl font-black font-mono">
              !
            </div>
            <div className="space-y-1.5">
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Access Restricted</h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Your portal profile registration variables are currently incomplete or missing. Under statutory hiring guidelines, your skill profile parameters must be established before you can view match indices or apply to jobs.
              </p>
            </div>
            <button 
              onClick={() => onNavigate('/profile')}
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-sm"
            >
              Complete Profile Setup Now
            </button>
          </div>
        ) : (
          /* UNLOCKED ACTIVE TRAINEE PORTAL FEED WORKSPACE */
          <div className="space-y-6">
            {/* Real-time stats count row widget integration */}
            <StatsWidget metrics={metrics} />

            {jobFeed.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-400 max-w-md mx-auto">
                <p className="font-bold text-sm">No job openings currently match your verified skill parameters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobFeed.map((job) => (
                  <AnonymousJobCard 
                    key={job._id} 
                    job={job} 
                    onApply={handleApplyTransaction} 
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </SeekerSidebar>
  );
}