const express = require('express');
const { body } = require('express-validator');
const {
  register,
  login,
  getMe,
  changePassword,
  verifyToken,
} = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

// Validation register
const registerValidation = [
  body('name').trim().notEmpty().withMessage('Le nom est requis'),
  body('email').isEmail().withMessage('Email invalide'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Minimum 6 caractères'),
  body('role')
    .optional()
    .isIn(['admin', 'teacher', 'student'])
    .withMessage('Rôle invalide'),
];

// Validation login
const loginValidation = [
  body('email').isEmail().withMessage('Email invalide'),
  body('password').notEmpty().withMessage('Mot de passe requis'),
];

// Routes publiques
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/verify-token', verifyToken); // Pour les autres microservices

// Routes protégées
router.get('/me', protect, getMe);
router.put('/change-password', protect, changePassword);

module.exports = router;
