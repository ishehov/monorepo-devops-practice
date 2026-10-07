const express = require('express');
const mysql = require('mysql2/promise');

const app = express();

const PORT = Number(process.env.PORT || 3000);

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:8080';

const DB_HOST = process.env.DB_HOST || 'mysql';
const DB_PORT = Number(process.env.DB_PORT || 3306);
const DB_USER = process.env.DB_USER || 'app_user';
const DB_PASSWORD = process.env.DB_PASSWORD || 'app_password';
const DB_NAME = process.env.DB_NAME || 'app_db';

app.use(express.json());
app.set('trust proxy', true);

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', FRONTEND_ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});

const pool = mysql.createPool({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,

  enableKeepAlive: true,
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    service: 'api-gateway',
  });
});

app.get('/ready', async (req, res) => {
  try {
    await pool.query('SELECT 1');

    res.status(200).json({
      status: 'READY',
      service: 'api-gateway',
    });
  } catch (error) {
    console.error('Database readiness check failed:', error.message);

    res.status(503).json({
      status: 'NOT_READY',
      service: 'api-gateway',
    });
  }
});

app.get('/api/status', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        status,
        message
      FROM system_status
      LIMIT 1
    `);

    if (rows.length === 0) {
      return res.status(404).json({
        error: 'Status record not found',
      });
    }

    res.status(200).json({
      service: 'api-gateway',
      database: 'mysql',
      status: rows[0].status,
      message: rows[0].message,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Database query failed:', error.message);

    res.status(500).json({
      error: 'Failed to query database',
    });
  }
});

const server = app.listen(PORT, () => {
  console.log(`API Gateway listening on port ${PORT}`);
});

async function shutdown(signal) {
  console.log(`${signal} received, shutting down`);

  server.close(async () => {
    try {
      await pool.end();
      console.log('Database pool closed');
      process.exit(0);
    } catch (error) {
      console.error('Failed to close database pool:', error);
      process.exit(1);
    }
  });
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));