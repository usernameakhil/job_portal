const jwt = require('jsonwebtoken');
const securityConfig = require('../config/security');

module.exports = async (req, res, next) => {
  try {
    // 1. IP Whitelist Perimeter Security Check
    const clientIp = req.ip || req.connection.remoteAddress;
    const isAuthorizedSubnet = securityConfig.managementProfile.authorizedGovSubnets.some(subnet => 
      clientIp.startsWith(subnet)
    );

    if (!isAuthorizedSubnet) {
      console.warn(`[SECURITY PERIMETER ALERT] Unauthorized Access Attempt from Non-Gov IP: ${clientIp}`);
      return res.status(403).json({ error: 'Access Denied. Request originates from outside authorized State WAN parameters.' });
    }

    // 2. Secret Token Matrix Check
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Access Denied. Management authentication context absent.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, securityConfig.jwtSecret);

    if (decoded.role !== 'management') {
      return res.status(403).json({ error: 'Security Matrix Violation. Route restricted to State Secretariat Officials.' });
    }

    req.adminUser = { id: decoded.userId, scope: 'State-Wide-Analytics' };
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Administrative session authorization token has expired or is invalid.' });
  }
};