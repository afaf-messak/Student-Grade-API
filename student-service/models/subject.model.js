const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom de la matière est requis'],
    trim: true,
    unique: true,
  },
  code: {
    type: String,
    required: [true, 'Le code de la matière est requis'],
    uppercase: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  coefficient: {
    type: Number,
    default: 1,
    min: [1, 'Le coefficient doit être au moins 1'],
  },
  teacher: {
    type: String,
    trim: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Subject', subjectSchema);
