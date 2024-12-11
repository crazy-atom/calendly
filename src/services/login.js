const bcrypt = require('bcrypt');
const crypto = require('crypto');

const UserModel = require('../models/userModel');
const logger = require('../utils/logger');

async function generateAndUpdateToken(userId) {
  const sid = crypto.randomBytes(24).toString('base64');
  const sidHash = await bcrypt.hash(sid, 8);
  await UserModel.findByIdAndUpdate(userId, { sidHash });
  return `${userId}-${sid}`;
}

async function login(req, res) {
  const { username, password } = req.body;
  try {
    const user = await UserModel.findOne({ username }).exec();
    if (!user) {
      return res.status(404).json({ message: 'Please register User not found' });
    }

    if (!(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ message: 'Invalid Credentials' });
    }
    const token = await generateAndUpdateToken(user.id);
    logger.info(`user ${username} successfully logged in: ${token}`);
    return res.json({ token });
  } catch (err) {
    return res.status(500).json({ message: 'Internal Server Error', err });
  }
}

module.exports = login;
