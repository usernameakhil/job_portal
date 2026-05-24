const mongoose = require('mongoose');

const CorporateOtpSchema = new mongoose.Schema({
  phoneNumber: { type: String, required: true, unique: true, index: true },
  otp: { type: String, required: true },
  companyName: { type: String },
  cinNumber: { type: String },
  industryType: { type: String },
  createdAt: { type: Date, default: Date.now, expires: 300 } // ⚡ NATIVE MONGO TTL INDEX: Drop rows automatically after 5 minutes
});

module.exports = mongoose.model('CorporateOtp', CorporateOtpSchema, 'corporate_otps');