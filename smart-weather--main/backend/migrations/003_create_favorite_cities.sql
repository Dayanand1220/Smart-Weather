-- Create favorite_cities table
CREATE TABLE IF NOT EXISTS favorite_cities (
    id SERIAL PRIMARY KEY,
    city_name VARCHAR(255) NOT NULL UNIQUE,
    country_code VARCHAR(10),
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_checked TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_favorite_city_name ON favorite_cities(city_name);

-- Add comment
COMMENT ON TABLE favorite_cities IS 'Stores user favorite cities for quick access';
