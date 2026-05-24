// management-dashboard/src/main.jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ManagementLogin from './pages/ManagementLogin';
import MacroInsightsHub from './pages/MacroInsightsHub';
import VacancyAnalysisMatrix from './pages/VacancyAnalysisMatrix';
import TargetJobMetrics from './pages/TargetJobMetrics';
import './index.css';

// Route security gate: Enforce administrative login checks
function ProtectedAdminRoute({ children }) {
  const isAuthenticated = localStorage.getItem('adminAuthenticated') === 'true';
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function ManagementPortalAppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Authorization Entrypoint */}
        <Route path="/login" element={<ManagementLogin />} />

        {/* Private Protected Administration Gateways */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedAdminRoute>
              <MacroInsightsHub />
            </ProtectedAdminRoute>
          } 
        />
        <Route 
          path="/vacancies" 
          element={
            <ProtectedAdminRoute>
              <VacancyAnalysisMatrix />
            </ProtectedAdminRoute>
          } 
        />
        
        {/* Clean parameterized routing matches target metrics seamlessly */}
        <Route 
          path="/vacancies/:jobId" 
          element={
            <ProtectedAdminRoute>
              <TargetJobMetrics />
            </ProtectedAdminRoute>
          } 
        />

        {/* Fallback Catch-All Strategy */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ManagementPortalAppRouter />
  </React.StrictMode>
);