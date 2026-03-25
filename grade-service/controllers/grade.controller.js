const { validationResult } = require('express-validator');
const axios = require('axios');
const Grade = require('../models/grade.model');

const STUDENT_SERVICE = process.env.STUDENT_SERVICE_URL || 'http://student-service:3002';

// Helper: fetch student & subject info to cache in grade doc
const fetchMetadata = async (studentId, subjectId, token) => {
  const headers = { Authorization: `Bearer ${token}` };
  const meta = {};
  try {
    const [stuRes, subRes] = await Promise.all([
      axios.get(`${STUDENT_SERVICE}/api/students/${studentId}`, { headers }),
      axios.get(`${STUDENT_SERVICE}/api/subjects/${subjectId}`,  { headers }),
    ]);
    const s = stuRes.data.student;
    const sub = subRes.data.subject;
    meta.studentName  = `${s.firstName} ${s.lastName}`;
    meta.subjectName  = sub.name;
    meta.subjectCode  = sub.code;
    meta.coefficient  = sub.coefficient || 1;
  } catch (_) { /* use provided values if service unavailable */ }
  return meta;
};

// GET /api/grades
exports.getAllGrades = async (req, res) => {
  try {
    const { studentId, subjectId, semestre, anneeAcademique } = req.query;
    const filter = {};
    if (studentId)      filter.studentId      = studentId;
    if (subjectId)      filter.subjectId      = subjectId;
    if (semestre)       filter.semestre       = semestre;
    if (anneeAcademique) filter.anneeAcademique = anneeAcademique;

    const grades = await Grade.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: grades.length, grades });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/grades/:id
exports.getGradeById = async (req, res) => {
  try {
    const grade = await Grade.findById(req.params.id);
    if (!grade) return res.status(404).json({ success: false, message: 'Note non trouvée' });
    res.json({ success: true, grade });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/grades
exports.createGrade = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const token = req.headers.authorization?.split(' ')[1];
    const meta  = await fetchMetadata(req.body.studentId, req.body.subjectId, token);

    const grade = await Grade.create({ ...req.body, ...meta });
    res.status(201).json({ success: true, message: 'Note ajoutée avec succès', grade });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Une note existe déjà pour cet étudiant, cette matière et ce semestre',
      });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/grades/:id
exports.updateGrade = async (req, res) => {
  try {
    const existing = await Grade.findById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: 'Note non trouvée' });

    Object.assign(existing, req.body);
    await existing.save(); // triggers pre-save hook to recalculate noteFinal
    res.json({ success: true, message: 'Note mise à jour', grade: existing });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/grades/:id
exports.deleteGrade = async (req, res) => {
  try {
    const grade = await Grade.findByIdAndDelete(req.params.id);
    if (!grade) return res.status(404).json({ success: false, message: 'Note non trouvée' });
    res.json({ success: true, message: 'Note supprimée avec succès' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/grades/bulletin/:studentId — bulletin de notes complet
exports.getBulletin = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { semestre, anneeAcademique } = req.query;

    const filter = { studentId };
    if (semestre)        filter.semestre        = semestre;
    if (anneeAcademique) filter.anneeAcademique = anneeAcademique;

    const grades = await Grade.find(filter).sort({ subjectCode: 1 });

    if (grades.length === 0) {
      return res.status(404).json({ success: false, message: 'Aucune note trouvée pour cet étudiant' });
    }

    // Compute weighted average
    let totalPoints = 0;
    let totalCoeff  = 0;
    grades.forEach(g => {
      if (g.noteFinal !== undefined) {
        totalPoints += g.noteFinal * (g.coefficient || 1);
        totalCoeff  += (g.coefficient || 1);
      }
    });

    const moyenne = totalCoeff > 0
      ? parseFloat((totalPoints / totalCoeff).toFixed(2))
      : null;

    let mention = '';
    if (moyenne !== null) {
      if      (moyenne >= 16) mention = 'Très Bien';
      else if (moyenne >= 14) mention = 'Bien';
      else if (moyenne >= 12) mention = 'Assez Bien';
      else if (moyenne >= 10) mention = 'Passable';
      else                    mention = 'Ajourné';
    }

    res.json({
      success: true,
      bulletin: {
        studentId,
        studentName:     grades[0]?.studentName || '',
        semestre:        semestre || 'Tous',
        anneeAcademique: anneeAcademique || 'Toutes',
        notes: grades.map(g => ({
          subjectCode:  g.subjectCode,
          subjectName:  g.subjectName,
          coefficient:  g.coefficient,
          noteCC:       g.noteCC,
          noteExam:     g.noteExam,
          noteFinal:    g.noteFinal,
          appreciation: g.appreciation,
        })),
        moyenne,
        mention,
        admis: moyenne !== null && moyenne >= 10,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
