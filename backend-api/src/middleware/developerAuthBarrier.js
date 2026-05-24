const jwt = require('jsonwebtoken');
const securityConfig = require('../config/security');

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const clientHardwareSignature = req.headers['x-dev-hardware-checksum'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Access Denied. Root tokens missing.' });
    }

    // Cryptographic Hardware Key Matching
    if (clientHardwareSignature !== securityConfig.developerProfile.hardwareKeyChecksum) {
      return res.status(403).json({ error: 'Access Denied. Physical hardware signature verification failed.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, securityConfig.jwtSecret);

    if (decoded.role !== 'developer') {
      return res.status(403).json({ error: 'Security Matrix Violation. Action restricted to core infrastructure administrators.' });
    }

    req.developerIdentity = { systemRoot: true };
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Developer terminal token signature validation failed.' });
  }
};