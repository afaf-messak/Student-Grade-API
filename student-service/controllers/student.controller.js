const { validationResult } = require('express-validator');
const Student = require('../models/student.model');

// GET /api/students
exports.getAllStudents = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, filiere, isActive } = req.query;

    const filter = {};
    if (search) {
      filter.$or = [
        { firstName: new RegExp(search, 'i') },
        { lastName:  new RegExp(search, 'i') },
        { email:     new RegExp(search, 'i') },
        { enrollmentNumber: new RegExp(search, 'i') },
      ];
    }
    if (filiere)   filter.filiere  = filiere;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const skip  = (page - 1) * limit;
    const total = await Student.countDocuments(filter);
    const students = await Student.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      students,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/students/:id
exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Étudiant non trouvé' });
    }
    res.json({ success: true, student });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/students
exports.createStudent = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const student = await Student.create(req.body);
    res.status(201).json({ success: true, message: 'Étudiant créé avec succès', student });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ success: false, message: 'Email déjà utilisé' });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/students/:id
exports.updateStudent = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({ success: false, message: 'Étudiant non trouvé' });
    }
    res.json({ success: true, message: 'Étudiant mis à jour', student });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/students/:id
exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Étudiant non trouvé' });
    }
    res.json({ success: true, message: 'Étudiant supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
