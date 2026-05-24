// backend-api/src/models/CorporateRegistry.js
const mongoose = require('mongoose');

const CorporateRegistrySchema = new mongoose.Schema({
  phoneNumber: { type: String, required: true, unique: true, index: true },
  role: { type: String, default: 'recruiter', immutable: true },
  isVerified: { type: Boolean, default: false },
  companyName: { type: String, required: true },
  cinNumber: { type: String, required: true, unique: true },
  industryType: { type: String, required: true },
  
  // ⚡ BALANCED FIELD MAPPINGS: Required to persist frontend form state properties cleanly
  registeredDistrict: { type: String, required: true, default: 'NTR' },
  headquartersCity: { type: String, required: true },
  
  verificationStatus: { type: String, enum: ['Pending', 'Approved', 'Flagged'], default: 'Approved' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CorporateRegistry', CorporateRegistrySchema, 'corporates');