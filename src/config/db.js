const mongoose = require('mongoose');

const config = require('../conf');

const connectDB = async () => {
  try {
    await mongoose.connect(
      config.mongoUri,
      { useUnifiedTopology: true },
    );
    console.log('Connected to MongoDB...........');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;
