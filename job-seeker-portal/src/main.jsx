import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import SeekerLogin from './pages/SeekerLogin';
import PrivateFeed from './pages/PrivateFeed';
import OnboardingVerification from './pages/OnboardingVerification';
import AppliedJobsRegistry from './pages/AppliedJobsRegistry';
import ProfileManagement from './pages/ProfileManagement';
import './index.css';

function SeekerAppRouter() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const secureToken = localStorage.getItem('seekerToken');

  // Sync state changes with the browser address bar navigation history
  useEffect(() => {
    const handleLocationChange = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const navigateTo = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  // Global Route Guard Perimeter Configuration
  if (!secureToken && currentPath !== '/login') {
    window.history.replaceState({}, '', '/login');
    return <SeekerLogin onNavigate={navigateTo} />;
  }

  switch (currentPath) {
    case '/login':
      return <SeekerLogin onNavigate={navigateTo} />;
    case '/onboarding':
      return <OnboardingVerification onNavigate={navigateTo} mode="onboard" />;
    case '/edit-profile':
      return <OnboardingVerification onNavigate={navigateTo} mode="edit" />;
    case '/applied-jobs':
      return <AppliedJobsRegistry onNavigate={navigateTo} />;
    case '/profile':
      return <ProfileManagement onNavigate={navigateTo} />;
    case '/dashboard':
    default:
      return <PrivateFeed onNavigate={navigateTo} />;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SeekerAppRouter />
  </StrictMode>
);