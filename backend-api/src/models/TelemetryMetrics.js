const mongoose = require('mongoose');

/**
 * TelemetryMetrics Schema
 * Captures anonymous platform interaction telemetry to provide data insights to the management portal,
 * ensuring no candidate-identifying data crosses into corporate logs.
 */
const TelemetryMetricsSchema = new mongoose.Schema({
  eventType: { 
    type: String, 
    enum: ['Search-Query', 'Vacancy-Impression', 'Anonymized-Application-Click', 'Portal-Onboarding-Complete'], 
    required: true,
    index: true 
  },
  districtLocation: { 
    type: String, 
    required: true, 
    index: true 
  },
  metadata: {
    matchedSkillsCount: { type: Number },
    salaryOfferedMax: { type: Number },
    casteCategoryAgnostic: { type: String } // Aggregated for reservation balance tracking
  },
  timestamp: { 
    type: Date, 
    default: Date.now, 
    expires: 31536000 // Automatically purge metric payloads after 365 days to maintain lean data clusters
  }
});

module.exports = mongoose.model('TelemetryMetrics', TelemetryMetricsSchema, 'telemetry_metrics');