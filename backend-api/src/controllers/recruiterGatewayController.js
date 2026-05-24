// backend-api/src/controllers/recruiterGatewayController.js
const CorporateRegistry = require('../models/CorporateRegistry');
const Job = require('../models/Job');
const MatchingTransaction = require('../models/MatchingTransaction');
const CorporateOtp = require('../models/CorporateOtp');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// Request secure OTP token validation vectors
exports.requestRecruiterOTP = async (req, res) => {
  try {
    const { phoneNumber, companyName, cinNumber, industryType } = req.body;
    if (!phoneNumber) {
      return res.status(400).json({ error: 'Corporate registration mobile channel required.' });
    }

    const cleanPhone = String(phoneNumber).replace(/\D/g, '').slice(-10);
    const mockOtp = "654321";

    await CorporateOtp.findOneAndUpdate(
      { phoneNumber: cleanPhone },
      { 
        otp: mockOtp, 
        companyName, 
        cinNumber, 
        industryType,
        createdAt: Date.now()
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    
    console.log(`[RECRUITER SMS SECURITY GATE] Dispatched token to ${cleanPhone} | Secure Code: ${mockOtp}`);
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to write validation tokens.', log: error.message });
  }
};

// Verify incoming OTP tokens and initialize enterprise signatures
exports.verifyRecruiterOTP = async (req, res) => {
  try {
    const { phoneNumber, submittedOtp } = req.body;
    if (!phoneNumber || !submittedOtp) {
      return res.status(400).json({ error: 'Missing phone mapping reference or secure code.' });
    }
    
    const cleanPhone = String(phoneNumber).replace(/\D/g, '').slice(-10);
    const cacheData = await CorporateOtp.findOne({ phoneNumber: cleanPhone });

    if (!cacheData || cacheData.otp !== String(submittedOtp).trim()) {
      return res.status(401).json({ error: 'Invalid security code or verification window closed.' });
    }

    let corporate = await CorporateRegistry.findOne({ phoneNumber: cleanPhone });
    
    if (!corporate) {
      // Repaired instantiation explicitly provides all schema-required strings
      corporate = await CorporateRegistry.create({
        phoneNumber: cleanPhone,
        companyName: cacheData.companyName || "Provisional Entity",
        cinNumber: cacheData.cinNumber || `CIN-TEMP-${Date.now()}`,
        industryType: cacheData.industryType || "General Sector",
        registeredDistrict: "NTR",
        headquartersCity: "Pending Configuration", // Satisfies schema requirement
        isVerified: true
      });
    }

    const token = jwt.sign(
      { userId: corporate._id, role: 'recruiter' },
      process.env.JWT_SECRET || 'DEFAULT_AP_SECRET_2026',
      { expiresIn: '24h' }
    );

    await CorporateOtp.deleteOne({ phoneNumber: cleanPhone });

    return res.status(200).json({ success: true, token, corporate });
  } catch (err) {
    return res.status(500).json({ error: 'Corporate authorization gate failure.', log: err.message });
  }
};

// Post active corporate vacancies to registry indexes
exports.postJobRequirement = async (req, res) => {
  try {
    const { title, description, requiredSkills, experienceRequired, districtLocation, salaryRange } = req.body;
    
    const newJob = await Job.create({
      corporateId: req.corporateContext._id,
      title,
      description,
      requiredSkills,
      experienceRequired,
      districtLocation,
      salaryRange
    });

    return res.status(201).json({ success: true, job: newJob });
  } catch (error) {
    return res.status(500).json({ error: 'Job insertion faulted inside cluster registers.', log: error.message });
  }
};

// Fetch applicants under a double-blind privacy mask block
exports.getAnonymizedApplicants = async (req, res) => {
  try {
    const matches = await MatchingTransaction.find({ corporateId: req.corporateContext._id })
      .populate('seekerId');

    const anonymizedPool = matches.map(tx => {
      const sk = tx.seekerId;
      if (!sk) return null;
      
      return {
        transactionId: tx._id,
        jobId: tx.jobId,
        matchScore: tx.matchScore,
        applicationStatus: tx.applicationStatus,
        maskedCandidateToken: `AP-CANDIDATE-MASK-${sk._id.toString().slice(-4).toUpperCase()}`,
        candidateMetrics: {
          district: sk.district,
          casteCategory: sk.casteCategory,
          qualification: sk.qualification,
          skills: sk.skills
        }
      };
    }).filter(item => item !== null);

    return res.status(200).json({ pool: anonymizedPool });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to compile blind matching vectors.', log: err.message });
  }
};

// Transition status tracker states within security bounds
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const { status } = req.body;

    const validStates = ['Applied', 'Under-Review', 'Anonymously-Approved', 'Rejected'];
    if (!validStates.includes(status)) {
      return res.status(400).json({ error: 'Invalid tracking state assignment.' });
    }

    const transaction = await MatchingTransaction.findOneAndUpdate(
      { _id: transactionId, corporateId: req.corporateContext._id },
      { applicationStatus: status },
      { new: true }
    );

    if (!transaction) {
      return res.status(404).json({ error: 'Application index pair not found or access restricted.' });
    }

    return res.status(200).json({ success: true, updatedTransaction: transaction });
  } catch (error) {
    return res.status(500).json({ error: 'Transaction status modification failed.', log: error.message });
  }
};

