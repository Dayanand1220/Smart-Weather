
# Smart Weather Forecasting Web Application

A modern, full-stack weather forecasting application built with **React** and **Bootstrap**. Get real-time weather information with a beautiful, responsive interface featuring dark/light themes and automatic search history tracking.

> 🎨 **Built with React 18 + Bootstrap 5 for a polished, professional UI**

## ✨ Features

### 🎨 Modern UI/UX
- **React + Bootstrap**: Professional, polished interface
- **Beautiful Weather Cards**: Animated cards with hover effects
- **Dark/Light Theme**: Smooth theme transitions with persistent preferences
- **Responsive Design**: Perfect on mobile, tablet, and desktop
- **Weather Icons**: Dynamic icons from React Icons library

### 🌤️ Weather Data
- Real-time weather information by city name
- Comprehensive metrics:
  - 🌡️ Temperature (°C)
  - 💧 Humidity percentage
  - 💨 Wind speed
  - 🌫️ Air Quality Index with color coding
  - 🔽 Atmospheric pressure
  - 🌅 Sunrise and sunset times
  - ☁️ Weather description

### 🔐 Authentication & Security
- 👤 User Registration & Login
- 🔑 JWT Token-based Authentication
- 🔒 Secure Password Hashing (bcrypt)
- ❓ Password Reset via Security Questions
- 👥 User-specific Favorite Cities

### ⚡ Performance & Features
- 💾 Search history storage in PostgreSQL
- 🚀 API response caching (10 minutes)
- 🛡️ Comprehensive error handling
- ♿ Accessibility-friendly
- 🎯 User-friendly error messages

See [FEATURES.md](FEATURES.md) for detailed feature documentation.

## Tech Stack

- **Frontend**: React 18, React Bootstrap, Bootstrap 5
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **External API**: OpenWeatherMap API
- **Testing**: Jest (backend), React Testing Library (frontend)

## 📖 Documentation

