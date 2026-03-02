-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    security_question VARCHAR(255) NOT NULL,
    security_answer_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- Update favorite_cities to link with users
ALTER TABLE favorite_cities 
ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id) ON DELETE CASCADE;

-- Drop old unique constraint if exists
ALTER TABLE favorite_cities DROP CONSTRAINT IF EXISTS favorite_cities_city_name_key;

-- Create new unique constraint for city_name and user_id combination
ALTER TABLE favorite_cities 
ADD CONSTRAINT favorite_cities_city_name_user_id_key UNIQUE (city_name, user_id);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_favorite_cities_user_id ON favorite_cities(user_id);
