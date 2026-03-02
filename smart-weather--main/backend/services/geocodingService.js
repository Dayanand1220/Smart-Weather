const NodeCache = require('node-cache');

class GeocodingService {
  constructor() {
    this.apiKey = process.env.OPENWEATHER_API_KEY;
    this.baseUrl = 'http://api.openweathermap.org/geo/1.0';
    this.cache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour
  }

  /**
   * Search for cities by name with autocomplete
   * @param {string} query - City name query (partial or full)
   * @param {number} limit - Maximum number of results (default: 5)
   * @returns {Promise<Array>} Array of city suggestions
   */
  async searchCities(query, limit = 5) {
    if (!query || query.trim().length < 2) {
      return [];
    }

    // Check cache first
    const cacheKey = `geocode_${query.toLowerCase()}_${limit}`;
    const cachedData = this.cache.get(cacheKey);
    
    if (cachedData) {
      console.log(`Cache hit for geocoding: ${query}`);
      return cachedData;
    }

    try {
      const url = `${this.baseUrl}/direct?q=${encodeURIComponent(query)}&limit=${limit}&appid=${this.apiKey}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        console.error(`Geocoding API error: ${response.status}`);
        return [];
      }

      const data = await response.json();
      
      // Transform to our format
      const suggestions = data.map(city => ({
        city_name: city.name,
        country: city.country,
        state: city.state || null,
        lat: city.lat,
        lon: city.lon,
        // Create a display name for better UX
        display_name: this.formatDisplayName(city)
      }));

      // Remove duplicates based on city_name and country
      const uniqueSuggestions = this.removeDuplicates(suggestions);

      // Cache the results
      this.cache.set(cacheKey, uniqueSuggestions);
      
      return uniqueSuggestions;
    } catch (error) {
      console.error('Geocoding service error:', error.message);
      return [];
    }
  }

  /**
   * Format display name for city
   * @param {Object} city - City object from API
   * @returns {string} Formatted display name
   */
  formatDisplayName(city) {
    let displayName = city.name;
    
    if (city.state) {
      displayName += `, ${city.state}`;
    }
    
    displayName += `, ${city.country}`;
    
    return displayName;
  }

  /**
   * Remove duplicate cities
   * @param {Array} cities - Array of city objects
   * @returns {Array} Array without duplicates
   */
  removeDuplicates(cities) {
    const seen = new Set();
    return cities.filter(city => {
      const key = `${city.city_name}_${city.country}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  /**
   * Get city by exact coordinates (for reverse geocoding)
   * @param {number} lat - Latitude
   * @param {number} lon - Longitude
   * @returns {Promise<Object>} City information
   */
  async getCityByCoordinates(lat, lon) {
    try {
      const url = `${this.baseUrl}/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${this.apiKey}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      
      if (data.length > 0) {
        const city = data[0];
        return {
          city_name: city.name,
          country: city.country,
          state: city.state || null,
          display_name: this.formatDisplayName(city)
        };
      }
      
      return null;
    } catch (error) {
      console.error('Reverse geocoding error:', error.message);
      return null;
    }
  }
}

module.exports = new GeocodingService();
