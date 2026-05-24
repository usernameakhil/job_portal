// backend-api/src/routes/seekerGateway.js
const express = require('express');
const router = express.Router();
const seekerCtrl = require('../controllers/seekerGatewayController');
const seekerBarrier = require('../middleware/seekerAuthBarrier');

// Public Access Onboarding Gateways
router.post('/auth/request-otp', seekerCtrl.requestSeekerOTP);
router.post('/auth/verify-otp', seekerCtrl.verifySeekerOTP);
router.get('/jobs/applied-history', seekerBarrier, seekerCtrl.getSeekerAppliedHistory);

// Isolated Private Operations Area
router.get('/jobs/anonymous-feed', seekerBarrier, seekerCtrl.getAnonymizedJobFeed);
router.get('/profile/me', seekerBarrier, seekerCtrl.getProfile);
router.put('/profile/update', seekerBarrier, seekerCtrl.updateProfile);

// Unified Application Rule Path Fixes the 404 Error
router.post('/applications/apply', seekerBarrier, seekerCtrl.applyAnonymously);

module.exports = router;