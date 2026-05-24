// management-dashboard/src/main.jsx
import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import ManagementLogin from './pages/ManagementLogin';
import MacroInsightsHub from './pages/MacroInsightsHub';
import VacancyAnalysisMatrix from './pages/VacancyAnalysisMatrix';
import TargetJobMetrics from './pages/TargetJobMetrics';
import './index.css';

function ManagementPortalAppRouter() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const isAuthenticated = localStorage.getItem('adminAuthenticated') === 'true';

  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  // Route security gate: Enforce administrative login checks
  if (!isAuthenticated && currentPath !== '/login') {
    window.history.replaceState({}, '', '/login');
    return <ManagementLogin />;
  }

  // Parameterized router matching for nested vacancy analytics
  if (currentPath.startsWith('/vacancies/')) {
    return <TargetJobMetrics onNavigate={navigateTo} />;
  }

  switch (currentPath) {
    case '/login': return <ManagementLogin />;
    case '/vacancies': return <VacancyAnalysisMatrix onNavigate={navigateTo} />;
    case '/dashboard':
    default: return <MacroInsightsHub onNavigate={navigateTo} />;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ManagementPortalAppRouter />
  </StrictMode>
);