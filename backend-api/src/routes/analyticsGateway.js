// backend-api/src/routes/analyticsGateway.js
const express = require('express');
const router = express.Router();
const analyticsCtrl = require('../controllers/analyticsController');

// Route 1: Macro analytical reporting data stream endpoint
router.get('/state-funnels/macro', analyticsCtrl.getMacroStateFunnels);

// Route 1B: Localized Regional Mandal Allocation Array (Added)
router.get('/state-funnels/prakasam-mandals', analyticsCtrl.getPrakasamMandalsAnalysis);

// Route 2: Master Vacancy Management Tracker Matrix
router.get('/all-vacancies', analyticsCtrl.getManagementVacanciesRegistry);

// Route 3: Targeted Vacancy Demographic Allocation Identifier
router.get('/vacancies/:jobId/demographics', analyticsCtrl.getSpecificVacancyDemographicsAnalysis);

module.exports = router;