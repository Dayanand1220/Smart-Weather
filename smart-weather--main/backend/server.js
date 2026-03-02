require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const databaseService = require('./services/databaseService');
const weatherRoutes = require('./routes/weather');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Verify API key exists
if (!process.env.OPENWEATHER_API_KEY) {
  console.error('❌ OPENWEATHER_API_KEY is not set in environment variables');
  console.error('Please create a .env file with your OpenWeatherMap API key');
  process.exit(1);
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes (must come before static files)
app.use('/api/auth', authRoutes);
app.use('/api', weatherRoutes);

// Health check endpoint
app.get('/health', async (req, res) => {
  const dbStatus = databaseService.getConnectionStatus();
  
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    components: {
      database: dbStatus ? 'connected' : 'disconnected',
      api: 'operational'
    }
  });
});

// Serve React build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.json({ 
      message: 'API Server Running',
      note: 'Run React dev server with: cd frontend && npm start'
    });
  });
}

// Initialize database and start server
async function startServer() {
  try {
    // Initialize database connection
    await databaseService.initialize();
    
    // Start server
    app.listen(PORT, () => {
      console.log(`\n🚀 Server running on http://localhost:${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🌤️  Weather API: http://localhost:${PORT}/api/weather/:city\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing server...');
  await databaseService.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('\nSIGINT received, closing server...');
  await databaseService.close();
  process.exit(0);
});

startServer();
