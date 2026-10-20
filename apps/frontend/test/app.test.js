const test = require('node:test');
const assert = require('node:assert/strict');
const { once } = require('node:events');

const { app } = require('../src/server');

test('GET /health returns the frontend health status', async (t) => {
  const server = app.listen(0, '127.0.0.1');
  await once(server, 'listening');

  t.after(() => {
    server.closeAllConnections();
    server.close();
  });

  const address = server.address();
  const response = await fetch(`http://127.0.0.1:${address.port}/health`);

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    status: 'UP',
    service: 'frontend',
  });
});

test('GET / serves the frontend homepage', async (t) => {
  const server = app.listen(0, '127.0.0.1');
  await once(server, 'listening');

  t.after(() => {
    server.closeAllConnections();
    server.close();
  });

  const address = server.address();
  const response = await fetch(`http://127.0.0.1:${address.port}/`);

  assert.equal(response.status, 200);
  assert.match(await response.text(), /<title>DevOps Practice<\/title>/);
});
