const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  provider: {
    type: Number,
    required: true,
  },
  read: {
    type: Boolean,
    required: true,
    default: false,
  },
  employee: {
    type: Number,
    required: true,
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Notification', NotificationSchema);