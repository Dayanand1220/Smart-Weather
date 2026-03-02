const databaseService = require('../services/databaseService');

class SearchHistoryRepository {
  async insertSearch(weatherData) {
    if (!databaseService.getConnectionStatus()) {
      console.warn('Database not connected, skipping search history insert');
      return null;
    }

    try {
      const query = `
        INSERT INTO search_history (
          city_name, 
          temperature, 
          humidity, 
          wind_speed, 
          pressure, 
          aqi, 
          sunrise, 
          sunset, 
          description, 
          weather_icon,
          searched_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
        RETURNING *
      `;
      
      const values = [
        weatherData.cityName,
        weatherData.temperature,
        weatherData.humidity,
        weatherData.windSpeed,
        weatherData.pressure,
        weatherData.aqi,
        weatherData.sunrise,
        weatherData.sunset,
        weatherData.description,
        weatherData.icon
      ];
      
      const result = await databaseService.query(query, values);
      console.log(`✓ Saved search history for ${weatherData.cityName}`);
      
      return result.rows[0];
    } catch (error) {
      console.error('Error inserting search history:', error.message);
      // Don't throw - graceful degradation
      return null;
    }
  }

  async getSearchHistory(limit = 50, offset = 0) {
    if (!databaseService.getConnectionStatus()) {
      console.warn('Database not connected, returning empty search history');
      return [];
    }

    try {
      const query = `
        SELECT 
          id, 
          city_name, 
          temperature, 
          humidity, 
          wind_speed, 
          pressure, 
          aqi, 
          sunrise, 
          sunset, 
          description, 
          weather_icon,
          searched_at
        FROM search_history
        ORDER BY searched_at DESC
        LIMIT $1 OFFSET $2
      `;
      
      const values = [limit, offset];
      const result = await databaseService.query(query, values);
      
      return result.rows.map(row => ({
        id: row.id,
        cityName: row.city_name,
        temperature: parseFloat(row.temperature),
        humidity: row.humidity,
        windSpeed: parseFloat(row.wind_speed),
        pressure: row.pressure,
        aqi: row.aqi,
        sunrise: row.sunrise ? row.sunrise.toISOString() : null,
        sunset: row.sunset ? row.sunset.toISOString() : null,
        description: row.description,
        icon: row.weather_icon,
        searchedAt: row.searched_at.toISOString()
      }));
    } catch (error) {
      console.error('Error retrieving search history:', error.message);
      return [];
    }
  }
}

module.exports = new SearchHistoryRepository();
