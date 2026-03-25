const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const protect = require('../middleware/auth.middleware');

// Validation rules
const registerValidation = [
  body('name').notEmpty().withMessage('Le nom est requis'),
  body('email').isEmail().withMessage('Email invalide'),
  body('password').isLength({ min: 6 }).withMessage('Mot de passe trop court (min 6 chars)'),
  body('role').optional().isIn(['admin', 'teacher', 'student']).withMessage('Rôle invalide'),
];

const loginValidation = [
  body('email').isEmail().withMessage('Email invalide'),
  body('password').notEmpty().withMessage('Le mot de passe est requis'),
];

// Public routes
router.post('/register', registerValidation, authController.register);
router.post('/login',    loginValidation,    authController.login);
router.post('/verify',                       authController.verifyToken);

// Protected routes
router.get('/me', protect, authController.getMe);

module.exports = router;
