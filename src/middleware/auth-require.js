const { AuthenticationError } = require('../errors');

module.exports = (req, res, next) => {
  if (!req.userId) throw new AuthenticationError();
  return next();
};
