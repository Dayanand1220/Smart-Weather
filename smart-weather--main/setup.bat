@echo off
echo 🚀 Setting up Smart Weather App...
echo.

REM Install backend dependencies
echo 📦 Installing backend dependencies...
call npm install

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
cd frontend
call npm install
cd ..

echo.
echo ✅ Setup complete!
echo.
echo Next steps:
echo 1. Create a .env file with your credentials (see .env.example)
echo 2. Set up the database: node backend/scripts/setupDatabase.js
echo 3. Run the app: npm run dev:all
echo.
pause
