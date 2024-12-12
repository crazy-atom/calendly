const ScheduleModel = require('../models/scheduleModel');

async function getSchedule(req, res) {
  const { userId } = req;
  if (!userId) {
    return res.status(400).json({
      success: false,
      message: 'userId must be provided.',
    });
  }

  const schedules = await ScheduleModel.find({ userId }).exec();

  return res.status(200).json({
    success: true,
    data: schedules,
    message: schedules.length
      ? 'Schedules retrieved successfully.'
      : 'No schedules found.',
  });
}

module.exports = getSchedule;
