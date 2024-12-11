const fns = require('date-fns');

const MeetingModel = require('../models/meetingModel');

const {
  fetchSchedule,
  isOverlap,
  getDayStart,
  getNewRule,
  toDate,
} = require('../utils/common');

function getStartAndEndTime(req, schedule) {
  const startTime = new Date(req.body.startTime);
  const endTime = fns.addMilliseconds(startTime, schedule.duration);
  return { startTime, endTime };
}

function isTimeRangeValid(schedule, startTime, endTime) {
  return isOverlap(schedule.startTime, schedule.endTime, startTime, endTime);
}

function isRuleValid(day, rule, startTime, endTime, schedule) {
  const newRule = getNewRule(day, rule);
  if (!isOverlap(newRule.startTime, newRule.endTime, startTime, endTime)) return false;
  return (startTime - newRule.startTime) % schedule.stride === 0;
}

function isDayValid(startTime, endTime, schedule) {
  const day = getDayStart(startTime, schedule);
  const rules = schedule.rules[fns.getDay(day)];
  if (!rules?.length) return false;
  return rules.some((rule) => isRuleValid(day, rule, startTime, endTime, schedule));
}

function fetchConflicts(schedule, startTime, endTime) {
  const diff = schedule.startBuffer + schedule.endBuffer + schedule.duration;
  const sTime = toDate(fns.subMilliseconds(startTime, diff));
  const eTime = toDate(fns.addMilliseconds(endTime, diff));
  return MeetingModel.find(
    {
      hostId: schedule.userId.toString(),
      startTime: { $lte: eTime },
      endTime: { $gte: sTime },
    },
  ).sort({ startTime: 1, endTime: 1 })
    .exec();
}

async function isFreeOfConflicts(schedule, startTime, endTime) {
  const conflicts = await fetchConflicts(schedule, startTime, endTime);
  return !(conflicts && conflicts.length);
}

async function isSlotValid(startTime, endTime, schedule) {
  const isFreeConflicts = await isFreeOfConflicts(schedule, startTime, endTime);
  return (
    isTimeRangeValid(schedule, startTime, endTime)
    && isDayValid(startTime, endTime, schedule)
    && isFreeConflicts
  );
}

function insertMeeting(req, schedule, startTime, endTime) {
  const meetingDoc = {
    scheduleId: schedule.id,
    startTime: toDate(startTime),
    endTime: toDate(endTime),
    guestEmail: req.body.email,
    hostId: schedule.userId,
  };
  return MeetingModel.create(meetingDoc);
}

async function createMeeting(req, res) {
  const scheduleId = req.query.schedule_id;

  const schedule = await fetchSchedule(scheduleId);
  if (!schedule) {
    return res.status(404).json({ success: false, error: 'Schedule not found, cannot fix the meeting' });
  }

  const { startTime, endTime } = getStartAndEndTime(req, schedule);
  const isValid = await isSlotValid(startTime, endTime, schedule);
  if (!isValid) {
    return res.status(400).json({ success: false, error: 'TimeSlot not available' });
  }

  const meeting = await insertMeeting(req, schedule, startTime, endTime);
  return res.status(201).json({ success: true, message: 'Meeting created successfully', meeting });
}

module.exports = createMeeting;
