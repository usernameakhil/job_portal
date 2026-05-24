const jwt = require('jsonwebtoken');
const SeekerRegistry = require('../models/SeekerRegistry');

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Access Denied. Token payload missing.' });
    }

    const clearToken = authHeader.split(' ')[1];
    const signature = jwt.verify(clearToken, process.env.JWT_SECRET || 'DEFAULT_AP_SECRET_2026');

    if (signature.role !== 'seeker') {
      return res.status(403).json({ error: 'Security Matrix Violation. Target routing mismatch.' });
    }

    const activeSeeker = await SeekerRegistry.findById(signature.userId);
    if (!activeSeeker) {
      return res.status(401).json({ error: 'Verification broken. Seeker identity not registered.' });
    }

    req.seekerContext = activeSeeker;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Session signature verification failed.', detail: error.message });
  }
};