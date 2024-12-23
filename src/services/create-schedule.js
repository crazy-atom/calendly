const ScheduleModel = require('../models/scheduleModel');
const logger = require('../utils/logger');

function getScheduleObject(req) {
  const {
    name,
    type,
    startTime,
    endTime,
    startBuffer,
    endBuffer,
    duration,
    stride,
    rules,
    timeZone,
  } = req.body;

  if (!(name && type && startTime && endTime && duration && rules && timeZone)) {
    throw new Error('Missing required fields in the request body.');
  }

  return {
    name,
    userId: req.userId,
    type,
    startTime: new Date(startTime),
    endTime: new Date(endTime),
    startBuffer: parseInt(startBuffer, 10),
    endBuffer: parseInt(endBuffer, 10),
    duration: parseInt(duration, 10),
    stride: parseInt(stride, 10),
    rules,
    timeZone,
  };
}

async function createSchedule(req, res) {
  const scheduleDoc = getScheduleObject(req);
  const schedule = await ScheduleModel.create(scheduleDoc);
  return res.status(201).json({ success: true, schedule });
}

module.exports = createSchedule;
