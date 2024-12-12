const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    index: true,
  },
  passwordHash: {
    type: String,
    required: true,
    minlength: 10,
  },
}, {
  timestamps: true,
});

const UserModel = mongoose.model('User', userSchema);
module.exports = UserModel;
