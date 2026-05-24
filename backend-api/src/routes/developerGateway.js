const express = require('express');
const router = express.Router();
const devCtrl = require('../controllers/developerController');
const developerBarrier = require('../middleware/developerAuthBarrier');

// Hot-Reload Dynamic Server-Driven UI Control Endpoints
router.post('/sdui/push-config', developerBarrier, devCtrl.pushSduiThemeEngine);

// Unprotected public read access hook allows portals to securely fetch current style sheets and layout states
router.get('/sdui/fetch/:portalKey', devCtrl.getSduiConfiguration);

module.exports = router;