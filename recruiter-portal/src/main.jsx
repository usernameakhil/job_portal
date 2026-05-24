// recruiter-portal/src/main.jsx
import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import RecruiterLogin from './pages/RecruiterLogin';
import CorporateProfile from './pages/CorporateProfile';
import PostJobWizard from './pages/PostJobWizard';
import PostedJobsRegistry from './pages/PostedJobsRegistry';
import JobAnalyticsDashboard from './pages/JobAnalyticsDashboard';
import './index.css';

function RecruiterAppRouter() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const token = localStorage.getItem('recruiterToken');

  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  if (!token && currentPath !== '/login') {
    window.history.replaceState({}, '', '/login');
    return <RecruiterLogin />;
  }

  // Parameterized Address Interception Matrix Logic
  if (currentPath.includes('/jobs/') && currentPath.includes('/analytics')) {
    return <JobAnalyticsDashboard onNavigate={navigateTo} />;
  }

  switch (currentPath) {
    case '/login': return <RecruiterLogin />;
    case '/profile': return <CorporateProfile onNavigate={navigateTo} />;
    case '/post-job': return <PostJobWizard onNavigate={navigateTo} />;
    case '/posted-jobs': return <PostedJobsRegistry onNavigate={navigateTo} />;
    default: return <PostedJobsRegistry onNavigate={navigateTo} />;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RecruiterAppRouter />
  </StrictMode>
);