// recruiter-portal/src/services/recruiterApi.js
const BASE_URL = 'https://job-portal-backend-68x8.onrender.com/api/v1/recruiter';

const fetchWithAuth = async (endpoint, options = {}, requireAuth = true) => {
  const token = localStorage.getItem('recruiterToken');
  const headers = {
    'Content-Type': 'application/json',
    ...(requireAuth && token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
  const data = await response.json();
  
  if (!response.ok) throw new Error(data.error || `Server Error: ${response.status}`);
  return data;
};

export const recruiterApi = {
  requestOtp: (payload) => fetchWithAuth('/auth/request-otp', { method: 'POST', body: JSON.stringify(payload) }, false),
  verifyOtp: (phoneNumber, submittedOtp) => fetchWithAuth('/auth/verify-otp', { method: 'POST', body: JSON.stringify({ phoneNumber, submittedOtp }) }, false),
  createJob: (jobPayload) => fetchWithAuth('/jobs/create', { method: 'POST', body: JSON.stringify(jobPayload) }, true),
  
  // ⚡ NEW PRODUCTION DATA CHANNELS
  getPostedJobs: () => fetchWithAuth('/jobs/posted', { method: 'GET' }, true),
  getJobAnalytics: (jobId) => fetchWithAuth(`/jobs/${jobId}/analytics`, { method: 'GET' }, true),
  updateStatus: (txId, status) => fetchWithAuth(`/applications/${txId}/status`, { method: 'PUT', body: JSON.stringify({ status }) }, true)
};