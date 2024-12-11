const bcrypt = require('bcrypt');

const UserModel = require('../models/userModel');

function splitToken(token) {
  const [userId, sid] = token.split('-');
  return {
    userId,
    sid,
  };
}

module.exports = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return next();

  const { userId, sid } = splitToken(token);
  const user = await UserModel.findById(userId);
  if (!user) return next();
  const isValidHash = await bcrypt.compare(sid, user.sidHash);
  if (isValidHash) { req.userId = userId; }

  return next();
};
