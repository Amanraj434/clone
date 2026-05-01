const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    match: [/.+@bmsit\.in$/, 'Must use a @bmsit.in email address']
  },
  password: { type: String, required: true },
  gender: { type: String, enum: ['male', 'female', 'other'], required: true },
  branch: { type: String },
  year: { type: Number },
  interests: [{ type: String }],
  photos: [{ type: String }],
  mode: { type: String, enum: ['dating', 'bff', 'bizz'], default: 'dating' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
