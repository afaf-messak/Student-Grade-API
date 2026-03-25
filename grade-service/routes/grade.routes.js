const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const gradeController = require('../controllers/grade.controller');
const protect = require('../middleware/auth.middleware');

const gradeValidation = [
  body('studentId').notEmpty().withMessage("L'ID de l'étudiant est requis"),
  body('subjectId').notEmpty().withMessage("L'ID de la matière est requis"),
  body('semestre').isIn(['S1', 'S2', 'S3', 'S4']).withMessage('Semestre invalide (S1-S4)'),
  body('anneeAcademique')
    .matches(/^\d{4}-\d{4}$/)
    .withMessage("Format invalide, ex: 2024-2025"),
  body('noteCC').optional().isFloat({ min: 0, max: 20 }).withMessage('Note CC invalide (0-20)'),
  body('noteExam').optional().isFloat({ min: 0, max: 20 }).withMessage('Note Exam invalide (0-20)'),
];

router.use(protect);

// Bulletin must be declared before /:id to avoid conflict
router.get('/bulletin/:studentId', gradeController.getBulletin);

router.get('/',    gradeController.getAllGrades);
router.get('/:id', gradeController.getGradeById);
router.post('/',   gradeValidation, gradeController.createGrade);
router.put('/:id', gradeController.updateGrade);
router.delete('/:id', gradeController.deleteGrade);

module.exports = router;
