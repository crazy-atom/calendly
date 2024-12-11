const { UserError } = require('../errors');
const logger = require('../utils/logger');

module.exports = (err, req, res, next) => {
  logger.error(err.stack);
  if (res.headersSent) return next(err);
  if (err instanceof UserError) {
    return res.status(err.statusCode).json({
      status: 'error',
      statusCode: err.statusCode,
      message: err.message,
    });
  }
  return res.status(500).json({
    status: 'error',
    statusCode: 500,
    error: 'Internal Server Error',
  });
};
