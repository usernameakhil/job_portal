/**
 * Security and Cryptographic Profile Configuration
 * Enforces strict perimeter token configurations per micro-frontend portal tenant.
 */

module.exports = {
  // Global Token Signatures
  jwtSecret: process.env.JWT_SECRET || 'AP_STATE_HIGH_SECURITY_ENCRYPTION_SECRET_KEY_PRODUCTION_2026',
  tokenExpiry: '24h',

  // Tenant-Specific Security Profiles
  seekerProfile: {
    allowedChannels: ['SMS', 'MeeSeva-API'],
    sessionLockMinutes: 1440 // 24 hours
  },

  recruiterProfile: {
    allowedChannels: ['SMS', 'Corporate-Email'],
    sessionLockMinutes: 720, // 12 hours
    requireCinValidation: true
  },

  managementProfile: {
    // Whitelisted Static IP Subnets representing State Secretariat data centers and authorized WAN boundaries
    authorizedGovSubnets: [
      '127.0.0.1',       // Local sandbox debugging execution environment
      '10.240.',         // Internal AP State Data Center Network (Example Subnet)
      '164.100.'         // National Informatics Centre (NIC) AP State Node (Example Subnet)
    ],
    mfaRequired: true
  },

  developerProfile: {
    // Advanced access control layers requiring high-entropy platform tokens
    rootVpnOnly: true,
    hardwareKeyChecksum: process.env.DEV_HARDWARE_KEY_HASH || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
  }
};