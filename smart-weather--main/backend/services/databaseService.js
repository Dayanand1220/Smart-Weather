const { Pool } = require('pg');

class DatabaseService {
  constructor() {
    this.pool = null;
    this.isConnected = false;
  }

  async initialize() {
    try {
      // Create connection pool
      this.pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        // Fallback to individual parameters if DATABASE_URL not provided
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        database: process.env.DB_NAME || 'weather_app',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      });

      // Test connection
      const client = await this.pool.connect();
      console.log('✓ Database connected successfully');
      client.release();
      this.isConnected = true;
    } catch (error) {
      console.error('✗ Database connection failed:', error.message);
      console.warn('⚠ Application will continue without database features');
      this.isConnected = false;
    }
  }

  async query(text, params) {
    if (!this.isConnected || !this.pool) {
      throw new Error('Database not connected');
    }
    
    try {
      const result = await this.pool.query(text, params);
      return result;
    } catch (error) {
      console.error('Database query error:', error.message);
      throw error;
    }
  }

  async close() {
    if (this.pool) {
      await this.pool.end();
      this.isConnected = false;
      console.log('Database connection closed');
    }
  }

  getConnectionStatus() {
    return this.isConnected;
  }
}

// Export singleton instance
module.exports = new DatabaseService();
