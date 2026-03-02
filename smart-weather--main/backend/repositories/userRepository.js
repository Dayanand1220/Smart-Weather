const databaseService = require('../services/databaseService');

class UserRepository {
  async createUser(username, email, passwordHash, securityQuestion, securityAnswerHash) {
    const query = `
      INSERT INTO users (username, email, password_hash, security_question, security_answer_hash)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, username, email, created_at
    `;
    
    const result = await databaseService.query(query, [
      username,
      email,
      passwordHash,
      securityQuestion,
      securityAnswerHash
    ]);
    
    return result.rows[0];
  }

  async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await databaseService.query(query, [email]);
    return result.rows[0];
  }

  async findByUsername(username) {
    const query = 'SELECT * FROM users WHERE username = $1';
    const result = await databaseService.query(query, [username]);
    return result.rows[0];
  }

  async findById(id) {
    const query = 'SELECT id, username, email, created_at FROM users WHERE id = $1';
    const result = await databaseService.query(query, [id]);
    return result.rows[0];
  }

  async updatePassword(email, newPasswordHash) {
    const query = `
      UPDATE users 
      SET password_hash = $1, updated_at = CURRENT_TIMESTAMP
      WHERE email = $2
      RETURNING id, username, email
    `;
    
    const result = await databaseService.query(query, [newPasswordHash, email]);
    return result.rows[0];
  }

  async getSecurityQuestion(email) {
    const query = 'SELECT security_question FROM users WHERE email = $1';
    const result = await databaseService.query(query, [email]);
    return result.rows[0];
  }

  async verifySecurityAnswer(email, securityAnswerHash) {
    const query = 'SELECT security_answer_hash FROM users WHERE email = $1';
    const result = await databaseService.query(query, [email]);
    
    if (!result.rows[0]) {
      return false;
    }
    
    return result.rows[0].security_answer_hash === securityAnswerHash;
  }
}

module.exports = new UserRepository();