- **[QUICK_START_AUTH.md](QUICK_START_AUTH.md)** - 🆕 Authentication Quick Start
- **[AUTHENTICATION_GUIDE.md](AUTHENTICATION_GUIDE.md)** - 🆕 Complete Auth Documentation
- **[GETTING_STARTED.md](GETTING_STARTED.md)** - Quick 5-minute setup guide
- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Detailed installation instructions
- **[FEATURES.md](FEATURES.md)** - Complete feature documentation
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System architecture and data flow
- **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Project overview and statistics
- **[WHY_REACT_BOOTSTRAP.md](WHY_REACT_BOOTSTRAP.md)** - Why we chose React + Bootstrap
- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Common issues and solutions

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn package manager
- OpenWeatherMap API key ([Get one here](https://openweathermap.org/api))

> 💡 **New to this?** Check out [GETTING_STARTED.md](GETTING_STARTED.md) for a beginner-friendly guide!

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd smart-weather-app
```

### 2. Install dependencies

Install backend dependencies:
```bash
npm install
```

Install frontend dependencies:
```bash
cd frontend
npm install
cd ..
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit the `.env` file with your credentials:

```env
# OpenWeatherMap API Configuration
OPENWEATHER_API_KEY=your_api_key_here

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/weather_app
# Or use individual parameters:
DB_HOST=localhost
DB_PORT=5432
DB_NAME=weather_app
DB_USER=your_username
DB_PASSWORD=your_password

# Server Configuration
PORT=3000
NODE_ENV=development
```

### 4. Set up the database

First, create the database in PostgreSQL:

```bash
psql -U postgres
CREATE DATABASE weather_app;
\q
```

Then run the setup script:

```bash
node backend/scripts/setupDatabase.js
```

## Running the Application

### Development Mode

You need to run both the backend and frontend servers:

**Option 1: Run both servers concurrently (recommended)**
```bash
npm run dev:all
```

**Option 2: Run servers separately**

Terminal 1 - Backend:
```bash
npm run dev
```

Terminal 2 - Frontend:
```bash
npm run client
```

The backend API will run on `http://localhost:3000`
The React frontend will run on `http://localhost:3001` (or next available port)

### Production Mode

First, build the React app:
```bash
npm run client:build
```

Then start the server:
```bash
NODE_ENV=production npm start
```

The application will be available at `http://localhost:3000`

## API Endpoints

### Weather Endpoints

- **GET** `/api/weather/:city` - Get weather data for a specific city
  - Parameters: `city` (string) - City name
  - Response: Weather data object

- **GET** `/api/history` - Get search history
  - Query params: `limit` (default: 50), `offset` (default: 0)
  - Response: Array of search history records

### Health Check

- **GET** `/health` - Check server and database status

## Testing

### Run Backend Tests

```bash
npm test
```

### Run Tests with Coverage

```bash
npm test -- --coverage
```

### Run Frontend Tests (Selenium)

```bash
npm run test:frontend
```

## Project Structure

```
smart-weather-app/
├── backend/
│   ├── migrations/          # Database migration scripts
│   ├── repositories/        # Data access layer
│   ├── routes/             # API route handlers
│   ├── scripts/            # Utility scripts
│   ├── services/           # Business logic
│   └── server.js           # Express server setup
├── frontend/
│   ├── public/             # Static files
│   │   └── index.html     # HTML template
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── Header.js
│   │   │   ├── SearchBar.js
│   │   │   ├── WeatherCard.js
│   │   │   └── ErrorAlert.js
│   │   ├── services/      # API services
│   │   │   └── weatherService.js
│   │   ├── App.js         # Main App component
│   │   ├── App.css        # App styles
│   │   ├── index.js       # React entry point
│   │   └── index.css      # Global styles
│   └── package.json       # Frontend dependencies
├── tests/                 # Test files
│   ├── backend/          # Backend tests
│   └── frontend/         # Frontend tests
├── .env.example          # Environment variables template
├── .gitignore           # Git ignore rules
├── jest.config.js       # Jest configuration
├── package.json         # Root dependencies
└── README.md           # This file
```

## Usage

1. Start both servers (backend and frontend)
2. Open your browser and navigate to `http://localhost:3001` (development) or `http://localhost:3000` (production)
3. Enter a city name in the search box
4. Click "Search" or press Enter
5. View the beautiful weather card with all weather details
6. Toggle between dark and light themes using the theme button in the header
7. Your search history is automatically saved to the database

## Features Showcase

- **Modern UI**: Built with React and Bootstrap for a polished, professional look
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **Dark/Light Theme**: Smooth theme transitions with persistent preferences
- **Real-time Data**: Live weather information from OpenWeatherMap
- **Beautiful Icons**: Weather-specific icons using React Icons library
- **Smooth Animations**: Card animations and hover effects for better UX
- **Error Handling**: User-friendly error messages with auto-dismiss

## Error Handling

The application handles various error scenarios:

- Invalid city names
- Network connection issues
- API rate limiting
- Database connection failures
- Invalid API keys

All errors are displayed with user-friendly messages.

## Performance Features

- **API Response Caching**: Weather data is cached for 10 minutes per city to reduce API calls
- **Connection Pooling**: PostgreSQL connection pool for efficient database operations
- **Graceful Degradation**: Application continues to work even if database is unavailable

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

ISC

## Quick Reference

### Important Files
- `.env` - Environment configuration (create from `.env.example`)
- `backend/server.js` - Express server
- `frontend/src/App.js` - Main React component
- `backend/services/weatherService.js` - Weather API integration
- `SETUP_GUIDE.md` - Detailed setup instructions
- `FEATURES.md` - Complete feature documentation

### Useful Commands
```bash
# Quick setup
setup.bat          # Windows
./setup.sh         # Mac/Linux

# Development
npm run dev:all    # Run both servers
npm run dev        # Backend only
npm run client     # Frontend only

# Production
npm run client:build
NODE_ENV=production npm start

# Database
node backend/scripts/setupDatabase.js

# Testing
npm test           # Backend tests
cd frontend && npm test  # Frontend tests
```

## Acknowledgments

- Weather data provided by [OpenWeatherMap](https://openweathermap.org/)
- UI components from [React Bootstrap](https://react-bootstrap.github.io/)
- Icons from [React Icons](https://react-icons.github.io/react-icons/)
- Styling framework: [Bootstrap 5](https://getbootstrap.com/)
=======

