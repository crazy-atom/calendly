const express = require('express');

const createMeeting = require('../services/create-meeting');
const cancelMeeting = require('../services/cancel-meeting');

const meeting = express.Router();

meeting.post('/', createMeeting);
meeting.delete('/:meetingId', cancelMeeting);

module.exports = meeting;
