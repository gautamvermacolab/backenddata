const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 180 } // 3 minutes (180 seconds) mein automatically delete ho jayega
});

module.exports = mongoose.model('Otp', otpSchema);