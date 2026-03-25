const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName:  { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  birthDate: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Student', StudentSchema);
