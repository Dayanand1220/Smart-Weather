-- Add more weather details to search_history table
ALTER TABLE search_history 
ADD COLUMN IF NOT EXISTS wind_speed DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS pressure INTEGER,
ADD COLUMN IF NOT EXISTS aqi INTEGER,
ADD COLUMN IF NOT EXISTS sunrise TIMESTAMP,
ADD COLUMN IF NOT EXISTS sunset TIMESTAMP,
ADD COLUMN IF NOT EXISTS description VARCHAR(255),
ADD COLUMN IF NOT EXISTS weather_icon VARCHAR(50);

-- Add comment to table
COMMENT ON TABLE search_history IS 'Stores complete weather search history with all details';
