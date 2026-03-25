const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

// Générer un JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// @POST /api/auth/register
const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Cet email est déjà utilisé.',
      });
    }

    const user = await User.create({ name, email, password, role });
    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: 'Compte créé avec succès.',
      token,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur.',
      error: error.message,
    });
  }
};

// @POST /api/auth/login
const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect.',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect.',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Compte désactivé. Contactez un administrateur.',
      });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: 'Connexion réussie.',
      token,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur.',
      error: error.message,
    });
  }
};

// @GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur.',
    });
  }
};

// @PUT /api/auth/change-password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Mot de passe actuel incorrect.',
      });
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Mot de passe mis à jour avec succès.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur.',
    });
  }
};

// @POST /api/auth/verify-token  (utilisé par les autres microservices)
const verifyToken = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ success: false, message: 'Token requis.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, message: 'Token invalide.' });
    }

    return res.status(200).json({
      success: true,
      valid: true,
      user,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      valid: false,
      message: 'Token invalide ou expiré.',
    });
  }
};

module.exports = { register, login, getMe, changePassword, verifyToken };
