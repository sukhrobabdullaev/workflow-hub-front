const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error if connection takes longer than 2 seconds
});

// Handle pool errors
pool.on('error', err => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Test connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error acquiring client', err.stack);
    return;
  }
  console.log('✅ Connected to PostgreSQL database');
  release();
});

module.exports = pool;
