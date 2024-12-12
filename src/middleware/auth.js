const jwt = require('jsonwebtoken');

const conf = require('../conf');
const UserModel = require('../models/userModel');
const { AuthenticationError } = require('../errors');

module.exports = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return next();

  try {
    const decoded = jwt.verify(token, conf.jwtSecret);
    const user = await UserModel.findById(decoded.userId);
    if (!user) {
      throw new AuthenticationError();
    }
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
