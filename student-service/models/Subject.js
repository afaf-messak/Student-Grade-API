const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  coefficient: { type: Number, default: 1 }
}, { timestamps: true });

module.exports = mongoose.model('Subject', SubjectSchema);
