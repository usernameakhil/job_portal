const BASE_URL = 'http://localhost:8080/api/v1/seeker';

const fetchWithAuth = async (endpoint, options = {}) => {
  const token = localStorage.getItem('seekerToken');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || `HTTP operation failed with status code ${response.status}`);
  }
  return data;
};

export const seekerApi = {
  requestOtp: (phoneNumber) => fetchWithAuth('/auth/request-otp', {
    method: 'POST',
    body: JSON.stringify({ phoneNumber })
  }),
  
  verifyOtp: (phoneNumber, submittedOtp) => fetchWithAuth('/auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ phoneNumber, submittedOtp })
  }),
  
  getProfile: () => fetchWithAuth('/profile/me', { method: 'GET' }),
  
  syncProfileData: (payload) => fetchWithAuth('/profile/update', {
    method: 'PUT',
    body: JSON.stringify(payload)
  }),
  
  getAnonymousFeed: () => fetchWithAuth('/jobs/anonymous-feed', { method: 'GET' }),
  
  applyAnonymously: (jobId) => fetchWithAuth('/jobs/apply', {
    method: 'POST',
    body: JSON.stringify({ jobId })
  }),

  getAppliedRegistry: () => fetchWithAuth('/jobs/applied-history', { method: 'GET' })
};