import axios from 'axios';
import { getToken } from './authService';

const API_BASE_URL = '/api';

// Add auth token to all requests
axios.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getWeatherByCity = async (cityName) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/weather/${encodeURIComponent(cityName)}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      // Server responded with error
      const errorMessage = error.response?.data?.error?.message || 'Failed to fetch weather data';
      throw new Error(errorMessage);
    } else if (error.request) {
      // Network error
      throw new Error('Unable to connect to the server. Please check your internet connection.');
    } else {
      throw new Error('An unexpected error occurred. Please try again.');
    }
  }
};

export const getSearchHistory = async (limit = 50, offset = 0) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/history`, {
      params: { limit, offset }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching search history:', error);
    return { data: [], pagination: { limit, offset, count: 0 } };
  }
};

export const getFavorites = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/favorites`);
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return [];
  }
};

export const addFavorite = async (cityName, countryCode = null) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/favorites`, {
      cityName,
      countryCode
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error?.message || 'Failed to add favorite');
  }
};

export const removeFavorite = async (cityName) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/favorites/${encodeURIComponent(cityName)}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error?.message || 'Failed to remove favorite');
  }
};

export const checkIsFavorite = async (cityName) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/favorites/check/${encodeURIComponent(cityName)}`);
    return response.data.isFavorite;
  } catch (error) {
    console.error('Error checking favorite:', error);
    return false;
  }
};
