// recruiter-portal/src/main.jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import RecruiterLogin from './pages/RecruiterLogin';
import CorporateProfile from './pages/CorporateProfile';
import PostJobWizard from './pages/PostJobWizard';
import PostedJobsRegistry from './pages/PostedJobsRegistry';
import JobAnalyticsDashboard from './pages/JobAnalyticsDashboard';
import './index.css';

// Higher-Order Security Guard for Recruiter Boundaries
function ProtectedRecruiterRoute({ children }) {
  const secureToken = localStorage.getItem('recruiterToken');
  
  if (!secureToken) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function RecruiterAppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Authorization Entrypoint */}
        <Route path="/login" element={<RecruiterLogin />} />

        {/* Private Protected Corporate Workspace Modules */}
        <Route 
          path="/profile" 
          element={
            <ProtectedRecruiterRoute>
              <CorporateProfile />
            </ProtectedRecruiterRoute>
          } 
        />
        <Route 
          path="/post-job" 
          element={
            <ProtectedRecruiterRoute>
              <PostJobWizard />
            </ProtectedRecruiterRoute>
          } 
        />
        <Route 
          path="/posted-jobs" 
          element={
            <ProtectedRecruiterRoute>
              <PostedJobsRegistry />
            </ProtectedRecruiterRoute>
          } 
        />
        
        {/* Parametric addressing interception logic mapped using router wildcards */}
        <Route 
          path="/jobs/:jobId/analytics" 
          element={
            <ProtectedRecruiterRoute>
              <JobAnalyticsDashboard />
            </ProtectedRecruiterRoute>
          } 
        />

        {/* Fallback Catch-All Navigation Loop */}
        <Route path="*" element={<Navigate to="/posted-jobs" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RecruiterAppRouter />
  </React.StrictMode>
);