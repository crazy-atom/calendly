const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const conf = require('../conf');
const logger = require('../utils/logger');
const UserModel = require('../models/userModel');

function generateToken(userId) {
  return jwt.sign({ userId }, conf.jwtSecret, {
    expiresIn: conf.jwtSecretExpiresIn,
  });
}

async function login(req, res) {
  const { username, password } = req.body;
  const user = await UserModel.findOne({ username }).exec();
  if (!user) {
    return res.status(404).json({ message: 'Please register User not found' });
  }

  if (!(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ message: 'Invalid Credentials' });
  }
  const token = generateToken(user.id);
  logger.info(`user ${username} successfully logged in: ${token}`);
  return res.json({ token });
}

module.exports = login;
