const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const studentController = require('../controllers/student.controller');
const protect = require('../middleware/auth.middleware');

const studentValidation = [
  body('firstName').notEmpty().withMessage('Le prénom est requis'),
  body('lastName').notEmpty().withMessage('Le nom est requis'),
  body('email').isEmail().withMessage('Email invalide'),
];

router.use(protect);

router.get('/',    studentController.getAllStudents);
router.get('/:id', studentController.getStudentById);
router.post('/',   studentValidation, studentController.createStudent);
router.put('/:id', studentValidation, studentController.updateStudent);
router.delete('/:id', studentController.deleteStudent);

module.exports = router;
