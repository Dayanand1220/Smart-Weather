const express = require('express');
const router = express.Router();
const authService = require('../services/authService');
const authMiddleware = require('../middleware/authMiddleware');

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, securityQuestion, securityAnswer } = req.body;

    // Validation
    if (!username || !email || !password || !securityQuestion || !securityAnswer) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const result = await authService.register(username, email, password, securityQuestion, securityAnswer);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const result = await authService.login(email, password);
    res.json(result);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

// Get security question
router.post('/security-question', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const question = await authService.getSecurityQuestion(email);
    res.json({ securityQuestion: question });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Reset password
router.post('/reset-password', async (req, res) => {
  try {
    const { email, securityAnswer, newPassword } = req.body;

    if (!email || !securityAnswer || !newPassword) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const result = await authService.resetPassword(email, securityAnswer, newPassword);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get current user (protected route)
router.get('/me', authMiddleware, async (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
