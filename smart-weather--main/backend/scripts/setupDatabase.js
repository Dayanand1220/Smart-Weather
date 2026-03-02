require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

async function setupDatabase() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        database: process.env.DB_NAME || 'weather_app',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
    });

    try {
        console.log('Connecting to database...');
        await client.connect();
        console.log('✓ Connected to database');

        // Read and run all migration files
        const migrationsDir = path.join(__dirname, '../migrations');
        const migrationFiles = fs.readdirSync(migrationsDir).sort();

        console.log('Running migrations...');
        for (const file of migrationFiles) {
            if (file.endsWith('.sql')) {
                console.log(`  - Running ${file}...`);
                const migrationPath = path.join(migrationsDir, file);
                const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
                await client.query(migrationSQL);
                console.log(`  ✓ ${file} completed`);
            }
        }

        console.log('\n✅ Database setup complete!');
    } catch (error) {
        console.error('❌ Database setup failed:', error.message);
        process.exit(1);
    } finally {
        await client.end();
    }
}

setupDatabase();
