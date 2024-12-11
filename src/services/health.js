const logger = require('../utils/logger');

function healthCheck(req, res) {
  logger.info('healthCheck Server is healthy');
  res.json({ success: true, message: 'Server is healthy' });
}

module.exports = healthCheck;
