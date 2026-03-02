-- Create search_history table
CREATE TABLE IF NOT EXISTS search_history (
    id SERIAL PRIMARY KEY,
    city_name VARCHAR(255) NOT NULL,
    temperature DECIMAL(5,2) NOT NULL,
    humidity INTEGER NOT NULL,
    searched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_searched_at ON search_history(searched_at DESC);
CREATE INDEX IF NOT EXISTS idx_city_name ON search_history(city_name);
