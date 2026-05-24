// backend-api/src/controllers/analyticsController.js
const SeekerRegistry = require('../models/SeekerRegistry');
const CorporateRegistry = require('../models/CorporateRegistry');
const MatchingTransaction = require('../models/MatchingTransaction');
const Job = require('../models/Job');
const mongoose = require('mongoose');

// 📊 1. Macro Analytical Reporting Stream (Your Robust Matrix Code)
exports.getMacroStateFunnels = async (req, res) => {
  try {
    const officialAPDistricts = [
      'Alluri Sitharama Raju', 'Anakapalli', 'Anantapur', 'Annamayya', 'Bapatla', 'Chittoor', 
      'Dr. B.R. Ambedkar Konaseema', 'East Godavari', 'Eluru', 'Guntur', 'Kakinada', 'Krishna', 
      'Kurnool', 'Nandyal', 'NTR', 'Palnadu', 'Parvathipuram Manyam', 'Prakasam', 'Srikakulam', 
      'Sri Potti Sriramulu Nellore', 'Sri Sathya Sai', 'Tirupati', 'Visakhapatnam', 'Vizianagaram', 
      'West Godavari', 'YSR Kadapa'
    ];

    const districtLookupMap = {};
    officialAPDistricts.forEach(district => {
      districtLookupMap[district] = 0;
    });

    const districtPipelineAggregation = await SeekerRegistry.aggregate([
      { $group: { _id: "$district", totalRegisteredSeekers: { $sum: 1 } } },
      { $sort: { totalRegisteredSeekers: -1 } }
    ]);

    districtPipelineAggregation.forEach(bucket => {
      if (bucket._id && districtLookupMap[bucket._id] !== undefined) {
        districtLookupMap[bucket._id] = bucket.totalRegisteredSeekers;
      }
    });

    const standardizedDistribution = Object.entries(districtLookupMap).map(([district, total]) => ({
      district,
      totalRegisteredSeekers: total
    }));

    const totalApplicationsCount = await MatchingTransaction.countDocuments();
    const totalEnterpriseCount = await CorporateRegistry.countDocuments({ isVerified: true });
    const verifiedSeekersCount = await SeekerRegistry.countDocuments({ meeSevaVerified: true });

    return res.status(200).json({
      success: true,
      timestamp: Date.now(),
      districtDistribution: standardizedDistribution,
      summary: {
        totalRegisteredSeekers: await SeekerRegistry.countDocuments(),
        verifiedMeeSevaCandidates: verifiedSeekersCount,
        activeHiringEntities: totalEnterpriseCount,
        totalActiveVacancies: await Job.countDocuments()
      },
      funnelStages: {
        totalSubmissions: totalApplicationsCount,
        breakdown: {
          Applied: await MatchingTransaction.countDocuments({ applicationStatus: 'Applied' }),
          "Under-Review": await MatchingTransaction.countDocuments({ applicationStatus: 'Under-Review' }),
          "Anonymously-Approved": await MatchingTransaction.countDocuments({ applicationStatus: 'Anonymously-Approved' }),
          Rejected: await MatchingTransaction.countDocuments({ applicationStatus: 'Rejected' })
        }
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'State macro analytics engine failed.', metricsLog: err.message });
  }
};

// 💼 2. Master Vacancy Aggregator (Binds corporate tenant metadata to metric velocity counters)
exports.getManagementVacanciesRegistry = async (req, res) => {
  try {
    const aggregateJobsList = await Job.aggregate([
      {
        $lookup: {
          from: 'matching_transactions', // Connect transactions ledger table to extract live counts
          localField: '_id',
          foreignField: 'jobId',
          as: 'applications'
        }
      },
      {
        $lookup: {
          from: 'corporates', // Cross-tenant read parses clear company identity text blocks
          localField: 'corporateId',
          foreignField: '_id',
          as: 'corporateDetails'
        }
      },
      { $unwind: { path: '$corporateDetails', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          title: 1,
          districtLocation: 1,
          createdAt: 1,
          "corporateId.companyName": { $ifNull: ["$corporateDetails.companyName", "AP-CORPORATE-HIDDEN"] },
          applicantCount: { $size: '$applications' }
        }
      },
      { $sort: { createdAt: -1 } }
    ]);

    return res.status(200).json({ success: true, jobs: aggregateJobsList });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to aggregate system-wide vacancies.', log: error.message });
  }
};

// 🧬 3. Micro-Demographic Analyzer (Processes breakdown distributions for targeted vacancies)
exports.getSpecificVacancyDemographicsAnalysis = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Direct database lookup isolating matching transaction matrices
    const subApplications = await MatchingTransaction.find({ jobId: new mongoose.Types.ObjectId(jobId) })
      .populate('seekerId');

    const distributions = { districts: {}, castes: {}, qualifications: {} };

    subApplications.forEach(tx => {
      const candidate = tx.seekerId;
      if (!candidate) return;

      // Increment metric aggregation states dynamically in-memory
      distributions.districts[candidate.district] = (distributions.districts[candidate.district] || 0) + 1;
      distributions.castes[candidate.casteCategory] = (distributions.castes[candidate.casteCategory] || 0) + 1;
      
      const degreeLabel = candidate.qualification?.degree || 'Undergrad/General';
      distributions.qualifications[degreeLabel] = (distributions.qualifications[degreeLabel] || 0) + 1;
    });

    return res.status(200).json({ success: true, distributions });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to run demographic distribution calculations.', log: error.message });
  }
};
// backend-api/src/controllers/analyticsController.js

