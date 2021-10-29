import express from 'express';

let frontend = express();
let path = require('path');
let port = 4000;

frontend.use(
  '/assets',
  express.static(path.join(__dirname, '..', 'build', 'assets')),
);

frontend.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});

frontend.listen(port, () => {
  console.log(`[Server] Successfully starts at http://localhost:${port}`);
});
