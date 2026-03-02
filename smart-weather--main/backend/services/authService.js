const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';
const SALT_ROUNDS = 10;

class AuthService {
  async register(username, email, password, securityQuestion, securityAnswer) {
    // Check if user already exists
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const existingUsername = await userRepository.findByUsername(username);
    if (existingUsername) {
      throw new Error('Username already taken');
    }

    // Hash password and security answer
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const securityAnswerHash = await bcrypt.hash(securityAnswer.toLowerCase().trim(), SALT_ROUNDS);

    // Create user
    const user = await userRepository.createUser(
      username,
      email,
      passwordHash,
      securityQuestion,
      securityAnswerHash
    );

    // Generate token
    const token = this.generateToken(user.id);

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      },
      token
    };
  }

  async login(email, password) {
    // Find user
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }

    // Generate token
    const token = this.generateToken(user.id);

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      },
      token
    };
  }

  async getSecurityQuestion(email) {
    const result = await userRepository.getSecurityQuestion(email);
    if (!result) {
      throw new Error('Email not found');
    }
    return result.security_question;
  }

  async resetPassword(email, securityAnswer, newPassword) {
    // Find user
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Email not found');
    }

    // Verify security answer
    const isValidAnswer = await bcrypt.compare(
      securityAnswer.toLowerCase().trim(),
      user.security_answer_hash
    );
    
    if (!isValidAnswer) {
      throw new Error('Incorrect security answer');
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);

    // Update password
    await userRepository.updatePassword(email, newPasswordHash);

    return { message: 'Password reset successful' };
  }

  generateToken(userId) {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  async getUserFromToken(token) {
    const decoded = this.verifyToken(token);
    const user = await userRepository.findById(decoded.userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}

module.exports = new AuthService();
