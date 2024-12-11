require('dotenv').config();

require('express-async-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const { createHttpTerminator } = require('http-terminator');

const conf = require('./conf');
const connectDB = require('./config/db');
const authMiddleware = require('./middleware/auth');
const errorMiddleware = require('./middleware/error');
const requireAuthMiddleware = require('./middleware/auth-require');
const userRoute = require('./routes/user');
const healthRoute = require('./routes/health');
const scheduleRoute = require('./routes/schedule');
const meetingRoute = require('./routes/meeting');
const logger = require('./utils/logger');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(authMiddleware);
app.use('/health', healthRoute);
app.use('/user', userRoute);
app.use('/schedule', requireAuthMiddleware, scheduleRoute);
app.use('/meeting', requireAuthMiddleware, meetingRoute);
app.use(errorMiddleware);

let dbConnection;
const server = app.listen(conf.port, async () => {
  dbConnection = await connectDB();
  logger.info(`App listening on port ${conf.port}`);
});

const httpTerminator = createHttpTerminator({ server });
const gracefulShutdown = async (signal) => {
  logger.info(`Received ${signal}. Closing server...`);

  try {
    if (dbConnection) {
      await dbConnection.close();
      logger.info('Database connection closed.');
    }

    await httpTerminator.terminate();
    logger.info('HTTP connections closed.');
    process.exit(0);
  } catch (err) {
    logger.error('Error shutting down server:', err);
    process.exit(1);
  }
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
