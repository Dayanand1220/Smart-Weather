import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import ErrorAlert from './components/ErrorAlert';
import FavoriteCities from './components/FavoriteCities';
import WeatherMap from './components/WeatherMap';
import WeatherForecast from './components/WeatherForecast';
import LoadingSpinner from './components/LoadingSpinner';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import PrivateRoute from './components/PrivateRoute';
import { isAuthenticated } from './services/authService';
import {
  getWeatherByCity,
  getFavorites,
  addFavorite,
  removeFavorite,
  checkIsFavorite
} from './services/weatherService';
import './App.css';

function WeatherApp() {
  const [theme, setTheme] = useState('light'); // 'light' or 'dark'
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);

    loadFavorites();
  }, []);

  useEffect(() => {
    if (weatherData) {
      checkIsFavorite(weatherData.cityName).then(setIsFavorite);
    }
  }, [weatherData]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    const body = document.body;
    body.className = ''; // Clear previous classes
  }, [theme]);

  const loadFavorites = async () => {
    try {
      const favs = await getFavorites();
      setFavorites(favs);
    } catch (err) {
      console.error('Failed to load favorites:', err);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // Removed toggleEveningMode function

  const handleSearch = async (cityName) => {
    setLoading(true);
    setError(null);

    try {
      const data = await getWeatherByCity(cityName);
      setWeatherData(data);
    } catch (err) {
      setError(err?.message || 'Failed to fetch weather data');
      setWeatherData(null);
    }
    finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (cityName) => {
    try {
      if (isFavorite) {
        await removeFavorite(cityName);
        setIsFavorite(false);
        setFavorites(favorites.filter(f => f.cityName !== cityName));
      } else {
        await addFavorite(cityName);
        setIsFavorite(true);
        await loadFavorites();
      }
    } catch (err) {
      setError(err?.message || 'Failed to update favorites');
    }
  };

  const handleSelectFavorite = (cityName) => {
    handleSearch(cityName);
  };

  const handleRemoveFavorite = async (cityName) => {
    try {
      await removeFavorite(cityName);
      setFavorites(favorites.filter(f => f.cityName !== cityName));
      if (weatherData && weatherData.cityName === cityName) {
        setIsFavorite(false);
      }
    } catch (err) {
      setError(err?.message || 'Failed to remove favorite');
    }
  };

  return (
    <div className="App">
      <Header 
        theme={theme} 
        onToggleTheme={toggleTheme} 
      />

      <div className="fade-in-section">
        <Container className="py-5">
          <SearchBar onSearch={handleSearch} loading={loading} />

          {error && (
            <ErrorAlert
              message={error}
              onClose={() => setError(null)}
            />
          )}

          <FavoriteCities
            favorites={favorites}
            onSelectCity={handleSelectFavorite}
            onRemoveFavorite={handleRemoveFavorite}
          />

          {weatherData && (
            <Row className="justify-content-center">
              <Col xl={11}>
                <Row className="g-4">
                  {/* Weather Details - Left Side (60%) */}
                  <Col lg={12} xl={7}>
                    <WeatherCard
                      data={weatherData}
                      isFavorite={isFavorite}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  </Col>
                  
                  {/* Map - Right Side (40%) */}
                  <Col lg={12} xl={5}>
                    <WeatherMap weatherData={weatherData} />
                  </Col>

                  {/* 5-Day Forecast - Full Width */}
                  {weatherData.forecast && weatherData.forecast.length > 0 && (
                    <Col xs={12}>
                      <WeatherForecast forecast={weatherData.forecast} />
                    </Col>
                  )}
                </Row>
              </Col>
            </Row>
          )}
        </Container>
      </div>

      {loading && <LoadingSpinner />} 

      <footer className="footer mt-5 py-4 text-center bg-light">
        <Container>
          <small className="text-muted">
            &copy; 2024 WeatherWise | Smart Weather, Smarter Decisions | Powered by OpenWeatherMap
          </small>
        </Container>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={
          isAuthenticated() ? <Navigate to="/" /> : <Login />
        } />
        <Route path="/register" element={
          isAuthenticated() ? <Navigate to="/" /> : <Register />
        } />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/" element={
          <PrivateRoute>
            <WeatherApp />
          </PrivateRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
