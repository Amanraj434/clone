const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
  femaleInitiated: { type: Boolean, default: false },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
  }
}, { timestamps: true });

module.exports = mongoose.model('Match', matchSchema);
