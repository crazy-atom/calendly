const fns = require('date-fns');

const {
  createTzDate,
  fetchSchedule,
  isOverlap,
  getDayStart,
  getNewRule,
  toDate,
} = require('../utils/common');

const MeetingModel = require('../models/meetingModel');

function getStartAndEndTime(req) {
  const startTime = createTzDate(req.body.startDate, req.body.timeZone);
  const endTime = fns.addDays(startTime, 1);
  return { startTime, endTime };
}

function fillRuleSlots(schedule, rule, startTime, endTime) {
  const slots = [];
  let slotStart = fns.max([rule.startTime, startTime]);

  while (fns.isBefore(slotStart, fns.min([rule.endTime, endTime]))) {
    const slotEnd = fns.addMilliseconds(slotStart, schedule.duration);
    if (fns.isAfter(slotEnd, rule.endTime)) break;

    slots.push({ start: slotStart, end: slotEnd });
    slotStart = fns.addMilliseconds(slotStart, schedule.stride);
  }
  return slots;
}

function computeSlotsForRule(schedule, day, rule, startTime, endTime) {
  const newRule = getNewRule(day, rule);
  if (!isOverlap(newRule.startTime, newRule.endTime, startTime, endTime)) return [];
  return fillRuleSlots(schedule, newRule, startTime, endTime);
}

function iterateDayRules(schedule, day, rules, startTime, endTime) {
  return rules.flatMap((rule) => computeSlotsForRule(schedule, day, rule, startTime, endTime));
}

function iterateDays(startTime, endTime, schedule) {
  const availableSlots = [];

  let currentDay = getDayStart(startTime, schedule);
  while (fns.isBefore(currentDay, endTime)) {
    const dailyRules = schedule.rules[fns.getDay(currentDay)];
    if (!dailyRules?.length) {
      currentDay = fns.addDays(currentDay, 1);
      continue;
    }
    const daySlots = iterateDayRules(schedule, currentDay, dailyRules, startTime, endTime);
    availableSlots.push(...daySlots);
    currentDay = fns.addDays(currentDay, 1);
  }
  return availableSlots;
}

function computeSlots(schedule, startTime, endTime) {
  if (!isOverlap(schedule.startTime, schedule.endTime, startTime, endTime)) return [];
  return iterateDays(startTime, endTime, schedule);
}

async function fetchMeetings(schedule, slots) {
  if (!slots.length) return [];

  const diff = schedule.startBuffer + schedule.endBuffer + schedule.duration;
  const sTime = toDate(fns.subMilliseconds(slots[0].start, diff));
  const eTime = toDate(fns.addMilliseconds(slots[slots.length - 1].end, diff));

  return MeetingModel.find(
    {
      hostId: schedule.userId.toString(),
      startTime: { $lte: eTime },
      endTime: { $gte: sTime },
    },
  ).sort({ startTime: 1, endTime: 1 })
    .exec();
}

function isAfterOrEqual(date, toCompare) {
  return fns.isAfter(date, toCompare) || fns.isEqual(date, toCompare);
}

function isBeforeOrEqual(date, toCompare) {
  return fns.isBefore(date, toCompare) || fns.isEqual(date, toCompare);
}

function getBufferedTimes(meeting, scheduler) {
  return {
    start: fns.subMilliseconds(meeting.startTime, scheduler.startBuffer),
    end: fns.addMilliseconds(meeting.endTime, scheduler.endBuffer),
  };
}

function filterConflictingSlots(slots, meetings, schedule) {
  const filtered = [];
  let meetingIndex = 0; // Pointer for meetings
  for (const slot of slots) {
    while (
      meetingIndex < meetings.length
      && isAfterOrEqual(slot.start, getBufferedTimes(meetings[meetingIndex], schedule).end)
    ) {
      meetingIndex += 1;
    }

    if (
      meetingIndex >= meetings.length
      || isBeforeOrEqual(slot.end, getBufferedTimes(meetings[meetingIndex], schedule).start)
    ) {
      filtered.push(slot);
    }
  }
  return filtered;
}

function fetchMeetingsForCurUser(slots, req) {
  if (!slots.length) return [];
  const sTime = toDate(slots[0].start);
  const eTime = toDate(slots[slots.length - 1].end);
  return MeetingModel.find({
    hostId: req.userId,
    startTime: { $lte: eTime },
    endTime: { $gte: sTime },
  }).exec();
}

function setOverlapInSlots(slots, meetings) {
  let i = 0;
  let j = 0;
  while (i < slots.length && j < meetings.length) {
    if (isAfterOrEqual(slots[i].start, meetings[j].endTime)) j += 1;
    else if (isBeforeOrEqual(slots[i].end, meetings[j].startTime)) i += 1;
    else {
      slots[i].overlap = true;
      i += 1;
    }
  }
}

async function addOverlapToSlots(slots, req) {
  const meetings = await fetchMeetingsForCurUser(slots, req);
  setOverlapInSlots(slots, meetings);
}

async function fetchMeetingsAndFilterSlots(schedule, slots, req) {
  const meetings = await fetchMeetings(schedule, slots);
  const filtered = filterConflictingSlots(slots, meetings, schedule);
  await addOverlapToSlots(filtered, req);
  return filtered;
}

async function getFinalSlots(schedule, startTime, endTime, req) {
  const slots = computeSlots(schedule, startTime, endTime);
  return fetchMeetingsAndFilterSlots(
    schedule,
    slots,
    req,
  );
}

async function getSlots(req, res) {
  const { scheduleId } = req.params;

  try {
    const schedule = await fetchSchedule(scheduleId);
    if (!schedule) {
      return res.status(404).json({ success: false, error: 'Schedule not found' });
    }
    const { startTime, endTime } = getStartAndEndTime(req);
    const slots = await getFinalSlots(schedule, startTime, endTime, req);
    return res.status(200).json({ success: true, data: slots });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'An error occurred while fetching slots' });
  }
}

module.exports = getSlots;
