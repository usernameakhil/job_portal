// backend-api/src/server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDatabasePool = require('./config/db');

const app = express();
app.use(express.json());

// ⚡ REPAIRED PERIMETER MATRIX WITH MANAGEMENT ORIGINS WHITELISTED
app.use(cors({
  origin: [
    'http://localhost:5173',   // Job Seeker Web Portal Node
    'http://127.0.0.1:5173',
    'http://localhost:5174',   // Recruiter Enterprise Web Portal Node
    'http://127.0.0.1:5174',
    'http://localhost:5176',   // Management Command Console Node (Added Hostname String)
    'http://127.0.0.1:5176'    // Management Command Console Node (IP Variant)
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-dev-hardware-checksum'],
  credentials: true
}));

// Bind route channels to separate gateways
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