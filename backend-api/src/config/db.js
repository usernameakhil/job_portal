const mongoose = require('mongoose');

const connectDatabasePool = async () => {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 50,
      minPoolSize: 10,
      socketTimeoutMS: 45000,
      autoIndex: true
    });
    console.log(`[DATABASE CONNECTION SUCCESS] Unified Cluster Host: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error(`[DATABASE CRITICAL FAILURE] Initialization Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDatabasePool;