const mongoose = require('mongoose');

// This functions as the immutable, double-blind transaction log. Neither seeker nor recruiter profiles are nested.
const MatchingTransactionSchema = new mongoose.Schema({
  seekerId: { type: mongoose.Schema.Types.ObjectId, ref: 'SeekerRegistry', required: true, index: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true, index: true },
  corporateId: { type: mongoose.Schema.Types.ObjectId, ref: 'CorporateRegistry', required: true, index: true },
  matchScore: { type: Number, required: true },
  applicationStatus: { 
    type: String, 
    enum: ['Applied', 'Under-Review', 'Anonymously-Approved', 'Rejected'], 
    default: 'Applied',
    index: true 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MatchingTransaction', MatchingTransactionSchema, 'matching_transactions');