// Keep your existing methods intact (getMacroStateFunnels, getManagementVacanciesRegistry, etc.)

// 🏛️ Localized Sub-District Demographic Allocation Compiler
exports.getPrakasamMandalsAnalysis = async (req, res) => {
  try {
    // Statutory baseline mapping for sub-district administrative validation
    const officialPrakasamMandals = [
      'Addanki', 'Bapatla', 'Chinna Ganjam', 'Chirala', 'Darsi', 
      'Donakonda', 'Giddalur', 'Inkollu', 'Jarugumalli', 'Kandukur', 
      'Kanigiri', 'Karamchedu', 'Kothapatnam', 'Markapur', 'Martur', 
      'Ongole', 'Parchur', 'Podili', 'Santhanuthalapadu', 'Tangutur'
    ];

    // Initialize baseline structure tracking arrays populated with zero variables
    const mandalLookupMap = {};
    officialPrakasamMandals.forEach(mandal => {
      mandalLookupMap[mandal] = 0;
    });

    // Execute targeted regional database aggregations matching the localized criteria
    const mandalAggregationPipeline = await SeekerRegistry.aggregate([
      { 
        $match: { 
          district: 'Prakasam' 
        } 
      },
      { 
        $group: { 
          _id: "$nativePlace", 
          totalTrainees: { $sum: 1 } 
        } 
      }
    ]);

    // Hydrate local map values from document counts
    mandalAggregationPipeline.forEach(bucket => {
      if (bucket._id && mandalLookupMap[bucket._id] !== undefined) {
        mandalLookupMap[bucket._id] = bucket.totalTrainees;
      }
    });

    // Transform map indices back to a predictable rows response contract matrix
    const standardizedRegionalMetrics = Object.entries(mandalLookupMap).map(([mandal, total]) => ({
      mandal,
      totalRegisteredTrainees: total
    }));

    return res.status(200).json({
      success: true,
      timestamp: Date.now(),
      regionalDistribution: standardizedRegionalMetrics
    });

  } catch (err) {
    // Gracefully catch background trace faults, ensuring CORS compliance continues on execution errors
    return res.status(500).json({ 
      success: false, 
      error: 'State regional sub-mandal calculation routine terminated.', 
      metricsLog: err.message 
    });
  }
};