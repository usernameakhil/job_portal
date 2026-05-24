const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDatabasePool = require('./config/db');

const app = express();
app.use(express.json());

app.use(cors({
  origin: '*', // Production networks configure specific origin filters per portal domain mapping
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
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