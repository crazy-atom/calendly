const express = require('express');

const createSchedule = require('../services/create-schedule');
const getSchedule = require('../services/get-schedule');
const getSlots = require('../services/get-slots');

const schedule = express.Router();

schedule.post('/', createSchedule);
schedule.get('/', getSchedule);
schedule.get('/:scheduleId/slots', getSlots);

module.exports = schedule;
