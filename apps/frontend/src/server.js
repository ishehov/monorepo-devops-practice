const express = require('express');
const path = require('path');
const http = require('node:http');

const app = express();

const PORT = Number(process.env.PORT || 8080);
const HOST = process.env.HOST || '0.0.0.0';
const API_HOST = process.env.API_HOST || '127.0.0.1';
const API_PORT = Number(process.env.API_PORT || 3000);

// Forward API requests to the API gateway.
app.use('/api', (req, res) => {
  const proxyReq = http.request(
    {
      hostname: API_HOST,
      port: API_PORT,
      path: req.originalUrl,
      method: req.method,
      headers: {
        ...req.headers,
        host: `${API_HOST}:${API_PORT}`,
      },
    },
    (proxyRes) => {
      res.writeHead(proxyRes.statusCode || 502, proxyRes.headers);
      proxyRes.pipe(res);
    },
  );

  proxyReq.on('error', (error) => {
    console.error('API proxy failed:', error.message);

    if (!res.headersSent) {
      res.status(502).json({ error: 'API gateway unavailable' });
    } else {
      res.destroy(error);
    }
  });

  req.pipe(proxyReq);
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    service: 'frontend',
  });
});

app.listen(PORT, HOST, () => {
  console.log(`Frontend listening on ${HOST}:${PORT}`);
});