const NodeCache = require('node-cache');

class WeatherService {
  constructor() {
    this.apiKey = process.env.OPENWEATHER_API_KEY;
    this.baseUrl = 'https://api.openweathermap.org/data/2.5';
    this.cache = new NodeCache({ stdTTL: 600 }); // 10 minutes cache
  }

  async getWeatherByCity(cityName) {
    // Check cache first
    const cacheKey = `weather_${cityName.toLowerCase()}`;
    const cachedData = this.cache.get(cacheKey);
    
    if (cachedData) {
      console.log(`Cache hit for ${cityName}`);
      return cachedData;
    }

    try {
      // Fetch current weather data
      const weatherUrl = `${this.baseUrl}/weather?q=${encodeURIComponent(cityName)}&appid=${this.apiKey}&units=metric`;
      const weatherResponse = await fetch(weatherUrl);
      
      if (!weatherResponse.ok) {
        // This will throw a specific API error, which will be caught below
        return this.handleApiError(weatherResponse);
      }

      const weatherData = await weatherResponse.json();

      // Fetch air quality data
      const { lat, lon } = weatherData.coord;
      const aqiUrl = `${this.baseUrl}/air_pollution?lat=${lat}&lon=${lon}&appid=${this.apiKey}`;
      const aqiResponse = await fetch(aqiUrl);
      
      let aqi = null;
      if (aqiResponse.ok) {
        const aqiData = await aqiResponse.json();
        aqi = aqiData.list[0]?.main?.aqi || null;
      }

      // Fetch 5-day forecast data
      const forecastUrl = `${this.baseUrl}/forecast?q=${encodeURIComponent(cityName)}&appid=${this.apiKey}&units=metric`;
      const forecastResponse = await fetch(forecastUrl);
      
      let forecast = [];
      if (forecastResponse.ok) {
        const forecastData = await forecastResponse.json();
        forecast = this.transformForecastData(forecastData);
      }

      // Transform to application model
      const result = this.transformWeatherData(weatherData, aqi, forecast);
      
      // Cache the result
      this.cache.set(cacheKey, result);
      
      return result;
    } catch (error) {
      console.error('Weather service error:', error.message);
      // Re-throw specific API errors, otherwise wrap in NETWORK_ERROR
      if (error.code && (error.code === 'CITY_NOT_FOUND' || error.code === 'INVALID_API_KEY' || error.code === 'RATE_LIMIT' || error.code === 'API_ERROR')) {
        throw error;
      } else {
        throw {
          code: 'NETWORK_ERROR',
          message: 'Unable to fetch weather data. Please check your internet connection.',
          details: error.message
        };
      }
    }
  }

  transformWeatherData(weatherData, aqi, forecast = []) {
    return {
      cityName: weatherData.name,
      temperature: Math.round(weatherData.main.temp * 10) / 10,
      humidity: weatherData.main.humidity,
      windSpeed: weatherData.wind.speed,
      pressure: weatherData.main.pressure,
      aqi: aqi,
      sunrise: new Date(weatherData.sys.sunrise * 1000).toISOString(),
      sunset: new Date(weatherData.sys.sunset * 1000).toISOString(),
      description: weatherData.weather[0]?.description || 'N/A',
      icon: weatherData.weather[0]?.icon || '01d',
      lat: weatherData.coord.lat,
      lon: weatherData.coord.lon,
      forecast: forecast
    };
  }

  transformForecastData(forecastData) {
    // Group forecast by day and get one forecast per day (at noon)
    const dailyForecasts = {};
    
    forecastData.list.forEach(item => {
      const date = new Date(item.dt * 1000);
      const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD
      const hour = date.getHours();
      
      // Get forecast around noon (12:00) for each day
      if (!dailyForecasts[dateKey] || Math.abs(hour - 12) < Math.abs(dailyForecasts[dateKey].hour - 12)) {
        dailyForecasts[dateKey] = {
          date: dateKey,
          hour: hour,
          temp: Math.round(item.main.temp * 10) / 10,
          tempMin: Math.round(item.main.temp_min * 10) / 10,
          tempMax: Math.round(item.main.temp_max * 10) / 10,
          description: item.weather[0]?.description || 'N/A',
          icon: item.weather[0]?.icon || '01d',
          humidity: item.main.humidity,
          windSpeed: item.wind.speed,
          pop: Math.round((item.pop || 0) * 100) // Probability of precipitation
        };
      }
    });
    
    // Convert to array and take first 5 days
    return Object.values(dailyForecasts).slice(0, 5);
  }

  handleApiError(response) {
    const status = response.status;
    
    switch (status) {
      case 401:
        console.error('Invalid API key');
        throw {
          code: 'INVALID_API_KEY',
          message: 'Server configuration error. Please contact support.',
          details: 'Invalid OpenWeatherMap API key'
        };
      
      case 404:
        throw {
          code: 'CITY_NOT_FOUND',
          message: 'City not found. Please check the spelling and try again.',
          details: 'City not found in OpenWeatherMap database'
        };
      
      case 429:
        throw {
          code: 'RATE_LIMIT',
          message: 'Too many requests. Please wait a moment and try again.',
          details: 'OpenWeatherMap API rate limit exceeded'
        };
      
      default:
        throw {
          code: 'API_ERROR',
          message: 'Unable to fetch weather data. Please try again later.',
          details: `API returned status ${status}`
        };
    }
  }
}

module.exports = new WeatherService();
