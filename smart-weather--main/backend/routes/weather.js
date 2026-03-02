const express = require('express');
const router = express.Router();
const weatherService = require('../services/weatherService');
const searchHistoryRepository = require('../repositories/searchHistoryRepository');
const favoriteCitiesRepository = require('../repositories/favoriteCitiesRepository');
const geocodingService = require('../services/geocodingService');
const authMiddleware = require('../middleware/authMiddleware');

// GET /api/weather/:city - Fetch weather data for a city
router.get('/weather/:city', async (req, res) => {
  const { city } = req.params;

  // Validate city parameter
  if (!city || city.trim().length === 0) {
    return res.status(400).json({
      error: {
        message: 'City name is required',
        code: 'INVALID_INPUT'
      }
    });
  }

  // Validate city name contains only valid characters
  const validCityPattern = /^[a-zA-Z\s\-]+$/;
  if (!validCityPattern.test(city)) {
    return res.status(400).json({
      error: {
        message: 'City name contains invalid characters',
        code: 'INVALID_INPUT'
      }
    });
  }

  try {
    // Fetch weather data
    const weatherData = await weatherService.getWeatherByCity(city);

    // Save complete weather data to search history (non-blocking, graceful degradation)
    searchHistoryRepository.insertSearch(weatherData)
      .catch(err => console.error('Failed to save search history:', err.message));

    // Return weather data
    res.json(weatherData);
  } catch (error) {
    // Handle different error types
    const statusCode = error.code === 'CITY_NOT_FOUND' ? 404 :
                       error.code === 'RATE_LIMIT' ? 429 :
                       error.code === 'INVALID_API_KEY' ? 500 : 503;

    res.status(statusCode).json({
      error: {
        message: error.message,
        code: error.code,
        ...(process.env.NODE_ENV === 'development' && { details: error.details })
      }
    });
  }
});

// GET /api/history - Retrieve search history
router.get('/history', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;

    const history = await searchHistoryRepository.getSearchHistory(limit, offset);
    
    res.json({
      data: history,
      pagination: {
        limit,
        offset,
        count: history.length
      }
    });
  } catch (error) {
    console.error('Error fetching search history:', error.message);
    res.status(500).json({
      error: {
        message: 'Unable to retrieve search history',
        code: 'DATABASE_ERROR'
      }
    });
  }
});

// GET /api/favorites - Get all favorite cities
router.get('/favorites', authMiddleware, async (req, res) => {
  try {
    const favorites = await favoriteCitiesRepository.getFavorites(req.user.id);
    res.json({ data: favorites });
  } catch (error) {
    console.error('Error fetching favorites:', error.message);
    res.status(500).json({
      error: {
        message: 'Unable to retrieve favorite cities',
        code: 'DATABASE_ERROR'
      }
    });
  }
});

// POST /api/favorites - Add a city to favorites
router.post('/favorites', authMiddleware, async (req, res) => {
  const { cityName, countryCode } = req.body;

  if (!cityName || cityName.trim().length === 0) {
    return res.status(400).json({
      error: {
        message: 'City name is required',
        code: 'INVALID_INPUT'
      }
    });
  }

  try {
    const favorite = await favoriteCitiesRepository.addFavorite(cityName, countryCode, req.user.id);
    res.status(201).json(favorite);
  } catch (error) {
    console.error('Error adding favorite:', error.message);
    res.status(500).json({
      error: {
        message: 'Unable to add favorite city',
        code: 'DATABASE_ERROR'
      }
    });
  }
});

// DELETE /api/favorites/:city - Remove a city from favorites
router.delete('/favorites/:city', authMiddleware, async (req, res) => {
  const { city } = req.params;

  try {
    const removed = await favoriteCitiesRepository.removeFavorite(city, req.user.id);
    if (removed) {
      res.json({ message: 'Favorite removed successfully', data: removed });
    } else {
      res.status(404).json({
        error: {
          message: 'Favorite city not found',
          code: 'NOT_FOUND'
        }
      });
    }
  } catch (error) {
    console.error('Error removing favorite:', error.message);
    res.status(500).json({
      error: {
        message: 'Unable to remove favorite city',
        code: 'DATABASE_ERROR'
      }
    });
  }
});

// GET /api/favorites/check/:city - Check if city is favorite
router.get('/favorites/check/:city', authMiddleware, async (req, res) => {
  const { city } = req.params;

  try {
    const isFavorite = await favoriteCitiesRepository.isFavorite(city, req.user.id);
    res.json({ isFavorite });
  } catch (error) {
    console.error('Error checking favorite:', error.message);
    res.json({ isFavorite: false });
  }
});

// GET /api/autocomplete - Autocomplete city names
router.get('/autocomplete', async (req, res) => {
  const { q, limit } = req.query;

  // Validate query parameter
  if (!q || q.trim().length < 2) {
    return res.json({ suggestions: [] });
  }

  try {
    const limitNum = parseInt(limit) || 5;
    const suggestions = await geocodingService.searchCities(q, limitNum);
    
    res.json({
      query: q,
      suggestions: suggestions
    });
  } catch (error) {
    console.error('Error in autocomplete:', error.message);
    res.status(500).json({
      error: {
        message: 'Unable to fetch city suggestions',
        code: 'AUTOCOMPLETE_ERROR'
      }
    });
  }
});

module.exports = router;
