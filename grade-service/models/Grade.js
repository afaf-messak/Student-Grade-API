const mongoose = require('mongoose');

const GradeSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, required: true },
  subjectId: { type: mongoose.Schema.Types.ObjectId, required: true },
  grade:     { type: Number, required: true, min: 0, max: 20 },
  semester:  { type: String, enum: ['S1', 'S2'], required: true }
}, { timestamps: true });

module.exports = mongoose.model('Grade', GradeSchema);
