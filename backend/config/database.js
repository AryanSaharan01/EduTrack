const { Pool } = require('pg');
require('dotenv').config();

// NeonDB requires SSL connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // Required for NeonDB
    },
    max: parseInt(process.env.DB_POOL_SIZE) || 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000, // Increased timeout for cloud DB
});

// Set search path to lms schema for all connections
pool.on('connect', (client) => {
    client.query(`SET search_path TO ${process.env.DB_SCHEMA || 'lms'}, public`)
        .catch(err => console.error('Error setting search_path:', err));
});

// Test connection on startup
pool.connect((err, client, release) => {
    if (err) {
        console.error('❌ Database connection failed:', err.message);
        console.error('Check your DATABASE_URL in .env file');
        console.error('Make sure it includes ?sslmode=require at the end');
    } else {
        console.log('✅ Database connected successfully (NeonDB)');
        // Test if schema exists
        client.query(`SELECT schema_name FROM information_schema.schemata WHERE schema_name = $1`, [process.env.DB_SCHEMA || 'lms'])
            .then(result => {
                if (result.rows.length === 0) {
                    console.warn(`⚠️  Warning: Schema '${process.env.DB_SCHEMA || 'lms'}' does not exist!`);
                    console.warn('Please run your schema.sql file on NeonDB first.');
                    console.warn('You can do this via Neon SQL Editor or psql command line.');
                } else {
                    console.log(`✅ Schema '${process.env.DB_SCHEMA || 'lms'}' found`);
                }
            })
            .catch(err => console.error('Error checking schema:', err))
            .finally(() => release());
    }
});

// Handle pool errors
pool.on('error', (err) => {
    console.error('❌ Unexpected database pool error:', err);
});

module.exports = pool;
