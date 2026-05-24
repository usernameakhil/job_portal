const jwt = require('jsonwebtoken');
const securityConfig = require('../config/security');
const CorporateRegistry = require('../models/CorporateRegistry');

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Access Denied. Corporate credentials missing.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, securityConfig.jwtSecret);

    // Enforce Tenant Blindness: Drop requests instantly if a different role tries to cross over
    if (decoded.role !== 'recruiter') {
      return res.status(403).json({ error: 'Security Violation. Invalid routing target domain.' });
    }

    const recruiter = await CorporateRegistry.findById(decoded.userId);
    if (!recruiter) {
      return res.status(401).json({ error: 'Identity verification failed within corporate scope.' });
    }

    if (recruiter.verificationStatus === 'Flagged') {
      return res.status(403).json({ error: 'Account suspended. Enterprise access restricted pending compliance check.' });
    }

    // Bind corporate profile to the request lifecycle
    req.corporateContext = recruiter;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Corporate session signature token has expired or is invalid.' });
  }
};