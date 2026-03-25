const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: [true, "L'ID de l'étudiant est requis"],
    index: true,
  },
  subjectId: {
    type: String,
    required: [true, "L'ID de la matière est requis"],
    index: true,
  },
  // Cached info for bulletin display (avoid cross-service calls on reads)
  studentName: { type: String },
  subjectName: { type: String },
  subjectCode: { type: String },
  coefficient:  { type: Number, default: 1 },

  // Grade values
  noteCC:    { type: Number, min: 0, max: 20 },   // contrôle continu
  noteExam:  { type: Number, min: 0, max: 20 },   // examen final
  noteFinal: { type: Number, min: 0, max: 20 },   // auto-calculated

  semestre: {
    type: String,
    enum: ['S1', 'S2', 'S3', 'S4'],
    required: true,
  },
  anneeAcademique: {
    type: String,
    required: true,
    match: [/^\d{4}-\d{4}$/, "Format invalide, ex: 2024-2025"],
  },
  appreciation: { type: String },
}, { timestamps: true });

// Auto-calculate noteFinal (40% CC + 60% Exam)
gradeSchema.pre('save', function (next) {
  if (this.noteCC !== undefined && this.noteExam !== undefined) {
    this.noteFinal = parseFloat((this.noteCC * 0.4 + this.noteExam * 0.6).toFixed(2));
  } else if (this.noteExam !== undefined) {
    this.noteFinal = this.noteExam;
  } else if (this.noteCC !== undefined) {
    this.noteFinal = this.noteCC;
  }

  // Set appreciation
  if (this.noteFinal !== undefined) {
    if      (this.noteFinal >= 16) this.appreciation = 'Très Bien';
    else if (this.noteFinal >= 14) this.appreciation = 'Bien';
    else if (this.noteFinal >= 12) this.appreciation = 'Assez Bien';
    else if (this.noteFinal >= 10) this.appreciation = 'Passable';
    else                           this.appreciation = 'Insuffisant';
  }
  next();
});

// Unique constraint: one grade per student+subject+semestre+année
gradeSchema.index(
  { studentId: 1, subjectId: 1, semestre: 1, anneeAcademique: 1 },
  { unique: true }
);

module.exports = mongoose.model('Grade', gradeSchema);