// Pull consolidated list of vacancies posted by requesting firm
exports.getCorporatePostedJobs = async (req, res) => {
  try {
    const jobsWithCounts = await Job.aggregate([
      { $match: { corporateId: req.corporateContext._id } },
      {
        $lookup: {
          from: 'matching_transactions',
          localField: '_id',
          foreignField: 'jobId',
          as: 'applications'
        }
      },
      {
        $project: {
          title: 1, description: 1, requiredSkills: 1, experienceRequired: 1,
          districtLocation: 1, salaryRange: 1, createdAt: 1,
          applicantCount: { $size: '$applications' }
        }
      },
      { $sort: { createdAt: -1 } }
    ]);

    return res.status(200).json({ success: true, jobs: jobsWithCounts });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to parse corporate vacancy aggregates.', log: err.message });
  }
};

// Compile deep micro-demographic charts for selected vacancy profiles
exports.getSpecificJobAnalytics = async (req, res) => {
  try {
    const { jobId } = req.params;

    const jobVerify = await Job.findOne({ _id: jobId, corporateId: req.corporateContext._id });
    if (!jobVerify) return res.status(403).json({ error: 'Access restricted or invalid vacancy pointer reference.' });

    const applications = await MatchingTransaction.find({ jobId: new mongoose.Types.ObjectId(jobId) })
      .populate('seekerId');

    const mappedApplicants = [];
    const distributions = { districts: {}, castes: {}, qualifications: {} };

    applications.forEach(tx => {
      const sk = tx.seekerId;
      if (!sk) return;

      mappedApplicants.push({
        transactionId: tx._id,
        jobId: tx.jobId,
        matchScore: tx.matchScore,
        applicationStatus: tx.applicationStatus,
        maskedCandidateToken: `AP-CANDIDATE-MASK-${sk._id.toString().slice(-4).toUpperCase()}`,
        candidateMetrics: {
          district: sk.district,
          casteCategory: sk.casteCategory,
          qualification: sk.qualification,
          skills: sk.skills
        }
      });

      distributions.districts[sk.district] = (distributions.districts[sk.district] || 0) + 1;
      distributions.castes[sk.casteCategory] = (distributions.castes[sk.casteCategory] || 0) + 1;
      
      const degreeLabel = sk.qualification?.degree || 'Undergrad/General';
      distributions.qualifications[degreeLabel] = (distributions.qualifications[degreeLabel] || 0) + 1;
    });

    return res.status(200).json({ success: true, distributions, applicants: mappedApplicants });
  } catch (err) {
    return res.status(500).json({ error: 'Real-time metrics compilation exception thrown.', log: err.message });
  }
};

// Pull current verified session identity
exports.getRecruiterProfile = async (req, res) => {
  try {
    return res.status(200).json({ success: true, corporate: req.corporateContext });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to access active corporate registries.' });
  }
};

// Modify enterprise variables inside active collection indexes
exports.updateRecruiterProfile = async (req, res) => {
  try {
    const { companyName, cinNumber, industryType, registeredDistrict, headquartersCity } = req.body;
    const targetCorp = req.corporateContext;

    if (!targetCorp) {
      return res.status(404).json({ error: 'Authorized corporate session frame lost.' });
    }

    targetCorp.companyName = companyName || targetCorp.companyName;
    targetCorp.cinNumber = cinNumber || targetCorp.cinNumber;
    targetCorp.industryType = industryType || targetCorp.industryType;
    targetCorp.registeredDistrict = registeredDistrict || targetCorp.registeredDistrict;
    targetCorp.headquartersCity = headquartersCity || targetCorp.headquartersCity;
    targetCorp.isVerified = true;

    await targetCorp.save();
    return res.status(200).json({ success: true, corporate: targetCorp });
  } catch (error) {
    return res.status(500).json({ error: 'Database transaction mutation faulted.', details: error.message });
  }
};