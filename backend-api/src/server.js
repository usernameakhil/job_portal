// backend-api/src/server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDatabasePool = require('./config/db');

const app = express();
app.use(express.json());

// Dynamic Global Access Perimeter Configuration
app.use(cors({
  origin: (origin, callback) => {
    // Allows internal server-to-server calls, Postman, or local scripts (where origin is undefined)
    if (!origin) {
      return callback(null, true);
    }
    
    // Automatically mirrors the incoming domain back to the browser to authorize the transaction
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-dev-hardware-checksum'],
  credentials: true,
  optionsSuccessStatus: 200 // Resolves browser OPTIONS preflight challenges instantly
}));

// Bind route channels to separate infrastructure network gateways
app.use('/api/v1/seeker', require('./routes/seekerGateway'));
app.use('/api/v1/recruiter', require('./routes/recruiterGateway'));
app.use('/api/v1/management', require('./routes/analyticsGateway'));
app.use('/api/v1/developer', require('./routes/developerGateway'));

const runtimePort = process.env.PORT || 8080;

connectDatabasePool().then(() => {
  app.listen(runtimePort, () => {
    console.log(`[SYSTEM OPERATIONAL CORE MASTER RUNNING ON PORT: ${runtimePort}]`);
  });
});