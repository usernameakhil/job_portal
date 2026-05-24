// backend-api/src/routes/recruiterGateway.js
const express = require('express');
const router = express.Router();
const recruiterCtrl = require('../controllers/recruiterGatewayController');
const recruiterBarrier = require('../middleware/recruiterAuthBarrier');

// Public Enterprise Sign-In Routing Hooks
router.post('/auth/request-otp', recruiterCtrl.requestRecruiterOTP);
router.post('/auth/verify-otp', recruiterCtrl.verifyRecruiterOTP);

// Corporate Operations Area (Strict Isolation Level 4)
router.post('/jobs/create', recruiterBarrier, recruiterCtrl.postJobRequirement);
router.get('/applicants/blind-pool', recruiterBarrier, recruiterCtrl.getAnonymizedApplicants);
router.get('/jobs/posted', recruiterBarrier, recruiterCtrl.getCorporatePostedJobs);
router.get('/jobs/:jobId/analytics', recruiterBarrier, recruiterCtrl.getSpecificJobAnalytics);
router.get('/profile/me', recruiterBarrier, recruiterCtrl.getRecruiterProfile);
router.put('/profile/update', recruiterBarrier, recruiterCtrl.updateRecruiterProfile);

// ⚡ LIVE TRANSACTION LINK ROUTE FOR PIPELINE ACTIONS
router.put('/applications/:transactionId/status', recruiterBarrier, recruiterCtrl.updateApplicationStatus);

module.exports = router;