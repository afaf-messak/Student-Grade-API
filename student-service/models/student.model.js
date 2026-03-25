const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Le prénom est requis'],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, 'Le nom est requis'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "L'email est requis"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Format d'email invalide"],
  },
  dateOfBirth: {
    type: Date,
  },
  enrollmentNumber: {
    type: String,
    unique: true,
  },
  filiere: {
    type: String,
    trim: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

// Auto-generate enrollment number
studentSchema.pre('save', async function (next) {
  if (!this.enrollmentNumber) {
    const count = await mongoose.model('Student').countDocuments();
    this.enrollmentNumber = `ETU-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

// Virtual: full name
studentSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

studentSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Student', studentSchema);
