const express = require('express');
const router = express.Router();
const analyticsCtrl = require('../controllers/analyticsController');
const managementBarrier = require('../middleware/managementAuthBarrier');

// Protected State Secretariat Routing Matrix
router.get('/state-funnels/macro', managementBarrier, analyticsCtrl.getMacroStateFunnels);

module.exports = router;