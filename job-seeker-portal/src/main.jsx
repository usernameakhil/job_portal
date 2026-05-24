// job-seeker-portal/src/main.jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SeekerLogin from './pages/SeekerLogin';
import PrivateFeed from './pages/PrivateFeed';
import OnboardingVerification from './pages/OnboardingVerification';
import AppliedJobsRegistry from './pages/AppliedJobsRegistry';
import ProfileManagement from './pages/ProfileManagement';
import './index.css';

// Higher-Order Component to protect private applicant gateways
function ProtectedRoute({ children }) {
  const secureToken = localStorage.getItem('seekerToken');
  
  if (!secureToken) {
    // Redirects unauthenticated traffic straight to the login engine context cleanly
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

function SeekerAppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Infrastructure Gateways */}
        <Route path="/login" element={<SeekerLogin />} />

        {/* Private Protected Citizen Portals */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <PrivateFeed />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/onboarding" 
          element={
            <ProtectedRoute>
              <OnboardingVerification mode="onboard" />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/edit-profile" 
          element={
            <ProtectedRoute>
              <OnboardingVerification mode="edit" />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/applied-jobs" 
          element={
            <ProtectedRoute>
              <AppliedJobsRegistry />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <ProfileManagement />
            </ProtectedRoute>
          } 
        />

        {/* Catch-all Fallback Route Mapping */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SeekerAppRouter />
  </React.StrictMode>
);