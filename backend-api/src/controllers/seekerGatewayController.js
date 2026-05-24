// backend-api/src/controllers/seekerGatewayController.js
const SeekerRegistry = require('../models/SeekerRegistry');
const Job = require('../models/Job');
const MatchingTransaction = require('../models/MatchingTransaction');
const { calculateMatchScore } = require('../utils/matchingEngine');
const jwt = require('jsonwebtoken');

const tempOtpStorage = new Map();

// 🧠 Helper utility revised to include the mandatory Mandal location check for Prakasam
const evaluateProfileCompleteness = (seeker) => {
  return !!(seeker.fullName && seeker.district === 'Prakasam' && seeker.mandal && seeker.casteCategory);
};

// 📡 Trigger and dispatch secure temporary passkeys to citizen mobile targets
exports.requestSeekerOTP = async (req, res) => {
  const { phoneNumber } = req.body;
  if (!phoneNumber) return res.status(400).json({ error: 'Phone identification input required.' });
  
  const mockOtp = "123456"; // Standard secure operational bypass variable for sandbox testing
  tempOtpStorage.set(phoneNumber, { otp: mockOtp, expires: Date.now() + 300000 });
  
  console.log(`[SEEKER SMS OUTBOUND] Transmitted to ${phoneNumber} | Secure Token: ${mockOtp}`);
  return res.status(200).json({ success: true, message: 'Verification code triggered successfully.' });
};

// 🔐 Validate one-time string strings and initialize session state contexts
exports.verifySeekerOTP = async (req, res) => {
  const { phoneNumber, submittedOtp } = req.body;
  const standardRecord = tempOtpStorage.get(phoneNumber);

  if (!standardRecord || standardRecord.otp !== submittedOtp || Date.now() > standardRecord.expires) {
    return res.status(401).json({ error: 'Invalid or expired OTP token sequence.' });
  }

  try {
    let seeker = await SeekerRegistry.findOne({ phoneNumber });
    let isNewUser = false;

    if (!seeker) {
      // Hardlocked directly to Prakasam with default mandal to support newly registered drops
      seeker = await SeekerRegistry.create({
        phoneNumber,
        district: 'Prakasam', 
        mandal: 'Ongole', 
        casteCategory: 'OC',
        isProfileComplete: false
      });
      isNewUser = true;
    }

    const sessionToken = jwt.sign(
      { userId: seeker._id, role: 'seeker' },
      process.env.JWT_SECRET || 'DEFAULT_AP_SECRET_2026',
      { expiresIn: '24h' }
    );

    tempOtpStorage.delete(phoneNumber);

    // Evaluate structural profile completion flags dynamically before completing network handshake
    const isProfileComplete = evaluateProfileCompleteness(seeker);

    return res.status(200).json({ 
      token: sessionToken, 
      isNewUser, 
      isProfileComplete,
      seeker 
    });
  } catch (err) {
    return res.status(500).json({ error: 'Internal pipeline fault during onboarding.', systemLog: err.message });
  }
};

// 🔍 Pull current authorized profile tracking parameters
exports.getProfile = async (req, res) => {
  try {
    const seekerId = req.seekerContext._id;
    const currentSeeker = await SeekerRegistry.findById(seekerId);
    
    if (!currentSeeker) {
      return res.status(404).json({ error: 'Citizen record mapping index not found.' });
    }

    // Dynamic database calculation counting existing logs for metrics widgets
    const appliedCount = await MatchingTransaction.countDocuments({ seekerId });
    const shortlistedCount = await MatchingTransaction.countDocuments({ seekerId, applicationStatus: 'Anonymously-Approved' });

    const extendedProfile = currentSeeker.toObject();
    extendedProfile.appliedCount = appliedCount;
    extendedProfile.shortlistedCount = shortlistedCount;

    return res.status(200).json({ success: true, seeker: extendedProfile });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to access active profile registers.' });
  }
};

