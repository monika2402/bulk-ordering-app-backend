const { Client } = require('pg');

const { Pool } = require('pg');
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});
module.exports = pool;


// Replace this with your actual Neon connection string
const client = new Client({
  connectionString: 'postgresql://neondb_owner:npg_beDiCOohE16f@ep-calm-snow-a4zat57t-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require',
});

client.connect()
  .then(() => console.log('Connected to the Database!'))
  .catch(err => console.error('Error connecting to the database:', err));

module.exports = client;
