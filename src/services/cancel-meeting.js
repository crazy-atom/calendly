const MeetingModel = require('../models/meetingModel');

async function cancelMeeting(req, res) {
  const { userId } = req;
  const { meetingId } = req.params;

  try {
    const meeting = await MeetingModel.findById(meetingId).exec();
    if (!meeting) {
      return res.status(404).json({
        success: false,
        error: 'Meeting not found',
      });
    }

    if (meeting.hostId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        error: 'You are not authorized to cancel this meeting',
      });
    }

    await MeetingModel.deleteOne({ _id: meetingId }).exec();

    // TODO, send an email to the user or update related schedules
    return res.status(200).json({
      success: true,
      message: 'Meeting cancelled successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'An error occurred while cancelling the meeting',
    });
  }
}

module.exports = cancelMeeting;
