const test = require('node:test');
const assert = require('node:assert/strict');
const { once } = require('node:events');

const { app } = require('../src/index');

test('GET /health returns the API health status', async (t) => {
  const server = app.listen(0, '127.0.0.1');
  await once(server, 'listening');

  t.after(() => {
    server.closeAllConnections();
    server.close();
  });

  const address = server.address();
  const response = await fetch(`http://127.0.0.1:${address.port}/health`);

  assert.equal(response.status, 200);
  assert.equal(response.headers.get('access-control-allow-origin'), 'http://localhost:8080');
  assert.deepEqual(await response.json(), {
    status: 'UP',
    service: 'api-gateway',
  });
});

test('OPTIONS requests return a CORS preflight response', async (t) => {
  const server = app.listen(0, '127.0.0.1');
  await once(server, 'listening');

  t.after(() => {
    server.closeAllConnections();
    server.close();
  });

  const address = server.address();
  const response = await fetch(`http://127.0.0.1:${address.port}/api/status`, {
    method: 'OPTIONS',
  });

  assert.equal(response.status, 204);
  assert.equal(response.headers.get('access-control-allow-methods'), 'GET,OPTIONS');
});
