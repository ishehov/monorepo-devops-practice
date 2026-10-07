const express = require('express');
const path = require('path');

const app = express();

const PORT = Number(process.env.PORT || 8080);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    service: 'frontend',
  });
});

app.listen(PORT, () => {
  console.log(`Frontend listening on port ${PORT}`);
});