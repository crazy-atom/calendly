const { TZDate } = require('@date-fns/tz');
const fns = require('date-fns');

const C = require('../constants');

const ScheduleModel = require('../models/scheduleModel');

function createTzDate(str, timeZone) {
  const dateObj = new Date(str);
  const year = dateObj.getUTCFullYear();
  const month = dateObj.getUTCMonth();
  const date = dateObj.getUTCDate();
  return new TZDate(year, month, date, timeZone);
}

async function fetchSchedule(scheduleId) {
  const schedule = await ScheduleModel.findById(scheduleId).exec();
  if (!schedule) {
    return null;
  }
  schedule.startTime = createTzDate(schedule.startTime, schedule.timeZone);
  schedule.endTime = createTzDate(schedule.endTime, schedule.timeZone);
  return schedule;
}

function isOverlap(start1, end1, start2, end2) {
  return fns.areIntervalsOverlapping(
    { start: start1, end: end1 },
    { start: start2, end: end2 },
  );
}

function getDayStart(startTime, scheduler) {
  const diff = Math.floor((startTime - scheduler.startTime) / C.time.ms.DAY);
  return fns.addDays(scheduler.startTime, diff);
}

function getNewRule(day, rule) {
  return {
    startTime: fns.addMilliseconds(day, rule.slotStartTime),
    endTime: fns.addMilliseconds(day, rule.slotEndTime),
  };
}

function toDate(tzDate) {
  return new Date(fns.getTime(tzDate));
}

module.exports = {
  createTzDate,
  fetchSchedule,
  isOverlap,
  getDayStart,
  getNewRule,
  toDate,
};
