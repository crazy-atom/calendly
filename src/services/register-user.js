const bcrypt = require('bcrypt');

const UserModel = require('../models/userModel');
const logger = require('../utils/logger');

async function register(req, res) {
  const { username, password } = req.body;

  const existingUser = await UserModel.findOne({ username }).exec();
  if (existingUser) {
    return res.status(409).json({ message: 'Username already exists' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await UserModel.create({ username, passwordHash });
  logger.info(`User ${username} registered successfully.`);
  return res.status(201).json({ message: 'User registered successfully' });
}

module.exports = register;
