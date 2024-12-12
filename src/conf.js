module.exports = {
  port: process.env.PORT,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtSecretExpiresIn: process.env.JWT_EXPIRATION_TIME,
};
