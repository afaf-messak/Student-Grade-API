const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const subjectController = require('../controllers/subject.controller');
const protect = require('../middleware/auth.middleware');

const subjectValidation = [
  body('name').notEmpty().withMessage('Le nom de la matière est requis'),
  body('code').notEmpty().withMessage('Le code est requis'),
  body('coefficient').optional().isInt({ min: 1 }).withMessage('Le coefficient doit être >= 1'),
];

router.use(protect);

router.get('/',    subjectController.getAllSubjects);
router.get('/:id', subjectController.getSubjectById);
router.post('/',   subjectValidation, subjectController.createSubject);
router.put('/:id', subjectController.updateSubject);
router.delete('/:id', subjectController.deleteSubject);

module.exports = router;
