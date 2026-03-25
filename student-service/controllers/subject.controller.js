const { validationResult } = require('express-validator');
const Subject = require('../models/subject.model');

// GET /api/subjects
exports.getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find().sort({ name: 1 });
    res.json({ success: true, subjects });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/subjects/:id
exports.getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) {
      return res.status(404).json({ success: false, message: 'Matière non trouvée' });
    }
    res.json({ success: true, subject });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/subjects
exports.createSubject = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    const subject = await Subject.create(req.body);
    res.status(201).json({ success: true, message: 'Matière créée avec succès', subject });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ success: false, message: 'Code de matière déjà existant' });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/subjects/:id
exports.updateSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });
    if (!subject) {
      return res.status(404).json({ success: false, message: 'Matière non trouvée' });
    }
    res.json({ success: true, message: 'Matière mise à jour', subject });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/subjects/:id
exports.deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);
    if (!subject) {
      return res.status(404).json({ success: false, message: 'Matière non trouvée' });
    }
    res.json({ success: true, message: 'Matière supprimée avec succès' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
