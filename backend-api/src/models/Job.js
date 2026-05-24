const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  corporateId: { type: mongoose.Schema.Types.ObjectId, ref: 'CorporateRegistry', required: true, index: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  requiredSkills: [{ type: String, index: true }],
  experienceRequired: { type: Number, default: 0 },
  districtLocation: { type: String, required: true, index: true },
  salaryRange: {
    min: { type: Number, required: true },
    max: { type: Number, required: true }
  },
  status: { type: String, enum: ['Active', 'Filled', 'Archived'], default: 'Active', index: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Job', JobSchema, 'jobs');