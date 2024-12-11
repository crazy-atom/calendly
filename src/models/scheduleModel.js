const mongoose = require('mongoose');

const SlotSchema = new mongoose.Schema({
  slotStartTime: {
    type: Number,
    required: true,
  },
  slotEndTime: {
    type: Number,
    required: true,
  },
});

const RulesSchema = new mongoose.Schema({
  0: [SlotSchema],
  1: [SlotSchema],
  2: [SlotSchema],
  3: [SlotSchema],
  4: [SlotSchema],
  5: [SlotSchema],
  6: [SlotSchema],
});

const ScheduleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  startBuffer: {
    type: Number,
    required: true,
  },
  endBuffer: {
    type: Number,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  stride: {
    type: Number,
    required: true,
  },
  timeZone: {
    type: String,
    required: true,
  },
  rules: {
    type: RulesSchema,
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Schedule', ScheduleSchema);
