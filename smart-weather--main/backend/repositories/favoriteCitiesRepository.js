const databaseService = require('../services/databaseService');

class FavoriteCitiesRepository {
  async addFavorite(cityName, countryCode = null, userId = null) {
    if (!databaseService.getConnectionStatus()) {
      console.warn('Database not connected, skipping favorite add');
      return null;
    }

    try {
      const query = `
        INSERT INTO favorite_cities (city_name, country_code, user_id, added_at)
        VALUES ($1, $2, $3, NOW())
        ON CONFLICT (city_name, user_id) DO UPDATE 
        SET last_checked = NOW()
        RETURNING *
      `;
      
      const values = [cityName, countryCode, userId];
      const result = await databaseService.query(query, values);
      console.log(`⭐ Added ${cityName} to favorites for user ${userId}`);
      
      return result.rows[0];
    } catch (error) {
      console.error('Error adding favorite:', error.message);
      throw error;
    }
  }

  async removeFavorite(cityName, userId = null) {
    if (!databaseService.getConnectionStatus()) {
      console.warn('Database not connected, skipping favorite remove');
      return null;
    }

    try {
      const query = `
        DELETE FROM favorite_cities
        WHERE city_name = $1 AND user_id = $2
        RETURNING *
      `;
      
      const values = [cityName, userId];
      const result = await databaseService.query(query, values);
      console.log(`💔 Removed ${cityName} from favorites for user ${userId}`);
      
      return result.rows[0];
    } catch (error) {
      console.error('Error removing favorite:', error.message);
      throw error;
    }
  }

  async getFavorites(userId = null) {
    if (!databaseService.getConnectionStatus()) {
      console.warn('Database not connected, returning empty favorites');
      return [];
    }

    try {
      const query = `
        SELECT 
          id, 
          city_name, 
          country_code, 
          added_at,
          last_checked
        FROM favorite_cities
        WHERE user_id = $1
        ORDER BY last_checked DESC
      `;
      
      const result = await databaseService.query(query, [userId]);
      
      return result.rows.map(row => ({
        id: row.id,
        cityName: row.city_name,
        countryCode: row.country_code,
        addedAt: row.added_at.toISOString(),
        lastChecked: row.last_checked.toISOString()
      }));
    } catch (error) {
      console.error('Error retrieving favorites:', error.message);
      return [];
    }
  }

  async isFavorite(cityName, userId = null) {
    if (!databaseService.getConnectionStatus()) {
      return false;
    }

    try {
      const query = `
        SELECT EXISTS(
          SELECT 1 FROM favorite_cities WHERE city_name = $1 AND user_id = $2
        ) as is_favorite
      `;
      
      const values = [cityName, userId];
      const result = await databaseService.query(query, values);
      
      return result.rows[0].is_favorite;
    } catch (error) {
      console.error('Error checking favorite:', error.message);
      return false;
    }
  }
}

module.exports = new FavoriteCitiesRepository();
