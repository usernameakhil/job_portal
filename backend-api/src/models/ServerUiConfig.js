const mongoose = require('mongoose');

const ServerUiConfigSchema = new mongoose.Schema({
  portalKey: { type: String, required: true, unique: true, index: true }, // e.g., 'global-landing', 'seeker-styles'
  themeEngine: {
    brandPrimary: { type: String, default: "#0b6623" },
    interactiveElement: { type: String, default: "#1e3a8a" },
    canvasBackground: { type: String, default: "#f3f4f6" },
    textHeader: { type: String, default: "#111827" }
  },
  announcementTicker: { type: String, default: "Welcome to AP State Youth Employment Gateways." },
  lastModifiedBy: { type: String, default: "system-root" },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ServerUiConfig', ServerUiConfigSchema, 'ui_configurations');