// 💾 Mutate registry attributes in-place inside document contexts
exports.updateProfile = async (req, res) => {
  try {
    const { fullName, dob, nativePlace, mandal, casteCategory, subCaste, qualification, skills, srcIdentifierRaw } = req.body;
    const targetSeeker = req.seekerContext;

    if (!targetSeeker) return res.status(404).json({ error: 'Active candidate reference lost.' });

    // Rework data vectors inside active document context memory pools
    targetSeeker.fullName = fullName || targetSeeker.fullName;
    targetSeeker.dob = dob || targetSeeker.dob;
    targetSeeker.nativePlace = nativePlace || targetSeeker.nativePlace;
    
    targetSeeker.district = 'Prakasam'; // Permanently assert District locking policy during mutations
    targetSeeker.mandal = mandal || targetSeeker.mandal; // Captures updated form payload option
    
    targetSeeker.casteCategory = casteCategory || targetSeeker.casteCategory;
    targetSeeker.subCaste = subCaste || targetSeeker.subCaste;
    targetSeeker.qualification = qualification || targetSeeker.qualification;
    targetSeeker.skills = skills || targetSeeker.skills;
    targetSeeker.meeSevaVerified = true;

    // Strict privacy masking configuration protects sensitive government variables
    if (srcIdentifierRaw) {
      targetSeeker.aadhaarUIDMasked = `XXXX-XXXX-${String(srcIdentifierRaw).slice(-4)}`;
    }

    // Set checking metric properties dynamically prior to saving changes
    targetSeeker.isProfileComplete = evaluateProfileCompleteness(targetSeeker);

    await targetSeeker.save();
    return res.status(200).json({ success: true, seeker: targetSeeker });
  } catch (err) {
    return res.status(500).json({ error: 'Database pipeline transformation error.', details: err.message });
  }
};

// 📡 Double-Blind Aggregation Vector Mapping: Filters jobs based on verified trainee skill matrices
exports.getAnonymizedJobFeed = async (req, res) => {
  try {
    const seeker = req.seekerContext;

    // Strict Hard Blocking Security Barrier Check Engine
    if (!seeker || !evaluateProfileCompleteness(seeker)) {
      return res.status(403).json({ error: 'Access Denied: Please complete profile setup properties to unlock the active feed.' });
    }

    const activeJobs = await Job.find({ status: 'Active' });

    // Mutation Mapping: Clear corporate metadata from listings during early application cycles
    const doubleBlindFeed = activeJobs.map(job => {
      const computedScore = calculateMatchScore(seeker.skills, job.requiredSkills);
      return {
        _id: job._id,
        title: job.title,
        description: job.description,
        requiredSkills: job.requiredSkills,
        districtLocation: job.districtLocation,
        salaryRange: job.salaryRange,
        matchScore: computedScore,
        corporateIdentityMasked: `AP-CORPORATE-ENTITY-${job.corporateId.toString().slice(-4).toUpperCase()}`
      };
    });

    // Output optimized list descending directly by mathematical match accuracy
    return res.status(200).json({ feed: doubleBlindFeed.sort((a, b) => b.matchScore - a.matchScore) });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to balance job feed indices.', details: err.message });
  }
};

// 🧬 Save application details anonymously inside decentralized transaction tables
exports.applyAnonymously = async (req, res) => {
  try {
    const { jobId } = req.body;
    const seeker = req.seekerContext;

    // Defensive Verification Barrier
    if (!seeker || !evaluateProfileCompleteness(seeker)) {
      return res.status(403).json({ error: 'Access Denied: Complete profile initialization before submitting submissions.' });
    }

    const targetJob = await Job.findById(jobId);
    if (!targetJob) return res.status(404).json({ error: 'Target vacancy registry entry not found.' });

    const existingTx = await MatchingTransaction.findOne({ seekerId: seeker._id, jobId: targetJob._id });
    if (existingTx) return res.status(400).json({ error: 'Application entry duplicates locked.' });

    const calculatedScore = calculateMatchScore(seeker.skills, targetJob.requiredSkills);

    const transaction = await MatchingTransaction.create({
      seekerId: seeker._id,
      jobId: targetJob._id,
      corporateId: targetJob.corporateId,
      matchScore: calculatedScore,
      applicationStatus: 'Applied'
    });

    return res.status(201).json({ success: true, trackingToken: transaction._id });
  } catch (err) {
    return res.status(500).json({ error: 'Transaction linking failure.', details: err.message });
  }
};

// 📊 Pull application history arrays securely for active tracking displays
exports.getSeekerAppliedHistory = async (req, res) => {
  try {
    const historyLogs = await MatchingTransaction.find({ seekerId: req.seekerContext._id })
      .populate('jobId')
      .sort({ createdAt: -1 });

    const doubleBlindHistory = historyLogs.map(log => {
      const job = log.jobId;
      if (!job) return null;

      return {
        _id: log._id,
        jobTitle: job.title,
        districtLocation: job.districtLocation,
        matchScore: log.matchScore,
        applicationStatus: log.applicationStatus,
        createdAt: log.createdAt,
        corporateIdentityMasked: `AP-CORPORATE-ENTITY-${log.corporateId.toString().slice(-4).toUpperCase()}`
      };
    }).filter(item => item !== null);

    return res.status(200).json({ success: true, history: doubleBlindHistory });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to balance tracking ledger indices.', details: error.message });
  }
};